#!/usr/bin/env node
/* ============================================================
   THE CASE — image normaliser.

   Turns any product photo, from any source, into a compartment-
   ready cut-out. The point is that a StockX sneaker, a brand
   press render and a Fragrantica bottle all land in the tray
   looking like siblings.

       raw image (any bg, any size, any source)
         → segment the subject   (rembg, a learned model)
         → keep only the largest object in frame
         → trim to the object's real bounds
         → pad to square, object at OBJECT_RATIO of the frame
         → SIZE x SIZE transparent webp, named <id>.<angle>.webp

   Angles
     Every category has a closed, ordered list of them, and the FIRST is
     canonical — the one the catalogue renders. The vocabulary is duplicated
     below from lib/collections/angles.ts, which is the source of truth. It
     is copied rather than imported because this is a standalone ESM script
     and importing TypeScript would mean adding a build step to the one tool
     whose whole point is not having one. If you change it there, change it
     here.

   Usage
     Batch (preferred). Drop files in
     scripts/incoming/<category>/<id>.<angle>.<ext>:
       npm run normalize

     An unangled scripts/incoming/<category>/<id>.<ext> is treated as the
     category's canonical angle, so anything already staged still works.

     One file:
       npm run normalize -- --category watches --id seiko-skx007 --angle caseback ~/Downloads/back.jpg

     Flags:
       --keep-bg   skip segmentation (source is already transparent)
       --force     overwrite an existing output
       --dry-run   report what would happen, write nothing
   ============================================================ */

import { execFile } from "node:child_process";
import { promisify } from "node:util";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import os from "node:os";
import sharp from "sharp";

const run = promisify(execFile);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const SIZE = 800; // output canvas, px
const OBJECT_RATIO = 0.78; // how much of the frame the object fills
const CATEGORIES = ["watches", "shoes", "perfumes"];

/** Mirror of lib/collections/angles.ts. First entry is canonical. */
const ANGLES = {
    watches: ["dial", "angle", "profile", "caseback"],
    shoes: ["lateral", "medial", "top", "sole"],
    perfumes: ["bottle", "angle", "cap", "box"],
};
const canonical = (category) => ANGLES[category][0];
const SOURCE_EXTS = [".png", ".jpg", ".jpeg", ".webp", ".avif", ".tif", ".tiff"];

const INCOMING = path.join(root, "scripts", "incoming");
const OUT_BASE = path.join(root, "public", "images", "collections");

/* ---- how we reach rembg -------------------------------------------------- */

/** Prefer rembg on PATH; fall back to `uvx`, which runs it in a throwaway
    environment so nothing is installed globally. */
async function findSegmenter() {
    const probe = async (cmd, args) => {
        try {
            await run(cmd, args, { timeout: 20000 });
            return true;
        } catch {
            return false;
        }
    };
    if (await probe("rembg", ["--help"])) return { cmd: "rembg", pre: [] };
    if (await probe("uvx", ["--help"]))
        return { cmd: "uvx", pre: ["--from", "rembg[cli,cpu]", "rembg"] };
    return null;
}

/**
 * Segment every job in one pass.
 *
 * `rembg p <dir> <dir>` loads the model once and walks a folder; spawning
 * `rembg i` per file instead costs a fresh Python start and model load each
 * time (~15s), which turns forty items into half an hour. Sources are staged
 * into a flat temp directory under a key that survives the round trip.
 */
async function segmentAll(seg, jobs) {
    const dir = await fs.mkdtemp(path.join(os.tmpdir(), "case-"));
    const inDir = path.join(dir, "in");
    const outDir = path.join(dir, "out");
    await fs.mkdir(inDir);
    await fs.mkdir(outDir);

    const keys = new Map();
    for (const job of jobs) {
        const key = `${job.category}__${job.id}__${job.angle}`;
        keys.set(key, job);
        await fs.copyFile(
            job.source,
            path.join(inDir, key + path.extname(job.source))
        );
    }

    await run(seg.cmd, [...seg.pre, "p", inDir, outDir], {
        timeout: 60 * 60 * 1000,
        maxBuffer: 1024 * 1024 * 64,
    });

    // rembg writes PNGs named after the input stem.
    const cut = new Map();
    for (const entry of await fs.readdir(outDir)) {
        const key = path.basename(entry, path.extname(entry));
        if (keys.has(key)) cut.set(key, path.join(outDir, entry));
    }
    return { cut, cleanup: () => fs.rm(dir, { recursive: true, force: true }) };
}

/* ---- the image work ------------------------------------------------------ */

/**
 * Keep only the biggest thing in the frame.
 *
 * A photograph of one object usually contains a sliver of the next one along,
 * and the segmenter faithfully cuts that out too. Left alone it widens the
 * bounding box, so the trim-and-pad below shrinks the actual subject to make
 * room for a fragment nobody wanted. Labelling the alpha channel and keeping
 * the largest connected region fixes it at the source.
 */
async function keepLargest(buffer) {
    const { data, info } = await sharp(buffer)
        .ensureAlpha()
        .raw()
        .toBuffer({ resolveWithObject: true });
    const { width: w, height: h, channels } = info;

    const solid = new Uint8Array(w * h);
    for (let i = 0; i < w * h; i++) {
        solid[i] = data[i * channels + 3] > 24 ? 1 : 0;
    }

    const label = new Int32Array(w * h).fill(-1);
    let best = -1;
    let bestArea = 0;
    let next = 0;
    const stack = [];
    for (let start = 0; start < w * h; start++) {
        if (solid[start] !== 1 || label[start] !== -1) continue;
        const id = next++;
        let area = 0;
        stack.push(start);
        label[start] = id;
        while (stack.length) {
            const j = stack.pop();
            area++;
            const jx = j % w;
            const jy = (j / w) | 0;
            if (jx > 0 && solid[j - 1] && label[j - 1] === -1) { label[j - 1] = id; stack.push(j - 1); }
            if (jx < w - 1 && solid[j + 1] && label[j + 1] === -1) { label[j + 1] = id; stack.push(j + 1); }
            if (jy > 0 && solid[j - w] && label[j - w] === -1) { label[j - w] = id; stack.push(j - w); }
            if (jy < h - 1 && solid[j + w] && label[j + w] === -1) { label[j + w] = id; stack.push(j + w); }
        }
        if (area > bestArea) { bestArea = area; best = id; }
    }
    if (best === -1) return buffer;

    const out = Buffer.from(data);
    for (let i = 0; i < w * h; i++) {
        if (label[i] !== best) out[i * channels + 3] = 0;
    }
    return sharp(out, { raw: { width: w, height: h, channels } })
        .png()
        .toBuffer();
}

/**
 * Trim transparent (or near-uniform) edges, then centre the object on a square
 * transparent canvas at a fixed proportion. This is what actually makes
 * different sources agree: every object ends up the same relative size.
 */
async function frame(buffer) {
    const trimmed = await sharp(buffer)
        .ensureAlpha()
        .trim({ threshold: 10 })
        .toBuffer({ resolveWithObject: true })
        .catch(async () => {
            // trim throws when the image is entirely uniform; keep it as-is.
            const buf = await sharp(buffer).ensureAlpha().toBuffer();
            return { data: buf, info: await sharp(buf).metadata() };
        });

    const box = Math.round(SIZE * OBJECT_RATIO);
    const object = await sharp(trimmed.data)
        .resize(box, box, { fit: "inside", withoutEnlargement: false })
        .toBuffer({ resolveWithObject: true });

    return sharp({
        create: {
            width: SIZE,
            height: SIZE,
            channels: 4,
            background: { r: 0, g: 0, b: 0, alpha: 0 },
        },
    })
        .composite([
            {
                input: object.data,
                left: Math.round((SIZE - object.info.width) / 2),
                top: Math.round((SIZE - object.info.height) / 2),
            },
        ])
        .webp({ quality: 90, effort: 5 })
        .toBuffer();
}

function outputPath(category, id, angle) {
    return path.join(OUT_BASE, category, `${id}.${angle}.webp`);
}

async function alreadyExists(category, id, angle) {
    return fs
        .access(outputPath(category, id, angle))
        .then(() => true)
        .catch(() => false);
}

async function normalise({ source, category, id, angle, cutOut, segmented }) {
    const outPath = outputPath(category, id, angle);
    const raw = await fs.readFile(cutOut ?? source);
    const out = await frame(segmented ? await keepLargest(raw) : raw);
    await fs.mkdir(path.dirname(outPath), { recursive: true });
    await fs.writeFile(outPath, out);
    const kb = (out.length / 1024).toFixed(0);
    return {
        rel: path.relative(root, outPath),
        status: `${kb} KB${segmented ? "" : " (background kept)"}`,
    };
}

/* ---- inputs -------------------------------------------------------------- */

async function collectIncoming() {
    const jobs = [];
    for (const category of CATEGORIES) {
        const dir = path.join(INCOMING, category);
        const entries = await fs.readdir(dir).catch(() => []);
        for (const entry of entries) {
            const ext = path.extname(entry).toLowerCase();
            if (!SOURCE_EXTS.includes(ext)) continue;
            const stem = path.basename(entry, ext);
            // <id>.<angle> — or a bare <id>, which means the canonical angle
            // so that anything staged before angles existed still works.
            const dot = stem.lastIndexOf(".");
            const maybeAngle = dot === -1 ? null : stem.slice(dot + 1);
            const known = ANGLES[category].includes(maybeAngle);
            if (dot !== -1 && !known) {
                console.error(
                    `  ${category}/${entry}  UNKNOWN ANGLE "${maybeAngle}" — one of: ${ANGLES[category].join(", ")}`
                );
                continue;
            }
            jobs.push({
                source: path.join(dir, entry),
                category,
                id: known ? stem.slice(0, dot) : stem,
                angle: known ? maybeAngle : canonical(category),
            });
        }
    }
    return jobs;
}

function parseArgs(argv) {
    const flags = new Set(argv.filter((a) => a.startsWith("--")));
    const value = (name) => {
        const i = argv.indexOf(`--${name}`);
        return i === -1 ? undefined : argv[i + 1];
    };
    const positional = argv.filter((a, i) => {
        if (a.startsWith("--")) return false;
        const prev = argv[i - 1];
        return !(prev === "--category" || prev === "--id" || prev === "--angle");
    });
    return {
        category: value("category"),
        id: value("id"),
        angle: value("angle"),
        file: positional[0],
        keepBg: flags.has("--keep-bg"),
        force: flags.has("--force"),
        dryRun: flags.has("--dry-run"),
    };
}

/* ---- main ---------------------------------------------------------------- */

async function main() {
    const args = parseArgs(process.argv.slice(2));

    let jobs;
    if (args.file) {
        if (!args.category || !args.id) {
            console.error(
                "Single-file mode needs both --category and --id.\n" +
                    "  npm run normalize -- --category watches --id seiko-skx007 ~/Downloads/skx.jpg"
            );
            process.exit(1);
        }
        if (!CATEGORIES.includes(args.category)) {
            console.error(
                `Unknown category "${args.category}". One of: ${CATEGORIES.join(", ")}`
            );
            process.exit(1);
        }
        const angle = args.angle ?? canonical(args.category);
        if (!ANGLES[args.category].includes(angle)) {
            console.error(
                `Unknown angle "${angle}" for ${args.category}. One of: ${ANGLES[args.category].join(", ")}`
            );
            process.exit(1);
        }
        jobs = [
            { source: args.file, category: args.category, id: args.id, angle },
        ];
    } else {
        jobs = await collectIncoming();
        if (jobs.length === 0) {
            console.log(
                `Nothing to do.\n\n` +
                    `Drop files in scripts/incoming/<category>/<id>.<angle>.<ext> and run\n` +
                    `again, naming each after the item id in lib/collections/<category>.ts.\n` +
                    `  e.g. scripts/incoming/watches/seiko-skx007.caseback.jpg\n\n` +
                    `Angles — the first is the one the catalogue renders:\n` +
                    Object.entries(ANGLES)
                        .map(([c, a]) => `  ${c.padEnd(9)} ${a.join(", ")}`)
                        .join("\n") +
                    `\n\nOr normalise one file directly:\n` +
                    `  npm run normalize -- --category watches --id seiko-skx007 --angle caseback ~/back.jpg`
            );
            return;
        }
    }

    // Filter before segmenting — no point paying for images we would skip.
    const kept = [];
    for (const job of jobs) {
        if (
            !args.force &&
            (await alreadyExists(job.category, job.id, job.angle))
        ) {
            console.log(
                `  ${path.relative(root, outputPath(job.category, job.id, job.angle))}  skipped (exists — use --force)`
            );
            continue;
        }
        if (args.dryRun) {
            console.log(
                `  ${path.relative(root, outputPath(job.category, job.id, job.angle))}  would write`
            );
            continue;
        }
        kept.push(job);
    }
    jobs = kept;
    if (jobs.length === 0) return;

    const seg = args.keepBg ? null : await findSegmenter();
    if (!args.keepBg && !seg) {
        console.warn(
            "! No background remover found — images will keep their backgrounds.\n" +
                "  Install uv (https://docs.astral.sh/uv/) and this script will use\n" +
                "  `uvx rembg` automatically, with nothing installed globally.\n" +
                "  Pass --keep-bg to silence this when sources are already transparent.\n"
        );
    } else if (seg) {
        console.log(`Segmenting with: ${seg.cmd}${seg.pre.length ? " " + seg.pre.join(" ") : ""}`);
    }

    let cut = new Map();
    let cleanup;
    if (seg && jobs.length > 0) {
        console.log(
            `Segmenting ${jobs.length} image${jobs.length === 1 ? "" : "s"} in one pass — ` +
                `the first run downloads the model, so give it a minute…`
        );
        ({ cut, cleanup } = await segmentAll(seg, jobs));
    }

    let failed = 0;
    for (const job of jobs) {
        const key = `${job.category}__${job.id}__${job.angle}`;
        try {
            const { rel, status } = await normalise({
                ...job,
                cutOut: cut.get(key),
                segmented: Boolean(seg && cut.get(key)),
            });
            console.log(`  ${rel}  ${status}`);
        } catch (error) {
            failed++;
            console.error(
                `  ${job.category}/${job.id}.${job.angle}  FAILED — ${error.message}`
            );
        }
    }
    if (cleanup) await cleanup();

    console.log(
        `\n${jobs.length - failed}/${jobs.length} done.` +
            (failed ? ` ${failed} failed.` : "")
    );
    if (failed) process.exitCode = 1;
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});

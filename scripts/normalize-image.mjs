#!/usr/bin/env node
/* ============================================================
   THE CASE — image normaliser.

   Turns any product photo, from any source, into a compartment-
   ready cut-out. The point is that a StockX sneaker, a brand
   press render and a Fragrantica bottle all land in the tray
   looking like siblings.

       raw image (any bg, any size, any source)
         → segment the subject   (rembg, a learned model)
         → trim to the object's real bounds
         → pad to square, object at OBJECT_RATIO of the frame
         → SIZE x SIZE transparent webp, named <id>.webp

   Usage
     Batch (preferred). Drop files in scripts/incoming/<category>/<id>.<ext>:
       npm run normalize

     One file:
       npm run normalize -- --category watches --id seiko-skx007 ~/Downloads/skx.jpg

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
        const key = `${job.category}__${job.id}`;
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

function outputPath(category, id) {
    return path.join(OUT_BASE, category, `${id}.webp`);
}

async function alreadyExists(category, id) {
    return fs
        .access(outputPath(category, id))
        .then(() => true)
        .catch(() => false);
}

async function normalise({ source, category, id, cutOut, segmented }) {
    const outPath = outputPath(category, id);
    const out = await frame(await fs.readFile(cutOut ?? source));
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
            jobs.push({
                source: path.join(dir, entry),
                category,
                id: path.basename(entry, ext),
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
        return !(prev === "--category" || prev === "--id");
    });
    return {
        category: value("category"),
        id: value("id"),
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
        jobs = [{ source: args.file, category: args.category, id: args.id }];
    } else {
        jobs = await collectIncoming();
        if (jobs.length === 0) {
            console.log(
                `Nothing to do.\n\n` +
                    `Drop files in scripts/incoming/<category>/<id>.<ext> and run again,\n` +
                    `naming each file after the item id in lib/collections/<category>.ts.\n` +
                    `  e.g. scripts/incoming/watches/seiko-skx007.jpg\n\n` +
                    `Or normalise one file directly:\n` +
                    `  npm run normalize -- --category watches --id seiko-skx007 ~/Downloads/skx.jpg`
            );
            return;
        }
    }

    // Filter before segmenting — no point paying for images we would skip.
    const kept = [];
    for (const job of jobs) {
        if (!args.force && (await alreadyExists(job.category, job.id))) {
            console.log(
                `  ${path.relative(root, outputPath(job.category, job.id))}  skipped (exists — use --force)`
            );
            continue;
        }
        if (args.dryRun) {
            console.log(
                `  ${path.relative(root, outputPath(job.category, job.id))}  would write`
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
        const key = `${job.category}__${job.id}`;
        try {
            const { rel, status } = await normalise({
                ...job,
                cutOut: cut.get(key),
                segmented: Boolean(seg && cut.get(key)),
            });
            console.log(`  ${rel}  ${status}`);
        } catch (error) {
            failed++;
            console.error(`  ${job.category}/${job.id}  FAILED — ${error.message}`);
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

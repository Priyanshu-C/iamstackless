#!/usr/bin/env node
/* ============================================================
   THE CASE — shot fetcher.

   Reads scripts/shots.json — a manifest of where every non-owner photograph
   came from — downloads each one into scripts/incoming/, and leaves
   `npm run normalize` to do the cutting out and framing.

   The manifest is the provenance record. The case cites its sources for
   prose; there is no reason imagery should be different. Every entry says
   which page the file was taken from, so a year from now you can check that
   the picture on the Samba XLG page is actually a Samba XLG.

       npm run shots            fetch everything missing
       npm run shots -- --force re-fetch even if already staged
       npm run shots -- --check report what would be fetched, download nothing

   Anything that 404s, 403s, redirects to HTML, or arrives too small to be a
   product photograph is reported and skipped. A missing angle renders as a
   labelled blank, which is the honest result — better than a broken file.
   ============================================================ */

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const MANIFEST = path.join(root, "scripts", "shots.json");
const INCOMING = path.join(root, "scripts", "incoming");

/** Some CDNs refuse a bare fetch. This is the same request a browser makes. */
const HEADERS = {
    "user-agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 " +
        "(KHTML, like Gecko) Chrome/126.0 Safari/537.36",
    accept: "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
};

const MIN_BYTES = 6 * 1024; // below this it is a placeholder or a sprite

const EXT = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
    "image/avif": ".avif",
};

async function fetchOne(entry, { force, check }) {
    const { id, category, angle, url } = entry;
    const dir = path.join(INCOMING, category);

    const staged = await fs
        .readdir(dir)
        .then((f) => f.find((n) => n.startsWith(`${id}.${angle}.`)))
        .catch(() => undefined);
    if (staged && !force) return { ...entry, status: "already staged" };
    if (check) return { ...entry, status: "would fetch" };

    let response;
    try {
        response = await fetch(url, { headers: HEADERS, redirect: "follow" });
    } catch (error) {
        return { ...entry, status: `unreachable — ${error.message}` };
    }
    if (!response.ok) {
        return { ...entry, status: `HTTP ${response.status}` };
    }

    const type = (response.headers.get("content-type") ?? "").split(";")[0];
    if (!type.startsWith("image/")) {
        // A CDN that answers a hotlink with its own HTML error page.
        return { ...entry, status: `not an image (${type || "no type"})` };
    }

    const bytes = Buffer.from(await response.arrayBuffer());
    if (bytes.length < MIN_BYTES) {
        return { ...entry, status: `too small (${bytes.length} B)` };
    }

    const ext =
        EXT[type] ?? (path.extname(new URL(url).pathname) || ".jpg");
    await fs.mkdir(dir, { recursive: true });
    const out = path.join(dir, `${id}.${angle}${ext}`);
    await fs.writeFile(out, bytes);
    return {
        ...entry,
        status: `${(bytes.length / 1024).toFixed(0)} KB`,
        file: path.relative(root, out),
    };
}

async function main() {
    const argv = process.argv.slice(2);
    const force = argv.includes("--force");
    const check = argv.includes("--check");

    const manifest = JSON.parse(await fs.readFile(MANIFEST, "utf8"));
    console.log(
        `${manifest.length} shots in the manifest${check ? " (check only)" : ""}\n`
    );

    // Sequential on purpose: a dozen parallel hits on one CDN is the fastest
    // way to get every one of them refused.
    const results = [];
    for (const entry of manifest) {
        const result = await fetchOne(entry, { force, check });
        results.push(result);
        const ok = /KB$/.test(result.status);
        console.log(
            `  ${ok ? " " : "!"} ${result.id}.${result.angle}  ${result.status}`
        );
    }

    const got = results.filter((r) => /KB$/.test(r.status)).length;
    const skipped = results.filter((r) => r.status === "already staged").length;
    const failed = results.length - got - skipped - (check ? results.length : 0);
    console.log(
        `\n${got} fetched, ${skipped} already staged, ${failed} unavailable.` +
            (got ? `\nNow run:  npm run normalize` : "")
    );
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});

#!/usr/bin/env node
/* ============================================================
   THE CASE — contact sheet.

   Lays every shot in a category out on one image, on the room's own ground,
   grouped by angle. The point is to make angle drift visible: if one shoe in
   the `lateral` row points the other way, or is a pair while the rest are
   single, you see it in a second instead of discovering it on the site.

   That failure has already happened once here — every shoe was labelled
   `lateral` during a migration without anyone looking at them, and three of
   seven were pointing the wrong way. This is the check that would have
   caught it.

       npm run sheet                 all categories
       npm run sheet -- watches      one category
       npm run sheet -- --angle dial just that angle, across categories

   Writes to scripts/sheets/<name>.jpg, which is gitignored.
   ============================================================ */

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const IMAGES = path.join(root, "public", "images", "collections");
const OUT = path.join(root, "scripts", "sheets");

const CATEGORIES = ["watches", "shoes", "perfumes"];
/** Mirror of lib/collections/angles.ts — see normalize-image.mjs for why. */
const ANGLES = {
    watches: ["dial", "angle", "profile", "caseback"],
    shoes: ["lateral", "medial", "top", "sole"],
    perfumes: ["bottle", "angle", "cap", "box"],
};

const ROOM = "#e6e2da";
const TILE = 260;
const HEAD = 26;
const COLS = 7;

const label = (text, width, size = 12, fill = "#857c6e") =>
    Buffer.from(
        `<svg width="${width}" height="${HEAD}"><text x="6" y="17" ` +
            `font-family="ui-monospace,monospace" font-size="${size}" ` +
            `fill="${fill}">${text.replace(/&/g, "&amp;").replace(/</g, "&lt;")}</text></svg>`
    );

async function sheetFor(category, onlyAngle) {
    const dir = path.join(IMAGES, category);
    const files = await fs.readdir(dir).catch(() => []);
    const shots = files.filter((f) => f.endsWith(".webp"));
    if (shots.length === 0) return null;

    const angles = ANGLES[category].filter((a) => !onlyAngle || a === onlyAngle);
    const rows = [];
    for (const angle of angles) {
        const matching = shots
            .filter((f) => f.endsWith(`.${angle}.webp`))
            .sort();
        if (matching.length > 0) rows.push({ angle, files: matching });
    }
    if (rows.length === 0) return null;

    // Each angle is a band: a heading, then as many tile-rows as it needs.
    let height = 0;
    for (const row of rows) {
        row.top = height;
        row.lines = Math.ceil(row.files.length / COLS);
        height += HEAD + row.lines * (TILE + HEAD);
    }

    const composites = [];
    for (const row of rows) {
        composites.push({
            input: label(
                `${category.toUpperCase()} · ${row.angle.toUpperCase()} · ${row.files.length}`,
                TILE * COLS,
                15,
                "#17140f"
            ),
            left: 0,
            top: row.top,
        });
        for (let i = 0; i < row.files.length; i++) {
            const x = (i % COLS) * TILE;
            const y = row.top + HEAD + Math.floor(i / COLS) * (TILE + HEAD);
            composites.push({
                input: await sharp(path.join(dir, row.files[i]))
                    .flatten({ background: ROOM })
                    .resize(TILE, TILE, { fit: "contain", background: ROOM })
                    .toBuffer(),
                left: x,
                top: y,
            });
            composites.push({
                input: label(
                    row.files[i].replace(`.${row.angle}.webp`, ""),
                    TILE
                ),
                left: x,
                top: y + TILE,
            });
        }
    }

    const name = onlyAngle ? `${category}-${onlyAngle}` : category;
    const file = path.join(OUT, `${name}.jpg`);
    await fs.mkdir(OUT, { recursive: true });
    await sharp({
        create: {
            width: TILE * COLS,
            height,
            channels: 3,
            background: ROOM,
        },
    })
        .composite(composites)
        .jpeg({ quality: 84 })
        .toFile(file);
    return { file: path.relative(root, file), rows: rows.length };
}

async function main() {
    const argv = process.argv.slice(2);
    const angleAt = argv.indexOf("--angle");
    const onlyAngle = angleAt === -1 ? null : argv[angleAt + 1];
    const wanted = argv.filter(
        (a, i) => !a.startsWith("--") && argv[i - 1] !== "--angle"
    );
    const categories = wanted.length > 0 ? wanted : CATEGORIES;

    for (const category of categories) {
        if (!CATEGORIES.includes(category)) {
            console.error(`Unknown category "${category}".`);
            continue;
        }
        const made = await sheetFor(category, onlyAngle);
        console.log(
            made
                ? `  ${made.file}  (${made.rows} angle${made.rows === 1 ? "" : "s"})`
                : `  ${category}  nothing to lay out`
        );
    }
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});

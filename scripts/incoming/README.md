# Incoming — raw images, before normalising

Drop a raw product photo here as `<category>/<item-id>.<ext>`, matching the
`id` of the item in `lib/collections/<category>.ts`:

    scripts/incoming/watches/seiko-skx007.jpg

Then:

    npm run normalize

Each file becomes `public/images/collections/<category>/<item-id>.webp` —
background removed, object centred at 78% of an 800×800 transparent canvas.

Because every image is re-framed to the same proportion, the source no longer
has to be consistent. A StockX sneaker shot, a brand press render and a
Fragrantica bottle all land in the tray looking like siblings, so sourcing
becomes "find any decent photo" rather than "find one that matches the
other forty".

Raw files in this directory are gitignored — they are working files. The
normalised webp is the artefact that ships.

## Flags

    npm run normalize -- --dry-run    report what would happen, write nothing
    npm run normalize -- --force      overwrite existing output
    npm run normalize -- --keep-bg    skip segmentation (source already transparent)

Single file, without staging it here:

    npm run normalize -- --category watches --id seiko-skx007 ~/Downloads/skx.jpg

## Background removal

Handled by `rembg`, reached through `uvx`, so nothing is installed globally.
The first run downloads the model (~176MB) and takes a minute; after that the
model is cached and the cost is per-batch, not per-image.

If neither `rembg` nor `uvx` is on PATH the script still runs — it just keeps
the original background and says so. Install `uv` (https://docs.astral.sh/uv/)
to get cut-outs.

Segmentation is a learned model, not a colour key, so a watch with a white
dial or a sneaker with a cream midsole survives. Roughly one image in ten
wants a manual touch-up on thin details — a bracelet's gaps, a fine chain.
You will spot those immediately, since the tray shows everything side by side.

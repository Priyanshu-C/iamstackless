Normalised images for the shoes drawer.

Do not add files here by hand. Stage the raw photo in
`scripts/incoming/shoes/<item-id>.<ext>` and run:

    npm run normalize

That writes `<item-id>.webp` here — background removed, object centred at
78% of an 800x800 transparent canvas, so every drawer reads as one set.

The item id must match `lib/collections/shoes.ts`. The data-integrity test
fails the suite if an item points at a file that is not here.

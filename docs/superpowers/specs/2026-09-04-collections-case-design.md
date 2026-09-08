# The Case — a private collections catalogue

**Date:** 2026-09-04
**Status:** Design approved, pending implementation plan
**Scope:** A password-gated `/collections` section of iamstackless.com cataloguing watches, shoes and perfumes.

---

## Purpose

A private wing of the portfolio where Priyanshu catalogues the things he collects, and can return later to see what he owns and why he bought it. Not a store, not a public showcase — a ledger he re-reads.

## Success criteria

- Adding an item is cheap enough that the catalogue is still being updated a year from now.
- Opening a drawer answers "what do I own here" in one screen.
- Every entry answers "why did I buy this" in one line.
- The section reads as another room in the same building as the portfolio, not a bolted-on app.

---

## Decisions

These were settled during brainstorming and are load-bearing. Each records the alternative rejected, so a future reader knows the choice was made rather than defaulted into.

| # | Decision | Rejected alternative |
|---|---|---|
| 1 | **Soft-private.** Content is committed to the public repo; the password is a curtain, not a vault. | A private data source (DB / private repo) with server-side secrecy. |
| 2 | **Category-specific facets only.** No shared cross-category tag vocabulary. | One controlled tag set spanning all categories, enabling "show me every leather thing". |
| 3 | **Ledger depth.** Name, brand, price paid, date acquired, one photo, one line of why. | Field-note depth (a paragraph of why, status, current value) or dossier depth (provenance, servicing). |
| 4 | **Press/product imagery**, downloaded and committed locally. | Own photography (more honest, higher friction) or typography-only entries. |
| 5 | **25–100 items.** Index plus a page per category, with facet filtering inside a category. | A single-page stack (<25) or search + per-item pages (100+). |
| 6 | **Footer link only.** Present but quiet. | Main nav (interrupts the portfolio's primary job) or fully unlisted. |
| 7 | **Uniform compartments.** | Compartment size varying by how often an item is reached for. |
| 8 | **No display serif inside the case.** | Fraunces 900 on item names, matching the rest of the site. |

### `acquired` and `why` are optional

Every other field can be sourced from a product listing. These two cannot —
only Priyanshu knows when he bought something and why, and they are never
invented to fill a gap. Both are therefore optional on `CollectionItem`:

- The ledger renders a missing note as a muted rule, so the blank is visible
  and invites completion rather than reading as a bug.
- Undated items sort to the end of the drawer rather than the top.
- The integrity suite validates each field's shape *when present*, and treats
  absence as legitimate. A blank string is still a failure.

`seq` is nominally acquisition order, but is seeded in the order the items were
supplied when purchase order is unknown. It is renumbered by hand, once.

### Known consequence of decision 2

The original brief mentioned wanting to see how a perfume's notes relate to shoes. Decision 2 rules that out: the categories sit parallel and do not cross-reference. Revisiting this later means adding a shared tag vocabulary to `CollectionItem` and a cross-category browse view — additive, not a rewrite.

---

## Design language

Extracted from a `hallmark study` of shopify.com/editions, adapted to the foundry.

**What was taken:** a neutral room so the objects carry every bit of colour; type reduced to labelling (the largest text on Editions is 24px at weight 400); a persistent bottom index rail instead of a scrollbar as the primary navigation; every object in the spatial scene mirrored by a real labelled button for keyboard and screen-reader parity.

**What was not taken:** the WebGL vitrine; the record-shop metaphor; the non-scrolling single stage (Editions holds exactly nine items, this holds up to a hundred); and the split between `Open` and `Details` — at ledger depth an item has no second surface to open into, so selection has one affordance, not two.

**The conceit.** A printer's type case: a shallow drawer divided by hairlines into compartments, one object per compartment. Three drawers, one per category.

**Macrostructure:** Catalogue (11), leaning Map/Diagram (19). The existing site is Specimen (10), so the collection reads as a different room in the same building.

**Room colour:** `#e6e2da` — the site's `--paper` (`#f2ece1`) with chroma reduced. Continuous with the foundry, recessive enough not to tint product photography.

**Type inside the case:** Space Grotesk only, at 10 / 11 / 13 / 14 / 22 / 40px and a `clamp(28px, 6vw, 38px)` masthead, weights 400–500. Fraunces does not appear inside the case. *(Revised 2026-09-08 — see Revision below. The original 10/11/14/24 scale put the page title in the same muted 11px voice as every other string, which inverted the hierarchy of every page in the section.)*

---

## Architecture

### Routes

```
/collections                 the case — three drawers
/collections/watches
/collections/shoes
/collections/perfumes
```

No per-item routes. At ledger depth an item is one line and five facts; detail expands in place within the drawer.

### The gate

- Single shared password, no username. Stored as `COLLECTIONS_PASSWORD` (Vercel env var, not committed).
- A Server Action compares the submitted value, then sets a cookie carrying an HMAC signature (keyed on `COLLECTIONS_SECRET`) so it cannot be forged. Cookie is `httpOnly`, `secure`, `sameSite: lax`, ~30 day expiry.
- `middleware.ts` verifies the cookie on `/collections/*` and redirects to the unlock screen otherwise.
- Items render in React Server Components — item data never reaches the client bundle for a locked visitor.
- `noindex, nofollow` on the route group, plus a `robots.txt` disallow.

Soft-private means the data is readable on GitHub regardless. The gate exists to keep it off the public site and out of search results, not to make it secret.

### Data

One file per category, matching the existing `lib/content.ts` convention. No MDX, no new dependencies, no build step.

```
lib/collections/types.ts
lib/collections/watches.ts
lib/collections/shoes.ts
lib/collections/perfumes.ts
```

Shared spine:

```ts
type CollectionItem = {
  id: string;                              // stable slug, never reused
  seq: number;                             // acquisition order; renders as №NN
  name: string;
  brand: string;
  acquired: string;                        // "2023-08"
  price: { amount: number; currency: "INR" | "USD" };
  why: string;                             // one line, ~15 words
  image: string;                           // /images/collections/<category>/<id>.webp
};
```

Category facets extend the spine:

- **Watch** — `movement: "automatic" | "quartz" | "manual"`, `caseSize: number` (mm), `reference: string`
- **Shoe** — `size: string`, `material: string`, `colourway: string`
- **Perfume** — `house: string`, `concentration: "EDT" | "EDP" | "parfum"`, `notes: { top: string[]; heart: string[]; base: string[] }`, `volume: number` (ml)

Prices default to INR; `currency` allows an honest record for something bought abroad. No currency conversion is performed — the number shown is the number paid.

`seq` is assigned once, at the time an item is added, and never renumbered. Sort order in the UI is newest-acquired first; `seq` preserves the chronology of accumulation independently of sort.

### Images

Downloaded from source and committed to `public/images/collections/<category>/<id>.webp`, rather than hotlinked — a retailer rotating their CDN must not break the case. Served through `next/image`.

**Standardised at ingest, not at source.** No single retailer stocks a
back-catalogue of watches, shoes and fragrance, so sourcing will always be
mixed: brand press renders for watches, StockX for sneakers, Fragrantica for
perfume. Each is consistent within itself and disagrees with the others.

`scripts/normalize-image.mjs` resolves this. A raw photo staged at
`scripts/incoming/<category>/<id>.<ext>` becomes a finished compartment image:

    segment the subject  →  trim to bounds  →  pad to square,
    object at 78% of frame  →  800x800 transparent webp

Because every object is re-framed to the same proportion on the same canvas,
the source stops mattering. Sourcing becomes "find any decent photo" rather
than "find one that matches the other forty".

Segmentation uses `rembg` reached through `uvx`, so nothing is installed
globally. It is a learned model rather than a colour key, which matters: a
watch with a white dial or a sneaker with a cream midsole survives, where
threshold-keying white pixels would destroy them. The whole batch is segmented
in one process — spawning per image costs a fresh Python start and model load
each time, turning forty items into half an hour.

The script degrades rather than failing: with no segmenter on PATH it keeps
the original background and says so. Raw staged files are gitignored; the
normalised webp is the artefact that ships.

Rejected: a single-retailer source (coverage fails on anything discontinued),
and white tiles behind each object to hide mismatched backgrounds (a permanent
visual compromise to avoid a step that turns out to be automatable).

---

## Components

```
app/(collections)/collections/page.tsx            drawer index
app/(collections)/collections/[category]/page.tsx one drawer
app/(collections)/collections/unlock/page.tsx     lock screen
components/case/Tray.tsx                          the compartment grid
components/case/Compartment.tsx                   one object in its box
components/case/Ledger.tsx                        the lifted item's data
components/case/Rail.tsx                          fixed bottom drawer switcher
components/case/Facets.tsx                        filter row above the tray
components/case/DrawerFront.tsx                   one drawer, shut, on the index
lib/collections/summary.ts                        what a drawer knows about itself
middleware.ts                                     cookie check
lib/collections/auth.ts                           sign / verify the cookie
```

Each unit is independently comprehensible: `Tray` knows about layout and selection state, `Compartment` knows about one item, `Ledger` knows about presentation of a selected item, `Rail` knows about categories and counts. None reaches into another's internals.

---

## Interaction

**The tray.** Uniform compartments divided by hairlines. No cards, no shadows, no rounded rectangles. Each compartment carries `№NN` at 10px top-left, the object as a cut-out image, and a caption — brand at 10px over name at 13px — along the bottom. Empty compartments remain ruled and empty, including the tail of a part-filled row, so the plate is always a rectangle.

**The lift.** Clicking a compartment raises the object out of the tray (`translateY` + slight scale + shadow) while the room dims ~8%. The ledger sets to the left on desktop, below on mobile:

```
№07
Seiko SKX007                                 24px / 400
Seiko · Automatic · 42mm                     11px
₹24,000 · August 2023                        11px
Bought it to stop borrowing my father's.     14px
```

Escape or a second click drops it back.

**The rail.** Fixed to the bottom, persistent across all drawers. `All` plus one entry per drawer, each a stacked count-over-label pair, and a `← Foundry` door at the far end. It carries both ways out: back to the case index, and back to the portfolio.

**Facets.** A thin row at the top of the tray, scoped to the current category. Multiple selections within a facet are OR'd; across facets, AND'd. Perfume notes are the richest filter in the set (every item containing vetiver). Filter state lives in the URL query string, so a filtered view is linkable and survives a reload.

**Scrolling.** The room and rail stay fixed; the tray scrolls vertically beneath them. This is the deliberate departure from the source, which cannot scroll at all.

**Motion.** Three primitives only: the lift, the drawer-front slide on the index, and the slip's fade-in as it changes register. Pure CSS — `framer-motion` is a dependency of the portfolio, not of the case. All collapse under `prefers-reduced-motion`.

---

## Accessibility

- Every compartment is a real `<button>` with a written accessible label (`"№07 Seiko SKX007 — show details"`).
- Arrow keys move between compartments, Enter lifts, Escape drops.
- Focus ring at ≥3:1 contrast, appearing instantly — never animated.
- The rail is a real nav landmark with links, usable without the tray.
- Ledger content is announced on selection via a polite live region.

---

## Error handling and edge cases

| Case | Behaviour |
|---|---|
| Wrong password | Re-render the lock screen with `Not this one.` No further hint, no attempt counter. |
| Missing / expired cookie | Redirect to unlock, preserving the intended path for post-unlock redirect. |
| Unknown category slug | `notFound()` → 404. |
| Empty category | Tray renders ruled, empty compartments with a 14px line: `Nothing in this drawer yet.` |
| Broken or missing image | Compartment falls back to the item's name set in type. The case still reads as a case. |
| Filter matches nothing | Tray shows ruled empties and `No matches. Clear the filters.` with a reset control. |
| `COLLECTIONS_PASSWORD` unset | Gate fails closed — everyone sees the lock screen, nobody can unlock. Never fail open. |

---

## Testing

- **Auth unit tests** — cookie signing round-trips; a tampered signature is rejected; an expired cookie is rejected; unset env fails closed.
- **Middleware tests** — `/collections/*` redirects when unauthenticated; passes when authenticated; the unlock route itself is never gated (no redirect loop).
- **Data integrity test** — every item has a unique `id` and `seq` within its category; every `image` path resolves to a file on disk; every `acquired` parses as a date. This runs over the real data files, so a malformed entry fails the build rather than shipping a broken drawer.
- **Filter logic tests** — OR within a facet, AND across facets; URL round-trip of filter state.
- **Responsive verification** at 320 / 375 / 414 / 768px: no horizontal scroll, no two-line clickable text, image grid tracks use `minmax(0, 1fr)`.

Existing project note: `next.config.mjs` sets `typescript.ignoreBuildErrors` and `eslint.ignoreDuringBuilds`, so type errors will not fail the build. The data integrity test is therefore the real guard on data correctness and should run in CI, not rely on `next build`.

---

## Out of scope

Deliberately excluded, recorded so they are not re-litigated during implementation:

- Cross-category browsing or a shared tag vocabulary (decision 2).
- Current market value, sold/retired status, wear logs, servicing history (decision 3).
- Per-item pages, full-text search (decision 5 — revisit past ~100 items).
- Any write path from the browser. Items are added by editing the data files and committing.

---

## Revision — 2026-09-08

A `hallmark redesign` pass over the built section. The eight decisions above all
stand; what changed is the execution of them.

### What was wrong

- **The label voice failed contrast.** `--ink-mute` (`#857c6e`) on the room
  measured **3.18:1**, and it carried nearly every string in the section —
  page titles, counts, facts, prices, the rail. Below the 4.5:1 floor for text
  under 24px.
- **A part-filled row painted a grey slab.** The grid's own background showed
  through wherever a row was short, which is every drawer whose count is not a
  multiple of the column count. It read as a rendering fault, not as an
  unfilled case.
- **Nothing was named.** A drawer was a wall of unlabelled photographs; you had
  to hover each one to learn what it was. That defeats the success criterion
  "opening a drawer answers *what do I own here* in one screen."
- **The ledger column was empty most of the time** — a quarter of the page
  holding one faint line.
- **The index was a list of three words** on an otherwise empty field, with no
  sight of what was in any drawer.
- **There was no way back.** No link from a drawer to the index, none from
  anywhere to the portfolio.
- **`colourway`, `reference` and `noun` were collected and never shown**, and
  `maximumFractionDigits: 0` reported a $64.96 pair as `$65` — a ledger
  misreporting what was paid.

### What changed

- **Tokens re-cut in OKLCH**, scoped to `.case`, with an ink ramp measured
  against the room: `--ink-3` at **4.7:1** replaces the old muted voice, and
  `--accent-ink` at **4.6:1** is the accent's text form. `--rule-2` clears 3:1
  so a control has a visible boundary. The room, the paper and the vermilion
  are the foundry's own values, re-expressed.
- **Plate & Slip.** The compartment grid pads its last row with ruled empties,
  measured from the real rendered column count. The slip beside it carries the
  lifted item's entry, and when nothing is lifted, what the drawer knows about
  itself: count, spend per currency, acquisition span, notes still to write,
  and a proportional bar per brand. It is never empty.
- **Compartments are captioned** — brand over name, along the bottom.
- **The index shows the drawers shut, with the first few things showing
  through the front.** An empty drawer drops to the unlit room.
- **Facets carry counts refined against the other active facets**, so a chip
  that would leave you with nothing says so and is not clickable. On narrow
  screens they collapse behind one `Filter` disclosure.
- **The room dims no more.** Lifting an object lights its compartment and marks
  it; the rest of the plate is left alone, because a tray at 55 % opacity reads
  as loading rather than as focused.
- **Copy is checked against the data.** The drawer says "In the order they were
  added" while no item carries a date, and "Newest first" only once one does.

### Known, not fixed

Apparent object size still varies between compartments. `normalize-image.mjs`
fits each subject's *bounding box* to 78 % of a square frame, so a watch on a
long strap ends up with a smaller dial than a compact one beside it. That is an
ingest question, not a CSS one, and is left for a pass over the script.

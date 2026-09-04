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

**Type inside the case:** Space Grotesk only, at 10 / 11 / 14 / 24px, weights 400–500. Item name is 24px weight 400. Fraunces does not appear inside the case.

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
middleware.ts                                     cookie check
lib/collections/auth.ts                           sign / verify the cookie
```

Each unit is independently comprehensible: `Tray` knows about layout and selection state, `Compartment` knows about one item, `Ledger` knows about presentation of a selected item, `Rail` knows about categories and counts. None reaches into another's internals.

---

## Interaction

**The tray.** Uniform compartments divided by hairlines at the existing `--line` token (`rgba(23,20,15,0.14)`). No cards, no shadows, no rounded rectangles. Each compartment carries `№NN` at 10px, top-left. The object sits inside as a cut-out image on the neutral ground. Empty compartments remain ruled and empty — an unfilled case looks intentional.

**The lift.** Clicking a compartment raises the object out of the tray (`translateY` + slight scale + shadow) while the room dims ~8%. The ledger sets to the left on desktop, below on mobile:

```
№07
Seiko SKX007                                 24px / 400
Seiko · Automatic · 42mm                     11px
₹24,000 · August 2023                        11px
Bought it to stop borrowing my father's.     14px
```

Escape or a second click drops it back.

**The rail.** Fixed to the bottom, persistent across all drawers. Three entries with live counts (`Watches 14 · Shoes 9 · Perfumes 22`), each a stacked pair at 11px.

**Facets.** A thin row at the top of the tray, scoped to the current category. Multiple selections within a facet are OR'd; across facets, AND'd. Perfume notes are the richest filter in the set (every item containing vetiver). Filter state lives in the URL query string, so a filtered view is linkable and survives a reload.

**Scrolling.** The room and rail stay fixed; the tray scrolls vertically beneath them. This is the deliberate departure from the source, which cannot scroll at all.

**Motion.** Three primitives only: the lift, the rail underline slide, and a short stagger as the tray fills. `framer-motion` is already a dependency. All collapse to a ≤150ms opacity crossfade under `prefers-reduced-motion`.

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

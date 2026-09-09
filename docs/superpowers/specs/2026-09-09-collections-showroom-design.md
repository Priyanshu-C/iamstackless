# The Showroom — a page per object

**Date:** 2026-09-09
**Status:** Design settled. Approval given in advance ("create a plan… and complete the entire thing"); the user was away for the whole session, so every open question below was decided rather than asked, and each records the alternative rejected so any of them can be overturned on one line.
**Scope:** A per-item page under `/collections/<category>/<id>`, multi-angle imagery with a category-consistent angle vocabulary, and researched product detail. Supersedes two decisions in [the original Case spec](2026-09-04-collections-case-design.md).

---

## The complaint

> "The current flow feels very weird. It has no details of the product, nothing as such. Even the picture is only a single picture… Think about it like a showroom: you would want to have multiple angles of the pictures, and the catalog should also have the same pictures for everything. For example, if you are only showing a side image of a shoe, it should be a side image for all the shoes, and one should not be different."
>
> "Research every product: what makes them unique, why I would want them, and what makes them part of the collection."

Three separate asks, and they pull in different directions:

1. **A showroom** — a surface with room for an object, not a 220px compartment.
2. **Angle consistency** — the plate must not mix a side-on Samba with a three-quarter Air Max.
3. **Depth** — the objects should be written up.

---

## What this supersedes

The original spec settled two things that this one overturns. Both are recorded there with their rejected alternatives, so overturning them needs a reason, not a preference.

| Original | Now | Why it changed |
|---|---|---|
| **Decision 3 — ledger depth.** "Name, brand, price paid, date acquired, one photo, one line of why." Dossier depth was explicitly rejected. | **Dossier depth**, on a second surface only. The drawer keeps ledger depth. | The user has looked at ledger depth in use and called it thin. Depth moves to a page that can hold it, rather than swelling the drawer. |
| **Architecture — "no per-item routes."** "At ledger depth an item is one line and five facts; detail expands in place within the drawer." | **`/collections/<category>/<id>`.** | The premise was ledger depth. With that gone, the premise is gone. |

The `study` note that rejected "the split between `Open` and `Details` — at ledger depth an item has no second surface to open into, so selection has one affordance, not two" also lapses, and for the same reason. There is now a second surface. Selection still has one affordance — it is just `open` instead of `pin`.

**Decisions 1, 2, 4, 5, 6, 7 and 8 all stand**, unchanged. In particular: soft-private, category-specific facets only, committed press imagery, uniform compartments, and no display serif inside the case.

---

## Decisions

### 9 · The angle vocabulary is closed, ordered, and per-category

Each category declares a fixed list of angles. The first is **canonical**.

| Category | Angles, in order | Canonical |
|---|---|---|
| Watches | `dial` · `angle` · `profile` · `caseback` | `dial` |
| Shoes | `lateral` · `medial` · `top` · `sole` | `lateral` |
| Perfumes | `bottle` · `angle` · `cap` · `box` | `bottle` |

*Rejected:* one shared vocabulary across all three categories (a watch has no `lateral`, a shoe has no `caseback`; a shared set would be mostly blanks). Also rejected: a free-form list per item, which is what produces the inconsistency being complained about.

### 10 · The catalogue renders the canonical angle and nothing else

This is the mechanism behind the user's actual requirement, and it is structural rather than a convention people remember.

- The drawer plate and the index drawer-fronts render **only `angles[0]`** for the category — not "the first available image".
- An item with no canonical shot falls back to **its name set in type**, exactly as a broken image already does. It does **not** substitute a different angle.
- A test asserts it: every item carrying any shot carries the canonical one, and no item declares an angle outside its category's vocabulary.

*Rejected:* "render the first image that exists", which is the rule that lets one lateral shoe sit beside one top-down shoe.

### 11 · Shots are declared as angle keys, not paths

```ts
shots: ["lateral", "medial", "sole"]
```

The path is derived: `/images/collections/<category>/<id>.<angle>.webp`. Authoring an item stays one array; a path cannot be mistyped; the normaliser owns naming.

*Rejected:* a `{ angle: path }` map (twelve chances to typo a path per item, and it duplicates what the filename already says). Also rejected: deriving `shots` from the filesystem at build time, which would make the data files stop being the source of truth and would make the integrity suite meaningless.

Success criterion 1 of the original spec — "adding an item is cheap enough that the catalogue is still being updated a year from now" — is the reason this is one array and not a structure.

### 12 · Two voices, never blended

The researched write-up and the owner's line are different things and must not be confused, because `why` is the field the original spec protects most carefully: *"only Priyanshu knows when he bought something and why, and they are never invented to fill a gap."*

| Field | Voice | Source | Missing renders as |
|---|---|---|---|
| `standing` | catalogue | researched, cited | omitted |
| `note` | catalogue | researched, cited | omitted |
| `why` | **the owner's** | supplied by hand only | a ruled blank |

Research fills `standing` and `note`. Research is **forbidden** from filling `why`, and no agent in the pipeline is given the field.

*Rejected:* a single `about` field that merges them (it would silently put a researcher's sentence in the owner's mouth, which is the exact failure the original spec was written to prevent).

### 13 · The owner's line comes last, not first

`why` is empty for all twelve items today. A page whose first block is a blank reads as broken; a page whose *last* block is a blank reads as an invitation. So the dossier runs: what it is → what it is in the world → the record → **and here is why it's mine**.

*Rejected:* leading with `why` (correct once the field is filled, wrong for the entire period in which it isn't — and that period is now).

### 14 · Every researched sentence carries provenance

`sources: string[]` is required whenever `standing` or `note` is set — test-enforced, not a habit. The page ends on a colophon listing them. A catalogue that asserts without citing is a catalogue you cannot check a year later.

### 15 · The compartment becomes a link

Clicking a compartment opens its page. Hover and keyboard focus still preview into the slip, so a drawer can be scanned without leaving it.

This deletes the pinned-selection state machine and, with it, the mobile bottom sheet — a tap now goes to the full page, which is strictly more than the sheet ever showed.

*Rejected:* keeping click-to-pin and adding a separate "Open" control. Two affordances on a tile whose pin state existed only to feed the slip, which hover already does.

### 16 · Specs are optional, sourced, and blank when unknown

New optional per-category fields (watch: case material, crystal, water resistance, calibre, lug width, power reserve, released; shoe: style code, silhouette, released, upper, midsole, closure; perfume: perfumer, released). Each is validated *when present* and legitimately absent otherwise — the same contract `acquired` and `why` already have.

The record table shows **every** field in the category's vocabulary, with a ruled blank against the ones not yet known. A spec sheet that hides what it doesn't know tells you nothing about what is missing.

---

## Design language

The showroom is a **different macrostructure inside the same locked system**. The case's tokens, its single face, its hairline ruling, its motion budget and its rail are unchanged; what differs is the page shape.

- **Macrostructure:** Split Studio (15) — a persistent diptych. The drawer is Plate & Slip; the showroom is Vitrine & Dossier. Same grammar, inverted emphasis: on the drawer the plate is the subject and the slip is the label; here the object is the subject and the writing is the reading.
- **Section heads:** S4 Inline-no-break — small-caps labels emerging in the flow. No numbered eyebrows, no tag-left/heading-right.
- **The record:** F3 Tabular spec sheet — hairline rows, tabular numerals. Already the case's native voice.
- **The owner's line:** T1 Pull-quote with marginalia — set larger, in the wide column, labelled in the margin.
- **Prev/next:** C3 Typographic link.
- **Footer:** Ft2 Inline-rule single line — the source colophon. The drawer pages have no footer (the rail is the footer); the showroom earns one because it has something to put in it.
- **Nav:** the existing rail, plus a `← Watches` return in the masthead.
- **Enrichment:** none. The objects are the imagery.
- **Motion:** no new primitives. The frame hover reuses the existing lift.

### The vitrine

Four ruled frames in a 2×2 plate, all visible at once, each labelled with its angle in the 10px voice. Compartments stay uniform (decision 7).

*Rejected:* one large viewer with a thumbnail rail beneath. It is the most-defaulted e-commerce pattern there is, it shows one angle at a time when the entire point is comparing angles, and it would need a carousel state machine to do worse than a grid does for free. Also rejected: a lightbox — the 2×2 at ~380px per frame on desktop is already larger than the object needs.

An angle not yet photographed shows a **ruled empty frame with its label**, in the unlit room shade. The gap is visible and legible: *"caseback — not photographed"*. This is the same principle as the missing-note rule.

### Layout

| Width | Shape |
|---|---|
| ≥ 1000px | Vitrine left (sticky), dossier right, scrolling |
| < 1000px | Vitrine on top, dossier beneath |

---

## Architecture

```
app/(collections)/collections/[category]/[id]/page.tsx   the showroom
components/case/Vitrine.tsx                              the 2x2 angle plate
components/case/Dossier.tsx                              the writing and the record
components/case/Record.tsx                               the spec table with visible blanks
components/case/Neighbours.tsx                           prev / next within the drawer
lib/collections/angles.ts                                the angle vocabulary + path helper
lib/collections/research.ts                              researched notes, specs, sources
```

`lib/collections/angles.ts` is the single place the vocabulary lives. Nothing else may hard-code an angle key.

### Where the researched material lives

In a **separate file from the items**, keyed by id. The item files stay hand-authored and cheap; the researched material is machine-gathered and separately reviewable, and a bad research pass can be reverted without touching the collection itself.

*Rejected:* inlining `standing`/`note`/`sources` into the item objects, which would bury a hand-written `why` in fifteen lines of machine-gathered prose and make the files hostile to the one job they have.

### Images

`scripts/normalize-image.mjs` gains angle awareness: a file staged at `scripts/incoming/<category>/<id>.<angle>.<ext>` normalises to `<id>.<angle>.webp` through the existing pipeline (segment → trim → pad to 78% of a square). Unangled filenames still work and are treated as the canonical angle, so nothing already staged breaks.

Existing files are migrated: `<id>.webp` → `<id>.<canonical>.webp`.

**What will not be true on delivery.** The repository holds one photograph per object. Additional angles are sourced where a brand or major retailer publishes them, and where they cannot be, the frame stays a labelled blank. The architecture is complete; the photography is as complete as public sources allow. This is stated rather than papered over, because a showroom with four invented angles would be worse than one with a blank and a label.

---

## Error handling and edge cases

| Case | Behaviour |
|---|---|
| Unknown `id` under a valid category | `notFound()` → 404 |
| Item has no canonical shot | Compartment and vitrine fall back to the name set in type; the plate still reads as a plate |
| Item has a shot for an angle outside its vocabulary | Integrity test fails the build |
| Item has a non-canonical shot but no canonical one | Integrity test fails — this is the inconsistency the user reported |
| No researched note | The dossier omits the section. No placeholder prose |
| `note` set, `sources` empty | Integrity test fails |
| No `why` | Ruled blank, labelled, at the end of the dossier |
| First or last item in a drawer | `Neighbours` renders one side only, never a dead control |
| Filtered drawer | Prev/next follow the drawer's own order, not the filter's — a filter is a view, not an ordering |

---

## Testing

Extends the existing integrity suite, which runs over the real data files and is the actual guard (`next.config.mjs` sets `typescript.ignoreBuildErrors`).

- **Angle vocabulary** — every declared angle exists in its category's vocabulary; every declared shot resolves to a file on disk.
- **Canonical consistency** — every item with any shot has the canonical one. *This is the test that enforces the user's headline requirement.*
- **Provenance** — `sources` non-empty whenever `standing` or `note` is set; every entry parses as a URL.
- **No invention** — no research record carries a `why`.
- **Research keys** — every researched id matches a real item.
- **Neighbours** — prev/next are total and acyclic across each drawer; ends have exactly one neighbour.
- **Responsive** at 320 / 375 / 414 / 768 / 1280.

---

## Out of scope

- A lightbox or zoom. The frames are large enough.
- Cross-category browse (original decision 2 stands).
- Any write path from the browser (original spec stands).
- Current market value, wear logs, servicing history (original decision 3's *other* rejections stand — dossier depth here means description and provenance, not valuation).
- Generating, upscaling or compositing imagery that was not photographed. A blank is the honest render.

---

## Decisions added during implementation

These came out of the work rather than the design, and each is recorded the
same way: what was chosen, and what was rejected.

### 17 · `price` is optional

Thirteen perfumes arrived as photographs, not receipts. `price` joins
`acquired` and `why` as something only the owner knows, and the drawer counts
what is unpriced rather than filling it in.

*Rejected:* substituting the listed retail price. A listing's price is what a
thing costs, not what he paid, and the original spec is explicit that the
number shown is the number paid. Silently swapping one for the other would
make the drawer's spend total a fiction while looking exactly like a fact.

### 18 · `volume` comes off the bottle, not off a listing

Set only where the label in the photograph states it — seven of thirteen. The
rest are absent.

*Rejected:* filling from the retailer's most common size. A house sells the
same fragrance in 30, 50 and 100ml; which one is on the shelf here is not
something a listing can tell you.

### 19 · `house` deleted from `Perfume`

It duplicated `brand`, which the facets already use.

*Rejected:* keeping both and rendering "House" in the record — a row that
restates the line directly above it.

### 20 · A facet past twelve values folds

Perfume notes run to roughly fifty across thirteen bottles, most on a single
item, and the filter row became five rows of chips taller than the plate. Over
twelve values a facet shows the first twelve plus a count; anything already
selected stays visible while the rest is folded.

*Rejected:* hiding values that only one item carries. "Which one has the oud"
is a real question, and a facet that quietly drops its rarest values answers it
wrongly.

### 21 · The perfumes are the owner's own photographs

Five flat-lays, thirteen bottles, segmented apart automatically: sample the
background from the frame's border, threshold on distance and saturation,
erode, dilate, label the blobs and keep the largest. Two had to be cropped by
hand where shadows merged neighbouring bottles into one blob.

This makes the perfume drawer the only one shot by the owner rather than
sourced from press imagery — a departure from original decision 4, and an
improvement on it. The normaliser puts them on the same 800px frame as
everything else, so they sit in the plate as siblings regardless.

*Rejected:* press renders for the perfumes. He photographed them; using a
manufacturer's studio shot instead would have been both more work and less
true.

### 22 · The normaliser keeps only the largest object it finds

A photograph of one bottle usually contains a sliver of the next one along,
and the segmenter cut those out too. Left alone, the sliver widened the
bounding box, so the trim-and-pad step shrank the actual subject to make room
for a fragment nobody wanted. The alpha channel is labelled and only the
largest connected region survives.

## Still outstanding

- **`why` is empty on all twenty-five items.** By design — it is the one field
  nothing but the owner may write. Every showroom page ends on the ruled blank.
- **`price` and `acquired` are empty on the thirteen perfumes.**
- **One angle per object.** The architecture carries four per category; the
  photography carries one. Every unphotographed angle renders as a labelled
  blank, which is both the honest render and the shortest possible list of
  what to shoot next.
- **Stronger With You Intensely has no note pyramid.** Its notes are
  deliberately empty pending a source for the flanker specifically — the base
  Stronger With You is a different fragrance and its pyramid must not be
  borrowed.

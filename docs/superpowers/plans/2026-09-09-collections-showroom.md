# The Showroom Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give every object in The Case its own showroom page — a 2×2 vitrine of category-consistent angles beside a researched dossier — and make the catalogue's angle consistency a thing tests enforce rather than a thing people remember.

**Architecture:** A closed per-category angle vocabulary in one module (`lib/collections/angles.ts`) that everything else reads. Item files declare shots as an array of angle keys; paths are derived. Researched prose lives in a separate keyed file so the hand-authored collection stays cheap to edit and a bad research pass is revertible. A new route `[category]/[id]` composes Vitrine + Dossier. The drawer's compartment becomes a link and its pinned-selection state machine is deleted.

**Tech Stack:** Next 14 app router, React 18 RSC, TypeScript, plain CSS custom properties in `app/globals.css`, Vitest, sharp + rembg-via-uvx for image normalisation.

## Global Constraints

- **Angle vocabulary is closed.** Only `lib/collections/angles.ts` may name an angle key. Nothing else hard-codes one.
- **The catalogue renders `angles[0]` and nothing else.** Never "the first shot that exists".
- **Research may never write `why`.** `why` is the owner's field. Research fills `standing` and `note` only.
- **`sources` is required whenever `standing` or `note` is set.** Test-enforced.
- **Nothing is invented.** A missing spec, angle or note renders as a labelled blank, never as filler.
- **No new design tokens outside `.case`.** The showroom uses the tokens already defined at `app/globals.css` `.case { … }`.
- **No new motion primitives.** The section's budget is three, all spent: the lift, the drawer-front slide, the slip fade.
- **`app/globals.css` is append-only below line 1147** — the foundry block above it is untouched.
- **Space Grotesk only inside `.case`** (original decision 8).
- **Responsive floor:** 320 / 375 / 414 / 768 / 1280. No horizontal scroll; `overflow-x: clip` on `html` and `body`; no two-line clickable text; image grid tracks use `minmax(0, 1fr)`.
- **Existing suite must stay green:** 46 tests at plan time.

---

## File structure

| File | Responsibility |
|---|---|
| `lib/collections/angles.ts` | **create** — the closed vocabulary, the canonical accessor, the path deriver |
| `lib/collections/types.ts` | modify — `shots`, optional per-category specs |
| `lib/collections/research.ts` | **create** — researched prose + specs + sources, keyed by id |
| `lib/collections/watches.ts` · `shoes.ts` · `perfumes.ts` | modify — `image` → `shots` |
| `lib/collections/index.ts` | modify — `neighbours()` |
| `components/case/Compartment.tsx` | modify — button → link, canonical shot only |
| `components/case/Tray.tsx` | modify — delete pinned selection |
| `components/case/Ledger.tsx` | modify — entry gains an "Open" link, loses the close control |
| `components/case/DrawerFront.tsx` | modify — canonical shot only |
| `components/case/Vitrine.tsx` | **create** — the 2×2 angle plate |
| `components/case/Dossier.tsx` | **create** — standing, note, the owner's line, colophon |
| `components/case/Record.tsx` | **create** — spec table with visible blanks |
| `components/case/Neighbours.tsx` | **create** — prev/next |
| `app/(collections)/collections/[category]/[id]/page.tsx` | **create** — the showroom route |
| `app/globals.css` | modify — showroom block, appended |
| `scripts/normalize-image.mjs` | modify — `<id>.<angle>.<ext>` staging |
| `lib/collections/angles.test.ts` | **create** — vocabulary + canonical-consistency + provenance |
| `lib/collections/data.test.ts` | modify — shots resolve on disk |

---

## Task 1: The angle vocabulary

**Files:**
- Create: `lib/collections/angles.ts`
- Create: `lib/collections/angles.test.ts`

**Interfaces:**
- Consumes: `CategorySlug` from `./types`
- Produces:
  - `type AngleKey = string`
  - `type Angle = { key: string; label: string }`
  - `ANGLES: Record<CategorySlug, Angle[]>`
  - `canonicalAngle(category: CategorySlug): Angle`
  - `anglesFor(category: CategorySlug): Angle[]`
  - `shotPath(category: CategorySlug, id: string, angle: string): string`
  - `angleLabel(category: CategorySlug, angle: string): string | null`

- [ ] **Step 1: Write the failing test**

```ts
// lib/collections/angles.test.ts
import { describe, expect, it } from "vitest";
import { ANGLES, anglesFor, angleLabel, canonicalAngle, shotPath } from "./angles";

describe("the angle vocabulary", () => {
    it("gives every category an ordered, non-empty list", () => {
        for (const [slug, angles] of Object.entries(ANGLES)) {
            expect(angles.length, slug).toBeGreaterThan(1);
        }
    });

    it("names the first angle as canonical", () => {
        expect(canonicalAngle("shoes").key).toBe("lateral");
        expect(canonicalAngle("watches").key).toBe("dial");
        expect(canonicalAngle("perfumes").key).toBe("bottle");
    });

    it("never repeats an angle key inside a category", () => {
        for (const [slug, angles] of Object.entries(ANGLES)) {
            const keys = angles.map((a) => a.key);
            expect(new Set(keys).size, slug).toBe(keys.length);
        }
    });

    it("derives a shot path from category, id and angle", () => {
        expect(shotPath("shoes", "adidas-samba-xlg", "lateral")).toBe(
            "/images/collections/shoes/adidas-samba-xlg.lateral.webp"
        );
    });

    it("returns a label for a known angle and null for an unknown one", () => {
        expect(angleLabel("watches", "caseback")).toBe("Caseback");
        expect(angleLabel("watches", "lateral")).toBeNull();
    });

    it("lists angles in declaration order", () => {
        expect(anglesFor("shoes").map((a) => a.key)).toEqual([
            "lateral", "medial", "top", "sole",
        ]);
    });
});
```

- [ ] **Step 2: Run it and watch it fail**

Run: `npx vitest run lib/collections/angles.test.ts`
Expected: FAIL — `Failed to resolve import "./angles"`

- [ ] **Step 3: Write the module**

```ts
// lib/collections/angles.ts
import type { CategorySlug } from "./types";

/** One way of looking at an object. The list per category is closed and
    ordered: the first entry is the canonical angle, and it is the only one the
    catalogue ever renders. That is what stops one drawer showing a shoe from
    the side and the next from above. */
export type Angle = { key: string; label: string };

export const ANGLES: Record<CategorySlug, Angle[]> = {
    watches: [
        { key: "dial", label: "Dial" },
        { key: "angle", label: "Three-quarter" },
        { key: "profile", label: "Profile" },
        { key: "caseback", label: "Caseback" },
    ],
    shoes: [
        { key: "lateral", label: "Lateral" },
        { key: "medial", label: "Medial" },
        { key: "top", label: "Top" },
        { key: "sole", label: "Sole" },
    ],
    perfumes: [
        { key: "bottle", label: "Bottle" },
        { key: "angle", label: "Three-quarter" },
        { key: "cap", label: "Cap off" },
        { key: "box", label: "Box" },
    ],
};

export function anglesFor(category: CategorySlug): Angle[] {
    return ANGLES[category];
}

/** The one the plate renders. Never "the first shot that happens to exist". */
export function canonicalAngle(category: CategorySlug): Angle {
    return ANGLES[category][0];
}

export function angleLabel(category: CategorySlug, angle: string): string | null {
    return ANGLES[category].find((a) => a.key === angle)?.label ?? null;
}

/** Paths are derived, never authored — an item declares angle keys and the
    filename follows. One less thing to typo, and the normaliser owns naming. */
export function shotPath(
    category: CategorySlug,
    id: string,
    angle: string
): string {
    return `/images/collections/${category}/${id}.${angle}.webp`;
}
```

- [ ] **Step 4: Run it and watch it pass**

Run: `npx vitest run lib/collections/angles.test.ts`
Expected: PASS, 6 tests

- [ ] **Step 5: Commit**

```bash
git add lib/collections/angles.ts lib/collections/angles.test.ts
git commit -m "feat(collections): a closed, ordered angle vocabulary per category"
```

---

## Task 2: `shots` on the item, and the files on disk

**Files:**
- Modify: `lib/collections/types.ts`
- Modify: `lib/collections/watches.ts`, `lib/collections/shoes.ts`, `lib/collections/perfumes.ts`
- Modify: `lib/collections/data.test.ts`
- Rename: `public/images/collections/watches/*.webp` → `*.dial.webp`; `public/images/collections/shoes/*.webp` → `*.lateral.webp`

**Interfaces:**
- Consumes: `shotPath`, `canonicalAngle` from Task 1
- Produces: `CollectionItem.shots: string[]` replacing `CollectionItem.image: string`

- [ ] **Step 1: Write the failing tests** — append to `lib/collections/data.test.ts` inside the existing `describe.each(CATEGORIES)` block

```ts
    it("declares only angles its category knows about", () => {
        const known = new Set(anglesFor(category.slug).map((a) => a.key));
        for (const item of category.items) {
            for (const angle of item.shots) {
                expect(known.has(angle), `${item.id}: ${angle}`).toBe(true);
            }
        }
    });

    it("carries the canonical angle whenever it carries any shot", () => {
        const canonical = canonicalAngle(category.slug).key;
        for (const item of category.items) {
            if (item.shots.length === 0) continue;
            expect(item.shots, item.id).toContain(canonical);
        }
    });

    it("points every shot at a file that exists", () => {
        for (const item of category.items) {
            for (const angle of item.shots) {
                const rel = shotPath(category.slug, item.id, angle);
                expect(
                    existsSync(path.join(PUBLIC, rel)),
                    `${item.id} ${angle} → ${rel}`
                ).toBe(true);
            }
        }
    });

    it("never repeats an angle on one item", () => {
        for (const item of category.items) {
            expect(new Set(item.shots).size, item.id).toBe(item.shots.length);
        }
    });
```

Add to the file's imports:

```ts
import { anglesFor, canonicalAngle, shotPath } from "./angles";
```

Delete the existing `it("points image at a file that exists", …)` block — `shots` replaces it.

- [ ] **Step 2: Run and watch it fail**

Run: `npx vitest run lib/collections/data.test.ts`
Expected: FAIL — `Property 'shots' does not exist` at runtime, `item.shots is undefined`

- [ ] **Step 3: Change the type**

In `lib/collections/types.ts`, replace the `image` field on `CollectionItem`:

```ts
    /** Which angles have been photographed, as keys from the category's
        vocabulary in `angles.ts`. The path is derived, never written here.
        The canonical angle must be present if any angle is — the catalogue
        renders only that one, so a missing canonical means a compartment
        falls back to type rather than showing a different angle from its
        neighbours. */
    shots: string[];
```

Add optional, sourced spec fields to each category type:

```ts
export type Watch = CollectionItem & {
    movement: "automatic" | "quartz" | "manual";
    caseSize?: number;
    reference: string;
    /* Sourced from a public listing when known, absent when not. Each renders
       as a ruled blank rather than being guessed. */
    caseMaterial?: string;
    crystal?: string;
    waterResistance?: string;
    calibre?: string;
    lugWidth?: string;
    powerReserve?: string;
    released?: string;
};

export type Shoe = CollectionItem & {
    size?: string;
    material?: string;
    colourway: string;
    styleCode?: string;
    silhouette?: string;
    released?: string;
    upper?: string;
    midsole?: string;
    closure?: string;
};

export type Perfume = CollectionItem & {
    house: string;
    concentration: "EDT" | "EDP" | "parfum";
    notes: { top: string[]; heart: string[]; base: string[] };
    volume: number;
    perfumer?: string;
    released?: string;
};
```

- [ ] **Step 4: Move the files and rewrite the data**

```bash
cd public/images/collections/watches && for f in *.webp; do case "$f" in *.*.webp) ;; *) git mv "$f" "${f%.webp}.dial.webp";; esac; done
cd ../shoes && for f in *.webp; do case "$f" in *.*.webp) ;; *) git mv "$f" "${f%.webp}.lateral.webp";; esac; done
```

Then in each data file replace every `image: "/images/collections/<cat>/<id>.webp",` line with `shots: ["<canonical>"],` — `dial` for watches, `lateral` for shoes. Update each file's header comment to describe `shots` instead of `image`.

- [ ] **Step 5: Run the whole suite**

Run: `npx vitest run`
Expected: PASS. Every prior test still green, plus 4 new ones per category.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat(collections): items declare angles, not image paths"
```

---

## Task 3: Researched notes, kept apart from the collection

**Files:**
- Create: `lib/collections/research.ts`
- Modify: `lib/collections/angles.test.ts` (provenance tests)

**Interfaces:**
- Produces:
  - `type Research = { standing?: string; note?: string; sources: string[]; specs?: Record<string, string> }`
  - `RESEARCH: Record<string, Research>`
  - `researchFor(id: string): Research | null`

- [ ] **Step 1: Write the failing test** — append to `lib/collections/angles.test.ts`

```ts
import { CATEGORIES } from "./index";
import { RESEARCH, researchFor } from "./research";

describe("researched material", () => {
    const ids = new Set(CATEGORIES.flatMap((c) => c.items.map((i) => i.id)));

    it("is keyed by ids that actually exist", () => {
        for (const id of Object.keys(RESEARCH)) {
            expect(ids.has(id), id).toBe(true);
        }
    });

    it("cites a source whenever it asserts anything", () => {
        for (const [id, r] of Object.entries(RESEARCH)) {
            if (!r.standing && !r.note) continue;
            expect(r.sources.length, id).toBeGreaterThan(0);
        }
    });

    it("cites only real URLs", () => {
        for (const [id, r] of Object.entries(RESEARCH)) {
            for (const s of r.sources) {
                expect(() => new URL(s), `${id}: ${s}`).not.toThrow();
                expect(s, `${id}: ${s}`).toMatch(/^https?:\/\//);
            }
        }
    });

    // `why` is the owner's field and the research pipeline is never given it.
    // This is the guard that keeps a researcher's sentence out of his mouth.
    it("never carries a why", () => {
        for (const [id, r] of Object.entries(RESEARCH)) {
            expect(Object.keys(r), id).not.toContain("why");
        }
    });

    it("returns null for an unresearched id", () => {
        expect(researchFor("no-such-item")).toBeNull();
    });
});
```

- [ ] **Step 2: Run and watch it fail**

Run: `npx vitest run lib/collections/angles.test.ts`
Expected: FAIL — `Failed to resolve import "./research"`

- [ ] **Step 3: Write the module**

```ts
// lib/collections/research.ts

/* ============================================================
   THE CASE — what the world says about each object.

   Kept apart from the item files on purpose. Those are hand-authored and
   have to stay cheap to edit; this is machine-gathered, separately
   reviewable, and revertible on its own if a research pass goes wrong.

   `why` is NOT here and must never be added. That field is the owner's,
   and the integrity suite fails the build if this file grows one.
   ============================================================ */

export type Research = {
    /** One line: the object's place in the world. */
    standing?: string;
    /** Two to four sentences: what it is, what is distinctive, why it is
        collected. Absent when nothing could be established. */
    note?: string;
    /** Every URL actually read. Required whenever standing or note is set. */
    sources: string[];
    /** Category-specific facts, as strings, exactly as a source stated them. */
    specs?: Record<string, string>;
};

export const RESEARCH: Record<string, Research> = {
    // populated by the research pass — see Task 8
};

export function researchFor(id: string): Research | null {
    return RESEARCH[id] ?? null;
}
```

- [ ] **Step 4: Run and watch it pass**

Run: `npx vitest run lib/collections/angles.test.ts`
Expected: PASS (the loops are vacuous over an empty `RESEARCH`, which is correct — they arm for Task 8)

- [ ] **Step 5: Commit**

```bash
git add lib/collections/research.ts lib/collections/angles.test.ts
git commit -m "feat(collections): a home for researched notes, with provenance enforced"
```

---

## Task 4: `neighbours()` — prev and next within a drawer

**Files:**
- Modify: `lib/collections/index.ts`
- Create test: append to `lib/collections/filter.test.ts`

**Interfaces:**
- Consumes: `CategoryDef`, `sorted` from `./index`
- Produces: `neighbours(category: CategoryDef, id: string): { prev: AnyItem | null; next: AnyItem | null }`

- [ ] **Step 1: Write the failing test**

```ts
import { neighbours } from "./index";

describe("neighbours", () => {
    const watches = getCategory("watches")!;
    const order = sorted(watches.items).map((i) => i.id);

    it("gives the first item no previous", () => {
        expect(neighbours(watches, order[0]).prev).toBeNull();
        expect(neighbours(watches, order[0]).next?.id).toBe(order[1]);
    });

    it("gives the last item no next", () => {
        const last = order[order.length - 1];
        expect(neighbours(watches, last).next).toBeNull();
        expect(neighbours(watches, last).prev?.id).toBe(order[order.length - 2]);
    });

    it("walks the drawer's own order, and never wraps", () => {
        const seen: string[] = [];
        let cursor: string | null = order[0];
        while (cursor) {
            seen.push(cursor);
            cursor = neighbours(watches, cursor).next?.id ?? null;
            if (seen.length > order.length) break;
        }
        expect(seen).toEqual(order);
    });

    it("returns two nulls for an id not in the drawer", () => {
        expect(neighbours(watches, "not-a-real-id")).toEqual({
            prev: null,
            next: null,
        });
    });
});
```

- [ ] **Step 2: Run and watch it fail**

Run: `npx vitest run lib/collections/filter.test.ts`
Expected: FAIL — `neighbours is not a function`

- [ ] **Step 3: Implement**

```ts
/**
 * The item before and after this one *in the drawer's own order* — not the
 * filtered view's. A filter is a way of looking at the drawer, not a
 * reordering of it, so walking from an item lands you where you would be if
 * you had never filtered. Ends have one neighbour, never a wrap.
 */
export function neighbours(
    category: CategoryDef,
    id: string
): { prev: AnyItem | null; next: AnyItem | null } {
    const order = sorted(category.items);
    const at = order.findIndex((i) => i.id === id);
    if (at === -1) return { prev: null, next: null };
    return {
        prev: at > 0 ? order[at - 1] : null,
        next: at < order.length - 1 ? order[at + 1] : null,
    };
}
```

- [ ] **Step 4: Run and watch it pass**

Run: `npx vitest run lib/collections/filter.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add lib/collections/index.ts lib/collections/filter.test.ts
git commit -m "feat(collections): neighbours within a drawer"
```

---

## Task 5: The catalogue renders the canonical angle, and the compartment becomes a link

**Files:**
- Modify: `components/case/Compartment.tsx`
- Modify: `components/case/Tray.tsx`
- Modify: `components/case/Ledger.tsx`
- Modify: `components/case/DrawerFront.tsx`

**Interfaces:**
- Consumes: `canonicalAngle`, `shotPath` (Task 1); `shots` (Task 2)
- Produces: `Compartment` renders `<Link href={"/collections/" + category + "/" + item.id}>`; `Tray` no longer exports or accepts selection state

- [ ] **Step 1: Compartment — link, canonical shot only**

Replace the `<button>` with a `<Link>`, take a new `category` prop, and resolve the image through the canonical angle rather than a stored path:

```tsx
const canonical = canonicalAngle(category).key;
const src = item.shots.includes(canonical)
    ? shotPath(category, item.id, canonical)
    : null;
```

When `src` is null, render the existing type fallback. **Do not fall back to another angle** — a compartment showing a different angle from its neighbours is the defect this whole change exists to fix.

Keep: the `№NN`, the caption, `onPreview` on pointer-enter/leave and focus/blur, and `onKeyDown`. Drop: `aria-pressed`, `data-selected`, `onSelect`. The accessible name becomes `${numeral(item.seq)} ${item.brand} ${item.name}, ${formatPrice(item.price)}`.

- [ ] **Step 2: Tray — delete the pinned selection**

Remove the `selected` state, the `data-lifted` attribute, the `Escape` case in `onKeyDown`, and the `onClose` prop passed to `Ledger`. `preview` alone drives the slip. `focusCell` now queries `a.case-cell`, not `button.case-cell`.

- [ ] **Step 3: Ledger — the entry offers a way in, not a way out**

Replace the "Put it back / Esc" control with a typographic link to the item's page:

```tsx
<Link className="case-slip-open" href={`/collections/${category}/${item.id}`}>
    Open <span aria-hidden="true">→</span>
</Link>
```

`Ledger` takes a `category` prop for this. Delete `pinned` and `onClose`.

- [ ] **Step 4: DrawerFront — canonical shot only**

Same rule as the compartment: `frontRow` items render `shotPath(category.slug, item.id, canonical)` and an item without the canonical shot renders an empty slot rather than a different angle.

- [ ] **Step 5: Typecheck and test**

Run: `npx tsc --noEmit 2>&1 | grep -E "collections|case/"`
Expected: no output

Run: `npx vitest run`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add components/case app/\(collections\)
git commit -m "feat(collections): the compartment opens the object"
```

---

## Task 6: Vitrine, Dossier, Record, Neighbours

**Files:**
- Create: `components/case/Vitrine.tsx`, `components/case/Dossier.tsx`, `components/case/Record.tsx`, `components/case/Neighbours.tsx`

**Interfaces:**
- Consumes: `anglesFor`, `shotPath`, `angleLabel` (Task 1); `researchFor` (Task 3); `neighbours` (Task 4)
- Produces: four server components, no client JS

**Vitrine** — every angle in the category's vocabulary gets a frame, in order. A photographed angle shows the object; an unphotographed one shows a ruled blank carrying its label and the words `not photographed`. The frame count is the vocabulary's length, always, so the plate is a rectangle on every item.

**Record** — a `<dl>` over the category's full spec vocabulary. Every field appears; unknown ones render `—` in the muted voice with `data-blank`. Values come from the item first, then `researchFor(id).specs`, so a hand-entered value always beats a researched one.

**Dossier** — in order: `standing` (as a standfirst), `note` (the reading), `Record`, then **the owner's line last** — `why` if written, otherwise the ruled blank labelled *"Why this one — not written yet"*. Then the colophon: `sources` as an inline rule of links, each with `rel="noopener noreferrer"`, and a line stating that the notes are researched from public sources while the line above is the owner's.

**Neighbours** — two typographic links, prev and next, each showing `№NN` and the name. An end renders one side only.

- [ ] **Step 1: Write all four components**

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit 2>&1 | grep -E "collections|case/"`
Expected: no output

- [ ] **Step 3: Commit**

```bash
git add components/case
git commit -m "feat(collections): the vitrine and the dossier"
```

---

## Task 7: The showroom route and its CSS

**Files:**
- Create: `app/(collections)/collections/[category]/[id]/page.tsx`
- Modify: `app/globals.css` (append a showroom block below the existing case block)

- [ ] **Step 1: The route**

`generateStaticParams` over every category × item. `generateMetadata` titles it `<name> · <Category>`. Unknown id → `notFound()`. Composes: masthead (`← <Category>` return, `№NN`, name, brand line) → `Vitrine` → `Dossier` → `Neighbours` → `Rail active={category.slug}`.

- [ ] **Step 2: The CSS**

Append below the existing case block, stamped:

```css
/* Hallmark · macrostructure: Split Studio (Vitrine & Dossier)
 * genre: editorial · design-system: the .case token block above
 * nav: rail + masthead return · footer: Ft2 inline-rule colophon
 * enrichment: none — the objects are the imagery
 */
```

Diptych at ≥1000px: `grid-template-columns: minmax(0, 1.05fr) minmax(0, 1fr)`, vitrine sticky. Below 1000px it stacks, vitrine first. The vitrine plate is `repeat(2, minmax(0, 1fr))` with the same hairline ruling as `.case-grid`. Reuse `--plate`, `--room-deep`, `--rule`, `--ink-3`. No new tokens.

- [ ] **Step 3: Build and verify in the browser**

Run: `npm run dev` via the preview tool, open `/collections/watches/seiko-ssk035k1`, screenshot at 1280, 768, 375, 320.
Expected: no horizontal scroll, no console errors, the vitrine shows four labelled frames.

- [ ] **Step 4: Commit**

```bash
git add app components
git commit -m "feat(collections): a page per object"
```

---

## Task 8: Land the research

**Files:**
- Modify: `lib/collections/research.ts`

- [ ] **Step 1: Write the verified research into `RESEARCH`**

Only material that survived the adversarial verify pass. `standing` and `note` verbatim as corrected; `specs` minus every stripped key; `sources` as consulted. An item whose verdict was `UNUSABLE` gets no entry at all rather than a thin one.

- [ ] **Step 2: Run the provenance tests**

Run: `npx vitest run`
Expected: PASS — including "cites a source whenever it asserts anything" and "never carries a why", which are now non-vacuous.

- [ ] **Step 3: Commit**

```bash
git add lib/collections/research.ts
git commit -m "feat(collections): researched notes, verified against their sources"
```

---

## Task 9: Angle-aware image ingest

**Files:**
- Modify: `scripts/normalize-image.mjs`
- Modify: `scripts/incoming/*/README.md`

- [ ] **Step 1: Parse the angle out of the staged filename**

`collectIncoming` splits `<id>.<angle>.<ext>`. An unangled `<id>.<ext>` is treated as the category's canonical angle, so nothing already staged breaks. An angle not in the category's vocabulary is an error naming the valid keys.

The vocabulary is duplicated as a plain constant in the script with a comment pointing at `lib/collections/angles.ts` as the source of truth — the script is a standalone ESM tool and importing TypeScript into it would mean adding a build step to a script whose whole point is not having one.

- [ ] **Step 2: Angle-aware output and dedupe key**

`outputPath` becomes `<id>.<angle>.webp`; the segmentation key becomes `${category}__${id}__${angle}` so two angles of one item don't collide in the flat temp directory.

- [ ] **Step 3: Single-file mode takes `--angle`**

```bash
npm run normalize -- --category shoes --id adidas-samba-xlg --angle sole ~/Downloads/samba-sole.jpg
```

Defaults to the canonical angle when omitted.

- [ ] **Step 4: Verify with a dry run**

Run: `npm run normalize -- --dry-run`
Expected: `Nothing to do` (staging is empty and gitignored)

- [ ] **Step 5: Commit**

```bash
git add scripts
git commit -m "feat(collections): stage images per angle"
```

---

## Task 10: Source the additional angles

**Files:**
- Add: `public/images/collections/<category>/<id>.<angle>.webp`
- Modify: the data files' `shots` arrays

- [ ] **Step 1: Fetch the verified candidate image URLs**

Only URLs that survived research verification, only for the exact model and colourway. Anything that 403s, redirects to a placeholder, or cannot be confirmed as the right product is dropped.

- [ ] **Step 2: Normalise them**

```bash
npm run normalize
```

- [ ] **Step 3: Add each landed angle to the item's `shots`**

- [ ] **Step 4: Run the integrity suite**

Run: `npx vitest run`
Expected: PASS — every declared shot resolves to a file, every item with shots has its canonical one.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat(collections): additional angles where a source publishes them"
```

Angles that could not be sourced stay undeclared and render as labelled blanks. That is the designed behaviour, not a shortfall to hide.

---

## Task 11: Review and verify

- [ ] **Step 1: Full suite**

Run: `npx vitest run`
Expected: all green

- [ ] **Step 2: Production build**

Run: `COLLECTIONS_PASSWORD=x COLLECTIONS_SECRET=y npx next build`
Expected: clean; `/collections/[category]/[id]` listed as SSG with one entry per item

- [ ] **Step 3: Browser pass at 320 / 375 / 768 / 1280**

Index → drawer → showroom → prev/next → back. Check: no horizontal scroll, no two-line clickable text, focus ring visible on the compartment links, the vitrine's blanks legible.

- [ ] **Step 4: Adversarial review**

Dimensions: correctness · the canonical-angle rule actually holding · accessibility · honest copy (nothing invented) · Hallmark slop gates.

- [ ] **Step 5: Update the log and the original spec**

`.hallmark/log.json` gains the Split Studio entry. The 2026-09-04 spec gets a pointer to this one at the superseded decisions.

---

## Self-review

**Spec coverage.** Decision 9 → Task 1. Decision 10 → Tasks 1, 2 (test), 5. Decision 11 → Tasks 1, 2. Decision 12 → Tasks 3, 6, 8. Decision 13 → Task 6. Decision 14 → Tasks 3, 8. Decision 15 → Task 5. Decision 16 → Tasks 2, 6. Vitrine → Task 6. Layout → Task 7. Images → Tasks 9, 10. Testing → Tasks 1–4, 11. Every edge-case row has a home: unknown id (7), no canonical shot (5), bad angle (2), note without sources (3), no `why` (6), drawer ends (4), filtered drawer (4).

**Placeholders.** None. Every code step carries its code; the two narrative tasks (6, 7) specify component-by-component behaviour and the exact CSS shape.

**Type consistency.** `shots: string[]` is used identically in Tasks 2, 5, 6, 10. `canonicalAngle()` returns `Angle` and callers take `.key` everywhere. `researchFor()` returns `Research | null` and every consumer null-checks. `neighbours()` returns `{ prev, next }` in Tasks 4 and 6.

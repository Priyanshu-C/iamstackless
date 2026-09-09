---
name: add-to-the-case
description: Add a new object to The Case (/collections) — a watch, a shoe, or a perfume. Researches it from public sources, sources product photography for every angle in its category, normalises the images, writes the data entry, and runs the integrity suite. Use when Priyanshu says he has bought or acquired something, pastes a product link or a photograph of a new item, or asks to add something to the collection, the case, or a drawer.
---

# Add to The Case

One object, end to end: researched, photographed, framed, filed, checked.

The Case is a private catalogue at `/collections` with three drawers and a
page per object. Adding something means five things must end up true, and this
skill exists because doing them by hand is where mistakes happen.

**Read this whole file before touching anything.** The rules below are not
style preferences; several were written after a specific failure, and the
comment in the code will usually tell you which.

---

## The five rules

These outrank completeness, speed, and the user's impatience. Every one of
them was broken at least once during the original build.

### 1. Nothing is invented

If a source does not say it, the field is left off. A missing value renders as
a visible blank, and that is the intended behaviour — the blank is a to-do
list, not a defect. Never fill a spec from a sibling reference, a general
model page, or memory.

The failure to avoid: the Armani in this catalogue is *Stronger With You
Intensely*, a different fragrance from *Stronger With You*, with a different
base. A note pyramid was once written for it from the parent's data. It was
wrong in exactly the place the flanker differs.

### 2. `why` is the owner's

`price`, `acquired` and `why` are the three fields only Priyanshu knows.
Research must never write them, and `lib/collections/research.ts` has a test
asserting it never grows a `why`. If he tells you why he bought something, put
it in the item's `why`. Otherwise leave it out.

`price` is what he paid, not what a listing charges. Do not substitute MRP.

### 3. Every claim carries its source

`standing` and `note` in `research.ts` require a non-empty `sources` array.
Test-enforced. Two sources minimum, actually opened and read.

### 4. The catalogue renders the canonical angle and nothing else

Each category has a closed, ordered angle vocabulary in
`lib/collections/angles.ts`. The first entry is canonical, and the plate
renders that one or falls back to the item's name set in type. It never
substitutes a different angle.

The failure to avoid: every shoe was once labelled `lateral` in bulk without
anyone looking. Three pointed the wrong way and two were pairs. The plate read
as a jumble.

### 5. Look at every image before you trust it

Not the URL, not the alt text, not the agent's description. Render it and look.

The failure to avoid: `fimgs.net/himg/` is Fragrantica's *user-photo*
namespace, not the product one, and the same numeric ids resolve there to
completely different pictures. Seven bottles briefly became a flamingo
ornament, a stranger's face and a Coach gift set. `npm run sheet` caught it.

---

## What you need before starting

Ask for whatever is missing, in one message, then proceed:

- **Which drawer** — watches, shoes, or perfumes.
- **What it is** — brand and model, ideally the exact reference, style code or
  colourway. "The blue Seiko" is not enough; `SSK035K1` is.
- **What he paid**, if he wants it recorded. Optional.
- **When he got it** (`YYYY-MM`), if he wants it recorded. Optional.
- **Why he bought it**, in one line. Optional, and his alone.
- **Any photographs he took.** Optional, and they can beat press imagery —
  see Step 3.

If he pasted a product URL, read it first; it usually answers the first two.

---

## Step 1 · Pick the id and the seq

```
id    kebab-case, brand-then-model, stable forever. Never reused, never renamed
      once committed — the image filenames and the route both derive from it.
      seiko-ssk035k1 · adidas-samba-xlg · lattafa-khamrah-qahwa
seq   the next integer in that drawer. Never renumbered.
```

Read the existing file (`lib/collections/<category>.ts`) and take
`max(seq) + 1`. The header comment in each data file explains the convention;
follow it rather than restating it.

---

## Step 2 · Research it

Dispatch **one Sonnet subagent per object** — Sonnet is right for this, and one
agent per object is far more reliable than one agent for a batch. Give it a
JSON schema and these instructions:

- Load web tools first: `ToolSearch` with `select:WebSearch,WebFetch`.
- Open at least two pages and read them. Never answer from memory.
- Prefer, in order: the brand's own site → a major retailer that publishes
  specs (StockX, GOAT, Nike, Adidas, Seiko, Casio, Timex, Fragrantica,
  Nykaa) → a known enthusiast reference (Fratello, Hodinkee, Worn & Wound,
  Sneaker Freaker, Parfumo).
- Pair every claim with the URL supporting it. If it cannot be paired, delete
  the claim.
- `standing` is one line, max 18 words. `note` is 2–4 plain sentences.
- **No marketing language.** Not "iconic", "legendary", "must-have",
  "timeless", "elevate", "statement piece". Write like a museum catalogue.
- **An honest unremarkable entry beats an inflated one.** Several things in
  this catalogue are inexpensive mass-market products with no collector
  standing, and their notes say so plainly. That is the house voice.
- Never write about the owner or guess why he bought it.

Then read what came back and check it yourself against the cited pages before
writing it into `research.ts`. Watch specifically for a general line's facts
applied to a specific reference, a mineral crystal upgraded to sapphire, a
guessed release year, and opinion presented as fact.

Spec values are **values**, not sentences. `silhouette: "Samba XLG"`, never
`silhouette: "Samba XLG — an oversized reworking of the Samba OG"`. The
descriptive tail belongs in `note`.

---

## Step 3 · Get the photographs

Read `lib/collections/angles.ts` for the category's angle list. Aim for all of
them; a missing one renders as a labelled blank, which is fine.

**If he supplied his own photographs, look at those first.** They are not a
fallback. Beardo and The Man Company publish only marketing banners — a model
on a boat, "SMELL LIKE POWER" set in red — and his flat-lay on a bedsheet,
segmented and framed, is the better image. Use his whenever the alternative is
a banner. Use press imagery when it is a clean product shot.

### Sources that actually work

Verified during the original build. Most retailers return 403 to automated
fetching; these do not:

| Source | Pattern | Gives |
|---|---|---|
| **Fragrantica** | `https://fimgs.net/mdimg/perfume/o.<id>.jpg` — the id is the number in the perfume's Fragrantica URL | one clean bottle |
| **StockX** | `https://images.stockx.com/images/<Product-Slug>.jpg?w=1200&q=95&trim=color&fit=fill&bg=FFFFFF` | one clean lateral |
| **StockX 360** | `https://images.stockx.com/360/<slug>/Images/<slug>/Lv2/img<NN>.jpg` — `01` lateral, `19` medial. Only some products have a spin; probe before relying on it | a turntable |
| **Shopify stores** | `https://<store>/products.json?limit=250&page=N`, then read `products[].images[].src`. Works on beardo.in, seikousa.com, timexindia.com, lattafa-usa.com, rasasistore.com | full galleries |
| **Brand sites** | casio.com, armani.com, versace.com, us.afnan.com serve directly | multiple angles |
| **Tira, Myntra, Amazon** | open CDNs, good for Indian-market products | galleries |

**`fimgs.net/himg/` is the user-photo namespace. Never use it.**

When you cannot find a URL by pattern, open the product page in the browser
(`preview_start` / `navigate`) and pull image URLs out of the rendered DOM —
`<img src>`, `srcset`, `og:image`, or the JSON-LD product block. The browser
renders pages that return 403 to `curl` and `WebFetch`.

### Record every image in the manifest

Append to `scripts/shots.json`, one entry per image:

```json
{ "id": "seiko-ssk035k1", "category": "watches", "angle": "caseback",
  "url": "https://seikousa.com/cdn/shop/files/SSK035_3.png?width=1946",
  "page": "https://seikousa.com/products/ssk035" }
```

`page` is the provenance record. The catalogue cites its sources for prose;
imagery is no different, and a year from now you can check that the picture on
the Samba XLG page is really a Samba XLG.

Then:

```bash
npm run shots       # downloads into scripts/incoming/, skips 403s and HTML
npm run normalize   # segments, keeps the largest object, frames to 800px
```

His own photographs skip `shots` — stage them straight into
`scripts/incoming/<category>/<id>.<angle>.<ext>` and run `normalize`. If a
photograph holds several objects, crop each into its own frame first; the
normaliser keeps only the largest object it finds, so a sliver of a neighbour
is tolerated but a second whole object is not.

---

## Step 4 · Look at what you got

```bash
npm run sheet -- <category>
```

Open `scripts/sheets/<category>.jpg` and actually read it. Ask, per row:

- Is every shot in this row the **same view**? A lateral row must be all
  single shoes, same side, same direction. A dial row must be all straight-on
  with the bracelet folded, not splayed.
- Is the new object's **colourway and reference** right? The Samba XLG ships
  in a dozen colourways; the Mega Chief line has dozens of near-identical
  references.
- Is anything a **banner, a label card, a box when you wanted a bottle**, or a
  lifestyle shot with a model?

Anything that fails: delete the file, remove it from the manifest, and leave
the angle blank. **A labelled blank beats a wrong picture**, every time.

---

## Step 5 · Write it in, and check

Add the item to `lib/collections/<category>.ts` and, if researched, the entry
to `lib/collections/research.ts`. Then:

```bash
npx vitest run
```

The suite is the real guard — `next.config.mjs` sets
`typescript.ignoreBuildErrors`, so a malformed entry will not fail a build.
It checks that declared angles exist in the vocabulary, that every declared
shot resolves to a file, that nothing renders as `undefined`, that research
cites sources, that research carries no `why`, and that shots within an angle
share an aspect ratio.

**If the aspect-ratio check fails, believe it.** It has been right every time:
an Air Max SC labelled `lateral` at ratio 0.76 against a 2.03 median was a
top-down pair. Note the one exception, documented in `shots.test.ts` —
perfume bottles differ in shape by design and are exempt.

Then verify in the browser: the drawer, and the object's own page.

```bash
npm run dev
```

---

## Step 6 · Report

Tell him plainly:

- What went in, and which drawer.
- How many angles it has, and **which are blank and why** — "no source
  publishes a sole shot for a delisted colourway" is a useful sentence.
- Which of `price`, `acquired`, `why` are still empty, since only he can fill
  them.
- Anything the research could not establish.

Then commit. Do not push to `main` unless he asks — that deploys.

---

## When it goes wrong

**Session limits.** Fanning out many Opus agents at once will exhaust the
session. Use Sonnet for research and image-finding; keep concurrency low.

**`next build` while `next dev` is running** corrupts `.next` and produces
errors about `/favicon.ico` that have nothing to do with your change. Stop the
dev server and `rm -rf .next` first.

**A hidden browser pane freezes CSS transitions and smooth scrolling**, so a
screenshot can show a mid-transition state and `window.scrollTo` will not
move. Use `behavior: 'instant'`, or read the DOM instead of screenshotting.

**The design record** lives in `docs/superpowers/specs/` — the 2026-09-04
spec for the case and the 2026-09-09 spec for the showroom. If you make a
decision that contradicts either, amend the spec with the reason rather than
letting the code and the record disagree.

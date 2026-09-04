# The Case — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a password-gated `/collections` section cataloguing watches, shoes and perfumes, presented as a printer's type case.

**Architecture:** A Next.js route group gated by `middleware.ts` checking an HMAC-signed cookie. Collection data lives in typed TS modules under `lib/collections/`, read by React Server Components so item data never reaches the client bundle for a locked visitor. The UI is a compartment grid ("the tray") with a fixed bottom rail, styled by an append-only `.case-*` block in `app/globals.css`.

**Tech Stack:** Next.js 14 App Router, TypeScript (strict), framer-motion 11 (already a dependency), vitest (new dev dependency), Web Crypto API.

**Spec:** `docs/superpowers/specs/2026-09-04-collections-case-design.md`

## Global Constraints

- Room colour is `#e6e2da`. Hairlines use the existing `--line` token, `rgba(23, 20, 15, 0.14)`.
- **Fraunces must not appear anywhere inside `/collections`.** Space Grotesk only, at 10 / 11 / 14 / 24px, weights 400–500. Item name is 24px weight 400.
- Three motion primitives maximum: the lift, the rail underline slide, the tray stagger. All collapse to a ≤150ms opacity crossfade under `prefers-reduced-motion`.
- `app/globals.css` is **append-only**. Never remove or reorder the `@tailwind` directives or any existing rule.
- Auth crypto must use the **Web Crypto API** (`globalThis.crypto.subtle`), not `node:crypto` — `middleware.ts` runs on the Edge runtime where `node:crypto` is unavailable.
- The gate fails **closed**. A missing `COLLECTIONS_PASSWORD` or `COLLECTIONS_SECRET` means nobody can unlock; it must never mean everybody gets in.
- No item data may be invented. Data files ship with empty arrays and a commented worked example.
- Responsive floor: 320 / 375 / 414 / 768px. No horizontal scroll; image grid tracks use `minmax(0, 1fr)`.

---

## File Structure

| File | Responsibility |
|---|---|
| `lib/collections/types.ts` | `CollectionItem` spine + the three category types + `Category` union |
| `lib/collections/watches.ts` | Watch data only |
| `lib/collections/shoes.ts` | Shoe data only |
| `lib/collections/perfumes.ts` | Perfume data only |
| `lib/collections/index.ts` | Registry: category metadata, counts, lookup by slug, facet extraction, filter application |
| `lib/collections/auth.ts` | Sign / verify the unlock cookie. Pure, no framework imports. |
| `middleware.ts` | Gate `/collections/*` on the cookie |
| `app/(collections)/collections/layout.tsx` | Room chrome, `noindex`, the rail |
| `app/(collections)/collections/page.tsx` | Drawer index |
| `app/(collections)/collections/[category]/page.tsx` | One drawer: facets + tray |
| `app/(collections)/collections/unlock/page.tsx` | Lock screen + server action |
| `components/case/Tray.tsx` | Compartment grid + selection state (client) |
| `components/case/Compartment.tsx` | One object in its box |
| `components/case/Ledger.tsx` | The lifted item's data |
| `components/case/Rail.tsx` | Fixed bottom drawer switcher |
| `components/case/Facets.tsx` | Filter row, URL-backed |
| `app/robots.ts` | Disallow `/collections` |
| `lib/collections/__tests__/` | Data integrity, filter logic |
| `lib/collections/auth.test.ts` | Cookie signing round-trip, tamper, expiry, fail-closed |

---

### Task 1: Test harness, types, and the data registry

**Files:**
- Create: `lib/collections/types.ts`, `lib/collections/{watches,shoes,perfumes}.ts`, `lib/collections/index.ts`, `vitest.config.ts`
- Test: `lib/collections/data.test.ts`, `lib/collections/filter.test.ts`
- Modify: `package.json` (add `vitest`, add `"test": "vitest run"`)

**Interfaces:**
- Produces: `CollectionItem`, `Watch`, `Shoe`, `Perfume`, `Category`, `CATEGORIES`, `getCategory(slug)`, `facetsFor(category)`, `applyFilters(items, params)`

- [ ] **Step 1:** Add vitest as a dev dependency and a `test` script. Create `vitest.config.ts` resolving the `@/*` alias to the repo root so test imports match app imports.
- [ ] **Step 2:** Write `types.ts`. `CollectionItem` carries `id`, `seq`, `name`, `brand`, `acquired`, `price: { amount, currency }`, `why`, `image`. Category types extend it with the facets from the spec. Perfume `notes` is `{ top: string[]; heart: string[]; base: string[] }`.
- [ ] **Step 3:** Write the three data files exporting empty typed arrays, each with a commented worked example showing every field populated.
- [ ] **Step 4:** Write `data.test.ts` — asserts unique `id` and unique `seq` within each category, `acquired` matches `/^\d{4}-\d{2}$/` and parses, `why` is non-empty, and every `image` path resolves on disk. Must pass vacuously on empty arrays and catch a malformed entry once data exists.
- [ ] **Step 5:** Write `index.ts` — `CATEGORIES` array (slug, label, singular), `getCategory`, `facetsFor` (derives facet values from the actual items, so a facet with no values disappears), `applyFilters` (OR within a facet, AND across facets, reading `URLSearchParams`).
- [ ] **Step 6:** Write `filter.test.ts` covering OR-within / AND-across, empty filters returning everything, and unknown facet keys being ignored.
- [ ] **Step 7:** Run `npm test`. Expected: all pass.
- [ ] **Step 8:** Commit.

---

### Task 2: The cookie

**Files:**
- Create: `lib/collections/auth.ts`, `lib/collections/auth.test.ts`

**Interfaces:**
- Produces: `signSession(expiresAt: number, secret: string): Promise<string>`, `verifySession(token: string, secret: string, now?: number): Promise<boolean>`, `COOKIE_NAME`, `SESSION_TTL_MS`

Token format is `<expiresAt>.<base64url hmac-sha256 of expiresAt>`. Comparison is constant-time. `verifySession` returns `false` — never throws — on a malformed token, a bad signature, or an expired timestamp.

- [ ] **Step 1:** Write `auth.test.ts` first: round-trip verifies; a token signed with secret A fails under secret B; flipping a character in the signature fails; an `expiresAt` in the past fails; `"garbage"`, `""`, and `"1.2.3"` all return `false` rather than throwing.
- [ ] **Step 2:** Run `npm test`. Expected: FAIL, module not found.
- [ ] **Step 3:** Implement `auth.ts` using `crypto.subtle.importKey` + `sign` with HMAC SHA-256. Constant-time compare by XOR-accumulating byte differences over equal-length buffers.
- [ ] **Step 4:** Run `npm test`. Expected: PASS.
- [ ] **Step 5:** Commit.

---

### Task 3: The gate

**Files:**
- Create: `middleware.ts`, `app/(collections)/collections/unlock/page.tsx`, `app/(collections)/collections/unlock/actions.ts`
- Create: `.env.local` (gitignored) and `.env.example` (committed)

**Interfaces:**
- Consumes: `verifySession`, `signSession`, `COOKIE_NAME`, `SESSION_TTL_MS` from Task 2.

- [ ] **Step 1:** Write `middleware.ts` with `config.matcher` covering `/collections/:path*`. Verify the cookie; on failure redirect to `/collections/unlock?from=<pathname>`. The unlock route itself must be exempt — guard against a redirect loop.
- [ ] **Step 2:** Write the `unlock` server action: compare the submitted password against `process.env.COLLECTIONS_PASSWORD`; if either env var is unset, return the failure state (fail closed). On success, set the signed cookie `httpOnly`, `secure` in production, `sameSite: "lax"`, `path: "/collections"`, `maxAge` from `SESSION_TTL_MS`, then redirect to the `from` path (validated to start with `/collections` so it can't be used as an open redirect).
- [ ] **Step 3:** Write the lock screen: `The case is locked.` at 11px, one password input, Enter submits. Failure re-renders with `Not this one.` and no further detail. No logo, no explanation.
- [ ] **Step 4:** Write `.env.example` documenting both variables. Put a placeholder password in `.env.local`.
- [ ] **Step 5:** Verify by hand in the browser: `/collections` redirects to unlock; a wrong password shows `Not this one.`; the right password opens the case; the cookie survives a reload; `/collections/unlock` never loops.
- [ ] **Step 6:** Commit.

---

### Task 4: The case UI

**Files:**
- Create: `app/(collections)/collections/layout.tsx`, `page.tsx`, `[category]/page.tsx`
- Create: `components/case/{Tray,Compartment,Ledger,Rail,Facets}.tsx`

**Interfaces:**
- Consumes: `CATEGORIES`, `getCategory`, `facetsFor`, `applyFilters` from Task 1.

- [ ] **Step 1:** `layout.tsx` — the room. Sets `metadata.robots` to `{ index: false, follow: false }`, wraps children in `.case`, renders `<Rail />`.
- [ ] **Step 2:** `Rail.tsx` — a real `<nav>` with three links carrying live counts, stacked label/count pairs at 11px, active underline.
- [ ] **Step 3:** `page.tsx` — the drawer index: three drawer faces, each with category name, count and hairline, linking into the drawer.
- [ ] **Step 4:** `[category]/page.tsx` — `notFound()` on an unknown slug; reads `searchParams`, applies filters, renders `<Facets />` then `<Tray />`.
- [ ] **Step 5:** `Compartment.tsx` — a real `<button>` with an accessible label `"№07 Seiko SKX007 — show details"`. `next/image` with a typographic fallback when the image is missing or fails.
- [ ] **Step 6:** `Tray.tsx` — client component owning selection. Grid with `minmax(0, 1fr)` tracks. Arrow keys move, Enter lifts, Escape drops. Renders empty ruled compartments and `Nothing in this drawer yet.` when the category is empty, `No matches. Clear the filters.` when filters exclude everything.
- [ ] **Step 7:** `Ledger.tsx` — the lifted item's data at the sizes fixed in Global Constraints. Wrapped in `aria-live="polite"`.
- [ ] **Step 8:** `Facets.tsx` — client component writing filter state to the URL query string via `useRouter`/`useSearchParams`.
- [ ] **Step 9:** Commit.

---

### Task 5: The room, in CSS

**Files:**
- Modify: `app/globals.css` (append only)

- [ ] **Step 1:** Append a `.case-*` block: room background `#e6e2da`, tray grid, hairline compartment dividers, the lift transform, the fixed rail, the lock screen, and the `№` numerals at 10px.
- [ ] **Step 2:** Add responsive rules — two columns at ≤640px, the ledger becoming a bottom sheet, the rail staying fixed.
- [ ] **Step 3:** Extend the existing `prefers-reduced-motion` block to cover `.case`.
- [ ] **Step 4:** Commit.

---

### Task 6: The quiet door

**Files:**
- Modify: `lib/content.ts` (footer data), `components/foundry/Sections.tsx` (`Foot`)
- Create: `app/robots.ts`

- [ ] **Step 1:** Add a `Collections` link to the footer links row in `Foot`. Footer only — never the main nav.
- [ ] **Step 2:** Write `app/robots.ts` disallowing `/collections`, allowing everything else, and pointing at the sitemap if one exists.
- [ ] **Step 3:** Commit.

---

### Task 7: Verification

- [ ] **Step 1:** `npm test` — all green.
- [ ] **Step 2:** `npm run build` — succeeds. Note that `next.config.mjs` ignores TS and ESLint errors during builds, so also run `npx tsc --noEmit` and read the output for anything touching `lib/collections`, `components/case`, or `middleware.ts`.
- [ ] **Step 3:** Run the dev server. Verify locked → unlock → open, then each drawer, the lift, Escape, keyboard traversal, and a filter round-trip through the URL.
- [ ] **Step 4:** Screenshot at 1440 and at 375. Confirm no horizontal scroll and no two-line clickable text.
- [ ] **Step 5:** Confirm Fraunces does not resolve on any element inside `/collections`.
- [ ] **Step 6:** Commit.

---

## Self-Review

**Spec coverage.** Routes → T4. Gate → T2, T3. Data model → T1. Images → T4 step 5 (fallback) and the empty-data reality. Components → T4. Interaction → T4, T5. Accessibility → T4 steps 5–7. Error handling: every row of the spec's table maps to T3 step 2 (fail closed, wrong password), T4 step 4 (unknown slug), T4 step 6 (empty, no matches), T4 step 5 (broken image), T3 step 1 (missing cookie). Testing → T1, T2, T7.

**Type consistency.** `applyFilters` / `facetsFor` / `getCategory` / `CATEGORIES` are named identically in T1 and T4. `signSession` / `verifySession` / `COOKIE_NAME` / `SESSION_TTL_MS` identical in T2 and T3.

**Gap found and closed.** The spec requires the data-integrity test to run in CI because `next build` ignores type errors, but no task ran `tsc`. T7 step 2 now does.

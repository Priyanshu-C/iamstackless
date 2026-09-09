import { existsSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { CATEGORIES } from "./index";
import { shotPath } from "./angles";
import {
    formatAcquired,
    formatPrice,
    itemFacts,
    itemSpec,
} from "../../components/case/format";

const PUBLIC = path.resolve(__dirname, "../../public");

/* These run over the real data files. next.config.mjs sets
   typescript.ignoreBuildErrors, so `next build` will happily ship a malformed
   entry — this suite is the actual guard. It must run in CI. */

describe.each(CATEGORIES)("$label", (category) => {
    it("has a unique id for every item", () => {
        const ids = category.items.map((i) => i.id);
        expect(new Set(ids).size).toBe(ids.length);
    });

    it("has a unique seq for every item", () => {
        const seqs = category.items.map((i) => i.seq);
        expect(new Set(seqs).size).toBe(seqs.length);
    });

    it("uses a positive integer seq", () => {
        for (const item of category.items) {
            expect(Number.isInteger(item.seq), item.id).toBe(true);
            expect(item.seq, item.id).toBeGreaterThan(0);
        }
    });

    // `acquired` and `why` are personal facts, supplied by hand and never
    // invented, so an item may legitimately not carry them yet. Validate the
    // shape only when a value is actually present.
    it("records acquired as a real YYYY-MM when present", () => {
        for (const item of category.items) {
            if (item.acquired === undefined) continue;
            expect(item.acquired, item.id).toMatch(/^\d{4}-(0[1-9]|1[0-2])$/);
            expect(
                Number.isNaN(Date.parse(`${item.acquired}-01`)),
                item.id
            ).toBe(false);
        }
    });

    // Price is optional for the same reason `acquired` and `why` are: only
    // the owner knows it, and a listing's price is not what he paid. Validate
    // the shape when it is there; absence is legitimate.
    it("records a price above zero when it records one at all", () => {
        for (const item of category.items) {
            if (item.price === undefined) continue;
            expect(item.price.amount, item.id).toBeGreaterThan(0);
            expect(["INR", "USD"], item.id).toContain(item.price.currency);
        }
    });

    it("never carries a blank why (absent is fine, empty is not)", () => {
        for (const item of category.items) {
            if (item.why === undefined) continue;
            expect(item.why.trim(), item.id).not.toBe("");
        }
    });

    it("points every shot at a file that exists", () => {
        for (const item of category.items) {
            for (const angle of item.shots) {
                const rel = shotPath(category.slug, item.id, angle);
                expect(
                    existsSync(path.join(PUBLIC, rel)),
                    `${item.id} ${angle} -> ${rel}`
                ).toBe(true);
            }
        }
    });
});

/* Optional fields are the norm in this catalogue — price, acquired, why,
   volume, size, and every researched spec may legitimately be absent. Any
   line that interpolates one without checking renders the string
   "undefined" to a real reader, which is the failure mode this catches. */
describe("nothing renders as 'undefined'", () => {
    const items = CATEGORIES.flatMap((c) => c.items);

    it("in the short facts line", () => {
        for (const item of items) {
            const line = itemFacts(item).join(" · ");
            expect(line, item.id).not.toMatch(/undefined|null|NaN/);
        }
    });

    it("in the long spec line", () => {
        for (const item of items) {
            const spec = itemSpec(item);
            if (!spec) continue;
            expect(spec.value, item.id).not.toMatch(/undefined|null|NaN/);
            expect(spec.value.trim(), item.id).not.toBe("");
        }
    });

    it("in a formatted price or date", () => {
        for (const item of items) {
            const price = formatPrice(item.price);
            if (price !== null) {
                expect(price, item.id).not.toMatch(/undefined|NaN/);
            }
            const acquired = formatAcquired(item.acquired);
            if (acquired !== null) {
                expect(acquired, item.id).not.toMatch(/undefined|NaN|Invalid/);
            }
        }
    });
});

import { existsSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { CATEGORIES } from "./index";

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

    it("records acquired as a real YYYY-MM", () => {
        for (const item of category.items) {
            expect(item.acquired, item.id).toMatch(/^\d{4}-(0[1-9]|1[0-2])$/);
            expect(
                Number.isNaN(Date.parse(`${item.acquired}-01`)),
                item.id
            ).toBe(false);
        }
    });

    it("records a price above zero", () => {
        for (const item of category.items) {
            expect(item.price.amount, item.id).toBeGreaterThan(0);
        }
    });

    it("answers why", () => {
        for (const item of category.items) {
            expect(item.why.trim(), item.id).not.toBe("");
        }
    });

    it("points image at a file that exists", () => {
        for (const item of category.items) {
            expect(item.image, item.id).toMatch(
                new RegExp(`^/images/collections/${category.slug}/`)
            );
            expect(
                existsSync(path.join(PUBLIC, item.image)),
                `${item.id}: missing ${item.image}`
            ).toBe(true);
        }
    });
});

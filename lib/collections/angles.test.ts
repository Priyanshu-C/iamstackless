import { describe, expect, it } from "vitest";
import {
    ANGLES,
    anglesFor,
    angleLabel,
    canonicalAngle,
    catalogueShot,
    shotPath,
} from "./angles";
import { CATEGORIES } from "./index";
import { RESEARCH, researchFor } from "./research";

describe("the angle vocabulary", () => {
    it("gives every category an ordered list worth having", () => {
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

    it("labels a known angle and refuses an unknown one", () => {
        expect(angleLabel("watches", "caseback")).toBe("Caseback");
        expect(angleLabel("watches", "lateral")).toBeNull();
    });

    it("lists angles in declaration order", () => {
        expect(anglesFor("shoes").map((a) => a.key)).toEqual([
            "lateral",
            "medial",
            "top",
            "sole",
        ]);
    });
});

describe("the catalogue shot", () => {
    it("is the canonical angle when the item has it", () => {
        expect(catalogueShot("shoes", "x", ["lateral", "sole"])).toBe(
            "/images/collections/shoes/x.lateral.webp"
        );
    });

    // The point of the whole module. An item photographed only from below
    // must not appear in the plate showing its sole while everything beside
    // it shows a lateral — it falls back to type instead.
    it("is null — never another angle — when the canonical is missing", () => {
        expect(catalogueShot("shoes", "x", ["sole", "top"])).toBeNull();
        expect(catalogueShot("shoes", "x", [])).toBeNull();
    });
});

describe.each(CATEGORIES)("$label shots", (category) => {
    it("declares only angles its category knows about", () => {
        const known = new Set(anglesFor(category.slug).map((a) => a.key));
        for (const item of category.items) {
            for (const angle of item.shots) {
                expect(known.has(angle), `${item.id}: "${angle}"`).toBe(true);
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

    it("never repeats an angle on one item", () => {
        for (const item of category.items) {
            expect(new Set(item.shots).size, item.id).toBe(item.shots.length);
        }
    });
});

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
                expect(s, `${id}: ${s}`).toMatch(/^https?:\/\//);
                expect(() => new URL(s), `${id}: ${s}`).not.toThrow();
            }
        }
    });

    // `why` is the owner's field. The research pipeline is never given it,
    // and this is the guard that keeps a researcher's sentence out of his
    // mouth if someone later wires the two together by accident.
    it("never carries a why", () => {
        for (const [id, r] of Object.entries(RESEARCH)) {
            expect(Object.keys(r), id).not.toContain("why");
        }
    });

    it("returns null for an unresearched id", () => {
        expect(researchFor("no-such-item")).toBeNull();
    });
});

import { describe, expect, it } from "vitest";
import { applyFilters, facetsFor, getCategory } from "./index";
import type { CategoryDef } from "./index";
import type { Perfume } from "./types";

function perfume(id: string, conc: Perfume["concentration"], notes: string[]) {
    return {
        id,
        seq: 1,
        name: id,
        brand: "b",
        acquired: "2024-01",
        price: { amount: 1, currency: "INR" as const },
        why: "w",
        image: `/images/collections/perfumes/${id}.webp`,
        house: "h",
        concentration: conc,
        notes: { top: notes, heart: [], base: [] },
        volume: 50,
    } satisfies Perfume;
}

/** A category standing in for the real perfumes drawer, so the filter tests
    do not depend on what happens to be in the collection today. */
function fixture(): CategoryDef {
    const base = getCategory("perfumes")!;
    return {
        ...base,
        items: [
            perfume("a", "EDP", ["vetiver", "cypress"]),
            perfume("b", "EDT", ["vetiver"]),
            perfume("c", "EDP", ["rose"]),
        ],
    };
}

describe("applyFilters", () => {
    it("returns everything when nothing is selected", () => {
        expect(applyFilters(fixture(), {})).toHaveLength(3);
    });

    it("ORs multiple values within one facet", () => {
        const got = applyFilters(fixture(), { note: ["rose", "cypress"] });
        expect(got.map((i) => i.id).sort()).toEqual(["a", "c"]);
    });

    it("ANDs across facets", () => {
        const got = applyFilters(fixture(), {
            note: "vetiver",
            concentration: "EDP",
        });
        expect(got.map((i) => i.id)).toEqual(["a"]);
    });

    it("accepts a single value as a bare string", () => {
        expect(applyFilters(fixture(), { concentration: "EDT" })).toHaveLength(
            1
        );
    });

    it("ignores facet keys the category does not define", () => {
        expect(applyFilters(fixture(), { nonsense: "x" })).toHaveLength(3);
    });

    it("can exclude everything", () => {
        expect(applyFilters(fixture(), { note: "oud" })).toHaveLength(0);
    });
});

describe("facetsFor", () => {
    it("derives values from the items present", () => {
        const facets = facetsFor(fixture());
        const notes = facets.find((f) => f.key === "note");
        expect(notes?.values).toEqual(["cypress", "rose", "vetiver"]);
    });

    it("drops facets no item has a value for", () => {
        const empty = { ...fixture(), items: [] };
        expect(facetsFor(empty)).toEqual([]);
    });
});

describe("facets with missing values", () => {
    it("omits an item that has no value for a facet, rather than showing 'undefined'", () => {
        const base = getCategory("watches")!;
        const watch = (id: string, caseSize?: number) => ({
            id,
            seq: 1,
            name: id,
            brand: "b",
            price: { amount: 1, currency: "INR" as const },
            image: `/images/collections/watches/${id}.webp`,
            movement: "quartz" as const,
            reference: "r",
            ...(caseSize === undefined ? {} : { caseSize }),
        });
        const category = {
            ...base,
            items: [watch("has-size", 42), watch("no-size")],
        };
        const caseFacet = facetsFor(category).find((f) => f.key === "caseSize");
        expect(caseFacet?.values).toEqual(["42mm"]);
        expect(caseFacet?.values.join()).not.toMatch(/undefined/);
    });
});

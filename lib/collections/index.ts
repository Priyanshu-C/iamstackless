import type { AnyItem, CategorySlug, Perfume, Shoe, Watch } from "./types";
import { perfumes } from "./perfumes";
import { shoes } from "./shoes";
import { watches } from "./watches";

/** A filterable attribute of a category. `get` returns every value the item
    carries for this facet — one for a scalar, many for something like notes. */
export type FacetDef = {
    key: string;
    label: string;
    get: (item: never) => string[];
};

export type CategoryDef = {
    slug: CategorySlug;
    label: string;
    /** Used in the empty state: "Nothing in this drawer yet." reads better
        per-category as "No watches in this drawer yet." */
    noun: string;
    items: AnyItem[];
    facets: FacetDef[];
};

/** Values actually present in the data, ready to render as filter controls. */
export type Facet = { key: string; label: string; values: string[] };

const one = (v: string | number) => [String(v)];

export const CATEGORIES: CategoryDef[] = [
    {
        slug: "watches",
        label: "Watches",
        noun: "watches",
        items: watches,
        facets: [
            {
                key: "movement",
                label: "Movement",
                get: (i: Watch) => one(i.movement),
            },
            {
                key: "caseSize",
                label: "Case",
                get: (i: Watch) => one(`${i.caseSize}mm`),
            },
        ] as FacetDef[],
    },
    {
        slug: "shoes",
        label: "Shoes",
        noun: "shoes",
        items: shoes,
        facets: [
            {
                key: "material",
                label: "Material",
                get: (i: Shoe) => one(i.material),
            },
            { key: "size", label: "Size", get: (i: Shoe) => one(i.size) },
        ] as FacetDef[],
    },
    {
        slug: "perfumes",
        label: "Perfumes",
        noun: "perfumes",
        items: perfumes,
        facets: [
            {
                key: "concentration",
                label: "Concentration",
                get: (i: Perfume) => one(i.concentration),
            },
            {
                key: "note",
                label: "Note",
                get: (i: Perfume) => [
                    ...i.notes.top,
                    ...i.notes.heart,
                    ...i.notes.base,
                ],
            },
        ] as FacetDef[],
    },
];

export function getCategory(slug: string): CategoryDef | undefined {
    return CATEGORIES.find((c) => c.slug === slug);
}

/** Newest acquisition first. `seq` still carries the original chronology. */
export function sorted(items: AnyItem[]): AnyItem[] {
    return [...items].sort((a, b) => b.acquired.localeCompare(a.acquired));
}

/** Only facets that some item actually has a value for. A drawer with no
    quartz watches in it should not offer a Quartz filter. */
export function facetsFor(category: CategoryDef): Facet[] {
    return category.facets
        .map((f) => {
            const values = new Set<string>();
            for (const item of category.items) {
                for (const v of f.get(item as never)) if (v) values.add(v);
            }
            return {
                key: f.key,
                label: f.label,
                values: Array.from(values).sort((a, b) =>
                    a.localeCompare(b, undefined, { numeric: true })
                ),
            };
        })
        .filter((f) => f.values.length > 0);
}

export type SearchParams = Record<string, string | string[] | undefined>;

function selected(params: SearchParams, key: string): string[] {
    const raw = params[key];
    if (raw === undefined) return [];
    return (Array.isArray(raw) ? raw : [raw]).filter(Boolean);
}

/** OR within a facet, AND across facets. Unknown keys are ignored. */
export function applyFilters(
    category: CategoryDef,
    params: SearchParams
): AnyItem[] {
    const active = category.facets
        .map((f) => ({ f, want: selected(params, f.key) }))
        .filter((a) => a.want.length > 0);

    if (active.length === 0) return category.items;

    return category.items.filter((item) =>
        active.every(({ f, want }) => {
            const has = f.get(item as never);
            return want.some((w) => has.includes(w));
        })
    );
}

export function activeFilterCount(
    category: CategoryDef,
    params: SearchParams
): number {
    return category.facets.reduce(
        (n, f) => n + selected(params, f.key).length,
        0
    );
}

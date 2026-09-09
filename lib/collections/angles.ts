import type { CategorySlug } from "./types";

/* ============================================================
   THE CASE — how an object is looked at.

   The list per category is closed and ordered, and the first entry is the
   canonical angle. The catalogue renders the canonical angle and nothing
   else — never "the first shot that happens to exist". That is the whole
   mechanism: it is what stops one drawer showing a shoe from the side and
   the next showing one from above.

   This module is the only place an angle key may be named.
   ============================================================ */

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

/** The one the plate renders. */
export function canonicalAngle(category: CategorySlug): Angle {
    return ANGLES[category][0];
}

export function angleLabel(
    category: CategorySlug,
    angle: string
): string | null {
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

/** The catalogue's shot for an item, or null when it has not been
    photographed from the canonical angle yet. Returning null rather than
    falling back to another angle is deliberate: a compartment showing a
    different angle from its neighbours is the defect this exists to prevent. */
export function catalogueShot(
    category: CategorySlug,
    id: string,
    shots: string[]
): string | null {
    const canonical = canonicalAngle(category).key;
    return shots.includes(canonical) ? shotPath(category, id, canonical) : null;
}

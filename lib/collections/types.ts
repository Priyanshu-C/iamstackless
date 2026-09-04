/* ============================================================
   THE CASE — the shape of a collected thing.
   A ledger entry: five facts, one photograph, one line of why.
   ============================================================ */

export type Currency = "INR" | "USD";

export type CollectionItem = {
    /** Stable slug. Never reused, never renamed once published. */
    id: string;
    /** Acquisition order within the category. Renders as №NN. Never renumbered. */
    seq: number;
    name: string;
    brand: string;
    /** "YYYY-MM" — the month it was acquired. */
    acquired: string;
    /** What was actually paid. No conversion is performed. */
    price: { amount: number; currency: Currency };
    /** One line. Why this one, and not another. */
    why: string;
    /** /images/collections/<category>/<id>.webp */
    image: string;
};

export type Watch = CollectionItem & {
    movement: "automatic" | "quartz" | "manual";
    /** Case diameter in millimetres. */
    caseSize: number;
    reference: string;
};

export type Shoe = CollectionItem & {
    size: string;
    material: string;
    colourway: string;
};

export type Perfume = CollectionItem & {
    house: string;
    concentration: "EDT" | "EDP" | "parfum";
    notes: { top: string[]; heart: string[]; base: string[] };
    /** Bottle size in millilitres. */
    volume: number;
};

export type AnyItem = Watch | Shoe | Perfume;

export type CategorySlug = "watches" | "shoes" | "perfumes";

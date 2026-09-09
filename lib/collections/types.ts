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
    /** "YYYY-MM" — the month it was acquired. Optional: only Priyanshu knows
        this, so an item can sit in the case before the date is filled in. */
    acquired?: string;
    /** What was actually paid. No conversion is performed. */
    price: { amount: number; currency: Currency };
    /** One line. Why this one, and not another. Optional for the same reason
        as `acquired` — it is never invented, only supplied. */
    why?: string;
    /** Which angles have been photographed, as keys from the category's
        vocabulary in `angles.ts`. The path is derived, never written here.

        The canonical angle must be present if any angle is: the catalogue
        renders only that one, so an item missing it falls back to its name
        set in type rather than showing a different angle from its
        neighbours. The integrity suite enforces this. */
    shots: string[];
};

/* The fields below the spine are sourced from a public listing when a source
   states them, and absent when none does. Absence is legitimate and renders
   as a ruled blank in the record — a spec sheet that hides what it does not
   know tells you nothing about what is missing. */

export type Watch = CollectionItem & {
    movement: "automatic" | "quartz" | "manual";
    /** Case diameter in millimetres, where the source states it. */
    caseSize?: number;
    reference: string;
    caseMaterial?: string;
    crystal?: string;
    waterResistance?: string;
    calibre?: string;
    lugWidth?: string;
    powerReserve?: string;
    released?: string;
};

export type Shoe = CollectionItem & {
    /** The size actually owned — a fact about the pair, not the listing, so
        it is supplied by hand rather than scraped. */
    size?: string;
    /** Where the listing states it. */
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
    /** Bottle size in millilitres. */
    volume: number;
    perfumer?: string;
    released?: string;
};

export type AnyItem = Watch | Shoe | Perfume;

export type CategorySlug = "watches" | "shoes" | "perfumes";

import type { AnyItem, CollectionItem, Currency } from "@/lib/collections/types";

export function numeral(seq: number): string {
    return `№${String(seq).padStart(2, "0")}`;
}

/** A ledger reports what was paid. Rounding $64.96 to $65 would be a small
    lie, so the fractional unit survives whenever the amount has one. */
export function formatAmount(amount: number, currency: Currency): string {
    const fractional = Math.round(amount * 100) % 100 !== 0;
    return new Intl.NumberFormat(currency === "INR" ? "en-IN" : "en-US", {
        style: "currency",
        currency,
        minimumFractionDigits: fractional ? 2 : 0,
        maximumFractionDigits: fractional ? 2 : 0,
    }).format(amount);
}

export function formatPrice(price: CollectionItem["price"]): string {
    return formatAmount(price.amount, price.currency);
}

export function formatAcquired(acquired: string | undefined): string | null {
    if (!acquired) return null;
    const date = new Date(`${acquired}-01T00:00:00Z`);
    if (Number.isNaN(date.getTime())) return acquired;
    return new Intl.DateTimeFormat("en-GB", {
        month: "long",
        year: "numeric",
        timeZone: "UTC",
    }).format(date);
}

/** "2023-08" → "Aug 2023". The short form, for lines that carry a range. */
export function formatMonth(month: string): string {
    const date = new Date(`${month}-01T00:00:00Z`);
    if (Number.isNaN(date.getTime())) return month;
    return new Intl.DateTimeFormat("en-GB", {
        month: "short",
        year: "numeric",
        timeZone: "UTC",
    }).format(date);
}

const sentence = (v: string) => v[0].toUpperCase() + v.slice(1);

/** The short facts, in the order they read best. Brand leads; two more at
    most, so the line never wraps in the slip. */
export function itemFacts(item: AnyItem): string[] {
    const facts: string[] = [item.brand];
    if ("movement" in item) {
        facts.push(sentence(item.movement));
        if (item.caseSize) facts.push(`${item.caseSize}mm`);
    } else if ("colourway" in item) {
        if (item.material) facts.push(item.material);
        if (item.size) facts.push(item.size);
    } else if ("concentration" in item) {
        facts.push(item.concentration, `${item.volume}ml`);
    }
    return facts;
}

/** The long identifier — the fact that actually distinguishes this one from
    the next one on the shelf. It was being collected and never shown. */
export function itemSpec(item: AnyItem): { label: string; value: string } | null {
    if ("reference" in item) return { label: "Ref", value: item.reference };
    if ("colourway" in item)
        return { label: "Colourway", value: item.colourway };
    if ("notes" in item) {
        const tiers = [
            item.notes.top,
            item.notes.heart,
            item.notes.base,
        ].filter((t) => t.length > 0);
        if (tiers.length === 0) return null;
        return { label: "Notes", value: tiers.map((t) => t.join(", ")).join(" · ") };
    }
    return null;
}

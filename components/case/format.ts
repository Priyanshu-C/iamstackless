import type { AnyItem, CollectionItem } from "@/lib/collections/types";

export function numeral(seq: number): string {
    return `№${String(seq).padStart(2, "0")}`;
}

export function formatPrice(price: CollectionItem["price"]): string {
    return new Intl.NumberFormat(price.currency === "INR" ? "en-IN" : "en-US", {
        style: "currency",
        currency: price.currency,
        maximumFractionDigits: 0,
    }).format(price.amount);
}

export function formatAcquired(acquired: string): string {
    const date = new Date(`${acquired}-01T00:00:00Z`);
    if (Number.isNaN(date.getTime())) return acquired;
    return new Intl.DateTimeFormat("en-GB", {
        month: "long",
        year: "numeric",
        timeZone: "UTC",
    }).format(date);
}

/** The category-specific facts, in the order they read best. */
export function itemFacts(item: AnyItem): string[] {
    const facts: string[] = [item.brand];
    if ("movement" in item) {
        facts.push(
            item.movement[0].toUpperCase() + item.movement.slice(1),
            `${item.caseSize}mm`
        );
    } else if ("material" in item) {
        facts.push(item.material, item.size);
    } else if ("concentration" in item) {
        facts.push(item.concentration, `${item.volume}ml`);
    }
    return facts;
}

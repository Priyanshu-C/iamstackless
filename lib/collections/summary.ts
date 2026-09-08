import type { CategoryDef } from "./index";
import type { AnyItem, Currency } from "./types";

/** What a drawer knows about itself. Every figure is counted from the items
    actually present — nothing here is estimated, and nothing is invented. */
export type DrawerSummary = {
    count: number;
    /** Most-owned brand first, then alphabetical. */
    brands: { name: string; count: number }[];
    /** One total per currency actually present. No conversion is performed:
        the number shown is the sum of the numbers paid. */
    spend: { currency: Currency; amount: number }[];
    /** "YYYY-MM" bounds across the items that carry a date, or null when none
        of them do yet. */
    span: { first: string; last: string } | null;
    /** Items still waiting for their one line of why. */
    unnoted: number;
    /** How many carry an acquisition date — which decides how the drawer is
        actually ordered, and therefore what the page may claim about it. */
    dated: number;
};

export function summarise(items: AnyItem[]): DrawerSummary {
    const brands = new Map<string, number>();
    const spend = new Map<Currency, number>();
    const dates: string[] = [];
    let unnoted = 0;

    for (const item of items) {
        brands.set(item.brand, (brands.get(item.brand) ?? 0) + 1);
        spend.set(
            item.price.currency,
            (spend.get(item.price.currency) ?? 0) + item.price.amount
        );
        if (item.acquired) dates.push(item.acquired);
        if (!item.why) unnoted += 1;
    }

    dates.sort();

    return {
        count: items.length,
        brands: Array.from(brands, ([name, count]) => ({ name, count })).sort(
            (a, b) => b.count - a.count || a.name.localeCompare(b.name)
        ),
        spend: Array.from(spend, ([currency, amount]) => ({
            currency,
            amount,
        })).sort((a, b) => b.amount - a.amount),
        span:
            dates.length > 0
                ? { first: dates[0], last: dates[dates.length - 1] }
                : null,
        unnoted,
        dated: dates.length,
    };
}

/** The first few objects, for the drawer fronts on the index. Takes them in
    the order they were acquired so a front reads as the drawer's history
    rather than as whatever sorted to the top today. */
export function frontRow(category: CategoryDef, take: number): AnyItem[] {
    return [...category.items].sort((a, b) => a.seq - b.seq).slice(0, take);
}

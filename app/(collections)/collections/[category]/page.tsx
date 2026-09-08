import { notFound } from "next/navigation";
import Facets from "@/components/case/Facets";
import Rail from "@/components/case/Rail";
import Tray from "@/components/case/Tray";
import {
    applyFilters,
    CATEGORIES,
    facetsFor,
    getCategory,
    sorted,
    type SearchParams,
} from "@/lib/collections";
import { summarise } from "@/lib/collections/summary";

/** The drawer sorts newest-acquired first and drops undated items to the end.
    With no dates on file it falls back to the order things were added — so the
    line has to say which of those you are actually looking at. */
function ordering(total: number, dated: number): string {
    if (dated === 0) return "In the order they were added.";
    if (dated === total) return "Newest first.";
    return "Newest first, then the ones with no date yet.";
}

export function generateStaticParams() {
    return CATEGORIES.map((c) => ({ category: c.slug }));
}

export function generateMetadata({
    params,
}: {
    params: { category: string };
}) {
    const category = getCategory(params.category);
    return { title: category?.label ?? "Not found" };
}

export default function Drawer({
    params,
    searchParams,
}: {
    params: { category: string };
    searchParams: SearchParams;
}) {
    const category = getCategory(params.category);
    if (!category) notFound();

    const matched = applyFilters(category, searchParams);
    const items = sorted(matched);
    const facets = facetsFor(category, searchParams);
    // The summary describes what you are looking at, so it follows the filter.
    const summary = summarise(matched);

    return (
        <main className="case-room">
            <header className="case-masthead">
                <h1 className="case-title">{category.label}</h1>
                <p className="case-standfirst">
                    {category.items.length === 0
                        ? "Labelled and waiting."
                        : ordering(category.items.length, summary.dated)}
                </p>
            </header>

            <Facets
                facets={facets}
                shown={items.length}
                total={category.items.length}
            />
            <Tray
                items={items}
                summary={summary}
                noun={category.noun}
                filtered={items.length !== category.items.length}
            />
            <Rail active={category.slug} />
        </main>
    );
}

import { notFound } from "next/navigation";
import Facets from "@/components/case/Facets";
import Rail from "@/components/case/Rail";
import Tray from "@/components/case/Tray";
import {
    activeFilterCount,
    applyFilters,
    CATEGORIES,
    facetsFor,
    getCategory,
    sorted,
    type SearchParams,
} from "@/lib/collections";

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

    const items = sorted(applyFilters(category, searchParams));
    const filtered = activeFilterCount(category, searchParams) > 0;

    return (
        <main className="case-room">
            <header className="case-head">
                <p className="case-label">{category.label}</p>
                <p className="case-label case-head-sub">
                    {filtered
                        ? `${items.length} of ${category.items.length}`
                        : `${category.items.length}`}
                </p>
            </header>

            <Facets facets={facetsFor(category)} />
            <Tray items={items} filtered={filtered} />
            <Rail active={category.slug} />
        </main>
    );
}

import Link from "next/link";
import { notFound } from "next/navigation";
import Dossier from "@/components/case/Dossier";
import { itemFacts, numeral } from "@/components/case/format";
import Neighbours from "@/components/case/Neighbours";
import Rail from "@/components/case/Rail";
import Vitrine from "@/components/case/Vitrine";
import { CATEGORIES, getCategory, getItem, neighbours } from "@/lib/collections";

export function generateStaticParams() {
    return CATEGORIES.flatMap((c) =>
        c.items.map((i) => ({ category: c.slug, id: i.id }))
    );
}

export function generateMetadata({
    params,
}: {
    params: { category: string; id: string };
}) {
    const category = getCategory(params.category);
    const item = category && getItem(category, params.id);
    return { title: item ? item.name : "Not found" };
}

export default function Object({
    params,
}: {
    params: { category: string; id: string };
}) {
    const category = getCategory(params.category);
    if (!category) notFound();
    const item = getItem(category, params.id);
    if (!item) notFound();

    const { prev, next } = neighbours(category, item.id);

    return (
        <main className="case-room case-room--object">
            <header className="case-object-head">
                <Link className="case-return" href={`/collections/${category.slug}`}>
                    <span aria-hidden="true">&larr;</span> {category.label}
                </Link>
                <p className="case-object-seq">{numeral(item.seq)}</p>
                <h1 className="case-object-name">{item.name}</h1>
                <p className="case-object-facts">
                    {itemFacts(item).join(" · ")}
                </p>
            </header>

            <div className="case-studio">
                <Vitrine item={item} category={category.slug} />
                <Dossier item={item} />
            </div>

            <Neighbours category={category.slug} prev={prev} next={next} />
            <Rail active={category.slug} />
        </main>
    );
}

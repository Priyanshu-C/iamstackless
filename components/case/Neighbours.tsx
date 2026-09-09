import Link from "next/link";
import type { AnyItem, CategorySlug } from "@/lib/collections/types";
import { numeral } from "./format";

/** The way on. Walks the drawer's own order — the ends carry one link, never
    a dead control and never a wrap back to the top. */
export default function Neighbours({
    category,
    prev,
    next,
}: {
    category: CategorySlug;
    prev: AnyItem | null;
    next: AnyItem | null;
}) {
    if (!prev && !next) return null;

    return (
        <nav className="case-neighbours" aria-label="Other things in this drawer">
            {prev ? (
                <Link
                    className="case-neighbour"
                    data-side="prev"
                    href={`/collections/${category}/${prev.id}`}
                >
                    <span className="case-neighbour-dir">
                        <span aria-hidden="true">&larr;</span> Previous
                    </span>
                    <span className="case-neighbour-name">
                        {numeral(prev.seq)} {prev.name}
                    </span>
                </Link>
            ) : (
                <span />
            )}
            {next ? (
                <Link
                    className="case-neighbour"
                    data-side="next"
                    href={`/collections/${category}/${next.id}`}
                >
                    <span className="case-neighbour-dir">
                        Next <span aria-hidden="true">&rarr;</span>
                    </span>
                    <span className="case-neighbour-name">
                        {numeral(next.seq)} {next.name}
                    </span>
                </Link>
            ) : null}
        </nav>
    );
}

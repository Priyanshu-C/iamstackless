"use client";

import Link from "next/link";
import type { DrawerSummary } from "@/lib/collections/summary";
import type { AnyItem, CategorySlug } from "@/lib/collections/types";
import {
    formatAcquired,
    formatAmount,
    formatMonth,
    formatPrice,
    itemFacts,
    itemSpec,
    numeral,
} from "./format";

/** The slip. It carries the previewed item's entry — and, when nothing is
    under the pointer, what the drawer knows about itself, so the column is
    never a quarter of the page holding one faint line. */
export default function Ledger({
    item,
    category,
    summary,
    noun,
}: {
    item: AnyItem | null;
    category: CategorySlug;
    summary: DrawerSummary;
    noun: string;
}) {
    return (
        <aside className="case-slip" data-showing={item ? "item" : "drawer"}>
            {/* Both blocks stay mounted. The entry is a hover reading; the
                narrow room has no hover, so there it shows the summary only
                and a tap opens the object's page instead. */}
            <Summary summary={summary} noun={noun} />
            <div className="case-slip-live" aria-live="polite">
                {item ? <Entry item={item} category={category} /> : null}
            </div>
        </aside>
    );
}

function Entry({ item, category }: { item: AnyItem; category: CategorySlug }) {
    const spec = itemSpec(item);
    const acquired = formatAcquired(item.acquired);

    return (
        <>
            <p className="case-slip-seq">{numeral(item.seq)}</p>
            <h2 className="case-slip-name">{item.name}</h2>
            <p className="case-slip-facts">{itemFacts(item).join(" · ")}</p>

            <dl className="case-slip-rows">
                <div className="case-slip-row">
                    <dt>Paid</dt>
                    <dd>{formatPrice(item.price)}</dd>
                </div>
                <div className="case-slip-row">
                    <dt>Acquired</dt>
                    <dd data-blank={acquired ? undefined : true}>
                        {acquired ?? "not recorded"}
                    </dd>
                </div>
                {spec ? (
                    <div className="case-slip-row">
                        <dt>{spec.label}</dt>
                        <dd>{spec.value}</dd>
                    </div>
                ) : null}
            </dl>

            {/* A missing note shows as a ruled blank, never as invented words —
                a line waiting to be written on. */}
            {item.why ? (
                <p className="case-slip-why">{item.why}</p>
            ) : (
                <p className="case-slip-why case-slip-why--blank">
                    <span className="case-slip-blank-rule" aria-hidden="true" />
                    Why this one — not written yet
                </p>
            )}

            <Link
                className="case-slip-open"
                href={`/collections/${category}/${item.id}`}
                tabIndex={-1}
            >
                Open <span aria-hidden="true">&rarr;</span>
            </Link>
        </>
    );
}

function Summary({
    summary,
    noun,
}: {
    summary: DrawerSummary;
    noun: string;
}) {
    return (
        <div className="case-slip-drawer">
            <p className="case-slip-count">
                <span className="case-slip-count-n">{summary.count}</span>
                <span className="case-slip-count-noun">{noun}</span>
            </p>

            <dl className="case-slip-rows">
                {summary.spend.length > 0 ? (
                    <div className="case-slip-row">
                        <dt>Paid</dt>
                        {/* One total per currency. Nothing is converted — the
                            number shown is the sum of the numbers paid. */}
                        <dd>
                            {summary.spend
                                .map((s) => formatAmount(s.amount, s.currency))
                                .join("  ·  ")}
                        </dd>
                    </div>
                ) : null}
                {summary.span ? (
                    <div className="case-slip-row">
                        <dt>Between</dt>
                        <dd>
                            {summary.span.first === summary.span.last
                                ? formatMonth(summary.span.first)
                                : `${formatMonth(summary.span.first)} — ${formatMonth(summary.span.last)}`}
                        </dd>
                    </div>
                ) : null}
                {summary.unnoted > 0 ? (
                    <div className="case-slip-row">
                        <dt>Notes</dt>
                        <dd data-blank="true">
                            {summary.count - summary.unnoted} of{" "}
                            {summary.count} written
                        </dd>
                    </div>
                ) : null}
            </dl>

            {summary.brands.length > 0 ? (
                <ul className="case-slip-brands">
                    {summary.brands.map((b) => (
                        <li key={b.name}>
                            <span className="case-slip-brand-name">
                                {b.name}
                            </span>
                            <span className="case-slip-brand-count">
                                {b.count}
                            </span>
                            <span
                                className="case-slip-brand-share"
                                style={{
                                    "--share": `${(b.count / summary.count) * 100}%`,
                                } as React.CSSProperties}
                                aria-hidden="true"
                            />
                        </li>
                    ))}
                </ul>
            ) : null}

            <p className="case-slip-hint">Pick something up.</p>
        </div>
    );
}

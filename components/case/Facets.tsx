"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import type { Facet } from "@/lib/collections";

/** Past this many values a facet stops being a row of controls and becomes a
    wall. Perfume notes run to fifty across a dozen bottles, most of them on a
    single item. They stay reachable, behind a count. */
const WALL = 12;

/** Filter state lives in the URL, so a filtered drawer is linkable and
    survives a reload. OR within a facet, AND across facets.

    Every chip carries the number of things it would leave you with, counted
    against the other filters already on. A chip that would leave you with
    nothing says so, and is not clickable — the row never leads to a dead end. */
export default function Facets({
    facets,
    shown,
    total,
}: {
    facets: Facet[];
    shown: number;
    total: number;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const params = useSearchParams();
    const [open, setOpen] = useState(false);
    const [expanded, setExpanded] = useState<Record<string, boolean>>({});

    if (facets.length === 0) return null;

    const isOn = (key: string, value: string) =>
        params.getAll(key).includes(value);

    const activeCount = facets.reduce(
        (n, f) => n + params.getAll(f.key).length,
        0
    );

    const toggle = (key: string, value: string) => {
        const next = new URLSearchParams(params.toString());
        const current = next.getAll(key);
        next.delete(key);
        for (const v of current) if (v !== value) next.append(key, v);
        if (!current.includes(value)) next.append(key, value);
        const query = next.toString();
        router.replace(query ? `${pathname}?${query}` : pathname, {
            scroll: false,
        });
    };

    return (
        <div className="case-facets" data-open={open || undefined}>
            <button
                type="button"
                className="case-facets-toggle"
                aria-expanded={open}
                onClick={() => setOpen((v) => !v)}
            >
                <span>Filter</span>
                <span className="case-facets-toggle-state">
                    {activeCount > 0 ? `${activeCount} on` : "off"}
                </span>
            </button>

            <div className="case-facets-body">
                {facets.map((facet) => {
                    const long = facet.values.length > WALL;
                    const on = facet.values.filter((v) => isOn(facet.key, v));
                    const show =
                        !long || expanded[facet.key]
                            ? facet.values
                            : // A chosen value stays visible even while the
                              // rest of a long facet is folded away.
                              Array.from(
                                  new Set([
                                      ...on,
                                      ...facet.values.slice(0, WALL),
                                  ])
                              );
                    return (
                    <div className="case-facet" key={facet.key}>
                        <span className="case-facet-label">{facet.label}</span>
                        <div className="case-facet-values">
                            {show.map((value) => {
                                const on = isOn(facet.key, value);
                                const count = facet.counts[value] ?? 0;
                                return (
                                    <button
                                        type="button"
                                        key={value}
                                        className="case-chip"
                                        data-on={on || undefined}
                                        aria-pressed={on}
                                        disabled={!on && count === 0}
                                        onClick={() =>
                                            toggle(facet.key, value)
                                        }
                                    >
                                        {value}
                                        <span className="case-chip-count">
                                            {count}
                                        </span>
                                    </button>
                                );
                            })}
                            {long ? (
                                <button
                                    type="button"
                                    className="case-chip case-chip--more"
                                    aria-expanded={Boolean(expanded[facet.key])}
                                    onClick={() =>
                                        setExpanded((p) => ({
                                            ...p,
                                            [facet.key]: !p[facet.key],
                                        }))
                                    }
                                >
                                    {expanded[facet.key]
                                        ? "Fewer"
                                        : `${facet.values.length - show.length} more`}
                                </button>
                            ) : null}
                        </div>
                    </div>
                    );
                })}

                <p className="case-facets-result" aria-live="polite">
                    {activeCount === 0 ? (
                        <span>Showing all {total}</span>
                    ) : (
                        <>
                            <span>
                                {shown} of {total}
                            </span>
                            <button
                                type="button"
                                className="case-facets-clear"
                                onClick={() =>
                                    router.replace(pathname, { scroll: false })
                                }
                            >
                                Clear
                            </button>
                        </>
                    )}
                </p>
            </div>
        </div>
    );
}

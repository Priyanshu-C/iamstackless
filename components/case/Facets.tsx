"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { Facet } from "@/lib/collections";

/** Filter state lives in the URL, so a filtered drawer is linkable and
    survives a reload. OR within a facet, AND across facets. */
export default function Facets({ facets }: { facets: Facet[] }) {
    const router = useRouter();
    const pathname = usePathname();
    const params = useSearchParams();

    if (facets.length === 0) return null;

    const isOn = (key: string, value: string) =>
        params.getAll(key).includes(value);

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

    const active = facets.some((f) => params.getAll(f.key).length > 0);

    return (
        <div className="case-facets">
            {facets.map((facet) => (
                <div className="case-facet" key={facet.key}>
                    <span className="case-label case-facet-label">
                        {facet.label}
                    </span>
                    <div className="case-facet-values">
                        {facet.values.map((value) => (
                            <button
                                type="button"
                                key={value}
                                className="case-chip"
                                data-on={isOn(facet.key, value) || undefined}
                                aria-pressed={isOn(facet.key, value)}
                                onClick={() => toggle(facet.key, value)}
                            >
                                {value}
                            </button>
                        ))}
                    </div>
                </div>
            ))}
            {active ? (
                <button
                    type="button"
                    className="case-chip case-chip--clear"
                    onClick={() => router.replace(pathname, { scroll: false })}
                >
                    Clear
                </button>
            ) : null}
        </div>
    );
}

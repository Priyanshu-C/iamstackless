"use client";

import Image from "next/image";
import { useState } from "react";
import type { AnyItem } from "@/lib/collections/types";
import { numeral } from "./format";

/** One object in its box. A real button, with a written label, so the case
    is fully navigable without ever seeing it. */
export default function Compartment({
    item,
    index,
    selected,
    onSelect,
    onKeyDown,
}: {
    item: AnyItem;
    index: number;
    selected: boolean;
    onSelect: () => void;
    onKeyDown: (event: React.KeyboardEvent<HTMLButtonElement>) => void;
}) {
    const [broken, setBroken] = useState(false);

    return (
        <button
            type="button"
            className="case-cell"
            data-selected={selected || undefined}
            data-index={index}
            aria-pressed={selected}
            aria-label={`${numeral(item.seq)} ${item.brand} ${item.name} — show details`}
            onClick={onSelect}
            onKeyDown={onKeyDown}
        >
            <span className="case-cell-seq" aria-hidden="true">
                {numeral(item.seq)}
            </span>
            <span className="case-cell-object">
                {broken ? (
                    <span className="case-cell-fallback" aria-hidden="true">
                        {item.name}
                    </span>
                ) : (
                    <Image
                        src={item.image}
                        alt=""
                        fill
                        sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 22vw"
                        className="case-cell-img"
                        onError={() => setBroken(true)}
                    />
                )}
            </span>
        </button>
    );
}

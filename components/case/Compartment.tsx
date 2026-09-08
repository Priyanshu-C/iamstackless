"use client";

import Image from "next/image";
import { useState } from "react";
import type { AnyItem } from "@/lib/collections/types";
import { formatPrice, numeral } from "./format";

/** One object in its box. A real button, with a written label, so the case
    is fully navigable without ever seeing it.

    The compartment is captioned. A printer's case has the sort written on the
    front of every drawer — an uncaptioned grid of photographs makes you hover
    each one to find out what it is, which is the opposite of a ledger. */
export default function Compartment({
    item,
    index,
    selected,
    previewing,
    onSelect,
    onPreview,
    onKeyDown,
}: {
    item: AnyItem;
    index: number;
    selected: boolean;
    previewing: boolean;
    onSelect: () => void;
    /** true on pointer-enter or focus, false on leave or blur. */
    onPreview: (on: boolean) => void;
    onKeyDown: (event: React.KeyboardEvent<HTMLButtonElement>) => void;
}) {
    const [broken, setBroken] = useState(false);

    return (
        <button
            type="button"
            className="case-cell"
            data-selected={selected || undefined}
            data-previewing={previewing || undefined}
            data-index={index}
            aria-pressed={selected}
            aria-label={`${numeral(item.seq)} ${item.brand} ${item.name}, ${formatPrice(item.price)}`}
            onClick={onSelect}
            onKeyDown={onKeyDown}
            onPointerEnter={() => onPreview(true)}
            onPointerLeave={() => onPreview(false)}
            onFocus={() => onPreview(true)}
            onBlur={() => onPreview(false)}
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
            <span className="case-cell-caption" aria-hidden="true">
                <span className="case-cell-brand">{item.brand}</span>
                <span className="case-cell-name">{item.name}</span>
            </span>
        </button>
    );
}

/** A compartment with nothing in it. The case is a fixed grid of boxes, so a
    drawer holding five things in a four-wide plate has three empty boxes —
    ruled and quiet, never a hole where the plate should be. */
export function EmptyCompartment() {
    return <span className="case-cell case-cell--empty" aria-hidden="true" />;
}

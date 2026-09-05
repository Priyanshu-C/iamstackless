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
            aria-label={`${numeral(item.seq)} ${item.brand} ${item.name} — show details`}
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
        </button>
    );
}

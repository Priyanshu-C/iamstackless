"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { catalogueShot } from "@/lib/collections/angles";
import type { AnyItem, CategorySlug } from "@/lib/collections/types";
import { formatPrice, numeral } from "./format";

/** One object in its box, and the way in to its page.

    The compartment renders the category's CANONICAL angle or nothing. It
    never falls back to another angle — a plate mixing a lateral shoe with a
    top-down one is exactly the defect this rule exists to prevent, so a
    missing canonical shot shows the name in type instead. */
export default function Compartment({
    item,
    category,
    index,
    previewing,
    onPreview,
    onKeyDown,
}: {
    item: AnyItem;
    category: CategorySlug;
    index: number;
    previewing: boolean;
    /** true on pointer-enter or focus, false on leave or blur. */
    onPreview: (on: boolean) => void;
    onKeyDown: (event: React.KeyboardEvent<HTMLAnchorElement>) => void;
}) {
    const [broken, setBroken] = useState(false);
    const src = catalogueShot(category, item.id, item.shots);

    return (
        <Link
            href={`/collections/${category}/${item.id}`}
            className="case-cell"
            data-previewing={previewing || undefined}
            data-index={index}
            aria-label={[
                numeral(item.seq),
                item.brand,
                item.name,
                formatPrice(item.price),
            ]
                .filter(Boolean)
                .join(" ")}
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
                {src && !broken ? (
                    <Image
                        src={src}
                        alt=""
                        fill
                        sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 22vw"
                        className="case-cell-img"
                        onError={() => setBroken(true)}
                    />
                ) : (
                    <span className="case-cell-fallback" aria-hidden="true">
                        {item.name}
                    </span>
                )}
            </span>
            <span className="case-cell-caption" aria-hidden="true">
                <span className="case-cell-brand">{item.brand}</span>
                <span className="case-cell-name">{item.name}</span>
            </span>
        </Link>
    );
}

/** A compartment with nothing in it. The case is a fixed grid of boxes, so a
    drawer holding five things in a four-wide plate has three empty boxes —
    ruled and quiet, never a hole where the plate should be. */
export function EmptyCompartment() {
    return <span className="case-cell case-cell--empty" aria-hidden="true" />;
}

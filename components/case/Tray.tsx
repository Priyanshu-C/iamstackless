"use client";

import { useCallback, useRef, useState } from "react";
import type { AnyItem } from "@/lib/collections/types";
import Compartment from "./Compartment";
import Ledger from "./Ledger";

const EMPTY_SLOTS = 4;

/** The compartment grid. Owns selection; the lift lives here. */
export default function Tray({
    items,
    filtered,
}: {
    items: AnyItem[];
    filtered: boolean;
}) {
    const [selected, setSelected] = useState<string | null>(null);
    const grid = useRef<HTMLDivElement>(null);

    const focusCell = useCallback((index: number) => {
        const cells =
            grid.current?.querySelectorAll<HTMLButtonElement>(".case-cell");
        if (!cells || cells.length === 0) return;
        const clamped = Math.max(0, Math.min(index, cells.length - 1));
        cells[clamped].focus();
    }, []);

    const onKeyDown = useCallback(
        (index: number) => (event: React.KeyboardEvent<HTMLButtonElement>) => {
            const columns = getColumnCount(grid.current);
            switch (event.key) {
                case "ArrowRight":
                    event.preventDefault();
                    focusCell(index + 1);
                    break;
                case "ArrowLeft":
                    event.preventDefault();
                    focusCell(index - 1);
                    break;
                case "ArrowDown":
                    event.preventDefault();
                    focusCell(index + columns);
                    break;
                case "ArrowUp":
                    event.preventDefault();
                    focusCell(index - columns);
                    break;
                case "Escape":
                    event.preventDefault();
                    setSelected(null);
                    break;
            }
        },
        [focusCell]
    );

    if (items.length === 0) {
        return (
            <div className="case-tray-empty">
                <p className="case-empty-note">
                    {filtered
                        ? "No matches. Clear the filters."
                        : "Nothing in this drawer yet."}
                </p>
                <div className="case-grid case-grid--ghost" aria-hidden="true">
                    {Array.from({ length: EMPTY_SLOTS }, (_, i) => (
                        <span className="case-cell case-cell--ghost" key={i} />
                    ))}
                </div>
            </div>
        );
    }

    const current = items.find((i) => i.id === selected) ?? null;

    return (
        <div className="case-stage" data-lifted={current ? true : undefined}>
            <Ledger item={current} />
            <div className="case-grid" ref={grid}>
                {items.map((item, index) => (
                    <Compartment
                        key={item.id}
                        item={item}
                        index={index}
                        selected={item.id === selected}
                        onSelect={() =>
                            setSelected((prev) =>
                                prev === item.id ? null : item.id
                            )
                        }
                        onKeyDown={onKeyDown(index)}
                    />
                ))}
            </div>
        </div>
    );
}

/** Read the real rendered column count so arrow-down moves a visual row,
    not a guessed one. */
function getColumnCount(grid: HTMLDivElement | null): number {
    if (!grid) return 1;
    const template = getComputedStyle(grid).gridTemplateColumns;
    const columns = template.split(" ").filter(Boolean).length;
    return Math.max(1, columns);
}

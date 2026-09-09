"use client";

import {
    useCallback,
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
} from "react";
import type { DrawerSummary } from "@/lib/collections/summary";
import type { AnyItem, CategorySlug } from "@/lib/collections/types";
import Compartment, { EmptyCompartment } from "./Compartment";
import Ledger from "./Ledger";

const EMPTY_SLOTS = 4;

/** `useLayoutEffect` warns when it runs during SSR. The measurement below has
    to happen before paint or the plate visibly re-flows, so keep the layout
    effect on the client and fall back to the no-op on the server. */
const useIsomorphicLayoutEffect =
    typeof window === "undefined" ? useEffect : useLayoutEffect;

/** The compartment grid. Owns selection; the lift lives here. */
export default function Tray({
    items,
    category,
    summary,
    noun,
    filtered,
}: {
    items: AnyItem[];
    category: CategorySlug;
    summary: DrawerSummary;
    noun: string;
    filtered: boolean;
}) {
    // Hover and keyboard focus preview an item into the slip, so a drawer can
    // be read through without leaving it. Clicking opens the object's page —
    // there is no pinned state any more, because the page is the commitment.
    const [preview, setPreview] = useState<string | null>(null);
    const grid = useRef<HTMLDivElement>(null);
    const columns = useColumnCount(grid, items.length);

    const focusCell = useCallback((index: number) => {
        const cells =
            grid.current?.querySelectorAll<HTMLAnchorElement>("a.case-cell");
        if (!cells || cells.length === 0) return;
        const clamped = Math.max(0, Math.min(index, cells.length - 1));
        cells[clamped].focus();
    }, []);

    const onKeyDown = useCallback(
        (index: number) => (event: React.KeyboardEvent<HTMLAnchorElement>) => {
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
                case "Home":
                    event.preventDefault();
                    focusCell(0);
                    break;
                case "End":
                    event.preventDefault();
                    focusCell(Number.MAX_SAFE_INTEGER);
                    break;
            }
        },
        [focusCell, columns]
    );

    if (items.length === 0) {
        return (
            <div className="case-stage case-stage--empty">
                <p className="case-empty-note">
                    {filtered
                        ? "Nothing matches. Clear a filter to widen it."
                        : `No ${noun} in this drawer yet.`}
                </p>
                <div className="case-grid case-grid--ghost" aria-hidden="true">
                    {Array.from({ length: EMPTY_SLOTS }, (_, i) => (
                        <EmptyCompartment key={i} />
                    ))}
                </div>
            </div>
        );
    }

    const current = items.find((i) => i.id === preview) ?? null;
    // The plate is a rectangle of boxes. A drawer holding five things in a
    // four-wide plate has three empty boxes, ruled like the rest — never a
    // hole where the plate should be.
    const pad = (columns - (items.length % columns)) % columns;

    return (
        <div className="case-stage">
            <Ledger item={current} category={category} summary={summary} noun={noun} />
            <div className="case-grid" ref={grid}>
                {items.map((item, index) => (
                    <Compartment
                        key={item.id}
                        item={item}
                        category={category}
                        index={index}
                        previewing={item.id === preview}
                        onPreview={(on) =>
                            setPreview((prev) =>
                                on ? item.id : prev === item.id ? null : prev
                            )
                        }
                        onKeyDown={onKeyDown(index)}
                    />
                ))}
                {Array.from({ length: pad }, (_, i) => (
                    <EmptyCompartment key={`pad-${i}`} />
                ))}
            </div>
        </div>
    );
}

/** Read the real rendered column count, so arrow-down moves a visual row and
    the plate pads to the width it is actually drawn at. Re-measured on resize
    because `--cols` steps at two breakpoints. */
function useColumnCount(
    grid: React.RefObject<HTMLDivElement>,
    itemCount: number
): number {
    const [columns, setColumns] = useState(1);

    useIsomorphicLayoutEffect(() => {
        const element = grid.current;
        if (!element) return;
        const measure = () => setColumns(readColumnCount(element));
        measure();
        const observer = new ResizeObserver(measure);
        observer.observe(element);
        return () => observer.disconnect();
    }, [grid, itemCount]);

    return columns;
}

function readColumnCount(grid: HTMLElement): number {
    const template = getComputedStyle(grid).gridTemplateColumns;
    const count = template.split(" ").filter(Boolean).length;
    return Math.max(1, count);
}

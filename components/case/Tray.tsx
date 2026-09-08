"use client";

import {
    useCallback,
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
} from "react";
import type { DrawerSummary } from "@/lib/collections/summary";
import type { AnyItem } from "@/lib/collections/types";
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
    summary,
    noun,
    filtered,
}: {
    items: AnyItem[];
    summary: DrawerSummary;
    noun: string;
    filtered: boolean;
}) {
    // `selected` is pinned by a click and survives the pointer leaving.
    // `preview` follows hover and keyboard focus, and wins while it lasts —
    // so passing over the tray reads out each item without committing to one.
    const [selected, setSelected] = useState<string | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const grid = useRef<HTMLDivElement>(null);
    const columns = useColumnCount(grid, items.length);

    const focusCell = useCallback((index: number) => {
        const cells =
            grid.current?.querySelectorAll<HTMLButtonElement>(
                "button.case-cell"
            );
        if (!cells || cells.length === 0) return;
        const clamped = Math.max(0, Math.min(index, cells.length - 1));
        cells[clamped].focus();
    }, []);

    const onKeyDown = useCallback(
        (index: number) => (event: React.KeyboardEvent<HTMLButtonElement>) => {
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
                case "Escape":
                    event.preventDefault();
                    setSelected(null);
                    setPreview(null);
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

    const showing = preview ?? selected;
    const current = items.find((i) => i.id === showing) ?? null;
    // The plate is a rectangle of boxes. A drawer holding five things in a
    // four-wide plate has three empty boxes, ruled like the rest — never a
    // hole where the plate should be.
    const pad = (columns - (items.length % columns)) % columns;

    return (
        <div className="case-stage" data-lifted={selected ? true : undefined}>
            <Ledger
                item={current}
                pinned={current !== null && current.id === selected}
                summary={summary}
                noun={noun}
                onClose={() => {
                    setSelected(null);
                    setPreview(null);
                }}
            />
            <div className="case-grid" ref={grid}>
                {items.map((item, index) => (
                    <Compartment
                        key={item.id}
                        item={item}
                        index={index}
                        selected={item.id === selected}
                        previewing={item.id === showing}
                        onSelect={() =>
                            setSelected((prev) =>
                                prev === item.id ? null : item.id
                            )
                        }
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

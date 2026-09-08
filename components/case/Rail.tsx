import Link from "next/link";
import { CATEGORIES } from "@/lib/collections";

/** Fixed to the bottom, persistent across every drawer. This is the primary
    navigation — the tray scrolls beneath it.

    It carries both doors as well as the drawers: back to the case index, and
    back out to the foundry. Without them a drawer is a room with no handle on
    the inside. */
export default function Rail({ active }: { active?: string }) {
    const total = CATEGORIES.reduce((n, c) => n + c.items.length, 0);

    return (
        <nav className="case-rail" aria-label="The case">
            <div className="case-rail-inner">
                <ul className="case-rail-list">
                    <li>
                        <Link
                            className="case-rail-item case-rail-item--index"
                            href="/collections"
                            aria-current={
                                active === undefined ? "page" : undefined
                            }
                            data-active={active === undefined || undefined}
                        >
                            <span className="case-rail-count">{total}</span>
                            <span className="case-rail-label">All</span>
                        </Link>
                    </li>
                    {CATEGORIES.map((c) => (
                        <li key={c.slug}>
                            <Link
                                className="case-rail-item"
                                href={`/collections/${c.slug}`}
                                aria-current={
                                    active === c.slug ? "page" : undefined
                                }
                                data-active={active === c.slug || undefined}
                            >
                                <span className="case-rail-count">
                                    {c.items.length}
                                </span>
                                <span className="case-rail-label">
                                    {c.label}
                                </span>
                            </Link>
                        </li>
                    ))}
                </ul>

                <Link
                    className="case-rail-door"
                    href="/"
                    aria-label="Back to the foundry"
                >
                    <span aria-hidden="true">←</span> Foundry
                </Link>
            </div>
        </nav>
    );
}

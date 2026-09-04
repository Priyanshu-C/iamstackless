import Link from "next/link";
import { CATEGORIES } from "@/lib/collections";

/** Fixed to the bottom, persistent across every drawer. This is the primary
    navigation — the tray scrolls beneath it. */
export default function Rail({ active }: { active?: string }) {
    return (
        <nav className="case-rail" aria-label="Drawers">
            <ul className="case-rail-list">
                {CATEGORIES.map((c) => (
                    <li key={c.slug}>
                        <Link
                            className="case-rail-item"
                            href={`/collections/${c.slug}`}
                            aria-current={active === c.slug ? "page" : undefined}
                            data-active={active === c.slug || undefined}
                        >
                            <span className="case-rail-count">
                                {c.items.length}
                            </span>
                            <span className="case-rail-label">{c.label}</span>
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    );
}

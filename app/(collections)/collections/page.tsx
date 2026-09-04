import Link from "next/link";
import Rail from "@/components/case/Rail";
import { CATEGORIES } from "@/lib/collections";

export default function CaseIndex() {
    const total = CATEGORIES.reduce((n, c) => n + c.items.length, 0);

    return (
        <main className="case-room">
            <header className="case-head">
                <p className="case-label">The Case</p>
                <p className="case-label case-head-sub">
                    {total === 0
                        ? "Empty, for now."
                        : `${total} things, three drawers.`}
                </p>
            </header>

            <ul className="case-drawers">
                {CATEGORIES.map((c) => (
                    <li key={c.slug}>
                        <Link className="case-drawer" href={`/collections/${c.slug}`}>
                            <span className="case-drawer-label">{c.label}</span>
                            <span className="case-label case-drawer-count">
                                {c.items.length}
                            </span>
                        </Link>
                    </li>
                ))}
            </ul>

            <Rail />
        </main>
    );
}

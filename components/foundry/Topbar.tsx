import { Fragment } from "react";
import { navLinks, site } from "@/lib/content";

export function BrandMark({ small }: { small?: boolean }) {
    return (
        <span
            className={`brand-mark${small ? " small" : ""}`}
            aria-hidden="true"
        >
            <span />
            <span />
            <span />
            <span />
        </span>
    );
}

export default function Topbar() {
    return (
        <header className="topbar">
            <a className="brand" href="#specimen" aria-label="Back to top">
                <BrandMark />
                <span className="brand-word">{site.brand}</span>
            </a>
            <nav className="topnav" aria-label="Primary">
                {navLinks.map((l, i) => (
                    <Fragment key={l.name}>
                        {i > 0 && <span className="nav-sep">·</span>}
                        <a className="nav-item" href={l.href}>
                            {l.name}
                        </a>
                    </Fragment>
                ))}
            </nav>
            <a className="topbuy" href="#commission">
                <span className="buy-label">Commission</span>
                <span className="buy-price">Hire</span>
            </a>
        </header>
    );
}

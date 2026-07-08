import { site } from "@/lib/content";

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
                <span className="brand-word">
                    {site.brand}
                    <span className="brand-thin">{site.brandThin}</span>
                </span>
            </a>
            <nav className="topnav" aria-label="Primary">
                <span className="nav-item">{site.est}</span>
                <span className="nav-sep">·</span>
                <span className="nav-item">{site.tagline}</span>
                <span className="nav-sep">·</span>
                <span className="nav-item nav-emph">{site.current}</span>
            </nav>
            <a className="topbuy" href="#commission">
                <span className="buy-label">Commission</span>
                <span className="buy-price">Hire</span>
            </a>
        </header>
    );
}

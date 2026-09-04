import {
    contactTiers,
    footer,
    minis,
    projects,
    record,
    site,
    socials,
    story,
} from "@/lib/content";
import { BrandMark } from "./Topbar";

function SheetHead({
    idx,
    title,
    sub,
}: {
    idx: string;
    title: string;
    sub: string;
}) {
    return (
        <div className="sheet-head">
            <div className="sheet-title">
                <span className="sheet-idx">{idx}</span>
                <h2>{title}</h2>
            </div>
            <p className="sheet-sub">{sub}</p>
        </div>
    );
}

/* ---- 01 · experience ---- */
export function RecordSheet() {
    return (
        <section className="sheet" id="record">
            <SheetHead
                idx="01"
                title="The record"
                sub="The heavier the type, the more recent the chapter: light at university, bold at Razorpay, black at Coinbase."
            />
            <div>
                {record.map((r) => (
                    <article className="rec-row" key={r.company}>
                        <div className="rec-meta">
                            <span className="wf-meta">{r.weightName}</span>
                            <span className="wf-meta">{r.dates}</span>
                            <span className="wf-meta">{r.location}</span>
                        </div>
                        <div>
                            <h3
                                className="rec-co"
                                style={{ fontWeight: r.weight }}
                            >
                                {r.company}
                            </h3>
                            <p className="rec-role">{r.role}</p>
                            <ul className="dot-list">
                                {r.bullets.map((b) => (
                                    <li key={b.lead}>
                                        <strong>{b.lead}</strong> {b.text}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
}

/* ---- 03 · projects ---- */
export function ProjectSpecimens() {
    return (
        <section className="sheet" id="projects">
            <SheetHead
                idx="03"
                title="Set at display size"
                sub="What I build when nobody's asking. The featured one is the current obsession; the rest got me here."
            />
            <div>
                {projects.map((p) => (
                    <article
                        className={`proj${p.featured ? " proj--feature" : ""}`}
                        key={p.title}
                    >
                        <div className="proj-meta">
                            <span className="wf-meta">{p.idx}</span>
                            <span className="wf-meta">{p.meta}</span>
                        </div>
                        <div>
                            <h3 className="proj-title">{p.title}</h3>
                            <p className="proj-blurb">{p.blurb}</p>
                            {p.bullets && (
                                <ul className="dot-list">
                                    {p.bullets.map((b) => (
                                        <li key={b.lead}>
                                            <strong>{b.lead}</strong> {b.text}
                                        </li>
                                    ))}
                                </ul>
                            )}
                            <div className="chips">
                                {p.stack.map((t) => (
                                    <span className="chip" key={t}>
                                        {t}
                                    </span>
                                ))}
                            </div>
                            <div className="proj-links">
                                {p.link && (
                                    <a
                                        href={p.link}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        Live →
                                    </a>
                                )}
                                {p.github && (
                                    <a
                                        href={p.github}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        Source →
                                    </a>
                                )}
                            </div>
                        </div>
                    </article>
                ))}
            </div>
            <div className="marginalia">
                <span>Marginalia ·</span>
                {minis.map((m) => (
                    <a href={m.link} key={m.name}>
                        {m.name}
                    </a>
                ))}
            </div>
        </section>
    );
}

/* ---- 04 · story ---- */
export function StoryPara() {
    return (
        <section className="sheet" id="story">
            <SheetHead
                idx="04"
                title="At text size"
                sub="Every typeface ships with a provenance note. Here's mine."
            />
            <p className="spec-para">{story.para}</p>
        </section>
    );
}

/* ---- 06 · contact (dark) ---- */
export function ContactCards() {
    return (
        <section className="license" id="commission">
            <div className="lic-head">
                <span className="sheet-idx">06</span>
                <h2>Commission the engineer</h2>
            </div>
            <div className="lic-grid">
                {contactTiers.map((t) => (
                    <article
                        className={`lic-card${
                            t.flag ? " lic-card--feature" : ""
                        }`}
                        key={t.title}
                    >
                        {t.flag && <span className="lic-flag">{t.flag}</span>}
                        <header className="lic-card-head">
                            <h3>{t.title}</h3>
                            <span className="lic-price">{t.price}</span>
                        </header>
                        <p>{t.body}</p>
                        <ul className="lic-list">
                            {t.items.map((i) => (
                                <li key={i}>{i}</li>
                            ))}
                        </ul>
                        <a
                            className={`lic-cta${
                                t.cta.filled ? " lic-cta--filled" : ""
                            }`}
                            href={t.cta.href}
                            target={
                                t.cta.href.startsWith("http")
                                    ? "_blank"
                                    : undefined
                            }
                            rel={
                                t.cta.href.startsWith("http")
                                    ? "noreferrer"
                                    : undefined
                            }
                        >
                            {t.cta.label}
                        </a>
                    </article>
                ))}
            </div>
        </section>
    );
}

/* ---- footer ---- */
export function Foot() {
    return (
        <footer className="foot">
            <div className="foot-mark">
                <BrandMark small />
                <span>{footer.mark}</span>
            </div>
            <div className="foot-links">
                {socials.map((s) => (
                    <a
                        href={s.link}
                        key={s.name}
                        target="_blank"
                        rel="noreferrer"
                    >
                        {s.name}
                    </a>
                ))}
                <a href={`mailto:${site.email}`}>{site.email}</a>
                <a href="/collections">Collections</a>
                <span className="foot-credit">{footer.credit}</span>
            </div>
        </footer>
    );
}

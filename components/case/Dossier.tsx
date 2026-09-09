import { researchFor } from "@/lib/collections/research";
import type { AnyItem } from "@/lib/collections/types";
import Record from "./Record";

/** The reading beside the object.

    Two voices, and they are never blended. The catalogue note is researched
    from public sources and cited; the collector's line is the owner's, and
    nothing may write it but him. The owner's line comes LAST — it is empty
    on most items today, and a blank at the end of a page reads as an
    invitation where a blank at the top reads as a fault. */
export default function Dossier({ item }: { item: AnyItem }) {
    const research = researchFor(item.id);
    const host = (url: string) => {
        try {
            return new URL(url).hostname.replace(/^www\./, "");
        } catch {
            return url;
        }
    };

    return (
        <div className="case-dossier">
            {research?.standing ? (
                <p className="case-dossier-standing">{research.standing}</p>
            ) : null}

            {research?.note ? (
                <section className="case-dossier-note">
                    <h2 className="case-dossier-head">About the object</h2>
                    <p>{research.note}</p>
                </section>
            ) : null}

            <Record item={item} research={research} />

            {/* The owner's own line. Never researched, never filled in for
                him — a missing one is a ruled blank waiting to be written on. */}
            <section className="case-dossier-why">
                <h2 className="case-dossier-head">Why this one</h2>
                {item.why ? (
                    <blockquote className="case-why-quote">
                        <p>{item.why}</p>
                    </blockquote>
                ) : (
                    <p className="case-why-blank">
                        <span
                            className="case-slip-blank-rule"
                            aria-hidden="true"
                        />
                        Not written yet. This line is the owner&rsquo;s and is
                        never filled in for him.
                    </p>
                )}
            </section>

            {research?.sources?.length ? (
                <footer className="case-colophon">
                    <p className="case-colophon-note">
                        The note above is compiled from public sources. It
                        describes the object, not the owner.
                    </p>
                    <ul className="case-colophon-list">
                        {research.sources.map((url) => (
                            <li key={url}>
                                <a
                                    href={url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {host(url)}
                                </a>
                            </li>
                        ))}
                    </ul>
                </footer>
            ) : null}
        </div>
    );
}

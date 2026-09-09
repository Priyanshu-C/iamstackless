import Image from "next/image";
import { anglesFor, shotPath } from "@/lib/collections/angles";
import type { AnyItem, CategorySlug } from "@/lib/collections/types";

/** The object, from every angle the category knows about.

    Every angle in the vocabulary gets a frame, always, so the plate is a
    rectangle on every item and the same four frames appear in the same order
    on every page in a drawer. An angle that has not been photographed shows a
    ruled blank carrying its own label — the gap is legible rather than
    hidden, and nothing is substituted to fill it. */
export default function Vitrine({
    item,
    category,
}: {
    item: AnyItem;
    category: CategorySlug;
}) {
    const angles = anglesFor(category);

    return (
        <figure className="case-vitrine">
            <div className="case-vitrine-plate">
                {angles.map((angle) => {
                    const has = item.shots.includes(angle.key);
                    return (
                        <div
                            className="case-frame"
                            data-unshot={has ? undefined : true}
                            key={angle.key}
                        >
                            {has ? (
                                <Image
                                    src={shotPath(category, item.id, angle.key)}
                                    alt={`${item.brand} ${item.name}, ${angle.label.toLowerCase()}`}
                                    fill
                                    sizes="(max-width: 1000px) 46vw, 24vw"
                                    className="case-frame-img"
                                    priority={angle.key === angles[0].key}
                                />
                            ) : null}
                            <span className="case-frame-label">
                                {angle.label}
                                {has ? null : (
                                    <span className="case-frame-missing">
                                        not photographed
                                    </span>
                                )}
                            </span>
                        </div>
                    );
                })}
            </div>
            <figcaption className="case-vitrine-caption">
                {item.shots.length} of {angles.length} angles photographed
            </figcaption>
        </figure>
    );
}

import Image from "next/image";
import Link from "next/link";
import { catalogueShot } from "@/lib/collections/angles";
import type { CategoryDef } from "@/lib/collections";
import { frontRow, summarise } from "@/lib/collections/summary";
import { formatAmount } from "./format";

const PREVIEW = 6;

/** A drawer, shut, with the first few things in it showing through the front.
    The index used to be three words on an empty field; a case you cannot see
    into is a filing cabinet. */
export default function DrawerFront({ category }: { category: CategoryDef }) {
    const summary = summarise(category.items);
    const preview = frontRow(category, PREVIEW);
    const empty = category.items.length === 0;

    return (
        <Link
            className="case-front"
            href={`/collections/${category.slug}`}
            data-empty={empty || undefined}
        >
            <span className="case-front-head">
                <span className="case-front-label">{category.label}</span>
                <span className="case-front-facts">
                    {empty
                        ? `No ${category.noun} yet`
                        : [
                              `${summary.count} ${summary.count === 1 ? category.noun.replace(/s$/, "") : category.noun}`,
                              summary.spend
                                  .map((s) =>
                                      formatAmount(s.amount, s.currency)
                                  )
                                  .join(" · "),
                          ]
                              .filter(Boolean)
                              .join("  ·  ")}
                </span>
            </span>

            <span className="case-front-strip" aria-hidden="true">
                {/* The canonical angle or an empty slot — never a different
                    angle, so the strip reads as one consistent row. */}
                {preview.map((item) => {
                    const src = catalogueShot(
                        category.slug,
                        item.id,
                        item.shots
                    );
                    return (
                        <span
                            className="case-front-slot"
                            data-unshot={src ? undefined : true}
                            key={item.id}
                        >
                            {src ? (
                                <Image
                                    src={src}
                                    alt=""
                                    fill
                                    sizes="120px"
                                    className="case-front-img"
                                />
                            ) : null}
                        </span>
                    );
                })}
                {/* An unfilled drawer stays ruled — an empty case looks
                    intentional, a missing one looks broken. */}
                {Array.from(
                    { length: Math.max(0, PREVIEW - preview.length) },
                    (_, i) => (
                        <span
                            className="case-front-slot case-front-slot--empty"
                            key={`empty-${i}`}
                        />
                    )
                )}
            </span>
        </Link>
    );
}

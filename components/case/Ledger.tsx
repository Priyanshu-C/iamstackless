import type { AnyItem } from "@/lib/collections/types";
import { formatAcquired, formatPrice, itemFacts, numeral } from "./format";

/** The lifted item's data. Deliberately small: the object carries the
    hierarchy, this only labels it. */
export default function Ledger({ item }: { item: AnyItem | null }) {
    return (
        <div className="case-ledger" aria-live="polite">
            {item ? (
                <>
                    <p className="case-ledger-seq">{numeral(item.seq)}</p>
                    <h2 className="case-ledger-name">{item.name}</h2>
                    <p className="case-label">{itemFacts(item).join(" · ")}</p>
                    <p className="case-label">
                        {[formatPrice(item.price), formatAcquired(item.acquired)]
                            .filter(Boolean)
                            .join(" · ")}
                    </p>
                    {/* A missing `why` shows as a rule, not as invented words —
                        a visible blank waiting to be filled. */}
                    {item.why ? (
                        <p className="case-ledger-why">{item.why}</p>
                    ) : (
                        <p className="case-ledger-why case-ledger-why--blank" aria-label="No note yet">
                            &mdash;
                        </p>
                    )}
                </>
            ) : (
                <p className="case-label case-ledger-idle">
                    Choose something.
                </p>
            )}
        </div>
    );
}

import type { Research } from "@/lib/collections/research";
import type { AnyItem } from "@/lib/collections/types";
import { formatAcquired, formatPrice } from "./format";

/** The fields a category can hold, in the order they read best. Every one is
    rendered on every item, whether or not it has a value: a spec sheet that
    hides what it does not know tells you nothing about what is missing. */
const SPEC_ORDER: Record<string, { key: string; label: string }[]> = {
    watch: [
        { key: "reference", label: "Reference" },
        { key: "movement", label: "Movement" },
        { key: "calibre", label: "Calibre" },
        { key: "caseSize", label: "Case" },
        { key: "caseMaterial", label: "Case material" },
        { key: "crystal", label: "Crystal" },
        { key: "waterResistance", label: "Water resistance" },
        { key: "powerReserve", label: "Power reserve" },
        { key: "lugWidth", label: "Lug width" },
        { key: "released", label: "Released" },
    ],
    shoe: [
        { key: "colourway", label: "Colourway" },
        { key: "styleCode", label: "Style code" },
        { key: "silhouette", label: "Silhouette" },
        { key: "material", label: "Material" },
        { key: "upper", label: "Upper" },
        { key: "midsole", label: "Midsole" },
        { key: "closure", label: "Closure" },
        { key: "size", label: "Size owned" },
        { key: "released", label: "Released" },
    ],
    perfume: [
        { key: "house", label: "House" },
        { key: "concentration", label: "Concentration" },
        { key: "volume", label: "Volume" },
        { key: "perfumer", label: "Perfumer" },
        { key: "released", label: "Released" },
    ],
};

function shapeOf(item: AnyItem): keyof typeof SPEC_ORDER {
    if ("movement" in item) return "watch";
    if ("colourway" in item) return "shoe";
    return "perfume";
}

/** A hand-entered value on the item always beats a researched one — the
    owner knows his own pair's size, and no listing does. */
function valueFor(
    item: AnyItem,
    research: Research | null,
    key: string
): string | null {
    const own = (item as unknown as Record<string, unknown>)[key];
    if (own !== undefined && own !== null && own !== "") {
        if (key === "caseSize") return `${own}mm`;
        if (key === "volume") return `${own}ml`;
        if (key === "movement") {
            const v = String(own);
            return v[0].toUpperCase() + v.slice(1);
        }
        return String(own);
    }
    const found = research?.specs?.[key];
    return found && found !== "" ? found : null;
}

export default function Record({
    item,
    research,
}: {
    item: AnyItem;
    research: Research | null;
}) {
    const rows = SPEC_ORDER[shapeOf(item)];
    const notes = "notes" in item ? item.notes : null;

    return (
        <div className="case-record">
            <h2 className="case-dossier-head">The record</h2>
            <dl className="case-record-rows">
                <div className="case-record-row">
                    <dt>Paid</dt>
                    <dd>{formatPrice(item.price)}</dd>
                </div>
                <div className="case-record-row">
                    <dt>Acquired</dt>
                    <dd data-blank={item.acquired ? undefined : true}>
                        {formatAcquired(item.acquired) ?? "not recorded"}
                    </dd>
                </div>
                {rows.map(({ key, label }) => {
                    const value = valueFor(item, research, key);
                    return (
                        <div className="case-record-row" key={key}>
                            <dt>{label}</dt>
                            <dd data-blank={value ? undefined : true}>
                                {value ?? "—"}
                            </dd>
                        </div>
                    );
                })}
            </dl>

            {notes ? (
                <div className="case-pyramid">
                    {(
                        [
                            ["Top", notes.top],
                            ["Heart", notes.heart],
                            ["Base", notes.base],
                        ] as const
                    ).map(([tier, list]) => (
                        <div className="case-pyramid-tier" key={tier}>
                            <span className="case-pyramid-label">{tier}</span>
                            <span
                                className="case-pyramid-notes"
                                data-blank={list.length ? undefined : true}
                            >
                                {list.length ? list.join(", ") : "—"}
                            </span>
                        </div>
                    ))}
                </div>
            ) : null}
        </div>
    );
}

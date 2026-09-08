import DrawerFront from "@/components/case/DrawerFront";
import Rail from "@/components/case/Rail";
import { CATEGORIES } from "@/lib/collections";
import { summarise } from "@/lib/collections/summary";

/** Never repeat the same number twice in one line: when nothing has been
    written up yet, say so in words. */
function noteState(count: number, unnoted: number): string {
    if (unnoted === 0) return ".";
    if (unnoted === count) return ", none of them written up yet.";
    return `, ${unnoted} still waiting on a note.`;
}

export default function CaseIndex() {
    const everything = CATEGORIES.flatMap((c) => c.items);
    const all = summarise(everything);
    const filled = CATEGORIES.filter((c) => c.items.length > 0).length;

    return (
        <main className="case-room">
            <header className="case-masthead">
                <h1 className="case-title">The Case</h1>
                <p className="case-standfirst">
                    {all.count === 0
                        ? "Three drawers, labelled and empty."
                        : `${all.count} things, ${filled} of ${CATEGORIES.length} drawers filled` +
                          noteState(all.count, all.unnoted)}
                </p>
            </header>

            <div className="case-fronts">
                {CATEGORIES.map((c) => (
                    <DrawerFront key={c.slug} category={c} />
                ))}
            </div>

            <Rail />
        </main>
    );
}

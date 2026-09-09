import path from "node:path";
import sharp from "sharp";
import { describe, expect, it } from "vitest";
import { anglesFor, canonicalAngle, shotPath } from "./angles";
import { CATEGORIES } from "./index";

const PUBLIC = path.resolve(__dirname, "../../public");

/* ============================================================
   Is the plate actually uniform?

   The angle vocabulary says every shoe in the catalogue is photographed
   `lateral`. Nothing enforced that the file behind the label was really a
   lateral, and it stopped being true the moment a migration set the field
   in bulk: three of seven shoes ended up pointing the wrong way and two were
   pairs rather than single shoes, all labelled identically.

   Aspect ratio catches that class of error without anyone having to look. A
   lateral shoe is landscape — every real one lands between about 1.5 and 2.5.
   A top-down pair is portrait, around 0.8, and stands out by a mile.

   It only works where the objects in a category share a silhouette, which is
   why perfumes are exempt: a squat square Khamrah flacon really is nearly
   twice as wide, relative to its height, as a tall Afnan bottle standing
   beside it. Both are honest `bottle` shots. Loosening the tolerance until
   perfumes passed would have made the check useless for the two categories
   where it works, so it is scoped instead of weakened.

   The check needs at least three shots to have a median worth comparing
   against, so a thinly-populated angle is skipped rather than guessed at.
   ============================================================ */

/** Categories whose objects are shaped alike enough for the ratio to mean
    something. Perfume bottles are deliberately not. */
const SHAPE_CONSISTENT = new Set(["watches", "shoes"]);

const MIN_GROUP = 3;

/* The canonical angle is the one the plate renders, so a dozen of them sit
   side by side and any drift is immediately visible. It gets the strict
   tolerance.

   Secondary angles are only ever seen one item at a time, in that item's own
   vitrine. Brands genuinely differ there — Seiko and Timex photograph a
   profile with the bracelet laid open, Casio and Diesel shoot it tight, and
   all four are honest profiles. A looser bound still catches the real
   mislabels (a landscape three-quarter among portrait ones drifts by 1.6)
   without forcing four legitimate photographs down to two for the sake of a
   row nobody sees side by side. */
const TOLERANCE_CANONICAL = 0.4;
const TOLERANCE_SECONDARY = 0.75;

async function boundingBox(file: string) {
    const { info } = await sharp(file)
        .trim({ threshold: 8 })
        .toBuffer({ resolveWithObject: true });
    return { width: info.width, height: info.height };
}

const median = (values: number[]) => {
    const sorted = [...values].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 === 0
        ? (sorted[mid - 1] + sorted[mid]) / 2
        : sorted[mid];
};

describe.each(CATEGORIES)("$label plate", (category) => {
    it("frames every object to the same proportion of the canvas", async () => {
        for (const item of category.items) {
            for (const angle of item.shots) {
                const file = path.join(
                    PUBLIC,
                    shotPath(category.slug, item.id, angle)
                );
                const box = await boundingBox(file);
                const longest = Math.max(box.width, box.height);
                // The normaliser puts the object at 78% of an 800px canvas.
                // A shot that has not been through it will not match.
                expect(
                    longest,
                    `${item.id}.${angle} is ${longest}px on its long side, not 624`
                ).toBeGreaterThan(600);
            }
        }
    }, 30000);

    it.each(anglesFor(category.slug).map((a) => a.key))(
        "shoots %s the same way on every object",
        async (angle) => {
            if (!SHAPE_CONSISTENT.has(category.slug)) return;
            const present = category.items.filter((i) =>
                i.shots.includes(angle)
            );
            if (present.length < MIN_GROUP) return;

            const ratios = await Promise.all(
                present.map(async (item) => {
                    const box = await boundingBox(
                        path.join(
                            PUBLIC,
                            shotPath(category.slug, item.id, angle)
                        )
                    );
                    return { id: item.id, ratio: box.width / box.height };
                })
            );

            const mid = median(ratios.map((r) => r.ratio));
            const tolerance =
                angle === canonicalAngle(category.slug).key
                    ? TOLERANCE_CANONICAL
                    : TOLERANCE_SECONDARY;
            for (const { id, ratio } of ratios) {
                const drift = Math.abs(ratio - mid) / mid;
                expect(
                    drift,
                    `${id}.${angle} has aspect ratio ${ratio.toFixed(2)} against ` +
                        `a group median of ${mid.toFixed(2)} — that usually means ` +
                        `it is not really a "${angle}" shot`
                ).toBeLessThan(tolerance);
            }
        },
        30000
    );
});

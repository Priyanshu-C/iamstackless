/* ============================================================
   THE CASE — what the world says about each object.

   Kept apart from the item files on purpose. Those are hand-authored and
   have to stay cheap to edit; this is gathered from public sources,
   separately reviewable, and revertible on its own if a research pass turns
   out to be wrong.

   `why` is NOT here, and must never be added. That field is the owner's —
   the one thing in the whole catalogue that is never sourced and never
   guessed. The integrity suite fails the build if this file grows one.
   ============================================================ */

export type Research = {
    /** One line: the object's place in the world. */
    standing?: string;
    /** Two to four sentences: what it is, what is distinctive about it, and
        why it turns up in collections. Absent when nothing could be
        established — an omitted note is better than a padded one. */
    note?: string;
    /** Every URL actually read. Required whenever `standing` or `note` is set,
        and the integrity suite enforces it. A catalogue that asserts without
        citing is one you cannot check a year later. */
    sources: string[];
    /** Category-specific facts, as strings, exactly as a source stated them.
        A hand-entered value on the item always beats one of these. */
    specs?: Record<string, string>;
};

export const RESEARCH: Record<string, Research> = {};

export function researchFor(id: string): Research | null {
    return RESEARCH[id] ?? null;
}

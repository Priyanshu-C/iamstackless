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

export const RESEARCH: Record<string, Research> = {
    "afnan-9pm": {
        standing:
            "A widely sold Middle Eastern mass-market EDP, known mainly through online fragrance-community comparisons.",
        note: "A sweet, spiced amber-vanilla eau de parfum from the Dubai house Afnan, released in 2020. It is one of the most frequently cited dupes in online fragrance discussion, repeatedly described by reviewers and retailers as smelling close to Jean Paul Gaultier's Ultra Male. It is inexpensive and performs well above its price, which is the reason it circulates in budget collections rather than any note it originated itself.",
        sources: [
            "https://www.fragrantica.com/perfume/Afnan/9pm-65414.html",
            "https://www.nykaa.com/afnan-9pm-vaporisateur-long-lasting-unisex-eau-de-parfum/p/19918951",
        ],
    },
    "beardo-black-musk": {
        standing:
            "A budget Indian eau de parfum from a mass-market grooming brand, undocumented on the major perfume databases.",
        note: "One of Beardo's lower-priced EDPs, sold mainly through the brand's own site and Indian marketplaces. A straightforward musky-woody scent with no claimed lineage to any designer fragrance, and no perfumer or release year is publicly documented. It reads as a functional, inexpensive daily fragrance rather than an object with independent standing.",
        sources: [
            "https://www.parfumo.com/Perfumes/beardo/black-musk",
            "https://www.amazon.in/Beardo-Black-Perfume-PERFUM-Lasting/dp/B09B57R6W6",
        ],
    },
    "versace-eros": {
        standing:
            "One of the best-selling mainstream men's fragrances of the 2010s.",
        note: "A mainstream aromatic fougere built on a sweet mint-and-vanilla accord, created by Aurelien Guichard and launched by Versace in 2012. It is a genuine designer release rather than a clone of anything else, and its scale of sales — and the flankers it has spawned, including Flame, Energy and Parfum — accounts for how often it turns up in collections.",
        sources: [
            "https://www.fragrantica.com/perfume/Versace/Eros-16657.html",
            "https://persolaise.com/2013/01/persolaise-review-eros-from-versace.html",
        ],
    },
    "beardo-godfather": {
        standing:
            "A budget Indian eau de parfum sold on a boss-and-mafia theme, untracked by the major fragrance databases.",
        note: "One of Beardo's higher-volume EDPs, an aromatic woody-spicy scent on mint, lemon, geranium, vetiver and musk. No perfumer or release date is publicly documented, and no source describes it as based on a specific designer fragrance. It reads as an original, simple in-house formulation aimed at the mass Indian market rather than a collector's item.",
        sources: [
            "https://beardo.in/products/beardo-godfather-perfume-edp",
            "https://www.amazon.in/Godfather-Perfume-Premium-Fragrance-Aromatic/dp/B08NX1V7MC",
        ],
    },
    "tmc-infinite": {
        standing:
            "A celebrity-collaboration EDT from an Indian D2C grooming brand.",
        note: "A simple citrus-cedar-vetiver eau de toilette released by The Man Company alongside the YouTuber Bhuvan Bam around 2022, part of a marketing tie-in rather than a fragrance credited to a named perfumer. It has no documented relationship to any designer scent, and is a straightforward budget aromatic aimed at buyers of the wider merchandise line.",
        sources: [
            "https://www.themancompany.com/products/eau-de-toilette-infinite-100-ml",
            "https://www.campaignindia.in/article/the-man-company-gets-bhuvan-bam/480313",
        ],
    },
    "bella-vita-ceo-man": {
        standing:
            "A mass-market Indian eau de parfum sold on an office-wear, boss-branded positioning.",
        note: "Bella Vita Luxury's entry-level men's EDP, launched in 2021 by a Gurugram brand built to undercut international designer prices. Reviewers have called it a weak approximation of YSL Y. A later, more concentrated line extension — CEO Man Intense, 2023 — is instead compared to Le Male Le Parfum; the two are different formulas, and that comparison should not be read onto this bottle.",
        sources: [
            "https://www.fragrantica.com/perfume/BellaVita/CEO-Man-107163.html",
            "https://www.bellavitaluxury.co.in/products/ceo-man-mens-luxury-perfume",
        ],
    },
    "lattafa-asad": {
        standing:
            "One of Lattafa's most talked-about budget releases, an amber-spice scent sold worldwide.",
        note: "Asad — lion, in Arabic — is built on tobacco, pineapple and coffee over a vanilla-amber base, released in 2021. It is frequently recommended online as an inexpensive alternative to pricier dark-spicy fragrances, though no source checked names one specific perfume it clones. The bottle here was identified from its tall matte-black cylinder, gold collar and round lion medallion; Lattafa's other lion-branded lines use different shapes, though same-shaped colourway flankers do exist.",
        sources: [
            "https://www.fragrantica.com/perfume/Lattafa-Perfumes/Asad-72821.html",
            "https://www.lattafa-usa.com/products/asad",
        ],
    },
    "lattafa-khamrah-qahwa": {
        standing:
            "Among the best-received budget gourmand fragrances of its year.",
        note: "A coffee-forward gourmand spice fragrance, a flanker to Lattafa's original Khamrah, released in 2023 and named among the winners of Fragrantica's 2024 Readers' Choice Awards. It is widely discussed as a close, inexpensive equivalent to Kilian's Black Phantom and Angels' Share; reviewers are clear it is not a molecule-for-molecule clone but shares the coffee-praline-tonka character. A genuine case of a budget fragrance earning critical attention on its own account.",
        sources: [
            "https://www.fragrantica.com/perfume/Lattafa-Perfumes/Khamrah-Qahwa-88175.html",
            "https://www.fragrantica.com/news/Khamrah-Qahwa-by-Lattafa-Perfumes-A-Review-of-One-of-the-Winners-of-the-FRAGRANTICA-Readers-Choice-Awards-2024-21886.html",
        ],
    },
    "beardo-origin": {
        standing:
            "An early, now-discontinued Beardo EDP, no longer listed on the brand's own site.",
        note: "One of Beardo's early eau de parfums, a fresh aquatic-musk scent dated to around 2019 by Parfumo. It no longer appears in Beardo's current catalogue, which now centres on newer lines, and it carries no perfumer credit or claimed designer lineage. An inexpensive, functional fragrance from India's mass grooming market.",
        sources: [
            "https://www.parfumo.com/Perfumes/beardo/origin",
            "https://www.amazon.in/Beardo-Origin-Perfume-Men-100/dp/B07PWQFRD2",
        ],
    },
    "beardo-mariner": {
        standing:
            "A current budget Indian aquatic EDP, still part of Beardo's active line.",
        note: "A fresh marine-aromatic EDP built around a sea-water accord with lavender, jasmine, cashmere wood and white musk, still on sale through Beardo's own site. No perfumer or release year is published, and no source describes it as modelled on a specific designer fragrance. Beardo's own page lists a flat ingredient set rather than a formal pyramid, so the tiering here is drawn from retailer listings.",
        sources: [
            "https://beardo.in/products/beardo-mariner-perfume-edp-50ml",
            "https://www.flipkart.com/beardo-mariner-edp-perfume-fresh-aqua-notes-strong-hints-long-lasting-aroma-eau-de-parfum-50-ml/p/itm01e3e1b2dcfe9",
        ],
    },
    "rasasi-hawas-ice": {
        standing:
            "A flanker to Rasasi's Hawas line, from one of the UAE's oldest and largest perfume houses.",
        note: "A cooler, more citrus-forward flanker to the original Hawas for Him, released in 2023 by a Dubai house founded in 1979. It is regularly described as similar in impression to Paco Rabanne's Invictus Aqua — fresh, cool, faintly sweet — though not a literal clone. Rasasi is a long-running manufacturer rather than a budget imitator, even though its prices sit far below the fragrances it gets compared to.",
        sources: [
            "https://www.fragrantica.com/perfume/Rasasi/Hawas-Ice-89050.html",
            "https://www.amazon.com/RASASI-Hawas-Ice-Men-EDP/dp/B0CKM2SSK3",
        ],
    },
    "police-to-be-the-king": {
        standing:
            "A novelty-bottle Police release, known more for its flacon than for its juice.",
        note: "Police's 2013 men's eau de toilette, sold in a black skull-shaped bottle topped with a gold crown as part of the To Be line. Police built its identity in eyewear before extending into fragrance, and this release's main point of interest is the bottle rather than the scent. The juice itself is a fairly conventional spiced woody-amber composition.",
        sources: [
            "https://www.fragrantica.com/perfume/Police/TO-BE-The-King-18799.html",
            "https://www.mavive.com/en/to-be-the-kingthe-queen/81-eau-de-toilette-for-him-333.html",
        ],
    },
};

export function researchFor(id: string): Research | null {
    return RESEARCH[id] ?? null;
}

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
    "diesel-dz4323": {
        standing:
            "Mass-market fashion chronograph; oversized case is the whole idea, no in-house movement, no collector market.",
        note: "The Mega Chief line is Diesel's oversized quartz chronograph collection, made under the Fossil Group watch license rather than by an in-house movement maker. The DZ4323 pairs a 59mm stainless steel case (black-plated, per Watch Connection) with a black leather strap and mineral crystal, and carries a 10 ATM (100m) water resistance rating that exceeds what its fashion-watch role requires. The movement is a generic quartz chronograph module; no specific caliber is published for it anywhere in Diesel's or retailers' listings. It trades as a current-production fashion accessory, not as a piece with any secondary or collector market.",
        specs: {
            caseMaterial: "Stainless steel (black-plated)",
            crystal: "Mineral crystal",
            waterResistance: "10 ATM / 100m",
            lugWidth: "26mm (strap width)",
        },
        sources: [
            "https://www.tictacarea.com/en/diesel-watches/diesel-dz4323-watch-diesel-mega-chief-dz4323",
            "https://www.watch-connection.com/products/diesel-mega-chief-black-dial-black-leather-strap-watch-for-men-dz4323",
            "https://watchdirect.shop/products/diesel-dz4323-multi-colour-dial-mens-watch",
        ],
    },
    "diesel-dz4581": {
        standing:
            "Same Mega Chief format on a two-tone bracelet; a fashion watch, not a collected one.",
        note: "The DZ4581 is a 51mm variant of the same Mega Chief architecture as the DZ4323, substituting a two-tone (silver and gold) stainless steel bracelet with deployant clasp for a leather strap. The case is 14mm thick, fitted with mineral crystal over a black sunray dial with chronograph sub-dials and a date window, and rated to 100m water resistance. The movement is a quartz chronograph module; Diesel does not publish a specific caliber name for it. Like the DZ4323, it is a current production fashion item with no distinguishing rarity or collector history.",
        specs: {
            caseMaterial: "Stainless steel",
            crystal: "Mineral crystal",
            waterResistance: "100m",
            lugWidth: "26mm",
        },
        sources: [
            "https://www.watchnation.com/products/diesel-mega-chief-chronograph-two-tone-stainless-steel-watch-mens-dz4581",
            "https://phoenixjewellers.ca/products/diesel-two-tone-mega-chief-dz4581",
        ],
    },
    "seiko-ssk035k1": {
        standing:
            "Automatic GMT built on the SKX diver silhouette; a well-received recent addition to a long-running case shape.",
        note: "The SSK035K1 is part of Seiko's 2024 SKX Sports Style GMT expansion, which puts a GMT complication and a jubilee-style bracelet onto the 42.5mm case and 4 o'clock crown position that defined the SKX007-generation dive watches for more than two decades. It runs Seiko's in-house 4R34 automatic caliber (24 jewels, roughly 41-hour power reserve, hand-winding and hacking) under a Hardlex crystal with a magnified date window, on a 22mm lug width. Water resistance is 100m, down from the 200m of the original SKX divers this case shape descends from. The GMT versions of the SKX Sports Style line have been received more favorably than the earlier non-GMT SKX Sports Style watches, largely on the strength of the added complication and upgraded bracelet at a comparatively low price.",
        specs: {
            caseMaterial: "Stainless steel",
            crystal: "Hardlex (magnified date window)",
            waterResistance: "100m / 10 bar",
            calibre: "4R34 automatic",
            lugWidth: "22mm",
            powerReserve: "Approx. 41 hours",
            released: "2024",
        },
        sources: [
            "https://www.seikowatches.com/us-en/products/5sports/ssk035",
            "https://timeandtidewatches.com/seiko-5-skx-sports-style-gmt-hands-on/",
        ],
    },
    "timex-tweg26713": {
        standing:
            "First-ever chronograph and first quartz movement carried by the Marlin name; a design extension, not a period reissue.",
        note: "Timex's Marlin name dates to a 1950s-60s dress watch line, revived in 2017 as a small hand-wound mechanical reissue. The Chronograph Tachymeter series that includes the TWEG26713 departs from that revival: it is the first chronograph and the first quartz-powered watch to carry the Marlin name, rather than a reproduction of a period original. This reference has a stainless steel case around 42mm with a domed acrylic (Hesalite-type) crystal, a tachymeter scale, and 50m water resistance, on a two-tone steel bracelet with deployant clasp. It reads as a current product using retro Marlin styling cues -- applied indices, a domed crystal -- rather than a faithful copy of any specific vintage Marlin chronograph, since no chronograph existed in the original 1950s-70s Marlin line.",
        specs: {
            caseMaterial: "Stainless steel (two-tone)",
            crystal: "Acrylic (domed, Hesalite-type)",
            waterResistance: "50m",
            lugWidth: "22mm",
        },
        sources: [
            "https://shop.timexindia.com/products/timex-marlin-champagne-round-dial-analog-men-watch-tweg26713",
            "https://masterhorologer.com/2026/05/01/hands-on-review-timex-marlin-chronograph-tachymeter/",
            "https://timeandtidewatches.com/the-evolution-of-the-timex-marlin/",
        ],
    },
    "casio-gst-s110d": {
        standing:
            "Foundational steel-bezel G-STEEL, Casio's dress-leaning shock-resistant line; mainstream and still in production, not a rarity.",
        note: "The GST-S110D-1A launched June 26, 2015 as part of the first steel-cased generation of Casio's G-STEEL line, introducing the 'layer guard structure' -- a stainless steel outer bezel over a cushioning resin inner bezel -- aimed at a dressier, more metal-forward alternative to resin-cased G-Shocks, at a lower price than the metal MTG series. It runs Casio's Tough Solar module 5445, is rated to 200m water resistance under mineral crystal, and combines analog hands with a digital LCD, including a hand-shift function that moves the hands aside to read the display. It is a mainstream, long-running line rather than a discontinued or sought-after reference.",
        specs: {
            caseMaterial: "Resin case with stainless steel bezel and band",
            crystal: "Mineral",
            waterResistance: "200m",
            calibre: "Tough Solar, Module 5445",
            released: "June 2015",
        },
        sources: [
            "https://www.g-central.com/specs/g-shock-gst-s100-gst-s110/",
            "https://www.g-central.com/g-steel-gsts100-and-gsts110-models-revealed/",
        ],
    },
    "adidas-adimatic-mid-ynuk": {
        standing:
            "Limited collaboration reissue of a 1990s skate silhouette, part of a small Y2K-themed capsule.",
        note: "The Adimatic Mid YNuK is a mid-cut reissue of adidas's Adimatic, a suede skate shoe that dates to the mid-1990s and built a cult following in the Japanese skate scene. This release paired the silhouette with graphics and packaging by Crude, a Portugal-based artist, as one of four shoes (alongside a low-top Adimatic, a Campus 00s, and a Supermodified) in a capsule themed around early-2000s art, fashion, and nu-metal aesthetics. It is a design collaboration on an existing archival shoe rather than a new silhouette, and distribution was limited to select retailers before selling out.",
        specs: {
            styleCode: "IE2174",
            silhouette: "Adimatic Mid",
            released: "2023",
            upper: "Suede, with contrasting 3-Stripes and white laces",
            midsole:
                'Stacked "zigzag" midsole carried over from the original Adimatic design',
            closure: "Lace-up",
        },
        sources: [
            "https://www.solesense.com/en-us/adidas-crude-from-portugal-x-adimatic-mid-ynuk-ie2174",
            "https://sneakernews.com/2023/05/17/adidas-adimatic-campus-supermodified-ynuk-release-date/",
            "https://en.otokomaeken.com/masterpiece/273846",
            "https://www.soleretriever.com/news/articles/adidas-adimatic-2022",
        ],
    },
    "adidas-adifom-climacool": {
        standing:
            "Mass-market foam lifestyle sneaker, adidas's foam-line answer to the Yeezy Foam Runner rather than a specialist or heritage piece.",
        note: "The Adifom Climacool is a slip-on-styled, foam-shelled sneaker in adidas's adiFOM family, built the same way as its predecessor the adiFOM Q: a breathable mesh inner bootie surrounded by a molded, bio-based foam exoskeleton, with a ClimaCool tongue tab reviving the name of adidas's early-2000s ventilation tech rather than any specific technical link to it. It retailed at $120 at a mainstream, wide-release level (not a limited drop), and multiple outlets have since discounted it well below that price, which is consistent with ordinary retail sneaker performance rather than sustained demand.",
        specs: {
            styleCode: "IF3909",
            silhouette: "adiFOM Climacool",
            released: "July 2023",
            upper: "Textile mesh inner bootie with a molded bio-based foam outer shell/cage (upper contains at least 50% recycled content)",
            midsole:
                "Molded adiFOM foam construction (foam forms both midsole and outer shell)",
            closure: "Lace",
        },
        sources: [
            "https://www.highsnobiety.com/p/adidas-adifom-climacool/",
            "https://thesolesupplier.co.uk/news/adidas-adifom-climacool-steps-in-to-fill-the-foam-runner-void/",
            "https://captaincreps.com/product/adidas-adifom-climacool-white-black-if3909/",
            "https://www.modalite.net/us/men/adidas/shoes/adifom-climacool-shoes/6988486/",
        ],
    },
    "jordan-one-take-5": {
        standing:
            'Budget-tier signature basketball shoe from a line already being phased out, in an outdoor-oriented "PF" build — an ordinary mass-market performance shoe, not a collector piece.',
        note: "This is the fifth and, per one performance review, likely final signature shoe in Russell Westbrook's Jordan One Take line, retailing at $100. The base One Take 5 launched in December 2023 with a Zoom Air unit under the forefoot on a phylon midsole, a TPU shank plate, and a mixed mesh/leather/suede/textile upper with two forefoot straps for lockdown. \"PF\" ('Performance Fit,' per sneaker-terminology write-ups) denotes a variant built with a harder, more durable outsole compound and a wider fit intended for outdoor-court play. This Stone Blue/Mystic Navy/Midnight Navy/Bleached Coral PF colorway (style FD2336-400) is one of several colorways issued through 2024 in the line's ordinary retail cycle, not a special or limited release.",
        specs: {
            styleCode: "FD2336-400",
            silhouette: "Jordan One Take 5 PF",
            upper: "Mixed construction: short-cut suede at the heel, synthetic leather at the midfoot, textile/mesh wrap at the forefoot, plus a thick lateral rubber panel and TPU detailing",
            midsole:
                "Phylon midsole with a top-loaded Zoom Air unit in the forefoot and a TPU shank plate for torsional support",
            closure: "Laces plus two forefoot straps for containment",
        },
        sources: [
            "https://weartesters.com/jordan-one-take-5-review/",
            "https://www.soleretriever.com/news/articles/russell-westbrook-jordan-one-take-5-release-date-2023",
            "https://sneakerbardetroit.com/jordan-one-take-5/",
            "https://decentfoot.com/what-is-pf-in-jordan-shoes/",
            "https://www.kickscrew.com/products/air-jordan-one-take-5-pf-stone-blue-navy-fd2336-400",
        ],
    },
    "nike-air-max-sc": {
        standing:
            "Ordinary mass-market Air Max; sold continuously as Nike's cheapest Air model, with no distinct collector standing.",
        note: 'The Air Max SC is Nike\'s entry-level Air Max, sitting below the retro-numbered models (Air Max 1, 90, 95, etc.) in Nike\'s own hierarchy; sneaker press has noted the initials are informally read as "Super Cheap." It pairs a mesh-and-synthetic-leather upper with a foam midsole carrying a visible Max Air unit in the heel, closed with ordinary lacing. No officially catalogued "White / Sea Green" colorway could be confirmed — the closest documented releases are White/Gorge Green (CW4555-109) and White/Stadium Green (CW4555-110), so the style code and release date for this specific pair are left blank rather than guessed.',
        specs: {
            silhouette: "Air Max SC",
            upper: "Mesh with synthetic and leather overlays",
            midsole: "Foam midsole with a visible Max Air unit in the heel",
            closure: "Standard lace-up",
        },
        sources: [
            "https://www.nike.com/t/air-max-sc-mens-shoes-LR42xg",
            "https://runrepeat.com/nike-air-max-sc",
            "https://stockx.com/nike-air-max-sc-white-gorge-green",
        ],
    },
    "jordan-access-ps": {
        standing:
            "Budget Jordan Brand basketball shoe; this is a toddler/preschool-size run of an accessible adult silhouette, not a collector item.",
        note: "The Jordan Access is Jordan Brand's lower-priced basketball-styled lifestyle shoe, positioned well below premium Air Jordan retros. The Black/Gym Red/White PS (preschool) colorway carries style code AV7942-006, released August 1, 2019 at $65 retail. Construction is a perforated leather, synthetic and textile upper over a Nike Air-cushioned unit with foam in the heel and forefoot, closed with standard lacing and a padded tongue with an interior strap.",
        specs: {
            styleCode: "AV7942-006",
            silhouette: "Jordan Access",
            released: "August 2019",
            upper: "Perforated leather, synthetic, and textile",
            midsole: "Nike Air-cushioned unit with foam in heel and forefoot",
            closure: "Lace-up, padded tongue with interior strap",
        },
        sources: [
            "https://stockx.com/air-jordan-access-black-gym-red-white-ps",
            "https://www.nike.com/id/t/jordan-access-mens-shoes-wVQn6G",
            "https://stockx.com/air-jordan-access-bred",
        ],
    },
    "adidas-samba-xlg": {
        standing:
            "Current-line, thick-soled Samba variant riding the broader 2020s Samba boom; sold at standard retail, not vintage or scarce.",
        note: "The Samba XLG is an oversized reworking of the Samba OG terrace shoe, launched by adidas Originals in August 2023 with a doubled-up gum rubber sole and a full-length EVA midsole in place of the OG's slim leather sole. This Cream White/Gum pair carries style code JQ8182 and a $110 retail price; its own release date could not be confirmed distinctly from the general line's 2023 debut. Construction across the XLG line is leather with a full leather lining and padded tongue; a specific closure description for this pair was not found, though it is laced in the standard Samba pattern.",
        specs: {
            styleCode: "JQ8182",
            silhouette: "Samba XLG",
            upper: "Leather with full leather lining",
            midsole:
                "Full-length EVA midsole under a doubled-up gum rubber sole",
        },
        sources: [
            "https://stockx.com/adidas-samba-xlg-cream-white-gum",
            "https://www.sneakerfreaker.com/features/adidas-samba-differences-buyers-guide",
            "https://thesolesupplier.co.uk/release-dates/adidas/samba/adidas-samba-xlg-white-black-gum/",
            "https://www.soleretriever.com/news/articles/adidas-samba-xlg-wheat-release-date-2024",
        ],
    },
    "adidas-superstar-2": {
        standing:
            "Recently revived adidas Originals line, not a vintage pair; the collectible interest, if any, lies in the color-shift stripe detail rather than scarcity.",
        note: 'The Superstar II is the padded, chunkier update of adidas\'s 1969 Superstar shell-toe — historically known for a thicker, heavily padded "fat tongue" and a more deeply gridded shell toe than the OG, and closely tied to 1990s hip-hop and skate culture. "Superstar II" existed for years only as an occasional heritage reissue name before adidas revived it as a standing product line in February 2025. This Core Black/Matte Silver/Cloud White pair (JQ3209, $100 retail) is part of that 2025 relaunch and is distinguished by a color-shift ("lenticular") treatment on the 3-Stripes that changes appearance with viewing angle. Its exact release date could not be pinned down — one source lists January 2025, others suggest July 2025 — so it is left blank rather than guessed; upper material and closure for this specific colorway were not confirmed either, though tumbled leather uppers are documented on sibling releases in the same 2025 line.',
        specs: {
            styleCode: "JQ3209",
            silhouette: "Superstar II",
        },
        sources: [
            "https://stockx.com/adidas-superstar-ii-core-black-matte-silver-cloud-white",
            "https://www.sivasdescalzo.com/us/blog/evolution-adidas-superstar",
            "https://limitededt.in/products/superstar-2-core-black-matte-silver-cloud-white",
            "https://en.wikipedia.org/wiki/Adidas_Superstar",
            "https://snkrdunk.com/en/magazine/2025/04/11/adidas-superstar-ii-chicago-release-date-price-where-to-buy/",
        ],
    },
    "armani-stronger-with-you-intensely": {
        standing:
            "A 2019 flanker of the 2017 original; common in collections, neither rare nor discontinued.",
        note: "An eau de parfum flanker in Emporio Armani's Stronger With You line, one of more than a dozen spin-offs from the 2017 eau de toilette. It keeps the pink pepper and lavender-sage frame of the original but replaces its chestnut-smoke base with toffee, cinnamon, tonka bean, vanilla, amber and suede — sweeter and warmer, at the higher concentration. It turns up often because it is a mainstream department-store fragrance with heavy sales, not because it is scarce. Fragrantica credits a perfumer for the 2017 original but names none for this one.",
        sources: [
            "https://www.fragrantica.com/perfume/Giorgio-Armani/Emporio-Armani-Stronger-With-You-Intensely-52802.html",
            "https://www.fragrantica.com/perfume/Giorgio-Armani/Emporio-Armani-Stronger-With-You-45258.html",
        ],
    },
};

export function researchFor(id: string): Research | null {
    return RESEARCH[id] ?? null;
}

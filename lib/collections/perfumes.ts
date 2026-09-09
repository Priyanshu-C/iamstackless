import type { Perfume } from "./types";

/* Add a perfume by appending to this array. `seq` is the acquisition order
   and is never renumbered — №01 is always the first one you bought. The
   numbers below are the order the bottles appeared in the photographs, not a
   known purchase order; renumber them once by hand when you know.

   `shots` lists which angles have been photographed. Paths are derived from
   the id and the angle — see lib/collections/angles.ts. The canonical angle
   ("bottle") must be present if any is.

   WHAT IS DELIBERATELY MISSING HERE

   `price`, `acquired` and `why` are yours. Every bottle below came in as a
   photograph rather than a receipt, so none of the three is known and none is
   guessed. They render as visible blanks until you fill them in:

       price: { amount: 4200, currency: "INR" },
       acquired: "2024-11",
       why: "Bought it the week I moved out.",

   `volume` is set only where the bottle itself states it. A retailer's listed
   size is the size they sell, not necessarily the one standing on the shelf,
   so where the label could not be read the field is left off rather than
   filled from a listing.

   The write-ups live in lib/collections/research.ts, keyed by id, because
   they are compiled from public sources rather than written here. */

export const perfumes: Perfume[] = [
    {
        id: "afnan-9pm",
        seq: 1,
        name: "9pm",
        brand: "Afnan",
        shots: ["bottle"],
        concentration: "EDP",
        volume: 100,
        released: "2020",
        notes: {
            top: ["bergamot", "lavender", "cinnamon", "apple"],
            heart: ["lily of the valley", "orange blossom"],
            base: ["patchouli", "amber", "vanilla", "tonka bean"],
        },
    },
    {
        id: "beardo-black-musk",
        seq: 2,
        name: "Black Musk",
        brand: "Beardo",
        shots: ["bottle"],
        concentration: "EDP",
        volume: 50,
        notes: {
            top: ["lavender", "musk"],
            heart: ["bergamot", "cedarwood", "amber"],
            base: ["oakmoss", "patchouli"],
        },
    },
    {
        id: "versace-eros",
        seq: 3,
        name: "Eros",
        brand: "Versace",
        shots: ["bottle"],
        concentration: "EDT",
        released: "2012",
        perfumer: "Aurélien Guichard",
        notes: {
            top: ["mint", "green apple", "lemon"],
            heart: ["tonka bean", "geranium", "ambroxan"],
            base: ["vanilla", "vetiver", "oakmoss", "cedarwood"],
        },
    },
    {
        id: "beardo-godfather",
        seq: 4,
        name: "Godfather",
        brand: "Beardo",
        shots: ["bottle"],
        concentration: "EDP",
        volume: 100,
        notes: {
            top: ["mint", "lemon"],
            heart: ["geranium"],
            base: ["vetiver", "musk"],
        },
    },
    {
        id: "tmc-infinite",
        seq: 5,
        name: "Infinite",
        brand: "The Man Company × Bhuvan Bam",
        shots: ["bottle"],
        concentration: "EDT",
        volume: 100,
        released: "2022",
        notes: {
            top: ["grapefruit"],
            heart: ["cedarwood"],
            base: ["vetiver"],
        },
    },
    {
        id: "bella-vita-ceo-man",
        seq: 6,
        name: "CEO Man",
        brand: "Bella Vita Luxury",
        shots: ["bottle"],
        concentration: "EDP",
        volume: 100,
        released: "2021",
        notes: {
            top: ["citrus", "apple", "ginger"],
            heart: ["geranium", "juniper", "sage"],
            base: ["amber", "cedar", "vetiver", "tonka bean"],
        },
    },
    {
        id: "armani-stronger-with-you-intensely",
        seq: 7,
        name: "Stronger With You Intensely",
        brand: "Emporio Armani",
        shots: ["bottle"],
        concentration: "EDP",
        released: "2019",
        // Intensely's own pyramid, not the 2017 original's — the two differ
        // in the base, which is the whole point of the flanker.
        notes: {
            top: ["pink pepper", "juniper", "violet"],
            heart: ["toffee", "cinnamon", "lavender", "sage"],
            base: ["vanilla", "amber", "tonka bean", "suede"],
        },
    },
    {
        id: "lattafa-asad",
        seq: 8,
        name: "Asad",
        brand: "Lattafa",
        shots: ["bottle"],
        concentration: "EDP",
        released: "2021",
        notes: {
            top: ["black pepper", "tobacco", "pineapple"],
            heart: ["patchouli", "coffee", "iris"],
            base: ["vanilla", "amber", "dry wood", "benzoin", "labdanum"],
        },
    },
    {
        id: "lattafa-khamrah-qahwa",
        seq: 9,
        name: "Khamrah Qahwa",
        brand: "Lattafa",
        shots: ["bottle"],
        concentration: "EDP",
        released: "2023",
        notes: {
            top: ["cinnamon", "cardamom", "ginger"],
            heart: ["praline", "candied fruits", "white flowers"],
            base: ["vanilla", "coffee", "tonka bean", "benzoin", "musk"],
        },
    },
    {
        id: "beardo-origin",
        seq: 10,
        name: "Origin",
        brand: "Beardo",
        shots: ["bottle"],
        concentration: "EDP",
        volume: 100,
        notes: {
            top: ["green notes", "lemon"],
            heart: ["aquatic notes", "jasmine", "lavender"],
            base: ["musk", "oakmoss"],
        },
    },
    {
        id: "beardo-mariner",
        seq: 11,
        name: "Mariner",
        brand: "Beardo",
        shots: ["bottle"],
        concentration: "EDP",
        volume: 50,
        notes: {
            top: ["sea water", "lavender"],
            heart: ["jasmine"],
            base: ["oakmoss", "cashmere wood", "white musk"],
        },
    },
    {
        id: "rasasi-hawas-ice",
        seq: 12,
        name: "Hawas Ice",
        brand: "Rasasi",
        shots: ["bottle"],
        concentration: "EDP",
        released: "2023",
        notes: {
            top: ["frozen apple", "bergamot", "lemon", "star anise"],
            heart: ["orange blossom", "marine accord", "plum", "cardamom"],
            base: ["moss", "driftwood", "amber", "musk"],
        },
    },
    {
        id: "police-to-be-the-king",
        seq: 13,
        name: "To Be The King",
        brand: "Police",
        shots: ["bottle"],
        concentration: "EDT",
        released: "2013",
        perfumer: "Pierre-Constantin Guéros",
        notes: {
            top: ["cardamom", "nutmeg", "cedar", "bay leaf", "lemon"],
            heart: ["lavender", "amber", "cashmere wood", "artemisia"],
            base: ["tonka bean", "resins", "orange blossom"],
        },
    },
];

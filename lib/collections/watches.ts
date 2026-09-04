import type { Watch } from "./types";

/* Add a watch by appending to this array.

   `seq` is the acquisition order — №01 is the first one you bought — and is
   never renumbered. The numbers below are the order the links were sent, not
   a known purchase order; renumber them once you know.

   `acquired` and `why` are yours to fill in. They are deliberately left off
   rather than guessed: the ledger shows a rule where a note is missing.

       acquired: "2023-08",
       why: "Bought it to stop borrowing my father's.",

   Prices are the listed price at the time the item was added. */

export const watches: Watch[] = [
    {
        id: "diesel-dz4323",
        seq: 1,
        name: "Mega Chief, leather",
        brand: "Diesel",
        price: { amount: 15986, currency: "INR" },
        image: "/images/collections/watches/diesel-dz4323.webp",
        movement: "quartz",
        caseSize: 59,
        reference: "DZ4323",
    },
    {
        id: "diesel-dz4581",
        seq: 2,
        name: "Mega Chief, steel",
        brand: "Diesel",
        price: { amount: 22495, currency: "INR" },
        image: "/images/collections/watches/diesel-dz4581.webp",
        movement: "quartz",
        caseSize: 51,
        reference: "DZ4581",
    },
    {
        id: "seiko-ssk035k1",
        seq: 3,
        name: "5 Sports SKX GMT",
        brand: "Seiko",
        price: { amount: 44999, currency: "INR" },
        image: "/images/collections/watches/seiko-ssk035k1.webp",
        movement: "automatic",
        caseSize: 42.5,
        reference: "SSK035K1",
    },
    {
        id: "timex-tweg26713",
        seq: 4,
        name: "Marlin Chronograph",
        brand: "Timex",
        price: { amount: 15495, currency: "INR" },
        image: "/images/collections/watches/timex-tweg26713.webp",
        movement: "quartz",
        caseSize: 42,
        reference: "TWEG26713",
    },
    {
        id: "casio-gst-s110d",
        seq: 5,
        name: "G-Shock G-Steel GST-S110D",
        brand: "Casio",
        price: { amount: 19995, currency: "INR" },
        image: "/images/collections/watches/casio-gst-s110d.webp",
        movement: "quartz",
        reference: "GST-S110D-1ADR",
    },
];

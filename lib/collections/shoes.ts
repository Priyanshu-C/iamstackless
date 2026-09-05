import type { Shoe } from "./types";

/* Add a shoe by appending to this array.

   `seq` is the acquisition order — №01 is the first pair you bought — and is
   never renumbered. The numbers below are the order the links were sent, not
   a known purchase order; renumber them once you know.

   `acquired`, `why` and `size` are yours to fill in. Size is a fact about your
   pair, not about the listing, so it is left off rather than guessed.

   Prices are the listed price at the time the item was added. */

export const shoes: Shoe[] = [
    {
        id: "nike-air-max-sc",
        seq: 1,
        name: "Air Max SC",
        brand: "Nike",
        price: { amount: 5995, currency: "INR" },
        image: "/images/collections/shoes/nike-air-max-sc.webp",
        material: "Leather",
        colourway: "White / Sea Green",
    },
    {
        id: "jordan-access-ps",
        seq: 2,
        name: "Access",
        brand: "Jordan",
        price: { amount: 83, currency: "USD" },
        image: "/images/collections/shoes/jordan-access-ps.webp",
        colourway: "Black / Gym Red / White",
    },
    {
        id: "adidas-samba-xlg",
        seq: 3,
        name: "Samba XLG",
        brand: "Adidas",
        price: { amount: 36499, currency: "INR" },
        image: "/images/collections/shoes/adidas-samba-xlg.webp",
        colourway: "Cream White / Gum",
    },
    {
        id: "adidas-adimatic-mid-ynuk",
        seq: 4,
        name: "Adimatic Mid YNuK",
        brand: "Crude From Portugal × Adidas",
        price: { amount: 15016, currency: "INR" },
        image: "/images/collections/shoes/adidas-adimatic-mid-ynuk.webp",
        colourway: "YNuK",
    },
    {
        id: "adidas-superstar-2",
        seq: 5,
        name: "Superstar 2",
        brand: "Adidas",
        price: { amount: 11999, currency: "INR" },
        image: "/images/collections/shoes/adidas-superstar-2.webp",
        colourway: "Core Black / Matte Silver / Cloud White",
    },
    {
        id: "adidas-adifom-climacool",
        seq: 6,
        name: "Adifom Climacool",
        brand: "Adidas",
        price: { amount: 17499, currency: "INR" },
        image: "/images/collections/shoes/adidas-adifom-climacool.webp",
        colourway: "White / Black",
    },
    {
        id: "jordan-one-take-5",
        seq: 7,
        name: "Westbrook One Take 5 PF",
        brand: "Jordan",
        price: { amount: 64.96, currency: "USD" },
        image: "/images/collections/shoes/jordan-one-take-5.webp",
        colourway: "Stone Blue / Mystic Navy",
    },
];

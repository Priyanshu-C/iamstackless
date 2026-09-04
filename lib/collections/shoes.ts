import type { Shoe } from "./types";

/* Add a shoe by appending to this array. `seq` is the acquisition order
   and is never renumbered — №01 is always the first one you bought.

   {
       id: "cdb-service-boot",
       seq: 1,
       name: "Service Boot",
       brand: "Viberg",
       acquired: "2024-01",
       price: { amount: 620, currency: "USD" },
       why: "The last pair of boots I intend to buy this decade.",
       image: "/images/collections/shoes/cdb-service-boot.webp",
       size: "UK 8",
       material: "Horween Chromexcel",
       colourway: "Colour 8",
   },
*/

export const shoes: Shoe[] = [];

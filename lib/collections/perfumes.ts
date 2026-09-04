import type { Perfume } from "./types";

/* Add a perfume by appending to this array. `seq` is the acquisition order
   and is never renumbered — №01 is always the first one you bought.

   {
       id: "tam-dao-edp",
       seq: 1,
       name: "Tam Dao",
       brand: "Diptyque",
       acquired: "2024-03",
       price: { amount: 14500, currency: "INR" },
       why: "Smells like the inside of a new guitar case.",
       image: "/images/collections/perfumes/tam-dao-edp.webp",
       house: "Diptyque",
       concentration: "EDP",
       notes: {
           top: ["cypress"],
           heart: ["sandalwood", "rosewood"],
           base: ["amber", "musk"],
       },
       volume: 75,
   },
*/

export const perfumes: Perfume[] = [];

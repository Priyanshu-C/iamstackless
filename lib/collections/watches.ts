import type { Watch } from "./types";

/* Add a watch by appending to this array. `seq` is the acquisition order
   and is never renumbered — №01 is always the first one you bought.

   {
       id: "seiko-skx007",
       seq: 1,
       name: "SKX007",
       brand: "Seiko",
       acquired: "2023-08",
       price: { amount: 24000, currency: "INR" },
       why: "Bought it to stop borrowing my father's.",
       image: "/images/collections/watches/seiko-skx007.webp",
       movement: "automatic",
       caseSize: 42,
       reference: "SKX007K1",
   },
*/

export const watches: Watch[] = [];

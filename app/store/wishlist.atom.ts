import { atomWithStorage } from "jotai/utils";

// Store wishlist product IDs locally
export const wishlistAtom = atomWithStorage<number[]>(
  "wishlist",
  [],
  undefined,
  { getOnInit: true }
);

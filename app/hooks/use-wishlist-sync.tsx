import { useAtom } from "jotai";
import { useEffect } from "react";
import { wishlistAtom } from "@/store/wishlist.atom";
import { miniProfileAtom } from "@/store/mini-profile.atom";
import { getWishlists } from "@/(app-routes)/(auth)/action";

export function useWishlistSync() {
  const [wishlistIds, setWishlistIds] = useAtom(wishlistAtom);
  const [userProfile] = useAtom(miniProfileAtom);

  useEffect(() => {
    // Only fetch wishlists if user is logged in
    if (userProfile) {
      const fetchWishlists = async () => {
        try {
          const response = await getWishlists();
          if (response.success && response.data) {
            // Extract product IDs from wishlist items
            const productIds = response.data.map((item) => item.product_id);
            setWishlistIds(productIds);
          }
        } catch (error) {
          console.error("Error syncing wishlist:", error);
        }
      };

      fetchWishlists();
    } else {
      // Clear wishlist when user logs out
      setWishlistIds([]);
    }
  }, [userProfile, setWishlistIds]);

  return { wishlistIds, setWishlistIds };
}

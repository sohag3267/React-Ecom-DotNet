"use client";

import { useWishlistSync } from "@/hooks/use-wishlist-sync";

export function WishlistSyncProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useWishlistSync();
  return <>{children}</>;
}

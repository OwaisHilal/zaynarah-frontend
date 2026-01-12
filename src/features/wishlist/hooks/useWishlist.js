// src/features/wishlist/hooks/useWishlist.js
import { useWishlistDomainStore } from '@/stores/wishlist';

export default function useWishlist() {
  const items = useWishlistDomainStore((s) => s.items);
  const hydrated = useWishlistDomainStore((s) => s.hydrated);

  const ids = items.map((i) => i.productId);
  const count = items.length;
  const isEmpty = hydrated && items.length === 0;

  return {
    items,
    ids,
    count,
    isEmpty,
    hydrated,
  };
}

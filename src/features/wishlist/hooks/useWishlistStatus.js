// src/features/wishlist/hooks/useWishlistStatus.js
import { useWishlistUIStore } from '@/stores/wishlist';

export default function useWishlistStatus() {
  const loading = useWishlistUIStore((s) => s.loading);
  const syncing = useWishlistUIStore((s) => s.syncing);
  const error = useWishlistUIStore((s) => s.error);

  return {
    loading,
    syncing,
    error,
  };
}

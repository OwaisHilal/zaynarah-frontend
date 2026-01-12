// src/features/wishlist/hooks/useWishlistActions.js
import { useWishlistDomainStore } from '@/stores/wishlist';
import { useWishlistUIStore } from '@/stores/wishlist';

export default function useWishlistActions() {
  const add = useWishlistDomainStore((s) => s.add);
  const remove = useWishlistDomainStore((s) => s.remove);
  const toggle = useWishlistDomainStore((s) => s.toggle);
  const has = useWishlistDomainStore((s) => s.has);

  const setSyncing = useWishlistUIStore((s) => s.setSyncing);
  const setError = useWishlistUIStore((s) => s.setError);

  const addToWishlist = async (product) => {
    try {
      setSyncing(true);
      add(product);
    } catch (e) {
      setError('Failed to add to wishlist');
    } finally {
      setSyncing(false);
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      setSyncing(true);
      remove(productId);
    } catch (e) {
      setError('Failed to remove from wishlist');
    } finally {
      setSyncing(false);
    }
  };

  const toggleWishlist = async (product) => {
    try {
      setSyncing(true);
      toggle(product);
    } catch (e) {
      setError('Failed to update wishlist');
    } finally {
      setSyncing(false);
    }
  };

  const isInWishlist = (productId) => {
    return has(productId);
  };

  return {
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    isInWishlist,
  };
}

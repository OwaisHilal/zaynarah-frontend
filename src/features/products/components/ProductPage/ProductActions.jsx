// src/features/products/components/ProductPage/ProductActions.jsx
import { useState } from 'react';
import { Heart, Share2, Check, Minus, Plus } from 'lucide-react';

import useCartActions from '@/features/cart/hooks/useCartActions';
import { useToast } from '@/features/ui/toast/context/useToast';
import { cn } from '@/lib/utils';

export default function ProductActions({
  product,
  mainImage,
  qty,
  setQty,
  wishlist,
  setWishlist,
}) {
  const { addItem } = useCartActions();
  const { showToast } = useToast();

  const [added, setAdded] = useState(false);
  const inWishlist = wishlist.includes(product.id);

  const handleAddToCart = async () => {
    const result = await addItem(
      {
        productId: product.id,
        title: product.title,
        price: product.price,
        image: mainImage || product.images?.[0],
      },
      qty
    );

    if (result === false) {
      showToast('Failed to add to cart', { variant: 'error' });
      return;
    }

    setAdded(true);
    showToast('Added to cart');
    setTimeout(() => setAdded(false), 1600);
  };

  const toggleWishlist = () => {
    const next = inWishlist
      ? wishlist.filter((id) => id !== product.id)
      : [...wishlist, product.id];

    setWishlist(next);
    localStorage.setItem('zaynarah_wishlist', JSON.stringify(next));
    showToast(inWishlist ? 'Removed from wishlist' : 'Saved to wishlist');
  };

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">
          Quantity
        </span>

        <div className="flex items-center rounded-full border overflow-hidden bg-card shadow-sm">
          <button
            onClick={() => setQty(Math.max(1, qty - 1))}
            className="w-12 h-12 flex items-center justify-center transition active:scale-95 hover:bg-muted"
          >
            <Minus size={16} />
          </button>

          <div className="w-12 text-center font-medium select-none">{qty}</div>

          <button
            onClick={() => setQty(qty + 1)}
            className="w-12 h-12 flex items-center justify-center transition hover:bg-accent active:scale-95"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

      <button
        onClick={handleAddToCart}
        disabled={added}
        className={cn(
          'relative w-full h-14 rounded-full text-base font-semibold transition-all active:scale-[0.97] shadow-md',
          added
            ? 'bg-primary text-primary-foreground'
            : 'bg-primary text-primary-foreground hover:shadow-lg'
        )}
      >
        {added ? (
          <span className="flex items-center justify-center gap-2">
            <Check size={18} />
            Added to cart
          </span>
        ) : (
          'Add to cart'
        )}
      </button>

      <div className="flex items-center gap-6 text-sm">
        <button
          onClick={toggleWishlist}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition"
        >
          <Heart
            size={16}
            className={cn(inWishlist && 'fill-accent text-accent')}
          />
          {inWishlist ? 'Saved' : 'Wishlist'}
        </button>

        <button
          onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            showToast('Link copied');
          }}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition"
        >
          <Share2 size={16} />
          Share
        </button>
      </div>

      <div className="pt-4 border-t text-xs text-muted-foreground leading-relaxed">
        • Handcrafted by Kashmiri artisans
        <br />• Free shipping over ₹1999 · Easy 7-day returns
      </div>
    </section>
  );
}

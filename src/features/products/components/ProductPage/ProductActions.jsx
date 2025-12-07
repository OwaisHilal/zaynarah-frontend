// src/features/products/components/ProductPage/ProductActions.jsx
import React from 'react';
import { Heart, HeartOff, Share2 } from 'lucide-react';
import { useCartStore } from '../../../cart/hooks/cartStore';

const ROSE_GOLD = '#B76E79';
const DEEP = '#0A0A0A';

export default function ProductActions({
  product,
  mainImage,
  qty,
  setQty,
  wishlist,
  setWishlist,
  toast,
  setToast,
  copied,
  setCopied,
}) {
  const addToCart = useCartStore((s) => s.addToCart);
  const inWishlist = wishlist.includes(product.id);

  const toggleWishlist = (prodId) => {
    const w = [...wishlist];
    const idx = w.indexOf(prodId);
    if (idx === -1) w.push(prodId);
    else w.splice(idx, 1);
    setWishlist(w);
    localStorage.setItem('zaynarah_wishlist', JSON.stringify(w));
    setToast(idx === -1 ? 'Saved to wishlist' : 'Removed from wishlist');
    setTimeout(() => setToast(''), 1200);
  };

  const handleAddToCart = () => {
    if (!product) return;
    addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      image: mainImage || product.images?.[0] || null,
      qty,
      variant: {},
    });
    setToast('Added to cart');
    setTimeout(() => setToast(''), 1200);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {}
  };

  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="flex items-center gap-2">
        <button
          onClick={() => setQty(Math.max(1, qty - 1))}
          aria-label="Decrease"
          className="w-10 h-10 rounded-lg border flex items-center justify-center"
          style={{ borderColor: 'rgba(0,0,0,0.06)' }}
        >
          −
        </button>
        <div className="w-12 text-center font-medium">{qty}</div>
        <button
          onClick={() => setQty(qty + 1)}
          aria-label="Increase"
          className="w-10 h-10 rounded-lg"
          style={{ background: ROSE_GOLD, color: '#fff' }}
        >
          +
        </button>
      </div>

      <button
        onClick={handleAddToCart}
        className="ml-2 px-5 py-3 rounded-full font-semibold shadow-sm transition"
        style={{ background: ROSE_GOLD, color: DEEP }}
      >
        Add to cart
      </button>

      <button
        onClick={() => toggleWishlist(product.id)}
        aria-pressed={inWishlist}
        title={inWishlist ? 'Remove' : 'Add'}
        className="ml-2 p-2 rounded-full border"
        style={{
          borderColor: 'rgba(0,0,0,0.06)',
          background: inWishlist ? 'rgba(183,110,121,0.06)' : '#fff',
        }}
      >
        {inWishlist ? (
          <Heart style={{ color: ROSE_GOLD }} />
        ) : (
          <HeartOff style={{ color: DEEP }} />
        )}
      </button>

      <button
        onClick={handleCopyLink}
        className="ml-1 p-2 rounded-full border"
        title="Share"
        style={{ borderColor: 'rgba(0,0,0,0.06)', background: '#fff' }}
      >
        <Share2 />
      </button>
    </div>
  );
}

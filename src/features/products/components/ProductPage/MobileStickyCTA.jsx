// src/features/products/components/ProductPage/MobileStickyCTA.jsx

import { ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/features/cart/hooks/cartStore';
import { useToast } from '@/features/ui/toast/context/useToast';

export default function MobileStickyCTA({ product, mainImage }) {
  const addToCart = useCartStore((s) => s.addToCart);
  const { showToast } = useToast();

  if (!product) return null;

  const handleAdd = () => {
    addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      image: mainImage || product.images?.[0],
      qty: 1,
    });

    showToast('Added to cart');
  };

  return (
    <div
      className="
        fixed bottom-0 left-0 right-0 z-40
        bg-background border-t
        px-4 py-3
        md:hidden
      "
      style={{
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      <div className="flex items-center justify-between gap-4">
        {/* Price */}
        <div>
          <p className="text-sm text-muted-foreground">Price</p>
          <p className="text-lg font-semibold">₹{product.price}</p>
        </div>

        {/* CTA */}
        <button
          onClick={handleAdd}
          className="
            flex items-center justify-center gap-2
            px-6 py-3
            rounded-full
            bg-primary text-primary-foreground
            font-medium
            shadow-lg
            active:scale-95
            transition
          "
        >
          <ShoppingBag size={16} />
          Add to cart
        </button>
      </div>
    </div>
  );
}

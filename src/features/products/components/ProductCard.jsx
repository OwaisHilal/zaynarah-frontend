// src/features/products/components/ProductCard.jsx
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Check, ShoppingBag } from 'lucide-react';

import useCartActions from '@/features/cart/hooks/useCartActions';
import { useToast } from '@/features/ui/toast/context/useToast';
import { cn } from '@/lib/utils';

export default function ProductCard({ product }) {
  const { addItem } = useCartActions();
  const { showToast } = useToast();
  const [added, setAdded] = useState(false);

  const id = product._id || product.id;
  const image = product.image || product.images?.[0];

  const handleAdd = () => {
    addItem(
      {
        id,
        title: product.title,
        price: product.price,
        image,
      },
      1
    );

    setAdded(true);
    showToast('Added to cart');

    setTimeout(() => setAdded(false), 1400);
  };

  return (
    <article className="group bg-white rounded-2xl overflow-hidden border transition hover:shadow-xl">
      <Link to={`/product/${id}`}>
        <div className="h-64 overflow-hidden">
          <img
            src={image}
            alt={product.title}
            className="w-full h-full object-cover transition-transform group-hover:scale-105"
          />
        </div>
      </Link>

      <div className="p-4 space-y-3">
        <h3 className="font-medium text-lg">
          <Link to={`/product/${id}`}>{product.title}</Link>
        </h3>

        <p className="text-sm text-text-secondary line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center justify-between pt-2">
          <span className="font-semibold">₹{product.price}</span>

          <button
            onClick={handleAdd}
            disabled={added}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-full text-sm border transition-all',
              'active:scale-95',
              added
                ? 'bg-primary text-primary-foreground border-primary'
                : 'hover:bg-bg-secondary border-border'
            )}
          >
            {added ? (
              <>
                <Check size={14} /> In cart
              </>
            ) : (
              <>
                <ShoppingBag size={14} /> Add to cart
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
}

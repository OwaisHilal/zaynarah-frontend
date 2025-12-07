// src/features/products/components/ProductCard.jsx
import { Link } from 'react-router-dom';
import { useCartStore } from '../../cart/hooks/cartStore';
import { ShoppingCart } from 'lucide-react';

const ROSE_GOLD = '#B76E79';
const DEEP = '#0A0A0A';

export default function ProductCard({ product }) {
  const addToCart = useCartStore((s) => s.addToCart);

  const pid = product.id ?? product._id;
  const title = product.title ?? product.name ?? 'Untitled';
  const img = product.image ?? product.images?.[0] ?? '/HeroImg.jpg';

  return (
    <article className="rounded-2xl overflow-hidden bg-white border transition-transform hover:-translate-y-1 hover:shadow-xl">
      <Link to={`/product/${pid}`}>
        <div className="w-full h-56 sm:h-64 overflow-hidden bg-gray-50">
          <img src={img} alt={title} className="w-full h-full object-cover" />
        </div>
      </Link>

      <div className="p-4">
        <h3 className="text-lg font-semibold" style={{ color: DEEP }}>
          <Link to={`/product/${pid}`} className="hover:underline">
            {title}
          </Link>
        </h3>

        <p className="text-sm text-gray-500 mt-1 line-clamp-2">
          {product.description}
        </p>

        <div className="mt-4 flex items-center justify-between">
          <div>
            <div className="text-lg font-bold" style={{ color: ROSE_GOLD }}>
              ₹{product.price}
            </div>
            <div className="text-xs text-gray-400">Inclusive of taxes</div>
          </div>

          <button
            onClick={() =>
              addToCart({ id: pid, title, price: product.price, image: img })
            }
            className="flex items-center gap-2 px-3 py-2 rounded-full"
            style={{ background: ROSE_GOLD, color: DEEP }}
            aria-label={`Add ${title} to cart`}
          >
            <ShoppingCart size={16} />
            Add
          </button>
        </div>
      </div>
    </article>
  );
}

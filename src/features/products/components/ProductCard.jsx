// src/features/products/components/ProductCard.jsx
import { Link } from 'react-router-dom';
import { useCartStore } from '../../cart/hooks/cartStore';
import { ShoppingCart } from 'lucide-react';

const GOLD = '#D4AF37';
const DEEP_BLACK = '#0A0A0A';

export default function ProductCard({ product }) {
  const addToCart = useCartStore((s) => s.addToCart);

  function handleAdd() {
    addToCart({
      id: product.id ?? product._id,
      title: product.title ?? product.name,
      price: product.price,
    });
  }

  return (
    <article
      className="group overflow-hidden rounded-2xl transition-transform duration-300 hover:-translate-y-1"
      style={{ boxShadow: '0 10px 30px rgba(10,10,10,0.06)' }}
    >
      <div className="relative rounded-2xl overflow-hidden bg-white">
        <Link to={`/product/${product.id ?? product._id}`}>
          <img
            src={product.image}
            alt={product.title ?? product.name}
            className="w-full h-72 object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </Link>

        {/* badge / category */}
        {product.category && (
          <div
            className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-medium"
            style={{ background: 'rgba(10,10,10,0.8)', color: '#fff' }}
          >
            {product.category}
          </div>
        )}
      </div>

      <div className="p-5 bg-white">
        <h3 className="text-lg font-semibold text-gray-900">
          <Link
            to={`/product/${product.id ?? product._id}`}
            className="hover:underline"
          >
            {product.title ?? product.name}
          </Link>
        </h3>

        <p className="text-sm text-gray-600 mt-2 line-clamp-2">
          {product.description}
        </p>

        <div className="mt-4 flex items-center justify-between">
          <div>
            <div className="text-lg font-semibold" style={{ color: GOLD }}>
              ₹{product.price}
            </div>
            <div className="text-xs text-gray-500">Inclusive of taxes</div>
          </div>

          <button
            onClick={handleAdd}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium"
            style={{
              background: DEEP_BLACK,
              color: '#fff',
              boxShadow: '0 6px 20px rgba(10,10,10,0.12)',
            }}
          >
            <ShoppingCart size={16} />
            Add
          </button>
        </div>
      </div>
    </article>
  );
}

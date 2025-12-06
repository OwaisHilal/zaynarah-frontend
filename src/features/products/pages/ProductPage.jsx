import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchProductById } from '../../../features/products/services/productsApi';
import { useCartStore } from '../../cart/hooks/cartStore';

const GOLD = '#D4AF37';
const DEEP_BLACK = '#0A0A0A';

export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  const addToCart = useCartStore((s) => s.addToCart);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const p = await fetchProductById(id);
        setProduct(p);
      } catch (err) {
        console.error(err);
        setProduct(null);
      }
    };
    loadProduct();
  }, [id]);

  if (!product)
    return (
      <div className="text-center text-lg text-gray-400 mt-20">
        Product not found
      </div>
    );

  return (
    <main className="max-w-7xl mx-auto px-6 py-20">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
        {/* ----------- PRODUCT IMAGE ----------- */}
        <div className="flex items-center justify-center">
          <div
            className="rounded-3xl overflow-hidden p-2"
            style={{
              background: `linear-gradient(145deg, rgba(255,255,255,0.05), rgba(20,20,20,0.6))`,
              boxShadow: `0 25px 60px rgba(0,0,0,0.35)`,
            }}
          >
            <img
              src={
                product.images?.[0] ||
                'https://via.placeholder.com/500?text=No+Image'
              }
              alt={product.title}
              className="rounded-2xl shadow-xl w-full max-w-md object-cover"
            />
          </div>
        </div>

        {/* ----------- PRODUCT DETAILS ----------- */}
        <div className="flex flex-col justify-center text-gray-100">
          {/* Title */}
          <h1
            className="text-5xl font-semibold tracking-wide"
            style={{ color: GOLD }}
          >
            {product.title}
          </h1>

          {/* Description */}
          <p className="mt-6 text-lg leading-relaxed text-gray-300">
            {product.description}
          </p>

          {/* Price */}
          <p className="mt-8 text-4xl font-bold" style={{ color: GOLD }}>
            ₹{product.price}
          </p>

          {/* Add to Cart Button */}
          <button
            onClick={() =>
              addToCart({
                id: product.id,
                title: product.title,
                price: product.price,
                image: product.images?.[0] || null,
              })
            }
            className="mt-10 px-8 py-4 rounded-2xl text-lg font-medium transition-all active:scale-95"
            style={{
              background: DEEP_BLACK,
              color: '#fff',
              boxShadow: '0 12px 30px rgba(10,10,10,0.45)',
              border: `1px solid ${GOLD}`,
            }}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </main>
  );
}

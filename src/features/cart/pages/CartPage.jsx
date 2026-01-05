// src/features/cart/pages/CartPage.jsx
import { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../hooks/cartStore';

const ROSE_GOLD = '#B76E79';
const LIGHT_TEXT = '#3D1F23';
const LIGHT_BG = '#FFF5F5';

export default function CartPage() {
  const cart = useCartStore((s) => s.cart);
  const hydrateCart = useCartStore((s) => s.hydrateCart);
  const removeFromCart = useCartStore((s) => s.removeFromCart);
  const updateQty = useCartStore((s) => s.updateQty);
  const clearCart = useCartStore((s) => s.clearCart);
  const loading = useCartStore((s) => s.loading);

  const navigate = useNavigate();
  const [updatingIds, setUpdatingIds] = useState([]);

  useEffect(() => {
    hydrateCart();
  }, [hydrateCart]);

  const safeCart = Array.isArray(cart) ? cart : [];

  const total = safeCart.reduce(
    (sum, item) => sum + (Number(item.price) || 0) * (Number(item.qty) || 1),
    0
  );

  const handleUpdateQty = useCallback(
    async (productId, qty) => {
      if (qty < 1) return;
      setUpdatingIds((prev) => [...prev, productId]);
      try {
        await updateQty(productId, qty);
      } finally {
        setUpdatingIds((prev) => prev.filter((id) => id !== productId));
      }
    },
    [updateQty]
  );

  const handleRemove = useCallback(
    async (productId) => {
      setUpdatingIds((prev) => [...prev, productId]);
      try {
        await removeFromCart(productId);
      } finally {
        setUpdatingIds((prev) => prev.filter((id) => id !== productId));
      }
    },
    [removeFromCart]
  );

  const isUpdating = (id) => updatingIds.includes(id);

  if (!safeCart.length) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 py-24 bg-white">
        <div className="max-w-2xl text-center">
          <h1
            className="text-5xl font-serif mb-4"
            style={{ color: LIGHT_TEXT }}
          >
            Your Cart is Empty
          </h1>
          <p className="text-lg text-gray-500 mb-8">
            Discover handcrafted Pashmina — timeless pieces awaiting your
            curation.
          </p>
          <Link
            to="/shop"
            className="inline-block px-8 py-3 rounded-full text-lg font-medium"
            style={{ background: ROSE_GOLD, color: LIGHT_TEXT }}
          >
            Browse Collection
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white px-6 py-16">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h1 className="text-5xl font-serif" style={{ color: LIGHT_TEXT }}>
            Your Cart
          </h1>
          <p className="mt-2 text-gray-500">
            Review your selections before checkout.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <section className="lg:col-span-8 space-y-6">
            {safeCart.map((item) => (
              <article
                key={item.productId}
                className="flex flex-col sm:flex-row gap-6 p-6 rounded-3xl"
                style={{
                  background: LIGHT_BG,
                  border: `1px solid rgba(183,110,121,0.3)`,
                }}
              >
                <div className="w-full sm:w-40">
                  <img
                    src={item.image || 'https://via.placeholder.com/320'}
                    alt={item.title}
                    className="w-full h-40 object-cover rounded-2xl"
                  />
                </div>

                <div className="flex-1">
                  <div className="flex justify-between">
                    <h3
                      className="text-2xl font-semibold"
                      style={{ color: LIGHT_TEXT }}
                    >
                      {item.title}
                    </h3>
                    <div
                      className="text-2xl font-bold"
                      style={{ color: ROSE_GOLD }}
                    >
                      ₹{Number(item.price).toLocaleString()}
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() =>
                          handleUpdateQty(item.productId, item.qty - 1)
                        }
                        disabled={isUpdating(item.productId)}
                        className="w-10 h-10 rounded-lg"
                      >
                        −
                      </button>

                      <div className="w-12 text-center">{item.qty}</div>

                      <button
                        onClick={() =>
                          handleUpdateQty(item.productId, item.qty + 1)
                        }
                        disabled={isUpdating(item.productId)}
                        className="w-10 h-10 rounded-lg"
                        style={{ background: ROSE_GOLD, color: '#fff' }}
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => handleRemove(item.productId)}
                      disabled={isUpdating(item.productId)}
                      className="text-sm underline"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </section>

          <aside className="lg:col-span-4">
            <div
              className="sticky top-24 p-8 rounded-3xl"
              style={{ background: LIGHT_BG, color: LIGHT_TEXT }}
            >
              <div className="flex justify-between mb-6">
                <h4 className="text-xl font-semibold">Order Summary</h4>
                <div
                  className="text-2xl font-bold"
                  style={{ color: ROSE_GOLD }}
                >
                  ₹{total.toLocaleString()}
                </div>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="w-full py-4 rounded-xl text-lg font-semibold"
                style={{ background: ROSE_GOLD, color: LIGHT_TEXT }}
                disabled={loading}
              >
                Proceed to Checkout
              </button>

              <button
                onClick={() => clearCart()}
                className="w-full mt-4 py-3 rounded-xl border"
              >
                Clear Cart
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

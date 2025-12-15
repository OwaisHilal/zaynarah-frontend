// src/features/cart/pages/CartPage.jsx
import { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../hooks/cartStore';

const ROSE_GOLD = '#B76E79';
const LIGHT_TEXT = '#3D1F23';
const LIGHT_BG = '#FFF5F5';

export default function CartPage() {
  // select only what we need (reduces re-renders)
  const cart = useCartStore((s) => s.cart);
  const fetchCart = useCartStore((s) => s.fetchCart);
  const addToCart = useCartStore((s) => s.addToCart);
  const removeFromCart = useCartStore((s) => s.removeFromCart);
  const updateQty = useCartStore((s) => s.updateQty);
  const clearCart = useCartStore((s) => s.clearCart);
  const loading = useCartStore((s) => s.loading);

  const navigate = useNavigate();
  const [updatingIds, setUpdatingIds] = useState([]); // track async updates

  // Fetch server cart once on mount
  useEffect(() => {
    fetchCart().catch((e) => {
      // safe fallback, don't crash render
      console.error('Failed to fetch cart:', e);
    });
  }, [fetchCart]);

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
        // fetchCart is called inside updateQty in your store, so no extra refresh needed
      } catch (err) {
        console.error('updateQty failed', err);
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
      } catch (err) {
        console.error('removeFromCart failed', err);
      } finally {
        setUpdatingIds((prev) => prev.filter((id) => id !== productId));
      }
    },
    [removeFromCart]
  );

  const isUpdating = (id) => updatingIds.includes(id);

  // Empty cart UI
  if (!safeCart.length) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6 py-24 bg-white">
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
      </main>
    );
  }

  // Main UI
  return (
    <main className="min-h-screen bg-white px-6 py-16">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-serif" style={{ color: LIGHT_TEXT }}>
            Your Cart
          </h1>
          <p className="mt-2 text-gray-500">
            Review your selections before checkout.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Items List */}
          <section className="lg:col-span-8 space-y-6">
            {safeCart.map((item) => (
              <article
                key={item.productId}
                className="flex flex-col sm:flex-row items-start sm:items-center gap-6 p-6 rounded-3xl transition-shadow duration-200 hover:shadow-lg"
                style={{
                  background: LIGHT_BG,
                  border: `1px solid rgba(183,110,121,0.3)`,
                  boxShadow: '0 12px 30px rgba(0,0,0,0.05)',
                }}
              >
                {/* Image */}
                <div className="w-full sm:w-40 shrink-0">
                  <img
                    src={item.image || 'https://via.placeholder.com/320'}
                    alt={item.title || 'Product'}
                    className="w-full h-40 object-cover rounded-2xl border border-gray-200"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 w-full">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                      <h3
                        className="text-2xl font-semibold"
                        style={{ color: LIGHT_TEXT }}
                      >
                        {item.title || 'Untitled Product'}
                      </h3>
                      {item.description ? (
                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                          {item.description}
                        </p>
                      ) : null}
                    </div>

                    <div className="mt-4 sm:mt-0 text-right">
                      <div
                        className="text-2xl font-bold"
                        style={{ color: ROSE_GOLD }}
                      >
                        ₹{Number(item.price ?? 0).toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        Inclusive of taxes
                      </div>
                    </div>
                  </div>

                  {/* Quantity & Actions */}
                  <div className="mt-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() =>
                          handleUpdateQty(item.productId, (item.qty || 1) - 1)
                        }
                        disabled={isUpdating(item.productId)}
                        className="w-10 h-10 rounded-lg flex items-center justify-center text-xl font-semibold transition-colors duration-150 hover:bg-gray-100 disabled:opacity-50"
                        style={{
                          border: '1px solid rgba(183,110,121,0.3)',
                          background: '#fff',
                          color: LIGHT_TEXT,
                        }}
                      >
                        −
                      </button>

                      <div className="w-14 text-center text-lg font-medium">
                        {item.qty ?? 1}
                      </div>

                      <button
                        onClick={() =>
                          handleUpdateQty(item.productId, (item.qty || 1) + 1)
                        }
                        disabled={isUpdating(item.productId)}
                        className="w-10 h-10 rounded-lg flex items-center justify-center text-xl font-semibold transition-colors duration-150 hover:bg-[#DCA3A7] disabled:opacity-50"
                        style={{
                          background: ROSE_GOLD,
                          color: '#fff',
                          boxShadow: '0 6px 18px rgba(0,0,0,0.12)',
                        }}
                      >
                        +
                      </button>
                    </div>

                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => handleRemove(item.productId)}
                        disabled={isUpdating(item.productId)}
                        className="text-sm text-gray-500 hover:text-gray-800 underline transition-colors duration-150"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </section>

          {/* Summary / Checkout */}
          <aside className="lg:col-span-4">
            <div
              className="sticky top-24 p-8 rounded-3xl transition-shadow duration-200 hover:shadow-xl"
              style={{
                background: LIGHT_BG,
                color: LIGHT_TEXT,
                boxShadow: '0 20px 50px rgba(183,110,121,0.25)',
              }}
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h4 className="text-xl font-semibold">Order Summary</h4>
                  <p className="text-sm text-gray-500 mt-1">
                    Taxes calculated at checkout
                  </p>
                </div>
                <div
                  className="text-2xl font-bold"
                  style={{ color: ROSE_GOLD }}
                >
                  ₹{total.toLocaleString()}
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-medium" style={{ color: ROSE_GOLD }}>
                    ₹{total.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Shipping</span>
                  <span className="font-medium text-gray-500">
                    Calculated at checkout
                  </span>
                </div>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="w-full py-4 rounded-xl text-lg font-semibold transition-colors duration-150 hover:bg-[#DCA3A7]"
                style={{ background: ROSE_GOLD, color: LIGHT_TEXT }}
                disabled={loading}
              >
                {loading ? 'Loading…' : 'Proceed to Checkout'}
              </button>

              <button
                onClick={() => clearCart()}
                className="w-full mt-4 py-3 rounded-xl text-sm font-medium border transition-colors duration-150 hover:border-[#DCA3A7] hover:text-[#DCA3A7]"
                style={{
                  borderColor: 'rgba(183,110,121,0.3)',
                  background: 'transparent',
                  color: LIGHT_TEXT,
                }}
              >
                Clear Cart
              </button>

              <div className="text-xs text-gray-500 mt-4">
                Secure checkout • Easy returns
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

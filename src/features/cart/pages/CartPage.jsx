// src/features/cart/pages/CartPage.jsx
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../hooks/cartStore';

const ROSE_GOLD = '#B76E79';
const LIGHT_TEXT = '#3D1F23'; // soft dark for text instead of black
const LIGHT_BG = '#FFF5F5';

export default function CartPage() {
  const { cart, removeFromCart, updateQty, clearCart } = useCartStore();
  const navigate = useNavigate();

  const safeCart = Array.isArray(cart) ? cart : [];
  const total = safeCart.reduce(
    (sum, item) => sum + (item.price || 0) * (item.qty || 1),
    0
  );

  // Empty state
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
            className="inline-block px-8 py-3 rounded-full text-lg font-medium transition-colors duration-200 hover:bg-[#DCA3A7]"
            style={{ background: ROSE_GOLD, color: LIGHT_TEXT }}
          >
            Browse Collection
          </Link>
        </div>
      </main>
    );
  }

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
            {safeCart.map((item, idx) => (
              <article
                key={(item._id || item.id) ?? idx}
                className="flex flex-col sm:flex-row items-start sm:items-center gap-6 p-6 rounded-3xl transition-shadow duration-200 hover:shadow-lg"
                style={{
                  background: LIGHT_BG,
                  border: `1px solid rgba(183,110,121,0.3)`,
                  boxShadow: '0 12px 30px rgba(0,0,0,0.05)',
                }}
              >
                {/* Image */}
                <div className="w-full sm:w-40 flex-shrink-0">
                  <img
                    src={item.image || 'https://via.placeholder.com/320'}
                    alt={item.title}
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
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                        {item.description || ''}
                      </p>
                    </div>

                    <div className="mt-4 sm:mt-0 text-right">
                      <div
                        className="text-2xl font-bold"
                        style={{ color: ROSE_GOLD }}
                      >
                        ₹{item.price ?? 0}
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
                          updateQty(
                            item.id ?? item._id,
                            Math.max(1, (item.qty || 1) - 1)
                          )
                        }
                        className="w-10 h-10 rounded-lg flex items-center justify-center text-xl font-semibold transition-colors duration-150 hover:bg-gray-100"
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
                          updateQty(item.id ?? item._id, (item.qty || 1) + 1)
                        }
                        className="w-10 h-10 rounded-lg flex items-center justify-center text-xl font-semibold transition-colors duration-150 hover:bg-[#DCA3A7]"
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
                        onClick={() => removeFromCart(item.id ?? item._id)}
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
                  ₹{total}
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-medium" style={{ color: ROSE_GOLD }}>
                    ₹{total}
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
              >
                Proceed to Checkout
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

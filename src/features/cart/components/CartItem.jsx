// src/features/cart/components/CartItem.jsx
import useCartActions from '@/features/cart/hooks/useCartActions';
import { ShoppingCart } from 'lucide-react';

const GOLD = '#D4AF37';
const DEEP_BLACK = '#0A0A0A';

export default function CartItem({ item }) {
  const { updateQty, removeItem } = useCartActions();

  const qty = item.qty ?? item.quantity ?? 1;
  const productId = item.productId ?? item.id ?? item._id;

  return (
    <div
      className="flex items-center gap-6 p-6 rounded-2xl"
      style={{
        background: 'linear-gradient(180deg, #ffffff, #fbfbfb)',
        border: '1px solid rgba(0,0,0,0.04)',
        boxShadow: '0 10px 30px rgba(10,10,10,0.04)',
      }}
    >
      <div className="w-32 flex-0">
        <img
          src={item.image || 'https://via.placeholder.com/320'}
          alt={item.title}
          className="w-full h-28 object-cover rounded-lg"
        />
      </div>

      <div className="flex-1">
        <h3 className="text-xl font-semibold" style={{ color: DEEP_BLACK }}>
          {item.title}
        </h3>
        <p className="text-sm text-gray-600 mt-1">{item.description || ''}</p>

        <div className="mt-3 flex items-center gap-4">
          <div className="text-lg font-semibold" style={{ color: GOLD }}>
            ₹{item.price}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => updateQty(productId, Math.max(1, qty - 1))}
              className="w-9 h-9 rounded-md flex items-center justify-center"
              style={{
                border: '1px solid rgba(0,0,0,0.06)',
                background: '#fff',
              }}
            >
              −
            </button>

            <div className="w-12 text-center font-medium">{qty}</div>

            <button
              onClick={() => updateQty(productId, qty + 1)}
              className="w-9 h-9 rounded-md flex items-center justify-center"
              style={{
                background: DEEP_BLACK,
                color: '#fff',
                boxShadow: '0 6px 18px rgba(0,0,0,0.12)',
              }}
            >
              +
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-end gap-3">
        <button
          onClick={() => removeItem(productId)}
          className="text-sm text-gray-500 hover:text-gray-800 underline"
        >
          Remove
        </button>

        <div className="text-xs text-gray-400">Item total</div>
        <div className="text-lg font-semibold" style={{ color: GOLD }}>
          ₹{(item.price || 0) * qty}
        </div>
      </div>
    </div>
  );
}

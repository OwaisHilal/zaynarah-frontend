// src/features/checkout/components/CheckoutForm.jsx
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import AddressSelector from './AddressSelector';
import { useCartStore } from '../../cart/hooks/cartStore';
import { formatCurrency } from '../utils/checkoutHelpers';

export default function CheckoutForm({ checkout }) {
  const cartItems = useCartStore((state) => state.cart) || [];
  const [error, setError] = useState('');

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + (item.qty || 0) * (item.price || 0),
    0
  );

  const handlePlaceOrder = async () => {
    setError('');

    if (!checkout.selectedAddress) {
      setError('Please select a delivery address!');
      return;
    }

    if (!cartItems.length) {
      setError('Your cart is empty!');
      return;
    }

    try {
      await checkout.placeOrder({ cart: cartItems, cartTotal: totalAmount });
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to place order.');
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <h2 className="text-xl font-semibold">Delivery Address</h2>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <AddressSelector
          selectedAddress={checkout.selectedAddress}
          setSelectedAddress={checkout.setSelectedAddress}
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div className="mt-4 flex justify-between items-center">
          <p className="text-lg font-bold">
            Total: {formatCurrency(totalAmount)}
          </p>
          <Button
            onClick={handlePlaceOrder}
            disabled={checkout.loading || !cartItems.length}
          >
            {checkout.loading ? 'Processing...' : 'Place Order'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

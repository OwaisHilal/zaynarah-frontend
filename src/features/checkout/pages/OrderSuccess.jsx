// src/features/checkout/pages/OrderSuccess.jsx
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '../utils/checkoutHelpers';
import { useCart } from '@/features/cart/context/useCart';

export default function OrderSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const { clearCartOnLogout } = useCart();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    if (location.state?.order) {
      localStorage.setItem('lastOrder', JSON.stringify(location.state.order));
      setOrder(location.state.order);
      clearCartOnLogout();
      return;
    }

    const saved = localStorage.getItem('lastOrder');
    if (saved) {
      setOrder(JSON.parse(saved));
      clearCartOnLogout();
    }
  }, [location.state, clearCartOnLogout]);

  if (!order) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <Card className="border border-yellow-500">
          <CardHeader>
            <h2 className="text-2xl font-bold text-yellow-600">
              No Order Found
            </h2>
          </CardHeader>
          <CardContent className="text-center flex flex-col gap-4">
            <Button onClick={() => navigate('/shop')}>Go to Shop</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <Card className="border border-green-500">
        <CardHeader>
          <h2 className="text-2xl font-bold text-green-600">
            Order Placed Successfully
          </h2>
        </CardHeader>

        <CardContent className="flex flex-col gap-4 text-center">
          <div className="bg-gray-100 p-4 text-left">
            <p>
              <strong>Order ID:</strong> {order._id}
            </p>
            <p>
              <strong>Total:</strong>{' '}
              {formatCurrency(order.cartTotal?.grand || 0)}
            </p>
            <p>
              <strong>Payment Method:</strong>{' '}
              {order.paymentMethod?.toUpperCase()}
            </p>
            <p>
              <strong>Status:</strong> {order.status}
            </p>
          </div>

          <div className="flex gap-3 justify-center">
            <Button onClick={() => navigate('/profile')}>View Orders</Button>
            <Button onClick={() => navigate('/shop')}>Continue Shopping</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

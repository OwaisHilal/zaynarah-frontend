// src/features/checkout/pages/OrderSuccess.jsx
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '../utils/checkoutHelpers';

export default function OrderSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    // 1. Prefer order passed via navigate state
    if (location.state?.order) {
      setOrder(location.state.order);
      return;
    }

    // 2. Fallback from localStorage (Stripe redirect)
    const savedOrder = localStorage.getItem('lastOrder');
    if (savedOrder) {
      setOrder(JSON.parse(savedOrder));
    }
  }, [location.state]);

  if (!order) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <Card className="shadow-lg border border-yellow-500 mt-6">
          <CardHeader>
            <h2 className="text-2xl font-bold text-yellow-600">
              No Order Found
            </h2>
          </CardHeader>
          <CardContent className="text-center flex flex-col gap-4">
            <p className="text-gray-700">
              We could not find your order details. Please check your orders
              page or contact support.
            </p>

            <Button
              className="bg-rose-600 hover:bg-rose-700 text-white"
              onClick={() => navigate('/shop')}
            >
              Go to Shop
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <Card className="shadow-lg border border-green-500 mt-6">
        <CardHeader>
          <h2 className="text-2xl font-bold text-green-600">
            🎉 Order Placed Successfully!
          </h2>
        </CardHeader>

        <CardContent className="flex flex-col gap-4 text-center">
          <p className="text-gray-700">
            Thank you for shopping with{' '}
            <span className="font-semibold">Zaynarah</span>. Your order has been
            confirmed.
          </p>

          <div className="bg-gray-100 rounded-md p-4 text-left border border-gray-300">
            <p>
              <span className="font-semibold">Order ID:</span> {order._id}
            </p>
            <p>
              <span className="font-semibold">Total:</span>{' '}
              {formatCurrency(order.total)}
            </p>
            <p>
              <span className="font-semibold">Payment Method:</span>{' '}
              {order.paymentMethod?.toUpperCase()}
            </p>
            <p>
              <span className="font-semibold">Status:</span>{' '}
              {order.status || 'Pending'}
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-4 justify-center mt-6">
            <Button
              onClick={() => navigate('/orders')}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              View Orders
            </Button>

            <Button
              onClick={() => navigate('/shop')}
              className="bg-rose-600 hover:bg-rose-700 text-white"
            >
              Continue Shopping
            </Button>

            <Button
              onClick={() => navigate('/')}
              className="bg-gray-600 hover:bg-gray-700 text-white"
            >
              Go to Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

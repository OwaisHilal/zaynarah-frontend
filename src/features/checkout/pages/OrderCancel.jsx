// src/features/checkout/pages/OrderCancel.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import { useCheckoutDomainStore, useCheckoutUIStore } from '@/stores/checkout';

export default function OrderCancel() {
  const navigate = useNavigate();

  const resetCheckoutDomain = useCheckoutDomainStore((s) => s.reset);
  const resetCheckoutUI = useCheckoutUIStore((s) => s.reset);

  useEffect(() => {
    resetCheckoutDomain();
    resetCheckoutUI();
  }, [resetCheckoutDomain, resetCheckoutUI]);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <Card className="shadow-lg border border-red-500 mt-6">
        <CardHeader>
          <h2 className="text-2xl font-bold text-red-600">
            Payment Cancelled / Order Failed
          </h2>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 text-center">
          <p className="text-gray-700">
            Unfortunately, your payment was not completed or the order was
            cancelled.
          </p>

          <div className="flex flex-col md:flex-row gap-4 justify-center mt-4">
            <Button
              onClick={() => navigate('/shop')}
              className="bg-rose-500 hover:bg-rose-600 text-white"
            >
              Continue Shopping
            </Button>
            <Button
              onClick={() => navigate('/checkout')}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              Retry Checkout
            </Button>
            <Button
              onClick={() => navigate('/')}
              className="bg-gray-500 hover:bg-gray-600 text-white"
            >
              Go to Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

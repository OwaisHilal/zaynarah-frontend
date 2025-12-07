// src/features/user/components/orders/OrderList.jsx
import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import OrderItem from './OrderItem';
import OrderDialog from './OrderDialog';
import { fetchUserOrders } from './fetchUserOrders';

export default function OrderList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchUserOrders().then((data) => {
      setOrders(data);
      setLoading(false);
    });
  }, []);

  if (loading)
    return <p className="text-center text-gray-500">Loading orders...</p>;

  if (!orders.length)
    return <p className="text-center text-gray-500">No orders yet.</p>;

  return (
    <>
      <Card className="max-w-4xl mx-auto bg-white/95 shadow-2xl rounded-3xl">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-gray-900">
            My Orders
          </CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col gap-4">
          {orders.map((order) => (
            <OrderItem
              key={order.id}
              order={order}
              onView={(o) => setSelectedOrder(o)}
            />
          ))}
        </CardContent>
      </Card>

      <OrderDialog
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
      />
    </>
  );
}

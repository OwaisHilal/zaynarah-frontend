// src/features/user/components/orders/OrderList.jsx
import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import OrderItem from './OrderItem';
import OrderDialog from './OrderDialog';
import { fetchUserOrders } from './fetchUserOrders';

export default function OrderList() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserOrders().then((data) => {
      setOrders(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <p className="text-center">Loading orders…</p>;
  if (!orders.length) return <p className="text-center">No orders yet.</p>;

  return (
    <>
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>My Orders</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {orders.map((o) => (
            <OrderItem key={o.id} order={o} onView={setSelectedOrder} />
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

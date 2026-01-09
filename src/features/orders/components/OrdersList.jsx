// frontend/src/features/user/components/orders/OrderList.jsx
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useOrdersDomainStore } from '@/stores/orders';

export default function OrderList() {
  const ids = useOrdersDomainStore((s) => s.ids);
  const getById = useOrdersDomainStore((s) => s.getById);

  if (!ids.length) return <p className="text-center">No orders yet.</p>;

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>My Orders</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {ids.map((id) => {
          const o = getById(id);
          return (
            <div
              key={id}
              className="flex justify-between border p-4 rounded-xl"
            >
              <div>
                <p className="font-semibold">Order #{id}</p>
                <p className="text-sm text-gray-500">
                  {new Date(o.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <p className="capitalize">{o.status}</p>
                <p>₹{o.cartTotal?.grand || o.total}</p>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

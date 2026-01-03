/* frontend/src/features/orders/pages/OrdersPage.jsx */
import OrdersHeader from '../components/OrdersHeader';
import OrdersList from '../components/OrdersList';

export default function OrdersPage() {
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="max-w-6xl mx-auto space-y-10">
        <OrdersHeader />
        <OrdersList />
      </div>
    </div>
  );
}

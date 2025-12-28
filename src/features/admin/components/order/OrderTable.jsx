import { Button } from '@/components/ui/button';
import { Pill } from '../Pill';

export function OrderTableRow({ order, onView }) {
  const paymentTone = { paid: 'success', failed: 'danger', pending: 'warning' }[
    order.paymentStatus
  ];
  const statusTone =
    { delivered: 'success', shipped: 'info' }[order.status] || 'neutral';

  return (
    <tr className="hover:bg-slate-50 transition-colors">
      <td className="px-6 py-4 font-medium text-slate-900">
        #{order._id.slice(-6)}
      </td>
      <td className="px-6 py-4 text-slate-700">
        {order.user?.email || 'Guest'}
      </td>
      <td className="px-6 py-4 text-slate-900">₹{order.totalAmount}</td>
      <td className="px-6 py-4">
        <Pill tone={paymentTone}>{order.paymentStatus}</Pill>
      </td>
      <td className="px-6 py-4">
        <Pill tone={statusTone}>{order.status}</Pill>
      </td>
      <td className="px-6 py-4 text-slate-500">
        {new Date(order.createdAt).toLocaleDateString()}
      </td>
      <td className="px-6 py-4 text-right">
        <Button variant="ghost" size="sm" onClick={() => onView(order._id)}>
          View
        </Button>
      </td>
    </tr>
  );
}

export function OrderSkeleton() {
  return Array.from({ length: 6 }).map((_, i) => (
    <tr key={i} className="animate-pulse">
      {Array.from({ length: 6 }).map((_, j) => (
        <td key={j} className="px-6 py-4">
          <div className="h-4 w-full rounded bg-slate-100" />
        </td>
      ))}
      <td className="px-6 py-4" />
    </tr>
  ));
}

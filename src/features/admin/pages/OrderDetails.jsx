//src/features/admin/pages/OrderDetails.jsx
import { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { OrderTimeline } from '../components/OrderTimeline';
import { OrderStatusCard } from '../components/OrderStatusCard';
import { OrderPaymentCard } from '../components/OrderPaymentCard';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';

export default function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const fetchOrder = async () => {
    try {
      const res = await axios.get(`${API_BASE}/orders/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setOrder(res.data);
    } catch (err) {
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const timelineEvents = useMemo(() => {
    if (!order) return [];
    let events = order.statusHistory?.length
      ? order.statusHistory.map((h) => ({
          label: `Status changed to "${h.to}"`,
          at: h.at,
          note: h.note,
        }))
      : [{ label: 'Order created', at: order.createdAt }];

    if (!order.statusHistory?.length) {
      if (order.paymentStatus === 'paid')
        events.push({ label: 'Payment successful', at: order.paidAt });
      if (order.paymentStatus === 'failed')
        events.push({ label: 'Payment failed', at: order.updatedAt });
    }

    return events.sort((a, b) => new Date(b.at) - new Date(a.at));
  }, [order]);

  const allowedTransitions = useMemo(() => {
    if (!order || order.status === 'cancelled') return [];
    const transitions = {
      pending: ['cancelled'],
      paid: ['shipped', 'cancelled'],
      shipped: ['delivered'],
      failed: ['cancelled'],
    };
    return transitions[order.status] || [];
  }, [order]);

  const handleStatusUpdate = async (status, note) => {
    setUpdating(true);
    await axios.put(
      `${API_BASE}/orders/${order._id}/status`,
      { status, note },
      { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
    );
    await fetchOrder();
    setUpdating(false);
  };

  // 🔒 I-F3: Refund eligibility (locked after delivery)
  const refundEligible =
    order?.paymentStatus === 'paid' &&
    order?.status !== 'cancelled' &&
    order?.status !== 'delivered';

  if (loading)
    return <div className="p-6 text-sm text-slate-500">Loading order…</div>;
  if (!order)
    return (
      <div className="p-6">
        <Button onClick={() => navigate(-1)}>Order not found. Go back</Button>
      </div>
    );

  const fulfillment = order.fulfillment || {};

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">
            Order #{order._id.slice(-6)}
          </h1>
          <p className="text-sm text-slate-500">
            Placed on {new Date(order.createdAt).toLocaleDateString()}
          </p>
        </div>
        <Button variant="outline" onClick={() => navigate(-1)}>
          Back
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <OrderTimeline events={timelineEvents} />
          <OrderStatusCard
            order={order}
            allowedTransitions={allowedTransitions}
            onUpdate={handleStatusUpdate}
            updating={updating}
          />
        </div>

        <div className="flex flex-col gap-6">
          <OrderPaymentCard order={order} refundEligible={refundEligible} />

          {/* 🚚 I-F4: Fulfillment */}
          <Card className="border border-slate-200 bg-white p-6">
            <div className="text-sm font-medium text-slate-900 mb-4">
              Fulfillment
            </div>

            <div className="flex flex-col gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Carrier</span>
                <span className="text-slate-900">
                  {fulfillment.carrier || '—'}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-500">Tracking ID</span>
                <span className="text-slate-900 truncate max-w-[160px]">
                  {fulfillment.trackingId || '—'}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-500">Shipped at</span>
                <span className="text-slate-900">
                  {fulfillment.shippedAt
                    ? new Date(fulfillment.shippedAt).toLocaleString()
                    : '—'}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-500">Delivered at</span>
                <span className="text-slate-900">
                  {fulfillment.deliveredAt
                    ? new Date(fulfillment.deliveredAt).toLocaleString()
                    : '—'}
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

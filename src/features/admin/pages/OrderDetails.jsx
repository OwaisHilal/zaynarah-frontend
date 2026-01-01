// src/features/admin/pages/OrderDetails.jsx

import { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { OrderTimeline } from '../components/order/OrderTimeline';
import { OrderStatusCard } from '../components/order/OrderStatusCard';
import { OrderPaymentCard } from '../components/order/OrderPaymentCard';
import { OrderRefundCard } from '../components/order/OrderRefundCard';
import {
  useOrderDetailsQuery,
  useOrderStatusMutation,
} from '../hooks/useOrderDetailsQuery';

export default function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const orderQueryConfig = useOrderDetailsQuery(id);
  const { data: order, isLoading, isError } = useQuery(orderQueryConfig);

  const statusMutationConfig = useOrderStatusMutation();
  const { mutateAsync: updateStatus, isLoading: updating } =
    useMutation(statusMutationConfig);

  const timelineEvents = useMemo(() => {
    if (!order) return [];

    const events = [];

    if (order.statusHistory?.length) {
      order.statusHistory.forEach((h) => {
        events.push({
          label: `Status changed to "${h.to}"`,
          at: h.at,
          note: h.note,
        });
      });
    } else {
      events.push({
        label: 'Order created',
        at: order.createdAt,
      });
    }

    if (order.paymentStatus === 'paid' && order.paidAt) {
      events.push({
        label: 'Payment successful',
        at: order.paidAt,
      });
    }

    if (order.paymentStatus === 'failed') {
      events.push({
        label: 'Payment failed',
        at: order.updatedAt,
      });
    }

    return events.sort((a, b) => new Date(b.at) - new Date(a.at));
  }, [order]);

  const allowedTransitions = useMemo(() => {
    if (!order || order.status === 'cancelled') return [];

    const map = {
      pending: ['cancelled'],
      paid: ['shipped', 'cancelled'],
      shipped: ['delivered'],
      failed: ['cancelled'],
    };

    return map[order.status] || [];
  }, [order]);

  const handleStatusUpdate = async (status, note) => {
    await updateStatus({
      orderId: order._id,
      status,
      note,
    });
  };

  const refundEligible =
    order?.paymentStatus === 'paid' &&
    order?.status !== 'cancelled' &&
    order?.status !== 'delivered';

  if (isLoading) {
    return <div className="p-6 text-sm text-slate-500">Loading order…</div>;
  }

  if (isError || !order) {
    return (
      <div className="p-6">
        <Button variant="outline" onClick={() => navigate(-1)}>
          Order not found. Go back
        </Button>
      </div>
    );
  }

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

          <OrderRefundCard order={order} onRefunded={() => null} />

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

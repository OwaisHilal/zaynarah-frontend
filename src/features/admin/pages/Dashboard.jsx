import { useEffect, useState } from 'react';
import axios from 'axios';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import OrdersTrendChart from '../components/dashboard/OrdersTrendChart';
import PaymentsBreakdownCharts from '../components/dashboard/PaymentsBreakdownCharts';
import { exportToCSV } from '../utils/exportCsv';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';

function Metric({ label, value }) {
  return (
    <Card className="border border-neutral-200 bg-white p-5">
      <div className="text-xs font-medium text-neutral-500">{label}</div>
      <div className="mt-2 text-2xl font-semibold text-neutral-900">
        {value}
      </div>
    </Card>
  );
}

function LowStockCard({ products }) {
  return (
    <Card className="border border-neutral-200 bg-white p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm font-medium text-neutral-800">
          Low stock alerts
        </div>
        <Badge variant="destructive">{products.length}</Badge>
      </div>

      {products.length === 0 ? (
        <p className="text-sm text-neutral-500">
          All products have healthy stock
        </p>
      ) : (
        <ul className="space-y-3">
          {products.map((p) => (
            <li
              key={p._id || p.id}
              className="flex items-center justify-between"
            >
              <div className="flex flex-col">
                <span className="text-sm font-medium text-neutral-900">
                  {p.title}
                </span>
                {p.category && (
                  <span className="text-xs text-neutral-500">{p.category}</span>
                )}
              </div>
              <Badge
                variant="outline"
                className="text-rose-600 border-rose-200"
              >
                {p.stock} left
              </Badge>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [ordersTrend, setOrdersTrend] = useState([]);
  const [paymentsBreakdown, setPaymentsBreakdown] = useState([]);
  const [lowStock, setLowStock] = useState([]);

  useEffect(() => {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    };

    axios
      .get(`${API_BASE}/admin/analytics/summary`, { headers })
      .then((res) => setSummary(res.data));

    axios
      .get(`${API_BASE}/admin/analytics/orders-trend`, { headers })
      .then((res) => setOrdersTrend(res.data));

    axios
      .get(`${API_BASE}/admin/analytics/payments-breakdown`, { headers })
      .then((res) => setPaymentsBreakdown(res.data));

    axios
      .get(`${API_BASE}/admin/analytics/low-stock`, { headers })
      .then((res) => setLowStock(res.data));
  }, []);

  const exportOrders = () => exportToCSV('orders-trend.csv', ordersTrend);

  const exportPayments = () =>
    exportToCSV(
      'payments-breakdown.csv',
      paymentsBreakdown.map((p) => ({
        provider: p._id?.provider,
        status: p._id?.status,
        count: p.count,
      }))
    );

  const exportLowStock = () =>
    exportToCSV(
      'low-stock-products.csv',
      lowStock.map((p) => ({
        title: p.title,
        category: p.category,
        stock: p.stock,
      }))
    );

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-xl font-semibold text-neutral-900">Dashboard</h1>
        <p className="text-sm text-neutral-500">Store performance overview</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Metric label="Revenue" value={summary?.revenue ?? '—'} />
        <Metric label="Orders" value={summary?.totalOrders ?? '—'} />
        <Metric label="Customers" value={summary?.totalUsers ?? '—'} />
        <Metric label="Products" value={summary?.totalProducts ?? '—'} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="border border-neutral-200 bg-white p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm font-medium text-neutral-800">
              Orders (last 30 days)
            </div>
            <Button size="sm" variant="outline" onClick={exportOrders}>
              Export CSV
            </Button>
          </div>
          <OrdersTrendChart data={ordersTrend} />
        </Card>

        <div className="flex flex-col gap-2">
          <div className="flex justify-end">
            <Button size="sm" variant="outline" onClick={exportLowStock}>
              Export CSV
            </Button>
          </div>
          <LowStockCard products={lowStock} />
        </div>
      </div>

      <Card className="border border-neutral-200 bg-white p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm font-medium text-neutral-800">
            Payments breakdown
          </div>
          <Button size="sm" variant="outline" onClick={exportPayments}>
            Export CSV
          </Button>
        </div>
        <PaymentsBreakdownCharts raw={paymentsBreakdown} />
      </Card>
    </div>
  );
}

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import OrdersTrendChart from '../components/dashboard/OrdersTrendChart';
import PaymentsBreakdownCharts from '../components/dashboard/PaymentsBreakdownCharts';
import { LowStockProductsCard } from '../components/dashboard/LowStockProductsCard';
import { StatCard } from '../components/dashboard/StatCard';
import { exportToCSV } from '../utils/exportCsv';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';

export default function Dashboard() {
  const [data, setData] = useState({
    summary: null,
    ordersTrend: [],
    paymentsBreakdown: [],
    lowStock: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      const headers = {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      };

      try {
        const [summary, trend, payments, stock] = await Promise.all([
          axios.get(`${API_BASE}/admin/analytics/summary`, { headers }),
          axios.get(`${API_BASE}/admin/analytics/orders-trend`, { headers }),
          axios.get(`${API_BASE}/admin/analytics/payments-breakdown`, {
            headers,
          }),
          axios.get(`${API_BASE}/admin/analytics/low-stock`, { headers }),
        ]);

        setData({
          summary: summary.data,
          ordersTrend: trend.data,
          paymentsBreakdown: payments.data,
          lowStock: stock.data,
        });
      } catch (error) {
        console.error('Dashboard fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Export Handlers
  const handleExportOrders = () =>
    exportToCSV('orders-trend.csv', data.ordersTrend);

  const handleExportLowStock = () =>
    exportToCSV(
      'low-stock.csv',
      data.lowStock.map((p) => ({
        title: p.title,
        category: p.category,
        stock: p.stock,
      }))
    );

  const handleExportPayments = () =>
    exportToCSV(
      'payments.csv',
      data.paymentsBreakdown.map((p) => ({
        provider: p._id?.provider,
        status: p._id?.status,
        count: p.count,
      }))
    );

  if (loading)
    return (
      <div className="p-10 text-neutral-500 animate-pulse">
        Loading analytics...
      </div>
    );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">
          Dashboard
        </h1>
        <p className="text-sm text-neutral-500">
          Real-time store performance and health
        </p>
      </div>

      {/* Top Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Revenue"
          value={`₹${data.summary?.revenue || 0}`}
          description="Last 30 days"
        />
        <StatCard label="Total Orders" value={data.summary?.totalOrders || 0} />
        <StatCard
          label="Active Customers"
          value={data.summary?.totalUsers || 0}
        />
        <StatCard
          label="Total Products"
          value={data.summary?.totalProducts || 0}
        />
      </div>

      {/* Middle Section: Trends and Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border border-neutral-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-bold text-neutral-800 text-center">
              Order Trends
            </h3>
            <Button
              size="sm"
              variant="outline"
              onClick={handleExportOrders}
              className="h-8"
            >
              Export CSV
            </Button>
          </div>
          <div className="h-[300px]">
            <OrdersTrendChart data={data.ordersTrend} />
          </div>
        </Card>

        <div className="lg:col-span-1">
          <LowStockProductsCard
            products={data.lowStock}
            onExport={handleExportLowStock}
          />
        </div>
      </div>

      {/* Bottom Section: Payments */}
      <Card className="border border-neutral-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-sm font-bold text-neutral-800">
            Payments Breakdown
          </h3>
          <Button
            size="sm"
            variant="outline"
            onClick={handleExportPayments}
            className="h-8"
          >
            Export CSV
          </Button>
        </div>
        <div className="min-h-[300px]">
          <PaymentsBreakdownCharts raw={data.paymentsBreakdown} />
        </div>
      </Card>
    </div>
  );
}

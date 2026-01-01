// src/features/admin/pages/Dashboard.jsx

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import OrdersTrendChart from '../components/dashboard/OrdersTrendChart';
import PaymentsBreakdownCharts from '../components/dashboard/PaymentsBreakdownCharts';
import { LowStockProductsCard } from '../components/dashboard/LowStockProductsCard';
import { StatCard } from '../components/dashboard/StatCard';
import { exportToCSV } from '../utils/exportCsv';
import { useAdminDashboardQuery } from '../hooks/useAdminDashboardQuery';

export default function Dashboard() {
  const queryConfig = useAdminDashboardQuery();

  const { data, isLoading } = useQuery(queryConfig);

  if (isLoading) {
    return (
      <div className="p-10 text-neutral-500 animate-pulse">
        Loading analytics...
      </div>
    );
  }

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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border border-neutral-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-bold text-neutral-800">Order Trends</h3>
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

        <LowStockProductsCard
          products={data.lowStock}
          onExport={handleExportLowStock}
        />
      </div>

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

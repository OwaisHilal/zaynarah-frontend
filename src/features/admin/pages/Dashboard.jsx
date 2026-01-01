import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Zap, ShoppingBag, Users, Package } from 'lucide-react';

// UI and Components
import { DashboardHeader } from '../components/dashboard/DashboardHeader';
import { SystemHealthCard } from '../components/dashboard/SystemHealthCard';
import { StrategyAssistant } from '../components/dashboard/StrategyAssistant'; // Extract this too!
import { StatCard } from '../components/dashboard/StatCard';
import OrdersTrendChart from '../components/dashboard/OrdersTrendChart';
import PaymentsBreakdownCharts from '../components/dashboard/PaymentsBreakdownCharts';
import { LowStockProductsCard } from '../components/dashboard/LowStockProductsCard';
import DashboardSkeleton from '../components/dashboard/DashboardSkeleton';

// Utils / Hooks
import { exportToCSV } from '../utils/exportCsv';
import { useAdminDashboardQuery } from '../hooks/useAdminDashboardQuery';

export default function Dashboard() {
  const queryConfig = useAdminDashboardQuery();
  const { data, isLoading, isRefetching, refetch } = useQuery(queryConfig);
  const [activeRange, setActiveRange] = useState('30d');

  if (isLoading) return <DashboardSkeleton />;

  // logic for exports
  const handleExport = (type) => {
    if (type === 'orders') exportToCSV('orders-trend.csv', data.ordersTrend);
    if (type === 'lowStock') {
      const mapped = data.lowStock.map((p) => ({
        title: p.title,
        category: p.category,
        stock: p.stock,
      }));
      exportToCSV('low-stock.csv', mapped);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <DashboardHeader
        onRangeChange={setActiveRange}
        onRefresh={() => refetch()}
        isRefetching={isRefetching}
      />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Gross Revenue"
          value={`₹${(data.summary?.revenue || 0).toLocaleString()}`}
          trend="+14.2%"
          trendType="up"
          icon={<Zap className="text-indigo-600" size={20} />}
          primary
        />
        <StatCard
          label="Total Orders"
          value={data.summary?.totalOrders || 0}
          trend="+8.1%"
          trendType="up"
          icon={<ShoppingBag className="text-blue-600" size={20} />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Revenue Chart Section - You could even extract this to 'RevenueDynamicsCard.jsx' */}
          <OrdersTrendChart
            data={data.ordersTrend}
            onExport={() => handleExport('orders')}
          />
          <PaymentsBreakdownCharts raw={data.paymentsBreakdown} />
        </div>

        <div className="space-y-8">
          <LowStockProductsCard
            products={data.lowStock}
            onExport={() => handleExport('lowStock')}
          />
          <StrategyAssistant />
          <SystemHealthCard />
        </div>
      </div>
    </div>
  );
}

// frontend/src/features/admin/pages/Dashboard.jsx

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Zap, ShoppingBag, Users, Package, TrendingUp } from 'lucide-react';
import { Card } from '@/components/ui/card';

import { DashboardHeader } from '../components/dashboard/DashboardHeader';
import { SystemHealthCard } from '../components/dashboard/SystemHealthCard';
import { StatCard } from '../components/dashboard/StatCard';
import OrdersTrendChart from '../components/dashboard/OrdersTrendChart';
import PaymentsBreakdownCharts from '../components/dashboard/PaymentsBreakdownCharts';
import { LowStockProductsCard } from '../components/dashboard/LowStockProductsCard';
import DashboardSkeleton from '../components/dashboard/DashboardSkeleton';

// New Fintech Components
import { LiquiditySparkline } from '../components/dashboard/LiquiditySparkline';
import { SalesHeatmap } from '../components/dashboard/SalesHeatmap';
import { ConversionRing } from '../components/dashboard/ConversionRing';

import { exportToCSV } from '../utils/exportCsv';
import { useAdminDashboardQuery } from '../hooks/useAdminDashboardQuery';

export default function Dashboard() {
  const queryConfig = useAdminDashboardQuery();
  const { data, isLoading, isRefetching, refetch } = useQuery(queryConfig);
  const [activeRange, setActiveRange] = useState('30d');

  if (isLoading) return <DashboardSkeleton />;

  const handleExport = (type) => {
    if (type === 'orders')
      exportToCSV('revenue-analytics.csv', data.ordersTrend);
    if (type === 'lowStock') {
      const mapped = data.lowStock.map((p) => ({
        title: p.title,
        category: p.category,
        stock: p.stock,
      }));
      exportToCSV('inventory-risk.csv', mapped);
    }
  };

  return (
    <div className="flex flex-col gap-6 p-0 sm:p-4 animate-in fade-in duration-700 max-w-[1600px] mx-auto">
      <DashboardHeader
        onRangeChange={setActiveRange}
        onRefresh={() => refetch()}
        isRefetching={isRefetching}
      />

      {/* Primary KPI Section */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Gross Revenue"
          value={`₹${(data.summary?.revenue || 0).toLocaleString()}`}
          trend={`${data.summary?.revenueTrend || 0}%`}
          trendType={data.summary?.revenueTrend >= 0 ? 'up' : 'down'}
          icon={<Zap size={20} />}
          primary
        />
        <StatCard
          label="Active Customers"
          value={data.summary?.totalUsers || 0}
          trend="+12%"
          trendType="up"
          icon={<Users size={20} />}
        />
        <StatCard
          label="Order Volume"
          value={data.summary?.totalOrders || 0}
          trend="+5.4%"
          trendType="up"
          icon={<ShoppingBag size={20} />}
        />
        <StatCard
          label="Inventory Alerts"
          value={data.summary?.lowStockCount || 0}
          trend="Risk Level"
          trendType={data.summary?.lowStockCount > 0 ? 'down' : 'up'}
          icon={<Package size={20} />}
        />
      </div>

      {/* Fintech Velocity Sparklines (Immediate Momentum) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <LiquiditySparkline
          label="Avg Order Value"
          value={`₹${Math.round(
            data.summary?.revenue / data.summary?.totalOrders || 0
          )}`}
          color="#6366f1"
          data={data.ordersTrend?.map((d) => ({
            value: d.revenue / d.orders || 0,
          }))}
        />
        <LiquiditySparkline
          label="Customer Growth"
          value="+242"
          color="#10b981"
          data={[
            { value: 10 },
            { value: 40 },
            { value: 35 },
            { value: 50 },
            { value: 45 },
            { value: 70 },
            { value: 90 },
          ]}
        />
        <LiquiditySparkline
          label="Refund Rate"
          value="0.8%"
          color="#f43f5e"
          data={[
            { value: 5 },
            { value: 2 },
            { value: 8 },
            { value: 3 },
            { value: 1 },
            { value: 4 },
            { value: 2 },
          ]}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Analytics Content (Left Column) */}
        <div className="lg:col-span-8 space-y-6">
          <Card className="p-1 border-none ring-1 ring-slate-200 rounded-[32px] bg-white shadow-sm overflow-hidden">
            <OrdersTrendChart
              data={data.ordersTrend}
              onExport={() => handleExport('orders')}
            />
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <PaymentsBreakdownCharts raw={data.paymentsBreakdown} />
            <SalesHeatmap />
          </div>
        </div>

        {/* Sidebar Context (Right Column) */}
        <div className="lg:col-span-4 space-y-6">
          <ConversionRing completed={88} abandoned={12} />

          <LowStockProductsCard
            products={data.lowStock}
            onExport={() => handleExport('lowStock')}
          />

          {/* AI Strategy Insights Terminal */}
          <Card className="p-6 border-none ring-1 ring-slate-900 bg-slate-900 text-white rounded-[24px] shadow-xl">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-2 w-2 rounded-full bg-indigo-400 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-300">
                Strategy Terminal
              </span>
            </div>
            <p className="text-sm font-medium text-slate-300 leading-relaxed">
              Revenue velocity is up{' '}
              <span className="text-white font-black">
                {data.summary?.revenueTrend}%
              </span>
              . The <span className="text-indigo-400 font-bold">Heatmap</span>{' '}
              shows peak activity at 14:00. Ensure Razorpay liquidity is
              sufficient for upcoming volume.
            </p>
            <button className="mt-6 w-full py-3 bg-white/10 hover:bg-white/20 border border-white/10 text-white rounded-xl font-black text-[10px] uppercase tracking-widest transition-all">
              Execute Optimization
            </button>
          </Card>

          <SystemHealthCard />
        </div>
      </div>
    </div>
  );
}

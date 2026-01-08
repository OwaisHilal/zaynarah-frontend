// src/features/admin/pages/Payments.jsx

import { useState } from 'react';
import { useAdminPaymentsQuery } from '../hooks/useAdminPaymentsQuery';
import { PaymentsTable } from '../components/payments/PaymentsTable';
import { PaymentsFilters } from '../components/payments/PaymentsFilters';
import { Pagination } from '../components/Pagination';
import { Card } from '@/components/ui/card';
import { CreditCard, Search, TrendingUp, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Payments() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('all');
  const [provider, setProvider] = useState('all');
  const [search, setSearch] = useState('');

  const { data, isLoading, isPlaceholderData } = useAdminPaymentsQuery({
    page,
    status,
    provider,
    search,
  });

  const payments = data?.data || [];
  const meta = data?.meta || {};
  const totalPages = meta.totalPages || 1;
  const totalRevenue = meta.revenueSummary || 0;

  return (
    <div className="flex flex-col gap-8 p-0 sm:p-4 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">
            Payment Operations
          </h1>
          <p className="text-sm font-medium text-slate-500 italic">
            Monitoring financial transactions and gateway performance
          </p>
        </div>

        <Card className="flex items-center gap-4 px-6 py-4 bg-slate-950 border-none rounded-[24px] shadow-2xl shadow-indigo-200/50">
          <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center text-indigo-400">
            <TrendingUp size={20} />
          </div>
          <div>
            <p className="text-[10px] font-black text-indigo-300 uppercase tracking-widest">
              Gross Revenue
            </p>
            <p className="text-xl font-black text-white leading-none">
              ₹{totalRevenue.toLocaleString()}
            </p>
          </div>
        </Card>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <aside className="lg:col-span-3 space-y-6">
          <div className="relative group">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors"
              size={18}
            />
            <input
              type="text"
              placeholder="Search ID or Email..."
              className="w-full pl-11 pr-4 py-3 bg-white border-none ring-1 ring-slate-200 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-indigo-500 transition-all outline-none shadow-sm"
              value={search}
              onChange={(e) => {
                setPage(1);
                setSearch(e.target.value);
              }}
            />
          </div>

          <Card className="p-6 border-none ring-1 ring-slate-200 rounded-[28px] bg-white shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <Filter size={16} className="text-slate-400" />
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">
                Smart Filters
              </h3>
            </div>
            <PaymentsFilters
              status={status}
              provider={provider}
              onStatusChange={(v) => {
                setPage(1);
                setStatus(v);
              }}
              onProviderChange={(v) => {
                setPage(1);
                setProvider(v);
              }}
            />
          </Card>
        </aside>

        <div className="lg:col-span-9 space-y-6">
          <Card
            className={cn(
              'border-none ring-1 ring-slate-200 rounded-[32px] bg-white shadow-sm overflow-hidden transition-opacity duration-300',
              isPlaceholderData ? 'opacity-50' : 'opacity-100'
            )}
          >
            {isLoading && !isPlaceholderData ? (
              <div className="flex flex-col items-center justify-center py-24 gap-4">
                <div className="h-12 w-12 border-4 border-slate-100 border-t-indigo-600 rounded-full animate-spin" />
                <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">
                  Syncing Ledger
                </p>
              </div>
            ) : (
              <>
                <PaymentsTable payments={payments} />
                <div className="p-6 border-t border-slate-50 flex items-center justify-center bg-slate-50/30">
                  <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={setPage}
                  />
                </div>
              </>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

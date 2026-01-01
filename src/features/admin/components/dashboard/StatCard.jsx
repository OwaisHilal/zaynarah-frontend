// frontend/src/features/admin/components/dashboard/StatCard.jsx
import React from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export function StatCard({
  label,
  value,
  description,
  trend,
  trendType = 'neutral',
  icon,
  primary = false,
}) {
  const renderTrend = () => {
    if (!trend) return null;

    const config = {
      up: { color: 'text-emerald-600 bg-emerald-50', Icon: TrendingUp },
      down: { color: 'text-rose-600 bg-rose-50', Icon: TrendingDown },
      neutral: { color: 'text-slate-400 bg-slate-50', Icon: Minus },
    };

    const { color, Icon } = config[trendType] || config.neutral;

    return (
      <div
        className={cn(
          'flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold transition-all',
          color
        )}
      >
        <Icon size={12} strokeWidth={3} />
        {trend}
      </div>
    );
  };

  return (
    <Card
      className={cn(
        'relative overflow-hidden border-none transition-all duration-300 group hover:shadow-xl hover:shadow-slate-200/50 rounded-3xl p-6',
        primary
          ? 'bg-slate-900 text-white'
          : 'bg-white ring-1 ring-slate-200 text-slate-900'
      )}
    >
      {' '}
      <div className="flex justify-between items-start mb-4">
        {' '}
        <div
          className={cn(
            'p-2.5 rounded-2xl transition-transform group-hover:scale-110 duration-300',
            primary ? 'bg-white/10 text-white' : 'bg-slate-50 text-slate-600'
          )}
        >
          {' '}
          {icon}{' '}
        </div>{' '}
        {renderTrend()}{' '}
      </div>
      <div className="space-y-1">
        <p
          className={cn(
            'text-[11px] font-bold uppercase tracking-[0.1em]',
            primary ? 'text-slate-400' : 'text-slate-500'
          )}
        >
          {label}
        </p>
        <h3 className="text-3xl font-black tracking-tight transition-all">
          {value}
        </h3>
        {description && (
          <p
            className={cn(
              'text-xs font-medium pt-1',
              primary ? 'text-slate-500' : 'text-slate-400'
            )}
          >
            {description}
          </p>
        )}
      </div>
      {primary && (
        <div className="absolute -right-4 -bottom-4 opacity-10 pointer-events-none transition-transform group-hover:scale-125 duration-700">
          {icon && React.cloneElement(icon, { size: 100 })}
        </div>
      )}
    </Card>
  );
}

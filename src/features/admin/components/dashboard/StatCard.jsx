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
      up: {
        color: primary
          ? 'text-emerald-400 bg-emerald-400/10'
          : 'text-emerald-600 bg-emerald-50',
        Icon: TrendingUp,
      },
      down: {
        color: primary
          ? 'text-rose-400 bg-rose-400/10'
          : 'text-rose-600 bg-rose-50',
        Icon: TrendingDown,
      },
      neutral: {
        color: primary
          ? 'text-slate-400 bg-slate-400/10'
          : 'text-slate-400 bg-slate-50',
        Icon: Minus,
      },
    };

    const { color, Icon } = config[trendType] || config.neutral;

    return (
      <div
        className={cn(
          'flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter transition-all',
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
        'relative overflow-hidden border-none transition-all duration-500 group hover:shadow-2xl hover:-translate-y-1 rounded-[32px] p-7',
        primary
          ? 'bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 text-white shadow-xl shadow-indigo-900/20'
          : 'bg-white ring-1 ring-slate-200 text-slate-900'
      )}
    >
      <div className="flex justify-between items-start mb-6">
        <div
          className={cn(
            'p-3 rounded-2xl transition-all group-hover:rotate-6 duration-300 shadow-sm',
            primary
              ? 'bg-indigo-500/20 text-indigo-400 ring-1 ring-indigo-400/30'
              : 'bg-slate-50 text-indigo-600'
          )}
        >
          {icon}
        </div>
        {renderTrend()}
      </div>

      <div className="relative z-10 space-y-1">
        <p
          className={cn(
            'text-[10px] font-black uppercase tracking-[0.2em]',
            primary ? 'text-indigo-300/70' : 'text-slate-400'
          )}
        >
          {label}
        </p>
        <h3 className="text-4xl font-black tracking-tight tabular-nums">
          {value}
        </h3>
        {description && (
          <p
            className={cn(
              'text-[11px] font-medium pt-2',
              primary ? 'text-slate-400' : 'text-slate-400'
            )}
          >
            {description}
          </p>
        )}
      </div>

      {/* Decorative Background Element */}
      {primary && (
        <div className="absolute -right-6 -bottom-6 opacity-[0.03] pointer-events-none transition-transform group-hover:scale-150 group-hover:-rotate-12 duration-1000">
          {icon && React.cloneElement(icon, { size: 160, strokeWidth: 1.5 })}
        </div>
      )}

      {/* Subtle Shine Effect */}
      {primary && (
        <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white/5 opacity-40 group-hover:animate-shine" />
      )}
    </Card>
  );
}

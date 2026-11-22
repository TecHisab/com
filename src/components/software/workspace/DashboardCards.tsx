import React from 'react';
import { LucideIcon } from 'lucide-react';

export interface DashboardMetricCard {
  id: string;
  label: string;
  value: string;
  subtext?: string;
  tone?: 'default' | 'primary' | 'positive' | 'warning' | 'danger';
  icon?: LucideIcon;
}

interface DashboardCardsProps {
  metrics: DashboardMetricCard[];
  columns?: 2 | 3 | 4;
}

export const DashboardCards: React.FC<DashboardCardsProps> = ({
  metrics,
  columns = 4,
}) => {
  const gridCols =
    columns === 2
      ? 'grid-cols-1 sm:grid-cols-2'
      : columns === 3
      ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
      : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4';

  const getValueColor = (tone?: DashboardMetricCard['tone']) => {
    switch (tone) {
      case 'primary':
        return 'text-[#0345A4] dark:text-sky-400';
      case 'positive':
        return 'text-emerald-700 dark:text-emerald-400';
      case 'warning':
        return 'text-amber-700 dark:text-amber-400';
      case 'danger':
        return 'text-rose-700 dark:text-rose-400';
      default:
        return 'text-[#0B1730] dark:text-white';
    }
  };

  return (
    <div className={`grid ${gridCols} gap-3.5`}>
      {metrics.map((metric) => {
        const Icon = metric.icon;
        return (
          <div
            key={metric.id}
            className="rounded-xl bg-white dark:bg-slate-900 border border-[#D7E2F3] dark:border-slate-800 p-4 flex flex-col justify-between gap-2 transition-colors hover:border-[#0345A4]/40"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#5F6D82] dark:text-slate-400 truncate">
                {metric.label}
              </span>
              {Icon && (
                <Icon className="w-4 h-4 text-[#0345A4] dark:text-sky-400 shrink-0" />
              )}
            </div>
            <div
              className={`text-lg sm:text-xl font-extrabold font-mono tabular-nums tracking-tight ${getValueColor(
                metric.tone
              )}`}
            >
              {metric.value}
            </div>
            {metric.subtext && (
              <span className="text-[11px] text-[#5F6D82] dark:text-slate-400 truncate">
                {metric.subtext}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
};

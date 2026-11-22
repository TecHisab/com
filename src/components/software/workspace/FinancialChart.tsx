import React, { useState } from 'react';
import { formatBDT } from '../../../utils/demoFormatters';
import { useLanguage } from '../../../context/LanguageContext';

export interface BarChartDatum {
  label: string;
  value: number;
  secondaryValue?: number;
  color?: string;
}

interface BarChartProps {
  title: string;
  subtitle?: string;
  data: BarChartDatum[];
  primaryLabel?: string;
  secondaryLabel?: string;
  valueFormatter?: (v: number) => string;
  height?: number;
}

export const FinancialBarChart: React.FC<BarChartProps> = ({
  title,
  subtitle,
  data,
  primaryLabel,
  secondaryLabel,
  valueFormatter = (v) => formatBDT(v),
  height = 200,
}) => {
  const { pick } = useLanguage();
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const effPrimaryLabel = primaryLabel || pick('Primary', 'প্রাথমিক');
  const effSecondaryLabel = secondaryLabel || pick('Secondary', 'দ্বিতীয়');
  const hasSecondary = data.some((d) => typeof d.secondaryValue === 'number');
  const maxVal = Math.max(
    1,
    ...data.flatMap((d) => [Math.abs(d.value), Math.abs(d.secondaryValue || 0)])
  );

  return (
    <div className="rounded-xl bg-white dark:bg-slate-900 border border-[#D7E2F3] dark:border-slate-800 p-4 space-y-3">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h4 className="text-sm font-bold text-[#0B1730] dark:text-white">{title}</h4>
          {subtitle && (
            <p className="text-[11px] text-[#5F6D82] dark:text-slate-400">{subtitle}</p>
          )}
        </div>
        <div className="flex items-center gap-3 text-[11px] font-medium text-[#5F6D82] dark:text-slate-400">
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-[#0345A4] dark:bg-sky-500 inline-block" />
            {effPrimaryLabel}
          </span>
          {hasSecondary && (
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-[#0A63D8]/45 dark:bg-sky-300/60 inline-block" />
              {effSecondaryLabel}
            </span>
          )}
        </div>
      </div>

      {data.length === 0 ? (
        <div className="h-40 flex items-center justify-center text-xs text-[#5F6D82]">
          {pick('No chart data available', 'চার্টের কোনো ডেটা উপলব্ধ নেই')}
        </div>
      ) : (
        <div className="relative pt-2">
          <div
            className="flex items-end justify-between gap-2 sm:gap-3 border-b border-[#D7E2F3] dark:border-slate-800 pb-1"
            style={{ height: `${height}px` }}
          >
            {data.map((item, idx) => {
              const primaryPct = Math.max(4, Math.round((Math.abs(item.value) / maxVal) * 86));
              const secondaryPct =
                typeof item.secondaryValue === 'number'
                  ? Math.max(4, Math.round((Math.abs(item.secondaryValue) / maxVal) * 86))
                  : 0;
              const isHovered = hoveredIdx === idx;

              return (
                <div
                  key={`${item.label}-${idx}`}
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                  className="flex-1 h-full flex flex-col justify-end items-center relative group cursor-pointer"
                >
                  {isHovered && (
                    <div className="absolute -top-2 z-10 px-2.5 py-1.5 rounded-lg bg-[#0B1730] text-white text-[10px] font-mono tabular-nums whitespace-nowrap shadow-md pointer-events-none">
                      <div className="font-sans font-bold text-sky-300">{item.label}</div>
                      <div>
                        {effPrimaryLabel}: {valueFormatter(item.value)}
                      </div>
                      {typeof item.secondaryValue === 'number' && (
                        <div>
                          {effSecondaryLabel}: {valueFormatter(item.secondaryValue)}
                        </div>
                      )}
                    </div>
                  )}
                  <div className="w-full h-full flex items-end justify-center gap-1 px-0.5">
                    <div
                      style={{ height: `${primaryPct}%` }}
                      className={`flex-1 max-w-[26px] rounded-t-md transition-all duration-300 ${
                        item.color ||
                        'bg-[#0345A4] hover:bg-[#0A63D8] dark:bg-sky-500 dark:hover:bg-sky-400'
                      }`}
                    />
                    {typeof item.secondaryValue === 'number' && (
                      <div
                        style={{ height: `${secondaryPct}%` }}
                        className="flex-1 max-w-[26px] rounded-t-md bg-[#0A63D8]/35 hover:bg-[#0A63D8]/55 dark:bg-sky-300/45 transition-all duration-300"
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex items-center justify-between gap-2 pt-2">
            {data.map((item, idx) => (
              <div
                key={`lbl-${item.label}-${idx}`}
                className="flex-1 text-center text-[10px] sm:text-[11px] font-medium text-[#5F6D82] dark:text-slate-400 truncate"
              >
                {item.label}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

interface BreakdownItem {
  label: string;
  value: number;
  colorClass?: string;
}

interface BreakdownChartProps {
  title: string;
  subtitle?: string;
  items: BreakdownItem[];
  valueFormatter?: (v: number) => string;
}

const DEFAULT_BAR_COLORS = [
  'bg-[#0345A4] dark:bg-sky-500',
  'bg-[#0A63D8] dark:bg-sky-400',
  'bg-emerald-600 dark:bg-emerald-500',
  'bg-amber-500 dark:bg-amber-400',
  'bg-indigo-600 dark:bg-indigo-400',
  'bg-slate-500 dark:bg-slate-400',
];

export const CategoryBreakdownChart: React.FC<BreakdownChartProps> = ({
  title,
  subtitle,
  items,
  valueFormatter = (v) => formatBDT(v),
}) => {
  const total = Math.max(
    1,
    items.reduce((acc, item) => acc + Math.max(0, item.value), 0)
  );

  return (
    <div className="rounded-xl bg-white dark:bg-slate-900 border border-[#D7E2F3] dark:border-slate-800 p-4 space-y-3.5">
      <div>
        <h4 className="text-sm font-bold text-[#0B1730] dark:text-white">{title}</h4>
        {subtitle && (
          <p className="text-[11px] text-[#5F6D82] dark:text-slate-400">{subtitle}</p>
        )}
      </div>

      <div className="space-y-3">
        {items.map((item, idx) => {
          const pct = Math.min(100, Math.round((Math.max(0, item.value) / total) * 100));
          const barColor =
            item.colorClass || DEFAULT_BAR_COLORS[idx % DEFAULT_BAR_COLORS.length];
          return (
            <div key={`${item.label}-${idx}`} className="space-y-1">
              <div className="flex items-center justify-between text-xs gap-2">
                <span className="font-medium text-[#0B1730] dark:text-slate-200 truncate">
                  {item.label}
                </span>
                <span className="font-mono font-semibold tabular-nums text-[#0B1730] dark:text-white shrink-0">
                  {valueFormatter(item.value)}{' '}
                  <span className="text-[10px] text-[#5F6D82] dark:text-slate-400">
                    ({pct}%)
                  </span>
                </span>
              </div>
              <div className="h-2 rounded-full bg-[#F4F8FF] dark:bg-slate-800 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${barColor}`}
                  style={{ width: `${Math.max(pct, item.value > 0 ? 3 : 0)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

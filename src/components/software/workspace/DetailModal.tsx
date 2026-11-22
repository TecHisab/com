import React from 'react';
import { X, Printer } from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';

interface DetailRow {
  label: string;
  value: string;
  mono?: boolean;
}

interface DetailModalProps {
  isOpen: boolean;
  title: string;
  subtitle?: string;
  rows: DetailRow[];
  footerNote?: string;
  onClose: () => void;
  onPrint?: () => void;
}

export const DetailModal: React.FC<DetailModalProps> = ({
  isOpen,
  title,
  subtitle,
  rows,
  footerNote,
  onClose,
  onPrint,
}) => {
  const { pick } = useLanguage();
  if (!isOpen) return null;

  const effectiveFooterNote =
    footerNote || pick('Simulated demonstration record — TecHisab Sandbox', 'সিমুলেটেড ডেমো রেকর্ড — টেকহিসাব স্যান্ডবক্স');

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B1730]/60 backdrop-blur-xs"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 border border-[#D7E2F3] dark:border-slate-800 shadow-2xl overflow-hidden">
        <div className="px-5 py-4 bg-[#02377F] text-white flex items-start justify-between gap-3">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-sky-200">
              {pick('DEMO MODE — Sample Record', 'ডেমো মোড — নমুনা রেকর্ড')}
            </div>
            <h4 className="text-base font-extrabold mt-0.5">{title}</h4>
            {subtitle && <p className="text-xs text-sky-100/80">{subtitle}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white cursor-pointer"
            aria-label={pick('Close detail dialog', 'বিস্তারিত ডায়ালগ বন্ধ করুন')}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 divide-y divide-[#D7E2F3]/70 dark:divide-slate-800">
          {rows.map((r, idx) => (
            <div key={idx} className="py-2.5 flex items-center justify-between gap-4 text-xs">
              <span className="text-[#5F6D82] dark:text-slate-400 font-medium">{r.label}</span>
              <span
                className={`text-[#0B1730] dark:text-white font-semibold text-right ${
                  r.mono ? 'font-mono tabular-nums' : ''
                }`}
              >
                {r.value}
              </span>
            </div>
          ))}
        </div>

        <div className="px-5 py-3.5 bg-[#F4F8FF] dark:bg-slate-950/60 border-t border-[#D7E2F3] dark:border-slate-800 flex items-center justify-between gap-3">
          <span className="text-[11px] text-[#5F6D82] dark:text-slate-400">{effectiveFooterNote}</span>
          <div className="flex items-center gap-2">
            {onPrint && (
              <button
                type="button"
                onClick={onPrint}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#D7E2F3] dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-[#0345A4] dark:text-sky-400 hover:border-[#0345A4] cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>{pick('Print', 'প্রিন্ট')}</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg bg-[#0345A4] hover:bg-[#02377F] text-white text-xs font-bold cursor-pointer"
            >
              {pick('Close', 'বন্ধ করুন')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

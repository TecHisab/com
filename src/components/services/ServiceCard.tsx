import React from 'react';
import { ServiceItem } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { localizeService } from '../../data/localizedData';
import {
  BookOpen,
  BarChart3,
  Briefcase,
  CreditCard,
  Users,
  Boxes,
  FileSpreadsheet,
  Receipt,
  Headset,
  Laptop,
  Code2,
  GraduationCap,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

interface ServiceCardProps {
  service: ServiceItem;
  onSelect: (service: ServiceItem) => void;
  onRequestQuote: (service: ServiceItem) => void;
}

const ICON_MAP: Record<string, React.ElementType> = {
  BookOpen,
  BarChart3,
  Briefcase,
  CreditCard,
  Users,
  Boxes,
  FileSpreadsheet,
  Receipt,
  Headset,
  Laptop,
  Code2,
  GraduationCap,
};

export const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  onSelect,
  onRequestQuote,
}) => {
  const { isBengali, pick } = useLanguage();
  const loc = localizeService(service, isBengali);
  const Icon = ICON_MAP[loc.iconName] || BookOpen;

  return (
    <div
      id={`service-card-${loc.id}`}
      className="card-3d bg-white dark:bg-slate-900 rounded-2xl border border-[#D7E2F3] dark:border-slate-800 p-6 flex flex-col justify-between shadow-xs hover:border-[#0345A4]/70 group"
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-2">
          <div className="p-3 rounded-xl bg-[#F4F8FF] dark:bg-slate-800 text-[#0345A4] dark:text-sky-400 border border-[#D7E2F3] dark:border-slate-700 group-hover:bg-[#0345A4] group-hover:text-white transition-colors">
            <Icon className="w-5 h-5" />
          </div>

          <div className="flex flex-col items-end gap-1">
            <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-lg bg-[#F4F8FF] dark:bg-slate-800 text-[#0345A4] dark:text-sky-300 border border-[#D7E2F3] dark:border-slate-700">
              {loc.categoryLabel}
            </span>
            {loc.startingRate && (
              <span className="text-[11px] font-bold text-[#0B1730] dark:text-slate-200 tabular-nums">
                {loc.startingRate}
              </span>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-bold text-[#0B1730] dark:text-white group-hover:text-[#0345A4] dark:group-hover:text-sky-400 transition-colors">
            {loc.title}
          </h3>
          <p className="text-xs sm:text-sm text-[#5F6D82] dark:text-slate-400 mt-2 leading-relaxed line-clamp-3">
            {loc.shortDesc}
          </p>
        </div>

        <div className="space-y-1.5 pt-1">
          {loc.features.slice(0, 4).map((feat, i) => (
            <div key={i} className="flex items-start gap-2 text-xs text-[#0B1730]/85 dark:text-slate-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#0A63D8] dark:text-sky-400 shrink-0 mt-0.5" />
              <span className="line-clamp-1">{feat}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-[#D7E2F3]/70 dark:border-slate-800 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => onSelect(service)}
          className="text-xs font-bold text-[#0345A4] dark:text-sky-400 hover:text-[#02377F] inline-flex items-center gap-1 cursor-pointer py-1.5"
        >
          <span>{pick('View Scope', 'বিস্তারিত দেখুন')}</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>

        <button
          type="button"
          onClick={() => onRequestQuote(service)}
          className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-[#F4F8FF] dark:bg-slate-800 hover:bg-[#0345A4] hover:text-white text-[#0345A4] dark:text-slate-200 border border-[#D7E2F3] dark:border-slate-700 transition-colors cursor-pointer"
        >
          {pick('Request Quote', 'কোটেশন চান')}
        </button>
      </div>
    </div>
  );
};


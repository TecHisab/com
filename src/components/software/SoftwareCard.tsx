import React from 'react';
import { SoftwareProduct } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { localizeSoftwareProduct } from '../../data/localizedData';
import {
  LayoutGrid,
  Building2,
  BookMarked,
  ShoppingBag,
  ScanBarcode,
  Truck,
  Layers,
  Sparkles,
  Smartphone,
  Play,
  ListChecks,
} from 'lucide-react';

interface SoftwareCardProps {
  product: SoftwareProduct;
  isActiveDemo?: boolean;
  onSelect: (product: SoftwareProduct) => void;
  onTryFree: (product: SoftwareProduct) => void;
}

const ICON_MAP: Record<string, React.ElementType> = {
  LayoutGrid,
  Building2,
  BookMarked,
  ShoppingBag,
  ScanBarcode,
  Truck,
  Layers,
  Sparkles,
  Smartphone,
};

export const SoftwareCard: React.FC<SoftwareCardProps> = ({
  product,
  isActiveDemo = false,
  onSelect,
  onTryFree,
}) => {
  const { isBengali, pick } = useLanguage();
  const localizedProduct = localizeSoftwareProduct(product, isBengali);
  const Icon = ICON_MAP[localizedProduct.iconName] || LayoutGrid;

  return (
    <div
      id={`software-card-${localizedProduct.id}`}
      className={`card-3d bg-white dark:bg-slate-900 rounded-2xl border p-6 flex flex-col justify-between group ${
        isActiveDemo
          ? 'border-[#0345A4] ring-1 ring-[#0345A4]/25 shadow-md'
          : 'border-[#D7E2F3] dark:border-slate-800 shadow-xs hover:border-[#0345A4]/60'
      }`}
    >
      <div className="space-y-4">
        {/* Header: Product Icon & Quiet Typographic Status Metadata */}
        <div className="flex items-start justify-between gap-3">
          <div className="p-3 rounded-xl bg-[#F4F8FF] dark:bg-slate-800 text-[#0345A4] dark:text-sky-400 border border-[#D7E2F3] dark:border-slate-700 group-hover:bg-[#0345A4] group-hover:text-white transition-colors">
            <Icon className="w-6 h-6" />
          </div>

          <div className="text-right space-y-0.5">
            <span className="text-[11px] font-semibold text-[#5F6D82] dark:text-slate-400 block">
              {localizedProduct.category}
            </span>
            <span className="text-[11px] font-bold text-[#0345A4] dark:text-sky-400 block">
              {localizedProduct.statusLabel}
            </span>
          </div>
        </div>

        {/* Name & Short Description */}
        <div>
          <h3 className="text-lg font-extrabold text-[#0B1730] dark:text-white group-hover:text-[#0345A4] dark:group-hover:text-sky-400 transition-colors">
            {localizedProduct.name}
          </h3>
          <p className="text-xs font-semibold text-[#0A63D8] dark:text-sky-400 mt-0.5">
            {localizedProduct.tagline}
          </p>
          <p className="text-xs sm:text-sm text-[#5F6D82] dark:text-slate-400 mt-2 leading-relaxed line-clamp-3">
            {localizedProduct.description}
          </p>
        </div>

        {/* Main Functionality Line */}
        <div className="pt-2 border-t border-[#D7E2F3]/70 dark:border-slate-800 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#5F6D82] dark:text-slate-400 block">
            {pick('Main Functionality', 'প্রধান কার্যকারিতা')}
          </span>
          <p className="text-xs font-medium text-[#0B1730] dark:text-slate-200 leading-snug">
            {localizedProduct.mainFunctionality}
          </p>
        </div>

        {/* Subscription Summary */}
        <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#D7E2F3]/70 dark:border-slate-800 text-xs">
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#5F6D82] block">
              {pick('Monthly', 'মাসিক')}
            </span>
            <span className="font-extrabold text-[#0B1730] dark:text-white font-mono tabular-nums">
              {localizedProduct.monthlyPriceLabel}
            </span>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#5F6D82] block">
              {pick('Annual', 'বাৎসরিক')}
            </span>
            <span className="font-bold text-[#0345A4] dark:text-sky-400 font-mono tabular-nums">
              {localizedProduct.annualPriceLabel}
            </span>
          </div>
        </div>
      </div>

      {/* Required Card Actions: View Features & Interactive Demo */}
      <div className="mt-5 pt-4 border-t border-[#D7E2F3]/70 dark:border-slate-800 flex items-center justify-between gap-2.5">
        <button
          type="button"
          onClick={() => onSelect(localizedProduct)}
          className="px-3 py-2 rounded-xl text-xs font-bold text-[#0345A4] dark:text-sky-400 bg-[#F4F8FF] dark:bg-slate-800 hover:bg-[#D7E2F3]/60 dark:hover:bg-slate-700 border border-[#D7E2F3] dark:border-slate-700 inline-flex items-center gap-1.5 cursor-pointer transition-colors"
        >
          <ListChecks className="w-3.5 h-3.5" />
          <span>{pick('View Features', 'বৈশিষ্ট্য দেখুন')}</span>
        </button>

        <button
          type="button"
          onClick={() => onTryFree(localizedProduct)}
          className="px-4 py-2 rounded-xl text-xs font-bold bg-[#0345A4] hover:bg-[#02377F] text-white transition-all cursor-pointer inline-flex items-center gap-1.5"
        >
          <Play className="w-3.5 h-3.5" />
          <span>{pick('Interactive Demo', 'ইন্টারেক্টিভ ডেমো')}</span>
        </button>
      </div>
    </div>
  );
};

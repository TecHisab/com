import React from 'react';
import { SoftwareDemoKey } from '../../types';
import { getLocalizedSoftwareProducts } from '../../data/localizedData';
import { useLanguage } from '../../context/LanguageContext';
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
  Calculator,
} from 'lucide-react';

interface SoftwareProductSelectorProps {
  activeDemo: SoftwareDemoKey;
  onSelectDemo: (key: SoftwareDemoKey) => void;
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

export const SoftwareProductSelector: React.FC<SoftwareProductSelectorProps> = ({
  activeDemo,
  onSelectDemo,
}) => {
  const { isBengali, pick } = useLanguage();
  const products = getLocalizedSoftwareProducts(isBengali);

  return (
    <div className="rounded-2xl bg-white dark:bg-slate-900 border border-[#D7E2F3] dark:border-slate-800 p-3 sm:p-4 space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h4 className="text-sm font-extrabold text-[#0B1730] dark:text-white">
            {pick(
              'Switch Live Interactive Product Preview or Financial Calculators',
              'লাইভ ইন্টারেক্টিভ প্রোডাক্ট প্রিভিউ বা আর্থিক ক্যালকুলেটর পরিবর্তন করুন'
            )}
          </h4>
          <p className="text-[11px] text-[#5F6D82] dark:text-slate-400">
            {pick(
              'Select any of the 9 TecHisab applications or open the 8 interactive business calculators below.',
              'নিচে থেকে ৯টি টেকহিসাব অ্যাপ্লিকেশনের যেকোনোটি নির্বাচন করুন অথবা ৮টি ইন্টারেক্টিভ ব্যবসা ক্যালকুলেটর চালু করুন।'
            )}
          </p>
        </div>

        <button
          type="button"
          onClick={() => onSelectDemo('calculators')}
          className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
            activeDemo === 'calculators'
              ? 'bg-[#0345A4] text-white border-[#0345A4] shadow-xs'
              : 'bg-[#F4F8FF] dark:bg-slate-800 text-[#0345A4] dark:text-sky-400 border-[#D7E2F3] dark:border-slate-700 hover:border-[#0345A4]'
          }`}
        >
          <Calculator className="w-4 h-4" />
          <span>{pick('8 Financial Calculators', '৮টি আর্থিক ক্যালকুলেটর')}</span>
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
        {products.map((product) => {
          const Icon = ICON_MAP[product.iconName] || LayoutGrid;
          const isActive = activeDemo === product.demoTabKey;
          return (
            <button
              key={product.id}
              type="button"
              onClick={() => onSelectDemo(product.demoTabKey)}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-left text-xs font-bold transition-all cursor-pointer border ${
                isActive
                  ? 'bg-[#0345A4] text-white border-[#0345A4] shadow-xs'
                  : 'bg-[#F4F8FF]/70 dark:bg-slate-800/60 text-[#0B1730] dark:text-slate-200 border-[#D7E2F3] dark:border-slate-700 hover:border-[#0345A4]/60'
              }`}
            >
              <Icon
                className={`w-4 h-4 shrink-0 ${
                  isActive ? 'text-sky-200' : 'text-[#0345A4] dark:text-sky-400'
                }`}
              />
              <span className="truncate">{product.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

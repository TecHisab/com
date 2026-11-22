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
  CheckCircle2,
  X,
  Play,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

interface SoftwareFeaturesModalProps {
  product: SoftwareProduct | null;
  onClose: () => void;
  onLaunchDemo: (product: SoftwareProduct) => void;
  onRequestOnboarding: () => void;
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

export const SoftwareFeaturesModal: React.FC<SoftwareFeaturesModalProps> = ({
  product,
  onClose,
  onLaunchDemo,
  onRequestOnboarding,
}) => {
  const { isBengali, pick } = useLanguage();
  if (!product) return null;

  const localizedProduct = localizeSoftwareProduct(product, isBengali);
  const Icon = ICON_MAP[localizedProduct.iconName] || LayoutGrid;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B1730]/65 backdrop-blur-xs overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-2xl rounded-2xl bg-white dark:bg-slate-900 border border-[#D7E2F3] dark:border-slate-800 shadow-2xl overflow-hidden my-6">
        <div className="px-6 py-5 bg-[#02377F] text-white flex items-start justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-white/10 border border-white/15 shrink-0">
              <Icon className="w-6 h-6 text-sky-200" />
            </div>
            <div>
              <div className="text-[11px] font-semibold text-sky-200">
                {localizedProduct.category} &middot; {localizedProduct.statusLabel}
              </div>
              <h3 className="text-xl font-extrabold tracking-tight mt-0.5">{localizedProduct.name}</h3>
              <p className="text-xs text-sky-100/90 mt-0.5">{localizedProduct.tagline}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white cursor-pointer"
            aria-label={pick('Close features modal', 'বৈশিষ্ট্য মডাল বন্ধ করুন')}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
          <p className="text-sm text-[#0B1730]/90 dark:text-slate-300 leading-relaxed">
            {localizedProduct.longDescription}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-[#F4F8FF] dark:bg-slate-800/60 border border-[#D7E2F3] dark:border-slate-700 space-y-2.5">
              <div className="text-xs font-extrabold uppercase tracking-wider text-[#0345A4] dark:text-sky-400">
                {pick('Core Capabilities', 'মূল সক্ষমতাসমূহ')}
              </div>
              <ul className="space-y-2">
                {localizedProduct.features.map((feat, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2 text-xs text-[#0B1730] dark:text-slate-200"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#0A63D8] dark:text-sky-400 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-[#F4F8FF] dark:bg-slate-800/60 border border-[#D7E2F3] dark:border-slate-700 space-y-2.5">
              <div className="text-xs font-extrabold uppercase tracking-wider text-[#0345A4] dark:text-sky-400">
                {pick(
                  `Interactive Demo Modules (${localizedProduct.modules.length})`,
                  `ইন্টারেক্টিভ ডেমো মডিউল (${localizedProduct.modules.length})`
                )}
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {localizedProduct.modules.map((mod) => (
                  <div
                    key={mod}
                    className="text-[11px] font-medium text-[#0B1730] dark:text-slate-200 px-2 py-1 rounded bg-white dark:bg-slate-900 border border-[#D7E2F3]/80 dark:border-slate-700 truncate"
                  >
                    {mod}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs p-4 rounded-xl border border-[#D7E2F3] dark:border-slate-800">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#5F6D82] block">
                {pick('Subscription Plans', 'সাবস্ক্রিপশন প্ল্যান')}
              </span>
              <span className="font-bold text-[#0B1730] dark:text-white font-mono tabular-nums">
                {localizedProduct.monthlyPriceLabel} &middot; {localizedProduct.annualPriceLabel}
              </span>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#5F6D82] block">
                {pick('Deployment & Security', 'ডিপ্লয়মেন্ট ও নিরাপত্তা')}
              </span>
              <span className="font-medium text-[#0B1730] dark:text-slate-200 flex items-center gap-1 mt-0.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#0345A4] dark:text-sky-400 shrink-0" />
                <span>{localizedProduct.specs.deployment}</span>
              </span>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 bg-[#F4F8FF] dark:bg-slate-950/60 border-t border-[#D7E2F3] dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => {
              onClose();
              onRequestOnboarding();
            }}
            className="text-xs font-bold text-[#0345A4] dark:text-sky-400 hover:underline inline-flex items-center gap-1 cursor-pointer"
          >
            <span>{pick('Request Guided Onboarding', 'গাইডেড অনবোর্ডিং অনুরোধ করুন')}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-[#5F6D82] hover:text-[#0B1730] dark:text-slate-300 border border-[#D7E2F3] dark:border-slate-700 bg-white dark:bg-slate-800 cursor-pointer"
            >
              {pick('Close', 'বন্ধ করুন')}
            </button>
            <button
              type="button"
              onClick={() => {
                onLaunchDemo(localizedProduct);
                onClose();
              }}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-[#0345A4] hover:bg-[#02377F] text-white inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5" />
              <span>{pick('Interactive Demo', 'ইন্টারেক্টিভ ডেমো')}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

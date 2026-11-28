import React, { useState } from 'react';
import { getLocalizedPricingData, getLocalizedSiteConfig } from '../../data/localizedData';
import { useLanguage } from '../../context/LanguageContext';
import { PricingTier, ProductPricingItem, ServiceChargeItem } from '../../types';
import {
  CheckCircle2,
  ArrowRight,
  HelpCircle,
  LayoutGrid,
  Building2,
  BookMarked,
  ShoppingBag,
  ScanBarcode,
  Truck,
  Layers,
  Sparkles,
  Smartphone,
  BookOpen,
  Users,
  Receipt,
  FileSpreadsheet,
  Globe,
  Code2,
  SlidersHorizontal,
  Info,
} from 'lucide-react';
import { SectionHeading } from '../common/SectionHeading';
import { ScrollReveal } from '../common/ScrollReveal';
import { PlanComparisonModal } from './PlanComparisonModal';

interface PricingSectionProps {
  onSelectPlan: (plan?: PricingTier | ProductPricingItem | ServiceChargeItem, cycle?: 'monthly' | 'annual') => void;
  onNavigateToSoftwareDemo?: (softwareKey: string) => void;
  isStandalonePage?: boolean;
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
  BookOpen,
  Users,
  Receipt,
  FileSpreadsheet,
  Globe,
  Code2,
};

export const PricingSection: React.FC<PricingSectionProps> = ({
  onSelectPlan,
  onNavigateToSoftwareDemo,
  isStandalonePage = false,
}) => {
  const { isBengali, pick } = useLanguage();
  const { serviceCharges, softwarePricing, pricingTiers } = getLocalizedPricingData(isBengali);
  const site = getLocalizedSiteConfig(isBengali);

  const [pricingMode, setPricingMode] = useState<'services' | 'software' | 'packages'>('software');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <ScrollReveal direction="up">
          <SectionHeading
            as={isStandalonePage ? 'h1' : 'h2'}
            badge={pick('Pricing & Plans', 'মূল্যতালিকা ও প্ল্যান')}
            title={pick(
              'Transparent Software, Service & Package Pricing',
              'সফটওয়্যার, সেবা ও প্যাকেজের স্বচ্ছ মূল্যতালিকা'
            )}
            subtitle={pick(
              'Explore baseline monthly & annual software rates (with annual billed at 10-month pricing), core service charges, and integrated packages.',
              'সফটওয়্যারের মাসিক ও বার্ষিক মূল্য (বার্ষিক প্যাকেজে ১০ মাসের মূল্যে ১২ মাস), মূল সেবার চার্জ এবং সমন্বিত প্যাকেজসমূহ দেখুন।'
            )}
          />
        </ScrollReveal>

        {/* Top Control Bar: 3 Pricing Categories + Annual Toggle */}
        <ScrollReveal direction="up" delay={0.05}>
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="inline-flex flex-wrap justify-center p-1.5 rounded-2xl bg-white dark:bg-slate-900 border border-[#D7E2F3] dark:border-slate-800 shadow-xs gap-1">
              <button
                type="button"
                onClick={() => setPricingMode('software')}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
                  pricingMode === 'software'
                    ? 'bg-[#0345A4] text-white shadow-xs'
                    : 'text-[#5F6D82] dark:text-slate-400 hover:text-[#0345A4] dark:hover:text-white'
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
                <span>{pick('Software Products (9)', 'সফটওয়্যার পোর্টফোলিও (৯টি)')}</span>
              </button>

              <button
                type="button"
                onClick={() => setPricingMode('services')}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
                  pricingMode === 'services'
                    ? 'bg-[#0345A4] text-white shadow-xs'
                    : 'text-[#5F6D82] dark:text-slate-400 hover:text-[#0345A4] dark:hover:text-white'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>{pick('Service Charges (6)', 'সেবার চার্জ (৬টি)')}</span>
              </button>

              <button
                type="button"
                onClick={() => setPricingMode('packages')}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
                  pricingMode === 'packages'
                    ? 'bg-[#0345A4] text-white shadow-xs'
                    : 'text-[#5F6D82] dark:text-slate-400 hover:text-[#0345A4] dark:hover:text-white'
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>{pick('Combined Packages', 'সমন্বিত প্যাকেজ')}</span>
              </button>
            </div>

            {pricingMode !== 'services' && (
              <div className="flex flex-wrap items-center justify-center gap-3">
                <div className="inline-flex items-center p-1 rounded-xl bg-white dark:bg-slate-900 border border-[#D7E2F3] dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setBillingCycle('monthly')}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      billingCycle === 'monthly'
                        ? 'bg-[#0345A4] text-white'
                        : 'text-[#5F6D82] dark:text-slate-400 hover:text-[#0B1730] dark:hover:text-white'
                    }`}
                  >
                    {pick('Monthly Billing', 'মাসিক বিলিং')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setBillingCycle('annual')}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      billingCycle === 'annual'
                        ? 'bg-[#0345A4] text-white'
                        : 'text-[#5F6D82] dark:text-slate-400 hover:text-[#0B1730] dark:hover:text-white'
                    }`}
                  >
                    <span>{pick('Annual Billing', 'বার্ষিক বিলিং')}</span>
                    <span className="px-1.5 py-0.5 rounded bg-sky-100 dark:bg-sky-950 text-[#0345A4] dark:text-sky-300 text-[10px] font-bold">
                      {pick('10-Mo Rate', '১০ মাসের রেট')}
                    </span>
                  </button>
                </div>

                {pricingMode === 'packages' && (
                  <button
                    type="button"
                    onClick={() => setIsComparisonOpen(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-[#D7E2F3] dark:border-slate-700 text-[#0345A4] dark:text-sky-400 text-xs font-bold hover:border-[#0345A4] transition-all cursor-pointer"
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                    <span>{pick('Compare Packages', 'প্যাকেজ তুলনা করুন')}</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </ScrollReveal>

        {/* TAB 1: ALL 9 SOFTWARE PRODUCTS */}
        {pricingMode === 'software' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {softwarePricing.map((item) => {
              const Icon = ICON_MAP[item.iconName] || LayoutGrid;
              const isJibon = item.id === 'price-jibon';
              const shownPrice =
                billingCycle === 'annual'
                  ? `৳${item.annualPrice.toLocaleString()}`
                  : `৳${item.monthlyPrice.toLocaleString()}`;
              const unitText =
                billingCycle === 'annual' ? pick('/ year', '/ বছর') : pick('/ month', '/ মাস');

              return (
                <div
                  key={item.id}
                  className={`rounded-2xl p-6 flex flex-col justify-between transition-all bg-white dark:bg-slate-900 border ${
                    item.popular
                      ? 'border-2 border-[#0345A4] shadow-md'
                      : 'border-[#D7E2F3] dark:border-slate-800 shadow-xs hover:border-[#0345A4]/60'
                  }`}
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="p-3 rounded-xl bg-[#F4F8FF] dark:bg-slate-800 text-[#0345A4] dark:text-sky-400 border border-[#D7E2F3] dark:border-slate-700">
                        <Icon className="w-5 h-5" />
                      </div>
                      {item.badge && (
                        <span
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                            item.popular
                              ? 'bg-[#0345A4] text-white'
                              : 'bg-[#F4F8FF] dark:bg-slate-800 text-[#0345A4] dark:text-sky-300 border border-[#D7E2F3] dark:border-slate-700'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </div>

                    <div>
                      <h3 className="text-lg font-extrabold text-[#0B1730] dark:text-white">
                        {item.softwareName}
                      </h3>
                      <p className="text-xs text-[#5F6D82] dark:text-slate-400 mt-1">
                        {item.subtitle}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[#D7E2F3]/70 dark:border-slate-800">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-2xl sm:text-3xl font-black text-[#0B1730] dark:text-white tabular-nums">
                          {shownPrice}
                        </span>
                        <span className="text-xs text-[#5F6D82] font-semibold">
                          {unitText}
                        </span>
                      </div>
                      <span className="text-[11px] font-semibold text-[#0A63D8] dark:text-sky-400 block mt-1">
                        {isJibon
                          ? pick('৳100 / month • ৳500 / year', '৳১০০ / মাস • ৳৫০০ / বছর')
                          : pick(
                              `Monthly: ৳${item.monthlyPrice.toLocaleString()} • Annual: ৳${item.annualPrice.toLocaleString()}`,
                              `মাসিক: ৳${item.monthlyPrice.toLocaleString()} • বার্ষিক: ৳${item.annualPrice.toLocaleString()}`
                            )}
                      </span>
                    </div>

                    <div className="space-y-2 pt-1">
                      {item.features.map((f, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-[#0B1730]/85 dark:text-slate-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#0A63D8] dark:text-sky-400 shrink-0 mt-0.5" />
                          <span>{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-5 mt-5 border-t border-[#D7E2F3]/70 dark:border-slate-800 space-y-2">
                    <button
                      type="button"
                      onClick={() => onSelectPlan(item, billingCycle)}
                      className="w-full py-2.5 rounded-xl bg-[#0345A4] hover:bg-[#02377F] text-white font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>{item.ctaText}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    {item.demoTabKey && onNavigateToSoftwareDemo && (
                      <button
                        type="button"
                        onClick={() => onNavigateToSoftwareDemo(item.demoTabKey!)}
                        className="w-full text-center text-[11px] font-bold text-[#0345A4] dark:text-sky-400 hover:underline cursor-pointer py-1"
                      >
                        {pick('Open Browser Preview', 'লাইভ ব্রাউজার ডেমো খুলুন')}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* TAB 2: ALL 6 SERVICE CHARGES */}
        {pricingMode === 'services' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {serviceCharges.map((svc) => {
              const Icon = ICON_MAP[svc.iconName] || BookOpen;
              return (
                <div
                  key={svc.id}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-[#D7E2F3] dark:border-slate-800 p-6 flex flex-col justify-between shadow-xs hover:border-[#0345A4]/70 transition-all"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="p-3 rounded-xl bg-[#F4F8FF] dark:bg-slate-800 text-[#0345A4] dark:text-sky-400 border border-[#D7E2F3] dark:border-slate-700">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[11px] font-bold text-[#5F6D82] dark:text-slate-400">
                        {svc.billingCycle}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-lg font-extrabold text-[#0B1730] dark:text-white">
                        {svc.serviceName}
                      </h3>
                      <div className="text-2xl font-black text-[#0345A4] dark:text-sky-400 mt-1 tabular-nums">
                        {svc.startingPrice}
                      </div>
                      <p className="text-xs text-[#5F6D82] dark:text-slate-400 mt-2 leading-relaxed">
                        {svc.scopeSummary}
                      </p>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-[#D7E2F3]/70 dark:border-slate-800">
                      {svc.inclusions.map((inc, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-[#0B1730]/85 dark:text-slate-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#0A63D8] dark:text-sky-400 shrink-0 mt-0.5" />
                          <span>{inc}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-5 mt-5 border-t border-[#D7E2F3]/70 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={() => onSelectPlan(svc, 'monthly')}
                      className="w-full py-2.5 rounded-xl bg-[#0345A4] hover:bg-[#02377F] text-white font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>{pick('Request Service Quotation', 'সার্ভিস কোটেশন অনুরোধ করুন')}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* TAB 3: COMBINED PACKAGES */}
        {pricingMode === 'packages' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {pricingTiers.map((tier) => {
              const isPopular = Boolean(tier.popular || tier.highlighted);
              const rawPrice = billingCycle === 'annual' ? tier.annualPrice : tier.monthlyPrice;
              const priceDisplay =
                typeof rawPrice === 'number' ? `৳${rawPrice.toLocaleString()}` : rawPrice;

              return (
                <div
                  key={tier.id}
                  className={`relative rounded-2xl p-7 flex flex-col justify-between transition-all bg-white dark:bg-slate-900 border ${
                    isPopular
                      ? 'border-2 border-[#0345A4] shadow-lg'
                      : 'border-[#D7E2F3] dark:border-slate-800 shadow-xs'
                  }`}
                >
                  <div className="space-y-5">
                    <div>
                      {isPopular && (
                        <span className="inline-block mb-2 px-2.5 py-0.5 rounded-md bg-[#0345A4] text-white text-[10px] font-bold uppercase tracking-wider">
                          {pick('Recommended Package', 'প্রস্তাবিত প্যাকেজ')}
                        </span>
                      )}
                      <h3 className="text-xl font-extrabold text-[#0B1730] dark:text-white">
                        {tier.name}
                      </h3>
                      <p className="text-xs text-[#5F6D82] dark:text-slate-400 mt-1">
                        {tier.tagline || tier.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[#D7E2F3]/70 dark:border-slate-800">
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-black text-[#0B1730] dark:text-white tabular-nums">
                          {priceDisplay}
                        </span>
                        <span className="text-xs text-[#5F6D82] font-medium">
                          /{billingCycle === 'annual' ? pick('year', 'বছর') : pick('month', 'মাস')}
                        </span>
                      </div>
                      <span className="text-[11px] text-[#0A63D8] dark:text-sky-400 font-semibold block mt-1">
                        {tier.limits || tier.targetAudience}
                      </span>
                    </div>

                    <div className="space-y-2.5 pt-2">
                      {tier.features.map((feat, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-[#0B1730]/85 dark:text-slate-300">
                          <CheckCircle2 className="w-4 h-4 text-[#0A63D8] dark:text-sky-400 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6 mt-6 border-t border-[#D7E2F3]/70 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={() => onSelectPlan(tier, billingCycle)}
                      className="w-full py-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer bg-[#0345A4] hover:bg-[#02377F] text-white"
                    >
                      <span>{tier.ctaText}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Indicative Pricing Clarification */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#F4F8FF] dark:bg-slate-900 border border-[#D7E2F3] dark:border-slate-800 flex items-start gap-3 text-xs text-[#5F6D82] dark:text-slate-300">
          <Info className="w-5 h-5 text-[#0345A4] dark:text-sky-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong className="text-[#0B1730] dark:text-white">
              {pick('Pricing Scope Note:', 'মূল্য নির্ধারণ সংক্রান্ত নোট:')}
            </strong>{' '}
            {site.indicativePricingDisclaimer}
          </p>
        </div>

        {/* Custom Quotation CTA Bar */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-[#D7E2F3] dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
          <div className="flex items-start sm:items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#F4F8FF] dark:bg-slate-800 text-[#0345A4] dark:text-sky-400 border border-[#D7E2F3] dark:border-slate-700 shrink-0">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#0B1730] dark:text-white">
                {pick(
                  'Need a Custom Retainer, Multi-Branch ERP Rollout, or Training Proposal?',
                  'কাস্টম রিটেইনার, মাল্টি-ব্রাঞ্চ ইআরপি বাস্তবায়ন বা কর্পোরেট প্রশিক্ষণের প্রস্তাবনা প্রয়োজন?'
                )}
              </h3>
              <p className="text-xs text-[#5F6D82] dark:text-slate-400 mt-0.5">
                {pick(
                  'Share your transaction volume or requirements to receive a tailored written quotation.',
                  'আপনার লেনদেনের পরিমাণ ও চাহিদা জানান, আমরা উপযোগী লিখিত কোটেশন পাঠাব।'
                )}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onSelectPlan(undefined, billingCycle)}
            className="px-5 py-2.5 rounded-xl bg-[#0345A4] hover:bg-[#02377F] text-white text-xs font-bold shrink-0 transition-colors cursor-pointer"
          >
            {pick('Request Custom Proposal', 'কাস্টম প্রস্তাবনা অনুরোধ করুন')}
          </button>
        </div>

        <PlanComparisonModal
          isOpen={isComparisonOpen}
          onClose={() => setIsComparisonOpen(false)}
          onSelectPlan={onSelectPlan}
          billingCycle={billingCycle}
        />
      </div>
    </section>
  );
};


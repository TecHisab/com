import React, { useState, useEffect, useRef } from 'react';
import { X, Check, Minus, ShieldCheck } from 'lucide-react';
import { getLocalizedPricingData } from '../../data/localizedData';
import { useLanguage } from '../../context/LanguageContext';
import { PricingPlan } from '../../types';

interface PlanComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPlan: (plan: PricingPlan, cycle: 'monthly' | 'annual') => void;
  billingCycle: 'monthly' | 'annual';
}

interface FeatureRow {
  category: 'accounting' | 'tax' | 'software' | 'support';
  featureName: string;
  starter: string | boolean;
  growth: string | boolean;
  enterprise: string | boolean;
}

export const PlanComparisonModal: React.FC<PlanComparisonModalProps> = ({
  isOpen,
  onClose,
  onSelectPlan,
  billingCycle,
}) => {
  const { isBengali, pick } = useLanguage();
  const { pricingTiers } = getLocalizedPricingData(isBengali);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    setTimeout(() => closeBtnRef.current?.focus(), 50);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const comparisonRows: FeatureRow[] = [
    {
      category: 'accounting',
      featureName: pick(
        'Monthly Transaction Recording & Bookkeeping',
        'মাসিক লেনদেন এন্ট্রি ও বুককিপিং'
      ),
      starter: pick('Single Entity', 'একক প্রতিষ্ঠান'),
      growth: pick('Full Accounting + Payroll', 'পূর্ণাঙ্গ অ্যাকাউন্টিং + পেরোল'),
      enterprise: pick('Multi-Branch Consolidation', 'মাল্টি-ব্রাঞ্চ কনসলিডেশন'),
    },
    {
      category: 'accounting',
      featureName: pick(
        'Bank Reconciliation & Trial Balance',
        'ব্যাংক রিকনসিলিয়েশন ও ট্রায়াল ব্যালেন্স'
      ),
      starter: true,
      growth: true,
      enterprise: true,
    },
    {
      category: 'accounting',
      featureName: pick(
        'Monthly P&L, Balance Sheet & MIS Pack',
        'মাসিক লাভ-ক্ষতি, ব্যালেন্স শিট ও এমআইএস রিপোর্ট'
      ),
      starter: pick('Core Monthly Statements', 'মূল মাসিক বিবরণী'),
      growth: pick('Management MIS + Budgets', 'ম্যানেজমেন্ট এমআইএস + বাজেট'),
      enterprise: pick('Executive & Virtual CFO Pack', 'এক্সিকিউটিভ ও ভার্চুয়াল সিএফও প্যাক'),
    },
    {
      category: 'tax',
      featureName: pick(
        'VAT Documentation & Return Prep Support',
        'ভ্যাট ডকুমেন্টেশন ও রিটার্ন প্রস্তুতি সহায়তা'
      ),
      starter: false,
      growth: true,
      enterprise: true,
    },
    {
      category: 'tax',
      featureName: pick(
        'TDS & Salary Tax Calculation Sheets',
        'উৎসে কর (TDS) ও বেতন কর হিসাব শিট'
      ),
      starter: false,
      growth: true,
      enterprise: true,
    },
    {
      category: 'software',
      featureName: pick(
        'Included TecHisab Software Tier',
        'অন্তর্ভুক্ত টেকহিসাব সফটওয়্যার সংস্করণ'
      ),
      starter: pick('TecHisab Cloud Accounting', 'টেকহিসাব ক্লাউড অ্যাকাউন্টিং'),
      growth: pick('TecHisab Business / Inventory', 'টেকহিসাব বিজনেস / ইনভেন্টরি'),
      enterprise: pick('TecHisab ERP / TecHisab One', 'টেকহিসাব ইআরপি / টেকহিসাব ওয়ান'),
    },
    {
      category: 'support',
      featureName: pick(
        'Consultation & Advisory Channel',
        'পরামর্শ ও সাপোর্ট চ্যানেল'
      ),
      starter: pick('Email & Phone Desk', 'ইমেইল ও ফোন ডেস্ক'),
      growth: pick('Dedicated Review Meetings', 'নির্ধারিত রিভিউ মিটিং'),
      enterprise: pick('Priority Engagement Team', 'অগ্রাধিকারমূলক বিশেষজ্ঞ টিম'),
    },
  ];

  const filteredRows =
    activeCategory === 'all'
      ? comparisonRows
      : comparisonRows.filter((r) => r.category === activeCategory);

  const getTierPrice = (tierId: string) => {
    const tier = pricingTiers.find((t) => t.id === tierId);
    if (!tier) return '';
    const raw = billingCycle === 'annual' ? tier.annualPrice : tier.monthlyPrice;
    return typeof raw === 'number' ? `৳${raw.toLocaleString()}` : raw;
  };

  const renderCell = (val: string | boolean) => {
    if (typeof val === 'boolean') {
      return val ? (
        <div className="flex items-center justify-center text-[#0345A4] dark:text-sky-400">
          <Check className="w-4 h-4 stroke-[2.5]" />
        </div>
      ) : (
        <div className="flex items-center justify-center text-slate-300 dark:text-slate-600">
          <Minus className="w-4 h-4" />
        </div>
      );
    }
    return <span className="text-xs font-semibold text-[#0B1730] dark:text-slate-200">{val}</span>;
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#0B1730]/70 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="plan-comparison-title"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-[#D7E2F3] dark:border-slate-800 overflow-hidden max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-[#D7E2F3] dark:border-slate-800 flex items-center justify-between bg-[#F4F8FF] dark:bg-slate-950/70">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#0A63D8] dark:text-sky-400">
              {pick('Package Comparison', 'প্যাকেজ তুলনামূলক ছক')} (
              {billingCycle === 'annual'
                ? pick('Annual 10-Month Rate', 'বার্ষিক ১০ মাসের রেট')
                : pick('Monthly Rate', 'মাসিক রেট')}
              )
            </span>
            <h3 id="plan-comparison-title" className="text-xl font-extrabold text-[#0B1730] dark:text-white mt-0.5">
              {pick('Compare Combined Business Packages', 'সমন্বিত বিজনেস প্যাকেজসমূহের তুলনা')}
            </h3>
          </div>

          <button
            ref={closeBtnRef}
            type="button"
            onClick={onClose}
            aria-label={pick('Close comparison modal', 'বন্ধ করুন')}
            className="p-2 text-[#5F6D82] hover:text-[#0B1730] rounded-xl hover:bg-white dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 py-3 border-b border-[#D7E2F3] dark:border-slate-800 flex items-center gap-2 overflow-x-auto text-xs">
          {[
            { id: 'all', label: pick('All Items', 'সকল বিষয়') },
            { id: 'accounting', label: pick('Accounting & MIS', 'অ্যাকাউন্টিং ও এমআইএস') },
            { id: 'tax', label: pick('Tax & VAT', 'ট্যাক্স ও ভ্যাট') },
            { id: 'software', label: pick('Software Suite', 'সফটওয়্যার স্যুট') },
            { id: 'support', label: pick('Support', 'সাপোর্ট') },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeCategory === cat.id
                  ? 'bg-[#0345A4] text-white'
                  : 'bg-[#F4F8FF] dark:bg-slate-800 text-[#5F6D82] dark:text-slate-300'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="overflow-auto flex-1">
          <table className="w-full border-collapse text-left text-xs min-w-[640px]">
            <thead className="sticky top-0 z-10 bg-[#F4F8FF] dark:bg-slate-800 border-b border-[#D7E2F3] dark:border-slate-700">
              <tr>
                <th className="p-4 w-2/5 text-[#0B1730] dark:text-slate-200 font-bold uppercase tracking-wider text-[11px]">
                  {pick('Capability', 'সুবিধাসমূহ')}
                </th>
                <th className="p-4 w-1/5 text-center text-[#0B1730] dark:text-white">
                  <span className="font-extrabold block">{pick('Starter Accounting', 'স্টার্টার অ্যাকাউন্টিং')}</span>
                  <span className="text-xs font-bold text-[#0345A4] dark:text-sky-400">
                    {getTierPrice('plan-starter-accounting')}
                  </span>
                </th>
                <th className="p-4 w-1/5 text-center text-[#0B1730] dark:text-white bg-white dark:bg-slate-900 border-x border-[#D7E2F3] dark:border-slate-700">
                  <span className="font-extrabold block text-[#0345A4] dark:text-sky-400">
                    {pick('Growth Operations', 'গ্রোথ অপারেশনস')}
                  </span>
                  <span className="text-xs font-bold text-[#0B1730] dark:text-slate-200">
                    {getTierPrice('plan-business-ops')}
                  </span>
                </th>
                <th className="p-4 w-1/5 text-center text-[#0B1730] dark:text-white">
                  <span className="font-extrabold block">
                    {pick('Enterprise Advisory', 'এন্টারপ্রাইজ অ্যাডভাইজরি')}
                  </span>
                  <span className="text-xs font-bold text-[#0345A4] dark:text-sky-400">
                    {getTierPrice('plan-enterprise-one')}
                  </span>
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#D7E2F3]/60 dark:divide-slate-800">
              {filteredRows.map((row, idx) => (
                <tr key={idx} className="hover:bg-[#F4F8FF]/50 dark:hover:bg-slate-800/40">
                  <td className="p-4 font-semibold text-[#0B1730] dark:text-slate-200">{row.featureName}</td>
                  <td className="p-4 text-center">{renderCell(row.starter)}</td>
                  <td className="p-4 text-center bg-[#F4F8FF]/40 dark:bg-slate-800/20 border-x border-[#D7E2F3]/60 dark:border-slate-800">
                    {renderCell(row.growth)}
                  </td>
                  <td className="p-4 text-center">{renderCell(row.enterprise)}</td>
                </tr>
              ))}
            </tbody>

            <tfoot className="bg-[#F4F8FF] dark:bg-slate-800 border-t border-[#D7E2F3] dark:border-slate-700">
              <tr>
                <td className="p-4 text-xs font-semibold text-[#5F6D82]">
                  {pick('Select a package to request setup', 'সেটআপ অনুরোধ করতে একটি প্যাকেজ বেছে নিন')}
                </td>
                {pricingTiers.map((tier) => (
                  <td key={tier.id} className="p-4 text-center">
                    <button
                      type="button"
                      onClick={() => {
                        onSelectPlan(tier, billingCycle);
                        onClose();
                      }}
                      className="w-full py-2 px-3 rounded-xl bg-[#0345A4] hover:bg-[#02377F] text-white text-xs font-bold transition-colors cursor-pointer"
                    >
                      {pick('Inquire', 'আবেদন করুন')}
                    </button>
                  </td>
                ))}
              </tr>
            </tfoot>
          </table>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 border-t border-[#D7E2F3] dark:border-slate-800 flex items-center justify-between gap-3 text-xs text-[#5F6D82]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#0345A4]" />
            <span>
              {pick(
                'Final monthly retainer pricing is confirmed based on transaction volume and branch count.',
                'লেনদেনের পরিমাণ ও শাখা সংখ্যার ভিত্তিতে চূড়ান্ত মাসিক রিটেইনার মূল্য নির্ধারিত হয়।'
              )}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-[#F4F8FF] dark:bg-slate-800 text-[#0B1730] dark:text-slate-200 font-bold cursor-pointer"
          >
            {pick('Close', 'বন্ধ করুন')}
          </button>
        </div>
      </div>
    </div>
  );
};


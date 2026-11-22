import React, { useEffect, useRef, useState } from 'react';
import {
  TrendingUp,
  Wallet,
  Package,
  ArrowUpRight,
  ArrowDownRight,
  ShoppingBag,
  Receipt,
  Bell,
  CheckCircle2,
  BarChart3,
} from 'lucide-react';
import { BrandLogo } from '../common/BrandLogo';
import { useLanguage } from '../../context/LanguageContext';

type PeriodKey = 'monthly' | 'quarterly';
type ScreenView = 'overview' | 'transactions';

interface MonthMetric {
  monthEn: string;
  monthBn: string;
  revenue: number;
  expense: number;
  revLabel: string;
  expLabel: string;
}

const PERFORMANCE_SERIES: Record<PeriodKey, MonthMetric[]> = {
  monthly: [
    { monthEn: 'Jun', monthBn: 'জুন', revenue: 62, expense: 42, revLabel: '৳ 18.4L', expLabel: '৳ 12.1L' },
    { monthEn: 'Jul', monthBn: 'জুলাই', revenue: 70, expense: 46, revLabel: '৳ 20.1L', expLabel: '৳ 13.4L' },
    { monthEn: 'Aug', monthBn: 'আগস্ট', revenue: 66, expense: 44, revLabel: '৳ 19.6L', expLabel: '৳ 13.0L' },
    { monthEn: 'Sep', monthBn: 'সেপ্টে', revenue: 79, expense: 51, revLabel: '৳ 22.3L', expLabel: '৳ 14.8L' },
    { monthEn: 'Oct', monthBn: 'অক্টো', revenue: 85, expense: 54, revLabel: '৳ 23.5L', expLabel: '৳ 15.6L' },
    { monthEn: 'Nov', monthBn: 'নভে', revenue: 94, expense: 58, revLabel: '৳ 24.85L', expLabel: '৳ 16.42L' },
  ],
  quarterly: [
    { monthEn: 'Q2 25', monthBn: 'কিউ২', revenue: 58, expense: 41, revLabel: '৳ 52.1L', expLabel: '৳ 36.2L' },
    { monthEn: 'Q3 25', monthBn: 'কিউ৩', revenue: 69, expense: 46, revLabel: '৳ 58.9L', expLabel: '৳ 39.4L' },
    { monthEn: 'Q4 25', monthBn: 'কিউ৪', revenue: 76, expense: 49, revLabel: '৳ 63.4L', expLabel: '৳ 41.8L' },
    { monthEn: 'Q1 26', monthBn: 'কিউ১', revenue: 82, expense: 53, revLabel: '৳ 67.2L', expLabel: '৳ 44.1L' },
    { monthEn: 'Q2 26', monthBn: 'কিউ২', revenue: 88, expense: 56, revLabel: '৳ 70.1L', expLabel: '৳ 45.9L' },
    { monthEn: 'Q3 26', monthBn: 'কিউ৩', revenue: 96, expense: 60, revLabel: '৳ 72.4L', expLabel: '৳ 47.2L' },
  ],
};

const DASHBOARD_SUMMARIES: Record<
  PeriodKey,
  {
    revenue: string;
    revenueDelta: string;
    expenses: string;
    expenseRatio: string;
    netProfit: string;
    profitMargin: string;
    cashBank: string;
    cashSplit: string;
    salesVal: string;
    salesMetaEn: string;
    salesMetaBn: string;
    purchaseVal: string;
    purchaseMetaEn: string;
    purchaseMetaBn: string;
    inventoryCount: string;
    inventoryMetaEn: string;
    inventoryMetaBn: string;
  }
> = {
  monthly: {
    revenue: '৳ 24,85,400',
    revenueDelta: '+14.2%',
    expenses: '৳ 16,42,150',
    expenseRatio: '66.1%',
    netProfit: '৳ 8,43,250',
    profitMargin: '33.9%',
    cashBank: '৳ 11,64,800',
    cashSplit: '৳ 2.18L / ৳ 9.46L',
    salesVal: '৳ 24,85,400',
    salesMetaEn: '148 Invoices · 92% Collected',
    salesMetaBn: '১৪৮টি ইনভয়েস · ৯২% আদায়',
    purchaseVal: '৳ 13,18,000',
    purchaseMetaEn: '64 POs · ৳ 1.85L Payable',
    purchaseMetaBn: '৬৪টি ক্রয় আদেশ · ১.৮৫ লাখ বকেয়া',
    inventoryCount: '1,240 SKUs',
    inventoryMetaEn: '৳ 18.90L Value · 6 Low Stock',
    inventoryMetaBn: '১৮.৯০ লাখ মূল্য · ৬টি কম স্টক',
  },
  quarterly: {
    revenue: '৳ 72,40,800',
    revenueDelta: '+18.6%',
    expenses: '৳ 47,20,300',
    expenseRatio: '65.2%',
    netProfit: '৳ 25,20,500',
    profitMargin: '34.8%',
    cashBank: '৳ 14,92,400',
    cashSplit: '৳ 2.85L / ৳ 12.07L',
    salesVal: '৳ 72,40,800',
    salesMetaEn: '432 Invoices · 94% Collected',
    salesMetaBn: '৪৩২টি ইনভয়েস · ৯৪% আদায়',
    purchaseVal: '৳ 38,60,000',
    purchaseMetaEn: '186 POs · ৳ 3.40L Payable',
    purchaseMetaBn: '১৮৬টি ক্রয় আদেশ · ৩.৪০ লাখ বকেয়া',
    inventoryCount: '1,284 SKUs',
    inventoryMetaEn: '৳ 21.40L Value · 4 Low Stock',
    inventoryMetaBn: '২১.৪০ লাখ মূল্য · ৪টি কম স্টক',
  },
};

export const HeroDeviceShowcase: React.FC = () => {
  const { pick } = useLanguage();

  const [period, setPeriod] = useState<PeriodKey>('monthly');
  const [screenView, setScreenView] = useState<ScreenView>('overview');
  const [selectedBarIndex, setSelectedBarIndex] = useState<number>(5);
  const [activeAlertIndex, setActiveAlertIndex] = useState<number>(0);
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);

  const stageRef = useRef<HTMLDivElement>(null);
  const laptopMotionRef = useRef<HTMLDivElement>(null);
  const phoneMotionRef = useRef<HTMLDivElement>(null);

  const pointerTarget = useRef({ nx: 0, ny: 0 });
  const pointerCurrent = useRef({ nx: 0, ny: 0 });
  const scrollTarget = useRef(0);
  const scrollCurrent = useRef(0);

  // Respect user reduced-motion accessibility preference
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReducedMotion(media.matches);
    sync();
    media.addEventListener('change', sync);
    return () => media.removeEventListener('change', sync);
  }, []);

  // Gentle cycling highlight for smartphone alerts & desktop figures
  useEffect(() => {
    if (reducedMotion) return;
    const id = window.setInterval(() => {
      setActiveAlertIndex((prev) => (prev + 1) % 3);
    }, 3400);
    return () => window.clearInterval(id);
  }, [reducedMotion]);

  // Lightweight GPU-only parallax & scroll depth loop (zero React re-renders)
  useEffect(() => {
    if (reducedMotion) {
      if (laptopMotionRef.current) laptopMotionRef.current.style.transform = '';
      if (phoneMotionRef.current) phoneMotionRef.current.style.transform = '';
      return;
    }

    let rafId = 0;
    let active = true;

    const handleScroll = () => {
      const progress = Math.min(1, Math.max(0, window.scrollY / 680));
      scrollTarget.current = progress;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    const tick = () => {
      if (!active) return;

      pointerCurrent.current.nx += (pointerTarget.current.nx - pointerCurrent.current.nx) * 0.08;
      pointerCurrent.current.ny += (pointerTarget.current.ny - pointerCurrent.current.ny) * 0.08;
      scrollCurrent.current += (scrollTarget.current - scrollCurrent.current) * 0.09;

      const { nx, ny } = pointerCurrent.current;
      const sc = scrollCurrent.current;

      if (laptopMotionRef.current) {
        const rx = (-ny * 4.5 + 1.2 - sc * 3.5).toFixed(2);
        const ry = (nx * 6.5 - 2.2).toFixed(2);
        const ty = (-sc * 12).toFixed(2);
        laptopMotionRef.current.style.transform = `perspective(1350px) translate3d(${(nx * 6).toFixed(1)}px, ${ty}px, 0) rotateX(${rx}deg) rotateY(${ry}deg)`;
      }

      if (phoneMotionRef.current) {
        const rx = (-ny * 5.5 + 1.8 - sc * 4.2).toFixed(2);
        const ry = (nx * 8.5 - 6.0).toFixed(2);
        const px = (nx * 14).toFixed(1);
        const py = (ny * 8 - sc * 20).toFixed(1);
        phoneMotionRef.current.style.transform = `perspective(1200px) translate3d(${px}px, ${py}px, 42px) rotateX(${rx}deg) rotateY(${ry}deg)`;
      }

      rafId = window.requestAnimationFrame(tick);
    };

    rafId = window.requestAnimationFrame(tick);

    return () => {
      active = false;
      window.cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [reducedMotion]);

  const handleStagePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reducedMotion || !stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    pointerTarget.current.nx = Math.max(-0.5, Math.min(0.5, (e.clientX - rect.left) / rect.width - 0.5)) * 2;
    pointerTarget.current.ny = Math.max(-0.5, Math.min(0.5, (e.clientY - rect.top) / rect.height - 0.5)) * 2;
  };

  const handleStagePointerLeave = () => {
    pointerTarget.current = { nx: 0, ny: 0 };
  };

  const summary = DASHBOARD_SUMMARIES[period];
  const chartData = PERFORMANCE_SERIES[period];
  const focusedMonth = chartData[selectedBarIndex] || chartData[chartData.length - 1];

  const transactions = [
    {
      id: 'INV-2048',
      party: pick('Apex Traders Ltd.', 'অ্যাপেক্স ট্রেডার্স লি.'),
      type: pick('Sales · Paid', 'বিক্রয় · পরিশোধিত'),
      amount: '+৳ 1,85,000',
      positive: true,
    },
    {
      id: 'PO-884',
      party: pick('Chittagong Steel Co.', 'চট্টগ্রাম স্টিল কোং'),
      type: pick('Inventory Purchase', 'ইনভেন্টরি ক্রয়'),
      amount: '-৳ 94,500',
      positive: false,
    },
    {
      id: 'PAY-112',
      party: pick('Payroll & TDS Ledger', 'পেরোল ও টিডিএস লেজার'),
      type: pick('Expense · Cleared', 'ব্যয় · নিষ্পত্তিকৃত'),
      amount: '-৳ 2,15,000',
      positive: false,
    },
    {
      id: 'VAT-91',
      party: pick('Mushak 9.1 Output Credit', 'মূসক ৯.১ আউটপুট ক্রেডিট'),
      type: pick('Tax Ledger', 'ট্যাক্স লেজার'),
      amount: '+৳ 42,600',
      positive: true,
    },
  ];

  const phoneAlerts = [
    {
      title: pick('Invoice #INV-2048 Paid', 'ইনভয়েস #INV-2048 পরিশোধিত'),
      sub: pick('Apex Traders · +৳ 1,85,000', 'অ্যাপেক্স ট্রেডার্স · +৳ ১,৮৫,০০০'),
      tone: 'text-emerald-600 dark:text-emerald-400',
    },
    {
      title: pick('Mushak 9.1 Ready', 'মূসক ৯.১ রিটার্ন প্রস্তুত'),
      sub: pick('VAT return ledger balanced', 'ভ্যাট লেজার সমন্বিত আছে'),
      tone: 'text-[#0345A4] dark:text-sky-400',
    },
    {
      title: pick('Inventory Restock Alert', 'ইনভেন্টরি রিস্টক সতর্কতা'),
      sub: pick('6 SKUs below threshold', '৬টি আইটেম ন্যূনতম স্টকের নিচে'),
      tone: 'text-amber-600 dark:text-amber-400',
    },
  ];

  return (
    <div
      ref={stageRef}
      onPointerMove={handleStagePointerMove}
      onPointerLeave={handleStagePointerLeave}
      className="relative w-full py-2 sm:py-4 sm:pr-6 md:pr-8 lg:pr-6 select-none"
      aria-label={pick(
        'Interactive TecHisab Laptop and Smartphone Software Preview',
        'টেকহিসাব ল্যাপটপ ও স্মার্টফোন সফটওয়্যার প্রিভিউ'
      )}
    >
      {/* Subtle Ambient Ground Backdrop Shadow (clean, non-distracting) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-8 bottom-3 h-14 rounded-full bg-[#02377F]/12 dark:bg-sky-500/10 blur-2xl"
      />

      {/* ==================== CENTERED 3D LAPTOP ==================== */}
      <div ref={laptopMotionRef} className="relative z-10 w-full max-w-[600px] mx-auto lg:mx-0">
        <div className="animate-laptop-enter">
          <div className="animate-float-laptop">
            {/* Laptop Lid / Aluminum Frame */}
            <div className="relative rounded-t-2xl sm:rounded-t-[20px] bg-gradient-to-b from-slate-800 via-slate-900 to-slate-950 p-2 sm:p-2.5 shadow-[0_24px_48px_-14px_rgba(2,55,127,0.32)] dark:shadow-[0_26px_54px_-12px_rgba(0,0,0,0.7)] border border-slate-700/80 ring-1 ring-white/10">
              {/* Top Webcam & Sensor Bar */}
              <div className="flex items-center justify-center pb-1.5" aria-hidden="true">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-700 ring-1 ring-slate-600/80 flex items-center justify-center">
                  <div className="w-0.5 h-0.5 rounded-full bg-sky-400/70" />
                </div>
              </div>

              {/* Inner Illuminated Laptop Screen */}
              <div className="relative rounded-lg sm:rounded-xl overflow-hidden bg-[#F4F8FF] dark:bg-slate-950 border border-slate-800/80 text-[#0B1730] dark:text-slate-100">
                {/* Screen Wake-Up Dark Glass Overlay */}
                <div
                  aria-hidden="true"
                  className="animate-screen-wake pointer-events-none absolute inset-0 z-30 bg-[#04132C]"
                />

                {/* Subtle Screen Specular Glass Reflection */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-tr from-transparent via-white/[0.04] to-white/[0.11]"
                />

                {/* Laptop Screen Header Bar */}
                <div className="bg-[#02377F] text-white px-3 sm:px-4 py-2 sm:py-2.5 flex items-center justify-between gap-2 border-b border-[#0A63D8]/40">
                  <div className="flex items-center gap-2 min-w-0">
                    <BrandLogo variant="mark" size="sm" themeMode="dark" className="scale-75 -ml-1 shrink-0" />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] sm:text-xs font-extrabold tracking-tight text-white truncate">
                          TecHisab ERP &amp; Accounting
                        </span>
                        <span className="hidden sm:inline-block text-[9px] font-bangla text-sky-200 px-1.5 py-0.5 rounded bg-white/10 border border-white/15">
                          কাজকে সহজ করুন
                        </span>
                      </div>
                      <p className="text-[9px] sm:text-[10px] text-sky-200/85 truncate">
                        {pick('Business Financial Command Center', 'ব্যবসায়িক আর্থিক পরিচালনা ড্যাশবোর্ড')}
                      </p>
                    </div>
                  </div>

                  {/* Period & View Controls */}
                  <div className="flex items-center gap-1 shrink-0">
                    <div className="inline-flex rounded-md bg-[#01255C] p-0.5 border border-white/15">
                      {(['monthly', 'quarterly'] as const).map((p) => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setPeriod(p)}
                          className={`px-1.5 sm:px-2 py-0.5 rounded text-[9px] sm:text-[10px] font-bold transition-colors cursor-pointer ${
                            period === p
                              ? 'bg-white text-[#02377F]'
                              : 'text-sky-100 hover:text-white'
                          }`}
                        >
                          {p === 'monthly' ? pick('Month', 'মাস') : pick('Quarter', 'ত্রৈমাসিক')}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Secondary View Switcher */}
                <div className="px-3 sm:px-4 py-1.5 bg-white dark:bg-slate-900 border-b border-[#D7E2F3] dark:border-slate-800 flex items-center justify-between gap-2 text-[10px]">
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setScreenView('overview')}
                      className={`px-2 py-0.5 rounded font-bold transition-colors cursor-pointer ${
                        screenView === 'overview'
                          ? 'bg-[#0345A4] text-white'
                          : 'text-[#5F6D82] dark:text-slate-400 hover:bg-[#F4F8FF] dark:hover:bg-slate-800'
                      }`}
                    >
                      {pick('Financial Overview', 'আর্থিক সারসংক্ষেপ')}
                    </button>
                    <button
                      type="button"
                      onClick={() => setScreenView('transactions')}
                      className={`px-2 py-0.5 rounded font-bold transition-colors cursor-pointer ${
                        screenView === 'transactions'
                          ? 'bg-[#0345A4] text-white'
                          : 'text-[#5F6D82] dark:text-slate-400 hover:bg-[#F4F8FF] dark:hover:bg-slate-800'
                      }`}
                    >
                      {pick('Ledger & Transactions', 'লেজার ও লেনদেন')}
                    </button>
                  </div>
                  <span className="hidden sm:inline font-semibold text-[#0345A4] dark:text-sky-400">
                    {pick('Live Sample Data', 'নমুনা লাইভ ডেটা')}
                  </span>
                </div>

                {/* Laptop Screen Body */}
                <div className="p-2.5 sm:p-3.5 space-y-2.5 sm:space-y-3">
                  {/* 4 Core Financial KPI Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-[#D7E2F3] dark:border-slate-800 transition-transform duration-200 hover:-translate-y-0.5">
                      <div className="flex items-center justify-between text-[9px] font-semibold text-[#5F6D82] dark:text-slate-400">
                        <span className="truncate">{pick('Total Revenue', 'মোট আয়')}</span>
                        <TrendingUp className="w-3 h-3 text-[#0345A4] dark:text-sky-400 shrink-0" />
                      </div>
                      <div className="text-xs sm:text-[13px] font-extrabold text-[#0B1730] dark:text-white mt-0.5 tabular-nums truncate">
                        {summary.revenue}
                      </div>
                      <div className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400">
                        {summary.revenueDelta} {pick('growth', 'বৃদ্ধি')}
                      </div>
                    </div>

                    <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-[#D7E2F3] dark:border-slate-800 transition-transform duration-200 hover:-translate-y-0.5">
                      <div className="flex items-center justify-between text-[9px] font-semibold text-[#5F6D82] dark:text-slate-400">
                        <span className="truncate">{pick('Total Expenses', 'মোট ব্যয়')}</span>
                        <ArrowDownRight className="w-3 h-3 text-[#0A63D8] dark:text-sky-400 shrink-0" />
                      </div>
                      <div className="text-xs sm:text-[13px] font-extrabold text-[#0B1730] dark:text-white mt-0.5 tabular-nums truncate">
                        {summary.expenses}
                      </div>
                      <div className="text-[9px] font-semibold text-[#5F6D82] dark:text-slate-400">
                        {summary.expenseRatio} {pick('of revenue', 'আয়ের অংশ')}
                      </div>
                    </div>

                    <div className="p-2 rounded-lg bg-[#0345A4] text-white border border-[#02377F] transition-transform duration-200 hover:-translate-y-0.5">
                      <div className="flex items-center justify-between text-[9px] font-semibold text-sky-100">
                        <span className="truncate">{pick('Net Profit', 'নিট মুনাফা')}</span>
                        <ArrowUpRight className="w-3 h-3 text-sky-200 shrink-0" />
                      </div>
                      <div className="text-xs sm:text-[13px] font-extrabold text-white mt-0.5 tabular-nums truncate">
                        {summary.netProfit}
                      </div>
                      <div className="text-[9px] font-bold text-sky-200">
                        {summary.profitMargin} {pick('margin', 'মার্জিন')}
                      </div>
                    </div>

                    <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-[#D7E2F3] dark:border-slate-800 transition-transform duration-200 hover:-translate-y-0.5">
                      <div className="flex items-center justify-between text-[9px] font-semibold text-[#5F6D82] dark:text-slate-400">
                        <span className="truncate">{pick('Cash & Bank', 'নগদ ও ব্যাংক')}</span>
                        <Wallet className="w-3 h-3 text-[#0345A4] dark:text-sky-400 shrink-0" />
                      </div>
                      <div className="text-xs sm:text-[13px] font-extrabold text-[#0B1730] dark:text-white mt-0.5 tabular-nums truncate">
                        {summary.cashBank}
                      </div>
                      <div className="text-[9px] font-semibold text-[#0A63D8] dark:text-sky-400 truncate">
                        {summary.cashSplit}
                      </div>
                    </div>
                  </div>

                  {screenView === 'overview' ? (
                    <>
                      {/* Middle Row: Performance Chart + Sales/Purchase/Inventory */}
                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
                        {/* Financial Performance Chart */}
                        <div className="sm:col-span-7 p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-[#D7E2F3] dark:border-slate-800 flex flex-col justify-between">
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <div className="flex items-center gap-1.5">
                              <BarChart3 className="w-3.5 h-3.5 text-[#0345A4] dark:text-sky-400" />
                              <span className="text-[10px] font-bold text-[#0B1730] dark:text-white">
                                {pick('Financial Performance', 'আর্থিক কর্মদক্ষতা')}
                              </span>
                            </div>
                            <span className="text-[9px] font-bold text-[#0345A4] dark:text-sky-400 tabular-nums">
                              {pick(focusedMonth.monthEn, focusedMonth.monthBn)}: {focusedMonth.revLabel}
                            </span>
                          </div>

                          {/* Interactive Animated Bars */}
                          <div className="h-[74px] flex items-end justify-between gap-1.5 pt-2 px-0.5 border-b border-[#D7E2F3]/80 dark:border-slate-800">
                            {chartData.map((bar, idx) => {
                              const isSelected = idx === selectedBarIndex;
                              return (
                                <button
                                  key={`${period}-${bar.monthEn}`}
                                  type="button"
                                  onClick={() => setSelectedBarIndex(idx)}
                                  onMouseEnter={() => setSelectedBarIndex(idx)}
                                  className="flex-1 h-full flex flex-col justify-end items-center gap-1 group cursor-pointer focus:outline-none"
                                  aria-label={`${bar.monthEn} ${bar.revLabel}`}
                                >
                                  <div className="w-full h-full flex items-end justify-center gap-0.5">
                                    <div
                                      className={`animate-chart-rise w-2 sm:w-2.5 rounded-t transition-colors ${
                                        isSelected
                                          ? 'bg-[#0345A4] dark:bg-sky-400'
                                          : 'bg-[#0A63D8]/70 dark:bg-sky-500/65 group-hover:bg-[#0345A4]'
                                      }`}
                                      style={{
                                        height: `${bar.revenue}%`,
                                        animationDelay: `${0.35 + idx * 0.06}s`,
                                      }}
                                    />
                                    <div
                                      className="animate-chart-rise w-1.5 sm:w-2 rounded-t bg-[#BFDBFE] dark:bg-slate-700"
                                      style={{
                                        height: `${bar.expense}%`,
                                        animationDelay: `${0.42 + idx * 0.06}s`,
                                      }}
                                    />
                                  </div>
                                </button>
                              );
                            })}
                          </div>

                          <div className="flex items-center justify-between pt-1 text-[8px] font-semibold text-[#5F6D82] dark:text-slate-400">
                            {chartData.map((bar, idx) => (
                              <span
                                key={bar.monthEn}
                                className={`flex-1 text-center ${
                                  idx === selectedBarIndex
                                    ? 'text-[#0345A4] dark:text-sky-400 font-bold'
                                    : ''
                                }`}
                              >
                                {pick(bar.monthEn, bar.monthBn)}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Sales, Purchase & Inventory Summaries */}
                        <div className="sm:col-span-5 space-y-1.5">
                          <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-[#D7E2F3] dark:border-slate-800 flex items-center justify-between gap-2">
                            <div className="min-w-0">
                              <div className="flex items-center gap-1 text-[9px] font-bold text-[#0345A4] dark:text-sky-400">
                                <ShoppingBag className="w-2.5 h-2.5 shrink-0" />
                                <span>{pick('Sales Overview', 'বিক্রয় সারসংক্ষেপ')}</span>
                              </div>
                              <div className="text-[9px] text-[#5F6D82] dark:text-slate-400 truncate mt-0.5">
                                {pick(summary.salesMetaEn, summary.salesMetaBn)}
                              </div>
                            </div>
                            <span className="text-[10px] font-extrabold text-[#0B1730] dark:text-white tabular-nums shrink-0">
                              {summary.salesVal}
                            </span>
                          </div>

                          <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-[#D7E2F3] dark:border-slate-800 flex items-center justify-between gap-2">
                            <div className="min-w-0">
                              <div className="flex items-center gap-1 text-[9px] font-bold text-[#0A63D8] dark:text-sky-400">
                                <Receipt className="w-2.5 h-2.5 shrink-0" />
                                <span>{pick('Purchase Overview', 'ক্রয় সারসংক্ষেপ')}</span>
                              </div>
                              <div className="text-[9px] text-[#5F6D82] dark:text-slate-400 truncate mt-0.5">
                                {pick(summary.purchaseMetaEn, summary.purchaseMetaBn)}
                              </div>
                            </div>
                            <span className="text-[10px] font-extrabold text-[#0B1730] dark:text-white tabular-nums shrink-0">
                              {summary.purchaseVal}
                            </span>
                          </div>

                          <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-[#D7E2F3] dark:border-slate-800 flex items-center justify-between gap-2">
                            <div className="min-w-0">
                              <div className="flex items-center gap-1 text-[9px] font-bold text-[#0345A4] dark:text-sky-400">
                                <Package className="w-2.5 h-2.5 shrink-0" />
                                <span>{pick('Inventory Summary', 'ইনভেন্টরি সারাংশ')}</span>
                              </div>
                              <div className="text-[9px] text-[#5F6D82] dark:text-slate-400 truncate mt-0.5">
                                {pick(summary.inventoryMetaEn, summary.inventoryMetaBn)}
                              </div>
                            </div>
                            <span className="text-[10px] font-extrabold text-[#0B1730] dark:text-white tabular-nums shrink-0">
                              {summary.inventoryCount}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Bottom Compact Recent Transactions Strip */}
                      <div className="rounded-xl bg-white dark:bg-slate-900 border border-[#D7E2F3] dark:border-slate-800 p-2 sm:p-2.5">
                        <div className="flex items-center justify-between text-[9px] font-bold text-[#5F6D82] dark:text-slate-400 uppercase tracking-wider mb-1.5">
                          <span>{pick('Recent Transactions', 'সাম্প্রতিক লেনদেনসমূহ')}</span>
                          <span className="text-[#0345A4] dark:text-sky-400">
                            {pick('Double-Entry Synced', 'ডাবল-এন্ট্রি সিঙ্কড')}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                          {transactions.slice(0, 2).map((tx) => (
                            <div
                              key={tx.id}
                              className="flex items-center justify-between gap-2 px-2 py-1.5 rounded-lg bg-[#F4F8FF]/80 dark:bg-slate-800/60 border border-[#D7E2F3]/70 dark:border-slate-700/60 text-[10px]"
                            >
                              <div className="min-w-0">
                                <span className="font-bold text-[#0B1730] dark:text-white truncate block">
                                  {tx.id} · {tx.party}
                                </span>
                                <span className="text-[9px] text-[#5F6D82] dark:text-slate-400 block">
                                  {tx.type}
                                </span>
                              </div>
                              <span
                                className={`font-mono font-bold tabular-nums shrink-0 ${
                                  tx.positive
                                    ? 'text-emerald-700 dark:text-emerald-400'
                                    : 'text-[#0B1730] dark:text-slate-200'
                                }`}
                              >
                                {tx.amount}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  ) : (
                    /* Full Recent Transactions Ledger Tab inside Laptop */
                    <div className="rounded-xl bg-white dark:bg-slate-900 border border-[#D7E2F3] dark:border-slate-800 p-2.5 space-y-1.5">
                      <div className="flex items-center justify-between text-[10px] font-bold text-[#0B1730] dark:text-white pb-1 border-b border-[#D7E2F3] dark:border-slate-800">
                        <span>{pick('General Ledger & Voucher Feed', 'জেনারেল লেজার ও ভাউচার ফিড')}</span>
                        <span className="text-[9px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          {pick('Balanced', 'সমন্বিত')}
                        </span>
                      </div>
                      <div className="space-y-1.5">
                        {transactions.map((tx) => (
                          <div
                            key={tx.id}
                            className="flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-lg bg-[#F4F8FF]/70 dark:bg-slate-800/60 hover:bg-[#EBF2FF] dark:hover:bg-slate-800 border border-[#D7E2F3]/70 dark:border-slate-700/60 text-[10px] transition-colors"
                          >
                            <div className="min-w-0">
                              <span className="font-bold text-[#0B1730] dark:text-white truncate block">
                                {tx.id} — {tx.party}
                              </span>
                              <span className="text-[9px] text-[#5F6D82] dark:text-slate-400 block">
                                {tx.type}
                              </span>
                            </div>
                            <span
                              className={`font-mono font-bold tabular-nums shrink-0 ${
                                tx.positive
                                  ? 'text-emerald-700 dark:text-emerald-400'
                                  : 'text-[#0B1730] dark:text-slate-200'
                              }`}
                            >
                              {tx.amount}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Laptop Hinge & Metallic Base Deck */}
            <div className="relative mx-auto w-[103%] -ml-[1.5%] h-3 sm:h-3.5 rounded-b-xl bg-gradient-to-b from-slate-300 via-slate-400 to-slate-500 dark:from-slate-600 dark:via-slate-700 dark:to-slate-800 shadow-[0_14px_26px_-8px_rgba(2,55,127,0.35)] border-t border-white/60 dark:border-slate-500/40 flex items-start justify-center">
              {/* Centered Laptop Thumb Notch */}
              <div className="w-16 sm:w-20 h-1 rounded-b-md bg-slate-500/70 dark:bg-slate-900/80" />
            </div>
          </div>
        </div>
      </div>

      {/* ==================== FOREGROUND RIGHT 3D SMARTPHONE ==================== */}
      <div
        ref={phoneMotionRef}
        className="relative sm:absolute sm:right-0 sm:-bottom-2 lg:right-0 lg:-bottom-4 z-20 mt-5 sm:mt-0 w-[235px] sm:w-[190px] md:w-[205px] mx-auto sm:mx-0"
      >
        <div className="animate-phone-enter">
          <div className="animate-float-phone">
            {/* Realistic Smartphone Outer Bezel */}
            <div className="relative rounded-[28px] bg-gradient-to-b from-slate-800 via-slate-900 to-slate-950 p-2 shadow-[0_24px_44px_-10px_rgba(2,55,127,0.45)] dark:shadow-[0_26px_48px_-10px_rgba(0,0,0,0.85)] border border-slate-600/80 ring-1 ring-white/15">
              {/* Side Hardware Power Button Accent */}
              <div
                aria-hidden="true"
                className="hidden sm:block absolute -right-[3px] top-20 w-[2px] h-9 rounded-r bg-slate-500"
              />

              {/* Smartphone Inner Screen */}
              <div className="relative rounded-[21px] overflow-hidden bg-[#F4F8FF] dark:bg-slate-950 border border-slate-800/70 text-[#0B1730] dark:text-slate-100">
                {/* Screen Wake Overlay */}
                <div
                  aria-hidden="true"
                  className="animate-screen-wake pointer-events-none absolute inset-0 z-30 bg-[#04132C]"
                />

                {/* Glass Reflection */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-br from-white/[0.12] via-transparent to-transparent"
                />

                {/* Top Dynamic Notch + Mobile Header */}
                <div className="bg-[#02377F] text-white px-3 pt-1.5 pb-2.5 space-y-2">
                  <div className="w-14 h-2.5 mx-auto rounded-full bg-slate-950/90 border border-white/10" aria-hidden="true" />
                  <div className="flex items-center justify-between gap-1.5">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <BrandLogo variant="mark" size="sm" themeMode="dark" className="scale-[0.65] -ml-1.5 shrink-0" />
                      <div className="min-w-0 -ml-1">
                        <div className="text-[10px] font-extrabold text-white leading-tight truncate">
                          TecHisab App
                        </div>
                        <div className="text-[8px] font-bangla text-sky-200 leading-tight truncate">
                          কাজকে সহজ করুন
                        </div>
                      </div>
                    </div>
                    <span className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-white/15 text-sky-100 shrink-0">
                      {period === 'monthly' ? pick('Nov', 'নভে') : pick('Q3', 'কিউ৩')}
                    </span>
                  </div>
                </div>

                {/* Smartphone Screen Content */}
                <div className="p-2.5 space-y-2">
                  {/* Mobile Sales Card */}
                  <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-[#D7E2F3] dark:border-slate-800">
                    <div className="flex items-center justify-between text-[8px] font-semibold text-[#5F6D82] dark:text-slate-400">
                      <span>{pick("Today's Sales", 'আজকের বিক্রয়')}</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold">+18.4%</span>
                    </div>
                    <div className="text-sm font-extrabold text-[#0B1730] dark:text-white mt-0.5 tabular-nums">
                      ৳ 1,85,400
                    </div>
                  </div>

                  {/* Income & Expenses Row */}
                  <div className="grid grid-cols-2 gap-1.5">
                    <div className="p-1.5 rounded-lg bg-[#EBF3FF] dark:bg-slate-900 border border-[#D7E2F3] dark:border-slate-800">
                      <span className="text-[8px] font-semibold text-[#0345A4] dark:text-sky-400 block">
                        {pick('Income', 'আয়')}
                      </span>
                      <span className="text-[11px] font-extrabold text-[#0B1730] dark:text-white tabular-nums">
                        {period === 'monthly' ? '৳ 24.85L' : '৳ 72.4L'}
                      </span>
                    </div>
                    <div className="p-1.5 rounded-lg bg-white dark:bg-slate-900 border border-[#D7E2F3] dark:border-slate-800">
                      <span className="text-[8px] font-semibold text-[#5F6D82] dark:text-slate-400 block">
                        {pick('Expenses', 'ব্যয়')}
                      </span>
                      <span className="text-[11px] font-extrabold text-[#0B1730] dark:text-white tabular-nums">
                        {period === 'monthly' ? '৳ 16.42L' : '৳ 47.2L'}
                      </span>
                    </div>
                  </div>

                  {/* Compact Mobile Cash Trend Bars */}
                  <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-[#D7E2F3] dark:border-slate-800">
                    <div className="flex items-center justify-between text-[8px] font-bold text-[#5F6D82] dark:text-slate-400 mb-1.5">
                      <span>{pick('7-Day Cash Flow', '৭-দিনের ক্যাশ ফ্লো')}</span>
                      <span className="text-[#0345A4] dark:text-sky-400 tabular-nums">
                        {summary.cashBank}
                      </span>
                    </div>
                    <div className="h-7 flex items-end gap-1">
                      {[48, 65, 58, 78, 72, 88, 95].map((h, i) => (
                        <div
                          key={i}
                          className={`animate-chart-rise flex-1 rounded-t ${
                            i === 6
                              ? 'bg-[#0345A4] dark:bg-sky-400'
                              : 'bg-[#0A63D8]/55 dark:bg-sky-500/50'
                          }`}
                          style={{ height: `${h}%`, animationDelay: `${0.5 + i * 0.05}s` }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Animated Business Notification Card */}
                  <button
                    type="button"
                    onClick={() => setActiveAlertIndex((prev) => (prev + 1) % phoneAlerts.length)}
                    className="w-full text-left p-2 rounded-xl bg-white dark:bg-slate-900 border border-[#D7E2F3] dark:border-slate-800 hover:border-[#0A63D8] transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-1.5 text-[8px] font-bold uppercase tracking-wider text-[#5F6D82] dark:text-slate-400">
                      <Bell className="w-2.5 h-2.5 text-[#0345A4] dark:text-sky-400" />
                      <span>{pick('Alert', 'বার্তা')}</span>
                    </div>
                    <div className={`text-[10px] font-bold mt-0.5 truncate ${phoneAlerts[activeAlertIndex].tone}`}>
                      {phoneAlerts[activeAlertIndex].title}
                    </div>
                    <div className="text-[9px] text-[#5F6D82] dark:text-slate-400 truncate">
                      {phoneAlerts[activeAlertIndex].sub}
                    </div>
                  </button>

                  {/* Bottom Home Gesture Bar */}
                  <div className="pt-1 flex justify-center" aria-hidden="true">
                    <div className="w-12 h-1 rounded-full bg-slate-300 dark:bg-slate-700" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

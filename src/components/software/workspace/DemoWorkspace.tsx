import React, { useState } from 'react';
import {
  RotateCcw,
  Printer,
  Bell,
  Menu,
  X,
  ArrowRight,
  Info,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';

export interface DemoModuleTab {
  id: string;
  label: string;
  icon: React.ElementType;
  badge?: string | number;
}

export interface DemoNotification {
  id: string;
  title: string;
  detail: string;
  type?: 'info' | 'warning' | 'success';
}

interface DemoWorkspaceProps {
  productName: string;
  productSubtitle: string;
  modules: DemoModuleTab[];
  activeModule: string;
  onSelectModule: (moduleId: string) => void;
  onResetDemo: () => void;
  onPrintReport?: () => void;
  onRequestOnboarding?: () => void;
  notifications?: DemoNotification[];
  bannerMessage?: string | null;
  onClearBanner?: () => void;
  headerExtras?: React.ReactNode;
  children: React.ReactNode;
}

export const DemoWorkspace: React.FC<DemoWorkspaceProps> = ({
  productName,
  productSubtitle,
  modules,
  activeModule,
  onSelectModule,
  onResetDemo,
  onPrintReport,
  onRequestOnboarding,
  notifications = [],
  bannerMessage,
  onClearBanner,
  headerExtras,
  children,
}) => {
  const { pick } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const activeModuleObj = modules.find((m) => m.id === activeModule) || modules[0];

  return (
    <div className="rounded-2xl bg-white dark:bg-slate-900 border border-[#D7E2F3] dark:border-slate-800 shadow-lg overflow-hidden">
      {/* Persistent Top Simulation Bar */}
      <div className="bg-[#02377F] text-white px-4 sm:px-5 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="lg:hidden p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white cursor-pointer"
            aria-label={pick('Toggle module navigation', 'মডিউল নেভিগেশন পরিবর্তন করুন')}
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-sm sm:text-base font-extrabold tracking-tight truncate">
                {productName}
              </h3>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-sky-400/20 text-sky-100 border border-sky-300/30">
                {pick('DEMO MODE — Sample Data Only', 'ডেমো মোড — শুধুমাত্র নমুনা ডেটা')}
              </span>
            </div>
            <p className="text-[11px] text-sky-100/80 truncate">{productSubtitle}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {headerExtras}

          {notifications.length > 0 && (
            <div className="relative">
              <button
                type="button"
                onClick={() => setNotifOpen((prev) => !prev)}
                className="relative p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                title={pick('Sample alerts', 'নমুনা সতর্কবার্তা')}
                aria-label={pick('Sample alerts', 'নমুনা সতর্কবার্তা')}
              >
                <Bell className="w-4 h-4" />
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-400 text-[#0B1730] text-[10px] font-extrabold flex items-center justify-center">
                  {notifications.length}
                </span>
              </button>

              {notifOpen && (
                <div className="absolute right-0 mt-2 w-72 rounded-xl bg-white dark:bg-slate-900 border border-[#D7E2F3] dark:border-slate-700 shadow-xl z-30 p-3 text-[#0B1730] dark:text-slate-100 space-y-2">
                  <div className="flex items-center justify-between pb-1.5 border-b border-[#D7E2F3] dark:border-slate-800">
                    <span className="text-xs font-bold">
                      {pick('Sample Notifications', 'নমুনা নোটিফিকেশন')}
                    </span>
                    <button
                      type="button"
                      onClick={() => setNotifOpen(false)}
                      className="text-[#5F6D82] hover:text-[#0B1730] cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        className="p-2.5 rounded-lg bg-[#F4F8FF] dark:bg-slate-800 text-xs space-y-0.5"
                      >
                        <div className="font-bold flex items-center gap-1.5">
                          {n.type === 'warning' ? (
                            <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                          ) : n.type === 'success' ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          ) : (
                            <Info className="w-3.5 h-3.5 text-[#0345A4] shrink-0" />
                          )}
                          <span>{n.title}</span>
                        </div>
                        <p className="text-[11px] text-[#5F6D82] dark:text-slate-400">
                          {n.detail}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {onPrintReport && (
            <button
              type="button"
              onClick={onPrintReport}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{pick('Print Sample', 'নমুনা প্রিন্ট')}</span>
            </button>
          )}

          <button
            type="button"
            onClick={onResetDemo}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{pick('Reset Demo', 'ডেমো রিসেট করুন')}</span>
          </button>

          {onRequestOnboarding && (
            <button
              type="button"
              onClick={onRequestOnboarding}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white text-[#02377F] hover:bg-sky-50 text-xs font-bold transition-colors cursor-pointer"
            >
              <span className="hidden md:inline">{pick('Request Live Setup', 'লাইভ সেটআপ অনুরোধ')}</span>
              <span className="md:hidden">{pick('Contact', 'যোগাযোগ')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Explicit Simulated Data Disclaimer Strip */}
      <div className="px-4 sm:px-5 py-2 bg-[#F4F8FF] dark:bg-slate-950/60 border-b border-[#D7E2F3] dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#5F6D82] dark:text-slate-400">
        <span>
          <strong className="text-[#0345A4] dark:text-sky-400">
            {pick('DEMO MODE — ALL DATA IS SIMULATED:', 'ডেমো মোড — সকল ডেটা সিমুলেটেড:')}
          </strong>{' '}
          {pick(
            'Interactive local browser sandbox. Changes are temporary and never touch production servers.',
            'ইন্টারেক্টিভ লোকাল ব্রাউজার স্যান্ডবক্স। পরিবর্তনসমূহ সাময়িক এবং কখনোই প্রোডাকশন সার্ভারে যায় না।'
          )}
        </span>
        <span className="font-semibold text-[#0B1730] dark:text-slate-300">
          {pick('Active Module:', 'সক্রিয় মডিউল:')} {activeModuleObj?.label}
        </span>
      </div>

      {/* Action Feedback Banner */}
      {bannerMessage && (
        <div className="px-4 sm:px-5 py-2.5 bg-emerald-50 dark:bg-emerald-950/40 border-b border-emerald-200 dark:border-emerald-900 flex items-center justify-between gap-2 text-xs text-emerald-800 dark:text-emerald-300">
          <div className="flex items-center gap-2 font-medium">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{bannerMessage}</span>
          </div>
          {onClearBanner && (
            <button
              type="button"
              onClick={onClearBanner}
              className="text-emerald-700 hover:text-emerald-900 cursor-pointer"
              aria-label={pick('Dismiss notification', 'নোটিফিকেশন বন্ধ করুন')}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      {/* Main Split Body */}
      <div className="flex flex-col lg:flex-row min-h-[600px]">
        {/* Mobile Module Strip / Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden p-3 bg-[#F4F8FF] dark:bg-slate-950 border-b border-[#D7E2F3] dark:border-slate-800 grid grid-cols-2 sm:grid-cols-3 gap-1.5">
            {modules.map((mod) => {
              const Icon = mod.icon;
              const isActive = mod.id === activeModule;
              return (
                <button
                  key={mod.id}
                  type="button"
                  onClick={() => {
                    onSelectModule(mod.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-[#0345A4] text-white'
                      : 'bg-white dark:bg-slate-900 text-[#0B1730] dark:text-slate-300 border border-[#D7E2F3] dark:border-slate-800'
                  }`}
                >
                  <span className="flex items-center gap-2 truncate">
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{mod.label}</span>
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* Quick Mobile Horizontal Tabs when drawer is closed */}
        <div className="lg:hidden px-3 py-2 bg-white dark:bg-slate-900 border-b border-[#D7E2F3] dark:border-slate-800 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {modules.map((mod) => {
            const isActive = mod.id === activeModule;
            return (
              <button
                key={`mob-${mod.id}`}
                type="button"
                onClick={() => onSelectModule(mod.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer shrink-0 ${
                  isActive
                    ? 'bg-[#0345A4] text-white'
                    : 'bg-[#F4F8FF] dark:bg-slate-800 text-[#5F6D82] dark:text-slate-300'
                }`}
              >
                {mod.label}
              </button>
            );
          })}
        </div>

        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex lg:w-60 xl:w-64 shrink-0 flex-col bg-[#F4F8FF]/70 dark:bg-slate-950/40 border-r border-[#D7E2F3] dark:border-slate-800 p-3 space-y-1">
          <div className="px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#5F6D82] dark:text-slate-500">
            {pick('Workspace Modules', 'ওয়ার্কস্পেস মডিউলসমূহ')}
          </div>
          {modules.map((mod) => {
            const Icon = mod.icon;
            const isActive = mod.id === activeModule;
            return (
              <button
                key={mod.id}
                type="button"
                onClick={() => onSelectModule(mod.id)}
                className={`w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#0345A4] text-white shadow-xs'
                    : 'text-[#0B1730] dark:text-slate-300 hover:bg-white dark:hover:bg-slate-900 hover:text-[#0345A4]'
                }`}
              >
                <span className="flex items-center gap-2.5 truncate">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{mod.label}</span>
                </span>
                {mod.badge !== undefined && (
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-white dark:bg-slate-800 text-[#5F6D82] dark:text-slate-400 border border-[#D7E2F3] dark:border-slate-700'
                    }`}
                  >
                    {mod.badge}
                  </span>
                )}
              </button>
            );
          })}
        </aside>

        {/* Active Module Content Canvas */}
        <div className="flex-1 min-w-0 p-4 sm:p-6 bg-[#F4F8FF]/30 dark:bg-slate-950/20 space-y-5">
          {children}
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { NavigationTab } from '../../types';
import { ArrowRight, Home, Briefcase, PhoneCall } from 'lucide-react';

interface NotFoundViewProps {
  onNavigate: (tab: NavigationTab) => void;
}

export const NotFoundView: React.FC<NotFoundViewProps> = ({ onNavigate }) => {
  const { pick } = useLanguage();

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, tab: NavigationTab) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    onNavigate(tab);
  };

  return (
    <section className="py-20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center bg-white dark:bg-slate-900 rounded-2xl border border-[#D7E2F3] dark:border-slate-800 p-8 sm:p-12 shadow-xs space-y-6">
        <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#0A63D8] dark:text-sky-400 font-mono">
          404 &bull; {pick('Page Not Found', 'পৃষ্ঠাটি পাওয়া যায়নি')}
        </p>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0B1730] dark:text-white tracking-tight">
          {pick(
            'The Page You Requested Could Not Be Found',
            'আপনার কাঙ্ক্ষিত পৃষ্ঠাটি খুঁজে পাওয়া যায়নি'
          )}
        </h1>

        <p className="text-sm sm:text-base text-[#5F6D82] dark:text-slate-300 leading-relaxed">
          {pick(
            'The URL may have moved or been mistyped. Return to our homepage or browse our accounting, tax, software, and training pages below.',
            'লিঙ্কটি পরিবর্তিত বা ভুল হতে পারে। অনুগ্রহ করে হোমপেজে ফিরে যান অথবা নিচের সেবাসমূহ থেকে আপনার প্রয়োজনীয় পেজ নির্বাচন করুন।'
          )}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <a
            href="/"
            onClick={(e) => handleLinkClick(e, 'home')}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#0345A4] hover:bg-[#02377F] text-white text-xs sm:text-sm font-bold transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>{pick('Return Home', 'হোমপেজে ফিরে যান')}</span>
          </a>

          <a
            href="/services"
            onClick={(e) => handleLinkClick(e, 'services')}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#F4F8FF] dark:bg-slate-800 text-[#0345A4] dark:text-sky-400 border border-[#D7E2F3] dark:border-slate-700 hover:border-[#0345A4] text-xs sm:text-sm font-bold transition-colors"
          >
            <Briefcase className="w-4 h-4" />
            <span>{pick('Explore Services', 'সেবাসমূহ দেখুন')}</span>
          </a>

          <a
            href="/contact"
            onClick={(e) => handleLinkClick(e, 'contact')}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white dark:bg-slate-900 text-[#0B1730] dark:text-slate-200 border border-[#D7E2F3] dark:border-slate-700 hover:border-[#0345A4] text-xs sm:text-sm font-bold transition-colors"
          >
            <PhoneCall className="w-4 h-4 text-[#0345A4]" />
            <span>{pick('Contact Us', 'যোগাযোগ করুন')}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </section>
  );
};

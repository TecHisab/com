import React from 'react';
import { ArrowRight, Layers, Monitor, CheckCircle2 } from 'lucide-react';
import { SITE_CONFIG } from '../../data/siteData';
import { ScrollReveal } from '../common/ScrollReveal';
import { InteractiveAuroraMesh } from '../common/InteractiveAuroraMesh';
import { HeroDeviceShowcase } from './HeroDeviceShowcase';
import { useLanguage } from '../../context/LanguageContext';

interface HeroSectionProps {
  onGetStarted: () => void;
  onExploreServices: () => void;
  onExploreSoftware: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onGetStarted,
  onExploreServices,
  onExploreSoftware,
}) => {
  const { pick } = useLanguage();

  return (
    <section
      className="relative pt-10 pb-16 lg:pt-14 lg:pb-20 overflow-hidden bg-gradient-to-b from-white/50 via-[#F4F8FF]/30 to-transparent dark:from-slate-950/55 dark:via-slate-950/35 dark:to-transparent border-b border-[#D7E2F3] dark:border-slate-800"
      aria-label="TecHisab Hero"
    >
      <InteractiveAuroraMesh />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Left Column: Positioning, Headline, Permanent Tagline & CTAs */}
          <ScrollReveal direction="left" duration={0.55} className="lg:col-span-5 space-y-6 text-left">
            <div className="space-y-3">
              <p className="text-xs font-extrabold tracking-[0.14em] uppercase text-[#0A63D8] dark:text-sky-400">
                {pick(
                  'ITES & FINTEC | ACCOUNTING | FINANCE | TECHNOLOGY',
                  'আইটিইএস ও ফিনটেক | অ্যাকাউন্টিং | ফাইন্যান্স | টেকনোলজি'
                )}
              </p>

              <h1 className="text-3xl sm:text-4xl lg:text-[2.85rem] font-extrabold text-[#0B1730] dark:text-white tracking-tight leading-[1.15]">
                {pick(
                  'Smart Accounting, Finance & Technology Solutions for Growing Businesses.',
                  'ক্রমবর্ধমান ব্যবসার জন্য স্মার্ট অ্যাকাউন্টিং, ফাইন্যান্স ও প্রযুক্তি সমাধান।'
                )}
              </h1>
            </div>

            <p className="text-base sm:text-[17px] text-[#5F6D82] dark:text-slate-300 leading-relaxed max-w-2xl">
              {pick(
                'TecHisab combines professional accounting, financial management, tax and VAT support, business process outsourcing and modern technology solutions to help businesses simplify operations, improve accuracy and make better decisions.',
                'টেকহিসাব পেশাদার হিসাববিজ্ঞান, আর্থিক ব্যবস্থাপনা, আয়কর ও ভ্যাট সহায়তা, বিজনেস প্রসেস আউটসোর্সিং এবং আধুনিক প্রযুক্তি সমাধান একত্রে প্রদান করে—যাতে ব্যবসাগুলো কার্যক্রম সহজ করতে, নির্ভুলতা বাড়াতে এবং সঠিক সিদ্ধান্ত নিতে পারে।'
              )}
            </p>

            {/* Permanent Bengali & English Tagline */}
            <div className="inline-flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-[#D7E2F3] dark:border-slate-800 shadow-xs">
              <span className="font-bangla text-base sm:text-lg font-bold text-[#0345A4] dark:text-sky-400">
                {SITE_CONFIG.banglaTagline}
              </span>
              <span className="text-[#D7E2F3] dark:text-slate-700">|</span>
              <span className="text-xs sm:text-sm font-semibold text-[#5F6D82] dark:text-slate-300">
                {SITE_CONFIG.englishTagline}
              </span>
            </div>

            {/* Key Value Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 text-xs text-[#0B1730] dark:text-slate-200 font-semibold">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#0345A4] dark:text-sky-400 shrink-0" />
                <span>{pick('Accounting & MIS Rigor', 'অ্যাকাউন্টিং ও এমআইএস নির্ভুলতা')}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#0345A4] dark:text-sky-400 shrink-0" />
                <span>{pick('Tax & VAT Support', 'ট্যাক্স ও ভ্যাট সহায়তা')}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#0345A4] dark:text-sky-400 shrink-0" />
                <span>{pick('Business Software & ERP', 'বিজনেস সফটওয়্যার ও ইআরপি')}</span>
              </div>
            </div>

            {/* Phase 5.1 Primary Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                type="button"
                id="hero-explore-services-btn"
                onClick={onExploreServices}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#0345A4] hover:bg-[#02377F] text-white font-semibold text-sm shadow-sm transition-all cursor-pointer active:scale-98"
              >
                <Layers className="w-4 h-4" />
                <span>{pick('Explore Our Services', 'আমাদের সেবাসমূহ দেখুন')}</span>
              </button>

              <button
                type="button"
                id="hero-explore-software-btn"
                onClick={onExploreSoftware}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white dark:bg-slate-900 hover:bg-[#F4F8FF] dark:hover:bg-slate-800 text-[#0345A4] dark:text-sky-400 font-semibold text-sm border border-[#0345A4]/30 dark:border-slate-700 transition-all cursor-pointer active:scale-98"
              >
                <Monitor className="w-4 h-4" />
                <span>{pick('Explore Software', 'সফটওয়্যার দেখুন')}</span>
              </button>

              <button
                type="button"
                id="hero-request-consultation-btn"
                onClick={onGetStarted}
                className="inline-flex items-center justify-center gap-1.5 px-5 py-3 rounded-xl bg-[#F4F8FF] dark:bg-slate-800 hover:bg-[#D7E2F3]/60 dark:hover:bg-slate-700 text-[#0B1730] dark:text-white font-semibold text-sm border border-[#D7E2F3] dark:border-slate-700 transition-all cursor-pointer active:scale-98"
              >
                <span>{pick('Request a Consultation', 'পরামর্শের জন্য অনুরোধ করুন')}</span>
                <ArrowRight className="w-4 h-4 text-[#0345A4] dark:text-sky-400" />
              </button>
            </div>
          </ScrollReveal>

          {/* Right Column: Interactive 3D Laptop + Smartphone Software Showcase */}
          <div className="lg:col-span-7 relative">
            <HeroDeviceShowcase />
          </div>
        </div>
      </div>
    </section>
  );
};

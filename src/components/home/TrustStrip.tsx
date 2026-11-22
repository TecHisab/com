import React from 'react';
import { BookOpen, Receipt, Cpu, GraduationCap } from 'lucide-react';
import { getLocalizedSiteConfig } from '../../data/localizedData';
import { useLanguage } from '../../context/LanguageContext';

const ICON_MAP: Record<string, React.ElementType> = {
  BookOpen,
  Receipt,
  Cpu,
  GraduationCap,
};

export const TrustStrip: React.FC = () => {
  const { isBengali } = useLanguage();
  const siteConfig = getLocalizedSiteConfig(isBengali);

  return (
    <section className="py-10 bg-white/75 dark:bg-slate-900/60 border-b border-[#D7E2F3] dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {siteConfig.companyHighlights.map((item) => {
            const Icon = ICON_MAP[item.icon] || BookOpen;
            return (
              <div
                key={item.title}
                className="card-3d p-5 rounded-2xl bg-[#F4F8FF]/95 dark:bg-slate-950/85 border border-[#D7E2F3] dark:border-slate-800 hover:border-[#0345A4]/50 space-y-3"
              >
                <div className="w-10 h-10 rounded-xl bg-[#0345A4] text-white flex items-center justify-center shadow-xs">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-base font-bold text-[#0B1730] dark:text-white">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#5F6D82] dark:text-slate-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

import React, { useState } from 'react';
import {
  Calculator,
  Receipt,
  Users,
  BarChart3,
  Headset,
  Code2,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { SITE_CONFIG } from '../../data/siteData';
import { SectionHeading } from '../common/SectionHeading';
import { ThreeCpuCoreShowcase } from '../three/ThreeCpuCoreShowcase';
import { useLanguage } from '../../context/LanguageContext';

interface EcosystemDiagramProps {
  onExploreService?: (categoryId: string) => void;
}

export const EcosystemDiagram: React.FC<EcosystemDiagramProps> = ({ onExploreService }) => {
  const { pick } = useLanguage();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const solutions = [
    {
      id: 'accounting',
      title: pick('Accounting & Bookkeeping', 'অ্যাকাউন্টিং ও বুককিপিং'),
      desc: pick(
        'Daily transaction recording, general ledger maintenance, bank reconciliation, and monthly financial statements.',
        'দৈনন্দিন লেনদেন এন্ট্রি, জেনারেল লেজার সংরক্ষণ, ব্যাংক রিকনসিলিয়েশন এবং মাসিক আর্থিক বিবরণী।'
      ),
      icon: Calculator,
    },
    {
      id: 'tax',
      title: pick('Tax & VAT Support', 'ট্যাক্স ও ভ্যাট সহায়তা'),
      desc: pick(
        'Income tax preparation support, advance tax & TDS schedules, VAT Mushak documentation, and return preparation.',
        'আয়কর প্রস্তুতি সহায়তা, অগ্রিম কর ও টিডিএস সিডিউল, ভ্যাট মূসক নথিপত্র এবং রিটার্ন প্রস্তুতি।'
      ),
      icon: Receipt,
    },
    {
      id: 'payroll',
      title: pick('Payroll & Inventory', 'পেরোল ও ইনভেন্টরি'),
      desc: pick(
        'Salary sheet preparation, payslips, leave & PF/gratuity tracking, accounts payable/receivable, and stock control.',
        'বেতন শিট তৈরি, পে-স্লিপ, ছুটি ও পিএফ/গ্র্যাচুইটি ট্র্যাকিং, দেনা-পাওনা এবং স্টক নিয়ন্ত্রণ।'
      ),
      icon: Users,
    },
    {
      id: 'accounting',
      key: 'mis',
      title: pick('MIS & Financial Reporting', 'এমআইএস ও আর্থিক রিপোর্টিং'),
      desc: pick(
        'Management accounting, budget vs. actual variance tracking, cost analysis, and virtual CFO reporting packs.',
        'ম্যানেজমেন্ট অ্যাকাউন্টিং, বাজেট বনাম প্রকৃত বিশ্লেষণ, কস্ট অ্যানালাইসিস এবং ভার্চুয়াল সিএফও রিপোর্ট।'
      ),
      icon: BarChart3,
    },
    {
      id: 'bpo',
      title: pick('BPO & Back-Office', 'বিপিও ও ব্যাক-অফিস'),
      desc: pick(
        'Remote finance operations, invoice billing & reconciliation, document digitization, and ongoing administrative support.',
        'রিমোট ফাইন্যান্স অপারেশনস, ইনভয়েস বিলিং ও সমন্বয়, নথি ডিজিটাইজেশন এবং চলমান প্রশাসনিক সহায়তা।'
      ),
      icon: Headset,
    },
    {
      id: 'technology',
      title: pick('Software & Automation', 'সফটওয়্যার ও অটোমেশন'),
      desc: pick(
        'QuickBooks Online & Xero setup, Excel & Google Sheets automation, business websites, and custom software.',
        'কুইকবুকস অনলাইন ও জেরো সেটআপ, এক্সেল ও গুগল শিটস অটোমেশন, বিজনেস ওয়েবসাইট ও কাস্টম সফটওয়্যার।'
      ),
      icon: Code2,
    },
  ];

  return (
    <section className="py-12 space-y-10">
      <SectionHeading
        badge={pick('Unified Business Solutions', 'সমন্বিত ব্যবসায়িক সমাধান')}
        title={pick('One Partner for Accounting, Finance & Technology.', 'অ্যাকাউন্টিং, ফাইন্যান্স ও প্রযুক্তির জন্য একক অংশীদার।')}
        subtitle={pick(
          'From everyday bookkeeping to business automation and software development, TecHisab brings essential business services and technology solutions together.',
          'দৈনন্দিন বুককিপিং থেকে বিজনেস অটোমেশন ও সফটওয়্যার ডেভেলপমেন্ট পর্যন্ত—টেকহিসাব প্রয়োজনীয় ব্যবসায়িক সেবা ও প্রযুক্তি সমাধানকে একত্রিত করে।'
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {solutions.map((item, idx) => {
          const Icon = item.icon;
          return (
            <button
              key={item.key || item.id}
              type="button"
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
              onFocus={() => setHoveredIndex(idx)}
              onBlur={() => setHoveredIndex(null)}
              onClick={() => onExploreService?.(item.id)}
              className="card-3d text-left p-6 rounded-2xl bg-white dark:bg-slate-900 border border-[#D7E2F3] dark:border-slate-800 hover:border-[#0345A4] shadow-xs flex flex-col justify-between group cursor-pointer"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#F4F8FF] dark:bg-slate-800 text-[#0345A4] dark:text-sky-400 border border-[#D7E2F3] dark:border-slate-700 flex items-center justify-center group-hover:bg-[#0345A4] group-hover:text-white transition-colors">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-[#0B1730] dark:text-white group-hover:text-[#0345A4] dark:group-hover:text-sky-400 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#5F6D82] dark:text-slate-400 leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-[#D7E2F3]/70 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-[#0345A4] dark:text-sky-400">
                <span>{pick('View Service Scope', 'সেবার পরিধি দেখুন')}</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </div>
            </button>
          );
        })}
      </div>

      {/* Selective Deep-Blue Contrast Panel with Animated CPU Circuit Architecture */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#02285E] via-[#02377F] to-[#0345A4] text-white p-6 sm:p-8 shadow-lg border border-[#0A63D8]/30">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          <div className="lg:col-span-5 space-y-4">
            <div className="inline-flex items-center gap-2.5 text-sky-200 text-xs font-bold tracking-wide uppercase">
              <ShieldCheck className="w-4 h-4 text-sky-300 shrink-0" />
              <span>{pick('Connected FinTech Core', 'সংযুক্ত ফিনটেক কোর')}</span>
            </div>

            <h4 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight leading-snug">
              {pick(
                'Financial Mastery Combined with Software Engineering',
                'সফটওয়্যার ইঞ্জিনিয়ারিংয়ের সাথে আর্থিক দক্ষতার সমন্বয়'
              )}
            </h4>

            <p className="text-xs sm:text-sm text-sky-100/85 leading-relaxed">
              {pick(
                'One dedicated ITES & FINTEC partner handling ledgers, statutory compliance support, automated business software, and practical staff training through a unified architecture.',
                'একটি নিবেদিতপ্রাণ আইটিইএস ও ফিনটেক অংশীদার—যারা একীভূত প্রযুক্তির মাধ্যমে লেজার, কমপ্লায়েন্স সহায়তা, বিজনেস সফটওয়্যার ও স্টাফ প্রশিক্ষণ পরিচালনা করে।'
              )}
            </p>

            <div className="pt-1 flex flex-wrap items-center gap-3">
              <span className="px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white font-bangla font-semibold text-sm">
                {SITE_CONFIG.banglaTagline}
              </span>
              <button
                type="button"
                onClick={() => onExploreService?.('all')}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white text-[#02377F] hover:bg-sky-50 text-xs font-bold transition-colors cursor-pointer"
              >
                <span>{pick('Explore Architecture', 'সেবাসমূহ দেখুন')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-7">
            <ThreeCpuCoreShowcase
              activeChannel={hoveredIndex}
              onSelectChannel={(idx) => {
                const target = solutions[idx];
                if (target) onExploreService?.(target.id);
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

import React from 'react';
import { CheckCircle2, Shield, Zap, BarChart3, Clock, Database } from 'lucide-react';
import { SectionHeading } from '../common/SectionHeading';
import { useLanguage } from '../../context/LanguageContext';

export const BusinessBenefits: React.FC = () => {
  const { pick } = useLanguage();

  const benefits = [
    {
      category: pick('Double-Entry Accuracy', 'ডাবল-এন্ট্রি নির্ভুলতা'),
      title: pick('Clean, Reconciled Ledgers', 'পরিচ্ছন্ন ও সমন্বিত লেজার'),
      desc: pick(
        'Structured voucher posting and regular bank reconciliation ensure your trial balance, profit & loss, and balance sheet stay reliable.',
        'সুসংগঠিত ভাউচার পোস্টিং ও নিয়মিত ব্যাংক রিকনসিলিয়েশন আপনার ট্রায়াল ব্যালেন্স, লাভ-ক্ষতি ও ব্যালেন্স শিটকে নির্ভরযোগ্য রাখে।'
      ),
      icon: CheckCircle2,
    },
    {
      category: pick('Tax & VAT Support', 'ট্যাক্স ও ভ্যাট সহায়তা'),
      title: pick('Organized Statutory Schedules', 'সুবিন্যস্ত বিধিবদ্ধ সিডিউল'),
      desc: pick(
        'Systematic preparation of income tax working papers, TDS records, and VAT Mushak documentation aligned with current regulations.',
        'প্রচলিত বিধিবিধান অনুযায়ী আয়কর ওয়ার্কিং পেপার, টিডিএস রেকর্ড ও ভ্যাট মূসক নথিপত্রের নিয়মতান্ত্রিক প্রস্তুতি।'
      ),
      icon: Shield,
    },
    {
      category: pick('Cost-Effective Model', 'ব্যয়-সাশ্রয়ী মডেল'),
      title: pick('Flexible Outsourcing Arrangements', 'নমনীয় আউটসোর্সিং কাঠামো'),
      desc: pick(
        'Scale bookkeeping, payroll, and MIS support to your actual monthly transaction volume without building heavy fixed overhead.',
        'ভারী স্থায়ী খরচ ছাড়াই আপনার মাসিক লেনদেনের পরিমাণ অনুযায়ী বুককিপিং, পেরোল ও এমআইএস সেবা নিন।'
      ),
      icon: Zap,
    },
    {
      category: pick('Management Clarity', 'ব্যবস্থাপনা স্পষ্টতা'),
      title: pick('Actionable MIS Reporting', 'কার্যকর এমআইএস রিপোর্টিং'),
      desc: pick(
        'Clear monthly statements, budget vs. actual variance reports, and cash-flow summaries for timely business decisions.',
        'সময়োপযোগী ব্যবসায়িক সিদ্ধান্তের জন্য স্পষ্ট মাসিক বিবরণী, বাজেট বনাম প্রকৃত প্রতিবেদন ও ক্যাশ-ফ্লো সারসংক্ষেপ।'
      ),
      icon: BarChart3,
    },
    {
      category: pick('Bangladesh Context', 'বাংলাদেশ প্রেক্ষাপট'),
      title: pick('Local Desk & Direct Communication', 'স্থানীয় ডেস্ক ও সরাসরি যোগাযোগ'),
      desc: pick(
        'Responsive local support from Chittagong via phone, WhatsApp, email, and scheduled in-person or online consultations.',
        'চট্টগ্রাম থেকে ফোন, হোয়াটসঅ্যাপ, ইমেইল এবং নির্ধারিত সরাসরি বা অনলাইন পরামর্শের মাধ্যমে দ্রুত স্থানীয় সহায়তা।'
      ),
      icon: Clock,
    },
    {
      category: pick('Integrated Stack', 'সমন্বিত প্রযুক্তি'),
      title: pick('Accounting Meets Automation', 'অ্যাকাউন্টিং ও অটোমেশনের মেলবন্ধন'),
      desc: pick(
        'Pair QuickBooks, Xero, Excel automation, or TecHisab business software directly with structured financial workflows.',
        'সুসংগঠিত আর্থিক ওয়ার্কফ্লোর সাথে কুইকবুকস, জেরো, এক্সেল অটোমেশন অথবা টেকহিসাব বিজনেস সফটওয়্যার সরাসরি যুক্ত করুন।'
      ),
      icon: Database,
    },
  ];

  return (
    <section className="py-16 bg-white/75 dark:bg-slate-900/60 border-y border-[#D7E2F3] dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge={pick('Practical Value', 'বাস্তব উপযোগিতা')}
          title={pick('How TecHisab Strengthens Business Operations', 'টেকহিসাব যেভাবে আপনার ব্যবসায়িক কার্যক্রমকে শক্তিশালী করে')}
          subtitle={pick(
            'Combining disciplined accounting workflows with modern spreadsheets, cloud tools, and custom software.',
            'আধুনিক স্প্রেডশিট, ক্লাউড টুলস এবং কাস্টম সফটওয়্যারের সাথে সুশৃঙ্খল অ্যাকাউন্টিং ওয়ার্কফ্লোর সমন্বয়।'
          )}
        />

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit, idx) => {
            const Icon = benefit.icon;
            return (
              <div
                key={idx}
                className="card-3d bg-[#F4F8FF]/90 dark:bg-slate-950/80 p-6 rounded-2xl border border-[#D7E2F3] dark:border-slate-800 hover:border-[#0345A4]/60 space-y-3"
              >
                <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-900 text-[#0345A4] dark:text-sky-400 border border-[#D7E2F3] dark:border-slate-700 flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </div>

                <div>
                  <span className="text-[11px] font-bold text-[#0A63D8] dark:text-sky-400 uppercase tracking-wider">
                    {benefit.category}
                  </span>
                  <h3 className="text-base font-bold text-[#0B1730] dark:text-white mt-1">
                    {benefit.title}
                  </h3>
                </div>

                <p className="text-xs sm:text-sm text-[#5F6D82] dark:text-slate-400 leading-relaxed">
                  {benefit.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

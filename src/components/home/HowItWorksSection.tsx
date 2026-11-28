import React from 'react';
import { Search, Sliders, RefreshCw, Award, CheckCircle2 } from 'lucide-react';
import { SectionHeading } from '../common/SectionHeading';
import { useLanguage } from '../../context/LanguageContext';

export const HowItWorksSection: React.FC = () => {
  const { pick } = useLanguage();

  const steps = [
    {
      step: '01',
      title: pick('Discovery & Scope Review', 'চাহিদা ও পরিধি পর্যালোচনা'),
      desc: pick(
        'We discuss your current accounting workflow, software tools, tax/VAT support requirements, or training goals to define a clear scope.',
        'সুস্পষ্ট কর্মপরিধি নির্ধারণে আমরা আপনার বর্তমান অ্যাকাউন্টিং প্রক্রিয়া, সফটওয়্যার টুলস, ট্যাক্স/ভ্যাট সহায়তা বা প্রশিক্ষণের লক্ষ্য নিয়ে আলোচনা করি।'
      ),
      icon: Search,
      highlight: pick('Clear Written Scope', 'সুস্পষ্ট লিখিত কর্মপরিধি'),
    },
    {
      step: '02',
      title: pick('System & Ledger Setup', 'সিস্টেম ও লেজার সেটআপ'),
      desc: pick(
        'We organize your chart of accounts, templates, cloud tools, or software modules aligned with your business category.',
        'আপনার ব্যবসার ধরন অনুযায়ী চার্ট অব অ্যাকাউন্টস, টেমপ্লেট, ক্লাউড টুলস বা সফটওয়্যার মডিউল সাজানো হয়।'
      ),
      icon: Sliders,
      highlight: pick('Tailored Configuration', 'চাহিদা অনুযায়ী কনফিগারেশন'),
    },
    {
      step: '03',
      title: pick('Consistent Execution', 'ধারাবাহিক ও নির্ভুল পরিচালনা'),
      desc: pick(
        'Transactions, payroll sheets, inventory logs, and statutory working papers are maintained on agreed monthly schedules.',
        'নির্ধারিত মাসিক সময়সূচি অনুযায়ী লেনদেন, বেতন শিট, ইনভেন্টরি লগ ও বিধিবদ্ধ ওয়ার্কিং পেপার পরিচালনা করা হয়।'
      ),
      icon: RefreshCw,
      highlight: pick('Structured Workflow', 'সুসংগঠিত কার্যপ্রণালী'),
    },
    {
      step: '04',
      title: pick('MIS Review & Decision Support', 'এমআইএস পর্যালোচনা ও পরামর্শ'),
      desc: pick(
        'Receive readable monthly financial reports, variance insights, and responsive advisory support as your business grows.',
        'আপনার ব্যবসার প্রবৃদ্ধির সাথে সাথে সহজবোধ্য মাসিক আর্থিক প্রতিবেদন, ভ্যারিয়েন্স বিশ্লেষণ ও দ্রুত পরামর্শ সহায়তা পান।'
      ),
      icon: Award,
      highlight: pick('Ongoing Reliability', 'নিরবচ্ছিন্ন নির্ভরযোগ্যতা'),
    },
  ];

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge={pick('Structured Process', 'সুসংগঠিত প্রক্রিয়া')}
          title={pick('How TecHisab Works With Your Organization', 'টেকহিসাব যেভাবে আপনার প্রতিষ্ঠানের সাথে কাজ করে')}
          subtitle={pick(
            'A transparent, step-by-step engagement process from initial consultation to steady monthly delivery.',
            'প্রাথমিক পরামর্শ থেকে শুরু করে নিয়মিত মাসিক সেবা প্রদান পর্যন্ত একটি স্বচ্ছ, ধাপে ধাপে পরিচালিত প্রক্রিয়া।'
          )}
        />

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="card-3d bg-white dark:bg-slate-900 p-6 rounded-2xl border border-[#D7E2F3] dark:border-slate-800 shadow-xs hover:border-[#0345A4]/60 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2.5 rounded-xl bg-[#F4F8FF] dark:bg-slate-800 text-[#0345A4] dark:text-sky-400 border border-[#D7E2F3] dark:border-slate-700">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-2xl font-black text-[#D7E2F3] dark:text-slate-700 tracking-tight">
                      {item.step}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-[#0B1730] dark:text-white leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#5F6D82] dark:text-slate-400 leading-relaxed mt-2">
                    {item.desc}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-[#D7E2F3]/70 dark:border-slate-800 flex items-center gap-1.5 text-xs font-semibold text-[#0345A4] dark:text-sky-400">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>{item.highlight}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

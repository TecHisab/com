import React, { useState } from 'react';
import { getLocalizedFaqs, getLocalizedSiteConfig } from '../../data/localizedData';
import { useLanguage } from '../../context/LanguageContext';
import { SectionHeading } from '../common/SectionHeading';
import { ChevronDown, CheckCircle2 } from 'lucide-react';

interface TestimonialsFaqProps {
  onOpenGetStarted?: () => void;
}

export const TestimonialsFaq: React.FC<TestimonialsFaqProps> = () => {
  const { isBengali, pick } = useLanguage();
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const siteConfig = getLocalizedSiteConfig(isBengali);
  const faqList = getLocalizedFaqs(isBengali);

  return (
    <section id="why-choose-and-faq" className="py-16 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Phase 5.6 & Phase 12: Genuine Why Choose TecHisab */}
        <div>
          <SectionHeading
            badge={pick('Why Choose TecHisab?', 'কেন টেকহিসাব বেছে নেবেন?')}
            title={pick('Built on Accounting Rigor, Clarity & Practical Technology', 'হিসাবের নির্ভুলতা, স্বচ্ছতা ও বাস্তবসম্মত প্রযুক্তির সমন্বয়ে নির্মিত')}
            subtitle={pick(
              'We focus on dependable execution, transparent scope, confidential client handling, and local business support in Bangladesh.',
              'আমরা নির্ভরযোগ্য সম্পাদন, স্বচ্ছ কর্মপরিধি, তথ্যের গোপনীয়তা এবং বাংলাদেশের ব্যবসায়িক বাস্তবতায় স্থানীয় সহায়তায় গুরুত্ব দিই।'
            )}
          />

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {siteConfig.whyChooseUs.map((item, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-[#D7E2F3] dark:border-slate-800 hover:border-[#0345A4]/50 shadow-xs transition-all space-y-2.5"
              >
                <div className="w-8 h-8 rounded-lg bg-[#F4F8FF] dark:bg-slate-800 text-[#0345A4] dark:text-sky-400 border border-[#D7E2F3] dark:border-slate-700 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <h3 className="text-sm sm:text-base font-bold text-[#0B1730] dark:text-white">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#5F6D82] dark:text-slate-400 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Interactive FAQ Accordion */}
        <div id="faq-section" className="pt-4">
          <SectionHeading
            badge={pick('Frequently Asked Questions', 'সাধারণ জিজ্ঞাসা')}
            title={pick('Clear Answers About Our Services, Software & Training', 'আমাদের সেবা, সফটওয়্যার ও প্রশিক্ষণ সম্পর্কে স্পষ্ট উত্তর')}
            subtitle={pick(
              'Everything you need to know before booking a consultation, testing a software demo, or enrolling in a batch.',
              'পরামর্শ বুক করা, সফটওয়্যার ডেমো পরীক্ষা করা বা কোনো ব্যাচে ভর্তি হওয়ার আগে আপনার প্রয়োজনীয় সকল তথ্য।'
            )}
          />

          <div className="mt-10 max-w-3xl mx-auto space-y-3">
            {faqList.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-xl border border-[#D7E2F3] dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    aria-expanded={isOpen}
                    className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 font-semibold text-sm sm:text-base text-[#0B1730] dark:text-white cursor-pointer hover:text-[#0345A4] dark:hover:text-sky-400 transition-colors"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-[#5F6D82] shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-[#0345A4] dark:text-sky-400' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-4 sm:px-5 pb-5 pt-2 text-xs sm:text-sm text-[#5F6D82] dark:text-slate-300 leading-relaxed border-t border-[#D7E2F3]/60 dark:border-slate-800">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

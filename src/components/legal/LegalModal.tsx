import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  ShieldCheck,
  FileText,
  Scale,
  RotateCcw,
  Lock,
  Printer,
  ExternalLink,
  Building2,
  AlertTriangle,
} from 'lucide-react';
import { getLocalizedSiteConfig } from '../../data/localizedData';
import { useLanguage } from '../../context/LanguageContext';

export type LegalDocType = 'privacy' | 'terms' | 'nbr' | 'refund' | 'security';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialDoc?: LegalDocType;
}

export const LegalModal: React.FC<LegalModalProps> = ({
  isOpen,
  onClose,
  initialDoc = 'privacy',
}) => {
  const { isBengali, pick } = useLanguage();
  const site = getLocalizedSiteConfig(isBengali);

  const [activeDoc, setActiveDoc] = useState<LegalDocType>(initialDoc);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (initialDoc) {
      setActiveDoc(initialDoc);
    }
  }, [initialDoc]);

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

  const handlePrint = () => {
    window.print();
  };

  const navItems: Array<{ id: LegalDocType; label: string; icon: React.ElementType }> = [
    { id: 'privacy', label: pick('Privacy Policy', 'গোপনীয়তা নীতি'), icon: Lock },
    { id: 'terms', label: pick('Terms of Service', 'সেবার শর্তাবলি'), icon: Scale },
    { id: 'nbr', label: pick('Tax Disclaimer', 'কর ঘোষণা'), icon: FileText },
    { id: 'refund', label: pick('Refund & Cancellation', 'রিফান্ড ও বাতিলকরণ'), icon: RotateCcw },
    { id: 'security', label: pick('Confidentiality & NDA', 'গোপনীয়তা ও এনডিএ'), icon: ShieldCheck },
  ];

  return (
    <div
      className="fixed inset-0 z-[150] flex items-center justify-center p-3 sm:p-6 bg-[#0B1730]/75 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="legal-modal-title"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-2xl border border-[#D7E2F3] dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 sm:p-6 border-b border-[#D7E2F3] dark:border-slate-800 bg-[#F4F8FF] dark:bg-slate-950/80 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0345A4]/10 border border-[#0345A4]/20 text-[#0345A4] dark:text-sky-400 flex items-center justify-center">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#5F6D82] block">
                {pick('TecHisab Governance & Disclaimers', 'টেকহিসাব সুশাসন ও বিধিবদ্ধ ঘোষণা')}
              </span>
              <h2 id="legal-modal-title" className="text-lg sm:text-xl font-bold text-[#0B1730] dark:text-white">
                {pick('Legal, Privacy & Statutory Terms', 'আইনগত, গোপনীয়তা ও বিধিবদ্ধ শর্তাবলি')}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              aria-label={pick('Print Document', 'নথি প্রিন্ট করুন')}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#D7E2F3] dark:border-slate-700 bg-white dark:bg-slate-800 text-[#0B1730] dark:text-slate-300 text-xs font-semibold hover:border-[#0345A4] transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{pick('Print', 'প্রিন্ট')}</span>
            </button>

            <button
              ref={closeBtnRef}
              type="button"
              onClick={onClose}
              aria-label={pick('Close legal modal', 'বন্ধ করুন')}
              className="p-2 rounded-xl text-[#5F6D82] hover:text-[#0B1730] dark:hover:text-slate-200 hover:bg-white dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-2 bg-[#F4F8FF]/70 dark:bg-slate-950/60 border-b border-[#D7E2F3] dark:border-slate-800 flex items-center gap-1.5 overflow-x-auto scrollbar-none px-4 sm:px-6">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeDoc === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveDoc(item.id)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-2 cursor-pointer ${
                  isActive
                    ? 'bg-[#0345A4] text-white shadow-xs'
                    : 'text-[#5F6D82] dark:text-slate-400 hover:text-[#0345A4] dark:hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        <div className="p-6 sm:p-8 overflow-y-auto space-y-5 text-[#5F6D82] dark:text-slate-300 text-xs sm:text-sm leading-relaxed">
          {activeDoc === 'privacy' && (
            <div className="space-y-4">
              <div className="border-b border-[#D7E2F3] dark:border-slate-800 pb-3">
                <h3 className="text-xl font-extrabold text-[#0B1730] dark:text-white">
                  {pick('Privacy & Client Data Protection Policy', 'গোপনীয়তা ও ক্লায়েন্ট ডেটা সুরক্ষা নীতি')}
                </h3>
                <p className="text-xs text-[#5F6D82] mt-1">
                  {pick(
                    'Effective 2026 • TecHisab ITES & FINTEC Services',
                    'কার্যকর ২০২৬ • টেকহিসাব আইটিইএস ও ফিনটেক সেবাসমূহ'
                  )}
                </p>
              </div>
              <p>
                {pick(
                  'TecHisab handles accounting ledgers, invoices, tax & VAT documentation, payroll sheets, and enrollment contact information strictly for delivering requested professional services, software onboarding, or training support.',
                  'টেকহিসাব অনুরোধকৃত পেশাদার সেবা, সফটওয়্যার অনবোর্ডিং অথবা প্রশিক্ষণ সহায়তা প্রদানের উদ্দেশ্যেই কেবল অ্যাকাউন্টিং লেজার, চালান, কর ও ভ্যাট নথি, পেরোল শিট এবং ভর্তির তথ্য ব্যবহার করে।'
                )}
              </p>
              <p>
                {pick(
                  `We never sell, rent, or distribute client business records, financial statements, customer lists, or supplier data to third-party brokers or advertisers. Client working files may be exported and deleted upon engagement completion by emailing ${site.contact.email}.`,
                  `আমরা কখনোই ক্লায়েন্টের ব্যবসায়িক নথি, আর্থিক বিবরণী বা গ্রাহক-সরবরাহকারী তালিকা কোনো তৃতীয় পক্ষ বা বিজ্ঞাপনদাতার কাছে বিক্রি বা হস্তান্তর করি না। চুক্তি শেষে ${site.contact.email} ঠিকানায় ইমেইল করে ওয়ার্কিং ফাইল এক্সপোর্ট ও অপসারণের অনুরোধ করা যাবে।`
                )}
              </p>
            </div>
          )}

          {activeDoc === 'terms' && (
            <div className="space-y-4">
              <div className="border-b border-[#D7E2F3] dark:border-slate-800 pb-3">
                <h3 className="text-xl font-extrabold text-[#0B1730] dark:text-white">
                  {pick('Terms of Service', 'সেবার শর্তাবলি')}
                </h3>
                <p className="text-xs text-[#5F6D82] mt-1">
                  {pick(
                    'Applicable to consulting retainers, business software packages, and training courses',
                    'কনসাল্টিং রিটেইনার, বিজনেস সফটওয়্যার প্যাকেজ এবং প্রশিক্ষণ কোর্সসমূহের ক্ষেত্রে প্রযোজ্য'
                  )}
                </p>
              </div>
              <p>
                {pick(
                  'Service engagements operate under written scope confirmation, agreed schedules, and transparent baseline quotations. Published pricing indicates starting benchmarks and is finalized after reviewing transaction volume and technical customization needs.',
                  'প্রতিটি সেবা লিখিত পরিধি নিশ্চিতকরণ, সম্মত সময়সূচি এবং স্বচ্ছ প্রারম্ভিক কোটেশনের অধীনে পরিচালিত হয়। প্রদর্শিত মূল্যসমূহ প্রাথমিক মানদণ্ড, যা লেনদেনের পরিমাণ ও প্রযুক্তিগত চাহিদা পর্যালোচনার পর চূড়ান্ত হয়।'
                )}
              </p>
              <p>
                {pick(
                  'Clients remain responsible for the completeness and authenticity of original source vouchers, invoices, and statutory documents submitted for processing, while retaining full ownership of their company records and reports.',
                  'প্রসেসিংয়ের জন্য জমা দেওয়া মূল ভাউচার, চালান ও বিধিবদ্ধ নথিপত্রের পূর্ণতা ও সঠিকতার দায়িত্ব ক্লায়েন্টের; আর প্রতিষ্ঠানের সকল হিসাব নথি ও রিপোর্টের পূর্ণ মালিকানা ক্লায়েন্টের নিজস্ব।'
                )}
              </p>
            </div>
          )}

          {activeDoc === 'nbr' && (
            <div className="space-y-4">
              <div className="border-b border-[#D7E2F3] dark:border-slate-800 pb-3">
                <h3 className="text-xl font-extrabold text-[#0B1730] dark:text-white">
                  {pick('Tax & Statutory Disclaimer', 'কর ও বিধিবদ্ধ ঘোষণা')}
                </h3>
                <p className="text-xs text-[#5F6D82] mt-1">
                  {pick(
                    'Bangladesh Income Tax Act 2023 & VAT and Supplementary Duty Act 2012',
                    'বাংলাদেশ আয়কর আইন ২০২৩ এবং মূল্য সংযোজন কর ও সম্পূরক শুল্ক আইন ২০১২'
                  )}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/70 text-amber-950 dark:text-amber-200 text-xs space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-sm">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>{pick('Independent Private Practice', 'স্বাধীন বেসরকারি প্রতিষ্ঠান')}</span>
                </div>
                <p>
                  {pick(
                    'TecHisab is an independent private ITES & FINTEC organization and is not affiliated with the National Board of Revenue (NBR). Interactive website tools and blog articles provide general educational and planning context only. Always confirm assessment-year specifics with a qualified advisor and file official returns at ',
                    'টেকহিসাব একটি স্বাধীন বেসরকারি আইটিইএস ও ফিনটেক প্রতিষ্ঠান এবং এটি জাতীয় রাজস্ব বোর্ড (NBR)-এর অংশ নয়। ওয়েবসাইটের ক্যালকুলেটর ও নিবন্ধ কেবল সাধারণ ধারণা ও শিক্ষার জন্য। সর্বদা অভিজ্ঞ পরামর্শকের সাথে সংশ্লিষ্ট করবর্ষের বিধান যাচাই করুন এবং সরকারি পোর্টালে রিটার্ন দাখিল করুন: '
                  )}
                  <a href="https://etaxnbr.gov.bd" target="_blank" rel="noreferrer" className="underline font-semibold inline-flex items-center gap-1">
                    https://etaxnbr.gov.bd <ExternalLink className="w-3 h-3" />
                  </a>
                  ।
                </p>
              </div>
            </div>
          )}

          {activeDoc === 'refund' && (
            <div className="space-y-4">
              <div className="border-b border-[#D7E2F3] dark:border-slate-800 pb-3">
                <h3 className="text-xl font-extrabold text-[#0B1730] dark:text-white">
                  {pick('Refund & Cancellation Policy', 'রিফান্ড ও বাতিলকরণ নীতিমালা')}
                </h3>
              </div>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>
                  <strong>{pick('Software Subscriptions:', 'সফটওয়্যার সাবস্ক্রিপশন:')}</strong>{' '}
                  {pick(
                    'Monthly licenses may be cancelled prior to the next billing renewal without penalty.',
                    'মাসিক লাইসেন্স পরবর্তী বিলিং রিনিউয়ালের আগে জরিমানা ছাড়া বাতিল করা যাবে।'
                  )}
                </li>
                <li>
                  <strong>{pick('Training Admissions:', 'প্রশিক্ষণ ভর্তি:')}</strong>{' '}
                  {pick(
                    'Full fee refund or free batch transfer is provided when requested at least 48 hours prior to batch commencement.',
                    'ব্যাচ শুরুর অন্তত ৪৮ ঘণ্টা আগে অনুরোধ করলে সম্পূর্ণ ফি রিফান্ড অথবা বিনামূল্যে ব্যাচ পরিবর্তনের সুবিধা পাওয়া যাবে।'
                  )}
                </li>
                <li>
                  <strong>{pick('Accounting & Advisory Retainers:', 'অ্যাকাউন্টিং ও পরামর্শ রিটেইনার:')}</strong>{' '}
                  {pick(
                    'Requires 30 days written notice with orderly handover of ledgers and backups upon final settlement.',
                    '৩০ দিনের লিখিত নোটিশে চুক্তি বাতিল এবং চূড়ান্ত নিষ্পত্তির পর সকল লেজার ও ব্যাকআপ হস্তান্তর করা হবে।'
                  )}
                </li>
              </ul>
            </div>
          )}

          {activeDoc === 'security' && (
            <div className="space-y-4">
              <div className="border-b border-[#D7E2F3] dark:border-slate-800 pb-3">
                <h3 className="text-xl font-extrabold text-[#0B1730] dark:text-white">
                  {pick('Confidential Client Handling & NDA Protocol', 'ক্লায়েন্ট তথ্যের গোপনীয়তা ও এনডিএ প্রোটোকল')}
                </h3>
              </div>
              <p>
                {pick(
                  'Every accounting, tax, payroll, and software engagement is treated with strict confidentiality. Access to client records is limited to authorized team members under signed non-disclosure commitments, ensuring supplier pricing, bank balances, and corporate statements remain private.',
                  'প্রতিটি অ্যাকাউন্টিং, ট্যাক্স, পেরোল ও সফটওয়্যার কার্যক্রম কঠোর গোপনীয়তার সাথে পরিচালিত হয়। সরবরাহকারী দর, ব্যাংক ব্যালেন্স এবং কর্পোরেট বিবরণী সুরক্ষিত রাখতে কেবল নন-ডিসক্লোজার চুক্তিবদ্ধ অনুমোদিত টিম সদস্যরাই নথিতে প্রবেশাধিকার পান।'
                )}
              </p>
            </div>
          )}
        </div>

        <div className="p-4 sm:p-5 bg-[#F4F8FF] dark:bg-slate-950/80 border-t border-[#D7E2F3] dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#5F6D82]">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-[#0345A4] dark:text-sky-400" />
            <span>
              {pick(
                'TecHisab Corporate Office • Chittagong, Bangladesh',
                'টেকহিসাব কর্পোরেট অফিস • চট্টগ্রাম, বাংলাদেশ'
              )}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={`mailto:${site.contact.email}`}
              className="text-[#0345A4] dark:text-sky-400 hover:underline font-semibold"
            >
              {site.contact.email}
            </a>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-[#0345A4] hover:bg-[#02377F] text-white text-xs font-bold transition-all cursor-pointer"
            >
              {pick('Close', 'বন্ধ করুন')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


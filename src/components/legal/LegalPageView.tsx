import React from 'react';
import {
  Lock,
  Scale,
  RotateCcw,
  FileText,
  ShieldCheck,
  AlertTriangle,
  ExternalLink,
  Printer,
  ArrowLeft,
  Mail,
  MessageCircle,
} from 'lucide-react';
import { NavigationTab } from '../../types';
import { getLocalizedSiteConfig } from '../../data/localizedData';
import { useLanguage } from '../../context/LanguageContext';

export type LegalPageRoute =
  | 'privacy-policy'
  | 'terms-of-service'
  | 'refund-policy'
  | 'tax-disclaimer';

interface LegalPageViewProps {
  activePage: LegalPageRoute;
  onNavigate: (tab: NavigationTab) => void;
}

export const LegalPageView: React.FC<LegalPageViewProps> = ({ activePage, onNavigate }) => {
  const { isBengali, pick } = useLanguage();
  const site = getLocalizedSiteConfig(isBengali);

  const tabs: { id: LegalPageRoute; label: string; icon: React.ElementType }[] = [
    { id: 'privacy-policy', label: pick('Privacy Policy', 'গোপনীয়তা নীতি'), icon: Lock },
    { id: 'terms-of-service', label: pick('Terms of Service', 'সেবার শর্তাবলি'), icon: Scale },
    { id: 'refund-policy', label: pick('Refund & Cancellation Policy', 'রিফান্ড ও বাতিলকরণ নীতিমালা'), icon: RotateCcw },
    { id: 'tax-disclaimer', label: pick('Tax & Statutory Disclaimer', 'কর ও বিধিবদ্ধ ঘোষণা'), icon: FileText },
  ];

  const handlePrint = () => {
    window.print();
  };

  return (
    <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto animate-fade-in">
      {/* Top Action & Navigation Switcher */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => onNavigate('home')}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-[#D7E2F3] dark:border-slate-800 text-xs font-semibold text-[#0B1730] dark:text-slate-200 hover:border-[#0345A4] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-[#0345A4] dark:text-sky-400" />
          <span>{pick('Back to Home', 'হোম পেজে ফিরে যান')}</span>
        </button>

        <button
          type="button"
          onClick={handlePrint}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-[#D7E2F3] dark:border-slate-800 text-xs font-semibold text-[#5F6D82] dark:text-slate-300 hover:text-[#0345A4] transition-colors cursor-pointer print:hidden"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>{pick('Print Document', 'নথি প্রিন্ট করুন')}</span>
        </button>
      </div>

      {/* Document Tabs */}
      <div className="flex flex-wrap gap-2 mb-6 print:hidden">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activePage === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onNavigate(tab.id)}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer border ${
                isActive
                  ? 'bg-[#0345A4] text-white border-[#0345A4] shadow-sm'
                  : 'bg-white dark:bg-slate-900 text-[#5F6D82] dark:text-slate-300 border-[#D7E2F3] dark:border-slate-800 hover:border-[#0345A4]/50 hover:text-[#0345A4]'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Document Container */}
      <article className="bg-white dark:bg-slate-900 rounded-2xl border border-[#D7E2F3] dark:border-slate-800 shadow-sm p-6 sm:p-10 space-y-6 text-sm text-[#5F6D82] dark:text-slate-300 leading-relaxed">
        {activePage === 'privacy-policy' && (
          <>
            <header className="border-b border-[#D7E2F3] dark:border-slate-800 pb-5">
              <p className="text-xs font-bold uppercase tracking-wider text-[#0A63D8] dark:text-sky-400">
                {pick('Corporate Governance • Effective 2026', 'কর্পোরেট সুশাসন • কার্যকর ২০২৬')}
              </p>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B1730] dark:text-white mt-1">
                {pick('Privacy & Client Data Protection Policy', 'গোপনীয়তা ও ক্লায়েন্ট ডেটা সুরক্ষা নীতি')}
              </h1>
              <p className="text-xs sm:text-sm text-[#5F6D82] dark:text-slate-400 mt-2">
                {pick(
                  'Applies to TecHisab accounting, tax, BPO, software, website development, and training services.',
                  'টেকহিসাবের অ্যাকাউন্টিং, ট্যাক্স, বিপিও, সফটওয়্যার, ওয়েবসাইট ডেভেলপমেন্ট এবং প্রশিক্ষণ সেবাসমূহের ক্ষেত্রে প্রযোজ্য।'
                )}
              </p>
            </header>

            <section className="space-y-2.5">
              <h2 className="text-base sm:text-lg font-bold text-[#0B1730] dark:text-white">
                {pick('1. Information Provided for Service Delivery', '১. সেবা প্রদানের জন্য সংগৃহীত তথ্য')}
              </h2>
              <p>
                {pick(
                  'When engaging TecHisab for accounting, tax and VAT documentation, payroll, BPO operations, software onboarding, or training enrollment, clients and learners may voluntarily provide:',
                  'অ্যাকাউন্টিং, আয়কর ও ভ্যাট ডকুমেন্টেশন, পেরোল, বিপিও অপারেশনস, সফটওয়্যার অনবোর্ডিং বা প্রশিক্ষণে ভর্তির সময় ক্লায়েন্ট এবং প্রশিক্ষণার্থীরা স্বেচ্ছায় নিম্নোক্ত তথ্য প্রদান করতে পারেন:'
                )}
              </p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>
                  <strong>{pick('Business & Accounting Records:', 'ব্যবসায়িক ও হিসাব নথিপত্র:')}</strong>{' '}
                  {pick(
                    'Ledger entries, sales invoices, purchase vouchers, bank statements, stock sheets, and payroll summaries required for contracted work.',
                    'চুক্তিবদ্ধ কাজের জন্য প্রয়োজনীয় লেজার এন্ট্রি, বিক্রয় চালান, ক্রয় ভাউচার, ব্যাংক স্টেটমেন্ট, স্টক শিট এবং বেতন-ভাতার সারসংক্ষেপ।'
                  )}
                </li>
                <li>
                  <strong>{pick('Statutory Identifiers:', 'বিধিবদ্ধ নিবন্ধন তথ্য:')}</strong>{' '}
                  {pick(
                    'e-TIN, BIN, trade license details, or corporate registration records supplied specifically for return preparation or documentation support.',
                    'রিটার্ন প্রস্তুত বা নথিপত্র সহায়তার জন্য প্রদত্ত ই-টিআইএন (e-TIN), বিন (BIN), ট্রেড লাইসেন্স বা কোম্পানি নিবন্ধন তথ্য।'
                  )}
                </li>
                <li>
                  <strong>{pick('Inquiry & Enrollment Contact Details:', 'যোগাযোগ ও ভর্তির তথ্য:')}</strong>{' '}
                  {pick(
                    'Name, organization name, email address, and phone or WhatsApp contact number.',
                    'নাম, প্রতিষ্ঠানের নাম, ইমেইল ঠিকানা এবং ফোন বা হোয়াটসঅ্যাপ নম্বর।'
                  )}
                </li>
              </ul>
            </section>

            <section className="space-y-2.5">
              <h2 className="text-base sm:text-lg font-bold text-[#0B1730] dark:text-white">
                {pick('2. Strict Confidentiality & Non-Disclosure', '২. কঠোর গোপনীয়তা ও নন-ডিসক্লোজার নীতি')}
              </h2>
              <div className="p-4 rounded-xl bg-[#F4F8FF] dark:bg-sky-950/30 border border-[#D7E2F3] dark:border-sky-900 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-[#0345A4] dark:text-sky-400 shrink-0 mt-0.5" />
                <p className="text-xs sm:text-sm text-[#0B1730] dark:text-slate-200">
                  {pick(
                    'TecHisab does not sell, rent, or disclose client financial records, supplier lists, pricing margins, or proprietary business information to unrelated third parties. Access to working files is restricted to assigned engagement personnel under confidentiality obligations.',
                    'টেকহিসাব কখনোই ক্লায়েন্টের আর্থিক নথি, সরবরাহকারী তালিকা, মুনাফার হিসাব বা অভ্যন্তরীণ ব্যবসায়িক তথ্য কোনো তৃতীয় পক্ষের নিকট বিক্রি, ভাড়া বা প্রকাশ করে না। কাজের ফাইলে প্রবেশাধিকার কেবল দায়িত্বপ্রাপ্ত ও গোপনীয়তা চুক্তিবদ্ধ কর্মীদের মধ্যেই সীমাবদ্ধ থাকে।'
                  )}
                </p>
              </div>
            </section>

            <section className="space-y-2.5">
              <h2 className="text-base sm:text-lg font-bold text-[#0B1730] dark:text-white">
                {pick('3. Website Data & Browser Sandboxes', '৩. ওয়েবসাইট ডেটা ও ব্রাউজার স্যান্ডবক্স')}
              </h2>
              <p>
                {pick(
                  'Interactive software previews on this public website operate directly inside your browser for demonstration and educational evaluation. Any sample values you type into demonstration previews stay on your own device unless you explicitly choose to compose an inquiry via WhatsApp or email.',
                  'এই ওয়েবসাইটের ইন্টারঅ্যাক্টিভ সফটওয়্যার প্রিভিউগুলো সরাসরি আপনার ব্রাউজারের ভেতরেই প্রদর্শন ও অনুশীলনের জন্য পরিচালিত হয়। ডেমো প্রিভিউতে আপনার দেওয়া কোনো নমুনা তথ্য সার্ভারের ডাটাবেসে পাঠানো হয় না এবং আপনার ডিভাইসেই সীমাবদ্ধ থাকে।'
                )}
              </p>
            </section>

            <section className="space-y-2.5">
              <h2 className="text-base sm:text-lg font-bold text-[#0B1730] dark:text-white">
                {pick('4. Data Return & Removal Requests', '৪. তথ্য ফেরত ও অপসারণের অনুরোধ')}
              </h2>
              <p>
                {pick(
                  'Upon completion or termination of an engagement, clients may request full export and return of their source accounting files and removal of working copies by contacting ',
                  'সেবা সমাপ্তি বা চুক্তি বাতিলের পর ক্লায়েন্টরা তাদের মূল হিসাব নথির সম্পূর্ণ এক্সপোর্ট ফেরত পেতে এবং ওয়ার্কিং কপি অপসারণের অনুরোধ করতে ইমেইল করতে পারেন: '
                )}
                <a href={`mailto:${site.contact.email}`} className="text-[#0345A4] dark:text-sky-400 font-semibold underline">
                  {site.contact.email}
                </a>
                ।
              </p>
            </section>
          </>
        )}

        {activePage === 'terms-of-service' && (
          <>
            <header className="border-b border-[#D7E2F3] dark:border-slate-800 pb-5">
              <p className="text-xs font-bold uppercase tracking-wider text-[#0A63D8] dark:text-sky-400">
                {pick('Commercial Service Terms • Updated 2026', 'বাণিজ্যিক সেবার শর্তাবলি • হালনাগাদ ২০২৬')}
              </p>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B1730] dark:text-white mt-1">
                {pick('Terms of Service', 'সেবার শর্তাবলি (Terms of Service)')}
              </h1>
              <p className="text-xs sm:text-sm text-[#5F6D82] dark:text-slate-400 mt-2">
                {pick(
                  'Standard engagement principles for TecHisab professional services, software licenses, and training programs.',
                  'টেকহিসাবের পেশাদার সেবা, সফটওয়্যার লাইসেন্স এবং প্রশিক্ষণ প্রোগ্রাম সংক্রান্ত প্রমিত শর্তাবলি।'
                )}
              </p>
            </header>

            <section className="space-y-2.5">
              <h2 className="text-base sm:text-lg font-bold text-[#0B1730] dark:text-white">
                {pick('1. Clear Scope of Engagement', '১. সেবার সুস্পষ্ট পরিধি')}
              </h2>
              <p>
                {pick(
                  'Every consulting retainer, bookkeeping engagement, software setup, custom software development project, or training enrollment is governed by a clearly confirmed written scope, timeline, and fee schedule agreed before work begins.',
                  'প্রতিটি কনসাল্টিং রিটেইনার, বুককিপিং চুক্তি, সফটওয়্যার সেটআপ, কাস্টম ডেভেলপমেন্ট প্রজেক্ট বা প্রশিক্ষণ ভর্তি কাজ শুরুর আগে উভয় পক্ষের সম্মত লিখিত পরিধি, সময়সীমা ও ফি কাঠামো অনুযায়ী পরিচালিত হয়।'
                )}
              </p>
            </section>

            <section className="space-y-2.5">
              <h2 className="text-base sm:text-lg font-bold text-[#0B1730] dark:text-white">
                {pick('2. Client Source Record Accuracy', '২. ক্লায়েন্ট প্রদত্ত মূল নথির সঠিকতা')}
              </h2>
              <p>
                {pick(
                  'Clients remain responsible for the completeness, authenticity, and lawful accuracy of original invoices, receipts, bank statements, employee attendance logs, and statutory records provided to TecHisab for processing or advisory review.',
                  'প্রসেসিং বা পরামর্শ পর্যালোচনার জন্য টেকহিসাবকে সরবরাহকৃত মূল চালান, রসিদ, ব্যাংক স্টেটমেন্ট, কর্মী উপস্থিতির তথ্য এবং বিধিবদ্ধ নথিপত্রের পূর্ণতা ও আইনগত সঠিকতার দায়িত্ব ক্লায়েন্টের ওপর ন্যস্ত থাকে।'
                )}
              </p>
            </section>

            <section className="space-y-2.5">
              <h2 className="text-base sm:text-lg font-bold text-[#0B1730] dark:text-white">
                {pick('3. Pricing & Quotation Confirmation', '৩. মূল্য ও কোটেশন নিশ্চিতকরণ')}
              </h2>
              <p>
                {pick(
                  'Published service charges and software rates on this website serve as transparent baseline benchmarks. Final quotations depend on transaction volume, branches, module customization, and statutory complexity, confirmed in writing prior to onboarding.',
                  'এই ওয়েবসাইটে প্রকাশিত সার্ভিস চার্জ ও সফটওয়্যার মূল্যসমূহ স্বচ্ছ প্রারম্ভিক মানদণ্ড হিসেবে প্রদর্শিত। লেনদেনের পরিমাণ, শাখা সংখ্যা, কাস্টমাইজেশন ও কাজের জটিলতার ওপর ভিত্তি করে চূড়ান্ত কোটেশন লিখিতভাবে নির্ধারণ করা হয়।'
                )}
              </p>
            </section>

            <section className="space-y-2.5">
              <h2 className="text-base sm:text-lg font-bold text-[#0B1730] dark:text-white">
                {pick('4. Ownership of Client Records & Software Rights', '৪. ক্লায়েন্ট ডেটা ও সফটওয়্যার মেধাস্বত্ব')}
              </h2>
              <p>
                {pick(
                  'Clients retain complete ownership of all underlying financial data, ledgers, reports, and statutory schedules prepared for their organization. TecHisab retains intellectual property rights in its proprietary software platforms, templates, and training materials unless explicitly assigned in a custom development contract.',
                  'ক্লায়েন্টের প্রতিষ্ঠানের জন্য প্রস্তুতকৃত সকল আর্থিক তথ্য, লেজার, রিপোর্ট ও সিডিউলের সম্পূর্ণ মালিকানা ক্লায়েন্টের। নিজস্ব সফটওয়্যার প্ল্যাটফর্ম, টেমপ্লেট ও প্রশিক্ষণ উপকরণের মেধাস্বত্ব টেকহিসাবের অধীনে থাকে (যদি না কাস্টম চুক্তিতে ভিন্ন কিছু উল্লেখ থাকে)।'
                )}
              </p>
            </section>

            <section className="space-y-2.5">
              <h2 className="text-base sm:text-lg font-bold text-[#0B1730] dark:text-white">
                {pick('5. Governing Jurisdiction', '৫. প্রযোজ্য আইন ও এখতিয়ার')}
              </h2>
              <p>
                {pick(
                  'These Terms are governed by the applicable laws of the People’s Republic of Bangladesh.',
                  'এই শর্তাবলি গণপ্রজাতন্ত্রী বাংলাদেশের প্রচলিত আইন অনুযায়ী পরিচালিত ও ব্যাখ্যা করা হবে।'
                )}
              </p>
            </section>
          </>
        )}

        {activePage === 'refund-policy' && (
          <>
            <header className="border-b border-[#D7E2F3] dark:border-slate-800 pb-5">
              <p className="text-xs font-bold uppercase tracking-wider text-[#0A63D8] dark:text-sky-400">
                {pick('Commercial Policy • Transparent Cancellation Terms', 'বাণিজ্যিক নীতি • স্বচ্ছ বাতিলকরণ শর্তাবলি')}
              </p>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B1730] dark:text-white mt-1">
                {pick('Refund & Cancellation Policy', 'রিফান্ড ও বাতিলকরণ নীতিমালা')}
              </h1>
              <p className="text-xs sm:text-sm text-[#5F6D82] dark:text-slate-400 mt-2">
                {pick(
                  'Clear guidelines for software subscriptions, training admissions, and monthly service retainers.',
                  'সফটওয়্যার সাবস্ক্রিপশন, প্রশিক্ষণ ভর্তি এবং মাসিক সেবা চুক্তির জন্য সুস্পষ্ট নির্দেশিকা।'
                )}
              </p>
            </header>

            <section className="space-y-2.5">
              <h2 className="text-base sm:text-lg font-bold text-[#0B1730] dark:text-white">
                {pick('1. Software Subscriptions', '১. সফটওয়্যার সাবস্ক্রিপশন')}
              </h2>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>
                  <strong>{pick('Monthly Plans:', 'মাসিক প্ল্যান:')}</strong>{' '}
                  {pick(
                    'Subscriptions may be cancelled prior to the next billing cycle without early termination penalties.',
                    'পরবর্তী বিলিং চক্র শুরুর আগেই কোনো অতিরিক্ত জরিমানা ছাড়া সাবস্ক্রিপশন বাতিল করা যাবে।'
                  )}
                </li>
                <li>
                  <strong>{pick('Annual Plans:', 'বার্ষিক প্ল্যান:')}</strong>{' '}
                  {pick(
                    'Annual plans are billed upfront at the 10-month discounted annual rate. Cancellation requests are handled per the confirmed onboarding agreement, with unused full months reviewed on a fair prorated basis where applicable.',
                    'বার্ষিক প্ল্যান ১০ মাসের ছাড়কৃত মূল্যে অগ্রিম বিল করা হয়। চুক্তির শর্তানুযায়ী অব্যবহৃত পূর্ণ মাসের জন্য প্রযোজ্য ক্ষেত্রে ন্যায্য সমন্বয় পর্যালোচনা করা হয়।'
                  )}
                </li>
                <li>
                  <strong>{pick('Implementation / Customization:', 'বাস্তবায়ন / কাস্টমাইজেশন:')}</strong>{' '}
                  {pick(
                    'Custom setup, data migration, and bespoke feature development fees become non-refundable once milestone work has been delivered and approved.',
                    'কাস্টম সেটআপ, ডেটা মাইগ্রেশন ও বিশেষ ফিচার ডেভেলপমেন্টের কাজ ধাপ অনুযায়ী সরবরাহ ও অনুমোদিত হলে উক্ত ফি অফেরতযোগ্য।'
                  )}
                </li>
              </ul>
            </section>

            <section className="space-y-2.5">
              <h2 className="text-base sm:text-lg font-bold text-[#0B1730] dark:text-white">
                {pick('2. Practical Training Programs', '২. প্র্যাকটিক্যাল প্রশিক্ষণ প্রোগ্রাম')}
              </h2>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>
                  <strong>{pick('Before Batch Commencement:', 'ব্যাচ শুরুর পূর্বে:')}</strong>{' '}
                  {pick(
                    'Full fee refund or free batch rescheduling is available when requested at least 48 hours before the scheduled first session.',
                    'প্রথম ক্লাস শুরুর অন্তত ৪৮ ঘণ্টা আগে অনুরোধ করলে সম্পূর্ণ কোর্স ফি ফেরত অথবা বিনামূল্যে পরবর্তী ব্যাচে স্থানান্তরের সুযোগ রয়েছে।'
                  )}
                </li>
                <li>
                  <strong>{pick('Schedule Transfer:', 'সময়সূচি পরিবর্তন:')}</strong>{' '}
                  {pick(
                    'Enrolled participants unable to continue in an active batch may request transfer to the next available cohort subject to seat availability.',
                    'চলমান ব্যাচে ক্লাস চালিয়ে যেতে অক্ষম নিবন্ধিত শিক্ষার্থীরা আসন খালি থাকা সাপেক্ষে পরবর্তী ব্যাচে স্থানান্তরের অনুরোধ করতে পারবেন।'
                  )}
                </li>
              </ul>
            </section>

            <section className="space-y-2.5">
              <h2 className="text-base sm:text-lg font-bold text-[#0B1730] dark:text-white">
                {pick('3. Accounting, Tax & BPO Retainers', '৩. অ্যাকাউন্টিং, ট্যাক্স ও বিপিও রিটেইনার সেবা')}
              </h2>
              <p>
                {pick(
                  'Monthly accounting, payroll, or compliance retainers may be cancelled with 30 days written notice. Upon settlement of completed work cycles, TecHisab hands over all working ledgers, software backups, and prepared schedules to the client.',
                  'মাসিক অ্যাকাউন্টিং, পেরোল বা কমপ্লায়েন্স সেবা ৩০ দিনের লিখিত নোটিশে বাতিল করা যাবে। সম্পন্ন কাজের বিল নিষ্পত্তির পর টেকহিসাব সকল লেজার, সফটওয়্যার ব্যাকআপ ও প্রস্তুতকৃত সিডিউল ক্লায়েন্টকে বুঝিয়ে দেবে।'
                )}
              </p>
            </section>
          </>
        )}

        {activePage === 'tax-disclaimer' && (
          <>
            <header className="border-b border-[#D7E2F3] dark:border-slate-800 pb-5">
              <p className="text-xs font-bold uppercase tracking-wider text-[#0A63D8] dark:text-sky-400">
                {pick(
                  'Bangladesh Income Tax Act 2023 & VAT and SD Act 2012',
                  'বাংলাদেশ আয়কর আইন ২০২৩ এবং মূল্য সংযোজন কর ও সম্পূরক শুল্ক আইন ২০১২'
                )}
              </p>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B1730] dark:text-white mt-1">
                {pick('Tax, VAT & Statutory Disclaimer', 'কর, ভ্যাট ও বিধিবদ্ধ ঘোষণা')}
              </h1>
              <p className="text-xs sm:text-sm text-[#5F6D82] dark:text-slate-400 mt-2">
                {pick(
                  'Important clarification regarding software calculators, educational articles, and official National Board of Revenue (NBR) filings.',
                  'সফটওয়্যার ক্যালকুলেটর, শিক্ষামূলক নিবন্ধ এবং জাতীয় রাজস্ব বোর্ড (NBR)-এ দাখিলযোগ্য আনুষ্ঠানিক রিটার্ন সংক্রান্ত গুরুত্বপূর্ণ স্পষ্টীকরণ।'
                )}
              </p>
            </header>

            <div className="p-4 sm:p-5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/70 text-amber-950 dark:text-amber-200 space-y-2">
              <div className="flex items-center gap-2 font-bold text-sm sm:text-base">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                <span>
                  {pick(
                    'Independent Private Practice — Not a Government Portal',
                    'স্বাধীন বেসরকারি প্রতিষ্ঠান — সরকারি পোর্টাল নয়'
                  )}
                </span>
              </div>
              <p className="text-xs sm:text-sm">
                {pick(
                  'TecHisab is an independent ITES & FINTEC firm and is not a government department or an official portal of the National Board of Revenue (NBR).',
                  'টেকহিসাব (TecHisab) একটি স্বাধীন বেসরকারি আইটিইএস ও ফিনটেক প্রতিষ্ঠান; এটি কোনো সরকারি দপ্তর বা জাতীয় রাজস্ব বোর্ড (NBR)-এর অফিসিয়াল পোর্টাল নয়।'
                )}
              </p>
            </div>

            <section className="space-y-2.5">
              <h2 className="text-base sm:text-lg font-bold text-[#0B1730] dark:text-white">
                {pick('1. Educational Guides & Estimator Previews', '১. শিক্ষামূলক গাইড ও অনুমানমূলক ক্যালকুলেটর')}
              </h2>
              <p>
                {pick(
                  'The articles, interactive calculators, Mushak schedule demonstrations, and salary tax previews published on this website are provided for general educational and planning reference only. Tax slabs, surcharge thresholds, exemptions, TDS rates, and SRO circulars change periodically under annual Finance Acts and Finance Ordinances.',
                  'এই ওয়েবসাইটে প্রকাশিত নিবন্ধ, ইন্টারঅ্যাক্টিভ ক্যালকুলেটর, মূসক প্রিভিউ এবং বেতন কর হিসাব কেবল সাধারণ ধারণা ও পরিকল্পনার উদ্দেশ্যে প্রদান করা হয়েছে। বার্ষিক অর্থ আইন ও এসআরও (SRO) অনুযায়ী করের ধাপ, সারচার্জ, অব্যাহতি ও উৎসে কর (TDS) হার নিয়মিত পরিবর্তিত হতে পারে।'
                )}
              </p>
            </section>

            <section className="space-y-2.5">
              <h2 className="text-base sm:text-lg font-bold text-[#0B1730] dark:text-white">
                {pick('2. Assessment-Year Verification & Official Filing', '২. করবর্ষ যাচাই ও অফিসিয়াল রিটার্ন দাখিল')}
              </h2>
              <p>
                {pick(
                  'Before relying on any figure for statutory tax return submission, withholding deduction, or Mushak 9.1 filing, taxpayers should verify current rules for the specific Assessment Year or consult a qualified Income Tax Practitioner (ITP), Chartered Accountant, or legal advisor. Official e-return submissions are made through the Government portal:',
                  'বিধিবদ্ধ আয়কর রিটার্ন দাখিল, উৎসে কর কর্তন বা মূসক ৯.১ জমার ক্ষেত্রে যেকোনো হিসাব ব্যবহারের পূর্বে সংশ্লিষ্ট করবর্ষের হালনাগাদ বিধিমালা যাচাই করুন অথবা অভিজ্ঞ ইনকাম ট্যাক্স প্র্যাকটিশনার (ITP) বা চার্টার্ড অ্যাকাউন্ট্যান্টের পরামর্শ নিন। সরকারি ই-রিটার্ন পোর্টাল:'
                )}
              </p>
              <div className="p-3.5 rounded-xl bg-[#F4F8FF] dark:bg-slate-800 border border-[#D7E2F3] dark:border-slate-700 flex flex-wrap items-center justify-between gap-2">
                <span className="font-mono text-xs sm:text-sm font-bold text-[#0345A4] dark:text-sky-400">
                  https://etaxnbr.gov.bd
                </span>
                <a
                  href="https://etaxnbr.gov.bd"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0B1730] dark:text-slate-200 hover:text-[#0345A4]"
                >
                  <span>{pick('Visit NBR e-Tax Portal', 'এনবিআর ই-ট্যাক্স পোর্টাল দেখুন')}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </section>
          </>
        )}

        {/* Footer Support Box inside Document */}
        <footer className="pt-6 border-t border-[#D7E2F3] dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
          <div>
            <p className="font-bold text-[#0B1730] dark:text-white">
              {pick(
                'Questions regarding our policies or compliance terms?',
                'আমাদের নীতিমালা বা কমপ্লায়েন্স শর্তাবলি সম্পর্কে কোনো প্রশ্ন রয়েছে?'
              )}
            </p>
            <p className="text-[#5F6D82] dark:text-slate-400">
              {site.contact.address}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <a
              href={`mailto:${site.contact.email}`}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#F4F8FF] dark:bg-slate-800 border border-[#D7E2F3] dark:border-slate-700 text-[#0345A4] dark:text-sky-400 font-semibold"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>{site.contact.email}</span>
            </a>
            <a
              href={site.contact.whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0345A4] hover:bg-[#02377F] text-white font-semibold"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>{pick('WhatsApp Desk', 'হোয়াটসঅ্যাপ ডেস্ক')}</span>
            </a>
          </div>
        </footer>
      </article>
    </section>
  );
};


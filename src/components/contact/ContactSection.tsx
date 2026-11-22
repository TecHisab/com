import React, { useState } from 'react';
import { getLocalizedSiteConfig } from '../../data/localizedData';
import { useLanguage } from '../../context/LanguageContext';
import { SectionHeading } from '../common/SectionHeading';
import { SocialLinks } from '../common/SocialLinks';
import {
  Phone,
  Mail,
  MapPin,
  Send,
  CheckCircle2,
  ArrowUpRight,
  MessageCircle,
  ShieldCheck,
  AlertCircle,
  Copy,
  RefreshCw,
} from 'lucide-react';

export const ContactSection: React.FC = () => {
  const { isBengali, pick } = useLanguage();
  const site = getLocalizedSiteConfig(isBengali);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [serviceCategory, setServiceCategory] = useState('Accounting & Bookkeeping');
  const [message, setMessage] = useState('');

  const [isPrepared, setIsPrepared] = useState(false);
  const [copied, setCopied] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const buildInquirySummary = () =>
    [
      pick('TecHisab Consultation Request', 'টেকহিসাব পরামর্শের অনুরোধ'),
      `${pick('Name', 'নাম')}: ${name.trim()}`,
      `${pick('Phone', 'ফোন')}: ${phone.trim()}`,
      `${pick('Email', 'ইমেইল')}: ${email.trim()}`,
      company.trim() ? `${pick('Company', 'প্রতিষ্ঠান')}: ${company.trim()}` : null,
      `${pick('Service / Interest', 'আগ্রহের বিষয় / সেবা')}: ${serviceCategory}`,
      `${pick('Requirement Details', 'বিস্তারিত বিবরণ')}: ${message.trim()}`,
    ]
      .filter(Boolean)
      .join('\n');

  const whatsappUrl = `https://wa.me/${site.contact.whatsappNumber}?text=${encodeURIComponent(
    buildInquirySummary()
  )}`;

  const mailtoUrl = `mailto:${site.contact.email}?subject=${encodeURIComponent(
    `TecHisab Inquiry: ${serviceCategory} - ${name.trim()}`
  )}&body=${encodeURIComponent(buildInquirySummary())}`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const errors: Record<string, string> = {};
    if (!name.trim() || name.trim().length < 2) {
      errors.name = pick('Please enter your full name.', 'অনুগ্রহ করে আপনার পূর্ণ নাম লিখুন।');
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.email = pick(
        'Please provide a valid email address.',
        'অনুগ্রহ করে একটি সঠিক ইমেইল ঠিকানা দিন।'
      );
    }
    if (!phone.trim() || phone.trim().length < 7) {
      errors.phone = pick(
        'Please provide a valid phone or WhatsApp number.',
        'অনুগ্রহ করে একটি সঠিক ফোন বা হোয়াটসঅ্যাপ নম্বর দিন।'
      );
    }
    if (!message.trim() || message.trim().length < 5) {
      errors.message = pick(
        'Please describe your service, software, or training inquiry.',
        'আপনার কাঙ্ক্ষিত সেবা, সফটওয়্যার বা প্রশিক্ষণ সম্পর্কে সংক্ষেপে লিখুন।'
      );
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setGeneralError(
        pick('Please complete the highlighted fields.', 'অনুগ্রহ করে চিহ্নিত ঘরগুলো পূরণ করুন।')
      );
      return;
    }

    setGeneralError(null);
    setFieldErrors({});
    setIsPrepared(true);
  };

  const handleCopySummary = async () => {
    try {
      await navigator.clipboard.writeText(buildInquirySummary());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard fallback
    }
  };

  const handleResetForm = () => {
    setIsPrepared(false);
    setName('');
    setEmail('');
    setPhone('');
    setCompany('');
    setMessage('');
    setGeneralError(null);
    setFieldErrors({});
  };

  return (
    <section id="contact-section" className="py-16" aria-labelledby="contact-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <SectionHeading
          badge={pick('Contact TecHisab', 'টেকহিসাবের সাথে যোগাযোগ')}
          title={pick(
            'Connect With Our Accounting, Software & Training Team',
            'আমাদের অ্যাকাউন্টিং, সফটওয়্যার ও প্রশিক্ষণ টিমের সাথে যোগাযোগ করুন'
          )}
          subtitle={pick(
            'Reach out for accounting retainers, income tax & VAT support, business software demos, custom development, or practical training.',
            'মাসিক অ্যাকাউন্টিং সেবা, আয়কর ও ভ্যাট সহায়তা, বিজনেস সফটওয়্যার ডেমো, কাস্টম সফটওয়্যার ডেভেলপমেন্ট অথবা প্র্যাকটিক্যাল প্রশিক্ষণের জন্য যোগাযোগ করুন।'
          )}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Verified Office & Official Channels */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-[#D7E2F3] dark:border-slate-800 shadow-xs space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-[#F4F8FF] dark:bg-slate-800 text-[#0345A4] dark:text-sky-400 border border-[#D7E2F3] dark:border-slate-700">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-[#0B1730] dark:text-white">
                    {pick('Corporate Office', 'কর্পোরেট অফিস')}
                  </h4>
                  <p className="text-xs text-[#5F6D82] dark:text-slate-400">
                    {pick('Chittagong, Bangladesh', 'চট্টগ্রাম, বাংলাদেশ')}
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#F4F8FF] dark:bg-slate-950/60 border border-[#D7E2F3] dark:border-slate-800 text-xs text-[#0B1730] dark:text-slate-300 leading-relaxed">
                <p className="font-bold mb-1">{pick('Address:', 'ঠিকানা:')}</p>
                <p>{site.contact.address}</p>
              </div>

              <a
                href={site.contact.mapDirectionsUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#F4F8FF] dark:bg-slate-800 hover:bg-[#D7E2F3]/50 text-[#0345A4] dark:text-sky-400 border border-[#D7E2F3] dark:border-slate-700 text-xs font-bold transition-colors"
              >
                <span>{pick('Open in Google Maps', 'গুগল ম্যাপসে দেখুন')}</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-[#D7E2F3] dark:border-slate-800 shadow-xs space-y-4">
              <h4 className="text-xs font-extrabold text-[#0B1730] dark:text-white uppercase tracking-wider">
                {pick('Direct Channels', 'সরাসরি যোগাযোগ মাধ্যম')}
              </h4>

              <div className="flex items-center justify-between p-3 rounded-xl bg-[#F4F8FF] dark:bg-slate-800/60 border border-[#D7E2F3]/70 dark:border-slate-700">
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-[#0345A4] dark:text-sky-400" />
                  <div>
                    <span className="text-[10px] text-[#5F6D82] uppercase font-bold block">
                      {pick('Phone', 'ফোন')}
                    </span>
                    <a
                      href={`tel:${site.contact.phone}`}
                      className="text-xs font-bold text-[#0B1730] dark:text-slate-200 hover:text-[#0345A4]"
                    >
                      {site.contact.phoneDisplay}
                    </a>
                  </div>
                </div>
                <span className="text-[11px] font-semibold text-[#5F6D82]">
                  {pick('Sat – Thu', 'শনি – বৃহঃ')}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-[#F4F8FF] dark:bg-slate-800/60 border border-[#D7E2F3]/70 dark:border-slate-700">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-[#0345A4] dark:text-sky-400" />
                  <div>
                    <span className="text-[10px] text-[#5F6D82] uppercase font-bold block">
                      {pick('Email', 'ইমেইল')}
                    </span>
                    <a
                      href={`mailto:${site.contact.email}`}
                      className="text-xs font-bold text-[#0B1730] dark:text-slate-200 hover:text-[#0345A4]"
                    >
                      {site.contact.email}
                    </a>
                  </div>
                </div>
              </div>

              <a
                href={site.contact.whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <MessageCircle className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
                  <div>
                    <span className="text-[10px] text-emerald-800 dark:text-emerald-300 uppercase font-bold block">
                      {pick('WhatsApp Business', 'হোয়াটসঅ্যাপ বিজনেস')}
                    </span>
                    <span className="text-xs font-bold text-emerald-950 dark:text-emerald-100">
                      {pick('Chat With TecHisab', 'টেকহিসাবের সাথে চ্যাট করুন')}
                    </span>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
              </a>

              <div className="pt-2 border-t border-[#D7E2F3]/70 dark:border-slate-800">
                <span className="text-[11px] text-[#5F6D82] block mb-2 font-medium">
                  {pick('Official Social Pages:', 'অফিসিয়াল সোশ্যাল মিডিয়া:')}
                </span>
                <SocialLinks className="text-[#0B1730]" size="sm" />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#F4F8FF] dark:bg-slate-900 border border-[#D7E2F3] dark:border-slate-800 text-xs text-[#5F6D82] dark:text-slate-400 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-[#0345A4] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-[#0B1730] dark:text-slate-200 block mb-0.5">
                  {pick('Confidential Handling', 'তথ্যের গোপনীয়তা সুরক্ষিত')}
                </span>
                {pick(
                  'Details prepared here stay inside your browser until you send them via WhatsApp or your own email client.',
                  'এখানে লেখা আপনার তথ্যগুলো সম্পূর্ণ নিরাপদে আপনার ব্রাউজারেই থাকে—যতক্ষণ না আপনি নিজে হোয়াটসঅ্যাপ বা ইমেইলের মাধ্যমে তা প্রেরণ করেন।'
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Structured Consultation Composer */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl border border-[#D7E2F3] dark:border-slate-800 shadow-xs">
            <div className="border-b border-[#D7E2F3]/80 dark:border-slate-800 pb-4">
              <h3 id="contact-heading" className="text-lg font-extrabold text-[#0B1730] dark:text-white">
                {pick(
                  'Request a Consultation or Software Demo',
                  'পরামর্শ অথবা সফটওয়্যার ডেমোর জন্য বার্তা প্রস্তুত করুন'
                )}
              </h3>
              <p className="text-xs text-[#5F6D82] dark:text-slate-400 mt-1">
                {pick(
                  'Fill in your requirement below to generate a structured message ready for WhatsApp or Email.',
                  'হোয়াটসঅ্যাপ বা ইমেইলে পাঠানোর উপযোগী একটি সুসংগঠিত বার্তা তৈরি করতে নিচের তথ্যগুলো পূরণ করুন।'
                )}
              </p>
            </div>

            {isPrepared ? (
              <div className="py-8 text-center space-y-5" role="status" aria-live="polite">
                <div className="w-14 h-14 bg-[#F4F8FF] dark:bg-emerald-950/60 text-[#0345A4] dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-[#D7E2F3]">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <div className="space-y-1.5">
                  <h4 className="text-xl font-bold text-[#0B1730] dark:text-white">
                    {pick(
                      'Your Consultation Summary Is Ready',
                      'আপনার পরামর্শ বার্তাটি পাঠানোর জন্য প্রস্তুত'
                    )}
                  </h4>
                  <p className="text-xs sm:text-sm text-[#5F6D82] dark:text-slate-300 max-w-md mx-auto">
                    {pick(
                      'Send your structured request directly via WhatsApp for immediate attention, open your email client, or copy the formatted text.',
                      'দ্রুত সাড়ার জন্য সরাসরি হোয়াটসঅ্যাপে পাঠান, ইমেইল অ্যাপ খুলুন অথবা প্রস্তুতকৃত লেখাটি কপি করুন।'
                    )}
                  </p>
                </div>

                <pre className="text-left text-xs bg-[#F4F8FF] dark:bg-slate-800 border border-[#D7E2F3] dark:border-slate-700 rounded-xl p-4 whitespace-pre-wrap text-[#0B1730] dark:text-slate-200 max-w-lg mx-auto">
                  {buildInquirySummary()}
                </pre>

                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>{pick('Send via WhatsApp', 'হোয়াটসঅ্যাপে পাঠান')}</span>
                  </a>

                  <a
                    href={mailtoUrl}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0345A4] hover:bg-[#02377F] text-white text-xs font-bold shadow-xs"
                  >
                    <Mail className="w-4 h-4" />
                    <span>{pick('Send via Email', 'ইমেইলে পাঠান')}</span>
                  </a>

                  <button
                    type="button"
                    onClick={handleCopySummary}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#F4F8FF] dark:bg-slate-800 border border-[#D7E2F3] dark:border-slate-700 text-[#0B1730] dark:text-slate-200 text-xs font-semibold cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copied ? pick('Copied!', 'কপি হয়েছে!') : pick('Copy Text', 'টেক্সট কপি করুন')}</span>
                  </button>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleResetForm}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5F6D82] hover:text-[#0345A4] cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>{pick('Prepare Another Inquiry', 'আরেকটি বার্তা তৈরি করুন')}</span>
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 pt-6" noValidate>
                {generalError && (
                  <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs flex items-center gap-2.5" role="alert">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>{generalError}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="lead-name" className="block text-xs font-bold text-[#0B1730] dark:text-slate-300 mb-1">
                      {pick('Full Name', 'পূর্ণ নাম')} <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="lead-name"
                      type="text"
                      required
                      placeholder={pick('Your full name', 'আপনার পূর্ণ নাম লিখুন')}
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        if (fieldErrors.name) setFieldErrors((prev) => ({ ...prev, name: '' }));
                      }}
                      className={`w-full text-xs bg-white dark:bg-slate-800 border rounded-xl p-3 text-[#0B1730] dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-[#0345A4] ${
                        fieldErrors.name ? 'border-rose-400' : 'border-[#D7E2F3] dark:border-slate-700'
                      }`}
                    />
                    {fieldErrors.name && (
                      <p className="text-[11px] text-rose-600 mt-1">{fieldErrors.name}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="lead-phone" className="block text-xs font-bold text-[#0B1730] dark:text-slate-300 mb-1">
                      {pick('Phone / WhatsApp Number', 'ফোন / হোয়াটসঅ্যাপ নম্বর')} <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="lead-phone"
                      type="tel"
                      required
                      placeholder="+880 1XXX-XXXXXX"
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value);
                        if (fieldErrors.phone) setFieldErrors((prev) => ({ ...prev, phone: '' }));
                      }}
                      className={`w-full text-xs bg-white dark:bg-slate-800 border rounded-xl p-3 text-[#0B1730] dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-[#0345A4] ${
                        fieldErrors.phone ? 'border-rose-400' : 'border-[#D7E2F3] dark:border-slate-700'
                      }`}
                    />
                    {fieldErrors.phone && (
                      <p className="text-[11px] text-rose-600 mt-1">{fieldErrors.phone}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="lead-email" className="block text-xs font-bold text-[#0B1730] dark:text-slate-300 mb-1">
                      {pick('Email Address', 'ইমেইল ঠিকানা')} <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="lead-email"
                      type="email"
                      required
                      placeholder="name@company.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (fieldErrors.email) setFieldErrors((prev) => ({ ...prev, email: '' }));
                      }}
                      className={`w-full text-xs bg-white dark:bg-slate-800 border rounded-xl p-3 text-[#0B1730] dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-[#0345A4] ${
                        fieldErrors.email ? 'border-rose-400' : 'border-[#D7E2F3] dark:border-slate-700'
                      }`}
                    />
                    {fieldErrors.email && (
                      <p className="text-[11px] text-rose-600 mt-1">{fieldErrors.email}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="lead-company" className="block text-xs font-bold text-[#0B1730] dark:text-slate-300 mb-1">
                      {pick('Company / Organization (Optional)', 'প্রতিষ্ঠান / কোম্পানির নাম (ঐচ্ছিক)')}
                    </label>
                    <input
                      id="lead-company"
                      type="text"
                      placeholder={pick('Your business name', 'আপনার প্রতিষ্ঠানের নাম')}
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      className="w-full text-xs bg-white dark:bg-slate-800 border border-[#D7E2F3] dark:border-slate-700 rounded-xl p-3 text-[#0B1730] dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-[#0345A4]"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="lead-category" className="block text-xs font-bold text-[#0B1730] dark:text-slate-300 mb-1">
                    {pick('Area of Interest', 'আগ্রহের সেবা / বিভাগ')}
                  </label>
                  <select
                    id="lead-category"
                    value={serviceCategory}
                    onChange={(e) => setServiceCategory(e.target.value)}
                    className="w-full text-xs bg-white dark:bg-slate-800 border border-[#D7E2F3] dark:border-slate-700 rounded-xl p-3 text-[#0B1730] dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-[#0345A4]"
                  >
                    <optgroup label={pick('Professional Services', 'পেশাদার সেবাসমূহ')}>
                      <option value="Accounting & Bookkeeping">
                        {pick('Accounting & Bookkeeping', 'অ্যাকাউন্টিং ও বুককিপিং')}
                      </option>
                      <option value="Payroll & Business Operations">
                        {pick('Payroll & Business Operations', 'পেরোল ও বিজনেস অপারেশনস')}
                      </option>
                      <option value="Income Tax & VAT Support">
                        {pick('Income Tax & VAT Support', 'আয়কর ও ভ্যাট সহায়তা')}
                      </option>
                      <option value="QuickBooks / Xero / Excel Automation">
                        {pick('QuickBooks / Xero / Excel Automation', 'কুইকবুকস / জেরো / এক্সেল অটোমেশন')}
                      </option>
                      <option value="Website or Custom Software Dev">
                        {pick('Website or Custom Software Development', 'ওয়েবসাইট বা কাস্টম সফটওয়্যার ডেভেলপমেন্ট')}
                      </option>
                      <option value="BPO & Back-Office Support">
                        {pick('BPO & Back-Office Operations', 'বিপিও ও ব্যাক-অফিস সহায়তা')}
                      </option>
                    </optgroup>
                    <optgroup label={pick('Software Portfolio', 'সফটওয়্যার পোর্টফোলিও')}>
                      <option value="TecHisab Business / ERP">
                        {pick('TecHisab Business / TecHisab ERP', 'টেকহিসাব বিজনেস / ইআরপি')}
                      </option>
                      <option value="TecHisab Cloud Accounting / One">
                        {pick('TecHisab Cloud Accounting / One', 'টেকহিসাব ক্লাউড অ্যাকাউন্টিং / ওয়ান')}
                      </option>
                      <option value="Retail Manager / POS Pro">
                        {pick('TecHisab Retail Manager / POS Pro', 'টেকহিসাব রিটেইল ম্যানেজার / পিওএস প্রো')}
                      </option>
                      <option value="Trade Manager / Inventory Pro">
                        {pick('TecHisab Trade Manager / Inventory Pro', 'টেকহিসাব ট্রেড ম্যানেজার / ইনভেন্টরি প্রো')}
                      </option>
                      <option value="Jibon (জীবন) Personal App">
                        {pick('Jibon (জীবন) Mobile App', 'জীবন (Jibon) ব্যক্তিগত ফাইন্যান্স অ্যাপ')}
                      </option>
                    </optgroup>
                    <optgroup label={pick('Training Programs', 'প্রশিক্ষণ প্রোগ্রাম')}>
                      <option value="Course Admission / Corporate Training">
                        {pick('Course Admission / Corporate Workshop', 'কোর্স ভর্তি / কর্পোরেট প্রশিক্ষণ')}
                      </option>
                    </optgroup>
                  </select>
                </div>

                <div>
                  <label htmlFor="lead-message" className="block text-xs font-bold text-[#0B1730] dark:text-slate-300 mb-1">
                    {pick('Project Scope or Question', 'প্রয়োজনের বিবরণ বা প্রশ্ন')} <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    id="lead-message"
                    required
                    rows={4}
                    placeholder={pick(
                      'Briefly describe your accounting volume, software goals, tax questions, or training batch preference...',
                      'আপনার লেনদেনের পরিমাণ, সফটওয়্যার চাহিদা, কর-ভ্যাট প্রশ্ন বা পছন্দের প্রশিক্ষণ ব্যাচ সম্পর্কে সংক্ষেপে লিখুন...'
                    )}
                    value={message}
                    onChange={(e) => {
                      setMessage(e.target.value);
                      if (fieldErrors.message) setFieldErrors((prev) => ({ ...prev, message: '' }));
                    }}
                    className={`w-full text-xs bg-white dark:bg-slate-800 border rounded-xl p-3 text-[#0B1730] dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-[#0345A4] ${
                      fieldErrors.message ? 'border-rose-400' : 'border-[#D7E2F3] dark:border-slate-700'
                    }`}
                  />
                  {fieldErrors.message && (
                    <p className="text-[11px] text-rose-600 mt-1">{fieldErrors.message}</p>
                  )}
                </div>

                <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <span className="text-[11px] text-[#5F6D82]">
                    {pick('Official Email:', 'অফিসিয়াল ইমেইল:')} {site.contact.email} &bull; {site.contact.phoneDisplay}
                  </span>

                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl bg-[#0345A4] hover:bg-[#02377F] text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>{pick('Prepare Consultation Message', 'পরামর্শ বার্তা তৈরি করুন')}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};


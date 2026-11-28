import React, { useState } from 'react';
import { getLocalizedSiteConfig } from '../../data/localizedData';
import { useLanguage } from '../../context/LanguageContext';
import { BrandLogo } from './BrandLogo';
import { NavigationTab, SoftwareDemoKey } from '../../types';
import { SocialLinks } from './SocialLinks';
import { BlueAbstractBackdrop } from './BlueAbstractBackdrop';
import { buildPathForState } from '../../utils/routing';
import { trackConversion } from '../../utils/analytics';
import {
  Phone,
  Mail,
  MapPin,
  ArrowUpRight,
  Send,
  CheckCircle2,
  AlertCircle,
  FileText,
  Lock,
  Scale,
  RotateCcw,
} from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: NavigationTab) => void;
  onSelectServiceSlug?: (slug: string) => void;
  onSelectSoftwareDemoTab?: (demo: SoftwareDemoKey) => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  onSelectServiceSlug,
  onSelectSoftwareDemoTab,
}) => {
  const { isBengali, pick } = useLanguage();
  const site = getLocalizedSiteConfig(isBengali);
  const currentYear = new Date().getFullYear();

  const [digestEmail, setDigestEmail] = useState('');
  const [digestStatus, setDigestStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [digestMessage, setDigestMessage] = useState('');

  const handleNav = (tab: NavigationTab) => {
    onNavigate(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAnchorNav = (e: React.MouseEvent<HTMLAnchorElement>, tab: NavigationTab) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    handleNav(tab);
  };

  const handleServiceAnchor = (e: React.MouseEvent<HTMLAnchorElement>, slug: string) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    if (onSelectServiceSlug) {
      onSelectServiceSlug(slug);
    } else {
      handleNav('services');
    }
  };

  const handleSoftwareAnchor = (e: React.MouseEvent<HTMLAnchorElement>, demo: SoftwareDemoKey) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    if (onSelectSoftwareDemoTab) {
      onSelectSoftwareDemoTab(demo);
    }
    handleNav('software');
  };

  const handleDigestRequest = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = digestEmail.trim();
    if (!cleaned || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleaned)) {
      setDigestStatus('error');
      setDigestMessage(
        pick('Please enter a valid email address.', 'অনুগ্রহ করে একটি সঠিক ইমেইল ঠিকানা লিখুন।')
      );
      return;
    }

    trackConversion('cta_click', { location: 'footer_digest', label: 'footer_digest_request' });

    const subject = encodeURIComponent('Subscribe: TecHisab Tax, VAT & Software Updates');
    const body = encodeURIComponent(
      `Hello TecHisab Team,\n\nPlease add my email (${cleaned}) to your Bangladesh Tax, VAT & Software regulatory update list.\n`
    );
    window.location.href = `mailto:${site.contact.email}?subject=${subject}&body=${body}`;
    setDigestStatus('success');
    setDigestMessage(
      pick(
        `Email draft prepared for ${site.contact.email}. You may also message us directly on WhatsApp (${site.contact.phoneDisplay}).`,
        `${site.contact.email} ঠিকানায় ইমেইল খসড়া প্রস্তুত হয়েছে। এছাড়াও সরাসরি হোয়াটসঅ্যাপে (${site.contact.phoneDisplay}) বার্তা পাঠাতে পারেন।`
      )
    );
    setDigestEmail('');
  };

  return (
    <footer
      id="main-site-footer"
      className="relative overflow-hidden bg-[#02377F] text-slate-200 pt-16 pb-10 border-t border-[#0A63D8]/40"
    >
      <BlueAbstractBackdrop variant="footer" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Top Brand & Direct Contact Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-10 border-b border-white/15">
          <div className="lg:col-span-5 space-y-4">
            <BrandLogo size="lg" themeMode="dark" />
            <p className="text-sm text-sky-100/85 max-w-md leading-relaxed">
              {site.description}
            </p>
            <div className="flex flex-wrap items-center gap-2 text-xs text-sky-200">
              <span className="px-3 py-1 rounded-lg bg-white/10 border border-white/15 font-medium">
                {site.category}
              </span>
              <span className="px-3 py-1 rounded-lg bg-white/10 border border-white/15 font-medium font-bangla">
                {site.banglaTagline}
              </span>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white/5 p-4 rounded-xl border border-white/15 space-y-1.5">
              <div className="flex items-center gap-2 text-sky-300 font-semibold text-xs uppercase tracking-wider">
                <Phone className="w-4 h-4" />
                <span>{pick('Phone & WhatsApp', 'ফোন ও হোয়াটসঅ্যাপ')}</span>
              </div>
              <a
                href={`tel:${site.contact.phone}`}
                onClick={() => trackConversion('phone_click', { location: 'footer' })}
                className="block text-white font-bold hover:text-sky-200 transition-colors text-sm"
              >
                {site.contact.phoneDisplay}
              </a>
              <p className="text-[11px] text-sky-100/70">
                {pick('Sat – Thu, 9:00 AM – 7:00 PM', 'শনি – বৃহঃ, সকাল ৯:০০ – সন্ধ্যা ৭:০০')}
              </p>
            </div>

            <div className="bg-white/5 p-4 rounded-xl border border-white/15 space-y-1.5">
              <div className="flex items-center gap-2 text-sky-300 font-semibold text-xs uppercase tracking-wider">
                <Mail className="w-4 h-4" />
                <span>{pick('Official Email', 'অফিসিয়াল ইমেইল')}</span>
              </div>
              <a
                href={`mailto:${site.contact.email}`}
                onClick={() => trackConversion('email_click', { location: 'footer' })}
                className="block text-white font-bold hover:text-sky-200 transition-colors text-sm truncate"
              >
                {site.contact.email}
              </a>
              <p className="text-[11px] text-sky-100/70">{site.website}</p>
            </div>

            <div className="bg-white/5 p-4 rounded-xl border border-white/15 space-y-1.5">
              <div className="flex items-center gap-2 text-sky-300 font-semibold text-xs uppercase tracking-wider">
                <MapPin className="w-4 h-4" />
                <span>{pick('Corporate Office', 'কর্পোরেট অফিস')}</span>
              </div>
              <p className="text-sky-100 text-xs leading-snug">
                {site.contact.address}
              </p>
              <a
                href={site.contact.mapDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[11px] text-sky-300 hover:text-white font-medium"
              >
                <span>{pick('Open Map', 'ম্যাপে দেখুন')}</span>
                <ArrowUpRight className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Statutory Update Request Bar */}
        <div className="p-6 sm:p-7 rounded-2xl bg-[#0345A4]/70 border border-white/15 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
          <div className="space-y-1 max-w-xl">
            <span className="text-[11px] font-bold uppercase tracking-wider text-sky-200 block">
              {pick('Bangladesh Tax, VAT & Software Updates', 'বাংলাদেশ ট্যাক্স, ভ্যাট ও সফটওয়্যার আপডেট')}
            </span>
            <h2 className="text-base sm:text-lg font-bold text-white">
              {pick(
                'Request Statutory & Advisory Briefings via Email',
                'ইমেইলে বিধিবদ্ধ ও পরামর্শমূলক আপডেট পেতে অনুরোধ করুন'
              )}
            </h2>
            <p className="text-xs text-sky-100/80">
              {pick(
                'Prepare a quick briefing request to receive updates on Income Tax Act 2023 guidance, VAT rules, and TecHisab software releases.',
                'আয়কর আইন ২০২৩ নির্দেশিকা, ভ্যাট বিধিমালা এবং টেকহিসাব সফটওয়্যারের নতুন রিলিজ সংক্রান্ত নিয়মিত আপডেট পেতে আপনার ইমেইল জমা দিন।'
              )}
            </p>
          </div>

          <form onSubmit={handleDigestRequest} className="w-full lg:w-auto shrink-0 flex flex-col sm:flex-row gap-2.5">
            <input
              type="email"
              value={digestEmail}
              onChange={(e) => setDigestEmail(e.target.value)}
              placeholder={pick('Enter business or personal email', 'আপনার ব্যবসার বা ব্যক্তিগত ইমেইল লিখুন')}
              aria-label={pick('Email address for statutory updates', 'ইমেইল ঠিকানা')}
              className="w-full sm:w-72 px-4 py-2.5 rounded-xl bg-[#0B1730]/60 border border-white/20 text-xs text-white placeholder-sky-200/60 focus:outline-none focus:ring-2 focus:ring-sky-300"
              required
            />
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-white hover:bg-[#F4F8FF] text-[#0345A4] text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{pick('Request Updates', 'আপডেট অনুরোধ করুন')}</span>
            </button>
          </form>
        </div>

        {digestMessage && (
          <div
            className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
              digestStatus === 'success'
                ? 'bg-emerald-950/60 border border-emerald-400/30 text-emerald-200'
                : 'bg-rose-950/60 border border-rose-400/30 text-rose-200'
            }`}
          >
            {digestStatus === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            )}
            <span>{digestMessage}</span>
          </div>
        )}

        {/* Navigation Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 py-6 border-b border-white/15 text-sm">
          <div>
            <h3 className="font-bold text-xs uppercase tracking-wider mb-3 text-sky-200">
              {pick('Company', 'প্রতিষ্ঠান')}
            </h3>
            <ul className="space-y-2 text-sky-100/85">
              <li>
                <a href="/" onClick={(e) => handleAnchorNav(e, 'home')} className="hover:text-white text-left inline-block">
                  {pick('Home', 'হোম')}
                </a>
              </li>
              <li>
                <a href="/about" onClick={(e) => handleAnchorNav(e, 'about')} className="hover:text-white text-left inline-block">
                  {pick('About TecHisab', 'টেকহিসাব পরিচিতি')}
                </a>
              </li>
              <li>
                <a href="/pricing" onClick={(e) => handleAnchorNav(e, 'pricing')} className="hover:text-white text-left inline-block">
                  {pick('Pricing & Packages', 'মূল্যতালিকা ও প্যাকেজ')}
                </a>
              </li>
              <li>
                <a href="/blog" onClick={(e) => handleAnchorNav(e, 'blog')} className="hover:text-white text-left inline-block">
                  {pick('Knowledge Blog', 'জ্ঞানভাণ্ডার ব্লগ')}
                </a>
              </li>
              <li>
                <a href="/contact" onClick={(e) => handleAnchorNav(e, 'contact')} className="hover:text-white text-left inline-block">
                  {pick('Contact Us', 'যোগাযোগ করুন')}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-xs uppercase tracking-wider mb-3 text-sky-200">
              {pick('Services', 'সেবাসমূহ')}
            </h3>
            <ul className="space-y-2 text-sky-100/85">
              <li>
                <a
                  href="/services/bookkeeping-accounting"
                  onClick={(e) => handleServiceAnchor(e, 'bookkeeping-accounting')}
                  className="hover:text-white text-left inline-block"
                >
                  {pick('Accounting & Bookkeeping', 'অ্যাকাউন্টিং ও বুককিপিং')}
                </a>
              </li>
              <li>
                <a
                  href="/services/payroll-salary-processing"
                  onClick={(e) => handleServiceAnchor(e, 'payroll-salary-processing')}
                  className="hover:text-white text-left inline-block"
                >
                  {pick('Payroll & Operations', 'পেরোল ও অপারেশনস')}
                </a>
              </li>
              <li>
                <a
                  href="/services/tax-vat-documentation"
                  onClick={(e) => handleServiceAnchor(e, 'tax-vat-documentation')}
                  className="hover:text-white text-left inline-block"
                >
                  {pick('Tax & VAT Support', 'ট্যাক্স ও ভ্যাট সহায়তা')}
                </a>
              </li>
              <li>
                <a
                  href="/services/bpo-data-processing"
                  onClick={(e) => handleServiceAnchor(e, 'bpo-data-processing')}
                  className="hover:text-white text-left inline-block"
                >
                  {pick('BPO & Back-Office', 'বিপিও ও ব্যাক-অফিস')}
                </a>
              </li>
              <li>
                <a
                  href="/services/business-software-website-development"
                  onClick={(e) => handleServiceAnchor(e, 'business-software-website-development')}
                  className="hover:text-white text-left inline-block"
                >
                  {pick('Software & Automation', 'সফটওয়্যার ও অটোমেশন')}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-xs uppercase tracking-wider mb-3 text-sky-200">
              {pick('Software Portfolio', 'সফটওয়্যার পোর্টফোলিও')}
            </h3>
            <ul className="space-y-2 text-sky-100/85">
              <li>
                <a
                  href="/software"
                  onClick={(e) => handleSoftwareAnchor(e, 'business')}
                  className="hover:text-white text-left inline-block"
                >
                  {pick('TecHisab Business & ERP', 'টেকহিসাব বিজনেস ও ইআরপি')}
                </a>
              </li>
              <li>
                <a
                  href="/software/cloud-accounting"
                  onClick={(e) => handleSoftwareAnchor(e, 'cloud-accounting')}
                  className="hover:text-white text-left inline-block"
                >
                  {pick('Cloud Accounting & One', 'ক্লাউড অ্যাকাউন্টিং ও ওয়ান')}
                </a>
              </li>
              <li>
                <a
                  href="/software/retail-manager"
                  onClick={(e) => handleSoftwareAnchor(e, 'retail-manager')}
                  className="hover:text-white text-left inline-block"
                >
                  {pick('Retail Manager & POS Pro', 'রিটেইল ম্যানেজার ও পিওএস প্রো')}
                </a>
              </li>
              <li>
                <a
                  href="/software/trade-manager"
                  onClick={(e) => handleSoftwareAnchor(e, 'trade-manager')}
                  className="hover:text-white text-left inline-block"
                >
                  {pick('Trade & Inventory Pro', 'ট্রেড ও ইনভেন্টরি প্রো')}
                </a>
              </li>
              <li>
                <a
                  href="/software/jibon"
                  onClick={(e) => handleSoftwareAnchor(e, 'jibon')}
                  className="hover:text-white text-left inline-block"
                >
                  {pick('Jibon (জীবন) App', 'জীবন (Jibon) অ্যাপ')}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-xs uppercase tracking-wider mb-3 text-sky-200">
              {pick('Training', 'প্রশিক্ষণ')}
            </h3>
            <ul className="space-y-2 text-sky-100/85">
              <li>
                <a
                  href="/services/practical-accounting-computer-training"
                  onClick={(e) => handleServiceAnchor(e, 'practical-accounting-computer-training')}
                  className="hover:text-white text-left inline-block"
                >
                  {pick('Practical Accounting', 'প্র্যাকটিক্যাল অ্যাকাউন্টিং')}
                </a>
              </li>
              <li>
                <a
                  href="/services/quickbooks-online-accounting-support"
                  onClick={(e) => handleServiceAnchor(e, 'quickbooks-online-accounting-support')}
                  className="hover:text-white text-left inline-block"
                >
                  {pick('QuickBooks & Xero', 'কুইকবুকস ও জেরো')}
                </a>
              </li>
              <li>
                <a
                  href="/services/excel-google-sheets-automation"
                  onClick={(e) => handleServiceAnchor(e, 'excel-google-sheets-automation')}
                  className="hover:text-white text-left inline-block"
                >
                  {pick('Excel & Google Sheets', 'এক্সেল ও গুগল শিটস')}
                </a>
              </li>
              <li>
                <a
                  href="/services/tax-vat-documentation"
                  onClick={(e) => handleServiceAnchor(e, 'tax-vat-documentation')}
                  className="hover:text-white text-left inline-block"
                >
                  {pick('Tax & VAT Fundamentals', 'ট্যাক্স ও ভ্যাট প্রশিক্ষণ')}
                </a>
              </li>
              <li>
                <a href="/training" onClick={(e) => handleAnchorNav(e, 'training')} className="hover:text-white text-left inline-block">
                  {pick('All Courses Directory', 'সকল প্রশিক্ষণ কোর্স')}
                </a>
              </li>
            </ul>
          </div>

          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <h3 className="font-bold text-xs uppercase tracking-wider mb-3 text-sky-200">
              {pick('Legal & Governance', 'আইন ও নীতিমালা')}
            </h3>
            <ul className="space-y-2 text-sky-100/85">
              <li>
                <a
                  href={buildPathForState({ tab: 'privacy-policy' })}
                  onClick={(e) => handleAnchorNav(e, 'privacy-policy')}
                  className="hover:text-white transition-colors text-left flex items-center gap-1.5"
                >
                  <Lock className="w-3.5 h-3.5 text-sky-300" />
                  <span>{pick('Privacy Policy', 'গোপনীয়তা নীতি')}</span>
                </a>
              </li>
              <li>
                <a
                  href={buildPathForState({ tab: 'terms-of-service' })}
                  onClick={(e) => handleAnchorNav(e, 'terms-of-service')}
                  className="hover:text-white transition-colors text-left flex items-center gap-1.5"
                >
                  <Scale className="w-3.5 h-3.5 text-sky-300" />
                  <span>{pick('Terms of Service', 'সেবার শর্তাবলি')}</span>
                </a>
              </li>
              <li>
                <a
                  href={buildPathForState({ tab: 'refund-policy' })}
                  onClick={(e) => handleAnchorNav(e, 'refund-policy')}
                  className="hover:text-white transition-colors text-left flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-sky-300" />
                  <span>{pick('Refund & Cancellation', 'রিফান্ড ও বাতিলকরণ')}</span>
                </a>
              </li>
              <li>
                <a
                  href={buildPathForState({ tab: 'tax-disclaimer' })}
                  onClick={(e) => handleAnchorNav(e, 'tax-disclaimer')}
                  className="hover:text-white transition-colors text-left flex items-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5 text-amber-300" />
                  <span>{pick('Tax Disclaimer', 'কর ও বিধিবদ্ধ ঘোষণা')}</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Socials & Copyright */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-sky-100/80">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <span className="font-semibold text-white">
              {pick('Official Channels:', 'অফিসিয়াল চ্যানেলসমূহ:')}
            </span>
            <SocialLinks size="sm" />
          </div>

          <div className="text-center md:text-right space-y-1">
            <p>
              &copy; {currentYear} {pick('TecHisab', 'টেকহিসাব (TecHisab)')}.{' '}
              {pick(
                `All rights reserved. ${site.category} Solutions.`,
                `সর্বস্বত্ব সংরক্ষিত। ${site.category} সমাধান।`
              )}
            </p>
            <p className="text-sky-200/80 text-[11px] font-bangla">
              {site.banglaTagline} &mdash; {site.englishTagline}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};


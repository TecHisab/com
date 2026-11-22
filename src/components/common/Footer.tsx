import React, { useState } from 'react';
import { getLocalizedSiteConfig } from '../../data/localizedData';
import { useLanguage } from '../../context/LanguageContext';
import { BrandLogo } from './BrandLogo';
import { NavigationTab } from '../../types';
import { SocialLinks } from './SocialLinks';
import { BlueAbstractBackdrop } from './BlueAbstractBackdrop';
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
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
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
                rel="noreferrer"
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
            <h4 className="text-base sm:text-lg font-bold text-white">
              {pick(
                'Request Statutory & Advisory Briefings via Email',
                'ইমেইলে বিধিবদ্ধ ও পরামর্শমূলক আপডেট পেতে অনুরোধ করুন'
              )}
            </h4>
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
            <h4 className="font-bold text-xs uppercase tracking-wider mb-3 text-sky-200">
              {pick('Company', 'প্রতিষ্ঠান')}
            </h4>
            <ul className="space-y-2 text-sky-100/85">
              <li>
                <button type="button" onClick={() => handleNav('home')} className="hover:text-white cursor-pointer text-left">
                  {pick('Home', 'হোম')}
                </button>
              </li>
              <li>
                <button type="button" onClick={() => handleNav('about')} className="hover:text-white cursor-pointer text-left">
                  {pick('About TecHisab', 'টেকহিসাব পরিচিতি')}
                </button>
              </li>
              <li>
                <button type="button" onClick={() => handleNav('pricing')} className="hover:text-white cursor-pointer text-left">
                  {pick('Pricing & Packages', 'মূল্যতালিকা ও প্যাকেজ')}
                </button>
              </li>
              <li>
                <button type="button" onClick={() => handleNav('blog')} className="hover:text-white cursor-pointer text-left">
                  {pick('Knowledge Blog', 'জ্ঞানভাণ্ডার ব্লগ')}
                </button>
              </li>
              <li>
                <button type="button" onClick={() => handleNav('contact')} className="hover:text-white cursor-pointer text-left">
                  {pick('Contact Us', 'যোগাযোগ করুন')}
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider mb-3 text-sky-200">
              {pick('Services', 'সেবাসমূহ')}
            </h4>
            <ul className="space-y-2 text-sky-100/85">
              <li>
                <button type="button" onClick={() => handleNav('services')} className="hover:text-white cursor-pointer text-left">
                  {pick('Accounting & Bookkeeping', 'অ্যাকাউন্টিং ও বুককিপিং')}
                </button>
              </li>
              <li>
                <button type="button" onClick={() => handleNav('services')} className="hover:text-white cursor-pointer text-left">
                  {pick('Payroll & Operations', 'পেরোল ও অপারেশনস')}
                </button>
              </li>
              <li>
                <button type="button" onClick={() => handleNav('services')} className="hover:text-white cursor-pointer text-left">
                  {pick('Tax & VAT Support', 'ট্যাক্স ও ভ্যাট সহায়তা')}
                </button>
              </li>
              <li>
                <button type="button" onClick={() => handleNav('services')} className="hover:text-white cursor-pointer text-left">
                  {pick('BPO & Back-Office', 'বিপিও ও ব্যাক-অফিস')}
                </button>
              </li>
              <li>
                <button type="button" onClick={() => handleNav('services')} className="hover:text-white cursor-pointer text-left">
                  {pick('Software & Automation', 'সফটওয়্যার ও অটোমেশন')}
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider mb-3 text-sky-200">
              {pick('Software Portfolio', 'সফটওয়্যার পোর্টফোলিও')}
            </h4>
            <ul className="space-y-2 text-sky-100/85">
              <li>
                <button type="button" onClick={() => handleNav('software')} className="hover:text-white cursor-pointer text-left">
                  {pick('TecHisab Business & ERP', 'টেকহিসাব বিজনেস ও ইআরপি')}
                </button>
              </li>
              <li>
                <button type="button" onClick={() => handleNav('software')} className="hover:text-white cursor-pointer text-left">
                  {pick('Cloud Accounting & One', 'ক্লাউড অ্যাকাউন্টিং ও ওয়ান')}
                </button>
              </li>
              <li>
                <button type="button" onClick={() => handleNav('software')} className="hover:text-white cursor-pointer text-left">
                  {pick('Retail Manager & POS Pro', 'রিটেইল ম্যানেজার ও পিওএস প্রো')}
                </button>
              </li>
              <li>
                <button type="button" onClick={() => handleNav('software')} className="hover:text-white cursor-pointer text-left">
                  {pick('Trade & Inventory Pro', 'ট্রেড ও ইনভেন্টরি প্রো')}
                </button>
              </li>
              <li>
                <button type="button" onClick={() => handleNav('software')} className="hover:text-white cursor-pointer text-left">
                  {pick('Jibon (জীবন) App', 'জীবন (Jibon) অ্যাপ')}
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider mb-3 text-sky-200">
              {pick('Training', 'প্রশিক্ষণ')}
            </h4>
            <ul className="space-y-2 text-sky-100/85">
              <li>
                <button type="button" onClick={() => handleNav('training')} className="hover:text-white cursor-pointer text-left">
                  {pick('Practical Accounting', 'প্র্যাকটিক্যাল অ্যাকাউন্টিং')}
                </button>
              </li>
              <li>
                <button type="button" onClick={() => handleNav('training')} className="hover:text-white cursor-pointer text-left">
                  {pick('QuickBooks & Xero', 'কুইকবুকস ও জেরো')}
                </button>
              </li>
              <li>
                <button type="button" onClick={() => handleNav('training')} className="hover:text-white cursor-pointer text-left">
                  {pick('Excel & Google Sheets', 'এক্সেল ও গুগল শিটস')}
                </button>
              </li>
              <li>
                <button type="button" onClick={() => handleNav('training')} className="hover:text-white cursor-pointer text-left">
                  {pick('Tax & VAT Fundamentals', 'ট্যাক্স ও ভ্যাট প্রশিক্ষণ')}
                </button>
              </li>
              <li>
                <button type="button" onClick={() => handleNav('training')} className="hover:text-white cursor-pointer text-left">
                  {pick('All Courses Directory', 'সকল প্রশিক্ষণ কোর্স')}
                </button>
              </li>
            </ul>
          </div>

          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <h4 className="font-bold text-xs uppercase tracking-wider mb-3 text-sky-200">
              {pick('Legal & Governance', 'আইন ও নীতিমালা')}
            </h4>
            <ul className="space-y-2 text-sky-100/85">
              <li>
                <button
                  type="button"
                  onClick={() => handleNav('privacy-policy')}
                  className="hover:text-white transition-colors cursor-pointer text-left flex items-center gap-1.5"
                >
                  <Lock className="w-3.5 h-3.5 text-sky-300" />
                  <span>{pick('Privacy Policy', 'গোপনীয়তা নীতি')}</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNav('terms-of-service')}
                  className="hover:text-white transition-colors cursor-pointer text-left flex items-center gap-1.5"
                >
                  <Scale className="w-3.5 h-3.5 text-sky-300" />
                  <span>{pick('Terms of Service', 'সেবার শর্তাবলি')}</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNav('refund-policy')}
                  className="hover:text-white transition-colors cursor-pointer text-left flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-sky-300" />
                  <span>{pick('Refund & Cancellation', 'রিফান্ড ও বাতিলকরণ')}</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNav('tax-disclaimer')}
                  className="hover:text-white transition-colors cursor-pointer text-left flex items-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5 text-amber-300" />
                  <span>{pick('Tax Disclaimer', 'কর ও বিধিবদ্ধ ঘোষণা')}</span>
                </button>
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


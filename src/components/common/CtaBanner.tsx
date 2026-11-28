import React from 'react';
import { ArrowRight, MessageCircle, PhoneCall } from 'lucide-react';
import { SITE_CONFIG } from '../../data/siteData';
import { useLanguage } from '../../context/LanguageContext';
import { BlueAbstractBackdrop } from './BlueAbstractBackdrop';
import { trackConversion } from '../../utils/analytics';

interface CtaBannerProps {
  headline?: string;
  subheadline?: string;
  primaryButtonText?: string;
  onPrimaryClick: () => void;
  onSecondaryClick?: () => void;
}

export const CtaBanner: React.FC<CtaBannerProps> = ({
  headline,
  subheadline,
  primaryButtonText,
  onPrimaryClick,
}) => {
  const { pick } = useLanguage();

  const resolvedHeadline =
    headline || pick('Ready to Make Your Business Simpler?', 'আপনার ব্যবসাকে আরও সহজ করতে প্রস্তুত?');
  const resolvedSubheadline =
    subheadline ||
    pick(
      'Connect with TecHisab for accounting, financial management, business software, technology and training solutions.',
      'অ্যাকাউন্টিং, ফাইন্যান্সিয়াল ম্যানেজমেন্ট, বিজনেস সফটওয়্যার, প্রযুক্তি ও প্রশিক্ষণ সমাধানের জন্য টেকহিসাবের সাথে যুক্ত হোন।'
    );
  const resolvedButtonText =
    primaryButtonText || pick('Request a Consultation', 'পরামর্শের জন্য অনুরোধ করুন');

  return (
    <section className="relative overflow-hidden my-12 rounded-2xl bg-[#02377F] text-white p-8 sm:p-12 border border-[#0A63D8]/40 shadow-xl">
      <BlueAbstractBackdrop variant="banner" />
      <div className="relative z-10 max-w-4xl mx-auto text-center space-y-5">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-sky-200 font-bangla">
          {SITE_CONFIG.banglaTagline} &bull; {SITE_CONFIG.englishTagline}
        </p>

        <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-snug">
          {resolvedHeadline}
        </h2>

        <p className="text-base sm:text-lg text-sky-100/90 max-w-2xl mx-auto leading-relaxed">
          {resolvedSubheadline}
        </p>

        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          <a
            href="/contact"
            onClick={(e) => {
              trackConversion('cta_click', { label: 'cta-banner-primary' });
              if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0) {
                e.preventDefault();
                onPrimaryClick();
              }
            }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white hover:bg-[#F4F8FF] text-[#0345A4] font-bold text-sm shadow-md transition-all cursor-pointer active:scale-98"
          >
            <span>{resolvedButtonText}</span>
            <ArrowRight className="w-4 h-4" />
          </a>

          <a
            href={SITE_CONFIG.contact.whatsappUrl}
            target="_blank"
            rel="noreferrer"
            onClick={() => trackConversion('whatsapp_click', { label: 'cta-banner-whatsapp' })}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/25 font-semibold text-sm transition-all"
          >
            <MessageCircle className="w-4 h-4 text-emerald-300" />
            <span>{pick('Chat on WhatsApp', 'হোয়াটসঅ্যাপে কথা বলুন')}</span>
          </a>

          <a
            href={`tel:${SITE_CONFIG.contact.phone}`}
            onClick={() => trackConversion('phone_click', { label: 'cta-banner-phone' })}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-transparent hover:bg-white/10 text-sky-100 border border-white/20 font-semibold text-sm transition-all"
          >
            <PhoneCall className="w-4 h-4" />
            <span>{SITE_CONFIG.contact.phoneDisplay}</span>
          </a>
        </div>
      </div>
    </section>
  );
};

import React, { useState } from 'react';
import { ServiceLandingPageData, SoftwareDemoKey } from '../../types';
import { getServiceLandingBySlug } from '../../data/serviceLandingData';
import { getBlogPostBySlug } from '../../data/blogData';
import { localizeBlogPost } from '../../data/localizedData';
import { SITE_CONFIG } from '../../data/siteData';
import { useLanguage } from '../../context/LanguageContext';
import { trackConversion } from '../../utils/analytics';
import { CtaBanner } from '../common/CtaBanner';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Users,
  Sparkles,
  FileCheck2,
  ChevronDown,
  MessageCircle,
  PhoneCall,
  Monitor,
  BookOpen,
  Layers,
  MapPin,
} from 'lucide-react';

interface ServiceLandingPageProps {
  service: ServiceLandingPageData;
  onNavigateServices: () => void;
  onSelectServiceSlug: (slug: string) => void;
  onOpenContact: () => void;
  onOpenSoftwareDemo: (demoKey: SoftwareDemoKey) => void;
  onOpenBlogSlug: (slug: string) => void;
}

export const ServiceLandingPage: React.FC<ServiceLandingPageProps> = ({
  service,
  onNavigateServices,
  onSelectServiceSlug,
  onOpenContact,
  onOpenSoftwareDemo,
  onOpenBlogSlug,
}) => {
  const { isBengali, pick } = useLanguage();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const h1 = isBengali ? service.h1Bn : service.h1;
  const badge = isBengali ? service.badgeBn : service.badge;
  const heroSummary = isBengali ? service.heroSummaryBn : service.heroSummary;
  const overviewParagraphs = isBengali ? service.overviewParagraphsBn : service.overviewParagraphs;
  const targetCustomers = isBengali ? service.targetCustomersBn : service.targetCustomers;
  const keyBenefits = isBengali ? service.keyBenefitsBn : service.keyBenefits;
  const howItWorks = isBengali ? service.howItWorksBn : service.howItWorks;
  const deliverables = isBengali ? service.deliverablesBn : service.deliverables;
  const faqs = isBengali ? service.faqsBn : service.faqs;
  const startingRate = isBengali ? service.startingRateBn : service.startingRate;

  const relatedServices = service.relatedSlugs
    .map((slug) => getServiceLandingBySlug(slug))
    .filter((item): item is ServiceLandingPageData => Boolean(item));

  const relatedPosts = (service.relatedBlogSlugs || [])
    .map((slug) => getBlogPostBySlug(slug))
    .filter((post): post is NonNullable<typeof post> => Boolean(post))
    .map((post) => localizeBlogPost(post, isBengali));

  const whatsappDirectUrl = `https://wa.me/${SITE_CONFIG.contact.whatsappNumber}?text=${encodeURIComponent(
    `Hello TecHisab Team, I would like to inquire about ${service.h1}.`
  )}`;

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, cb: () => void) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    cb();
  };

  return (
    <article className="py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
        {/* Top Hero Panel */}
        <header className="rounded-2xl bg-white dark:bg-slate-900 border border-[#D7E2F3] dark:border-slate-800 p-7 sm:p-10 shadow-xs space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <a
              href="/services"
              onClick={(e) => handleLinkClick(e, onNavigateServices)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0345A4] dark:text-sky-400 hover:underline"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{pick('All Business Services', 'সকল ব্যবসায়িক সেবা')}</span>
            </a>

            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-lg bg-[#F4F8FF] dark:bg-slate-800 border border-[#D7E2F3] dark:border-slate-700 text-[11px] font-bold uppercase tracking-wider text-[#0345A4] dark:text-sky-300">
                {badge}
              </span>
              {startingRate && (
                <span className="px-3 py-1 rounded-lg bg-[#0345A4] text-white text-[11px] font-bold tabular-nums">
                  {startingRate}
                </span>
              )}
            </div>
          </div>

          <div className="space-y-4 max-w-4xl">
            <h1 className="text-3xl sm:text-4xl lg:text-[2.6rem] font-extrabold text-[#0B1730] dark:text-white tracking-tight leading-tight">
              {h1}
            </h1>
            <p className="text-base sm:text-lg text-[#5F6D82] dark:text-slate-300 leading-relaxed">
              {heroSummary}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <a
              href="/contact"
              onClick={(e) => {
                trackConversion('service_quote_request', {
                  location: `/services/${service.slug}`,
                  label: service.slug,
                });
                handleLinkClick(e, onOpenContact);
              }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0345A4] hover:bg-[#02377F] text-white text-xs sm:text-sm font-bold shadow-sm transition-colors"
            >
              <span>{pick('Request Service Consultation', 'সেবার পরামর্শ অনুরোধ করুন')}</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <a
              href={whatsappDirectUrl}
              target="_blank"
              rel="noreferrer"
              onClick={() =>
                trackConversion('whatsapp_click', {
                  location: `/services/${service.slug}`,
                  label: service.slug,
                })
              }
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs sm:text-sm font-bold transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{pick('WhatsApp Inquiry', 'হোয়াটসঅ্যাপে কথা বলুন')}</span>
            </a>

            <a
              href={`tel:${SITE_CONFIG.contact.phone}`}
              onClick={() =>
                trackConversion('phone_click', {
                  location: `/services/${service.slug}`,
                  label: service.slug,
                })
              }
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#F4F8FF] dark:bg-slate-800 hover:border-[#0345A4] text-[#0B1730] dark:text-slate-200 border border-[#D7E2F3] dark:border-slate-700 text-xs sm:text-sm font-semibold transition-colors"
            >
              <PhoneCall className="w-4 h-4 text-[#0345A4] dark:text-sky-400" />
              <span>{SITE_CONFIG.contact.phoneDisplay}</span>
            </a>
          </div>
        </header>

        {/* Detailed Service Overview + Key Deliverables */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-2xl border border-[#D7E2F3] dark:border-slate-800 p-7 space-y-4 shadow-xs">
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#0B1730] dark:text-white">
              {pick('Service Overview & Practical Scope', 'সেবার বিবরণ ও বাস্তব কর্মপরিধি')}
            </h2>
            <div className="space-y-4 text-sm sm:text-[15px] text-[#5F6D82] dark:text-slate-300 leading-relaxed">
              {overviewParagraphs.map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>
          </div>

          <aside className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-2xl border border-[#D7E2F3] dark:border-slate-800 p-7 space-y-5 shadow-xs">
            <div className="flex items-center gap-2 text-[#0345A4] dark:text-sky-400">
              <FileCheck2 className="w-5 h-5" />
              <h2 className="text-lg font-extrabold text-[#0B1730] dark:text-white">
                {pick('Core Deliverables', 'মূল ডেলিভারেবলস ও আউটপুট')}
              </h2>
            </div>

            <ul className="space-y-2.5">
              {deliverables.map((item, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2.5 p-2.5 rounded-xl bg-[#F4F8FF] dark:bg-slate-800/70 border border-[#D7E2F3] dark:border-slate-700 text-xs sm:text-sm font-medium text-[#0B1730] dark:text-slate-200"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#0345A4] dark:text-sky-400 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="pt-2 border-t border-[#D7E2F3] dark:border-slate-800 text-xs text-[#5F6D82] dark:text-slate-400 flex items-start gap-2">
              <MapPin className="w-4 h-4 text-[#0345A4] dark:text-sky-400 shrink-0 mt-0.5" />
              <span>
                {pick(
                  `Available at our Chattogram office (${SITE_CONFIG.contact.address}) and remotely across Bangladesh.`,
                  `আমাদের চট্টগ্রাম অফিস (${SITE_CONFIG.contact.address}) এবং অনলাইনে সারা বাংলাদেশে সেবা প্রদান করা হয়।`
                )}
              </span>
            </div>
          </aside>
        </section>

        {/* Target Customer Profile */}
        <section className="space-y-6">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#0A63D8] dark:text-sky-400">
              <Users className="w-4 h-4" />
              <span>{pick('Who This Service Is Built For', 'যাদের জন্য এই সেবা উপযোগী')}</span>
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1730] dark:text-white">
              {pick('Target Customer Profile', 'কাদের জন্য এই সেবা সবচেয়ে কার্যকর')}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {targetCustomers.map((customer, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-[#D7E2F3] dark:border-slate-800 p-6 shadow-xs space-y-2"
              >
                <h3 className="text-base font-bold text-[#0B1730] dark:text-white">
                  {customer.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#5F6D82] dark:text-slate-400 leading-relaxed">
                  {customer.detail}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Key Benefits */}
        <section className="space-y-6">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#0A63D8] dark:text-sky-400">
              <Sparkles className="w-4 h-4" />
              <span>{pick('Business Value', 'ব্যবসায়িক উপকারিতা')}</span>
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1730] dark:text-white">
              {pick('Key Benefits for Your Organization', 'আপনার প্রতিষ্ঠানের জন্য মূল সুবিধাসমূহ')}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {keyBenefits.map((benefit, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-[#D7E2F3] dark:border-slate-800 p-6 shadow-xs flex items-start gap-3"
              >
                <CheckCircle2 className="w-5 h-5 text-[#0345A4] dark:text-sky-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-[#0B1730] dark:text-white">
                    {benefit.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#5F6D82] dark:text-slate-400 leading-relaxed">
                    {benefit.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* How The Service Works */}
        <section className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1730] dark:text-white">
              {pick('How This Service Works', 'এই সেবাটি যেভাবে পরিচালিত হয়')}
            </h2>
            <p className="text-sm text-[#5F6D82] dark:text-slate-400">
              {pick(
                'A structured four-step workflow designed for clarity, confidentiality and dependable monthly execution.',
                'স্বচ্ছতা, তথ্যের গোপনীয়তা এবং নিয়মিত মাসিক সম্পাদনের জন্য চার ধাপের সুসংগঠিত প্রক্রিয়া।'
              )}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {howItWorks.map((step) => (
              <div
                key={step.step}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-[#D7E2F3] dark:border-slate-800 p-6 shadow-xs space-y-3"
              >
                <span className="inline-block px-2.5 py-1 rounded-lg bg-[#F4F8FF] dark:bg-slate-800 border border-[#D7E2F3] dark:border-slate-700 text-xs font-extrabold text-[#0345A4] dark:text-sky-400 font-mono">
                  {step.step}
                </span>
                <h3 className="text-base font-bold text-[#0B1730] dark:text-white">
                  {step.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#5F6D82] dark:text-slate-400 leading-relaxed">
                  {step.detail}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Service FAQs */}
        {faqs.length > 0 && (
          <section className="space-y-5">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1730] dark:text-white">
              {pick('Frequently Asked Questions', 'সচরাচর জিজ্ঞাসিত প্রশ্নোত্তর')}
            </h2>

            <div className="space-y-3">
              {faqs.map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div
                    key={idx}
                    className="bg-white dark:bg-slate-900 rounded-2xl border border-[#D7E2F3] dark:border-slate-800 overflow-hidden"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                      aria-expanded={isOpen}
                      className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer"
                    >
                      <h3 className="text-sm sm:text-base font-bold text-[#0B1730] dark:text-white">
                        {faq.question}
                      </h3>
                      <ChevronDown
                        className={`w-4 h-4 text-[#0345A4] dark:text-sky-400 shrink-0 transition-transform ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 text-xs sm:text-sm text-[#5F6D82] dark:text-slate-300 leading-relaxed border-t border-[#D7E2F3]/60 dark:border-slate-800 pt-3">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Internal Linking: Software Preview + Related Guides + Related Services */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-2xl border border-[#D7E2F3] dark:border-slate-800 p-6 space-y-4 shadow-xs">
            <div className="flex items-center gap-2 text-[#0345A4] dark:text-sky-400">
              <Layers className="w-5 h-5" />
              <h2 className="text-lg font-extrabold text-[#0B1730] dark:text-white">
                {pick('Related Services From TecHisab', 'টেকহিসাবের সংশ্লিষ্ট অন্যান্য সেবাসমূহ')}
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {relatedServices.map((rel) => (
                <a
                  key={rel.slug}
                  href={`/services/${rel.slug}`}
                  onClick={(e) => handleLinkClick(e, () => onSelectServiceSlug(rel.slug))}
                  className="p-4 rounded-xl bg-[#F4F8FF]/70 dark:bg-slate-800/60 border border-[#D7E2F3] dark:border-slate-700 hover:border-[#0345A4] transition-colors flex flex-col justify-between gap-2 group"
                >
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#0A63D8] dark:text-sky-400">
                      {isBengali ? rel.badgeBn : rel.badge}
                    </span>
                    <h3 className="text-sm font-bold text-[#0B1730] dark:text-white group-hover:text-[#0345A4]">
                      {isBengali ? rel.h1Bn : rel.h1}
                    </h3>
                  </div>
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-[#0345A4] dark:text-sky-400">
                    <span>{pick('Explore Service', 'সেবাটি দেখুন')}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </a>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-2xl border border-[#D7E2F3] dark:border-slate-800 p-6 space-y-4 shadow-xs">
            <div className="flex items-center gap-2 text-[#0345A4] dark:text-sky-400">
              <BookOpen className="w-5 h-5" />
              <h2 className="text-lg font-extrabold text-[#0B1730] dark:text-white">
                {pick('Helpful Resources & Interactive Tools', 'সহায়ক গাইড ও সফটওয়্যার টুলস')}
              </h2>
            </div>

            <div className="space-y-2.5">
              {service.relatedSoftwareKey && (
                <a
                  href={`/software/${service.relatedSoftwareKey}`}
                  onClick={(e) =>
                    handleLinkClick(e, () => onOpenSoftwareDemo(service.relatedSoftwareKey!))
                  }
                  className="p-3.5 rounded-xl bg-[#F4F8FF] dark:bg-slate-800 border border-[#D7E2F3] dark:border-slate-700 hover:border-[#0345A4] flex items-center justify-between gap-3 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <Monitor className="w-4 h-4 text-[#0345A4] dark:text-sky-400 shrink-0" />
                    <span className="text-xs font-bold text-[#0B1730] dark:text-white">
                      {pick('Try Related Interactive Software Demo', 'সংশ্লিষ্ট সফটওয়্যার ডেমো দেখুন')}
                    </span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-[#0345A4] shrink-0" />
                </a>
              )}

              {relatedPosts.map((post) => (
                <a
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  onClick={(e) => handleLinkClick(e, () => onOpenBlogSlug(post.slug))}
                  className="block p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-[#D7E2F3] dark:border-slate-800 hover:border-[#0345A4] transition-colors"
                >
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#0A63D8] dark:text-sky-400 block">
                    {post.readTime}
                  </span>
                  <span className="text-xs font-bold text-[#0B1730] dark:text-slate-100 mt-0.5 block">
                    {post.title}
                  </span>
                </a>
              ))}

              <a
                href="/pricing"
                onClick={(e) =>
                  handleLinkClick(e, () => {
                    onOpenContact();
                  })
                }
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0345A4] dark:text-sky-400 hover:underline pt-1"
              >
                <span>{pick('Request Custom Scope & Pricing Quotation', 'কাস্টম কর্মপরিধি ও মূল্যতালিকা জানুন')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </section>

        {/* Strong Consultation CTA Banner */}
        <CtaBanner
          headline={pick(
            `Ready to Get Started With ${service.badge}?`,
            `${service.badgeBn} সেবা শুরু করতে প্রস্তুত?`
          )}
          subheadline={pick(
            'Speak with TecHisab in Chattogram or online for clear monthly deliverables, transparent pricing and dependable support.',
            'সুস্পষ্ট মাসিক ডেলিভারেবলস, স্বচ্ছ মূল্য এবং নির্ভরযোগ্য সহায়তার জন্য চট্টগ্রাম অফিসে বা অনলাইনে যোগাযোগ করুন।'
          )}
          primaryButtonText={pick('Schedule a Consultation', 'পরামর্শের সময় নির্ধারণ করুন')}
          onPrimaryClick={() => {
            trackConversion('cta_click', {
              location: `/services/${service.slug}`,
              label: 'service-bottom-cta',
            });
            onOpenContact();
          }}
        />
      </div>
    </article>
  );
};

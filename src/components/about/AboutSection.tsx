import React from 'react';
import { SectionHeading } from '../common/SectionHeading';
import { getLocalizedSiteConfig } from '../../data/localizedData';
import { useLanguage } from '../../context/LanguageContext';
import { BrandLogo } from '../common/BrandLogo';
import { ScrollReveal } from '../common/ScrollReveal';
import {
  Target,
  Eye,
  ShieldCheck,
  HeartHandshake,
  Lightbulb,
  MapPin,
  CheckCircle2,
  Award,
  Layers,
  Globe,
  ArrowRight,
} from 'lucide-react';

interface AboutSectionProps {
  onContactClick?: () => void;
  isStandalonePage?: boolean;
}

export const AboutSection: React.FC<AboutSectionProps> = ({
  onContactClick,
  isStandalonePage = false,
}) => {
  const { isBengali, pick } = useLanguage();
  const site = getLocalizedSiteConfig(isBengali);

  const values = [
    {
      title: pick('Integrity & Confidentiality', 'সততা ও তথ্যের গোপনীয়তা'),
      desc: pick(
        'Client financial records, ledgers, tax schedules, and business workflows are treated with strict professional discretion.',
        'ক্লায়েন্টের আর্থিক নথিপত্র, লেজার, কর সিডিউল এবং ব্যবসায়িক কার্যক্রম সর্বোচ্চ পেশাদার গোপনীয়তার সাথে সংরক্ষণ করা হয়।'
      ),
      icon: ShieldCheck,
    },
    {
      title: pick('Practical Accuracy', 'বাস্তবসম্মত নির্ভুলতা'),
      desc: pick(
        'Disciplined double-entry bookkeeping, bank reconciliations, and systematic working papers designed to keep records reliable.',
        'সঠিক ডাবল-এন্ট্রি বুককিপিং, ব্যাংক রিকনসিলিয়েশন এবং সুসংগঠিত ওয়ার্কিং পেপারের মাধ্যমে প্রতিটি হিসাব নির্ভরযোগ্য রাখা হয়।'
      ),
      icon: CheckCircle2,
    },
    {
      title: pick('Simplicity (কাজকে সহজ করুন)', 'সহজীকরণ (কাজকে সহজ করুন)'),
      desc: pick(
        'Simplifying complex accounting, VAT, and technology workflows so business owners focus on operations and growth.',
        'জটিল অ্যাকাউন্টিং, ভ্যাট ও প্রযুক্তিগত প্রক্রিয়াকে সহজ করে দেওয়া—যাতে ব্যবসায়ীরা মূল ব্যবসা ও প্রবৃদ্ধিতে মনোযোগ দিতে পারেন।'
      ),
      icon: Target,
    },
    {
      title: pick('Technology Enablement', 'প্রযুক্তির কার্যকর ব্যবহার'),
      desc: pick(
        'Bridging financial processes with QuickBooks, Xero, Excel/Sheets automation, business software, and custom web tools.',
        'কুইকবুকস, জেরো, এক্সেল/শিটস অটোমেশন, বিজনেস সফটওয়্যার এবং কাস্টম ওয়েব টুলের মাধ্যমে আর্থিক ব্যবস্থাপনাকে আধুনিক করা।'
      ),
      icon: Lightbulb,
    },
    {
      title: pick('Clear Service Scope', 'সুস্পষ্ট সেবার পরিধি'),
      desc: pick(
        'Transparent deliverables, straightforward baseline pricing, and agreed timelines before every engagement starts.',
        'যেকোনো কাজ শুরুর আগেই সুনির্দিষ্ট ডেলিভারেবলস, স্বচ্ছ নির্দেশক মূল্য ও সময়সীমা নির্ধারণ করে দেওয়া হয়।'
      ),
      icon: Layers,
    },
    {
      title: pick('Local Bangladesh Context', 'বাংলাদেশের প্রেক্ষাপটে দক্ষতা'),
      desc: pick(
        'Practical experience across Bangladesh accounting practices, income tax & VAT documentation, and local SME realities.',
        'বাংলাদেশের হিসাবরক্ষণ রীতি, আয়কর ও ভ্যাট নথিপত্র এবং স্থানীয় এসএমই ব্যবসার বাস্তব চাহিদা অনুযায়ী অভিজ্ঞ সমাধান।'
      ),
      icon: Globe,
    },
    {
      title: pick('Long-Term Partnership', 'দীর্ঘমেয়াদী অংশীদারিত্ব'),
      desc: pick(
        'Responsive, dependable support via office visits in Chittagong as well as online advisory across Bangladesh.',
        'চট্টগ্রামে সরাসরি অফিস ভিজিট এবং সারা বাংলাদেশে অনলাইন পরামর্শের মাধ্যমে নির্ভরযোগ্য ও নিয়মিত সহায়তা।'
      ),
      icon: HeartHandshake,
    },
  ];

  const leadership = [
    {
      name: pick('M. M. Alam', 'এম. এম. আলম (M. M. Alam)'),
      badgeLabel: pick('Founder & CEO', 'প্রতিষ্ঠাতা ও সিইও'),
      role: pick(
        'Founder & Chief Executive Officer (CEO)',
        'প্রতিষ্ঠাতা ও প্রধান নির্বাহী কর্মকর্তা (CEO)'
      ),
      credentials: pick(
        'CA CC (ICAB) • Income Tax Practitioner (ITP) • QuickBooks Online Certified Accountant',
        'সিএ সিসি (ICAB) • ইনকাম ট্যাক্স প্র্যাকটিশনার (ITP) • কুইকবুকস অনলাইন সার্টিফায়েড অ্যাকাউন্ট্যান্ট'
      ),
      bio: pick(
        'Leads TecHisab across corporate accounting, management reporting, Bangladesh income tax & VAT compliance support, cloud bookkeeping implementations, and practical skill development programs.',
        'কর্পোরেট অ্যাকাউন্টিং, ম্যানেজমেন্ট রিপোর্টিং, বাংলাদেশ আয়কর ও ভ্যাট কমপ্লায়েন্স সহায়তা, ক্লাউড বুককিপিং বাস্তবায়ন এবং প্র্যাকটিক্যাল দক্ষতা উন্নয়ন প্রশিক্ষণ কার্যক্রমে টেকহিসাবের নেতৃত্ব দিচ্ছেন।'
      ),
      focusTitle: pick('Core Practice Areas', 'মূল কর্মক্ষেত্র'),
      focusAreas: [
        pick(
          'Accounting, Financial Reporting & Virtual CFO Advisory',
          'অ্যাকাউন্টিং, ফাইন্যান্সিয়াল রিপোর্টিং ও ভার্চুয়াল সিএফও পরামর্শ'
        ),
        pick(
          'Income Tax Practitioner (ITP) & Bangladesh VAT Documentation Support',
          'ইনকাম ট্যাক্স প্র্যাকটিশনার (ITP) ও বাংলাদেশ ভ্যাট ডকুমেন্টেশন সহায়তা'
        ),
        pick(
          'QuickBooks Online, Excel Automation & Business Systems Architecture',
          'কুইকবুকস অনলাইন, এক্সেল অটোমেশন ও বিজনেস সিস্টেম আর্কিটেকচার'
        ),
      ],
      initials: 'MA',
    },
    {
      name: pick('Engr. Md. Tarek Hasan, CTO', 'ইঞ্জি. মো. তারেক হাসান, সিটিও (CTO)'),
      badgeLabel: pick('CTO', 'সিটিও (CTO)'),
      role: pick(
        'Head of Software Architecture, Cloud Systems & Cyber Security',
        'সফটওয়্যার আর্কিটেকচার, ক্লাউড সিস্টেমস ও সাইবার সিকিউরিটি প্রধান'
      ),
      credentials: pick(
        'CyberSecurity Graduate • Monash University, Australia',
        'সাইবার সিকিউরিটি স্নাতক • মোনাশ ইউনিভার্সিটি, অস্ট্রেলিয়া'
      ),
      bio: pick(
        "Accomplished engineering leader who completed his graduation in CyberSecurity from Monash University, Australia. Directs TecHisab's cloud infrastructure, end-to-end cryptographic data protection, high-availability microservices, and AI-assisted enterprise SaaS architecture.",
        'অস্ট্রেলিয়ার মোনাশ ইউনিভার্সিটি থেকে সাইবার সিকিউরিটিতে স্নাতক সম্পন্নকারী অভিজ্ঞ ইঞ্জিনিয়ারিং লিডার। তিনি টেকহিসাবের ক্লাউড অবকাঠামো, এন্ড-টু-এন্ড ক্রিপ্টোগ্রাফিক ডেটা সুরক্ষা, হাই-অ্যাভেইলেবিলিটি মাইক্রোসার্ভিসেস এবং আধুনিক এন্টারপ্রাইজ SaaS আর্কিটেকচার পরিচালনা করেন।'
      ),
      focusTitle: pick('Focus Area', 'বিশেষায়িত ক্ষেত্র'),
      focusAreas: [
        pick('Cloud Architecture', 'ক্লাউড আর্কিটেকচার'),
        pick('Cyber Security', 'সাইবার সিকিউরিটি'),
        pick('Distributed Systems & SaaS', 'ডিস্ট্রিবিউটেড সিস্টেমস ও SaaS'),
      ],
      initials: 'TH',
    },
  ];

  return (
    <section className="py-16 space-y-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Top Story & Identity */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <ScrollReveal direction="right" className="lg:col-span-6 space-y-5">
            <p className="text-xs font-extrabold tracking-[0.14em] uppercase text-[#0A63D8] dark:text-sky-400">
              {pick('About TecHisab', 'টেকহিসাব পরিচিতি')} &bull; {site.category}
            </p>

            {isStandalonePage ? (
              <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0B1730] dark:text-white tracking-tight leading-tight">
                {pick(
                  'Making Accounting, Finance & Business Technology Work Together',
                  'হিসাববিজ্ঞান, ফাইন্যান্স এবং ব্যবসায়িক প্রযুক্তির সমন্বিত ও সহজ সমাধান'
                )}
              </h1>
            ) : (
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B1730] dark:text-white tracking-tight leading-tight">
                {pick(
                  'Making Accounting, Finance & Business Technology Work Together',
                  'হিসাববিজ্ঞান, ফাইন্যান্স এবং ব্যবসায়িক প্রযুক্তির সমন্বিত ও সহজ সমাধান'
                )}
              </h2>
            )}

            <p className="text-sm sm:text-base text-[#5F6D82] dark:text-slate-300 leading-relaxed">
              {site.description}
            </p>

            <p className="text-sm sm:text-base text-[#5F6D82] dark:text-slate-300 leading-relaxed">
              {pick(
                'Businesses frequently struggle with disconnected advisors—bookkeepers without systems automation fluency on one hand, and software vendors without financial accounting clarity on the other. TecHisab unites both disciplines under one practical, dependable roof.',
                'ব্যবসা প্রতিষ্ঠানগুলো প্রায়ই বিচ্ছিন্ন সেবার সম্মুখীন হয়—একদিকে সিস্টেম অটোমেশনবিহীন হিসাবরক্ষণ, অন্যদিকে আর্থিক হিসাববিজ্ঞানের স্পষ্টতা ছাড়া সফটওয়্যার ভেন্ডর। টেকহিসাব এই দুটি বিষয়কে একটি নির্ভরযোগ্য ও বাস্তবসম্মত কাঠামোতে একত্রিত করেছে।'
              )}
            </p>

            <div className="p-4 rounded-2xl bg-[#F4F8FF] dark:bg-slate-900 border border-[#D7E2F3] dark:border-slate-800 flex items-center gap-3">
              <div className="font-bangla font-bold text-lg text-[#0345A4] dark:text-sky-400 shrink-0">
                {site.banglaTagline}
              </div>
              <span className="text-xs text-[#5F6D82] dark:text-slate-400">
                &mdash; {site.englishTagline}{' '}
                {pick(
                  'Clear financial processes and reliable technology for growing teams.',
                  'ক্রমবর্ধমান টিমের জন্য স্বচ্ছ আর্থিক প্রক্রিয়া ও নির্ভরযোগ্য প্রযুক্তি।'
                )}
              </span>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="left" className="lg:col-span-6">
            <div className="bg-gradient-to-br from-[#0345A4] to-[#02377F] p-8 rounded-2xl text-white shadow-xl space-y-6">
              <BrandLogo size="lg" themeMode="dark" />

              <div className="space-y-5 pt-5 border-t border-white/15 text-sm">
                <div>
                  <h3 className="text-sky-200 font-bold text-xs uppercase tracking-wider mb-1.5 flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    <span>{pick('Our Mission', 'আমাদের লক্ষ্য (Mission)')}</span>
                  </h3>
                  <p className="text-sky-100/90 leading-relaxed text-xs sm:text-sm">
                    {pick(
                      'To make accounting, tax support, financial reporting, software adoption, and technology training straightforward, accessible, and dependable for businesses and professionals.',
                      'ব্যবসা ও পেশাজীবীদের জন্য অ্যাকাউন্টিং, ট্যাক্স সহায়তা, আর্থিক প্রতিবেদন, সফটওয়্যার ব্যবহার এবং প্রযুক্তি প্রশিক্ষণকে সহজ, সহজলভ্য ও নির্ভরযোগ্য করে তোলা।'
                    )}
                  </p>
                </div>

                <div>
                  <h3 className="text-sky-200 font-bold text-xs uppercase tracking-wider mb-1.5 flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    <span>{pick('Our Vision', 'আমাদের রূপকল্প (Vision)')}</span>
                  </h3>
                  <p className="text-sky-100/90 leading-relaxed text-xs sm:text-sm">
                    {pick(
                      'To serve as a trusted long-term ITES & FINTEC partner in Bangladesh and beyond—recognized for accurate execution, transparent service standards, and practical software tools.',
                      'বাংলাদেশ ও এর বাইরে একটি বিশ্বস্ত দীর্ঘমেয়াদী আইটিইএস ও ফিনটেক পার্টনার হিসেবে প্রতিষ্ঠিত হওয়া—যারা নির্ভুল কাজ, স্বচ্ছ সেবা মানদণ্ড এবং বাস্তবসম্মত সফটওয়্যার টুলের জন্য পরিচিত।'
                    )}
                  </p>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Phase 10: 7 Core Values */}
        <div>
          <ScrollReveal direction="up">
            <SectionHeading
              badge={pick('Core Principles', 'মূল নীতিমালা')}
              title={pick(
                'Values That Guide Every Engagement',
                'প্রতিটি কাজে আমাদের অনুসৃত মূল্যবোধ'
              )}
              subtitle={pick(
                'Consistent standards across our bookkeeping, statutory preparation support, software systems, and classroom workshops.',
                'আমাদের বুককিপিং, বিধিবদ্ধ কমপ্লায়েন্স সহায়তা, সফটওয়্যার সিস্টেম এবং প্রশিক্ষণ কার্যক্রমে অভিন্ন পেশাদার মানদণ্ড।'
              )}
            />
          </ScrollReveal>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {values.map((val, idx) => {
              const Icon = val.icon;
              return (
                <div
                  key={idx}
                  className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-[#D7E2F3] dark:border-slate-800 shadow-xs space-y-2.5 hover:border-[#0345A4]/50 transition-colors"
                >
                  <div className="p-2.5 rounded-xl bg-[#F4F8FF] dark:bg-slate-800 text-[#0345A4] dark:text-sky-400 border border-[#D7E2F3] dark:border-slate-700 w-fit">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-[#0B1730] dark:text-white">
                    {val.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#5F6D82] dark:text-slate-400 leading-relaxed">
                    {val.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Phase 11: Verified Leadership */}
        <div>
          <ScrollReveal direction="up">
            <SectionHeading
              badge={pick('Leadership', 'নেতৃত্ব ও পরিচালনা')}
              title={pick('Led by Domain-Qualified Practice', 'দক্ষ ও অভিজ্ঞ নেতৃত্ব')}
              subtitle={pick(
                'Grounded in chartered accounting training, licensed tax practice, cloud architecture, and cybersecurity engineering.',
                'চার্টার্ড অ্যাকাউন্টিং প্রশিক্ষণ, নিবন্ধিত কর প্র্যাকটিস, ক্লাউড আর্কিটেকচার এবং সাইবার সিকিউরিটি ইঞ্জিনিয়ারিংয়ের সমন্বয়ে পরিচালিত।'
              )}
            />
          </ScrollReveal>

          <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
            {leadership.map((member, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl border border-[#D7E2F3] dark:border-slate-800 shadow-sm flex flex-col justify-between gap-5"
              >
                <div className="space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D7E2F3]/70 dark:border-slate-800 pb-5">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-[#0345A4] text-white flex items-center justify-center font-extrabold text-lg shrink-0">
                        {member.initials}
                      </div>
                      <div>
                        <h3 className="text-xl font-extrabold text-[#0B1730] dark:text-white">
                          {member.name}
                        </h3>
                        <p className="text-xs sm:text-sm font-semibold text-[#0A63D8] dark:text-sky-400">
                          {member.role}
                        </p>
                      </div>
                    </div>

                    <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl bg-[#F4F8FF] dark:bg-slate-800 text-[#0345A4] dark:text-sky-300 border border-[#D7E2F3] dark:border-slate-700 w-fit shrink-0">
                      <Award className="w-4 h-4 shrink-0" />
                      <span>{member.badgeLabel}</span>
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#F4F8FF] dark:bg-slate-950/60 border border-[#D7E2F3] dark:border-slate-800 text-xs font-bold text-[#0345A4] dark:text-sky-300">
                    {member.credentials}
                  </div>

                  <p className="text-xs sm:text-sm text-[#5F6D82] dark:text-slate-300 leading-relaxed">
                    {member.bio}
                  </p>
                </div>

                <div className="space-y-2 pt-2">
                  <span className="text-[11px] uppercase font-bold text-[#5F6D82] tracking-wider block">
                    {member.focusTitle}
                  </span>
                  <div className="grid grid-cols-1 gap-2">
                    {member.focusAreas.map((area, aIdx) => (
                      <div
                        key={aIdx}
                        className="p-2.5 px-3 rounded-xl bg-[#F4F8FF]/70 dark:bg-slate-800/50 border border-[#D7E2F3] dark:border-slate-700 text-xs font-semibold text-[#0B1730] dark:text-slate-200 flex items-start gap-2"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#0345A4] dark:text-sky-400 shrink-0 mt-0.5" />
                        <span>{area}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Corporate Office Card */}
        <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-[#D7E2F3] dark:border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xs">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-[#0A63D8] dark:text-sky-400 font-bold text-xs uppercase tracking-wider">
              <MapPin className="w-4 h-4" />
              <span>{pick('Office Address', 'অফিসের ঠিকানা')}</span>
            </div>
            <h3 className="text-xl font-extrabold text-[#0B1730] dark:text-white">
              {pick('Chittagong Corporate Office', 'চট্টগ্রাম কর্পোরেট অফিস')}
            </h3>
            <p className="text-xs sm:text-sm text-[#5F6D82] dark:text-slate-400 max-w-xl">
              {site.contact.address}{' '}
              {pick(
                'Available for scheduled client consultations and practical training sessions.',
                'পূর্বনির্ধারিত ক্লায়েন্ট পরামর্শ ও প্র্যাকটিক্যাল প্রশিক্ষণ সেশনের জন্য উন্মুক্ত।'
              )}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {onContactClick && (
              <a
                href="/contact"
                onClick={(e) => {
                  if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0) {
                    e.preventDefault();
                    onContactClick();
                  }
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0345A4] hover:bg-[#02377F] text-white text-xs font-bold transition-colors cursor-pointer"
              >
                <span>{pick('Request a Consultation', 'পরামর্শের অনুরোধ করুন')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            )}
            <a
              href={site.contact.mapDirectionsUrl}
              target="_blank"
              rel="noreferrer"
              className="px-5 py-2.5 rounded-xl bg-[#F4F8FF] dark:bg-slate-800 text-[#0B1730] dark:text-slate-100 border border-[#D7E2F3] dark:border-slate-700 text-xs font-bold hover:border-[#0345A4] transition-colors"
            >
              {pick('Google Maps', 'গুগল ম্যাপস')}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};


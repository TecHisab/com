import React, { useState, useEffect, useCallback } from 'react';
import {
  NavigationTab,
  ServiceItem,
  TrainingCourse,
  BlogPost,
  SoftwareDemoKey,
} from './types';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { FeedbackProvider } from './context/FeedbackContext';
import { Navbar } from './components/common/Navbar';
import { TopTypingBanner } from './components/common/TopTypingBanner';
import { Breadcrumbs, SoftwareDemoType } from './components/common/Breadcrumbs';
import { Footer } from './components/common/Footer';
import { GlobalThreeBackdrop } from './components/three/GlobalThreeBackdrop';
import { ScrollProgressBar } from './components/common/ScrollProgressBar';
import { QuickHelpChat } from './components/common/QuickHelpChat';
import { FeedbackToast } from './components/common/FeedbackToast';
import { CtaBanner } from './components/common/CtaBanner';
import { SectionHeading } from './components/common/SectionHeading';
import { ScrollReveal } from './components/common/ScrollReveal';
import { LegalPageView, LegalPageRoute } from './components/legal/LegalPageView';

// Home Section Components
import { HeroSection } from './components/home/HeroSection';
import { TrustStrip } from './components/home/TrustStrip';
import { EcosystemDiagram } from './components/home/EcosystemDiagram';
import { HowItWorksSection } from './components/home/HowItWorksSection';
import { BusinessBenefits } from './components/home/BusinessBenefits';
import { TestimonialsFaq } from './components/home/TestimonialsFaq';

// Services Components
import { ServiceCard } from './components/services/ServiceCard';
import { ServiceDetailModal } from './components/services/ServiceDetailModal';
import { SERVICES_DATA } from './data/servicesData';

// Software Components & Demos
import { SoftwareDemoSection } from './components/software/SoftwareDemoSection';
import { SOFTWARE_PRODUCTS } from './data/softwareData';

// Training Components
import { CourseCard } from './components/training/CourseCard';
import { EnrollmentModal } from './components/training/EnrollmentModal';
import { TRAINING_COURSES } from './data/trainingData';

// Pricing Components
import { PricingSection } from './components/pricing/PricingSection';

// Blog Components
import { BlogSection } from './components/blog/BlogSection';

// Contact & About Components
import { ContactSection } from './components/contact/ContactSection';
import { AboutSection } from './components/about/AboutSection';
import {
  localizeBlogPost,
  getLocalizedServices,
  getLocalizedTrainingCourses,
} from './data/localizedData';
import { ArrowRight, Layers, Monitor, GraduationCap } from 'lucide-react';

const LEGAL_ROUTES: LegalPageRoute[] = [
  'privacy-policy',
  'terms-of-service',
  'refund-policy',
  'tax-disclaimer',
];

const ROUTE_SEO_META: Record<NavigationTab, { title: string; description: string; path: string }> = {
  home: {
    title: 'TecHisab | ITES & FINTEC — Accounting, Finance, Tax & Business Software',
    description:
      'TecHisab provides professional Accounting, Finance, Tax & VAT Support, Payroll, BPO, MIS Reporting, Business Software and Practical Technology Training in Bangladesh.',
    path: '/',
  },
  about: {
    title: 'About TecHisab | ITES & FINTEC Consulting & Software',
    description:
      'Learn about TecHisab — Chittagong-based ITES & FINTEC company founded by M. M. Alam, combining practical accounting rigor with modern business technology.',
    path: '/about',
  },
  services: {
    title: 'Business Services | Accounting, Payroll, Tax, VAT & Software — TecHisab',
    description:
      'Explore TecHisab accounting, bookkeeping, payroll, Bangladesh Tax & VAT support, MIS reporting, BPO back-office and custom technology services.',
    path: '/services',
  },
  software: {
    title: 'Software Portfolio | ERP, Cloud Accounting, POS & Jibon — TecHisab',
    description:
      'Explore 9 TecHisab software products including TecHisab Business, ERP, Cloud Accounting, Retail Manager, POS Pro, Trade Manager, Inventory Pro, One and Jibon.',
    path: '/software',
  },
  'software-tax': {
    title: 'Bangladesh Income Tax Planning Simulator | TecHisab',
    description:
      'Test interactive Bangladesh Income Tax Act 2023 slab calculations and Section 78 investment rebate scenarios with TecHisab.',
    path: '/software#tax',
  },
  training: {
    title: 'Practical Accounting, Tax & Technology Training | TecHisab',
    description:
      'Practical training in MS Office, Excel automation, QuickBooks Online, Xero, Graphic Design, Bangladesh Tax & VAT and Executive Accounting.',
    path: '/training',
  },
  pricing: {
    title: 'Pricing Plans | Software Subscriptions & Business Services — TecHisab',
    description:
      'Transparent monthly & annual pricing for all 9 TecHisab software products, accounting & tax services, and unified business packages.',
    path: '/pricing',
  },
  blog: {
    title: 'Knowledge Hub & Articles | Accounting, Tax, VAT & Excel — TecHisab',
    description:
      'Practical articles and guides on Bangladesh Tax, VAT & Mushak compliance, double-entry accounting, QuickBooks, Xero, Excel and business automation.',
    path: '/blog',
  },
  contact: {
    title: 'Contact & Consultation | TecHisab Chittagong, Bangladesh',
    description:
      'Contact TecHisab for accounting, finance, tax & VAT support, business software demos or corporate training in Chittagong and across Bangladesh.',
    path: '/contact',
  },
  'privacy-policy': {
    title: 'Privacy Policy | TecHisab',
    description: 'Privacy Policy detailing how TecHisab handles client inquiry information and confidentiality.',
    path: '/privacy-policy',
  },
  'terms-of-service': {
    title: 'Terms of Service | TecHisab',
    description: 'Terms of Service governing TecHisab advisory engagements, software usage and training programs.',
    path: '/terms-of-service',
  },
  'refund-policy': {
    title: 'Refund & Cancellation Policy | TecHisab',
    description: 'Refund and cancellation terms for TecHisab retainers, software subscriptions and training batches.',
    path: '/refund-policy',
  },
  'tax-disclaimer': {
    title: 'Tax & Statutory Disclaimer | TecHisab',
    description: 'Statutory disclaimer regarding tax estimation tools, NBR e-Return verification and formal advisory engagements.',
    path: '/tax-disclaimer',
  },
};

const ROUTE_SEO_META_BN: Record<NavigationTab, { title: string; description: string }> = {
  home: {
    title: 'টেকহিসাব (TecHisab) | আইটিইএস ও ফিনটেক — অ্যাকাউন্টিং, ট্যাক্স ও বিজনেস সফটওয়্যার',
    description:
      'বাংলাদেশে পেশাদার অ্যাকাউন্টিং, ফাইন্যান্স, আয়কর ও ভ্যাট সহায়তা, পেরোল, বিপিও, এমআইএস রিপোর্টিং, বিজনেস সফটওয়্যার এবং প্র্যাকটিক্যাল প্রযুক্তি প্রশিক্ষণ।',
  },
  about: {
    title: 'আমাদের পরিচিতি | টেকহিসাব — আইটিইএস ও ফিনটেক কনসাল্টিং ও সফটওয়্যার',
    description:
      'চট্টগ্রাম-ভিত্তিক আইটিইএস ও ফিনটেক প্রতিষ্ঠান টেকহিসাব সম্পর্কে জানুন — বাস্তবসম্মত হিসাববিজ্ঞান ও আধুনিক ব্যবসায়িক প্রযুক্তির সমন্বয়।',
  },
  services: {
    title: 'ব্যবসায়িক সেবাসমূহ | অ্যাকাউন্টিং, পেরোল, ট্যাক্স, ভ্যাট ও সফটওয়্যার — টেকহিসাব',
    description:
      'টেকহিসাবের অ্যাকাউন্টিং, বুককিপিং, পেরোল, বাংলাদেশ ট্যাক্স ও ভ্যাট সহায়তা, এমআইএস রিপোর্টিং, বিপিও এবং কাস্টম সফটওয়্যার সেবা দেখুন।',
  },
  software: {
    title: 'সফটওয়্যার পোর্টফোলিও | ইআরপি, ক্লাউড অ্যাকাউন্টিং, পিওএস ও জীবন — টেকহিসাব',
    description:
      'টেকহিসাব বিজনেস, ইআরপি, ক্লাউড অ্যাকাউন্টিং, রিটেইল ম্যানেজার, পিওএস প্রো, ট্রেড ম্যানেজার, ইনভেন্টরি প্রো, ওয়ান এবং জীবন অ্যাপ দেখুন।',
  },
  'software-tax': {
    title: 'বাংলাদেশ আয়কর ও আর্থিক ক্যালকুলেটর | টেকহিসাব',
    description:
      'বাংলাদেশ আয়কর আইন ২০২৩ অনুযায়ী ধাপভিত্তিক কর হিসাব ও বিনিয়োগ রেয়াত সিমুলেশন পরীক্ষা করুন।',
  },
  training: {
    title: 'প্র্যাকটিক্যাল অ্যাকাউন্টিং, ট্যাক্স ও টেকনোলজি প্রশিক্ষণ | টেকহিসাব',
    description:
      'এমএস অফিস, এক্সেল অটোমেশন, কুইকবুকস, জেরো, গ্রাফিক ডিজাইন, বাংলাদেশ ট্যাক্স ও ভ্যাট এবং এক্সিকিউটিভ অ্যাকাউন্টিং প্রশিক্ষণ।',
  },
  pricing: {
    title: 'মূল্যতালিকা ও প্যাকেজ | সফটওয়্যার ও ব্যবসায়িক সেবা — টেকহিসাব',
    description:
      'সকল ৯টি টেকহিসাব সফটওয়্যার, অ্যাকাউন্টিং ও ট্যাক্স সেবা এবং সমন্বিত বিজনেস প্যাকেজের মাসিক ও বার্ষিক মূল্যতালিকা।',
  },
  blog: {
    title: 'জ্ঞানভাণ্ডার ও আর্টিকেল | অ্যাকাউন্টিং, ট্যাক্স, ভ্যাট ও এক্সেল — টেকহিসাব',
    description:
      'বাংলাদেশ আয়কর, ভ্যাট ও মূসক কমপ্লায়েন্স, ডাবল-এন্ট্রি বুককিপিং, কুইকবুকস, জেরো, এক্সেল ও ব্যবসায়িক অটোমেশন গাইড।',
  },
  contact: {
    title: 'যোগাযোগ ও পরামর্শ | টেকহিসাব চট্টগ্রাম, বাংলাদেশ',
    description:
      'অ্যাকাউন্টিং, ফাইন্যান্স, ট্যাক্স ও ভ্যাট সহায়তা, সফটওয়্যার ডেমো বা প্রশিক্ষণের জন্য চট্টগ্রাম অফিস ও অনলাইনে যোগাযোগ করুন।',
  },
  'privacy-policy': {
    title: 'গোপনীয়তা নীতি (Privacy Policy) | টেকহিসাব',
    description: 'ক্লায়েন্টের তথ্য নিরাপত্তা ও গোপনীয়তা সংক্রান্ত টেকহিসাবের নীতিমালা।',
  },
  'terms-of-service': {
    title: 'সেবার শর্তাবলি (Terms of Service) | টেকহিসাব',
    description: 'টেকহিসাবের পরামর্শ সেবা, সফটওয়্যার ব্যবহার ও প্রশিক্ষণ সংক্রান্ত শর্তাবলি।',
  },
  'refund-policy': {
    title: 'রিফান্ড ও বাতিলকরণ নীতিমালা | টেকহিসাব',
    description: 'টেকহিসাবের রিটেইনার সেবা, সফটওয়্যার সাবস্ক্রিপশন ও প্রশিক্ষণ ব্যাচ বাতিল ও রিফান্ড শর্তাবলি।',
  },
  'tax-disclaimer': {
    title: 'কর ও বিধিবদ্ধ ঘোষণা | টেকহিসাব',
    description: 'কর ক্যালকুলেটর, এনবিআর ই-রিটার্ন যাচাই ও আনুষ্ঠানিক কর পরামর্শ সংক্রান্ত ঘোষণা।',
  },
};

function MainApp() {
  const { isBengali, pick } = useLanguage();
  const [activeTab, setActiveTab] = useState<NavigationTab>('home');
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<TrainingCourse | null>(null);
  const [selectedBlog, setSelectedBlog] = useState<BlogPost | null>(null);
  const [serviceFilter, setServiceFilter] = useState<string>('all');
  const [blogCategory, setBlogCategory] = useState<string>('all');
  const [softwareDemoTab, setSoftwareDemoTab] = useState<SoftwareDemoType>('business');

  // GitHub Pages SPA path restoration (?p=/services etc.) on initial load
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const redirectedPath = params.get('p');
    if (redirectedPath) {
      const normalized = redirectedPath.replace(/^\/+|\/+$/g, '').toLowerCase();
      const validTabs: NavigationTab[] = [
        'home',
        'about',
        'services',
        'software',
        'training',
        'pricing',
        'blog',
        'contact',
        'privacy-policy',
        'terms-of-service',
        'refund-policy',
        'tax-disclaimer',
      ];
      if (validTabs.includes(normalized as NavigationTab)) {
        setActiveTab(normalized as NavigationTab);
      }
      const cleanHash = normalized ? `#${normalized}` : '#home';
      window.history.replaceState(null, '', cleanHash);
    }
  }, []);

  // Dynamic route-based SEO title, meta description & canonical sync
  useEffect(() => {
    const meta = ROUTE_SEO_META[activeTab] || ROUTE_SEO_META.home;
    const bnMeta = ROUTE_SEO_META_BN[activeTab] || ROUTE_SEO_META_BN.home;
    const localizedBlog = selectedBlog ? localizeBlogPost(selectedBlog, isBengali) : null;

    document.title = localizedBlog
      ? `${localizedBlog.title} | ${pick('TecHisab Knowledge Hub', 'টেকহিসাব জ্ঞানভাণ্ডার')}`
      : isBengali
      ? bnMeta.title
      : meta.title;

    const descEl = document.querySelector('meta[name="description"]');
    if (descEl) {
      descEl.setAttribute(
        'content',
        localizedBlog ? localizedBlog.summary : isBengali ? bnMeta.description : meta.description
      );
    }

    const canonicalEl = document.querySelector('link[rel="canonical"]');
    if (canonicalEl) {
      const canonicalUrl =
        meta.path === '/' ? 'https://www.techisab.com/' : `https://www.techisab.com/#${activeTab}`;
      canonicalEl.setAttribute('href', canonicalUrl);
    }
  }, [activeTab, selectedBlog, isBengali, pick]);

  const handleNavigate = useCallback((tab: NavigationTab) => {
    setActiveTab(tab);
    if (tab === 'software-tax') {
      setSoftwareDemoTab('calculators');
      setTimeout(() => {
        const el = document.getElementById('full-software-engine');
        el?.scrollIntoView({ behavior: 'smooth' });
      }, 60);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  const handleOpenGetStarted = useCallback(() => {
    setActiveTab('contact');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleRequestQuote = useCallback((_service: ServiceItem) => {
    setSelectedService(null);
    setActiveTab('contact');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleSelectProductDemo = useCallback(
    (productId: string, targetAnchorId: string) => {
      const product = SOFTWARE_PRODUCTS.find((p) => p.id === productId);
      const demoKey: SoftwareDemoKey = product?.demoTabKey || 'business';
      setSoftwareDemoTab(demoKey);
      setTimeout(() => {
        const el = document.getElementById(targetAnchorId);
        el?.scrollIntoView({ behavior: 'smooth' });
      }, 40);
    },
    []
  );

  const handleNavigateToDemoFromPricing = useCallback((softwareKey: string) => {
    setActiveTab('software');
    setSoftwareDemoTab((softwareKey as SoftwareDemoKey) || 'business');
    setTimeout(() => {
      const el = document.getElementById('full-software-engine');
      el?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }, []);

  const localizedServices = getLocalizedServices(isBengali);
  const localizedCourses = getLocalizedTrainingCourses(isBengali);

  const filteredServices =
    serviceFilter === 'all'
      ? localizedServices
      : localizedServices.filter((s) => s.category === serviceFilter);

  const isLegalRoute = LEGAL_ROUTES.includes(activeTab as LegalPageRoute);
  const showBreadcrumbs =
    activeTab !== 'home' || selectedService !== null || selectedCourse !== null || selectedBlog !== null;

  return (
    <div className="min-h-screen flex flex-col bg-transparent text-[#0B1730] dark:text-slate-100 transition-colors duration-200 relative overflow-x-hidden">
      {/* Subtle Top Reading Progress */}
      <ScrollProgressBar />

      {/* Site-Wide Real-Time 3D WebGL Spatial Scene */}
      <GlobalThreeBackdrop />

      {/* Sticky Corporate Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenGetStarted={handleOpenGetStarted}
        onNavigateToService={(service) => {
          setActiveTab('services');
          setSelectedService(service);
        }}
        onNavigateToSoftware={(softwareId) => {
          setActiveTab('software');
          handleSelectProductDemo(softwareId, 'full-software-engine');
        }}
        onNavigateToBlog={(post) => {
          setActiveTab('blog');
          if (post) setSelectedBlog(post);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Live Typing Offer Banner Under Main Menu */}
      <TopTypingBanner onClaimOffer={handleOpenGetStarted} />

      {/* Contextual Breadcrumbs (Shown on inner views / modals) */}
      {showBreadcrumbs && (
        <Breadcrumbs
          activeTab={activeTab}
          selectedService={selectedService}
          selectedCourse={selectedCourse}
          selectedBlog={selectedBlog}
          serviceFilter={serviceFilter}
          softwareDemoTab={softwareDemoTab}
          blogCategory={blogCategory}
          onNavigate={handleNavigate}
          onClearSelectedService={() => setSelectedService(null)}
          onClearSelectedCourse={() => setSelectedCourse(null)}
          onClearSelectedBlog={() => setSelectedBlog(null)}
          onSetServiceFilter={setServiceFilter}
          onSelectSoftwareDemoTab={setSoftwareDemoTab}
          onSelectService={setSelectedService}
          onSelectCourse={setSelectedCourse}
          onSelectBlog={setSelectedBlog}
        />
      )}

      {/* Main Content */}
      <main className="flex-grow">
        {/* ==================== HOME TAB ==================== */}
        {activeTab === 'home' && (
          <div>
            {/* 5.1 Hero Section */}
            <HeroSection
              onGetStarted={handleOpenGetStarted}
              onExploreServices={() => handleNavigate('services')}
              onExploreSoftware={() => handleNavigate('software')}
            />

            {/* 5.2 Company Highlights (4 Categories) */}
            <ScrollReveal direction="up" delay={0.05}>
              <TrustStrip />
            </ScrollReveal>

            {/* 5.3 Unified Business Solutions (6 Service Cards) */}
            <ScrollReveal direction="up" delay={0.08}>
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
                <EcosystemDiagram
                  onExploreService={() => handleNavigate('services')}
                />
              </div>
            </ScrollReveal>

            {/* Core Services Preview */}
            <section className="py-16">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
                <ScrollReveal direction="up">
                  <SectionHeading
                    badge={pick('Service Catalog', 'সেবা তালিকা')}
                    title={pick(
                      'Accounting, Payroll, Tax, VAT & Technology Services',
                      'অ্যাকাউন্টিং, পেরোল, ট্যাক্স, ভ্যাট ও প্রযুক্তি সেবা'
                    )}
                    subtitle={pick(
                      'Structured business operations, statutory reporting support and digital tools tailored for organizations in Bangladesh.',
                      'বাংলাদেশের ব্যবসা ও প্রতিষ্ঠানের জন্য সুসংগঠিত হিসাব পরিচালনা, বিধিবদ্ধ রিপোর্টিং সহায়তা এবং আধুনিক ডিজিটাল সমাধান।'
                    )}
                  />
                </ScrollReveal>

                <ScrollReveal direction="up" delay={0.08}>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {localizedServices.slice(0, 6).map((service) => (
                      <ServiceCard
                        key={service.id}
                        service={service}
                        onSelect={(s) => setSelectedService(s)}
                        onRequestQuote={handleRequestQuote}
                      />
                    ))}
                  </div>
                </ScrollReveal>

                <ScrollReveal direction="up" delay={0.1}>
                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={() => handleNavigate('services')}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white dark:bg-slate-900 border border-[#D7E2F3] dark:border-slate-700 hover:border-[#0345A4] text-[#0345A4] dark:text-sky-400 text-xs sm:text-sm font-bold transition-all shadow-xs cursor-pointer"
                    >
                      <Layers className="w-4 h-4" />
                      <span>
                        {pick('Explore Complete Services Directory', 'সম্পূর্ণ সেবা তালিকা দেখুন')}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </ScrollReveal>
              </div>
            </section>

            {/* 5.4 Complete Software Portfolio Preview (All 9 SKUs) + Interactive Demos & Calculators */}
            <section className="py-16 bg-white/75 dark:bg-slate-900/55 border-y border-[#D7E2F3] dark:border-slate-800">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
                <SoftwareDemoSection
                  sectionId="home-software-portfolio"
                  workspaceAnchorId="home-software-demos"
                  activeDemo={softwareDemoTab}
                  onSelectDemo={setSoftwareDemoTab}
                  onRequestOnboarding={handleOpenGetStarted}
                />

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => handleNavigate('software')}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0345A4] hover:bg-[#02377F] text-white text-xs sm:text-sm font-bold transition-all shadow-xs cursor-pointer"
                  >
                    <Monitor className="w-4 h-4" />
                    <span>
                      {pick(
                        'Open Dedicated Software Workspace Page',
                        'পূর্ণাঙ্গ সফটওয়্যার ওয়ার্কস্পেস পেজ খুলুন'
                      )}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </section>

            {/* 5.5 Practical Training Preview */}
            <ScrollReveal direction="up">
              <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
                  <SectionHeading
                    badge={pick('Practical Training', 'প্র্যাকটিক্যাল প্রশিক্ষণ')}
                    title={pick(
                      'Computer, Accounting, Tax & Technology Training',
                      'কম্পিউটার, অ্যাকাউন্টিং, ট্যাক্স ও প্রযুক্তি প্রশিক্ষণ'
                    )}
                    subtitle={pick(
                      'Hands-on practical courses for students, job seekers, accountants and business teams — covering Office tools, Excel, QuickBooks, Xero, Graphic Design and Tax/VAT.',
                      'শিক্ষার্থী, চাকরিপ্রত্যাশী, হিসাবরক্ষক ও কর্পোরেট টিমের জন্য হাতে-কলমে প্রশিক্ষণ — অফিস অ্যাপ্লিকেশন, এক্সেল, কুইকবুকস, জেরো, গ্রাফিক ডিজাইন ও ট্যাক্স/ভ্যাট।'
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {localizedCourses.slice(0, 6).map((course) => (
                      <CourseCard
                        key={course.id}
                        course={course}
                        onSelect={(c) => setSelectedCourse(c)}
                        onEnrollNow={(c) => setSelectedCourse(c)}
                      />
                    ))}
                  </div>

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => handleNavigate('training')}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white dark:bg-slate-900 border border-[#D7E2F3] dark:border-slate-700 hover:border-[#0345A4] text-[#0345A4] dark:text-sky-400 text-xs sm:text-sm font-bold transition-all shadow-xs cursor-pointer"
                    >
                      <GraduationCap className="w-4 h-4" />
                      <span>
                        {pick(
                          `View All ${TRAINING_COURSES.length} Training Programs`,
                          `সকল ${TRAINING_COURSES.length}টি প্রশিক্ষণ কোর্স দেখুন`
                        )}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </section>
            </ScrollReveal>

            {/* How It Works Structured Engagement */}
            <ScrollReveal direction="up">
              <HowItWorksSection />
            </ScrollReveal>

            {/* Practical Operational Benefits */}
            <ScrollReveal direction="up">
              <BusinessBenefits />
            </ScrollReveal>

            {/* Pricing Preview */}
            <ScrollReveal direction="up">
              <PricingSection
                onSelectPlan={handleOpenGetStarted}
                onNavigateToSoftwareDemo={handleNavigateToDemoFromPricing}
              />
            </ScrollReveal>

            {/* 5.6 Why Choose TecHisab & FAQs */}
            <ScrollReveal direction="up">
              <TestimonialsFaq onOpenGetStarted={handleOpenGetStarted} />
            </ScrollReveal>

            {/* About Preview */}
            <ScrollReveal direction="up">
              <AboutSection onContactClick={handleOpenGetStarted} />
            </ScrollReveal>

            {/* 5.7 Final CTA Banner */}
            <ScrollReveal direction="up">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
                <CtaBanner onPrimaryClick={handleOpenGetStarted} />
              </div>
            </ScrollReveal>
          </div>
        )}

        {/* ==================== SERVICES TAB ==================== */}
        {activeTab === 'services' && (
          <section className="py-16 space-y-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
              <ScrollReveal direction="up">
                <SectionHeading
                  badge={pick('Services Directory', 'সেবাসমূহের ডিরেক্টরি')}
                  title={pick(
                    'Accounting, Payroll, Tax, VAT, BPO & Technology Services',
                    'অ্যাকাউন্টিং, পেরোল, ট্যাক্স, ভ্যাট, বিপিও ও প্রযুক্তি সেবাসমূহ'
                  )}
                  subtitle={pick(
                    'Six specialized practice areas designed to organize your books, support Bangladesh statutory compliance and streamline business workflows.',
                    'আপনার হিসাব গুছিয়ে রাখতে, বাংলাদেশের বিধিবদ্ধ কমপ্লায়েন্স নিশ্চিত করতে এবং ব্যবসায়িক কার্যক্রম সহজ করতে ছয়টি বিশেষায়িত সেবা বিভাগ।'
                  )}
                />
              </ScrollReveal>

              {/* Exact 6 Service Categories Filter */}
              <ScrollReveal direction="up" delay={0.05}>
                <div className="flex flex-wrap items-center justify-center gap-2">
                  {[
                    {
                      id: 'all',
                      label: pick(
                        `All Services (${SERVICES_DATA.length})`,
                        `সকল সেবা (${SERVICES_DATA.length})`
                      ),
                    },
                    { id: 'accounting', label: pick('A. Accounting & Finance', 'ক. অ্যাকাউন্টিং ও ফাইন্যান্স') },
                    { id: 'payroll', label: pick('B. Payroll & Operations', 'খ. পেরোল ও অপারেশনস') },
                    { id: 'tax', label: pick('C. Tax & VAT Support', 'গ. ট্যাক্স ও ভ্যাট সহায়তা') },
                    { id: 'technology', label: pick('D. Software & Technology', 'ঘ. সফটওয়্যার ও প্রযুক্তি') },
                    { id: 'bpo', label: pick('E. BPO & Back-Office', 'ঙ. বিপিও ও ব্যাক-অফিস') },
                    { id: 'training', label: pick('F. Training Programs', 'চ. প্রশিক্ষণ প্রোগ্রাম') },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setServiceFilter(tab.id)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                        serviceFilter === tab.id
                          ? 'bg-[#0345A4] text-white border-[#0345A4] shadow-xs'
                          : 'bg-white dark:bg-slate-900 text-[#5F6D82] dark:text-slate-300 border-[#D7E2F3] dark:border-slate-800 hover:border-[#0345A4]'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </ScrollReveal>

              <ScrollReveal direction="up" delay={0.08}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredServices.map((service) => (
                    <ServiceCard
                      key={service.id}
                      service={service}
                      onSelect={(s) => setSelectedService(s)}
                      onRequestQuote={handleRequestQuote}
                    />
                  ))}
                </div>
              </ScrollReveal>

              <ScrollReveal direction="up" delay={0.1}>
                <CtaBanner onPrimaryClick={handleOpenGetStarted} />
              </ScrollReveal>
            </div>
          </section>
        )}

        {/* ==================== SOFTWARE TAB ==================== */}
        {(activeTab === 'software' || activeTab === 'software-tax') && (
          <section className="py-16 space-y-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
              <SoftwareDemoSection
                sectionId="software-portfolio-page"
                workspaceAnchorId="full-software-engine"
                activeDemo={softwareDemoTab}
                onSelectDemo={setSoftwareDemoTab}
                onRequestOnboarding={handleOpenGetStarted}
              />

              <ScrollReveal direction="up">
                <CtaBanner
                  headline={pick(
                    'Need Custom Software or Website Development for Your Business?',
                    'আপনার ব্যবসার জন্য কাস্টম সফটওয়্যার বা ওয়েবসাইট প্রয়োজন?'
                  )}
                  subheadline={pick(
                    'Our team designs tailored billing applications, inventory systems and corporate websites aligned with your operational workflow.',
                    'আমাদের টিম আপনার প্রতিষ্ঠানের কাজের ধরন অনুযায়ী কাস্টম বিলিং অ্যাপ্লিকেশন, ইনভেন্টরি সিস্টেম এবং কর্পোরেট ওয়েবসাইট তৈরি করে।'
                  )}
                  primaryButtonText={pick('Request a Consultation', 'পরামর্শের জন্য অনুরোধ করুন')}
                  onPrimaryClick={handleOpenGetStarted}
                />
              </ScrollReveal>
            </div>
          </section>
        )}

        {/* ==================== TRAINING TAB ==================== */}
        {activeTab === 'training' && (
          <section className="py-16 space-y-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
              <ScrollReveal direction="up">
                <SectionHeading
                  badge={pick('TecHisab Training Academy', 'টেকহিসাব ট্রেনিং একাডেমি')}
                  title={pick(
                    'Practical Computer, Accounting, Tax & Technology Courses',
                    'প্র্যাকটিক্যাল কম্পিউটার, অ্যাকাউন্টিং, ট্যাক্স ও প্রযুক্তি কোর্সসমূহ'
                  )}
                  subtitle={pick(
                    'Structured practical training covering MS Office, Excel automation, Graphic Design, QuickBooks Online, Xero, Bangladesh Tax & VAT and corporate workshops.',
                    'এমএস অফিস, এক্সেল অটোমেশন, গ্রাফিক ডিজাইন, কুইকবুকস অনলাইন, জেরো, বাংলাদেশ ট্যাক্স ও ভ্যাট এবং কর্পোরেট ওয়ার্কশপ বিষয়ক সুসংগঠিত প্র্যাকটিক্যাল প্রশিক্ষণ।'
                  )}
                />
              </ScrollReveal>

              <ScrollReveal direction="up" delay={0.08}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {localizedCourses.map((course) => (
                    <CourseCard
                      key={course.id}
                      course={course}
                      onSelect={(c) => setSelectedCourse(c)}
                      onEnrollNow={(c) => setSelectedCourse(c)}
                    />
                  ))}
                </div>
              </ScrollReveal>

              {/* In-Person Chittagong Training Facility Notice */}
              <ScrollReveal direction="up" delay={0.12}>
                <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-[#D7E2F3] dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs shadow-xs">
                  <div className="space-y-1">
                    <span className="font-bold text-[#0B1730] dark:text-white block text-sm">
                      {pick(
                        'In-Person & Corporate Group Training in Chittagong',
                        'চট্টগ্রামে সরাসরি এবং কর্পোরেট গ্রুপ প্রশিক্ষণ সুবিধা'
                      )}
                    </span>
                    <span className="text-[#5F6D82] dark:text-slate-400 block">
                      {pick(
                        'Weekend, evening and customized corporate sessions available at our Naya Bazar Biswa Road More office (Chittagong 4216) or online.',
                        'নয়াবাজার বিশ্বরোড মোড়, চট্টগ্রাম-৪২১৬ অফিসে সাপ্তাহিক ছুটির দিন, সান্ধ্যকালীন এবং কাস্টমাইজড কর্পোরেট সেশন অথবা অনলাইনে ক্লাস করার সুযোগ রয়েছে।'
                      )}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleOpenGetStarted}
                    className="px-4 py-2.5 rounded-xl bg-[#0345A4] hover:bg-[#02377F] text-white font-bold shrink-0 transition-colors cursor-pointer"
                  >
                    {pick('Inquire About Batch Dates', 'নতুন ব্যাচের সময়সূচি জানুন')}
                  </button>
                </div>
              </ScrollReveal>

              <ScrollReveal direction="up" delay={0.15}>
                <CtaBanner onPrimaryClick={handleOpenGetStarted} />
              </ScrollReveal>
            </div>
          </section>
        )}

        {/* ==================== PRICING TAB ==================== */}
        {activeTab === 'pricing' && (
          <ScrollReveal direction="up">
            <div>
              <PricingSection
                onSelectPlan={handleOpenGetStarted}
                onNavigateToSoftwareDemo={handleNavigateToDemoFromPricing}
              />
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
                <CtaBanner onPrimaryClick={handleOpenGetStarted} />
              </div>
            </div>
          </ScrollReveal>
        )}

        {/* ==================== BLOG TAB ==================== */}
        {activeTab === 'blog' && (
          <ScrollReveal direction="up">
            <div>
              <BlogSection
                selectedPost={selectedBlog}
                onSelectPost={setSelectedBlog}
                activeCategory={blogCategory}
                onSelectCategory={setBlogCategory}
              />
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
                <CtaBanner onPrimaryClick={handleOpenGetStarted} />
              </div>
            </div>
          </ScrollReveal>
        )}

        {/* ==================== ABOUT TAB ==================== */}
        {activeTab === 'about' && (
          <ScrollReveal direction="up">
            <div>
              <AboutSection onContactClick={handleOpenGetStarted} />
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
                <CtaBanner onPrimaryClick={handleOpenGetStarted} />
              </div>
            </div>
          </ScrollReveal>
        )}

        {/* ==================== CONTACT TAB ==================== */}
        {activeTab === 'contact' && (
          <ScrollReveal direction="up">
            <ContactSection />
          </ScrollReveal>
        )}

        {/* ==================== LEGAL PAGES ==================== */}
        {isLegalRoute && (
          <LegalPageView
            activePage={activeTab as LegalPageRoute}
            onNavigate={handleNavigate}
          />
        )}
      </main>

      {/* Global Detail & Enrollment Modals */}
      <ServiceDetailModal
        service={selectedService}
        onClose={() => setSelectedService(null)}
        onRequestQuote={handleRequestQuote}
      />

      <EnrollmentModal
        course={selectedCourse}
        onClose={() => setSelectedCourse(null)}
      />

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Floating Consultation Desk */}
      <QuickHelpChat />

      {/* Global Toast Feedback */}
      <FeedbackToast />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <FeedbackProvider>
          <MainApp />
        </FeedbackProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

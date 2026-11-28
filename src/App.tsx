import React, { useState, useEffect, useCallback, Suspense, lazy } from 'react';
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
import { ScrollProgressBar } from './components/common/ScrollProgressBar';
import { QuickHelpChat } from './components/common/QuickHelpChat';
import { FeedbackToast } from './components/common/FeedbackToast';
import { CtaBanner } from './components/common/CtaBanner';
import { SectionHeading } from './components/common/SectionHeading';
import { ScrollReveal } from './components/common/ScrollReveal';
import type { LegalPageRoute } from './components/legal/LegalPageView';

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
import { getServiceLandingBySlug } from './data/serviceLandingData';

// Software Components
import { SoftwareDemoSection } from './components/software/SoftwareDemoSection';
import { SOFTWARE_PRODUCTS } from './data/softwareData';

// Training Components
import { CourseCard } from './components/training/CourseCard';
import { EnrollmentModal } from './components/training/EnrollmentModal';
import { TRAINING_COURSES } from './data/trainingData';

// Blog Data
import { BLOG_POSTS, getBlogPostBySlug } from './data/blogData';

import {
  localizeBlogPost,
  getLocalizedServices,
  getLocalizedTrainingCourses,
} from './data/localizedData';
import {
  buildPathForState,
  parseRouteFromLocation,
  SERVICE_ID_TO_LANDING_SLUG,
} from './utils/routing';
import { updatePageSeoMeta, syncStructuredData } from './utils/seoSchema';
import { trackPageView, trackConversion } from './utils/analytics';
import { ArrowRight, Layers, Monitor, GraduationCap } from 'lucide-react';

// Deferred 3D Backdrop & Route-Level Code Splitting
const GlobalThreeBackdrop = lazy(() =>
  import('./components/three/GlobalThreeBackdrop').then((m) => ({
    default: m.GlobalThreeBackdrop,
  }))
);
const ServiceLandingPage = lazy(() =>
  import('./components/services/ServiceLandingPage').then((m) => ({
    default: m.ServiceLandingPage,
  }))
);
const BlogArticlePage = lazy(() =>
  import('./components/blog/BlogArticlePage').then((m) => ({
    default: m.BlogArticlePage,
  }))
);
const PricingSection = lazy(() =>
  import('./components/pricing/PricingSection').then((m) => ({
    default: m.PricingSection,
  }))
);
const BlogSection = lazy(() =>
  import('./components/blog/BlogSection').then((m) => ({
    default: m.BlogSection,
  }))
);
const ContactSection = lazy(() =>
  import('./components/contact/ContactSection').then((m) => ({
    default: m.ContactSection,
  }))
);
const AboutSection = lazy(() =>
  import('./components/about/AboutSection').then((m) => ({
    default: m.AboutSection,
  }))
);
const LegalPageView = lazy(() =>
  import('./components/legal/LegalPageView').then((m) => ({
    default: m.LegalPageView,
  }))
);
const NotFoundView = lazy(() =>
  import('./components/common/NotFoundView').then((m) => ({
    default: m.NotFoundView,
  }))
);

const LEGAL_ROUTES: LegalPageRoute[] = [
  'privacy-policy',
  'terms-of-service',
  'refund-policy',
  'tax-disclaimer',
];

const KNOWN_BLOG_SLUGS = BLOG_POSTS.map((p) => p.slug);
const KNOWN_BLOG_ID_TO_SLUG: Record<string, string> = Object.fromEntries(
  BLOG_POSTS.map((p) => [p.id, p.slug])
);

const ROUTE_SEO_META: Record<NavigationTab, { title: string; description: string; path: string }> = {
  home: {
    title: 'TecHisab | Accounting, Bookkeeping & Business Technology Solutions in Bangladesh',
    description:
      'TecHisab provides professional bookkeeping, accounting, payroll, tax and VAT, QuickBooks, business automation, software development and training services in Bangladesh.',
    path: '/',
  },
  about: {
    title: 'About TecHisab | ITES & FINTEC Firm in Chattogram, Bangladesh',
    description:
      'Learn about TecHisab — Chattogram-based ITES & FINTEC firm led by M. M. Alam and Engr. Md. Tarek Hasan, combining accounting rigor with business software.',
    path: '/about',
  },
  services: {
    title: 'Accounting, Payroll, Tax, VAT & Technology Services | TecHisab',
    description:
      'Explore TecHisab bookkeeping, financial reporting, payroll, Bangladesh Tax & VAT documentation, QuickBooks support, BPO and software development services.',
    path: '/services',
  },
  'service-detail': {
    title: 'Specialized Business & Accounting Services | TecHisab Bangladesh',
    description:
      'Dedicated accounting, tax, VAT, payroll, QuickBooks, automation, software development and training services by TecHisab in Chattogram and Bangladesh.',
    path: '/services',
  },
  software: {
    title: 'Business & Accounting Software Bangladesh | ERP, POS & Jibon — TecHisab',
    description:
      'Explore 9 TecHisab software products including TecHisab Business, ERP, Cloud Accounting, Retail Manager, POS Pro, Trade Manager, Inventory Pro, One and Jibon.',
    path: '/software',
  },
  'software-tax': {
    title: 'Bangladesh Income Tax & Business Financial Calculators | TecHisab',
    description:
      'Test interactive Bangladesh Income Tax Act 2023 slab calculations, Section 78 rebate scenarios, VAT and business calculators with TecHisab.',
    path: '/software/calculators',
  },
  training: {
    title: 'Practical Accounting, QuickBooks, Tax & Excel Training | TecHisab Chattogram',
    description:
      'Practical hands-on training in Chattogram and online covering MS Office, Excel automation, QuickBooks Online, Xero, Graphic Design and Bangladesh Tax & VAT.',
    path: '/training',
  },
  pricing: {
    title: 'Transparent Software & Accounting Service Pricing | TecHisab Bangladesh',
    description:
      'Monthly and annual pricing for all 9 TecHisab software applications, accounting and tax retainers, and unified business packages in Bangladesh.',
    path: '/pricing',
  },
  blog: {
    title: 'Knowledge Hub | Accounting, Bangladesh Tax, VAT & Excel Guides — TecHisab',
    description:
      'Practical original guides on bookkeeping, Bangladesh Tax Act 2023, VAT & Mushak compliance, QuickBooks Online, payroll management and Excel automation.',
    path: '/blog',
  },
  'blog-article': {
    title: 'Accounting, Tax & Business Technology Guide | TecHisab Blog',
    description:
      'Read practical accounting, Bangladesh tax, VAT documentation, QuickBooks and business automation insights from the TecHisab advisory team.',
    path: '/blog',
  },
  contact: {
    title: 'Contact TecHisab | Accounting & Software Consultation in Chattogram',
    description:
      'Contact TecHisab in Chattogram, Bangladesh (+8801556615555, info@techisab.com) for accounting, tax and VAT support, business software demos or training.',
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
  'not-found': {
    title: 'Page Not Found (404) | TecHisab',
    description: 'The requested TecHisab page could not be found. Browse our accounting, tax, software and training solutions.',
    path: '/404',
  },
};

const ROUTE_SEO_META_BN: Record<NavigationTab, { title: string; description: string }> = {
  home: {
    title: 'টেকহিসাব (TecHisab) | বাংলাদেশে অ্যাকাউন্টিং, বুককিপিং ও বিজনেস টেকনোলজি সমাধান',
    description:
      'বাংলাদেশে পেশাদার বুককিপিং, অ্যাকাউন্টিং, পেরোল, ট্যাক্স ও ভ্যাট, কুইকবুকস, বিজনেস অটোমেশন, সফটওয়্যার ডেভেলপমেন্ট এবং প্র্যাকটিক্যাল প্রশিক্ষণ সেবা।',
  },
  about: {
    title: 'আমাদের পরিচিতি | টেকহিসাব — চট্টগ্রাম, বাংলাদেশ',
    description:
      'চট্টগ্রাম-ভিত্তিক আইটিইএস ও ফিনটেক প্রতিষ্ঠান টেকহিসাব সম্পর্কে জানুন — বাস্তবসম্মত হিসাববিজ্ঞান ও আধুনিক ব্যবসায়িক প্রযুক্তির সমন্বয়।',
  },
  services: {
    title: 'ব্যবসায়িক সেবাসমূহ | অ্যাকাউন্টিং, পেরোল, ট্যাক্স, ভ্যাট ও সফটওয়্যার — টেকহিসাব',
    description:
      'টেকহিসাবের অ্যাকাউন্টিং, বুককিপিং, পেরোল, বাংলাদেশ ট্যাক্স ও ভ্যাট সহায়তা, এমআইএস রিপোর্টিং, বিপিও এবং কাস্টম সফটওয়্যার সেবা দেখুন।',
  },
  'service-detail': {
    title: 'বিশেষায়িত অ্যাকাউন্টিং ও বিজনেস টেকনোলজি সেবা | টেকহিসাব',
    description:
      'চট্টগ্রাম ও সারা বাংলাদেশের ব্যবসার জন্য টেকহিসাবের ডেডিকেটেড অ্যাকাউন্টিং, ট্যাক্স, ভ্যাট, পেরোল ও সফটওয়্যার সেবা।',
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
    title: 'প্র্যাকটিক্যাল অ্যাকাউন্টিং, ট্যাক্স ও টেকনোলজি প্রশিক্ষণ | টেকহিসাব চট্টগ্রাম',
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
  'blog-article': {
    title: 'জ্ঞানভাণ্ডার গাইড | টেকহিসাব ব্লগ',
    description:
      'অ্যাকাউন্টিং, বাংলাদেশ ট্যাক্স, ভ্যাট ডকুমেন্টেশন, কুইকবুকস এবং বিজনেস অটোমেশন নিয়ে টেকহিসাবের বিশ্লেষণধর্মী গাইড।',
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
  'not-found': {
    title: 'পৃষ্ঠাটি পাওয়া যায়নি (৪০৪) | টেকহিসাব',
    description: 'অনুরোধকৃত পৃষ্ঠাটি পাওয়া যায়নি। টেকহিসাবের হোমপেজ বা সেবাসমূহ ব্রাউজ করুন।',
  },
};

function RouteFallback() {
  return (
    <div className="py-24 flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-[#0345A4] border-t-transparent animate-spin" />
    </div>
  );
}

function MainApp() {
  const { isBengali, pick } = useLanguage();
  const [activeTab, setActiveTab] = useState<NavigationTab>('home');
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [selectedServiceSlug, setSelectedServiceSlug] = useState<string | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<TrainingCourse | null>(null);
  const [selectedBlog, setSelectedBlog] = useState<BlogPost | null>(null);
  const [serviceFilter, setServiceFilter] = useState<string>('all');
  const [blogCategory, setBlogCategory] = useState<string>('all');
  const [softwareDemoTab, setSoftwareDemoTab] = useState<SoftwareDemoType>('business');
  const [showThreeBackdrop, setShowThreeBackdrop] = useState(false);

  // Defer 3D WebGL backdrop slightly so primary text & hero paint cleanly first
  useEffect(() => {
    const win = window as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    if (typeof win.requestIdleCallback === 'function') {
      const idleId = win.requestIdleCallback(() => setShowThreeBackdrop(true), { timeout: 300 });
      return () => {
        win.cancelIdleCallback?.(idleId);
      };
    }
    const timer = window.setTimeout(() => setShowThreeBackdrop(true), 150);
    return () => window.clearTimeout(timer);
  }, []);

  const applyParsedRoute = useCallback(
    (
      parsed: ReturnType<typeof parseRouteFromLocation>,
      syncMode: 'replace' | 'none' = 'none'
    ) => {
      setSelectedService(null);
      setSelectedCourse(null);
      setActiveTab(parsed.tab);

      if (parsed.tab === 'service-detail' && parsed.serviceSlug) {
        setSelectedServiceSlug(parsed.serviceSlug);
        setSelectedBlog(null);
      } else if (parsed.tab === 'blog-article' && parsed.blogSlug) {
        setSelectedServiceSlug(null);
        setSelectedBlog(getBlogPostBySlug(parsed.blogSlug) || null);
      } else {
        setSelectedServiceSlug(null);
        setSelectedBlog(null);
      }

      if (parsed.serviceFilter) {
        setServiceFilter(parsed.serviceFilter);
      } else if (parsed.tab !== 'services') {
        setServiceFilter('all');
      }

      if (parsed.softwareDemoTab) {
        setSoftwareDemoTab(parsed.softwareDemoTab);
      }

      if (syncMode === 'replace' && typeof window !== 'undefined') {
        if (window.location.pathname !== parsed.canonicalPath || window.location.search || window.location.hash) {
          window.history.replaceState(null, '', parsed.canonicalPath);
        }
      }
    },
    []
  );

  // Initial route resolution (clean URLs, ?/ GitHub Pages redirect, ?p=, and legacy # hashes)
  useEffect(() => {
    const parsed = parseRouteFromLocation(
      window.location.pathname,
      window.location.search,
      window.location.hash,
      KNOWN_BLOG_SLUGS,
      KNOWN_BLOG_ID_TO_SLUG
    );
    applyParsedRoute(parsed, 'replace');

    const handlePopState = () => {
      const nextParsed = parseRouteFromLocation(
        window.location.pathname,
        window.location.search,
        window.location.hash,
        KNOWN_BLOG_SLUGS,
        KNOWN_BLOG_ID_TO_SLUG
      );
      applyParsedRoute(nextParsed, 'none');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [applyParsedRoute]);

  const pushPathIfChanged = useCallback((targetPath: string) => {
    if (typeof window !== 'undefined' && window.location.pathname !== targetPath) {
      window.history.pushState(null, '', targetPath);
    }
  }, []);

  const handleNavigate = useCallback(
    (tab: NavigationTab) => {
      setSelectedService(null);
      setSelectedCourse(null);

      if (tab !== 'service-detail') {
        setSelectedServiceSlug(null);
      }
      if (tab !== 'blog-article') {
        setSelectedBlog(null);
      }

      const nextDemoTab: SoftwareDemoKey = tab === 'software-tax' ? 'calculators' : softwareDemoTab;
      if (tab === 'software-tax') {
        setSoftwareDemoTab('calculators');
      }

      setActiveTab(tab);

      const targetPath = buildPathForState({
        tab,
        serviceSlug: tab === 'service-detail' ? selectedServiceSlug : null,
        blogSlug: tab === 'blog-article' ? selectedBlog?.slug || null : null,
        softwareDemoTab: nextDemoTab,
      });
      pushPathIfChanged(targetPath);

      if (tab === 'software-tax') {
        setTimeout(() => {
          const el = document.getElementById('full-software-engine');
          el?.scrollIntoView({ behavior: 'smooth' });
        }, 80);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },
    [pushPathIfChanged, selectedBlog, selectedServiceSlug, softwareDemoTab]
  );

  const navigateToServiceSlug = useCallback(
    (slug: string) => {
      const matched = getServiceLandingBySlug(slug);
      if (!matched) {
        handleNavigate('services');
        return;
      }
      setSelectedService(null);
      setSelectedCourse(null);
      setSelectedBlog(null);
      setSelectedServiceSlug(matched.slug);
      setActiveTab('service-detail');
      pushPathIfChanged(`/services/${matched.slug}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [handleNavigate, pushPathIfChanged]
  );

  const navigateToBlogSlug = useCallback(
    (slug: string) => {
      const matched = getBlogPostBySlug(slug);
      if (!matched) {
        handleNavigate('blog');
        return;
      }
      setSelectedService(null);
      setSelectedServiceSlug(null);
      setSelectedCourse(null);
      setSelectedBlog(matched);
      setActiveTab('blog-article');
      pushPathIfChanged(`/blog/${matched.slug}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [handleNavigate, pushPathIfChanged]
  );

  const handleSelectSoftwareDemoTab = useCallback(
    (demo: SoftwareDemoType) => {
      setSoftwareDemoTab(demo);
      if (activeTab === 'software' || activeTab === 'software-tax') {
        const nextTab: NavigationTab = demo === 'calculators' ? 'software-tax' : 'software';
        setActiveTab(nextTab);
        pushPathIfChanged(buildPathForState({ tab: nextTab, softwareDemoTab: demo }));
      }
    },
    [activeTab, pushPathIfChanged]
  );

  const handleOpenGetStarted = useCallback(() => {
    trackConversion('cta_click', { location: window.location.pathname, label: 'get_started' });
    handleNavigate('contact');
  }, [handleNavigate]);

  const handleRequestQuote = useCallback(
    (_service: ServiceItem) => {
      trackConversion('service_quote_request', {
        location: window.location.pathname,
        label: _service.id,
      });
      setSelectedService(null);
      handleNavigate('contact');
    },
    [handleNavigate]
  );

  const handleSelectProductDemo = useCallback(
    (productId: string, targetAnchorId: string) => {
      const product = SOFTWARE_PRODUCTS.find((p) => p.id === productId);
      const demoKey: SoftwareDemoKey = product?.demoTabKey || 'business';
      setSoftwareDemoTab(demoKey);
      if (activeTab === 'software' || activeTab === 'software-tax') {
        pushPathIfChanged(buildPathForState({ tab: 'software', softwareDemoTab: demoKey }));
      }
      setTimeout(() => {
        const el = document.getElementById(targetAnchorId);
        el?.scrollIntoView({ behavior: 'smooth' });
      }, 40);
    },
    [activeTab, pushPathIfChanged]
  );

  const handleNavigateToDemoFromPricing = useCallback(
    (softwareKey: string) => {
      const demoKey = (softwareKey as SoftwareDemoKey) || 'business';
      setSoftwareDemoTab(demoKey);
      const nextTab: NavigationTab = demoKey === 'calculators' ? 'software-tax' : 'software';
      setActiveTab(nextTab);
      pushPathIfChanged(buildPathForState({ tab: nextTab, softwareDemoTab: demoKey }));
      setTimeout(() => {
        const el = document.getElementById('full-software-engine');
        el?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    },
    [pushPathIfChanged]
  );

  const activeServiceLanding =
    activeTab === 'service-detail' && selectedServiceSlug
      ? getServiceLandingBySlug(selectedServiceSlug) || null
      : null;

  // Dynamic route SEO meta tags, JSON-LD structured data & privacy-safe pageview tracking
  useEffect(() => {
    const meta = ROUTE_SEO_META[activeTab] || ROUTE_SEO_META.home;
    const bnMeta = ROUTE_SEO_META_BN[activeTab] || ROUTE_SEO_META_BN.home;
    const localizedBlog = selectedBlog ? localizeBlogPost(selectedBlog, isBengali) : null;

    let canonicalPath = buildPathForState({
      tab: activeTab,
      serviceSlug: activeServiceLanding?.slug || selectedServiceSlug,
      blogSlug: selectedBlog?.slug || null,
      softwareDemoTab,
    });
    if (activeTab === 'not-found' && typeof window !== 'undefined') {
      canonicalPath = window.location.pathname || '/404';
    }

    let title = isBengali ? bnMeta.title : meta.title;
    let description = isBengali ? bnMeta.description : meta.description;

    if (activeTab === 'service-detail' && activeServiceLanding) {
      title = isBengali ? activeServiceLanding.seoTitleBn : activeServiceLanding.seoTitle;
      description = isBengali
        ? activeServiceLanding.seoDescriptionBn
        : activeServiceLanding.seoDescription;
    } else if (localizedBlog) {
      title = `${localizedBlog.title} | ${pick('TecHisab', 'টেকহিসাব')}`;
      description = localizedBlog.metaDescription || localizedBlog.summary;
    }

    const breadcrumbs: { name: string; path: string }[] = [
      { name: pick('Home', 'হোম'), path: '/' },
    ];
    if (activeTab === 'service-detail' && activeServiceLanding) {
      breadcrumbs.push({ name: pick('Services', 'সেবাসমূহ'), path: '/services' });
      breadcrumbs.push({
        name: isBengali ? activeServiceLanding.badgeBn : activeServiceLanding.badge,
        path: `/services/${activeServiceLanding.slug}`,
      });
    } else if (activeTab === 'blog-article' && localizedBlog) {
      breadcrumbs.push({ name: pick('Blog', 'ব্লগ'), path: '/blog' });
      breadcrumbs.push({
        name: localizedBlog.title,
        path: `/blog/${localizedBlog.slug}`,
      });
    } else if (activeTab === 'software' || activeTab === 'software-tax') {
      breadcrumbs.push({ name: pick('Software', 'সফটওয়্যার'), path: '/software' });
      const activeSoft = SOFTWARE_PRODUCTS.find((p) => p.demoTabKey === softwareDemoTab);
      const demoLabel =
        softwareDemoTab === 'calculators'
          ? pick('Business & Financial Calculators', 'বিজনেস ক্যালকুলেটরস')
          : activeSoft?.name || 'TecHisab Business';
      breadcrumbs.push({
        name: demoLabel,
        path: canonicalPath,
      });
    } else if (activeTab !== 'home' && activeTab !== 'not-found') {
      const tabLabels: Partial<Record<NavigationTab, string>> = {
        services: pick('Services', 'সেবাসমূহ'),
        training: pick('Training', 'প্রশিক্ষণ'),
        pricing: pick('Pricing', 'মূল্যতালিকা'),
        blog: pick('Blog', 'ব্লগ'),
        about: pick('About TecHisab', 'আমাদের পরিচিতি'),
        contact: pick('Contact', 'যোগাযোগ'),
        'privacy-policy': pick('Privacy Policy', 'গোপনীয়তা নীতি'),
        'terms-of-service': pick('Terms of Service', 'সেবার শর্তাবলি'),
        'refund-policy': pick('Refund & Cancellation Policy', 'রিফান্ড ও বাতিলকরণ নীতিমালা'),
        'tax-disclaimer': pick('Tax Disclaimer', 'কর ও বিধিবদ্ধ ঘোষণা'),
      };
      breadcrumbs.push({
        name: tabLabels[activeTab] || title.split('|')[0].trim(),
        path: canonicalPath,
      });
    }

    updatePageSeoMeta({
      title,
      description,
      canonicalPath,
      isBengali,
      type: activeTab === 'blog-article' && localizedBlog ? 'article' : 'website',
      noindex: activeTab === 'not-found',
    });

    syncStructuredData({
      activeTab,
      canonicalPath,
      isBengali,
      serviceLanding: activeServiceLanding,
      blogPost: localizedBlog,
      breadcrumbs,
    });

    trackPageView(canonicalPath, title);
  }, [
    activeTab,
    activeServiceLanding,
    selectedServiceSlug,
    selectedBlog,
    softwareDemoTab,
    isBengali,
    pick,
  ]);

  const localizedServices = getLocalizedServices(isBengali);
  const localizedCourses = getLocalizedTrainingCourses(isBengali);

  const filteredServices =
    serviceFilter === 'all'
      ? localizedServices
      : localizedServices.filter((s) => s.category === serviceFilter);

  const isLegalRoute = LEGAL_ROUTES.includes(activeTab as LegalPageRoute);
  const showBreadcrumbs =
    activeTab !== 'home' || selectedService !== null || selectedCourse !== null || selectedBlog !== null;

  const handleAnchorNav = (e: React.MouseEvent<HTMLAnchorElement>, tab: NavigationTab) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    handleNavigate(tab);
  };

  return (
    <div className="min-h-screen flex flex-col bg-transparent text-[#0B1730] dark:text-slate-100 transition-colors duration-200 relative overflow-x-hidden">
      {/* Subtle Top Reading Progress */}
      <ScrollProgressBar />

      {/* Deferred Site-Wide Real-Time 3D WebGL Spatial Scene */}
      {showThreeBackdrop && (
        <Suspense fallback={null}>
          <GlobalThreeBackdrop />
        </Suspense>
      )}

      {/* Sticky Corporate Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={handleNavigate}
        onOpenGetStarted={handleOpenGetStarted}
        onNavigateToService={(service) => {
          const slug = SERVICE_ID_TO_LANDING_SLUG[service.id];
          if (slug) {
            navigateToServiceSlug(slug);
          } else {
            handleNavigate('services');
            setSelectedService(service);
          }
        }}
        onNavigateToSoftware={(softwareId) => {
          const product = SOFTWARE_PRODUCTS.find((p) => p.id === softwareId);
          const demoKey: SoftwareDemoKey = product?.demoTabKey || 'business';
          setSoftwareDemoTab(demoKey);
          setActiveTab('software');
          pushPathIfChanged(buildPathForState({ tab: 'software', softwareDemoTab: demoKey }));
          setTimeout(() => {
            const el = document.getElementById('full-software-engine');
            el?.scrollIntoView({ behavior: 'smooth' });
          }, 80);
        }}
        onNavigateToBlog={(post) => {
          if (post?.slug) {
            navigateToBlogSlug(post.slug);
          } else {
            handleNavigate('blog');
          }
        }}
      />

      {/* Live Typing Offer Banner Under Main Menu */}
      <TopTypingBanner onClaimOffer={handleOpenGetStarted} />

      {/* Contextual Breadcrumbs (Shown on inner views / modals) */}
      {showBreadcrumbs && (
        <Breadcrumbs
          activeTab={activeTab}
          selectedService={selectedService}
          selectedServiceLanding={activeServiceLanding}
          selectedCourse={selectedCourse}
          selectedBlog={selectedBlog}
          serviceFilter={serviceFilter}
          softwareDemoTab={softwareDemoTab}
          blogCategory={blogCategory}
          onNavigate={handleNavigate}
          onClearSelectedService={() => setSelectedService(null)}
          onClearSelectedCourse={() => setSelectedCourse(null)}
          onClearSelectedBlog={() => {
            setSelectedBlog(null);
            if (activeTab === 'blog-article') {
              handleNavigate('blog');
            }
          }}
          onSetServiceFilter={setServiceFilter}
          onSelectSoftwareDemoTab={handleSelectSoftwareDemoTab}
          onSelectService={setSelectedService}
          onSelectServiceSlug={navigateToServiceSlug}
          onSelectCourse={setSelectedCourse}
          onSelectBlog={(post) => navigateToBlogSlug(post.slug)}
          onSelectBlogCategory={setBlogCategory}
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
                        onOpenServicePage={navigateToServiceSlug}
                        onRequestQuote={handleRequestQuote}
                      />
                    ))}
                  </div>
                </ScrollReveal>

                <ScrollReveal direction="up" delay={0.1}>
                  <div className="text-center pt-2">
                    <a
                      href="/services"
                      onClick={(e) => handleAnchorNav(e, 'services')}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white dark:bg-slate-900 border border-[#D7E2F3] dark:border-slate-700 hover:border-[#0345A4] text-[#0345A4] dark:text-sky-400 text-xs sm:text-sm font-bold transition-all shadow-xs"
                    >
                      <Layers className="w-4 h-4" />
                      <span>
                        {pick('Explore Complete Services Directory', 'সম্পূর্ণ সেবা তালিকা দেখুন')}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </a>
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
                  onSelectDemo={handleSelectSoftwareDemoTab}
                  onRequestOnboarding={handleOpenGetStarted}
                />

                <div className="text-center pt-2">
                  <a
                    href="/software"
                    onClick={(e) => handleAnchorNav(e, 'software')}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0345A4] hover:bg-[#02377F] text-white text-xs sm:text-sm font-bold transition-all shadow-xs"
                  >
                    <Monitor className="w-4 h-4" />
                    <span>
                      {pick(
                        'Open Dedicated Software Workspace Page',
                        'পূর্ণাঙ্গ সফটওয়্যার ওয়ার্কস্পেস পেজ খুলুন'
                      )}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
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
                    <a
                      href="/training"
                      onClick={(e) => handleAnchorNav(e, 'training')}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white dark:bg-slate-900 border border-[#D7E2F3] dark:border-slate-700 hover:border-[#0345A4] text-[#0345A4] dark:text-sky-400 text-xs sm:text-sm font-bold transition-all shadow-xs"
                    >
                      <GraduationCap className="w-4 h-4" />
                      <span>
                        {pick(
                          `View All ${TRAINING_COURSES.length} Training Programs`,
                          `সকল ${TRAINING_COURSES.length}টি প্রশিক্ষণ কোর্স দেখুন`
                        )}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </a>
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
              <Suspense fallback={<RouteFallback />}>
                <PricingSection
                  onSelectPlan={handleOpenGetStarted}
                  onNavigateToSoftwareDemo={handleNavigateToDemoFromPricing}
                />
              </Suspense>
            </ScrollReveal>

            {/* 5.6 Why Choose TecHisab & FAQs */}
            <ScrollReveal direction="up">
              <TestimonialsFaq onOpenGetStarted={handleOpenGetStarted} />
            </ScrollReveal>

            {/* About Preview */}
            <ScrollReveal direction="up">
              <Suspense fallback={<RouteFallback />}>
                <AboutSection onContactClick={handleOpenGetStarted} />
              </Suspense>
            </ScrollReveal>

            {/* 5.7 Final CTA Banner */}
            <ScrollReveal direction="up">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
                <CtaBanner onPrimaryClick={handleOpenGetStarted} />
              </div>
            </ScrollReveal>
          </div>
        )}

        {/* ==================== SERVICES DIRECTORY TAB ==================== */}
        {activeTab === 'services' && (
          <section className="py-16 space-y-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
              <ScrollReveal direction="up">
                <SectionHeading
                  as="h1"
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
                      onOpenServicePage={navigateToServiceSlug}
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

        {/* ==================== DEDICATED SERVICE LANDING PAGE ==================== */}
        {activeTab === 'service-detail' && activeServiceLanding && (
          <Suspense fallback={<RouteFallback />}>
            <ServiceLandingPage
              service={activeServiceLanding}
              onNavigateServices={() => handleNavigate('services')}
              onSelectServiceSlug={navigateToServiceSlug}
              onOpenContact={handleOpenGetStarted}
              onOpenSoftwareDemo={(demoKey) => {
                setSoftwareDemoTab(demoKey);
                setActiveTab('software');
                pushPathIfChanged(buildPathForState({ tab: 'software', softwareDemoTab: demoKey }));
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onOpenBlogSlug={navigateToBlogSlug}
            />
          </Suspense>
        )}

        {/* ==================== SOFTWARE TAB ==================== */}
        {(activeTab === 'software' || activeTab === 'software-tax') && (
          <section className="py-16 space-y-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
              <SoftwareDemoSection
                sectionId="software-portfolio-page"
                workspaceAnchorId="full-software-engine"
                activeDemo={softwareDemoTab}
                onSelectDemo={handleSelectSoftwareDemoTab}
                onRequestOnboarding={handleOpenGetStarted}
                isStandalonePage
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
                  as="h1"
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
                  <a
                    href="/contact"
                    onClick={(e) => handleAnchorNav(e, 'contact')}
                    className="px-4 py-2.5 rounded-xl bg-[#0345A4] hover:bg-[#02377F] text-white font-bold shrink-0 transition-colors"
                  >
                    {pick('Inquire About Batch Dates', 'নতুন ব্যাচের সময়সূচি জানুন')}
                  </a>
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
          <Suspense fallback={<RouteFallback />}>
            <div>
              <PricingSection
                isStandalonePage
                onSelectPlan={handleOpenGetStarted}
                onNavigateToSoftwareDemo={handleNavigateToDemoFromPricing}
              />
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
                <CtaBanner onPrimaryClick={handleOpenGetStarted} />
              </div>
            </div>
          </Suspense>
        )}

        {/* ==================== BLOG TAB ==================== */}
        {activeTab === 'blog' && (
          <Suspense fallback={<RouteFallback />}>
            <div>
              <BlogSection
                isStandalonePage
                selectedPost={selectedBlog}
                onSelectPost={setSelectedBlog}
                onOpenArticleSlug={navigateToBlogSlug}
                activeCategory={blogCategory}
                onSelectCategory={setBlogCategory}
              />
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
                <CtaBanner onPrimaryClick={handleOpenGetStarted} />
              </div>
            </div>
          </Suspense>
        )}

        {/* ==================== DEDICATED BLOG ARTICLE PAGE ==================== */}
        {activeTab === 'blog-article' && selectedBlog && (
          <Suspense fallback={<RouteFallback />}>
            <BlogArticlePage
              post={selectedBlog}
              allPosts={BLOG_POSTS}
              onBackToBlog={() => handleNavigate('blog')}
              onSelectArticleSlug={navigateToBlogSlug}
              onSelectServiceSlug={navigateToServiceSlug}
              onOpenContact={handleOpenGetStarted}
            />
          </Suspense>
        )}

        {/* ==================== ABOUT TAB ==================== */}
        {activeTab === 'about' && (
          <Suspense fallback={<RouteFallback />}>
            <div>
              <AboutSection isStandalonePage onContactClick={handleOpenGetStarted} />
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
                <CtaBanner onPrimaryClick={handleOpenGetStarted} />
              </div>
            </div>
          </Suspense>
        )}

        {/* ==================== CONTACT TAB ==================== */}
        {activeTab === 'contact' && (
          <Suspense fallback={<RouteFallback />}>
            <ContactSection isStandalonePage />
          </Suspense>
        )}

        {/* ==================== LEGAL PAGES ==================== */}
        {isLegalRoute && (
          <Suspense fallback={<RouteFallback />}>
            <LegalPageView
              activePage={activeTab as LegalPageRoute}
              onNavigate={handleNavigate}
            />
          </Suspense>
        )}

        {/* ==================== 404 PAGE ==================== */}
        {activeTab === 'not-found' && (
          <Suspense fallback={<RouteFallback />}>
            <NotFoundView onNavigate={handleNavigate} />
          </Suspense>
        )}
      </main>

      {/* Global Detail & Enrollment Modals */}
      <ServiceDetailModal
        service={selectedService}
        onClose={() => setSelectedService(null)}
        onRequestQuote={handleRequestQuote}
        onOpenServicePage={navigateToServiceSlug}
      />

      <EnrollmentModal
        course={selectedCourse}
        onClose={() => setSelectedCourse(null)}
      />

      {/* Footer */}
      <Footer
        onNavigate={handleNavigate}
        onSelectServiceSlug={navigateToServiceSlug}
        onSelectSoftwareDemoTab={handleSelectSoftwareDemoTab}
      />

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

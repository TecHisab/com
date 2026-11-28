import React, { useState, useEffect, useRef } from 'react';
import {
  NavigationTab,
  ServiceItem,
  TrainingCourse,
  BlogPost,
  SoftwareDemoKey,
  ServiceLandingPageData,
} from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { useFeedback } from '../../context/FeedbackContext';
import { SERVICES_DATA } from '../../data/servicesData';
import { SERVICE_LANDING_PAGES } from '../../data/serviceLandingData';
import { TRAINING_COURSES } from '../../data/trainingData';
import { BLOG_CATEGORIES } from '../../data/blogData';
import {
  localizeService,
  localizeCourse,
  localizeBlogPost,
  getBlogCategoryLabel,
} from '../../data/localizedData';
import { buildPathForState } from '../../utils/routing';
import {
  Home,
  ChevronRight,
  ArrowLeft,
  Briefcase,
  GraduationCap,
  Laptop,
  DollarSign,
  BookOpen,
  Users,
  Mail,
  Tag,
  Copy,
  Check,
  X,
  ChevronDown,
  FileText,
  Scale,
} from 'lucide-react';

export type SoftwareDemoType = SoftwareDemoKey;

export interface BreadcrumbsProps {
  activeTab: NavigationTab;
  selectedService: ServiceItem | null;
  selectedServiceLanding?: ServiceLandingPageData | null;
  selectedCourse: TrainingCourse | null;
  selectedBlog?: BlogPost | null;
  serviceFilter: string;
  softwareDemoTab: SoftwareDemoType;
  blogCategory?: string;
  onNavigate: (tab: NavigationTab) => void;
  onClearSelectedService: () => void;
  onClearSelectedCourse: () => void;
  onClearSelectedBlog?: () => void;
  onSetServiceFilter?: (filter: string) => void;
  onSelectSoftwareDemoTab?: (demo: SoftwareDemoType) => void;
  onSelectService?: (service: ServiceItem) => void;
  onSelectServiceSlug?: (slug: string) => void;
  onSelectCourse?: (course: TrainingCourse) => void;
  onSelectBlog?: (post: BlogPost) => void;
  onSelectBlogCategory?: (category: string) => void;
}

interface CrumbItem {
  id: string;
  label: string;
  href?: string;
  icon?: React.ComponentType<{ className?: string }>;
  onClick?: () => void;
  isCurrent: boolean;
  badge?: string;
  dropdownItems?: {
    id: string;
    label: string;
    href: string;
    badge?: string;
    icon?: React.ComponentType<{ className?: string }>;
    onClick: () => void;
  }[];
}

const SERVICE_CATEGORY_LABELS: Record<string, { en: string; bn: string }> = {
  all: { en: 'All Services', bn: 'সকল সেবাসমূহ' },
  accounting: { en: 'Accounting & Finance', bn: 'একাউন্টিং ও ফিন্যান্স' },
  payroll: { en: 'Payroll & Operations', bn: 'পেরোল ও অপারেশনস' },
  tax: { en: 'Tax & VAT Support', bn: 'ট্যাক্স ও ভ্যাট সাপোর্ট' },
  technology: { en: 'Software & Technology', bn: 'সফটওয়্যার ও টেকনোলজি' },
  bpo: { en: 'BPO & Back-Office', bn: 'বিপিও ও ব্যাক-অফিস' },
  training: { en: 'Training Programs', bn: 'প্রশিক্ষণ প্রোগ্রাম' },
};

const SOFTWARE_DEMO_NAMES: Record<SoftwareDemoType, { en: string; bn: string; badge?: string }> = {
  business: { en: 'TecHisab Business', bn: 'টেকহিসাব বিজনেস', badge: 'SME' },
  erp: { en: 'TecHisab ERP', bn: 'টেকহিসাব ইআরপি', badge: 'Enterprise' },
  'cloud-accounting': { en: 'TecHisab Cloud Accounting', bn: 'টেকহিসাব ক্লাউড একাউন্টিং', badge: 'Double-Entry' },
  'retail-manager': { en: 'TecHisab Retail Manager', bn: 'টেকহিসাব রিটেইল ম্যানেজার', badge: 'Retail' },
  'pos-pro': { en: 'TecHisab POS Pro', bn: 'টেকহিসাব পিওএস প্রো', badge: 'POS' },
  'trade-manager': { en: 'TecHisab Trade Manager', bn: 'টেকহিসাব ট্রেড ম্যানেজার', badge: 'Wholesale' },
  'inventory-pro': { en: 'TecHisab Inventory Pro', bn: 'টেকহিসাব ইনভেন্টরি প্রো', badge: 'Warehouse' },
  one: { en: 'TecHisab One', bn: 'টেকহিসাব ওয়ান', badge: 'Unified' },
  jibon: { en: 'Jibon (জীবন)', bn: 'জীবন (Jibon)', badge: 'Personal' },
  calculators: { en: 'Business & Financial Calculators', bn: 'বিজনেস ক্যালকুলেটরস', badge: '8 Tools' },
};

const LEGAL_LABELS: Record<string, { en: string; bn: string }> = {
  'privacy-policy': { en: 'Privacy Policy', bn: 'গোপনীয়তা নীতি' },
  'terms-of-service': { en: 'Terms of Service', bn: 'সেবার শর্তাবলি' },
  'refund-policy': { en: 'Refund & Cancellation Policy', bn: 'রিফান্ড ও বাতিলকরণ নীতিমালা' },
  'tax-disclaimer': { en: 'Tax Disclaimer', bn: 'কর ও বিধিবদ্ধ ঘোষণা' },
};

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  activeTab,
  selectedService,
  selectedServiceLanding,
  selectedCourse,
  selectedBlog,
  serviceFilter,
  softwareDemoTab,
  blogCategory = 'all',
  onNavigate,
  onClearSelectedService,
  onClearSelectedCourse,
  onClearSelectedBlog,
  onSetServiceFilter,
  onSelectSoftwareDemoTab,
  onSelectService,
  onSelectServiceSlug,
  onSelectCourse,
  onSelectBlogCategory,
}) => {
  const { isBengali, pick } = useLanguage();
  const { showFeedback } = useFeedback();
  const [copied, setCopied] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenDropdownId(null);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpenDropdownId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleAnchorClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    cb?: () => void
  ) => {
    if (!cb) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    cb();
  };

  const crumbs: CrumbItem[] = [];

  const primarySectionDropdown = [
    {
      id: 'sec-services',
      label: isBengali ? 'সেবাসমূহ' : 'Services',
      href: '/services',
      icon: Briefcase,
      onClick: () => {
        onClearSelectedService();
        onClearSelectedCourse();
        onNavigate('services');
      },
    },
    {
      id: 'sec-software',
      label: isBengali ? 'সফটওয়্যার পোর্টফোলিও' : 'Software',
      href: '/software',
      icon: Laptop,
      onClick: () => {
        onClearSelectedService();
        onClearSelectedCourse();
        onNavigate('software');
      },
    },
    {
      id: 'sec-training',
      label: isBengali ? 'প্রশিক্ষণ' : 'Training',
      href: '/training',
      icon: GraduationCap,
      onClick: () => {
        onClearSelectedService();
        onClearSelectedCourse();
        onNavigate('training');
      },
    },
    {
      id: 'sec-pricing',
      label: isBengali ? 'মূল্যতালিকা' : 'Pricing',
      href: '/pricing',
      icon: DollarSign,
      onClick: () => onNavigate('pricing'),
    },
    {
      id: 'sec-blog',
      label: isBengali ? 'ব্লগ' : 'Blog',
      href: '/blog',
      icon: BookOpen,
      onClick: () => onNavigate('blog'),
    },
    {
      id: 'sec-about',
      label: isBengali ? 'আমাদের পরিচিতি' : 'About',
      href: '/about',
      icon: Users,
      onClick: () => onNavigate('about'),
    },
    {
      id: 'sec-contact',
      label: isBengali ? 'যোগাযোগ' : 'Contact',
      href: '/contact',
      icon: Mail,
      onClick: () => onNavigate('contact'),
    },
  ];

  crumbs.push({
    id: 'root-home',
    label: isBengali ? 'হোম' : 'Home',
    href: '/',
    icon: Home,
    onClick: () => {
      onClearSelectedService();
      onClearSelectedCourse();
      if (onClearSelectedBlog) onClearSelectedBlog();
      onNavigate('home');
    },
    isCurrent: activeTab === 'home' && !selectedService && !selectedCourse && !selectedBlog,
    dropdownItems: primarySectionDropdown,
  });

  const serviceLandingDropdown = SERVICE_LANDING_PAGES.map((svc) => ({
    id: `svc-landing-${svc.slug}`,
    label: isBengali ? svc.badgeBn : svc.badge,
    href: `/services/${svc.slug}`,
    onClick: () => {
      if (onSelectServiceSlug) {
        onSelectServiceSlug(svc.slug);
      } else {
        onNavigate('services');
      }
    },
  }));

  const serviceCategoriesDropdown = Object.entries(SERVICE_CATEGORY_LABELS).map(([catId, names]) => ({
    id: `cat-${catId}`,
    label: isBengali ? names.bn : names.en,
    href: '/services',
    onClick: () => {
      onClearSelectedService();
      if (onSetServiceFilter) onSetServiceFilter(catId);
      onNavigate('services');
    },
  }));

  const softwareToolsDropdown = (Object.keys(SOFTWARE_DEMO_NAMES) as SoftwareDemoType[]).map((key) => {
    const item = SOFTWARE_DEMO_NAMES[key];
    return {
      id: `soft-${key}`,
      label: isBengali ? item.bn : item.en,
      href: buildPathForState({ tab: 'software', softwareDemoTab: key }),
      badge: item.badge,
      onClick: () => {
        if (onSelectSoftwareDemoTab) onSelectSoftwareDemoTab(key);
        onNavigate(key === 'calculators' ? 'software-tax' : 'software');
      },
    };
  });

  if (activeTab === 'service-detail' && selectedServiceLanding) {
    crumbs.push({
      id: 'crumb-services-root',
      label: isBengali ? 'সেবাসমূহ' : 'Services',
      href: '/services',
      icon: Briefcase,
      onClick: () => {
        onClearSelectedService();
        if (onSetServiceFilter) onSetServiceFilter('all');
        onNavigate('services');
      },
      isCurrent: false,
      dropdownItems: serviceLandingDropdown,
    });

    crumbs.push({
      id: `crumb-service-landing-${selectedServiceLanding.slug}`,
      label: isBengali ? selectedServiceLanding.badgeBn : selectedServiceLanding.badge,
      href: `/services/${selectedServiceLanding.slug}`,
      icon: Briefcase,
      isCurrent: true,
      dropdownItems: serviceLandingDropdown,
    });
  } else if (activeTab === 'services' || (activeTab === 'home' && selectedService)) {
    crumbs.push({
      id: 'crumb-services-root',
      label: isBengali ? 'সেবাসমূহ' : 'Services',
      href: '/services',
      icon: Briefcase,
      onClick: () => {
        onClearSelectedService();
        if (onSetServiceFilter) onSetServiceFilter('all');
        onNavigate('services');
      },
      isCurrent: !selectedService && serviceFilter === 'all',
      dropdownItems: serviceCategoriesDropdown,
    });

    const activeCatId = selectedService ? selectedService.category : serviceFilter !== 'all' ? serviceFilter : null;

    if (activeCatId) {
      const catLabel = SERVICE_CATEGORY_LABELS[activeCatId]
        ? isBengali
          ? SERVICE_CATEGORY_LABELS[activeCatId].bn
          : SERVICE_CATEGORY_LABELS[activeCatId].en
        : activeCatId;

      const siblingServices = SERVICES_DATA.filter((s) => s.category === activeCatId).map((s) => {
        const locS = localizeService(s, isBengali);
        return {
          id: `svc-${s.id}`,
          label: locS.title,
          href: '/services',
          badge: locS.tag,
          onClick: () => {
            if (onSelectService) onSelectService(s);
            else onNavigate('services');
          },
        };
      });

      crumbs.push({
        id: `crumb-service-cat-${activeCatId}`,
        label: catLabel,
        href: '/services',
        icon: Tag,
        onClick: () => {
          onClearSelectedService();
          if (onSetServiceFilter) onSetServiceFilter(activeCatId);
          onNavigate('services');
        },
        isCurrent: !selectedService,
        dropdownItems: siblingServices.length > 0 ? siblingServices : undefined,
      });
    }

    if (selectedService) {
      const locService = localizeService(selectedService, isBengali);
      crumbs.push({
        id: `crumb-service-detail-${selectedService.id}`,
        label: locService.title,
        icon: Briefcase,
        isCurrent: true,
      });
    }
  } else if (activeTab === 'software' || activeTab === 'software-tax') {
    crumbs.push({
      id: 'crumb-software-root',
      label: isBengali ? 'সফটওয়্যার' : 'Software',
      href: '/software',
      icon: Laptop,
      onClick: () => {
        if (onSelectSoftwareDemoTab) onSelectSoftwareDemoTab('business');
        onNavigate('software');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      isCurrent: false,
      dropdownItems: softwareToolsDropdown,
    });

    const activeSoftwareInfo = SOFTWARE_DEMO_NAMES[softwareDemoTab] || {
      en: 'Software Sandbox',
      bn: 'সফটওয়্যার প্রিভিউ',
    };

    crumbs.push({
      id: `crumb-software-demo-${softwareDemoTab}`,
      label: isBengali ? activeSoftwareInfo.bn : activeSoftwareInfo.en,
      href: buildPathForState({ tab: 'software', softwareDemoTab }),
      badge: activeSoftwareInfo.badge,
      isCurrent: true,
      dropdownItems: softwareToolsDropdown,
    });
  } else if (activeTab === 'training' || (activeTab === 'home' && selectedCourse)) {
    const coursesDropdown = TRAINING_COURSES.map((c) => {
      const locC = localizeCourse(c, isBengali);
      return {
        id: `course-${c.id}`,
        label: locC.title,
        href: '/training',
        badge: locC.feeDisplay,
        onClick: () => {
          if (onSelectCourse) onSelectCourse(c);
          onNavigate('training');
        },
      };
    });

    crumbs.push({
      id: 'crumb-training-root',
      label: isBengali ? 'প্রশিক্ষণ' : 'Training',
      href: '/training',
      icon: GraduationCap,
      onClick: () => {
        onClearSelectedCourse();
        onNavigate('training');
      },
      isCurrent: !selectedCourse,
      dropdownItems: coursesDropdown,
    });

    if (selectedCourse) {
      const locCourse = localizeCourse(selectedCourse, isBengali);
      crumbs.push({
        id: `crumb-course-detail-${selectedCourse.id}`,
        label: locCourse.title,
        href: '/training',
        icon: GraduationCap,
        isCurrent: true,
      });
    }
  } else if (activeTab === 'blog' || activeTab === 'blog-article') {
    const blogCategoriesDropdown = BLOG_CATEGORIES.map((cat) => ({
      id: `blog-cat-${cat}`,
      label: getBlogCategoryLabel(cat, isBengali),
      href: '/blog',
      onClick: () => {
        if (onClearSelectedBlog) onClearSelectedBlog();
        if (onSelectBlogCategory) onSelectBlogCategory(cat);
        onNavigate('blog');
      },
    }));

    crumbs.push({
      id: 'crumb-blog-root',
      label: isBengali ? 'ব্লগ' : 'Blog',
      href: '/blog',
      icon: BookOpen,
      onClick: () => {
        if (onClearSelectedBlog) onClearSelectedBlog();
        if (onSelectBlogCategory) onSelectBlogCategory('all');
        onNavigate('blog');
      },
      isCurrent: activeTab === 'blog' && !selectedBlog && (!blogCategory || blogCategory === 'all'),
      dropdownItems: blogCategoriesDropdown,
    });

    if (selectedBlog) {
      const locBlog = localizeBlogPost(selectedBlog, isBengali);
      crumbs.push({
        id: `crumb-blog-detail-${selectedBlog.id}`,
        label: locBlog.title,
        href: `/blog/${selectedBlog.slug}`,
        icon: FileText,
        badge: locBlog.readTime,
        isCurrent: true,
      });
    } else if (blogCategory && blogCategory !== 'all') {
      crumbs.push({
        id: `crumb-blog-cat-only-${blogCategory}`,
        label: getBlogCategoryLabel(blogCategory, isBengali),
        href: '/blog',
        icon: Tag,
        isCurrent: true,
      });
    }
  } else if (activeTab === 'pricing') {
    crumbs.push({
      id: 'crumb-pricing-root',
      label: isBengali ? 'মূল্যতালিকা' : 'Pricing',
      href: '/pricing',
      icon: DollarSign,
      isCurrent: true,
    });
  } else if (activeTab === 'about') {
    crumbs.push({
      id: 'crumb-about-root',
      label: isBengali ? 'আমাদের পরিচিতি' : 'About TecHisab',
      href: '/about',
      icon: Users,
      isCurrent: true,
    });
  } else if (activeTab === 'contact') {
    crumbs.push({
      id: 'crumb-contact-root',
      label: isBengali ? 'যোগাযোগ' : 'Contact',
      href: '/contact',
      icon: Mail,
      isCurrent: true,
    });
  } else if (LEGAL_LABELS[activeTab]) {
    crumbs.push({
      id: `crumb-legal-${activeTab}`,
      label: isBengali ? LEGAL_LABELS[activeTab].bn : LEGAL_LABELS[activeTab].en,
      href: `/${activeTab}`,
      icon: Scale,
      isCurrent: true,
    });
  } else if (activeTab === 'not-found') {
    crumbs.push({
      id: 'crumb-not-found',
      label: pick('404 Not Found', '৪০৪ পাওয়া যায়নি'),
      isCurrent: true,
    });
  }

  const handleBackOneLevel = () => {
    if (activeTab === 'service-detail') {
      onNavigate('services');
      return;
    }
    if (activeTab === 'blog-article') {
      if (onClearSelectedBlog) onClearSelectedBlog();
      onNavigate('blog');
      return;
    }
    if (selectedService) {
      onClearSelectedService();
      return;
    }
    if (selectedCourse) {
      onClearSelectedCourse();
      return;
    }
    if (selectedBlog && onClearSelectedBlog) {
      onClearSelectedBlog();
      return;
    }
    if (activeTab === 'services' && serviceFilter !== 'all' && onSetServiceFilter) {
      onSetServiceFilter('all');
      return;
    }
    onNavigate('home');
  };

  const handleCopyPath = () => {
    const textPath = crumbs.map((c) => c.label).join(' > ');
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(textPath);
      setCopied(true);
      showFeedback({
        type: 'success',
        title: isBengali ? 'পাথ কপি করা হয়েছে' : 'Path Copied',
        message: textPath,
      });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const isDeepNested =
    selectedService !== null ||
    selectedCourse !== null ||
    (selectedBlog !== null && activeTab !== 'blog-article') ||
    (activeTab === 'services' && serviceFilter !== 'all');

  return (
    <nav
      id="app-dynamic-breadcrumbs-nav"
      aria-label="Breadcrumb Navigation"
      className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border-b border-[#D7E2F3] dark:border-slate-800 py-2 px-4 sm:px-6 lg:px-8 text-xs select-none sticky top-20 z-30"
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center min-w-0 relative" ref={dropdownRef}>
          {crumbs.length > 1 && (
            <button
              type="button"
              onClick={handleBackOneLevel}
              className="shrink-0 mr-2 inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-[#F4F8FF] dark:bg-slate-800 border border-[#D7E2F3] dark:border-slate-700 hover:border-[#0345A4] text-[#0B1730] dark:text-slate-300 font-semibold transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#0345A4] dark:text-sky-400" />
              <span className="hidden md:inline text-[11px]">{isBengali ? 'পূর্ববর্তী' : 'Back'}</span>
            </button>
          )}

          <ol className="flex items-center gap-1 overflow-x-auto no-scrollbar whitespace-nowrap py-0.5">
            {crumbs.map((crumb, index) => {
              const Icon = crumb.icon;
              const isLast = index === crumbs.length - 1;
              const hasDropdown = crumb.dropdownItems && crumb.dropdownItems.length > 0;
              const isDropdownOpen = openDropdownId === crumb.id;

              return (
                <li key={crumb.id} className="flex items-center shrink-0 relative">
                  {index > 0 && <ChevronRight className="w-3.5 h-3.5 text-[#5F6D82]/60 mx-1 shrink-0" />}

                  {isLast ? (
                    <span
                      aria-current="page"
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#F4F8FF] dark:bg-slate-800 font-bold text-[#0B1730] dark:text-white border border-[#D7E2F3] dark:border-slate-700"
                    >
                      {Icon && <Icon className="w-3.5 h-3.5 text-[#0345A4] dark:text-sky-400 shrink-0" />}
                      <span className="truncate max-w-[180px] sm:max-w-[300px] text-xs">{crumb.label}</span>
                    </span>
                  ) : (
                    <div className="relative inline-flex items-center">
                      {crumb.href ? (
                        <a
                          href={crumb.href}
                          onClick={(e) => handleAnchorClick(e, crumb.onClick)}
                          className="inline-flex items-center gap-1 px-1.5 py-1 rounded-md text-[#5F6D82] dark:text-slate-400 hover:text-[#0345A4] dark:hover:text-sky-400 font-medium transition-colors"
                        >
                          {Icon && <Icon className="w-3.5 h-3.5 shrink-0" />}
                          <span className="truncate max-w-[140px] sm:max-w-[200px]">{crumb.label}</span>
                        </a>
                      ) : (
                        <button
                          type="button"
                          onClick={crumb.onClick}
                          className="inline-flex items-center gap-1 px-1.5 py-1 rounded-md text-[#5F6D82] dark:text-slate-400 hover:text-[#0345A4] dark:hover:text-sky-400 font-medium transition-colors cursor-pointer"
                        >
                          {Icon && <Icon className="w-3.5 h-3.5 shrink-0" />}
                          <span className="truncate max-w-[140px] sm:max-w-[200px]">{crumb.label}</span>
                        </button>
                      )}

                      {hasDropdown && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenDropdownId(isDropdownOpen ? null : crumb.id);
                          }}
                          className="p-0.5 ml-0.5 text-[#5F6D82] hover:text-[#0345A4] cursor-pointer rounded"
                          aria-label={pick('Quick switch', 'দ্রুত পরিবর্তন করুন')}
                          title={pick('Quick switch', 'দ্রুত পরিবর্তন করুন')}
                        >
                          <ChevronDown className={`w-3 h-3 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>
                      )}
                    </div>
                  )}

                  {hasDropdown && isDropdownOpen && (
                    <div className="absolute top-full left-0 mt-1.5 w-64 max-h-72 overflow-y-auto bg-white dark:bg-slate-900 border border-[#D7E2F3] dark:border-slate-800 rounded-xl shadow-xl z-50 p-1.5">
                      {crumb.dropdownItems!.map((drop) => {
                        const DropIcon = drop.icon;
                        return (
                          <a
                            key={drop.id}
                            href={drop.href}
                            onClick={(e) => {
                              handleAnchorClick(e, drop.onClick);
                              setOpenDropdownId(null);
                            }}
                            className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-[#F4F8FF] dark:hover:bg-slate-800 text-[#0B1730] dark:text-slate-300 hover:text-[#0345A4] text-xs font-medium flex items-center justify-between gap-2 transition-colors"
                          >
                            <div className="flex items-center gap-1.5 truncate">
                              {DropIcon && <DropIcon className="w-3.5 h-3.5 text-[#5F6D82] shrink-0" />}
                              <span className="truncate">{drop.label}</span>
                            </div>
                          </a>
                        );
                      })}
                    </div>
                  )}
                </li>
              );
            })}
          </ol>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
          {isDeepNested && (
            <button
              type="button"
              onClick={() => {
                onClearSelectedService();
                onClearSelectedCourse();
                if (onClearSelectedBlog) onClearSelectedBlog();
                if (activeTab === 'services' && onSetServiceFilter) {
                  onSetServiceFilter('all');
                }
              }}
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#5F6D82] hover:text-rose-600 px-2 py-0.5 rounded-md transition-colors cursor-pointer"
            >
              <X className="w-3 h-3" />
              <span>{isBengali ? 'ফিরে যান' : 'Reset Filter'}</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleCopyPath}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium text-[#5F6D82] hover:text-[#0345A4] hover:bg-[#F4F8FF] transition-colors cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-600" />
                <span className="text-emerald-700 font-bold">{pick('Copied', 'কপি হয়েছে')}</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span className="hidden md:inline">{pick('Copy Path', 'পাথ কপি করুন')}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
};

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X, Briefcase, Cpu, BookOpen, ArrowRight, CornerDownLeft, Filter } from 'lucide-react';
import { SERVICES_DATA } from '../../data/servicesData';
import { SOFTWARE_PRODUCTS } from '../../data/softwareData';
import { BLOG_POSTS } from '../../data/blogData';
import {
  localizeService,
  localizeSoftwareProduct,
  localizeBlogPost,
  getBlogCategoryLabel,
} from '../../data/localizedData';
import { NavigationTab, ServiceItem, SoftwareProduct, BlogPost } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

export interface SearchResultItem {
  id: string;
  type: 'service' | 'software' | 'blog';
  title: string;
  subtitle: string;
  category: string;
  searchText: string;
  rawItem: ServiceItem | SoftwareProduct | BlogPost;
}

interface NavbarSearchProps {
  onNavigateToService?: (service: ServiceItem) => void;
  onNavigateToSoftware?: (softwareId: string) => void;
  onNavigateToBlog?: (post: BlogPost) => void;
  onNavigateTab: (tab: NavigationTab) => void;
  className?: string;
  isMobileCompact?: boolean;
}

export const NavbarSearch: React.FC<NavbarSearchProps> = ({
  onNavigateToService,
  onNavigateToSoftware,
  onNavigateToBlog,
  onNavigateTab,
  className = '',
  isMobileCompact = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'service' | 'software' | 'blog'>('all');
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const { isBengali, pick } = useLanguage();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;

      if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || (!isInput && e.key === '/')) {
        e.preventDefault();
        setIsOpen(true);
      } else if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    } else {
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const allSearchableItems: SearchResultItem[] = useMemo(() => {
    const items: SearchResultItem[] = [];

    SERVICES_DATA.forEach((s) => {
      const bn = localizeService(s, true);
      const disp = isBengali ? bn : s;
      items.push({
        id: `service-${s.id}`,
        type: 'service',
        title: disp.title,
        subtitle: disp.shortDesc,
        category: disp.categoryLabel,
        searchText: [
          s.title,
          s.shortDesc,
          s.category,
          s.tag || '',
          ...s.features,
          bn.title,
          bn.shortDesc,
          bn.categoryLabel,
          ...bn.features,
        ]
          .join(' ')
          .toLowerCase(),
        rawItem: s,
      });
    });

    SOFTWARE_PRODUCTS.forEach((p) => {
      const bn = localizeSoftwareProduct(p, true);
      const disp = isBengali ? bn : p;
      items.push({
        id: `software-${p.id}`,
        type: 'software',
        title: disp.name,
        subtitle: `${disp.tagline} • ${disp.monthlyPriceLabel}`,
        category: disp.category,
        searchText: [
          p.name,
          p.tagline,
          p.category,
          ...p.features,
          bn.name,
          bn.tagline,
          bn.category,
          ...bn.features,
        ]
          .join(' ')
          .toLowerCase(),
        rawItem: p,
      });
    });

    BLOG_POSTS.forEach((b) => {
      const bn = localizeBlogPost(b, true);
      const disp = isBengali ? bn : b;
      items.push({
        id: `blog-${b.id}`,
        type: 'blog',
        title: disp.title,
        subtitle: disp.summary,
        category: getBlogCategoryLabel(b.category, isBengali),
        searchText: [
          b.title,
          b.summary,
          b.category,
          ...b.tags,
          bn.title,
          bn.summary,
          getBlogCategoryLabel(b.category, true),
          ...bn.tags,
        ]
          .join(' ')
          .toLowerCase(),
        rawItem: b,
      });
    });

    return items;
  }, [isBengali]);

  const filteredResults = useMemo(() => {
    let list = allSearchableItems;

    if (activeFilter !== 'all') {
      list = list.filter((item) => item.type === activeFilter);
    }

    const trimmed = query.trim().toLowerCase();
    if (!trimmed) {
      return [];
    }

    return list.filter((item) => item.searchText.includes(trimmed));
  }, [allSearchableItems, query, activeFilter]);

  const handleSelectItem = (item: SearchResultItem) => {
    setIsOpen(false);

    if (item.type === 'service') {
      onNavigateTab('services');
      if (onNavigateToService) {
        onNavigateToService(item.rawItem as ServiceItem);
      }
    } else if (item.type === 'software') {
      onNavigateTab('software');
      if (onNavigateToSoftware) {
        onNavigateToSoftware((item.rawItem as SoftwareProduct).id);
      }
    } else if (item.type === 'blog') {
      onNavigateTab('blog');
      if (onNavigateToBlog) {
        onNavigateToBlog(item.rawItem as BlogPost);
      }
    }
  };

  const handleKeyDownInInput = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < filteredResults.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredResults[selectedIndex]) {
        handleSelectItem(filteredResults[selectedIndex]);
      }
    }
  };

  const getTypeLabel = (type: SearchResultItem['type']) => {
    if (type === 'service') return pick('Service', 'সেবা');
    if (type === 'software') return pick('Software', 'সফটওয়্যার');
    return pick('Blog', 'ব্লগ');
  };

  return (
    <>
      {/* Icon-only Search Trigger (no preview badge) */}
      <button
        type="button"
        id={isMobileCompact ? 'mobile-search-trigger-btn' : 'desktop-search-trigger-btn'}
        onClick={() => setIsOpen(true)}
        aria-label={pick('Search platform (Ctrl+K)', 'অনুসন্ধান করুন (Ctrl+K)')}
        title={pick('Search (Ctrl+K)', 'অনুসন্ধান (Ctrl+K)')}
        className={`p-2 rounded-xl text-[#5F6D82] dark:text-slate-300 hover:text-[#0345A4] dark:hover:text-white bg-[#F4F8FF] dark:bg-slate-800/80 hover:bg-[#D7E2F3]/50 dark:hover:bg-slate-700/80 transition-all cursor-pointer border border-[#D7E2F3] dark:border-slate-700 active:scale-95 flex items-center justify-center shrink-0 ${className}`}
      >
        <Search className="w-4 h-4 transition-colors" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <div
            id="navbar-search-modal-backdrop"
            className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-[#0B1730]/60 backdrop-blur-sm"
            onClick={(e) => {
              if (e.target === e.currentTarget) setIsOpen(false);
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: -16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -16 }}
              transition={{ duration: 0.15 }}
              className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-[#D7E2F3] dark:border-slate-800 overflow-hidden flex flex-col max-h-[80vh]"
            >
              <div className="flex items-center px-4 py-3.5 border-b border-[#D7E2F3] dark:border-slate-800 gap-3">
                <Search className="w-5 h-5 text-[#0345A4] dark:text-sky-400 shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setSelectedIndex(0);
                  }}
                  onKeyDown={handleKeyDownInInput}
                  placeholder={pick(
                    'Search accounting services, software (Business, ERP, Jibon), or tax guides...',
                    'সেবা, সফটওয়্যার (TecHisab ERP, জীবন), আয়কর বা ব্লগ আর্টিকেল খুঁজুন...'
                  )}
                  className={`w-full bg-transparent text-sm text-[#0B1730] dark:text-white outline-none placeholder:text-[#5F6D82]/70 ${
                    isBengali ? 'font-bangla' : ''
                  }`}
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery('')}
                    aria-label={pick('Clear search query', 'সার্চ লেখা মুছুন')}
                    className="p-1 rounded-md text-[#5F6D82] hover:text-[#0B1730] dark:hover:text-slate-200 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-2 py-1 rounded-md text-xs font-semibold text-[#5F6D82] hover:bg-[#F4F8FF] dark:hover:bg-slate-800 cursor-pointer"
                >
                  ESC
                </button>
              </div>

              <div className="flex items-center gap-1.5 px-4 py-2.5 bg-[#F4F8FF] dark:bg-slate-850/60 border-b border-[#D7E2F3] dark:border-slate-800 overflow-x-auto text-xs">
                <span className="text-[#5F6D82] text-[11px] font-semibold flex items-center gap-1 mr-1">
                  <Filter className="w-3 h-3" />
                  <span>{pick('Filter:', 'ফিল্টার:')}</span>
                </span>

                <button
                  type="button"
                  onClick={() => {
                    setActiveFilter('all');
                    setSelectedIndex(0);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    activeFilter === 'all'
                      ? 'bg-[#0345A4] text-white'
                      : 'text-[#5F6D82] dark:text-slate-400 hover:bg-white dark:hover:bg-slate-750'
                  }`}
                >
                  {pick(`All (${allSearchableItems.length})`, `সব (${allSearchableItems.length})`)}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveFilter('service');
                    setSelectedIndex(0);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 ${
                    activeFilter === 'service'
                      ? 'bg-[#0345A4] text-white'
                      : 'text-[#5F6D82] dark:text-slate-400 hover:bg-white dark:hover:bg-slate-750'
                  }`}
                >
                  <Briefcase className="w-3 h-3" />
                  <span>{pick(`Services (${SERVICES_DATA.length})`, `সেবা (${SERVICES_DATA.length})`)}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveFilter('software');
                    setSelectedIndex(0);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 ${
                    activeFilter === 'software'
                      ? 'bg-[#0345A4] text-white'
                      : 'text-[#5F6D82] dark:text-slate-400 hover:bg-white dark:hover:bg-slate-750'
                  }`}
                >
                  <Cpu className="w-3 h-3" />
                  <span>
                    {pick(`Software (${SOFTWARE_PRODUCTS.length})`, `সফটওয়্যার (${SOFTWARE_PRODUCTS.length})`)}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveFilter('blog');
                    setSelectedIndex(0);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 ${
                    activeFilter === 'blog'
                      ? 'bg-[#0345A4] text-white'
                      : 'text-[#5F6D82] dark:text-slate-400 hover:bg-white dark:hover:bg-slate-750'
                  }`}
                >
                  <BookOpen className="w-3 h-3" />
                  <span>{pick(`Articles (${BLOG_POSTS.length})`, `আর্টিকেল (${BLOG_POSTS.length})`)}</span>
                </button>
              </div>

              <div className="overflow-y-auto p-2 space-y-1 divide-y divide-[#D7E2F3]/50 dark:divide-slate-800/40">
                {!query.trim() ? (
                  <div className="py-10 px-4 text-center text-[#5F6D82] dark:text-slate-400">
                    <div className="w-12 h-12 rounded-2xl bg-[#F4F8FF] dark:bg-sky-950/60 text-[#0345A4] dark:text-sky-400 flex items-center justify-center mx-auto mb-3 border border-[#D7E2F3] dark:border-sky-900/50">
                      <Search className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-bold text-[#0B1730] dark:text-slate-200">
                      {pick('Search TecHisab Directory', 'টেকহিসাব ডিরেক্টরি অনুসন্ধান করুন')}
                    </p>
                    <p className="text-xs text-[#5F6D82] dark:text-slate-400 mt-1 max-w-sm mx-auto">
                      {pick(
                        'Type keywords to find accounting services, software products, tax guides, and blog articles.',
                        'অ্যাকাউন্টিং সেবা, ভ্যাট ও ট্যাক্স, সফটওয়্যার বা ব্লগ আর্টিকেল দেখতে টাইপ করুন।'
                      )}
                    </p>
                  </div>
                ) : filteredResults.length === 0 ? (
                  <div className="py-12 text-center text-[#5F6D82] dark:text-slate-400">
                    <p className="text-sm font-semibold text-[#0B1730] dark:text-white">
                      {pick(`No results found for “${query}”`, `“${query}” এর জন্য কোনো ফলাফল পাওয়া যায়নি`)}
                    </p>
                    <p className="text-xs mt-1">
                      {pick(
                        'Try searching for VAT, Tax, Jibon, Bookkeeping, or ERP.',
                        'ভ্যাট, ট্যাক্স, জীবন, বুককিপিং অথবা ইআরপি লিখে খুঁজুন।'
                      )}
                    </p>
                  </div>
                ) : (
                  filteredResults.map((item, idx) => {
                    const isSelected = idx === selectedIndex;
                    return (
                      <div
                        key={item.id}
                        onClick={() => handleSelectItem(item)}
                        onMouseEnter={() => setSelectedIndex(idx)}
                        className={`p-3 rounded-xl cursor-pointer transition-all flex items-start justify-between gap-3 ${
                          isSelected
                            ? 'bg-[#F4F8FF] dark:bg-sky-950/40 border border-[#D7E2F3] dark:border-sky-800/80'
                            : 'hover:bg-slate-50 dark:hover:bg-slate-800/60 border border-transparent'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`p-2 rounded-xl shrink-0 mt-0.5 ${
                              item.type === 'service'
                                ? 'bg-[#F4F8FF] dark:bg-blue-950 text-[#0345A4] dark:text-blue-400 border border-[#D7E2F3] dark:border-blue-900'
                                : item.type === 'software'
                                ? 'bg-[#F4F8FF] dark:bg-sky-950 text-[#0A63D8] dark:text-sky-400 border border-[#D7E2F3] dark:border-sky-900'
                                : 'bg-slate-100 dark:bg-slate-800 text-[#02377F] dark:text-slate-300'
                            }`}
                          >
                            {item.type === 'service' && <Briefcase className="w-4 h-4" />}
                            {item.type === 'software' && <Cpu className="w-4 h-4" />}
                            {item.type === 'blog' && <BookOpen className="w-4 h-4" />}
                          </div>

                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider bg-[#F4F8FF] text-[#0345A4] dark:bg-sky-900/40 dark:text-sky-300">
                                {getTypeLabel(item.type)}
                              </span>
                              <h4 className="text-sm font-bold text-[#0B1730] dark:text-slate-100">
                                {item.title}
                              </h4>
                            </div>

                            <p className="text-xs text-[#5F6D82] dark:text-slate-400 line-clamp-1">
                              {item.subtitle}
                            </p>
                          </div>
                        </div>

                        <div className="shrink-0 flex items-center gap-1 text-xs font-semibold text-[#0345A4] dark:text-sky-400 self-center">
                          <span className="hidden sm:inline">{pick('Open', 'খুলুন')}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              <div className="px-4 py-2.5 bg-[#F4F8FF] dark:bg-slate-850 border-t border-[#D7E2F3] dark:border-slate-800 text-[11px] text-[#5F6D82] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <CornerDownLeft className="w-3 h-3" />
                    <span>{pick('Enter to select', 'নির্বাচন করতে Enter')}</span>
                  </span>
                  <span>{pick('↑↓ to navigate', '↑↓ নেভিগেট')}</span>
                </div>
                <span className="font-semibold text-[#0345A4] dark:text-sky-400">
                  {pick('ESC to close', 'বন্ধ করতে ESC')}
                </span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};


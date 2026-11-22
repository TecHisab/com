import React, { useState, useEffect } from 'react';
import { NavigationTab, ServiceItem, SoftwareProduct, BlogPost } from '../../types';
import { BrandLogo } from './BrandLogo';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { LanguageSwitcher } from './LanguageSwitcher';
import { NavbarSearch } from './NavbarSearch';
import { Sun, Moon, Menu, X, ArrowRight } from 'lucide-react';

interface NavbarProps {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  onOpenGetStarted?: () => void;
  onNavigateToService?: (service: ServiceItem) => void;
  onNavigateToSoftware?: (softwareId: string) => void;
  onNavigateToBlog?: (post?: BlogPost) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onNavigateToService,
  onNavigateToSoftware,
  onNavigateToBlog,
}) => {
  const { theme, toggleTheme } = useTheme();
  const { t, isBengali } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 16);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks: { id: NavigationTab; label: string }[] = [
    { id: 'home', label: t.nav.home },
    { id: 'about', label: t.nav.about },
    { id: 'services', label: t.nav.services },
    { id: 'software', label: t.nav.software },
    { id: 'training', label: t.nav.training },
    { id: 'pricing', label: t.nav.pricing },
    { id: 'blog', label: t.nav.blog },
    { id: 'contact', label: t.nav.contact },
  ];

  const handleNavClick = (tabId: NavigationTab) => {
    setActiveTab(tabId);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header
      id="main-navbar-header"
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 dark:bg-slate-950/95 backdrop-blur-md shadow-sm border-b border-[#D7E2F3] dark:border-slate-800'
          : 'bg-white/90 dark:bg-slate-950/90 backdrop-blur-sm border-b border-[#D7E2F3]/80 dark:border-slate-800/80'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Official Brand Logo */}
          <button
            type="button"
            onClick={() => handleNavClick('home')}
            className="flex items-center focus:outline-none cursor-pointer group text-left transition-transform hover:scale-[1.01] active:scale-[0.99]"
            aria-label="TecHisab Home"
          >
            <BrandLogo size="md" />
          </button>

          {/* Desktop Navigation Links */}
          <nav
            className="hidden xl:flex items-center gap-1"
            aria-label="Main Navigation"
          >
            {navLinks.map((link) => {
              const isActive = activeTab === link.id || (link.id === 'software' && activeTab === 'software-tax');
              return (
                <button
                  key={link.id}
                  id={`nav-link-${link.id}`}
                  type="button"
                  onClick={() => handleNavClick(link.id)}
                  className={`relative px-3.5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'text-[#0345A4] dark:text-sky-400 bg-[#F4F8FF] dark:bg-slate-900'
                      : 'text-[#0B1730]/80 dark:text-slate-300 hover:text-[#0345A4] dark:hover:text-white hover:bg-[#F4F8FF]/60 dark:hover:bg-slate-900/60'
                  } ${isBengali ? 'font-bangla' : ''}`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0.5 left-3.5 right-3.5 h-0.5 rounded-full bg-[#0345A4] dark:bg-sky-400" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Desktop Right Utilities: Icon Search, Language, Theme, Primary Consultation CTA */}
          <div className="hidden xl:flex items-center gap-2.5">
            <NavbarSearch
              onNavigateTab={handleNavClick}
              onNavigateToService={(service) => {
                if (onNavigateToService) onNavigateToService(service);
                else handleNavClick('services');
              }}
              onNavigateToSoftware={(softId) => {
                if (onNavigateToSoftware) onNavigateToSoftware(softId);
                else handleNavClick('software');
              }}
              onNavigateToBlog={(post) => {
                if (onNavigateToBlog) onNavigateToBlog(post);
                else handleNavClick('blog');
              }}
            />

            <LanguageSwitcher />

            <button
              type="button"
              id="theme-toggle-btn"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              className="p-2 rounded-xl text-[#5F6D82] dark:text-slate-300 hover:text-[#0345A4] dark:hover:text-white bg-[#F4F8FF] dark:bg-slate-800 hover:bg-[#D7E2F3]/50 dark:hover:bg-slate-700 transition-all cursor-pointer border border-[#D7E2F3] dark:border-slate-700 active:scale-95"
            >
              {theme === 'light' ? (
                <Moon className="w-4 h-4 text-[#0B1730]" />
              ) : (
                <Sun className="w-4 h-4 text-amber-400" />
              )}
            </button>

            <button
              type="button"
              id="navbar-consult-btn"
              onClick={() => handleNavClick('contact')}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0345A4] hover:bg-[#02377F] text-white text-sm font-semibold transition-all cursor-pointer shadow-xs active:scale-98"
            >
              <span className={isBengali ? 'font-bangla' : ''}>
                {isBengali ? 'পরামর্শ নিন' : 'Consult Us'}
              </span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile & Tablet Right Controls */}
          <div className="flex xl:hidden items-center gap-1.5 sm:gap-2">
            <NavbarSearch
              isMobileCompact
              onNavigateTab={handleNavClick}
              onNavigateToService={(service) => {
                if (onNavigateToService) onNavigateToService(service);
                else handleNavClick('services');
              }}
              onNavigateToSoftware={(softId) => {
                if (onNavigateToSoftware) onNavigateToSoftware(softId);
                else handleNavClick('software');
              }}
              onNavigateToBlog={(post) => {
                if (onNavigateToBlog) onNavigateToBlog(post);
                else handleNavClick('blog');
              }}
            />

            <LanguageSwitcher />

            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="p-2 rounded-xl text-[#5F6D82] dark:text-slate-300 hover:bg-[#F4F8FF] dark:hover:bg-slate-800 border border-[#D7E2F3] dark:border-slate-800 active:scale-95 cursor-pointer"
            >
              {theme === 'light' ? <Moon className="w-4 h-4 text-[#0B1730]" /> : <Sun className="w-4 h-4 text-amber-400" />}
            </button>

            <button
              type="button"
              id="mobile-hamburger-btn"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={isMobileMenuOpen}
              className="p-2 rounded-xl text-[#0B1730] dark:text-slate-200 hover:bg-[#F4F8FF] dark:hover:bg-slate-800 border border-[#D7E2F3] dark:border-slate-800 cursor-pointer active:scale-95"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div
          id="mobile-drawer-menu"
          className="xl:hidden border-b border-[#D7E2F3] dark:border-slate-800 bg-white dark:bg-slate-950 px-5 pt-4 pb-6 space-y-4 shadow-xl animate-in slide-in-from-top-4 duration-200"
        >
          <div className="grid grid-cols-2 gap-2">
            {navLinks.map((link) => {
              const isActive = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  type="button"
                  onClick={() => handleNavClick(link.id)}
                  className={`px-3.5 py-2.5 rounded-xl text-left text-sm font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#F4F8FF] dark:bg-sky-950/60 text-[#0345A4] dark:text-sky-400 border border-[#D7E2F3] dark:border-sky-900'
                      : 'text-[#0B1730] dark:text-slate-300 hover:bg-[#F4F8FF] dark:hover:bg-slate-800'
                  } ${isBengali ? 'font-bangla' : ''}`}
                >
                  {link.label}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => handleNavClick('contact')}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#0345A4] hover:bg-[#02377F] text-white font-semibold text-sm transition-colors cursor-pointer"
          >
            <span className={isBengali ? 'font-bangla' : ''}>
              {isBengali ? 'পরামর্শের জন্য অনুরোধ করুন' : 'Request a Consultation'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </header>
  );
};

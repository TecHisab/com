import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Globe } from 'lucide-react';

interface LanguageSwitcherProps {
  variant?: 'pill' | 'button';
  className?: string;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  variant = 'pill',
  className = ''
}) => {
  const { language, setLanguage, isBengali } = useLanguage();

  if (variant === 'button') {
    return (
      <button
        type="button"
        id="language-toggle-btn"
        onClick={() => setLanguage(language === 'en' ? 'bn' : 'en')}
        aria-label={isBengali ? 'Switch to English' : 'বাংলায় পরিবর্তন করুন'}
        title={isBengali ? 'Switch to English' : 'বাংলায় দেখুন'}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors cursor-pointer ${className}`}
      >
        <Globe className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
        <span className={isBengali ? 'font-bangla text-sm' : 'font-sans'}>
          {isBengali ? 'বাংলা' : 'English'}
        </span>
      </button>
    );
  }

  return (
    <div
      id="language-switcher-pill"
      className={`inline-flex items-center p-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 select-none ${className}`}
      role="group"
      aria-label="Language selection"
    >
      <button
        type="button"
        id="lang-btn-en"
        onClick={() => setLanguage('en')}
        className={`px-2 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
          language === 'en'
            ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-xs'
            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
        }`}
        aria-pressed={language === 'en'}
      >
        EN
      </button>

      <button
        type="button"
        id="lang-btn-bn"
        onClick={() => setLanguage('bn')}
        className={`px-2 py-1 rounded-md text-xs font-bold font-bangla transition-all cursor-pointer ${
          language === 'bn'
            ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-xs'
            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
        }`}
        aria-pressed={language === 'bn'}
      >
        বাং
      </button>
    </div>
  );
};

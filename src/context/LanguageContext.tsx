import React, { createContext, useContext, useEffect, useState } from 'react';
import { Language, TRANSLATIONS } from '../data/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: typeof TRANSLATIONS.en;
  isBengali: boolean;
  pick: <T = string>(en: T, bn: T) => T;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('techisab_lang') as Language;
      if (saved === 'en' || saved === 'bn') return saved;
    } catch {
      // fallback in isolated/iframe environments
    }
    return 'en';
  });

  useEffect(() => {
    try {
      localStorage.setItem('techisab_lang', language);
      document.documentElement.lang = language;
      
      if (language === 'bn') {
        document.body.classList.add('font-bangla-active');
      } else {
        document.body.classList.remove('font-bangla-active');
      }
    } catch {
      // ignore
    }
  }, [language]);

  const toggleLanguage = () => {
    setLanguageState((prev) => (prev === 'en' ? 'bn' : 'en'));
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = TRANSLATIONS[language];
  const isBengali = language === 'bn';
  const pick = <T = string>(en: T, bn: T): T => (isBengali ? bn : en);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t, isBengali, pick }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

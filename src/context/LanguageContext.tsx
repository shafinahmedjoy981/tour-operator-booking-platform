import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language } from '../types';
import { getTranslation } from '../utils/translations';
import {
  formatNumber as fmtNumber,
  formatCurrency as fmtCurrency,
  formatDate as fmtDate,
  formatTime as fmtTime,
  formatPlural as fmtPlural,
} from '../utils/formatters';

export interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (path: string, params?: Record<string, string | number>) => string;
  formatNumber: (num: number | string, options?: { minimumFractionDigits?: number; maximumFractionDigits?: number }) => string;
  formatCurrency: (amount: number | string, options?: { minimumFractionDigits?: number; maximumFractionDigits?: number }) => string;
  formatDate: (dateInput: string | Date, options?: Intl.DateTimeFormatOptions) => string;
  formatTime: (timeStr: string) => string;
  formatPlural: (count: number, singularEn: string, pluralEn: string, banglaSuffix?: string) => string;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('tidewise_lang');
      if (saved === 'en' || saved === 'bn') {
        return saved;
      }
    } catch {
      // LocalStorage not available or restricted
    }
    return 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('tidewise_lang', lang);
    } catch {
      // Ignore storage errors
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'bn' : 'en');
  };

  useEffect(() => {
    try {
      document.documentElement.lang = language;
    } catch {
      // Ignore DOM errors
    }
  }, [language]);

  const t = (path: string, params?: Record<string, string | number>): string => {
    return getTranslation(language, path, params);
  };

  const formatNumber = (
    num: number | string,
    options?: { minimumFractionDigits?: number; maximumFractionDigits?: number }
  ): string => {
    return fmtNumber(num, language, options);
  };

  const formatCurrency = (
    amount: number | string,
    options?: { minimumFractionDigits?: number; maximumFractionDigits?: number }
  ): string => {
    return fmtCurrency(amount, language, options);
  };

  const formatDate = (dateInput: string | Date, options?: Intl.DateTimeFormatOptions): string => {
    return fmtDate(dateInput, language, options);
  };

  const formatTime = (timeStr: string): string => {
    return fmtTime(timeStr, language);
  };

  const formatPlural = (
    count: number,
    singularEn: string,
    pluralEn: string,
    banglaSuffix?: string
  ): string => {
    return fmtPlural(count, singularEn, pluralEn, language, banglaSuffix);
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        t,
        formatNumber,
        formatCurrency,
        formatDate,
        formatTime,
        formatPlural,
      }}
    >
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

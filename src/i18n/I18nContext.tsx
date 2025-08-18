import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { 
  SupportedLocale, 
  TranslationKey, 
  TranslationValues, 
  I18nConfig, 
  I18nContextValue 
} from './types';
import { 
  getTranslation, 
  interpolate, 
  detectUserLocale, 
  isRTLLocale,
  formatDate,
  formatTime,
  formatDateTime,
  formatNumber,
  isValidLocale
} from './utils';
import { useLocalStorage } from '../hooks/useLocalStorage';

const defaultConfig: I18nConfig = {
  defaultLocale: 'pt-BR',
  fallbackLocale: 'pt-BR',
  supportedLocales: ['pt-BR', 'en-US', 'es-ES', 'fr-FR'],
  debug: process.env.NODE_ENV === 'development',
};

const I18nContext = createContext<I18nContextValue | null>(null);

interface I18nProviderProps {
  children: ReactNode;
  config?: Partial<I18nConfig>;
}

export function I18nProvider({ children, config: userConfig }: I18nProviderProps) {
  const config = { ...defaultConfig, ...userConfig };
  
  // Load saved locale from localStorage or detect from browser
  const [storedLocale, setStoredLocale] = useLocalStorage<SupportedLocale>(
    'luckywheel-locale',
    detectUserLocale(config.supportedLocales, config.defaultLocale)
  );
  
  const [locale, setLocaleState] = useState<SupportedLocale>(storedLocale);

  // Update localStorage when locale changes
  useEffect(() => {
    setStoredLocale(locale);
  }, [locale, setStoredLocale]);

  // Set HTML lang attribute
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = locale;
      document.documentElement.dir = isRTLLocale(locale) ? 'rtl' : 'ltr';
    }
  }, [locale]);

  /**
   * Sets the current locale
   */
  const setLocale = (newLocale: SupportedLocale) => {
    if (!isValidLocale(newLocale, config.supportedLocales)) {
      if (config.debug) {
        console.warn(`Unsupported locale: ${newLocale}. Using fallback: ${config.fallbackLocale}`);
      }
      newLocale = config.fallbackLocale;
    }
    
    setLocaleState(newLocale);
  };

  /**
   * Translation function
   */
  const t = (key: TranslationKey, values?: TranslationValues): string => {
    const translation = getTranslation(locale, key, config.fallbackLocale);
    return interpolate(translation, values);
  };

  /**
   * Check if current locale is RTL
   */
  const isRTL = isRTLLocale(locale);

  /**
   * Locale-specific date formatting
   */
  const formatDateLocale = (date: Date): string => formatDate(date, locale);
  const formatTimeLocale = (date: Date): string => formatTime(date, locale);
  const formatDateTimeLocale = (date: Date): string => formatDateTime(date, locale);
  const formatNumberLocale = (num: number): string => formatNumber(num, locale);

  const contextValue: I18nContextValue = {
    locale,
    setLocale,
    t,
    isRTL,
    formatDate: formatDateLocale,
    formatTime: formatTimeLocale,
    formatDateTime: formatDateTimeLocale,
    formatNumber: formatNumberLocale,
  };

  return (
    <I18nContext.Provider value={contextValue}>
      {children}
    </I18nContext.Provider>
  );
}

/**
 * Hook to use i18n context
 */
export function useI18n(): I18nContextValue {
  const context = useContext(I18nContext);
  
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  
  return context;
}

/**
 * Hook to get translation function only (lighter alternative)
 */
export function useTranslation() {
  const { t } = useI18n();
  return { t };
}

/**
 * HOC for components that need translations
 */
export function withTranslation<P extends object>(
  WrappedComponent: React.ComponentType<P & { t: (key: TranslationKey, values?: TranslationValues) => string }>
) {
  const WithTranslationComponent = (props: P) => {
    const { t } = useI18n();
    return <WrappedComponent {...props} t={t} />;
  };

  WithTranslationComponent.displayName = `withTranslation(${WrappedComponent.displayName || WrappedComponent.name})`;
  
  return WithTranslationComponent;
}
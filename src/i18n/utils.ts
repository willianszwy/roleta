import type { SupportedLocale, TranslationKey, TranslationValues, Translation } from './types';
import { translations } from './locales';

/**
 * Interpolates variables in translation strings
 * @param text - The translation text with variables
 * @param values - The values to interpolate
 * @returns The interpolated string
 */
export function interpolate(text: string, values?: TranslationValues): string {
  if (!values) return text;
  
  return Object.keys(values).reduce((result, key) => {
    const regex = new RegExp(`{{${key}}}`, 'g');
    return result.replace(regex, String(values[key]));
  }, text);
}

/**
 * Gets a translation for a specific key and locale
 * @param locale - The locale to get the translation for
 * @param key - The translation key
 * @param fallbackLocale - The fallback locale if key is not found
 * @returns The translation string or the key if not found
 */
export function getTranslation(
  locale: SupportedLocale,
  key: TranslationKey,
  fallbackLocale: SupportedLocale = 'pt-BR'
): string {
  const localeTranslations = translations[locale] as Translation | undefined;
  const fallbackTranslations = translations[fallbackLocale] as Translation | undefined;
  
  // Try to get translation from requested locale
  if (localeTranslations && key in localeTranslations) {
    return localeTranslations[key];
  }
  
  // Fallback to default locale
  if (fallbackTranslations && key in fallbackTranslations) {
    return fallbackTranslations[key];
  }
  
  // Return key if no translation found (for debugging)
  console.warn(`Translation missing for key: ${key} in locales: ${locale}, ${fallbackLocale}`);
  return key;
}

/**
 * Detects user's preferred locale from browser settings
 * @param supportedLocales - List of supported locales
 * @param defaultLocale - Default locale to use if none detected
 * @returns The detected locale
 */
export function detectUserLocale(
  supportedLocales: SupportedLocale[],
  defaultLocale: SupportedLocale = 'pt-BR'
): SupportedLocale {
  // Check if we're in a browser environment
  if (typeof navigator === 'undefined') {
    return defaultLocale;
  }
  
  // Get browser languages
  const browserLanguages = navigator.languages || [navigator.language];
  
  // Find the first supported locale
  for (const browserLang of browserLanguages) {
    // Direct match (e.g., 'pt-BR')
    if (supportedLocales.includes(browserLang as SupportedLocale)) {
      return browserLang as SupportedLocale;
    }
    
    // Language family match (e.g., 'pt' -> 'pt-BR')
    const languageCode = browserLang.split('-')[0];
    const matchingLocale = supportedLocales.find(locale => 
      locale.startsWith(languageCode)
    );
    
    if (matchingLocale) {
      return matchingLocale;
    }
  }
  
  return defaultLocale;
}

/**
 * Checks if a locale uses right-to-left (RTL) text direction
 * @param locale - The locale to check
 * @returns True if the locale is RTL
 */
export function isRTLLocale(locale: SupportedLocale): boolean {
  const rtlLocales: string[] = [
    'ar', 'he', 'fa', 'ur', 'yi'
  ];
  
  const languageCode = locale.split('-')[0];
  return rtlLocales.includes(languageCode);
}

/**
 * Formats a date according to the locale
 * @param date - The date to format
 * @param locale - The locale to use for formatting
 * @returns The formatted date string
 */
export function formatDate(date: Date, locale: SupportedLocale): string {
  try {
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  } catch {
    // Fallback to ISO string if Intl is not available
    return date.toLocaleDateString();
  }
}

/**
 * Formats a time according to the locale
 * @param date - The date to format
 * @param locale - The locale to use for formatting
 * @returns The formatted time string
 */
export function formatTime(date: Date, locale: SupportedLocale): string {
  try {
    return new Intl.DateTimeFormat(locale, {
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  } catch {
    // Fallback to ISO string if Intl is not available
    return date.toLocaleTimeString();
  }
}

/**
 * Formats a date and time according to the locale
 * @param date - The date to format
 * @param locale - The locale to use for formatting
 * @returns The formatted date and time string
 */
export function formatDateTime(date: Date, locale: SupportedLocale): string {
  try {
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  } catch {
    // Fallback to ISO string if Intl is not available
    return date.toLocaleString();
  }
}

/**
 * Formats a number according to the locale
 * @param num - The number to format
 * @param locale - The locale to use for formatting
 * @returns The formatted number string
 */
export function formatNumber(num: number, locale: SupportedLocale): string {
  try {
    return new Intl.NumberFormat(locale).format(num);
  } catch {
    // Fallback to string conversion if Intl is not available
    return num.toString();
  }
}

/**
 * Gets the display name for a locale
 * @param locale - The locale to get the display name for
 * @param displayLocale - The locale to display the name in
 * @returns The display name of the locale
 */
export function getLocaleDisplayName(
  locale: SupportedLocale, 
  displayLocale: SupportedLocale = locale
): string {
  const displayNames: Record<SupportedLocale, Record<SupportedLocale, string>> = {
    'pt-BR': {
      'pt-BR': 'Português (Brasil)',
      'en-US': 'Portuguese (Brazil)',
      'es-ES': 'Portugués (Brasil)',
      'fr-FR': 'Portugais (Brésil)',
    },
    'en-US': {
      'pt-BR': 'Inglês (Estados Unidos)',
      'en-US': 'English (United States)',
      'es-ES': 'Inglés (Estados Unidos)',
      'fr-FR': 'Anglais (États-Unis)',
    },
    'es-ES': {
      'pt-BR': 'Espanhol (Espanha)',
      'en-US': 'Spanish (Spain)',
      'es-ES': 'Español (España)',
      'fr-FR': 'Espagnol (Espagne)',
    },
    'fr-FR': {
      'pt-BR': 'Francês (França)',
      'en-US': 'French (France)',
      'es-ES': 'Francés (Francia)',
      'fr-FR': 'Français (France)',
    },
  };
  
  return displayNames[locale]?.[displayLocale] || locale;
}

/**
 * Validates if a locale is supported
 * @param locale - The locale to validate
 * @param supportedLocales - List of supported locales
 * @returns True if the locale is supported
 */
export function isValidLocale(
  locale: string, 
  supportedLocales: SupportedLocale[]
): locale is SupportedLocale {
  return supportedLocales.includes(locale as SupportedLocale);
}
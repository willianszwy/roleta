// Main exports for i18n system
export { I18nProvider, useI18n, useTranslation, withTranslation } from './I18nContext';

// Types
export type {
  SupportedLocale,
  TranslationKey,
  TranslationValues,
  Translation,
  Translations,
  I18nConfig,
  I18nContextValue,
} from './types';

// Utilities
export {
  interpolate,
  getTranslation,
  detectUserLocale,
  isRTLLocale,
  formatDate,
  formatTime,
  formatDateTime,
  formatNumber,
  getLocaleDisplayName,
  isValidLocale,
} from './utils';

// Translations
export { translations, ptBR, enUS, esES, frFR } from './locales';
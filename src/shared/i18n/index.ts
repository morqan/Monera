import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as RNLocalize from 'react-native-localize';

import { en } from './locales/en';
import { ru } from './locales/ru';

export const SUPPORTED_LOCALES = ['ru', 'en'] as const;
export type AppLocale = (typeof SUPPORTED_LOCALES)[number];
export const DEFAULT_LOCALE: AppLocale = 'ru';

function detectDeviceLocale(): AppLocale {
  try {
    const best = RNLocalize.findBestLanguageTag([...SUPPORTED_LOCALES]);
    if (best?.languageTag) {
      const code = best.languageTag.slice(0, 2) as AppLocale;
      if (SUPPORTED_LOCALES.includes(code)) {
        return code;
      }
    }
  } catch {
    // native module not linked yet — fall back silently
  }
  return DEFAULT_LOCALE;
}

export const deviceLocale = detectDeviceLocale();

i18n.use(initReactI18next).init({
  compatibilityJSON: 'v4',
  lng: deviceLocale,
  fallbackLng: DEFAULT_LOCALE,
  resources: {
    ru: { translation: ru },
    en: { translation: en },
  },
  interpolation: { escapeValue: false },
  react: { useSuspense: false },
  returnNull: false,
});

export { i18n };

export function setAppLocale(locale: AppLocale) {
  if (i18n.language !== locale) {
    i18n.changeLanguage(locale);
  }
}

export { useTranslation } from 'react-i18next';

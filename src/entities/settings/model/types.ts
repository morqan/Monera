import type { AppLocale } from '@/shared/i18n';

export type ThemePreference = 'system' | 'light' | 'dark';

export type Settings = {
  currencyCode: string;
  locale: AppLocale;
  theme: ThemePreference;
  notificationsEnabled: boolean;
};

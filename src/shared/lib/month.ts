import { format, parse, addMonths, startOfMonth, type Locale } from 'date-fns';
import { ru, enUS } from 'date-fns/locale';

export type MonthKey = string; // YYYY-MM

const LOCALES: Record<string, Locale> = {
  ru,
  en: enUS,
};

function resolveLocale(locale?: string): Locale {
  if (!locale) {
    return ru;
  }
  const key = locale.slice(0, 2);
  return LOCALES[key] ?? ru;
}

export function toMonthKey(date: Date): MonthKey {
  return format(date, 'yyyy-MM');
}

export function currentMonthKey(): MonthKey {
  return toMonthKey(new Date());
}

export function monthKeyFromDateString(value: string): MonthKey {
  // value is YYYY-MM-DD
  return value.slice(0, 7);
}

export function parseMonthKey(key: MonthKey): Date {
  return parse(key, 'yyyy-MM', new Date());
}

export function shiftMonth(key: MonthKey, delta: number): MonthKey {
  return toMonthKey(addMonths(parseMonthKey(key), delta));
}

export function formatMonthTitle(key: MonthKey, locale?: string): string {
  const date = startOfMonth(parseMonthKey(key));
  return format(date, 'LLLL yyyy', { locale: resolveLocale(locale) });
}

const LOCALE_MAP: Record<string, string> = {
  ru: 'ru-RU',
  en: 'en-US',
};

function resolveIntlLocale(locale?: string): string {
  if (!locale) {
    return LOCALE_MAP.ru;
  }
  const short = locale.slice(0, 2);
  return LOCALE_MAP[short] ?? locale;
}

export function formatMoney(
  amount: number,
  currencyCode: string,
  locale?: string
): string {
  const intlLocale = resolveIntlLocale(locale);
  try {
    return new Intl.NumberFormat(intlLocale, {
      style: 'currency',
      currency: currencyCode,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${amount.toFixed(2)} ${currencyCode}`;
  }
}

export const SUPPORTED_CURRENCIES = [
  'RUB',
  'USD',
  'EUR',
  'GBP',
  'KZT',
  'UAH',
  'BYN',
  'CNY',
  'JPY',
  'TRY',
] as const;

export type CurrencyCode = (typeof SUPPORTED_CURRENCIES)[number];

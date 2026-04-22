export function startOfLocalDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function addDays(date: Date, delta: number): Date {
  const d = new Date(date.getTime());
  d.setDate(d.getDate() + delta);
  return startOfLocalDay(d);
}

export function toISODateOnly(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/** Локальный календарный день из строки `YYYY-MM-DD`. */
export function parseISODateOnly(iso: string): Date {
  const [y, m, d] = iso.split('-').map((x) => Number.parseInt(x, 10));
  if (!Number.isFinite(y) || !Number.isFinite(m) || !Number.isFinite(d)) {
    return startOfLocalDay(new Date());
  }
  return startOfLocalDay(new Date(y, m - 1, d));
}

export function formatRuDate(date: Date): string {
  return formatLocalizedDate(date, 'ru');
}

export function formatLocalizedDate(date: Date, locale: string): string {
  const intlLocale = locale === 'ru' ? 'ru-RU' : 'en-US';
  return date.toLocaleDateString(intlLocale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

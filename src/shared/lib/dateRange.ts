import {
  addDays,
  addMonths,
  addWeeks,
  endOfMonth,
  endOfWeek,
  format,
  parse,
  startOfMonth,
  startOfWeek,
  type Locale,
} from 'date-fns';
import { enUS, ru } from 'date-fns/locale';

export type RangePreset = 'day' | 'week' | 'month' | 'custom';

export type DateRange = {
  start: string;
  end: string;
  preset: RangePreset;
};

const ISO = 'yyyy-MM-dd';
const LOCALES: Record<string, Locale> = { ru, en: enUS };

function resolveLocale(locale?: string): Locale {
  if (!locale) {
    return ru;
  }
  return LOCALES[locale.slice(0, 2)] ?? ru;
}

export function toISODate(date: Date): string {
  return format(date, ISO);
}

export function parseISODate(value: string): Date {
  return parse(value, ISO, new Date());
}

export function todayISODate(): string {
  return toISODate(new Date());
}

const WEEK_OPTS = { weekStartsOn: 1 as const };

export function rangeFromPreset(
  preset: RangePreset,
  anchor: Date = new Date()
): DateRange {
  if (preset === 'day') {
    const iso = toISODate(anchor);
    return { start: iso, end: iso, preset };
  }
  if (preset === 'week') {
    return {
      start: toISODate(startOfWeek(anchor, WEEK_OPTS)),
      end: toISODate(endOfWeek(anchor, WEEK_OPTS)),
      preset,
    };
  }
  if (preset === 'month') {
    return {
      start: toISODate(startOfMonth(anchor)),
      end: toISODate(endOfMonth(anchor)),
      preset,
    };
  }
  const iso = toISODate(anchor);
  return { start: iso, end: iso, preset: 'custom' };
}

export function currentRange(preset: RangePreset): DateRange {
  return rangeFromPreset(preset === 'custom' ? 'day' : preset);
}

export function shiftRange(range: DateRange, delta: number): DateRange {
  const anchor = parseISODate(range.start);
  if (range.preset === 'day') {
    return rangeFromPreset('day', addDays(anchor, delta));
  }
  if (range.preset === 'week') {
    return rangeFromPreset('week', addWeeks(anchor, delta));
  }
  if (range.preset === 'month') {
    return rangeFromPreset('month', addMonths(anchor, delta));
  }
  const startDate = parseISODate(range.start);
  const endDate = parseISODate(range.end);
  const span = Math.max(
    0,
    Math.round((endDate.getTime() - startDate.getTime()) / 86_400_000)
  );
  const offset = (span + 1) * delta;
  return {
    start: toISODate(addDays(startDate, offset)),
    end: toISODate(addDays(endDate, offset)),
    preset: 'custom',
  };
}

export function rangeContainsISO(range: DateRange, iso: string): boolean {
  return iso >= range.start && iso <= range.end;
}

export function customRange(startISO: string, endISO: string): DateRange {
  const [start, end] =
    startISO <= endISO ? [startISO, endISO] : [endISO, startISO];
  return { start, end, preset: 'custom' };
}

export function rangesEqual(a: DateRange, b: DateRange): boolean {
  return a.start === b.start && a.end === b.end && a.preset === b.preset;
}

export function isCurrentRange(range: DateRange): boolean {
  if (range.preset === 'custom') {
    return false;
  }
  return rangesEqual(range, rangeFromPreset(range.preset));
}

export function formatRangeTitle(range: DateRange, locale?: string): string {
  const loc = resolveLocale(locale);
  const start = parseISODate(range.start);
  const end = parseISODate(range.end);

  if (range.preset === 'day') {
    return format(start, 'd MMMM yyyy', { locale: loc });
  }
  if (range.preset === 'month') {
    return format(start, 'LLLL yyyy', { locale: loc });
  }
  if (range.preset === 'week') {
    const sameMonth = start.getMonth() === end.getMonth();
    const sameYear = start.getFullYear() === end.getFullYear();
    if (sameMonth) {
      return `${format(start, 'd', { locale: loc })}–${format(
        end,
        'd MMMM yyyy',
        { locale: loc }
      )}`;
    }
    if (sameYear) {
      return `${format(start, 'd MMM', { locale: loc })} – ${format(
        end,
        'd MMM yyyy',
        { locale: loc }
      )}`;
    }
    return `${format(start, 'd MMM yyyy', { locale: loc })} – ${format(
      end,
      'd MMM yyyy',
      { locale: loc }
    )}`;
  }
  if (range.start === range.end) {
    return format(start, 'd MMMM yyyy', { locale: loc });
  }
  const sameYear = start.getFullYear() === end.getFullYear();
  if (sameYear) {
    return `${format(start, 'd MMM', { locale: loc })} – ${format(
      end,
      'd MMM yyyy',
      { locale: loc }
    )}`;
  }
  return `${format(start, 'd MMM yyyy', { locale: loc })} – ${format(
    end,
    'd MMM yyyy',
    { locale: loc }
  )}`;
}

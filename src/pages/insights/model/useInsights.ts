import { differenceInCalendarDays, format } from 'date-fns';
import { enUS, ru } from 'date-fns/locale';
import { useMemo, useState } from 'react';

import { useAppSelector } from '@/app/store';
import { useCategoryName, type Category } from '@/entities/category';
import type { TransactionKind } from '@/entities/transaction';
import {
  currentRange,
  parseISODate,
  rangeContainsISO,
  rangeFromPreset,
  shiftRange,
  type DateRange,
  type RangePreset,
} from '@/shared/lib';

export type PieSlice = {
  categoryId: string;
  category: Category;
  name: string;
  color: string;
  value: number;
  percent: number;
};

export type TrendBucket = {
  key: string;
  label: string;
  income: number;
  expense: number;
};

export type InsightsTotals = {
  income: number;
  expense: number;
  balance: number;
};

const DEFAULT_PALETTE = ['#7C5CFF', '#00D4FF', '#3DFFB4', '#FFB86B', '#FF6BA3'];

export function useInsights() {
  const categories = useAppSelector((s) => s.categories.items);
  const transactions = useAppSelector((s) => s.transactions.items);
  const currency = useAppSelector((s) => s.settings.currencyCode);
  const locale = useAppSelector((s) => s.settings.locale);
  const getName = useCategoryName();

  const [kind, setKind] = useState<TransactionKind>('expense');
  const [range, setRange] = useState<DateRange>(() => currentRange('month'));

  const rangeItems = useMemo(
    () => transactions.filter((t) => rangeContainsISO(range, t.date)),
    [transactions, range]
  );

  const totals = useMemo<InsightsTotals>(() => {
    let income = 0;
    let expense = 0;
    for (const t of rangeItems) {
      if (t.kind === 'income') {
        income += t.amount;
      } else {
        expense += t.amount;
      }
    }
    return { income, expense, balance: income - expense };
  }, [rangeItems]);

  const categoryMap = useMemo(() => {
    const m = new Map<string, Category>();
    for (const c of categories) {
      m.set(c.id, c);
    }
    return m;
  }, [categories]);

  const pie = useMemo<PieSlice[]>(() => {
    const totalsByCat = new Map<string, number>();
    for (const t of rangeItems) {
      if (t.kind !== kind) continue;
      totalsByCat.set(
        t.categoryId,
        (totalsByCat.get(t.categoryId) ?? 0) + t.amount
      );
    }
    const total = Array.from(totalsByCat.values()).reduce((s, v) => s + v, 0);
    if (total <= 0) return [];

    const entries = Array.from(totalsByCat.entries())
      .map(([id, value]) => {
        const cat = categoryMap.get(id);
        return { id, cat, value };
      })
      .filter((e) => e.cat)
      .sort((a, b) => b.value - a.value);

    return entries.map((e, idx) => ({
      categoryId: e.id,
      category: e.cat as Category,
      name: getName(e.cat as Category),
      color:
        (e.cat as Category).color ??
        DEFAULT_PALETTE[idx % DEFAULT_PALETTE.length],
      value: e.value,
      percent: (e.value / total) * 100,
    }));
  }, [rangeItems, kind, categoryMap, getName]);

  const trend = useMemo<TrendBucket[]>(() => {
    const start = parseISODate(range.start);
    const end = parseISODate(range.end);
    const span = Math.max(0, differenceInCalendarDays(end, start));
    const mode: 'day' | 'week' | 'month' =
      span <= 13 ? 'day' : span <= 62 ? 'week' : 'month';

    const loc = locale.startsWith('ru') ? ru : enUS;
    const buckets = new Map<string, TrendBucket>();

    const keyFor = (iso: string) => {
      const d = parseISODate(iso);
      if (mode === 'day') return format(d, 'yyyy-MM-dd');
      if (mode === 'week') {
        const monday = new Date(d);
        const wd = (monday.getDay() + 6) % 7;
        monday.setDate(monday.getDate() - wd);
        return format(monday, 'yyyy-MM-dd');
      }
      return format(d, 'yyyy-MM');
    };

    const labelFor = (key: string) => {
      if (mode === 'day') {
        return format(parseISODate(key), 'd MMM', { locale: loc });
      }
      if (mode === 'week') {
        return format(parseISODate(key), 'd MMM', { locale: loc });
      }
      return format(parseISODate(`${key}-01`), 'LLL', { locale: loc });
    };

    for (const t of rangeItems) {
      const key = keyFor(t.date);
      const cur = buckets.get(key) ?? {
        key,
        label: labelFor(key),
        income: 0,
        expense: 0,
      };
      if (t.kind === 'income') cur.income += t.amount;
      else cur.expense += t.amount;
      buckets.set(key, cur);
    }

    return Array.from(buckets.values()).sort((a, b) =>
      a.key < b.key ? -1 : 1
    );
  }, [rangeItems, range, locale]);

  return {
    currency,
    kind,
    locale,
    pie,
    range,
    rangeHasData: rangeItems.length > 0,
    next: () => setRange((r) => shiftRange(r, 1)),
    prev: () => setRange((r) => shiftRange(r, -1)),
    reset: () => setRange((r) => currentRange(r.preset)),
    setKind,
    setPreset: (preset: RangePreset) => setRange(() => rangeFromPreset(preset)),
    setRange,
    totals,
    trend,
  };
}

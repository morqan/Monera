import { useMemo, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import type { RootStackParamList } from '@/app/navigation/types';
import { useAppSelector } from '@/app/store';
import { useCategoryName } from '@/entities/category';
import type { Transaction } from '@/entities/transaction';
import {
  currentRange,
  rangeContainsISO,
  rangeFromPreset,
  shiftRange,
  type DateRange,
  type RangePreset,
} from '@/shared/lib';

export type TransactionsFilter = 'all' | 'income' | 'expense';

export type TransactionRow = {
  transaction: Transaction;
  categoryName: string;
};

export type TransactionSection = {
  title: string;
  date: string;
  data: TransactionRow[];
};

export type RangeTotals = {
  income: number;
  expense: number;
  balance: number;
};

export type MonthTotals = RangeTotals;

function parseDateOnly(value: string): Date {
  const [year, month, day] = value
    .split('-')
    .map((part) => Number.parseInt(part, 10));
  if (
    Number.isFinite(year) &&
    Number.isFinite(month) &&
    Number.isFinite(day) &&
    value.length === 10
  ) {
    return new Date(year, month - 1, day);
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return new Date();
  }

  return parsed;
}

function formatSectionTitle(date: string, locale: string): string {
  return parseDateOnly(date).toLocaleDateString(
    locale === 'ru' ? 'ru-RU' : 'en-US',
    {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }
  );
}

export function useTransactionsList() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const items = useAppSelector((s) => s.transactions.items);
  const categories = useAppSelector((s) => s.categories.items);
  const currency = useAppSelector((s) => s.settings.currencyCode);
  const locale = useAppSelector((s) => s.settings.locale);
  const getName = useCategoryName();
  const [filter, setFilter] = useState<TransactionsFilter>('all');
  const [range, setRange] = useState<DateRange>(() => currentRange('month'));

  const rangeItems = useMemo(
    () => items.filter((t) => rangeContainsISO(range, t.date)),
    [items, range]
  );

  const rangeTotals = useMemo<RangeTotals>(() => {
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

  const rows = useMemo(() => {
    const map = new Map(categories.map((c) => [c.id, c]));
    return [...rangeItems]
      .sort((a, b) => {
        const d = new Date(b.date).getTime() - new Date(a.date).getTime();
        if (d !== 0) {
          return d;
        }
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      })
      .map((t) => {
        const cat = map.get(t.categoryId);
        return {
          transaction: t,
          categoryName: cat ? getName(cat) : '—',
        };
      });
  }, [rangeItems, categories, getName]);

  const filteredRows = useMemo(() => {
    if (filter === 'all') {
      return rows;
    }

    return rows.filter((row) => row.transaction.kind === filter);
  }, [filter, rows]);

  const sections = useMemo<TransactionSection[]>(() => {
    const grouped = new Map<string, TransactionRow[]>();

    filteredRows.forEach((row) => {
      const bucket = grouped.get(row.transaction.date);
      if (bucket) {
        bucket.push(row);
        return;
      }

      grouped.set(row.transaction.date, [row]);
    });

    return Array.from(grouped.entries()).map(([date, data]) => ({
      date,
      title: formatSectionTitle(date, locale),
      data,
    }));
  }, [filteredRows, locale]);

  const openCreate = () => {
    navigation.navigate('CreateTransaction', {});
  };

  const openEdit = (transactionId: string) => {
    navigation.navigate('CreateTransaction', { transactionId });
  };

  const prev = () => setRange((r) => shiftRange(r, -1));
  const next = () => setRange((r) => shiftRange(r, 1));
  const reset = () => setRange((r) => currentRange(r.preset));
  const setPreset = (preset: RangePreset) =>
    setRange(() => rangeFromPreset(preset));

  return {
    currency,
    filter,
    hasAnyTransactions: items.length > 0,
    hasRangeTransactions: rangeItems.length > 0,
    isFilteredEmpty: rangeItems.length > 0 && filteredRows.length === 0,
    locale,
    range,
    rangeTotals,
    next,
    openCreate,
    openEdit,
    prev,
    reset,
    sections,
    setFilter,
    setPreset,
    setRange,
  };
}

import { useMemo, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import type { RootStackParamList } from '@/app/navigation/types';
import { useAppSelector } from '@/app/store';
import { useCategoryName } from '@/entities/category';
import type { Transaction } from '@/entities/transaction';
import {
  currentMonthKey,
  monthKeyFromDateString,
  shiftMonth,
  type MonthKey,
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

export type MonthTotals = {
  income: number;
  expense: number;
  balance: number;
};

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
  const [monthKey, setMonthKey] = useState<MonthKey>(() => currentMonthKey());

  const monthItems = useMemo(
    () => items.filter((t) => monthKeyFromDateString(t.date) === monthKey),
    [items, monthKey]
  );

  const monthTotals = useMemo<MonthTotals>(() => {
    let income = 0;
    let expense = 0;
    for (const t of monthItems) {
      if (t.kind === 'income') {
        income += t.amount;
      } else {
        expense += t.amount;
      }
    }
    return { income, expense, balance: income - expense };
  }, [monthItems]);

  const rows = useMemo(() => {
    const map = new Map(categories.map((c) => [c.id, c]));
    return [...monthItems]
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
  }, [monthItems, categories, getName]);

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

  const prevMonth = () => setMonthKey((key) => shiftMonth(key, -1));
  const nextMonth = () => setMonthKey((key) => shiftMonth(key, 1));
  const resetMonth = () => setMonthKey(currentMonthKey());

  return {
    currency,
    filter,
    hasAnyTransactions: items.length > 0,
    hasMonthTransactions: monthItems.length > 0,
    isFilteredEmpty: monthItems.length > 0 && filteredRows.length === 0,
    locale,
    monthKey,
    monthTotals,
    nextMonth,
    openCreate,
    openEdit,
    prevMonth,
    resetMonth,
    sections,
    setFilter,
  };
}

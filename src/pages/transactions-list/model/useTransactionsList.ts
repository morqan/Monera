import { useMemo, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import type { RootStackParamList } from '@/app/navigation/types';
import { useAppSelector } from '@/app/store';
import type { Transaction } from '@/entities/transaction';

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

function formatSectionTitle(date: string): string {
  return parseDateOnly(date).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function useTransactionsList() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const items = useAppSelector((s) => s.transactions.items);
  const categories = useAppSelector((s) => s.categories.items);
  const currency = useAppSelector((s) => s.settings.currencyCode);
  const [filter, setFilter] = useState<TransactionsFilter>('all');

  const rows = useMemo(() => {
    const map = new Map(categories.map((c) => [c.id, c.name]));
    return [...items]
      .sort((a, b) => {
        const d = new Date(b.date).getTime() - new Date(a.date).getTime();
        if (d !== 0) {
          return d;
        }
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      })
      .map((t) => ({
        transaction: t,
        categoryName: map.get(t.categoryId) ?? '—',
      }));
  }, [items, categories]);

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
      title: formatSectionTitle(date),
      data,
    }));
  }, [filteredRows]);

  const openCreate = () => {
    navigation.navigate('CreateTransaction', {});
  };

  const openEdit = (transactionId: string) => {
    navigation.navigate('CreateTransaction', { transactionId });
  };

  return {
    currency,
    filter,
    hasTransactions: rows.length > 0,
    isFilteredEmpty: rows.length > 0 && filteredRows.length === 0,
    openCreate,
    openEdit,
    sections,
    setFilter,
  };
}

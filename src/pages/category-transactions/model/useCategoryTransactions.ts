import { useLayoutEffect, useMemo, useState } from 'react';
import {
  useNavigation,
  useRoute,
  type RouteProp,
} from '@react-navigation/native';
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

export type CategoryRow = {
  transaction: Transaction;
  categoryName: string;
};

export type CategorySection = {
  title: string;
  date: string;
  data: CategoryRow[];
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

export function useCategoryTransactions() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route =
    useRoute<RouteProp<RootStackParamList, 'CategoryTransactions'>>();
  const { categoryId } = route.params;

  const categories = useAppSelector((s) => s.categories.items);
  const items = useAppSelector((s) => s.transactions.items);
  const currency = useAppSelector((s) => s.settings.currencyCode);
  const locale = useAppSelector((s) => s.settings.locale);
  const getName = useCategoryName();

  const category = useMemo(
    () => categories.find((c) => c.id === categoryId) ?? null,
    [categories, categoryId]
  );

  const [monthKey, setMonthKey] = useState<MonthKey>(() => currentMonthKey());

  useLayoutEffect(() => {
    navigation.setOptions({
      title: category ? getName(category) : '',
    });
  }, [navigation, category, getName]);

  const monthItems = useMemo(
    () =>
      items.filter(
        (t) =>
          t.categoryId === categoryId &&
          monthKeyFromDateString(t.date) === monthKey
      ),
    [items, categoryId, monthKey]
  );

  const monthTotals = useMemo(() => {
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

  const sections = useMemo<CategorySection[]>(() => {
    const rows: CategoryRow[] = [...monthItems]
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
        categoryName: category ? getName(category) : '—',
      }));

    const grouped = new Map<string, CategoryRow[]>();
    rows.forEach((row) => {
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
  }, [monthItems, category, getName, locale]);

  return {
    category,
    currency,
    locale,
    monthKey,
    monthTotals,
    sections,
    hasMonthItems: monthItems.length > 0,
    prevMonth: () => setMonthKey((k) => shiftMonth(k, -1)),
    nextMonth: () => setMonthKey((k) => shiftMonth(k, 1)),
    resetMonth: () => setMonthKey(currentMonthKey()),
    openCreate: () =>
      navigation.navigate('CreateTransaction', {
        categoryId,
        kind: category?.kind,
      }),
    openEdit: (transactionId: string) =>
      navigation.navigate('CreateTransaction', { transactionId }),
    openEditCategory: () => navigation.navigate('EditCategory', { categoryId }),
  };
}

import { useMemo, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import type { RootStackParamList } from '@/app/navigation/types';
import { useAppSelector } from '@/app/store';
import type { TransactionKind } from '@/entities/transaction';
import {
  currentMonthKey,
  monthKeyFromDateString,
  shiftMonth,
  type MonthKey,
} from '@/shared/lib';

export type CategorySummary = {
  categoryId: string;
  total: number;
  count: number;
};

export function useHome() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const categories = useAppSelector((s) => s.categories.items);
  const transactions = useAppSelector((s) => s.transactions.items);
  const currency = useAppSelector((s) => s.settings.currencyCode);
  const locale = useAppSelector((s) => s.settings.locale);

  const [kind, setKind] = useState<TransactionKind>('expense');
  const [monthKey, setMonthKey] = useState<MonthKey>(() => currentMonthKey());

  const monthItems = useMemo(
    () =>
      transactions.filter((t) => monthKeyFromDateString(t.date) === monthKey),
    [transactions, monthKey]
  );

  const totals = useMemo(() => {
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

  const summaries = useMemo(() => {
    const byCat = new Map<string, CategorySummary>();
    for (const t of monthItems) {
      if (t.kind !== kind) {
        continue;
      }
      const cur = byCat.get(t.categoryId);
      if (cur) {
        cur.total += t.amount;
        cur.count += 1;
      } else {
        byCat.set(t.categoryId, {
          categoryId: t.categoryId,
          total: t.amount,
          count: 1,
        });
      }
    }
    return byCat;
  }, [monthItems, kind]);

  const visibleCategories = useMemo(
    () => categories.filter((c) => c.kind === kind),
    [categories, kind]
  );

  const tiles = useMemo(
    () =>
      visibleCategories.map((c) => ({
        category: c,
        summary: summaries.get(c.id) ?? null,
      })),
    [visibleCategories, summaries]
  );

  return {
    currency,
    kind,
    locale,
    monthKey,
    monthTotals: totals,
    nextMonth: () => setMonthKey((k) => shiftMonth(k, 1)),
    openAllTransactions: () => navigation.navigate('TransactionsList'),
    openCategory: (categoryId: string) =>
      navigation.navigate('CategoryTransactions', { categoryId }),
    openCreate: () => navigation.navigate('CreateTransaction', { kind }),
    openEditCategory: (categoryId?: string) =>
      navigation.navigate(
        'EditCategory',
        categoryId ? { categoryId } : { defaultKind: kind }
      ),
    openManage: () => navigation.navigate('ManageCategories'),
    prevMonth: () => setMonthKey((k) => shiftMonth(k, -1)),
    resetMonth: () => setMonthKey(currentMonthKey()),
    setKind,
    tiles,
  };
}

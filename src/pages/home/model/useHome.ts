import { useMemo, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import type { RootStackParamList } from '@/app/navigation/types';
import { useAppSelector } from '@/app/store';
import type { TransactionKind } from '@/entities/transaction';
import {
  currentRange,
  rangeContainsISO,
  rangeFromPreset,
  shiftRange,
  type DateRange,
  type RangePreset,
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
  const [range, setRange] = useState<DateRange>(() => currentRange('month'));

  const rangeItems = useMemo(
    () => transactions.filter((t) => rangeContainsISO(range, t.date)),
    [transactions, range]
  );

  const totals = useMemo(() => {
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

  const summaries = useMemo(() => {
    const byCat = new Map<string, CategorySummary>();
    for (const t of rangeItems) {
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
  }, [rangeItems, kind]);

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
    range,
    rangeTotals: totals,
    next: () => setRange((r) => shiftRange(r, 1)),
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
    prev: () => setRange((r) => shiftRange(r, -1)),
    reset: () => setRange((r) => currentRange(r.preset)),
    setKind,
    setPreset: (preset: RangePreset) => setRange(() => rangeFromPreset(preset)),
    setRange,
    tiles,
  };
}

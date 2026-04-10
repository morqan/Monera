import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Alert } from 'react-native';
import {
  useNavigation,
  useRoute,
  type RouteProp,
} from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import type { RootStackParamList } from '@/app/navigation/types';
import { useAppDispatch, useAppSelector } from '@/app/store';
import {
  addTransaction,
  deleteTransaction,
  updateTransaction,
  type TransactionKind,
} from '@/entities/transaction';
import { createId } from '@/shared/lib';

import {
  addDays,
  parseISODateOnly,
  startOfLocalDay,
  toISODateOnly,
} from '../lib/dateOnly';
import { parseAmount } from '../lib/parseAmount';

export function useCreateTransaction() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'CreateTransaction'>>();
  const dispatch = useAppDispatch();
  const categories = useAppSelector((s) => s.categories.items);
  const items = useAppSelector((s) => s.transactions.items);

  const params = route.params;
  const transactionFromRoute = params?.transaction;
  const transactionIdFromRoute = params?.transactionId;

  const resolved = useMemo(() => {
    if (transactionFromRoute) {
      return transactionFromRoute;
    }
    if (transactionIdFromRoute) {
      return items.find((t) => t.id === transactionIdFromRoute) ?? null;
    }
    return null;
  }, [transactionFromRoute, transactionIdFromRoute, items]);

  const seedKey = resolved?.id ?? 'create';
  const isEdit = seedKey !== 'create';

  useLayoutEffect(() => {
    navigation.setOptions({
      title: isEdit ? 'Редактирование' : 'Новая операция',
    });
  }, [navigation, isEdit]);

  useEffect(() => {
    if (transactionIdFromRoute && !transactionFromRoute && resolved === null) {
      navigation.goBack();
    }
  }, [transactionIdFromRoute, transactionFromRoute, resolved, navigation]);

  const [kind, setKind] = useState<TransactionKind>('expense');
  const [amountText, setAmountText] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [date, setDate] = useState(() => startOfLocalDay(new Date()));
  const [note, setNote] = useState('');

  const resolvedRef = useRef(resolved);
  resolvedRef.current = resolved;

  const appliedSeedKey = useRef<string | null>(null);
  useEffect(() => {
    if (appliedSeedKey.current === seedKey) {
      return;
    }
    appliedSeedKey.current = seedKey;

    if (seedKey === 'create') {
      setKind('expense');
      setAmountText('');
      setCategoryId('');
      setDate(startOfLocalDay(new Date()));
      setNote('');
      return;
    }

    const t = resolvedRef.current;
    if (!t || t.id !== seedKey) {
      return;
    }
    setKind(t.kind);
    setAmountText(String(t.amount));
    setCategoryId(t.categoryId);
    setDate(parseISODateOnly(t.date));
    setNote(t.note);
  }, [seedKey]);

  const filtered = useMemo(
    () => categories.filter((c) => c.kind === kind),
    [categories, kind]
  );

  useEffect(() => {
    const first = filtered[0];
    if (!first) {
      setCategoryId('');
      return;
    }
    const stillValid = filtered.some((c) => c.id === categoryId);
    if (!stillValid) {
      setCategoryId(first.id);
    }
  }, [filtered, categoryId]);

  const amount = parseAmount(amountText);
  const canSave = amount != null && amount > 0 && categoryId.length > 0;

  const save = () => {
    if (!canSave || amount == null) {
      return;
    }
    if (isEdit && resolved) {
      const base = items.find((t) => t.id === resolved.id) ?? resolved;
      dispatch(
        updateTransaction({
          ...base,
          kind,
          amount,
          categoryId,
          date: toISODateOnly(date),
          note: note.trim(),
        })
      );
    } else {
      dispatch(
        addTransaction({
          id: createId(),
          kind,
          amount,
          categoryId,
          date: toISODateOnly(date),
          note: note.trim(),
          createdAt: new Date().toISOString(),
        })
      );
    }
    navigation.goBack();
  };

  const confirmAndRemove = useCallback(() => {
    if (!resolved) {
      return;
    }
    const id = resolved.id;
    Alert.alert(
      'Удалить операцию?',
      'Запись будет удалена без возможности восстановления.',
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Удалить',
          style: 'destructive',
          onPress: () => {
            dispatch(deleteTransaction(id));
            navigation.goBack();
          },
        },
      ]
    );
  }, [resolved, dispatch, navigation]);

  return {
    kind,
    setKind,
    amountText,
    setAmountText,
    categoryId,
    setCategoryId,
    date,
    setDateToday: () => setDate(startOfLocalDay(new Date())),
    shiftDate: (d: number) => setDate((prev) => addDays(prev, d)),
    note,
    setNote,
    filteredCategories: filtered,
    canSave,
    save,
    isEdit,
    onDelete: isEdit ? confirmAndRemove : undefined,
  };
}

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
import { useTranslation } from '@/shared/i18n';
import {
  captureReceiptFromCamera,
  createId,
  pickReceiptFromLibrary,
  removeReceiptFile,
} from '@/shared/lib';

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
  const { t } = useTranslation();
  const categories = useAppSelector((s) => s.categories.items);
  const items = useAppSelector((s) => s.transactions.items);
  const currency = useAppSelector((s) => s.settings.currencyCode);
  const locale = useAppSelector((s) => s.settings.locale);

  const params = route.params;
  const transactionFromRoute = params?.transaction;
  const transactionIdFromRoute = params?.transactionId;
  const duplicateFromId = params?.duplicateFromId;

  const resolved = useMemo(() => {
    if (transactionFromRoute) {
      return transactionFromRoute;
    }
    if (transactionIdFromRoute) {
      return items.find((tx) => tx.id === transactionIdFromRoute) ?? null;
    }
    if (duplicateFromId) {
      return items.find((tx) => tx.id === duplicateFromId) ?? null;
    }
    return null;
  }, [transactionFromRoute, transactionIdFromRoute, duplicateFromId, items]);

  const isDuplicate =
    duplicateFromId != null && !transactionIdFromRoute && !transactionFromRoute;
  const seedKey = isDuplicate
    ? `dup:${duplicateFromId}`
    : resolved?.id ?? 'create';
  const isEdit = !isDuplicate && seedKey !== 'create';

  useLayoutEffect(() => {
    navigation.setOptions({
      title: isEdit ? t('create.titleEdit') : t('create.titleNew'),
    });
  }, [navigation, isEdit, t]);

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
  const [attachmentUri, setAttachmentUri] = useState<string | undefined>(
    undefined
  );

  const newIdRef = useRef<string>(createId());
  const originalAttachmentRef = useRef<string | undefined>(undefined);

  const resolvedRef = useRef(resolved);
  resolvedRef.current = resolved;

  const appliedSeedKey = useRef<string | null>(null);
  useEffect(() => {
    if (appliedSeedKey.current === seedKey) {
      return;
    }
    appliedSeedKey.current = seedKey;

    if (seedKey === 'create') {
      newIdRef.current = createId();
      originalAttachmentRef.current = undefined;
      setKind('expense');
      setAmountText('');
      setCategoryId('');
      setDate(startOfLocalDay(new Date()));
      setNote('');
      setAttachmentUri(undefined);
      return;
    }

    const tx = resolvedRef.current;
    if (!tx) {
      return;
    }
    const isDup = seedKey.startsWith('dup:');
    if (!isDup && tx.id !== seedKey) {
      return;
    }
    if (isDup) {
      newIdRef.current = createId();
      originalAttachmentRef.current = undefined;
    } else {
      newIdRef.current = tx.id;
      originalAttachmentRef.current = tx.attachmentUri;
    }
    setKind(tx.kind);
    setAmountText(String(tx.amount));
    setCategoryId(tx.categoryId);
    setDate(isDup ? startOfLocalDay(new Date()) : parseISODateOnly(tx.date));
    setNote(tx.note);
    setAttachmentUri(isDup ? undefined : tx.attachmentUri);
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

  const captureAttachment = useCallback(async () => {
    const uri = await captureReceiptFromCamera(newIdRef.current);
    if (uri) {
      setAttachmentUri((prev) => {
        if (prev && prev !== uri && prev !== originalAttachmentRef.current) {
          void removeReceiptFile(prev);
        }
        return uri;
      });
    }
  }, []);

  const pickAttachment = useCallback(async () => {
    const uri = await pickReceiptFromLibrary(newIdRef.current);
    if (uri) {
      setAttachmentUri((prev) => {
        if (prev && prev !== uri && prev !== originalAttachmentRef.current) {
          void removeReceiptFile(prev);
        }
        return uri;
      });
    }
  }, []);

  const removeAttachment = useCallback(() => {
    setAttachmentUri((prev) => {
      if (prev && prev !== originalAttachmentRef.current) {
        void removeReceiptFile(prev);
      }
      return undefined;
    });
  }, []);

  const save = () => {
    if (!canSave || amount == null) {
      return;
    }
    const original = originalAttachmentRef.current;
    if (isEdit && resolved) {
      const base = items.find((tx) => tx.id === resolved.id) ?? resolved;
      if (original && original !== attachmentUri) {
        void removeReceiptFile(original);
      }
      dispatch(
        updateTransaction({
          ...base,
          kind,
          amount,
          categoryId,
          date: toISODateOnly(date),
          note: note.trim(),
          attachmentUri,
        })
      );
    } else {
      dispatch(
        addTransaction({
          id: newIdRef.current,
          kind,
          amount,
          categoryId,
          date: toISODateOnly(date),
          note: note.trim(),
          createdAt: new Date().toISOString(),
          attachmentUri,
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
    const toCleanup = resolved.attachmentUri;
    Alert.alert(
      t('create.confirmDeleteTitle'),
      t('create.confirmDeleteMessage'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.delete'),
          style: 'destructive',
          onPress: () => {
            if (toCleanup) {
              void removeReceiptFile(toCleanup);
            }
            dispatch(deleteTransaction(id));
            navigation.goBack();
          },
        },
      ]
    );
  }, [resolved, dispatch, navigation, t]);

  return {
    currency,
    locale,
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
    attachmentUri,
    captureAttachment,
    pickAttachment,
    removeAttachment,
  };
}

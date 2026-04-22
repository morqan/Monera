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
  addCategory,
  deleteCategory,
  updateCategory,
  type Category,
} from '@/entities/category';
import {
  deleteByCategory,
  reassignCategory,
  type TransactionKind,
} from '@/entities/transaction';
import { useTranslation } from '@/shared/i18n';
import { createId } from '@/shared/lib';

import { COLOR_PRESETS, ICON_PRESETS } from '../lib/presets';

export function useEditCategory() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'EditCategory'>>();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const categories = useAppSelector((s) => s.categories.items);
  const transactions = useAppSelector((s) => s.transactions.items);

  const categoryId = route.params?.categoryId;
  const defaultKind = route.params?.defaultKind ?? 'expense';

  const existing = useMemo<Category | null>(
    () =>
      categoryId ? categories.find((c) => c.id === categoryId) ?? null : null,
    [categoryId, categories]
  );

  const isEdit = existing !== null;
  const isBuiltIn = existing?.localeKey != null;

  const [name, setName] = useState('');
  const [kind, setKind] = useState<TransactionKind>(defaultKind);
  const [icon, setIcon] = useState<string>(ICON_PRESETS[0]);
  const [color, setColor] = useState(COLOR_PRESETS[0]);

  const appliedSeedKey = useRef<string | null>(null);
  useEffect(() => {
    const key = existing?.id ?? 'create';
    if (appliedSeedKey.current === key) {
      return;
    }
    appliedSeedKey.current = key;
    if (existing) {
      setName(
        existing.localeKey
          ? t(`categories.${existing.localeKey}` as never, {
              defaultValue: existing.name,
            })
          : existing.name
      );
      setKind(existing.kind);
      setIcon(existing.icon ?? ICON_PRESETS[0]);
      setColor(existing.color ?? COLOR_PRESETS[0]);
    } else {
      setName('');
      setKind(defaultKind);
      setIcon(ICON_PRESETS[0]);
      setColor(COLOR_PRESETS[0]);
    }
  }, [existing, defaultKind, t]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: isEdit ? t('category.editTitle') : t('category.newTitle'),
    });
  }, [navigation, isEdit, t]);

  const canSave = name.trim().length > 0;

  const save = useCallback(() => {
    if (!canSave) {
      return;
    }
    const trimmed = name.trim();
    if (isEdit && existing) {
      dispatch(
        updateCategory({
          ...existing,
          name: isBuiltIn ? existing.name : trimmed,
          kind,
          icon,
          color,
        })
      );
    } else {
      dispatch(
        addCategory({
          id: createId(),
          name: trimmed,
          kind,
          icon,
          color,
        })
      );
    }
    navigation.goBack();
  }, [
    canSave,
    name,
    isEdit,
    existing,
    isBuiltIn,
    kind,
    icon,
    color,
    dispatch,
    navigation,
  ]);

  const remove = useCallback(() => {
    if (!existing) {
      return;
    }
    if (isBuiltIn) {
      Alert.alert(t('category.cannotDeleteDefault'));
      return;
    }
    const sameKind = categories.filter(
      (c) => c.kind === existing.kind && c.id !== existing.id
    );
    if (sameKind.length === 0) {
      Alert.alert(t('category.cannotDeleteLast'));
      return;
    }
    const fallback =
      sameKind.find(
        (c) =>
          c.localeKey ===
          (existing.kind === 'expense' ? 'otherExpense' : 'otherIncome')
      ) ?? sameKind[0];
    const affected = transactions.some((tx) => tx.categoryId === existing.id);

    Alert.alert(
      t('category.deleteTitle'),
      affected ? t('category.deleteMessage') : undefined,
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: affected ? t('category.deleteCta') : t('common.delete'),
          style: 'destructive',
          onPress: () => {
            if (affected) {
              dispatch(
                reassignCategory({
                  fromCategoryId: existing.id,
                  toCategoryId: fallback.id,
                })
              );
            } else {
              dispatch(deleteByCategory(existing.id));
            }
            dispatch(deleteCategory(existing.id));
            navigation.goBack();
          },
        },
      ]
    );
  }, [existing, isBuiltIn, categories, transactions, dispatch, navigation, t]);

  return {
    canSave,
    color,
    icon,
    isBuiltIn,
    isEdit,
    kind,
    name,
    onDelete: isEdit ? remove : undefined,
    save,
    setColor,
    setIcon,
    setKind,
    setName,
  };
}

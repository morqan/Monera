import { Pressable, Text, useColorScheme, View } from 'react-native';

import { getGlassFabShadow, type AppColors } from '@/app/styles/theme';
import { useTranslation } from '@/shared/i18n';

import type { TransactionsFilter } from '../model/useTransactionsList';
import { transactionsListStyles } from '../styles';

type Props = {
  colors: AppColors;
  value: TransactionsFilter;
  onChange: (value: TransactionsFilter) => void;
};

export function TransactionsFilterTabs({ colors, value, onChange }: Props) {
  const isDark = useColorScheme() === 'dark';
  const fabShadow = getGlassFabShadow(isDark);
  const { t } = useTranslation();

  const FILTER_OPTIONS: Array<{ value: TransactionsFilter; label: string }> = [
    { value: 'all', label: t('transactions.filterAll') },
    { value: 'income', label: t('transactions.filterIncome') },
    { value: 'expense', label: t('transactions.filterExpense') },
  ];

  return (
    <View style={transactionsListStyles.filtersWrap}>
      <View style={transactionsListStyles.filtersRow}>
        {FILTER_OPTIONS.map((option) => {
          const isActive = option.value === value;

          return (
            <Pressable
              key={option.value}
              onPress={() => onChange(option.value)}
              style={({ pressed }) => [
                transactionsListStyles.filterChip,
                isActive ? fabShadow : null,
                {
                  backgroundColor: isActive ? colors.accent : colors.fill,
                  borderColor: isActive ? colors.fabRing : colors.border,
                  opacity: pressed ? 0.85 : 1,
                },
              ]}
            >
              <Text
                style={[
                  transactionsListStyles.filterChipLabel,
                  { color: isActive ? colors.onAccent : colors.label },
                ]}
              >
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

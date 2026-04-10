import { Text, useColorScheme, View } from 'react-native';

import { getGlassRowShadow, type AppColors } from '@/app/styles/theme';
import type { Transaction } from '@/entities/transaction';

import { transactionRowStyles } from './styles';

type Props = {
  transaction: Transaction;
  categoryName: string;
  amountLabel: string;
  colors: AppColors;
};

export function TransactionRow({
  transaction,
  categoryName,
  amountLabel,
  colors,
}: Props) {
  const scheme = useColorScheme();
  const isIncome = transaction.kind === 'income';
  const tone = isIncome ? colors.income : colors.expense;
  const prefix = isIncome ? '+' : '−';
  const rowShadow = getGlassRowShadow(scheme === 'dark');

  return (
    <View
      style={[
        transactionRowStyles.shell,
        rowShadow,
        {
          borderColor: colors.border,
          backgroundColor: colors.card,
        },
      ]}
    >
      <View style={transactionRowStyles.row}>
        <View
          style={[
            transactionRowStyles.iconWrap,
            { backgroundColor: colors.fill },
          ]}
        >
          <Text style={[transactionRowStyles.iconLabel, { color: tone }]}>
            {isIncome ? '↑' : '↓'}
          </Text>
        </View>
        <View style={transactionRowStyles.meta}>
          <Text style={[transactionRowStyles.title, { color: colors.label }]}>
            {categoryName}
          </Text>
          <Text
            style={[
              transactionRowStyles.subtitle,
              { color: colors.secondaryLabel },
            ]}
            numberOfLines={1}
          >
            {transaction.note.trim().length > 0
              ? transaction.note
              : transaction.date}
          </Text>
        </View>
        <Text style={[transactionRowStyles.amount, { color: tone }]}>
          {prefix}
          {amountLabel}
        </Text>
      </View>
    </View>
  );
}

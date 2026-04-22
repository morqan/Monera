import { Text, useColorScheme, View } from 'react-native';

import { getGlassRowShadow, type AppColors } from '@/app/styles/theme';
import type { Transaction } from '@/entities/transaction';
import { GlassSurface } from '@/shared/ui';

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
  const isDark = useColorScheme() === 'dark';
  const isIncome = transaction.kind === 'income';
  const tone = isIncome ? colors.income : colors.expense;
  const prefix = isIncome ? '+' : '−';
  const rowShadow = getGlassRowShadow(isDark);

  return (
    <GlassSurface
      colors={colors}
      isDark={isDark}
      variant="row"
      shadowStyle={rowShadow}
      style={transactionRowStyles.shell}
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
          <Text
            style={[transactionRowStyles.title, { color: colors.label }]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {categoryName}
          </Text>
          {transaction.note.trim().length > 0 ? (
            <Text
              style={[
                transactionRowStyles.note,
                { color: colors.secondaryLabel },
              ]}
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {transaction.note}
            </Text>
          ) : null}
          <Text
            style={[transactionRowStyles.date, { color: colors.tertiaryLabel }]}
            numberOfLines={1}
          >
            {transaction.date}
          </Text>
        </View>
        <Text
          style={[transactionRowStyles.amount, { color: tone }]}
          numberOfLines={1}
        >
          {prefix}
          {amountLabel}
        </Text>
      </View>
    </GlassSurface>
  );
}

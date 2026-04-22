import { StyleSheet, Text, useColorScheme, View } from 'react-native';

import { getGlassPanelShadow, theme, type AppColors } from '@/app/styles/theme';
import { useTranslation } from '@/shared/i18n';
import { formatMoney } from '@/shared/lib';
import { GlassSurface } from '@/shared/ui';

import type { MonthTotals } from '../model/useTransactionsList';

type Props = {
  colors: AppColors;
  totals: MonthTotals;
  currency: string;
  locale: string;
};

export function MonthSummary({ colors, totals, currency, locale }: Props) {
  const isDark = useColorScheme() === 'dark';
  const shadow = getGlassPanelShadow(isDark);
  const { t } = useTranslation();
  const balanceColor =
    totals.balance > 0
      ? colors.income
      : totals.balance < 0
      ? colors.expense
      : colors.label;

  return (
    <GlassSurface
      colors={colors}
      isDark={isDark}
      variant="card"
      shadowStyle={shadow}
      style={styles.shell}
    >
      <View style={styles.inner}>
        <View style={styles.balanceRow}>
          <Text style={[styles.balanceLabel, { color: colors.secondaryLabel }]}>
            {t('transactions.balanceLabel')}
          </Text>
          <Text
            style={[styles.balanceValue, { color: balanceColor }]}
            numberOfLines={1}
          >
            {formatMoney(totals.balance, currency, locale)}
          </Text>
        </View>
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        <View style={styles.cellsRow}>
          <Cell
            colors={colors}
            label={t('transactions.income')}
            value={formatMoney(totals.income, currency, locale)}
            tone={colors.income}
          />
          <View style={[styles.vDivider, { backgroundColor: colors.border }]} />
          <Cell
            colors={colors}
            label={t('transactions.expense')}
            value={formatMoney(totals.expense, currency, locale)}
            tone={colors.expense}
          />
        </View>
      </View>
    </GlassSurface>
  );
}

function Cell({
  colors,
  label,
  value,
  tone,
}: {
  colors: AppColors;
  label: string;
  value: string;
  tone: string;
}) {
  return (
    <View style={styles.cell}>
      <Text style={[styles.cellLabel, { color: colors.secondaryLabel }]}>
        {label}
      </Text>
      <Text style={[styles.cellValue, { color: tone }]} numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    marginBottom: theme.space.md,
  },
  inner: {
    paddingHorizontal: theme.space.md,
    paddingVertical: theme.space.md,
  },
  balanceRow: {
    alignItems: 'flex-start',
  },
  balanceLabel: {
    fontSize: 11,
    fontWeight: '500',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  balanceValue: {
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.4,
    marginTop: 4,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginVertical: theme.space.md,
  },
  cellsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cell: {
    flex: 1,
  },
  cellLabel: {
    fontSize: 11,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  cellValue: {
    fontSize: 15,
    fontWeight: '600',
    marginTop: 2,
    letterSpacing: -0.1,
  },
  vDivider: {
    width: StyleSheet.hairlineWidth,
    alignSelf: 'stretch',
    marginHorizontal: theme.space.md,
  },
});

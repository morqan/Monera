import { AlertTriangle, Target } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';

import { theme, type AppColors } from '@/app/styles/theme';
import { useTranslation } from '@/shared/i18n';
import { formatMoney, hexToRgba } from '@/shared/lib';

type Props = {
  limit: number;
  spent: number;
  colors: AppColors;
  currency: string;
  locale: string;
};

export function MonthlyBudgetBanner({
  limit,
  spent,
  colors,
  currency,
  locale,
}: Props) {
  const { t } = useTranslation();
  const progress = Math.max(0, Math.min(1, spent / limit));
  const overspent = spent > limit;
  const remaining = limit - spent;
  const tint = overspent ? colors.expense : colors.accent;
  const Icon = overspent ? AlertTriangle : Target;

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
        },
      ]}
    >
      <View style={styles.header}>
        <View
          style={[styles.iconWrap, { backgroundColor: hexToRgba(tint, 0.14) }]}
        >
          <Icon size={16} color={tint} strokeWidth={2} />
        </View>
        <Text style={[styles.title, { color: colors.label }]}>
          {t('home.monthlyBudget')}
        </Text>
        <Text style={[styles.amount, { color: colors.secondaryLabel }]}>
          {formatMoney(spent, currency, locale)} /{' '}
          {formatMoney(limit, currency, locale)}
        </Text>
      </View>
      <View style={[styles.track, { backgroundColor: hexToRgba(tint, 0.14) }]}>
        <View
          style={[
            styles.fill,
            { width: `${progress * 100}%`, backgroundColor: tint },
          ]}
        />
      </View>
      <Text
        style={[
          styles.caption,
          { color: overspent ? colors.expense : colors.tertiaryLabel },
        ]}
      >
        {overspent
          ? t('home.monthlyOver', {
              amount: formatMoney(-remaining, currency, locale),
            })
          : t('home.monthlyLeft', {
              amount: formatMoney(remaining, currency, locale),
            })}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: theme.radius.card,
    borderWidth: StyleSheet.hairlineWidth,
    padding: theme.space.md,
    marginBottom: theme.space.md,
    gap: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.space.sm,
  },
  iconWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
  },
  amount: {
    fontSize: 12,
    fontWeight: '600',
  },
  track: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 3,
  },
  caption: {
    fontSize: 11,
    fontWeight: '500',
  },
});

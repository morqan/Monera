import { StyleSheet, Text, useColorScheme, View } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';

import { getGlassPanelShadow, theme, type AppColors } from '@/app/styles/theme';
import { formatMoney } from '@/shared/lib';
import { CategoryIcon, GlassSurface } from '@/shared/ui';

import type { PieSlice } from '../model/useInsights';

type Props = {
  colors: AppColors;
  title: string;
  totalLabel: string;
  slices: PieSlice[];
  currency: string;
  locale: string;
  emptyText: string;
};

export function DonutCard({
  colors,
  title,
  totalLabel,
  slices,
  currency,
  locale,
  emptyText,
}: Props) {
  const isDark = useColorScheme() === 'dark';
  const shadow = getGlassPanelShadow(isDark);

  const total = slices.reduce((s, v) => s + v.value, 0);
  const pieData = slices.map((s) => ({ value: s.value, color: s.color }));

  return (
    <GlassSurface
      colors={colors}
      isDark={isDark}
      variant="card"
      shadowStyle={shadow}
      style={styles.shell}
    >
      <View style={styles.inner}>
        <Text style={[styles.title, { color: colors.secondaryLabel }]}>
          {title}
        </Text>
        {slices.length === 0 ? (
          <Text style={[styles.empty, { color: colors.tertiaryLabel }]}>
            {emptyText}
          </Text>
        ) : (
          <>
            <View style={styles.chartRow}>
              <PieChart
                data={pieData}
                donut
                radius={86}
                innerRadius={60}
                backgroundColor="transparent"
                innerCircleColor="transparent"
                centerLabelComponent={() => (
                  <View style={styles.center}>
                    <Text
                      style={[
                        styles.centerLabel,
                        { color: colors.tertiaryLabel },
                      ]}
                    >
                      {totalLabel}
                    </Text>
                    <Text
                      style={[styles.centerValue, { color: colors.label }]}
                      numberOfLines={1}
                    >
                      {formatMoney(total, currency, locale)}
                    </Text>
                  </View>
                )}
              />
            </View>
            <View style={styles.legend}>
              {slices.map((s) => (
                <View key={s.categoryId} style={styles.row}>
                  <View style={[styles.bullet, { backgroundColor: s.color }]} />
                  <View style={styles.rowIcon}>
                    <CategoryIcon
                      icon={s.category.icon}
                      size={14}
                      color={colors.label}
                    />
                  </View>
                  <Text
                    style={[styles.rowLabel, { color: colors.label }]}
                    numberOfLines={1}
                  >
                    {s.name}
                  </Text>
                  <Text
                    style={[
                      styles.rowPercent,
                      { color: colors.secondaryLabel },
                    ]}
                  >
                    {s.percent.toFixed(0)}%
                  </Text>
                  <Text
                    style={[styles.rowValue, { color: colors.label }]}
                    numberOfLines={1}
                  >
                    {formatMoney(s.value, currency, locale)}
                  </Text>
                </View>
              ))}
            </View>
          </>
        )}
      </View>
    </GlassSurface>
  );
}

const styles = StyleSheet.create({
  shell: { marginBottom: theme.space.md },
  inner: {
    paddingHorizontal: theme.space.md,
    paddingVertical: theme.space.md,
  },
  title: {
    fontSize: 11,
    fontWeight: '500',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  empty: {
    fontSize: 13,
    textAlign: 'center',
    paddingVertical: theme.space.lg,
  },
  chartRow: {
    alignItems: 'center',
    paddingVertical: theme.space.md,
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerLabel: {
    fontSize: 10,
    fontWeight: '500',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  centerValue: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.2,
    marginTop: 2,
  },
  legend: {
    gap: theme.space.xs,
    marginTop: theme.space.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.space.sm,
  },
  bullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  rowIcon: {
    width: 16,
    alignItems: 'center',
  },
  rowLabel: {
    flex: 1,
    fontSize: 13,
    fontWeight: '500',
  },
  rowPercent: {
    fontSize: 12,
    fontWeight: '500',
    minWidth: 36,
    textAlign: 'right',
  },
  rowValue: {
    fontSize: 13,
    fontWeight: '600',
    minWidth: 72,
    textAlign: 'right',
    letterSpacing: -0.1,
  },
});

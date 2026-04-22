import { StyleSheet, Text, useColorScheme, View } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';

import { getGlassPanelShadow, theme, type AppColors } from '@/app/styles/theme';
import { hexToRgba } from '@/shared/lib';
import { GlassSurface } from '@/shared/ui';

import type { TrendBucket } from '../model/useInsights';

type Props = {
  colors: AppColors;
  title: string;
  buckets: TrendBucket[];
  incomeLabel: string;
  expenseLabel: string;
  emptyText: string;
};

const BAR_WIDTH = 10;
const INNER_SPACING = 3;
const GROUP_SPACING = 14;

export function TrendCard({
  colors,
  title,
  buckets,
  incomeLabel,
  expenseLabel,
  emptyText,
}: Props) {
  const isDark = useColorScheme() === 'dark';
  const shadow = getGlassPanelShadow(isDark);

  const maxValue = Math.max(
    1,
    ...buckets.flatMap((b) => [b.income, b.expense])
  );

  const data = buckets.flatMap((b, idx) => {
    const isLastGroup = idx === buckets.length - 1;
    return [
      {
        value: b.income,
        frontColor: colors.income,
        spacing: INNER_SPACING,
      },
      {
        value: b.expense,
        frontColor: colors.expense,
        spacing: isLastGroup ? 0 : GROUP_SPACING,
        label: b.label,
        labelTextStyle: {
          color: colors.tertiaryLabel,
          fontSize: 10,
        },
      },
    ];
  });

  return (
    <GlassSurface
      colors={colors}
      isDark={isDark}
      variant="card"
      shadowStyle={shadow}
      style={styles.shell}
    >
      <View style={styles.inner}>
        <View style={styles.headerRow}>
          <Text style={[styles.title, { color: colors.secondaryLabel }]}>
            {title}
          </Text>
          <View style={styles.legend}>
            <Legend
              color={colors.income}
              label={incomeLabel}
              tone={colors.secondaryLabel}
            />
            <Legend
              color={colors.expense}
              label={expenseLabel}
              tone={colors.secondaryLabel}
            />
          </View>
        </View>
        {buckets.length === 0 ? (
          <Text style={[styles.empty, { color: colors.tertiaryLabel }]}>
            {emptyText}
          </Text>
        ) : (
          <View style={styles.chartWrap}>
            <BarChart
              data={data}
              barWidth={BAR_WIDTH}
              barBorderRadius={3}
              height={160}
              noOfSections={3}
              maxValue={Math.ceil(maxValue * 1.1)}
              initialSpacing={GROUP_SPACING / 2}
              endSpacing={GROUP_SPACING / 2}
              yAxisThickness={0}
              xAxisThickness={StyleSheet.hairlineWidth}
              xAxisColor={colors.border}
              rulesColor={hexToRgba(colors.label, isDark ? 0.08 : 0.06)}
              rulesType="solid"
              yAxisTextStyle={{
                color: colors.tertiaryLabel,
                fontSize: 10,
              }}
              hideYAxisText={false}
              isAnimated
              animationDuration={350}
              disableScroll={false}
            />
          </View>
        )}
      </View>
    </GlassSurface>
  );
}

function Legend({
  color,
  label,
  tone,
}: {
  color: string;
  label: string;
  tone: string;
}) {
  return (
    <View style={styles.legendItem}>
      <View style={[styles.legendDot, { backgroundColor: color }]} />
      <Text style={[styles.legendLabel, { color: tone }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: { marginBottom: theme.space.md },
  inner: {
    paddingHorizontal: theme.space.md,
    paddingVertical: theme.space.md,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.space.sm,
  },
  title: {
    fontSize: 11,
    fontWeight: '500',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  legend: {
    flexDirection: 'row',
    gap: theme.space.sm,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendLabel: {
    fontSize: 11,
    fontWeight: '500',
  },
  empty: {
    fontSize: 13,
    textAlign: 'center',
    paddingVertical: theme.space.lg,
  },
  chartWrap: {
    marginTop: theme.space.sm,
  },
});

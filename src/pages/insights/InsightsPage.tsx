import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { getAppColors, theme } from '@/app/styles/theme';
import { MonthSummary } from '@/pages/transactions-list/ui/MonthSummary';
import { useTranslation } from '@/shared/i18n';
import { GlassBackground, GlassSurface } from '@/shared/ui';
import { RangePicker } from '@/widgets/range-picker';

import { useInsights } from './model/useInsights';
import { DonutCard } from './ui/DonutCard';
import { TrendCard } from './ui/TrendCard';

export function InsightsPage() {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const colors = getAppColors(isDark);
  const { t } = useTranslation();
  const {
    currency,
    kind,
    locale,
    pie,
    range,
    next,
    prev,
    reset,
    setKind,
    setPreset,
    setRange,
    totals,
    trend,
  } = useInsights();

  return (
    <GlassBackground>
      <SafeAreaView style={styles.screen} edges={['bottom']}>
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <RangePicker
            colors={colors}
            range={range}
            onPrev={prev}
            onNext={next}
            onReset={reset}
            onPresetChange={setPreset}
            onCustomRange={setRange}
          />
          <MonthSummary
            colors={colors}
            totals={totals}
            currency={currency}
            locale={locale}
          />

          <GlassSurface
            colors={colors}
            isDark={isDark}
            variant="pill"
            style={styles.kindTabsShell}
          >
            <View style={styles.kindTabs}>
              <KindTab
                active={kind === 'expense'}
                label={t('home.expenseTab')}
                colors={colors}
                onPress={() => setKind('expense')}
              />
              <KindTab
                active={kind === 'income'}
                label={t('home.incomeTab')}
                colors={colors}
                onPress={() => setKind('income')}
              />
            </View>
          </GlassSurface>

          <DonutCard
            colors={colors}
            title={
              kind === 'expense'
                ? t('insights.donutExpenseTitle')
                : t('insights.donutIncomeTitle')
            }
            totalLabel={t('insights.donutTotal')}
            slices={pie}
            currency={currency}
            locale={locale}
            emptyText={t('insights.empty')}
          />

          <TrendCard
            colors={colors}
            title={t('insights.trendTitle')}
            buckets={trend}
            incomeLabel={t('transactions.income')}
            expenseLabel={t('transactions.expense')}
            emptyText={t('insights.empty')}
          />
        </ScrollView>
      </SafeAreaView>
    </GlassBackground>
  );
}

function KindTab({
  active,
  label,
  colors,
  onPress,
}: {
  active: boolean;
  label: string;
  colors: ReturnType<typeof getAppColors>;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.kindTab,
        {
          backgroundColor: active ? colors.accent : 'transparent',
          opacity: pressed ? 0.85 : 1,
        },
      ]}
    >
      <Text
        style={[
          styles.kindTabLabel,
          { color: active ? colors.onAccent : colors.secondaryLabel },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: {
    padding: theme.space.md,
    paddingBottom: theme.space.xl * 2,
  },
  kindTabsShell: {
    marginBottom: theme.space.md,
  },
  kindTabs: {
    flexDirection: 'row',
    padding: 4,
    gap: 4,
  },
  kindTab: {
    flex: 1,
    minHeight: 34,
    borderRadius: theme.radius.pill - 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  kindTabLabel: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: -0.1,
  },
});

import {
  FolderPlus,
  LayoutGrid,
  List,
  PieChart,
  Plus,
  type LucideIcon,
} from 'lucide-react-native';
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
import { formatMoney, hexToRgba } from '@/shared/lib';
import { GlassBackground, GlassSurface } from '@/shared/ui';
import { CategoryTile } from '@/widgets/category-tile';
import { RangePicker } from '@/widgets/range-picker';

import { useHome } from './model/useHome';
import { MonthlyBudgetBanner } from './ui/MonthlyBudgetBanner';

export function HomePage() {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const colors = getAppColors(isDark);
  const { t } = useTranslation();
  const {
    currency,
    kind,
    locale,
    monthlyBudget,
    range,
    rangeTotals,
    next,
    openAllTransactions,
    openCategory,
    openCreate,
    openEditCategory,
    openInsights,
    openManage,
    prev,
    reset,
    setKind,
    setPreset,
    setRange,
    tiles,
  } = useHome();

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
            totals={rangeTotals}
            currency={currency}
            locale={locale}
          />

          {monthlyBudget ? (
            <MonthlyBudgetBanner
              limit={monthlyBudget.limit}
              spent={monthlyBudget.spent}
              colors={colors}
              currency={currency}
              locale={locale}
            />
          ) : null}

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

          <View style={styles.grid}>
            {tiles.map((tile) => (
              <CategoryTile
                key={tile.category.id}
                category={tile.category}
                amountLabel={
                  tile.summary
                    ? formatMoney(tile.summary.total, currency, locale)
                    : null
                }
                count={tile.summary?.count ?? 0}
                budgetProgress={tile.budgetProgress}
                colors={colors}
                onPress={() => openCategory(tile.category.id)}
                onLongPress={() => openEditCategory(tile.category.id)}
              />
            ))}
            {tiles.length === 0 ? (
              <View style={styles.empty}>
                <Text style={[styles.emptyTitle, { color: colors.label }]}>
                  {t('home.noCategoriesTitle')}
                </Text>
                <Text
                  style={[
                    styles.emptySubtitle,
                    { color: colors.secondaryLabel },
                  ]}
                >
                  {t('home.noCategoriesSubtitle')}
                </Text>
              </View>
            ) : null}
          </View>

          <View style={styles.footer}>
            <View style={styles.quickBar}>
              <QuickAction
                Icon={FolderPlus}
                label={t('home.addCategory')}
                onPress={() => openEditCategory()}
                colors={colors}
              />
              <QuickAction
                Icon={LayoutGrid}
                label={t('home.manageCategories')}
                onPress={openManage}
                colors={colors}
              />
              <QuickAction
                Icon={List}
                label={t('home.allTransactions')}
                onPress={openAllTransactions}
                colors={colors}
              />
              <QuickAction
                Icon={PieChart}
                label={t('home.insights')}
                onPress={openInsights}
                colors={colors}
              />
            </View>
            <Pressable
              onPress={openCreate}
              accessibilityRole="button"
              accessibilityLabel={t('transactions.emptyAllCta')}
              style={({ pressed }) => [
                styles.primaryCta,
                {
                  backgroundColor: colors.accent,
                  opacity: pressed ? 0.88 : 1,
                },
              ]}
            >
              <Plus size={18} color={colors.onAccent} strokeWidth={2.5} />
              <Text
                style={[styles.primaryCtaLabel, { color: colors.onAccent }]}
              >
                {t('transactions.emptyAllCta')}
              </Text>
            </Pressable>
          </View>
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
      accessibilityLabel={label}
      accessibilityState={{ selected: active }}
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

function QuickAction({
  Icon,
  label,
  onPress,
  colors,
}: {
  Icon: LucideIcon;
  label: string;
  onPress: () => void;
  colors: ReturnType<typeof getAppColors>;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [
        styles.quickSlot,
        { opacity: pressed ? 0.7 : 1 },
      ]}
    >
      <View
        style={[
          styles.quickIcon,
          {
            backgroundColor: hexToRgba(colors.accent, 0.12),
            borderColor: hexToRgba(colors.accent, 0.22),
          },
        ]}
      >
        <Icon size={18} color={colors.accent} strokeWidth={2} />
      </View>
      <Text
        style={[styles.quickLabel, { color: colors.secondaryLabel }]}
        numberOfLines={2}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
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
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.space.sm,
    marginBottom: theme.space.lg,
  },
  empty: {
    flex: 1,
    padding: theme.space.xl,
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '600',
  },
  emptySubtitle: {
    fontSize: 13,
    marginTop: theme.space.xs,
    textAlign: 'center',
  },
  footer: {
    gap: theme.space.md,
  },
  quickBar: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.space.xs,
  },
  quickSlot: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: theme.space.xs,
    gap: 6,
  },
  quickIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
  },
  quickLabel: {
    fontSize: 11,
    fontWeight: '500',
    letterSpacing: -0.1,
    textAlign: 'center',
  },
  primaryCta: {
    minHeight: 48,
    borderRadius: theme.radius.pill,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: theme.space.md,
  },
  primaryCtaLabel: {
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: -0.1,
  },
});

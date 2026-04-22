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
import { formatMoney } from '@/shared/lib';
import { GlassBackground, GlassSurface } from '@/shared/ui';
import { CategoryTile } from '@/widgets/category-tile';
import { RangePicker } from '@/widgets/range-picker';

import { useHome } from './model/useHome';

export function HomePage() {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const colors = getAppColors(isDark);
  const { t } = useTranslation();
  const {
    currency,
    kind,
    locale,
    range,
    rangeTotals,
    next,
    openAllTransactions,
    openCategory,
    openCreate,
    openEditCategory,
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
            <FooterButton
              label={t('home.addCategory')}
              onPress={() => openEditCategory()}
              colors={colors}
              variant="primary"
              isDark={isDark}
            />
            <FooterButton
              label={t('home.manageCategories')}
              onPress={openManage}
              colors={colors}
              variant="ghost"
              isDark={isDark}
            />
            <FooterButton
              label={t('home.allTransactions')}
              onPress={openAllTransactions}
              colors={colors}
              variant="ghost"
              isDark={isDark}
            />
            <FooterButton
              label={t('transactions.emptyAllCta')}
              onPress={openCreate}
              colors={colors}
              variant="accent"
              isDark={isDark}
            />
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

function FooterButton({
  label,
  onPress,
  colors,
  variant,
  isDark,
}: {
  label: string;
  onPress: () => void;
  colors: ReturnType<typeof getAppColors>;
  variant: 'primary' | 'ghost' | 'accent';
  isDark: boolean;
}) {
  if (variant === 'accent') {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.footerButton,
          {
            backgroundColor: colors.accent,
            opacity: pressed ? 0.88 : 1,
          },
        ]}
      >
        <Text style={[styles.footerLabel, { color: colors.onAccent }]}>
          {label}
        </Text>
      </Pressable>
    );
  }
  if (variant === 'ghost') {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.footerButton,
          styles.footerGhost,
          { opacity: pressed ? 0.7 : 1 },
        ]}
      >
        <Text style={[styles.footerLabel, { color: colors.secondaryLabel }]}>
          {label}
        </Text>
      </Pressable>
    );
  }
  return (
    <GlassSurface
      colors={colors}
      isDark={isDark}
      variant="card"
      borderRadius={theme.radius.button}
    >
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.footerButton,
          { opacity: pressed ? 0.85 : 1 },
        ]}
      >
        <Text style={[styles.footerLabel, { color: colors.label }]}>
          {label}
        </Text>
      </Pressable>
    </GlassSurface>
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
    gap: theme.space.sm,
  },
  footerButton: {
    minHeight: 44,
    borderRadius: theme.radius.button,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerGhost: {
    backgroundColor: 'transparent',
  },
  footerLabel: {
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: -0.1,
  },
});

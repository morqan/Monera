import { useCallback } from 'react';
import {
  Pressable,
  ScrollView,
  SectionList,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  type SectionListRenderItem,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { getAppColors, theme } from '@/app/styles/theme';
import { useTransactionRowMenu } from '@/shared/hooks';
import { useTranslation } from '@/shared/i18n';
import { formatMoney } from '@/shared/lib';
import { GlassBackground } from '@/shared/ui';
import { RangePicker } from '@/widgets/range-picker';
import { TransactionRow } from '@/widgets/transaction-row';

import { MonthSummary } from '../transactions-list/ui/MonthSummary';
import { transactionsListStyles } from '../transactions-list/styles';
import {
  useCategoryTransactions,
  type CategoryRow,
  type CategorySection,
} from './model/useCategoryTransactions';

export function CategoryTransactionsPage() {
  const scheme = useColorScheme();
  const colors = getAppColors(scheme === 'dark');
  const { t } = useTranslation();
  const {
    category,
    currency,
    hasRangeItems,
    locale,
    range,
    rangeTotals,
    next,
    openCreate,
    openEdit,
    duplicate,
    openEditCategory,
    prev,
    reset,
    sections,
    setPreset,
    setRange,
  } = useCategoryTransactions();

  const showRowMenu = useTransactionRowMenu({
    onEdit: openEdit,
    onDuplicate: duplicate,
  });

  const renderItem: SectionListRenderItem<CategoryRow, CategorySection> =
    useCallback(
      ({ item }) => (
        <Pressable
          onPress={() => openEdit(item.transaction.id)}
          onLongPress={() => showRowMenu(item.transaction.id)}
        >
          <TransactionRow
            transaction={item.transaction}
            categoryName={item.categoryName}
            amountLabel={formatMoney(item.transaction.amount, currency, locale)}
            colors={colors}
          />
        </Pressable>
      ),
      [colors, currency, locale, openEdit, showRowMenu]
    );

  const keyExtractor = useCallback(
    (item: CategoryRow) => item.transaction.id,
    []
  );
  const renderSectionHeader = useCallback(
    ({ section }: { section: CategorySection }) => (
      <View style={transactionsListStyles.sectionHeader}>
        <Text
          style={[
            transactionsListStyles.sectionHeaderLabel,
            { color: colors.secondaryLabel },
          ]}
        >
          {section.title}
        </Text>
      </View>
    ),
    [colors.secondaryLabel]
  );

  const header = (
    <>
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
      <View style={styles.actionsRow}>
        <ActionPill
          label={t('common.edit')}
          onPress={openEditCategory}
          colors={colors}
          variant="ghost"
        />
        <ActionPill
          label={t('transactions.emptyAllCta')}
          onPress={openCreate}
          colors={colors}
          variant="accent"
        />
      </View>
    </>
  );

  if (!category) {
    return (
      <GlassBackground>
        <SafeAreaView
          style={transactionsListStyles.screen}
          edges={['bottom']}
        />
      </GlassBackground>
    );
  }

  return (
    <GlassBackground accent={category.color}>
      <SafeAreaView style={transactionsListStyles.screen} edges={['bottom']}>
        <View style={transactionsListStyles.content}>
          {!hasRangeItems ? (
            <ScrollView
              contentContainerStyle={transactionsListStyles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              {header}
              <View style={transactionsListStyles.empty}>
                <Text
                  style={[
                    transactionsListStyles.emptyTitle,
                    { color: colors.label },
                  ]}
                >
                  {t('category.emptyTitle')}
                </Text>
                <Text
                  style={[
                    transactionsListStyles.emptySubtitle,
                    { color: colors.secondaryLabel },
                  ]}
                >
                  {t('category.emptySubtitle')}
                </Text>
              </View>
            </ScrollView>
          ) : (
            <SectionList
              style={transactionsListStyles.sectionsList}
              sections={sections}
              keyExtractor={keyExtractor}
              renderItem={renderItem}
              renderSectionHeader={renderSectionHeader}
              ListHeaderComponent={header}
              contentContainerStyle={transactionsListStyles.listContent}
              stickySectionHeadersEnabled={false}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>
      </SafeAreaView>
    </GlassBackground>
  );
}

function ActionPill({
  label,
  onPress,
  colors,
  variant,
}: {
  label: string;
  onPress: () => void;
  colors: ReturnType<typeof getAppColors>;
  variant: 'ghost' | 'accent';
}) {
  const bg = variant === 'accent' ? colors.accent : colors.fill;
  const color = variant === 'accent' ? colors.onAccent : colors.label;
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.actionPill,
        {
          backgroundColor: bg,
          borderColor: variant === 'ghost' ? colors.border : colors.accent,
          opacity: pressed ? 0.85 : 1,
        },
      ]}
    >
      <Text style={[styles.actionLabel, { color }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  actionsRow: {
    flexDirection: 'row',
    gap: theme.space.sm,
    marginBottom: theme.space.md,
  },
  actionPill: {
    flex: 1,
    minHeight: 44,
    borderRadius: theme.radius.pill,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionLabel: {
    fontSize: 15,
    fontWeight: '700',
  },
});

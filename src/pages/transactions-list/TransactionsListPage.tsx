import { useCallback } from 'react';
import {
  Pressable,
  ScrollView,
  SectionList,
  Text,
  useColorScheme,
  View,
  type SectionListRenderItem,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getAppColors } from '@/app/styles/theme';
import { useTransactionRowMenu } from '@/shared/hooks';
import { formatMoney } from '@/shared/lib';
import { GlassBackground } from '@/shared/ui';
import { RangePicker } from '@/widgets/range-picker';
import { TransactionRow } from '@/widgets/transaction-row';

import {
  useTransactionsList,
  type TransactionRow as Row,
  type TransactionSection,
} from './model/useTransactionsList';
import { transactionsListStyles } from './styles';
import { AddFab } from './ui/AddFab';
import { MonthSummary } from './ui/MonthSummary';
import { SearchField } from './ui/SearchField';
import { TransactionsEmpty } from './ui/TransactionsEmpty';
import { TransactionsFilterTabs } from './ui/TransactionsFilter';

export function TransactionsListPage() {
  const scheme = useColorScheme();
  const colors = getAppColors(scheme === 'dark');
  const headerHeight = 25;
  const {
    currency,
    filter,
    hasAnyTransactions,
    hasRangeTransactions,
    isFilteredEmpty,
    locale,
    query,
    range,
    rangeTotals,
    next,
    openCreate,
    openEdit,
    duplicate,
    prev,
    reset,
    sections,
    setFilter,
    setPreset,
    setQuery,
    setRange,
  } = useTransactionsList();

  const showRowMenu = useTransactionRowMenu({
    onEdit: openEdit,
    onDuplicate: duplicate,
  });

  const renderItem: SectionListRenderItem<Row, TransactionSection> =
    useCallback(
      ({ item }) => (
        <Pressable
          onPress={() => openEdit(item.transaction.id)}
          onLongPress={() => showRowMenu(item.transaction.id)}
          accessibilityRole="button"
          accessibilityLabel={`${item.categoryName} ${formatMoney(
            item.transaction.amount,
            currency,
            locale
          )}`}
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

  const keyExtractor = useCallback((item: Row) => item.transaction.id, []);
  const renderSectionHeader = useCallback(
    ({ section }: { section: TransactionSection }) => (
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

  const rangeHeader = (
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
    </>
  );

  if (!hasAnyTransactions) {
    return (
      <GlassBackground>
        <SafeAreaView style={transactionsListStyles.screen} edges={['bottom']}>
          <View
            style={[
              transactionsListStyles.belowHeader,
              { paddingTop: headerHeight },
            ]}
          >
            <TransactionsEmpty
              colors={colors}
              variant="all"
              onCreate={openCreate}
            />
          </View>
          <View style={transactionsListStyles.fabWrap}>
            <AddFab colors={colors} onPress={openCreate} />
          </View>
        </SafeAreaView>
      </GlassBackground>
    );
  }

  return (
    <GlassBackground>
      <SafeAreaView style={transactionsListStyles.screen} edges={['bottom']}>
        <View
          style={[
            transactionsListStyles.belowHeader,
            { paddingTop: headerHeight },
          ]}
        >
          <View style={transactionsListStyles.content}>
            {!hasRangeTransactions ? (
              <ScrollView
                contentContainerStyle={transactionsListStyles.scrollContent}
                showsVerticalScrollIndicator={false}
              >
                {rangeHeader}
                <TransactionsEmpty
                  colors={colors}
                  variant="month"
                  onCreate={openCreate}
                />
              </ScrollView>
            ) : isFilteredEmpty ? (
              <ScrollView
                contentContainerStyle={transactionsListStyles.scrollContent}
                showsVerticalScrollIndicator={false}
              >
                {rangeHeader}
                <SearchField
                  colors={colors}
                  value={query}
                  onChange={setQuery}
                />
                <TransactionsFilterTabs
                  colors={colors}
                  value={filter}
                  onChange={setFilter}
                />
                <TransactionsEmpty
                  colors={colors}
                  variant="filtered"
                  onCreate={openCreate}
                  onResetFilter={() => setFilter('all')}
                />
              </ScrollView>
            ) : (
              <SectionList
                style={transactionsListStyles.sectionsList}
                sections={sections}
                keyExtractor={keyExtractor}
                renderItem={renderItem}
                renderSectionHeader={renderSectionHeader}
                ListHeaderComponent={
                  <>
                    {rangeHeader}
                    <SearchField
                      colors={colors}
                      value={query}
                      onChange={setQuery}
                    />
                    <TransactionsFilterTabs
                      colors={colors}
                      value={filter}
                      onChange={setFilter}
                    />
                  </>
                }
                contentContainerStyle={transactionsListStyles.listContent}
                stickySectionHeadersEnabled={false}
                showsVerticalScrollIndicator={false}
              />
            )}
          </View>
        </View>
        <View style={transactionsListStyles.fabWrap}>
          <AddFab colors={colors} onPress={openCreate} />
        </View>
      </SafeAreaView>
    </GlassBackground>
  );
}

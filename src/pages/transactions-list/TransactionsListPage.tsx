import { useCallback } from 'react';
import {
  Pressable,
  SectionList,
  Text,
  useColorScheme,
  View,
  type SectionListRenderItem,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getAppColors } from '@/app/styles/theme';
import { formatMoney } from '@/shared/lib';
import { TransactionRow } from '@/widgets/transaction-row';

import {
  useTransactionsList,
  type TransactionRow as Row,
  type TransactionSection,
} from './model/useTransactionsList';
import { transactionsListStyles } from './styles';
import { AddFab } from './ui/AddFab';
import { TransactionsEmpty } from './ui/TransactionsEmpty';
import { TransactionsFilterTabs } from './ui/TransactionsFilter';

export function TransactionsListPage() {
  const scheme = useColorScheme();
  const colors = getAppColors(scheme === 'dark');
  const headerHeight = 25;
  const {
    currency,
    filter,
    hasTransactions,
    isFilteredEmpty,
    openCreate,
    openEdit,
    sections,
    setFilter,
  } = useTransactionsList();

  const renderItem: SectionListRenderItem<Row, TransactionSection> =
    useCallback(
      ({ item }) => (
        <Pressable onPress={() => openEdit(item.transaction.id)}>
          <TransactionRow
            transaction={item.transaction}
            categoryName={item.categoryName}
            amountLabel={formatMoney(item.transaction.amount, currency)}
            colors={colors}
          />
        </Pressable>
      ),
      [colors, currency, openEdit]
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

  if (!hasTransactions) {
    return (
      <SafeAreaView
        style={[
          transactionsListStyles.screen,
          { backgroundColor: colors.groupedBackground },
        ]}
        edges={['bottom']}
      >
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
    );
  }

  return (
    <SafeAreaView
      style={[
        transactionsListStyles.screen,
        { backgroundColor: colors.groupedBackground },
      ]}
      edges={['bottom']}
    >
      <View
        style={[
          transactionsListStyles.belowHeader,
          { paddingTop: headerHeight },
        ]}
      >
        <View style={transactionsListStyles.content}>
          <TransactionsFilterTabs
            colors={colors}
            value={filter}
            onChange={setFilter}
          />
          {isFilteredEmpty ? (
            <TransactionsEmpty
              colors={colors}
              variant="filtered"
              onCreate={openCreate}
              onResetFilter={() => setFilter('all')}
            />
          ) : (
            <SectionList
              style={transactionsListStyles.sectionsList}
              sections={sections}
              keyExtractor={keyExtractor}
              renderItem={renderItem}
              renderSectionHeader={renderSectionHeader}
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
  );
}

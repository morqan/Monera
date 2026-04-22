import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  useColorScheme,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getAppColors } from '@/app/styles/theme';
import { useTranslation } from '@/shared/i18n';

import { useCreateTransaction } from './model/useCreateTransaction';
import { createTransactionStyles } from './styles';
import { AmountField } from './ui/AmountField';
import { CategoryChips } from './ui/CategoryChips';
import { DateStepperRow } from './ui/DateStepperRow';
import { KindSegment } from './ui/KindSegment';
import { SaveFooter } from './ui/SaveFooter';

export function CreateTransactionPage() {
  const scheme = useColorScheme();
  const colors = getAppColors(scheme === 'dark');
  const ctx = useCreateTransaction();
  const { t } = useTranslation();

  return (
    <SafeAreaView
      style={[
        createTransactionStyles.screen,
        { backgroundColor: colors.background },
      ]}
      edges={['bottom']}
    >
      <KeyboardAvoidingView
        style={createTransactionStyles.scroll}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={createTransactionStyles.scrollContent}
        >
          <Text
            style={[
              createTransactionStyles.fieldLabel,
              { color: colors.tertiaryLabel },
            ]}
          >
            {t('create.kind')}
          </Text>
          <KindSegment kind={ctx.kind} onChange={ctx.setKind} colors={colors} />

          <Text
            style={[
              createTransactionStyles.fieldLabel,
              createTransactionStyles.fieldLabelSpaced,
              { color: colors.tertiaryLabel },
            ]}
          >
            {t('create.amount')}
          </Text>
          <AmountField
            value={ctx.amountText}
            onChange={ctx.setAmountText}
            colors={colors}
            currency={ctx.currency}
            locale={ctx.locale}
          />

          <Text
            style={[
              createTransactionStyles.fieldLabel,
              { color: colors.tertiaryLabel },
            ]}
          >
            {t('create.category')}
          </Text>
          <CategoryChips
            items={ctx.filteredCategories}
            selectedId={ctx.categoryId}
            onSelect={ctx.setCategoryId}
            colors={colors}
          />

          <Text
            style={[
              createTransactionStyles.fieldLabel,
              createTransactionStyles.fieldLabelSpaced,
              { color: colors.tertiaryLabel },
            ]}
          >
            {t('create.when')}
          </Text>
          <View
            style={[
              createTransactionStyles.group,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <DateStepperRow
              date={ctx.date}
              onPrev={() => ctx.shiftDate(-1)}
              onNext={() => ctx.shiftDate(1)}
              onToday={ctx.setDateToday}
              colors={colors}
            />
          </View>

          <Text
            style={[
              createTransactionStyles.fieldLabel,
              { color: colors.tertiaryLabel },
            ]}
          >
            {t('create.note')}
          </Text>
          <View
            style={[
              createTransactionStyles.group,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <TextInput
              value={ctx.note}
              onChangeText={ctx.setNote}
              placeholder={t('common.optional')}
              placeholderTextColor={colors.tertiaryLabel}
              multiline
              style={[createTransactionStyles.note, { color: colors.label }]}
            />
          </View>
        </ScrollView>

        <SaveFooter
          canSave={ctx.canSave}
          onSave={ctx.save}
          onDelete={ctx.onDelete}
          colors={colors}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

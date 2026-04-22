import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';

import type { AppColors } from '@/app/styles/theme';
import { useTranslation } from '@/shared/i18n';

import { formatLocalizedDate } from '../lib/dateOnly';
import { createTransactionStyles } from '../styles';

type Props = {
  date: Date;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
  colors: AppColors;
};

export function DateStepperRow({
  date,
  onPrev,
  onNext,
  onToday,
  colors,
}: Props) {
  const { t, i18n } = useTranslation();
  return (
    <View
      style={[createTransactionStyles.row, createTransactionStyles.rowPlain]}
    >
      <Text style={[createTransactionStyles.rowLabel, { color: colors.label }]}>
        {t('create.date')}
      </Text>
      <View style={createTransactionStyles.dateControls}>
        <Pressable
          onPress={onPrev}
          style={({ pressed }) => [
            createTransactionStyles.caretBtn,
            { backgroundColor: colors.fill, opacity: pressed ? 0.7 : 1 },
          ]}
        >
          <ChevronLeft size={16} color={colors.label} strokeWidth={1.75} />
        </Pressable>
        <Pressable onPress={onToday}>
          <Text
            style={[createTransactionStyles.rowValue, { color: colors.accent }]}
          >
            {formatLocalizedDate(date, i18n.language)}
          </Text>
        </Pressable>
        <Pressable
          onPress={onNext}
          style={({ pressed }) => [
            createTransactionStyles.caretBtn,
            { backgroundColor: colors.fill, opacity: pressed ? 0.7 : 1 },
          ]}
        >
          <ChevronRight size={16} color={colors.label} strokeWidth={1.75} />
        </Pressable>
      </View>
    </View>
  );
}

import { Pressable, Text, View } from 'react-native';

import type { AppColors } from '@/app/styles/theme';

import { formatRuDate } from '../lib/dateOnly';
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
  return (
    <View
      style={[createTransactionStyles.row, createTransactionStyles.rowPlain]}
    >
      <Text style={[createTransactionStyles.rowLabel, { color: colors.label }]}>
        Дата
      </Text>
      <View style={createTransactionStyles.dateControls}>
        <Pressable
          onPress={onPrev}
          style={({ pressed }) => [
            createTransactionStyles.caretBtn,
            { backgroundColor: colors.fill, opacity: pressed ? 0.7 : 1 },
          ]}
        >
          <Text
            style={[
              createTransactionStyles.caretGlyph,
              { color: colors.label },
            ]}
          >
            ‹
          </Text>
        </Pressable>
        <Pressable onPress={onToday}>
          <Text
            style={[createTransactionStyles.rowValue, { color: colors.accent }]}
          >
            {formatRuDate(date)}
          </Text>
        </Pressable>
        <Pressable
          onPress={onNext}
          style={({ pressed }) => [
            createTransactionStyles.caretBtn,
            { backgroundColor: colors.fill, opacity: pressed ? 0.7 : 1 },
          ]}
        >
          <Text
            style={[
              createTransactionStyles.caretGlyph,
              { color: colors.label },
            ]}
          >
            ›
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

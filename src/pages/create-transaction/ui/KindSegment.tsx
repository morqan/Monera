import { Pressable, Text, View } from 'react-native';

import type { AppColors } from '@/app/styles/theme';
import type { TransactionKind } from '@/entities/transaction';

import { createTransactionStyles } from '../styles';

type Props = {
  kind: TransactionKind;
  onChange: (k: TransactionKind) => void;
  colors: AppColors;
};

export function KindSegment({ kind, onChange, colors }: Props) {
  return (
    <View
      style={[
        createTransactionStyles.segment,
        { backgroundColor: colors.fill },
      ]}
    >
      {(
        [
          { key: 'income' as const, label: 'Доход' },
          { key: 'expense' as const, label: 'Расход' },
        ] as const
      ).map(({ key, label }) => {
        const active = kind === key;
        return (
          <Pressable
            key={key}
            onPress={() => onChange(key)}
            style={[
              createTransactionStyles.segmentItem,
              active
                ? { backgroundColor: colors.card }
                : createTransactionStyles.segmentItemInactive,
            ]}
          >
            <Text
              style={[
                createTransactionStyles.segmentLabel,
                { color: active ? colors.label : colors.secondaryLabel },
              ]}
            >
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

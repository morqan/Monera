import { Pressable, Text, View } from 'react-native';

import type { AppColors } from '@/app/styles/theme';
import { useCategoryName, type Category } from '@/entities/category';

import { createTransactionStyles } from '../styles';

type Props = {
  items: Category[];
  selectedId: string;
  onSelect: (id: string) => void;
  colors: AppColors;
};

export function CategoryChips({ items, selectedId, onSelect, colors }: Props) {
  const getName = useCategoryName();
  return (
    <View style={createTransactionStyles.chipRow}>
      {items.map((c) => {
        const active = c.id === selectedId;
        return (
          <Pressable
            key={c.id}
            onPress={() => onSelect(c.id)}
            style={[
              createTransactionStyles.chip,
              {
                backgroundColor: active ? colors.accent : colors.card,
                borderColor: active ? colors.accent : colors.border,
              },
            ]}
          >
            <Text
              style={[
                createTransactionStyles.chipLabel,
                { color: active ? colors.onAccent : colors.label },
              ]}
            >
              {getName(c)}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

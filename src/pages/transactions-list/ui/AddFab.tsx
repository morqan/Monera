import { Pressable, Text, useColorScheme } from 'react-native';

import { getGlassFabShadow, type AppColors } from '@/app/styles/theme';

import { transactionsListStyles } from '../styles';

type Props = {
  colors: AppColors;
  onPress: () => void;
};

export function AddFab({ colors, onPress }: Props) {
  const isDark = useColorScheme() === 'dark';
  const fabShadow = getGlassFabShadow(isDark);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        transactionsListStyles.fab,
        fabShadow,
        {
          backgroundColor: colors.accent,
          opacity: pressed ? 0.9 : 1,
          borderWidth: 1,
          borderColor: colors.fabRing,
        },
      ]}
      accessibilityRole="button"
      accessibilityLabel="Добавить операцию"
    >
      <Text
        style={[transactionsListStyles.fabLabel, { color: colors.onAccent }]}
      >
        +
      </Text>
    </Pressable>
  );
}

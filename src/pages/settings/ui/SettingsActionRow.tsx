import { Pressable, StyleSheet, Text, View } from 'react-native';

import { theme, type AppColors } from '@/app/styles/theme';

type Props = {
  colors: AppColors;
  label: string;
  onPress: () => void;
  showDivider?: boolean;
};

export function SettingsActionRow({
  colors,
  label,
  onPress,
  showDivider,
}: Props) {
  return (
    <>
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={label}
        style={({ pressed }) => [styles.row, { opacity: pressed ? 0.7 : 1 }]}
      >
        <Text style={[styles.label, { color: colors.accent }]}>{label}</Text>
      </Pressable>
      {showDivider ? (
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  row: {
    paddingHorizontal: theme.space.md,
    paddingVertical: theme.space.md - 2,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginLeft: theme.space.md,
  },
});

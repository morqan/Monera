import { StyleSheet, View } from 'react-native';

import { theme, type AppColors } from '@/app/styles/theme';
import { hexToRgba } from '@/shared/lib';

type Props = {
  colors: AppColors;
  length: number;
  filled: number;
  error?: boolean;
};

export function PinDots({ colors, length, filled, error }: Props) {
  const tint = error ? colors.expense : colors.label;
  return (
    <View style={styles.row}>
      {Array.from({ length }).map((_, i) => {
        const on = i < filled;
        return (
          <View
            key={i}
            style={[
              styles.dot,
              {
                backgroundColor: on ? tint : 'transparent',
                borderColor: on ? tint : hexToRgba(colors.label, 0.25),
              },
            ]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: theme.space.md,
    justifyContent: 'center',
  },
  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 1.5,
  },
});

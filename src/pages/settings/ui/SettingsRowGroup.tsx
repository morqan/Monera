import type { PropsWithChildren } from 'react';
import { StyleSheet, Text, View, type ViewStyle } from 'react-native';

import { theme, type AppColors } from '@/app/styles/theme';

type Props = PropsWithChildren<{
  colors: AppColors;
  title: string;
  shadow?: ViewStyle;
}>;

export function SettingsRowGroup({ colors, title, shadow, children }: Props) {
  return (
    <View style={styles.wrap}>
      <Text style={[styles.title, { color: colors.secondaryLabel }]}>
        {title.toUpperCase()}
      </Text>
      <View
        style={[
          styles.card,
          shadow,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
      >
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: theme.space.lg,
  },
  title: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.6,
    marginBottom: theme.space.xs,
    marginLeft: theme.space.sm,
  },
  card: {
    borderRadius: theme.radius.card,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
  },
});

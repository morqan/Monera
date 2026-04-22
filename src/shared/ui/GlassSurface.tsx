import type { PropsWithChildren } from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';

import type { AppColors } from '@/app/styles/theme';
import { hexToRgba } from '@/shared/lib';

type Variant = 'card' | 'row' | 'tile' | 'pill';

type Props = PropsWithChildren<{
  colors: AppColors;
  isDark: boolean;
  variant?: Variant;
  tint?: string;
  style?: ViewStyle | ViewStyle[];
  shadowStyle?: ViewStyle;
  borderRadius?: number;
}>;

export function GlassSurface({
  children,
  colors,
  variant = 'card',
  tint,
  style,
  shadowStyle,
  borderRadius,
}: Props) {
  const radius = borderRadius ?? RADIUS_BY_VARIANT[variant];

  return (
    <View style={[{ borderRadius: radius }, shadowStyle, style]}>
      <View
        style={[
          StyleSheet.absoluteFill,
          styles.clip,
          {
            borderRadius: radius,
            backgroundColor: tint ? hexToRgba(tint, 0.08) : colors.card,
            borderWidth: StyleSheet.hairlineWidth,
            borderColor: tint ? hexToRgba(tint, 0.22) : colors.border,
          },
        ]}
        pointerEvents="none"
      />
      {children}
    </View>
  );
}

const RADIUS_BY_VARIANT: Record<Variant, number> = {
  card: 16,
  row: 14,
  tile: 18,
  pill: 12,
};

const styles = StyleSheet.create({
  clip: {
    overflow: 'hidden',
  },
});

import type { PropsWithChildren } from 'react';
import { StyleSheet, View, useColorScheme } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

type Props = PropsWithChildren<{
  accent?: string;
}>;

export function GlassBackground({ children, accent }: Props) {
  const isDark = useColorScheme() === 'dark';

  const base = isDark ? ['#0A0A0F', '#0A0A0F'] : ['#FAFAFA', '#FAFAFA'];

  const ambientTint = accent ?? '#7C5CFF';
  const ambient = isDark
    ? [`${ambientTint}14`, 'transparent']
    : [`${ambientTint}0F`, 'transparent'];

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={base}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <LinearGradient
        colors={ambient}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 0.4 }}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});

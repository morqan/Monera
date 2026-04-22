import {
  Pressable,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import { getGlassRowShadow, theme, type AppColors } from '@/app/styles/theme';
import { useTranslation } from '@/shared/i18n';
import { formatMonthTitle, type MonthKey } from '@/shared/lib';
import { GlassSurface } from '@/shared/ui';

type Props = {
  colors: AppColors;
  monthKey: MonthKey;
  onPrev: () => void;
  onNext: () => void;
  onReset?: () => void;
};

export function MonthSwitcher({
  colors,
  monthKey,
  onPrev,
  onNext,
  onReset,
}: Props) {
  const isDark = useColorScheme() === 'dark';
  const shadow = getGlassRowShadow(isDark);
  const { t, i18n } = useTranslation();
  const title = capitalize(formatMonthTitle(monthKey, i18n.language));

  return (
    <GlassSurface
      colors={colors}
      isDark={isDark}
      variant="pill"
      shadowStyle={shadow}
      style={styles.shell}
    >
      <View style={styles.inner}>
        <Arrow
          colors={colors}
          onPress={onPrev}
          glyph="‹"
          a11y={t('transactions.prevMonth')}
        />
        <Pressable
          style={styles.titleWrap}
          onPress={onReset}
          disabled={!onReset}
          accessibilityRole="button"
          accessibilityLabel={t('transactions.currentMonth')}
        >
          <Text
            style={[styles.title, { color: colors.label }]}
            numberOfLines={1}
          >
            {title}
          </Text>
        </Pressable>
        <Arrow
          colors={colors}
          onPress={onNext}
          glyph="›"
          a11y={t('transactions.nextMonth')}
        />
      </View>
    </GlassSurface>
  );
}

function Arrow({
  colors,
  onPress,
  glyph,
  a11y,
}: {
  colors: AppColors;
  onPress: () => void;
  glyph: string;
  a11y: string;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={a11y}
      style={({ pressed }) => [
        styles.arrow,
        {
          backgroundColor: colors.fill,
          borderColor: colors.border,
          opacity: pressed ? 0.65 : 1,
        },
      ]}
      hitSlop={8}
    >
      <Text style={[styles.arrowGlyph, { color: colors.label }]}>{glyph}</Text>
    </Pressable>
  );
}

function capitalize(value: string) {
  if (!value) {
    return value;
  }
  return value.charAt(0).toUpperCase() + value.slice(1);
}

const styles = StyleSheet.create({
  shell: {
    marginBottom: theme.space.md,
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.space.sm,
    paddingHorizontal: theme.space.sm,
    paddingVertical: theme.space.xs + 2,
  },
  titleWrap: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  arrow: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
  },
  arrowGlyph: {
    fontSize: 18,
    fontWeight: '500',
    marginTop: -2,
  },
});

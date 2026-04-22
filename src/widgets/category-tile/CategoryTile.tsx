import {
  Pressable,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import { getGlassRowShadow, theme, type AppColors } from '@/app/styles/theme';
import { useCategoryName, type Category } from '@/entities/category';
import { hexToRgba } from '@/shared/lib';
import { GlassSurface } from '@/shared/ui';

type Props = {
  category: Category;
  amountLabel: string | null;
  count: number;
  colors: AppColors;
  onPress: () => void;
  onLongPress?: () => void;
};

export function CategoryTile({
  category,
  amountLabel,
  count,
  colors,
  onPress,
  onLongPress,
}: Props) {
  const isDark = useColorScheme() === 'dark';
  const shadow = getGlassRowShadow(isDark);
  const getName = useCategoryName();
  const accent = category.color ?? colors.accent;

  return (
    <View style={styles.wrap}>
      <GlassSurface
        colors={colors}
        isDark={isDark}
        variant="tile"
        shadowStyle={shadow}
        style={styles.shell}
      >
        <Pressable
          onPress={onPress}
          onLongPress={onLongPress}
          android_ripple={{ color: colors.fill }}
          style={({ pressed }) => [
            styles.inner,
            { opacity: pressed ? 0.92 : 1 },
          ]}
        >
          <View
            style={[
              styles.iconWrap,
              { backgroundColor: hexToRgba(accent, isDark ? 0.18 : 0.12) },
            ]}
          >
            <Text style={styles.iconGlyph}>{category.icon ?? '•'}</Text>
          </View>
          <Text
            style={[styles.name, { color: colors.label }]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {getName(category)}
          </Text>
          <Text
            style={[styles.amount, { color: colors.secondaryLabel }]}
            numberOfLines={1}
          >
            {amountLabel ?? '—'}
          </Text>
          {count > 0 ? (
            <View
              style={[
                styles.countBadge,
                { backgroundColor: hexToRgba(accent, isDark ? 0.22 : 0.14) },
              ]}
            >
              <Text style={[styles.countLabel, { color: accent }]}>
                {count}
              </Text>
            </View>
          ) : null}
        </Pressable>
      </GlassSurface>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexBasis: '31%',
    flexGrow: 0,
    minWidth: 100,
    aspectRatio: 1,
  },
  shell: {
    flex: 1,
  },
  inner: {
    flex: 1,
    padding: theme.space.md,
    justifyContent: 'space-between',
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconGlyph: {
    fontSize: 20,
  },
  name: {
    fontSize: 13,
    fontWeight: '500',
    letterSpacing: -0.1,
    marginTop: theme.space.sm,
  },
  amount: {
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: -0.2,
    marginTop: 2,
  },
  countBadge: {
    position: 'absolute',
    top: theme.space.sm,
    right: theme.space.sm,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 5,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countLabel: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0,
  },
});

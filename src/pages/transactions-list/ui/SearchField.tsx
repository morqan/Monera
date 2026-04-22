import { Search, X } from 'lucide-react-native';
import {
  Pressable,
  StyleSheet,
  TextInput,
  useColorScheme,
  View,
} from 'react-native';

import { theme, type AppColors } from '@/app/styles/theme';
import { useTranslation } from '@/shared/i18n';
import { GlassSurface } from '@/shared/ui';

type Props = {
  colors: AppColors;
  value: string;
  onChange: (value: string) => void;
};

export function SearchField({ colors, value, onChange }: Props) {
  const isDark = useColorScheme() === 'dark';
  const { t } = useTranslation();

  return (
    <GlassSurface
      colors={colors}
      isDark={isDark}
      variant="pill"
      style={styles.shell}
    >
      <View style={styles.row}>
        <Search size={16} color={colors.tertiaryLabel} strokeWidth={1.75} />
        <TextInput
          value={value}
          onChangeText={onChange}
          placeholder={t('transactions.searchPlaceholder')}
          placeholderTextColor={colors.tertiaryLabel}
          autoCorrect={false}
          autoCapitalize="none"
          returnKeyType="search"
          style={[styles.input, { color: colors.label }]}
          accessibilityLabel={t('transactions.searchPlaceholder')}
        />
        {value.length > 0 ? (
          <Pressable
            onPress={() => onChange('')}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel={t('common.cancel')}
          >
            <X size={14} color={colors.tertiaryLabel} strokeWidth={2} />
          </Pressable>
        ) : null}
      </View>
    </GlassSurface>
  );
}

const styles = StyleSheet.create({
  shell: {
    marginBottom: theme.space.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.space.md,
    paddingVertical: 8,
    gap: theme.space.sm,
  },
  input: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 2,
  },
});

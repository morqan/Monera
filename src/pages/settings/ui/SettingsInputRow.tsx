import { StyleSheet, Text, TextInput, View } from 'react-native';

import { theme, type AppColors } from '@/app/styles/theme';

type Props = {
  colors: AppColors;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  suffix?: string;
  keyboardType?: 'default' | 'decimal-pad' | 'numeric';
};

export function SettingsInputRow({
  colors,
  value,
  onChange,
  placeholder,
  suffix,
  keyboardType = 'decimal-pad',
}: Props) {
  return (
    <View style={styles.row}>
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={colors.tertiaryLabel}
        keyboardType={keyboardType}
        style={[styles.input, { color: colors.label }]}
      />
      {suffix ? (
        <Text style={[styles.suffix, { color: colors.secondaryLabel }]}>
          {suffix}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.space.md,
    paddingVertical: theme.space.sm + 2,
    gap: theme.space.sm,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    padding: 0,
  },
  suffix: {
    fontSize: 14,
    fontWeight: '600',
  },
});

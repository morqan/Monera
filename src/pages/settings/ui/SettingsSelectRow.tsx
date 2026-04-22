import { Pressable, StyleSheet, Text, View } from 'react-native';

import { theme, type AppColors } from '@/app/styles/theme';

type Option<V extends string> = {
  value: V;
  label: string;
};

type Props<V extends string> = {
  colors: AppColors;
  value: V;
  options: Option<V>[];
  onChange: (value: V) => void;
};

export function SettingsSelectRow<V extends string>({
  colors,
  value,
  options,
  onChange,
}: Props<V>) {
  return (
    <View style={styles.row}>
      {options.map((opt, idx) => {
        const active = opt.value === value;
        return (
          <Pressable
            key={opt.value}
            onPress={() => onChange(opt.value)}
            style={({ pressed }) => [
              styles.chip,
              {
                backgroundColor: active ? colors.accent : colors.fill,
                borderColor: active ? colors.accent : colors.border,
                opacity: pressed ? 0.85 : 1,
                marginRight: idx === options.length - 1 ? 0 : theme.space.xs,
              },
            ]}
          >
            <Text
              style={[
                styles.label,
                { color: active ? colors.onAccent : colors.label },
              ]}
              numberOfLines={1}
            >
              {opt.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: theme.space.sm,
    gap: theme.space.xs,
  },
  chip: {
    paddingHorizontal: theme.space.md,
    paddingVertical: theme.space.xs + 4,
    borderRadius: theme.radius.pill,
    borderWidth: StyleSheet.hairlineWidth,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
});

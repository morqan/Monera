import { StyleSheet, Switch, Text, View } from 'react-native';

import { theme, type AppColors } from '@/app/styles/theme';

type Props = {
  colors: AppColors;
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
  showDivider?: boolean;
  caption?: string;
};

export function SettingsToggleRow({
  colors,
  label,
  value,
  onChange,
  disabled,
  showDivider,
  caption,
}: Props) {
  return (
    <>
      <View style={styles.row}>
        <View style={styles.text}>
          <Text style={[styles.label, { color: colors.label }]}>{label}</Text>
          {caption ? (
            <Text
              style={[styles.caption, { color: colors.tertiaryLabel }]}
              numberOfLines={2}
            >
              {caption}
            </Text>
          ) : null}
        </View>
        <Switch
          value={value}
          onValueChange={onChange}
          disabled={disabled}
          trackColor={{ false: colors.fill, true: colors.accent }}
          ios_backgroundColor={colors.fill}
        />
      </View>
      {showDivider ? (
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
      ) : null}
    </>
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
  text: {
    flex: 1,
  },
  label: {
    fontSize: 15,
    fontWeight: '500',
  },
  caption: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginLeft: theme.space.md,
  },
});

import { Delete } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { theme, type AppColors } from '@/app/styles/theme';
import { hexToRgba } from '@/shared/lib';

type Props = {
  colors: AppColors;
  value: string;
  maxLength: number;
  onChange: (value: string) => void;
  biometryIcon?: React.ReactNode;
  onBiometryPress?: () => void;
};

const DIGITS = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

export function PinPad({
  colors,
  value,
  maxLength,
  onChange,
  biometryIcon,
  onBiometryPress,
}: Props) {
  const press = (digit: string) => {
    if (value.length >= maxLength) return;
    onChange(value + digit);
  };
  const backspace = () => {
    if (value.length === 0) return;
    onChange(value.slice(0, -1));
  };

  return (
    <View style={styles.pad}>
      {DIGITS.map((d) => (
        <PadButton key={d} label={d} colors={colors} onPress={() => press(d)} />
      ))}
      <View style={styles.slot}>
        {biometryIcon && onBiometryPress ? (
          <Pressable
            onPress={onBiometryPress}
            accessibilityRole="button"
            style={({ pressed }) => [
              styles.btn,
              {
                backgroundColor: pressed
                  ? hexToRgba(colors.label, 0.08)
                  : 'transparent',
              },
            ]}
          >
            {biometryIcon}
          </Pressable>
        ) : null}
      </View>
      <PadButton label="0" colors={colors} onPress={() => press('0')} />
      <View style={styles.slot}>
        <Pressable
          onPress={backspace}
          accessibilityRole="button"
          accessibilityLabel="Backspace"
          style={({ pressed }) => [
            styles.btn,
            {
              backgroundColor: pressed
                ? hexToRgba(colors.label, 0.08)
                : 'transparent',
            },
          ]}
        >
          <Delete size={22} color={colors.label} strokeWidth={1.8} />
        </Pressable>
      </View>
    </View>
  );
}

function PadButton({
  label,
  colors,
  onPress,
}: {
  label: string;
  colors: AppColors;
  onPress: () => void;
}) {
  return (
    <View style={styles.slot}>
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={label}
        style={({ pressed }) => [
          styles.btn,
          {
            backgroundColor: pressed
              ? hexToRgba(colors.label, 0.1)
              : hexToRgba(colors.label, 0.04),
          },
        ]}
      >
        <Text style={[styles.digit, { color: colors.label }]}>{label}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  pad: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    maxWidth: 320,
    alignSelf: 'center',
    gap: theme.space.md,
  },
  slot: {
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btn: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  digit: {
    fontSize: 28,
    fontWeight: '400',
    letterSpacing: -0.5,
  },
});

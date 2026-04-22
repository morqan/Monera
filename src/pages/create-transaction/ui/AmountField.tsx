import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { theme, type AppColors } from '@/app/styles/theme';
import { formatMoney } from '@/shared/lib';

import { evaluateExpression, hasOperators } from '../lib/evaluateExpression';
import { createTransactionStyles } from '../styles';

const OPERATORS = ['+', '−', '×', '÷'] as const;

type Props = {
  value: string;
  onChange: (value: string) => void;
  colors: AppColors;
  currency: string;
  locale: string;
};

export function AmountField({
  value,
  onChange,
  colors,
  currency,
  locale,
}: Props) {
  const preview = useMemo(() => {
    if (!hasOperators(value)) return null;
    const result = evaluateExpression(value);
    if (result == null || result <= 0) return null;
    return formatMoney(result, currency, locale);
  }, [value, currency, locale]);

  const append = (op: string) => {
    if (value.length === 0) return;
    const last = value[value.length - 1];
    if (last === '+' || last === '-' || last === '*' || last === '/') {
      onChange(value.slice(0, -1) + op);
      return;
    }
    onChange(value + op);
  };

  return (
    <View>
      <View
        style={[
          createTransactionStyles.group,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
      >
        <TextInput
          value={value}
          onChangeText={onChange}
          placeholder="0"
          placeholderTextColor={colors.tertiaryLabel}
          keyboardType="numbers-and-punctuation"
          style={[createTransactionStyles.input, { color: colors.label }]}
        />
      </View>
      <View style={styles.row}>
        <View style={styles.ops}>
          {OPERATORS.map((label) => (
            <Pressable
              key={label}
              onPress={() => {
                const symbol =
                  label === '−'
                    ? '-'
                    : label === '×'
                    ? '*'
                    : label === '÷'
                    ? '/'
                    : '+';
                append(symbol);
              }}
              accessibilityRole="button"
              accessibilityLabel={label}
              style={({ pressed }) => [
                styles.opChip,
                {
                  backgroundColor: colors.fill,
                  borderColor: colors.border,
                  opacity: pressed ? 0.7 : 1,
                },
              ]}
            >
              <Text style={[styles.opLabel, { color: colors.label }]}>
                {label}
              </Text>
            </Pressable>
          ))}
        </View>
        {preview ? (
          <Text style={[styles.preview, { color: colors.secondaryLabel }]}>
            = {preview}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: theme.space.xs,
    gap: theme.space.sm,
  },
  ops: {
    flexDirection: 'row',
    gap: 6,
  },
  opChip: {
    width: 36,
    height: 32,
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
  },
  opLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  preview: {
    fontSize: 14,
    fontWeight: '600',
    flexShrink: 1,
  },
});

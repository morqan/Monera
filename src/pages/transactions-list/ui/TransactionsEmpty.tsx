import { Pressable, Text, useColorScheme, View } from 'react-native';

import { getGlassPanelShadow, type AppColors } from '@/app/styles/theme';

import { transactionsListStyles } from '../styles';

type Props = {
  colors: AppColors;
  variant: 'all' | 'filtered';
  onCreate: () => void;
  onResetFilter?: () => void;
};

const EMPTY_CONTENT = {
  all: {
    glyph: '✦',
    title: 'Начните учёт',
    subtitle:
      'Добавьте первую операцию — доход или расход. Всё хранится на устройстве.',
    ctaLabel: 'Новая операция',
  },
  filtered: {
    glyph: '0',
    title: 'Ничего не найдено',
    subtitle:
      'По выбранному фильтру операций пока нет. Попробуйте показать все записи.',
    ctaLabel: 'Сбросить фильтр',
  },
} as const;

export function TransactionsEmpty({
  colors,
  variant,
  onCreate,
  onResetFilter,
}: Props) {
  const isDark = useColorScheme() === 'dark';
  const panelShadow = getGlassPanelShadow(isDark);
  const content = EMPTY_CONTENT[variant];
  const action = variant === 'filtered' ? onResetFilter : onCreate;

  return (
    <View style={transactionsListStyles.empty}>
      <View
        style={[
          transactionsListStyles.emptyCard,
          panelShadow,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
          },
        ]}
      >
        <View
          style={[
            transactionsListStyles.emptyIcon,
            { backgroundColor: colors.fill },
          ]}
        >
          <Text
            style={[
              transactionsListStyles.emptyGlyph,
              { color: colors.accent },
            ]}
          >
            {content.glyph}
          </Text>
        </View>
        <Text
          style={[transactionsListStyles.emptyTitle, { color: colors.label }]}
        >
          {content.title}
        </Text>
        <Text
          style={[
            transactionsListStyles.emptySubtitle,
            { color: colors.secondaryLabel },
          ]}
        >
          {content.subtitle}
        </Text>
        {action ? (
          <Pressable
            onPress={action}
            style={({ pressed }) => [
              transactionsListStyles.emptyCta,
              {
                backgroundColor: colors.accent,
                opacity: pressed ? 0.85 : 1,
                borderWidth: 1,
                borderColor: colors.fabRing,
              },
            ]}
          >
            <Text
              style={[
                transactionsListStyles.emptyCtaLabel,
                { color: colors.onAccent },
              ]}
            >
              {content.ctaLabel}
            </Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

import {
  CalendarDays,
  Search,
  Sparkles,
  type LucideIcon,
} from 'lucide-react-native';
import { Pressable, Text, useColorScheme, View } from 'react-native';

import { getGlassPanelShadow, type AppColors } from '@/app/styles/theme';
import { useTranslation } from '@/shared/i18n';

import { transactionsListStyles } from '../styles';

type Props = {
  colors: AppColors;
  variant: 'all' | 'filtered' | 'month';
  onCreate: () => void;
  onResetFilter?: () => void;
};

const EMPTY_META: Record<
  'all' | 'filtered' | 'month',
  {
    Icon: LucideIcon;
    titleKey: string;
    subtitleKey: string;
    ctaKey: string;
  }
> = {
  all: {
    Icon: Sparkles,
    titleKey: 'transactions.emptyAllTitle',
    subtitleKey: 'transactions.emptyAllSubtitle',
    ctaKey: 'transactions.emptyAllCta',
  },
  filtered: {
    Icon: Search,
    titleKey: 'transactions.emptyFilteredTitle',
    subtitleKey: 'transactions.emptyFilteredSubtitle',
    ctaKey: 'transactions.emptyFilteredCta',
  },
  month: {
    Icon: CalendarDays,
    titleKey: 'transactions.emptyMonthTitle',
    subtitleKey: 'transactions.emptyMonthSubtitle',
    ctaKey: 'transactions.emptyMonthCta',
  },
};

export function TransactionsEmpty({
  colors,
  variant,
  onCreate,
  onResetFilter,
}: Props) {
  const isDark = useColorScheme() === 'dark';
  const panelShadow = getGlassPanelShadow(isDark);
  const meta = EMPTY_META[variant];
  const action = variant === 'filtered' ? onResetFilter : onCreate;
  const { t } = useTranslation();
  const Icon = meta.Icon;

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
          <Icon size={28} color={colors.accent} strokeWidth={2} />
        </View>
        <Text
          style={[transactionsListStyles.emptyTitle, { color: colors.label }]}
        >
          {t(meta.titleKey)}
        </Text>
        <Text
          style={[
            transactionsListStyles.emptySubtitle,
            { color: colors.secondaryLabel },
          ]}
        >
          {t(meta.subtitleKey)}
        </Text>
        {action ? (
          <Pressable
            onPress={action}
            accessibilityRole="button"
            accessibilityLabel={t(meta.ctaKey)}
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
              {t(meta.ctaKey)}
            </Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

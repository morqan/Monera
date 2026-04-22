import { CalendarRange, ChevronLeft, ChevronRight } from 'lucide-react-native';
import { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import { getGlassRowShadow, theme, type AppColors } from '@/app/styles/theme';
import { useTranslation } from '@/shared/i18n';
import {
  formatRangeTitle,
  isCurrentRange,
  type DateRange,
  type RangePreset,
} from '@/shared/lib';
import { GlassSurface } from '@/shared/ui';

import { CalendarModal } from './CalendarModal';

type Props = {
  colors: AppColors;
  range: DateRange;
  onPrev: () => void;
  onNext: () => void;
  onReset?: () => void;
  onPresetChange: (preset: RangePreset) => void;
  onCustomRange: (range: DateRange) => void;
};

const PRESETS: RangePreset[] = ['day', 'week', 'month'];

export function RangePicker({
  colors,
  range,
  onPrev,
  onNext,
  onReset,
  onPresetChange,
  onCustomRange,
}: Props) {
  const isDark = useColorScheme() === 'dark';
  const shadow = getGlassRowShadow(isDark);
  const { t, i18n } = useTranslation();
  const [calendarOpen, setCalendarOpen] = useState(false);

  const title = formatRangeTitle(range, i18n.language);
  const resetDisabled = !onReset || isCurrentRange(range);

  return (
    <View style={styles.wrap}>
      <View style={styles.presetRow}>
        {PRESETS.map((preset) => {
          const active = range.preset === preset;
          return (
            <Pressable
              key={preset}
              onPress={() => onPresetChange(preset)}
              style={({ pressed }) => [
                styles.chip,
                {
                  backgroundColor: active ? colors.accent : colors.fill,
                  borderColor: active ? colors.accent : colors.border,
                  opacity: pressed ? 0.8 : 1,
                },
              ]}
            >
              <Text
                style={[
                  styles.chipLabel,
                  { color: active ? colors.onAccent : colors.label },
                ]}
              >
                {t(presetKey(preset))}
              </Text>
            </Pressable>
          );
        })}
        <Pressable
          onPress={() => setCalendarOpen(true)}
          accessibilityRole="button"
          accessibilityLabel={t('transactions.pickDate')}
          style={({ pressed }) => [
            styles.calendarBtn,
            {
              backgroundColor:
                range.preset === 'custom' ? colors.accent : colors.fill,
              borderColor:
                range.preset === 'custom' ? colors.accent : colors.border,
              opacity: pressed ? 0.8 : 1,
            },
          ]}
        >
          <CalendarRange
            size={16}
            color={range.preset === 'custom' ? colors.onAccent : colors.label}
            strokeWidth={1.75}
          />
        </Pressable>
      </View>

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
            direction="prev"
            a11y={t('transactions.prevRange')}
          />
          <Pressable
            style={styles.titleWrap}
            onPress={onReset}
            disabled={resetDisabled}
            accessibilityRole="button"
            accessibilityLabel={t('transactions.currentRange')}
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
            direction="next"
            a11y={t('transactions.nextRange')}
          />
        </View>
      </GlassSurface>

      <CalendarModal
        visible={calendarOpen}
        colors={colors}
        initial={range}
        onClose={() => setCalendarOpen(false)}
        onApply={onCustomRange}
      />
    </View>
  );
}

function presetKey(preset: RangePreset): string {
  if (preset === 'day') return 'transactions.presetDay';
  if (preset === 'week') return 'transactions.presetWeek';
  return 'transactions.presetMonth';
}

function Arrow({
  colors,
  onPress,
  direction,
  a11y,
}: {
  colors: AppColors;
  onPress: () => void;
  direction: 'prev' | 'next';
  a11y: string;
}) {
  const Icon = direction === 'prev' ? ChevronLeft : ChevronRight;
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
      <Icon size={18} color={colors.label} strokeWidth={1.75} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: theme.space.md,
  },
  presetRow: {
    flexDirection: 'row',
    gap: theme.space.xs,
    marginBottom: theme.space.sm,
  },
  chip: {
    flex: 1,
    minHeight: 30,
    borderRadius: theme.radius.pill,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.space.sm,
  },
  chipLabel: {
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: -0.1,
  },
  calendarBtn: {
    width: 34,
    height: 30,
    borderRadius: theme.radius.pill,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shell: {},
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
    fontSize: 14,
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
});

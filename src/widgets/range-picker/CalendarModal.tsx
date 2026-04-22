import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import { Calendar, type DateData } from 'react-native-calendars';

import { getGlassPanelShadow, theme, type AppColors } from '@/app/styles/theme';
import { useTranslation } from '@/shared/i18n';
import { customRange, todayISODate, type DateRange } from '@/shared/lib';

type Props = {
  visible: boolean;
  colors: AppColors;
  initial: DateRange;
  onClose: () => void;
  onApply: (range: DateRange) => void;
};

export function CalendarModal({
  visible,
  colors,
  initial,
  onClose,
  onApply,
}: Props) {
  const { t } = useTranslation();
  const isDark = useColorScheme() === 'dark';
  const shadow = getGlassPanelShadow(isDark);
  const [start, setStart] = useState<string>(initial.start);
  const [end, setEnd] = useState<string>(initial.end);

  const markedDates = useMemo(() => {
    const marks: Record<string, object> = {};
    const [lo, hi] = start <= end ? [start, end] : [end, start];
    const loDate = new Date(lo);
    const hiDate = new Date(hi);
    const cursor = new Date(loDate);
    while (cursor <= hiDate) {
      const iso = cursor.toISOString().slice(0, 10);
      marks[iso] = {
        startingDay: iso === lo,
        endingDay: iso === hi,
        color: colors.accent,
        textColor: colors.onAccent,
      };
      cursor.setDate(cursor.getDate() + 1);
    }
    return marks;
  }, [start, end, colors.accent, colors.onAccent]);

  const handleDayPress = (day: DateData) => {
    if (!start || (start && end && start !== end)) {
      setStart(day.dateString);
      setEnd(day.dateString);
      return;
    }
    if (day.dateString < start) {
      setStart(day.dateString);
    } else {
      setEnd(day.dateString);
    }
  };

  const handleApply = () => {
    onApply(customRange(start, end));
    onClose();
  };

  const calendarTheme = useMemo(
    () => ({
      backgroundColor: 'transparent',
      calendarBackground: 'transparent',
      textSectionTitleColor: colors.secondaryLabel,
      dayTextColor: colors.label,
      monthTextColor: colors.label,
      todayTextColor: colors.accent,
      selectedDayBackgroundColor: colors.accent,
      selectedDayTextColor: colors.onAccent,
      arrowColor: colors.accent,
      textDisabledColor: colors.tertiaryLabel,
      textDayFontWeight: '500' as const,
      textMonthFontWeight: '600' as const,
      textDayHeaderFontWeight: '500' as const,
      textDayFontSize: 14,
      textMonthFontSize: 15,
      textDayHeaderFontSize: 11,
    }),
    [colors]
  );

  const renderArrow = (direction: 'left' | 'right') => {
    const Icon = direction === 'left' ? ChevronLeft : ChevronRight;
    return <Icon size={18} color={colors.accent} strokeWidth={1.75} />;
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable
          onPress={(e) => e.stopPropagation()}
          style={[
            styles.sheet,
            shadow,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.label }]}>
              {t('transactions.calendarTitle')}
            </Text>
          </View>
          <View style={styles.rangeRow}>
            <RangeCell
              label={t('transactions.calendarStart')}
              value={start}
              colors={colors}
            />
            <Text style={[styles.dash, { color: colors.tertiaryLabel }]}>
              –
            </Text>
            <RangeCell
              label={t('transactions.calendarEnd')}
              value={end}
              colors={colors}
            />
          </View>
          <Calendar
            current={start}
            maxDate={todayISODate()}
            markingType="period"
            markedDates={markedDates}
            onDayPress={handleDayPress}
            firstDay={1}
            theme={calendarTheme}
            renderArrow={renderArrow}
            style={styles.calendar}
          />
          <View style={styles.actions}>
            <Pressable
              onPress={onClose}
              style={({ pressed }) => [
                styles.actionBtn,
                styles.ghostBtn,
                {
                  backgroundColor: colors.fill,
                  borderColor: colors.border,
                  opacity: pressed ? 0.75 : 1,
                },
              ]}
            >
              <Text style={[styles.actionLabel, { color: colors.label }]}>
                {t('common.cancel')}
              </Text>
            </Pressable>
            <Pressable
              onPress={handleApply}
              style={({ pressed }) => [
                styles.actionBtn,
                {
                  backgroundColor: colors.accent,
                  opacity: pressed ? 0.88 : 1,
                },
              ]}
            >
              <Text style={[styles.actionLabel, { color: colors.onAccent }]}>
                {t('transactions.calendarApply')}
              </Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

function RangeCell({
  label,
  value,
  colors,
}: {
  label: string;
  value: string;
  colors: AppColors;
}) {
  return (
    <View style={styles.rangeCell}>
      <Text style={[styles.rangeLabel, { color: colors.secondaryLabel }]}>
        {label}
      </Text>
      <Text style={[styles.rangeValue, { color: colors.label }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.space.lg,
  },
  sheet: {
    width: '100%',
    maxWidth: 380,
    borderRadius: theme.radius.card,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: theme.space.md,
    paddingTop: theme.space.md,
    paddingBottom: theme.space.md,
  },
  header: {
    paddingBottom: theme.space.sm,
    alignItems: 'center',
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  rangeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: theme.space.sm,
    gap: theme.space.sm,
  },
  rangeCell: {
    flex: 1,
  },
  rangeLabel: {
    fontSize: 10,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  rangeValue: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 2,
    letterSpacing: -0.1,
  },
  dash: {
    fontSize: 16,
    marginTop: 12,
  },
  calendar: {
    paddingBottom: theme.space.sm,
    marginHorizontal: -theme.space.xs,
  },
  actions: {
    flexDirection: 'row',
    gap: theme.space.sm,
    marginTop: theme.space.sm,
  },
  actionBtn: {
    flex: 1,
    minHeight: 40,
    borderRadius: theme.radius.button,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ghostBtn: {
    borderWidth: StyleSheet.hairlineWidth,
  },
  actionLabel: {
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: -0.1,
  },
});

import { useMemo, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { Calendar, type DateData } from 'react-native-calendars';
import { SafeAreaView } from 'react-native-safe-area-context';

import { theme, type AppColors } from '@/app/styles/theme';
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
      const isStart = iso === lo;
      const isEnd = iso === hi;
      marks[iso] = {
        startingDay: isStart,
        endingDay: isEnd,
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

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose} />
      <SafeAreaView
        style={[
          styles.sheet,
          {
            backgroundColor: colors.background,
            borderColor: colors.border,
          },
        ]}
        edges={['bottom']}
      >
        <View style={styles.header}>
          <Pressable onPress={onClose} hitSlop={10}>
            <Text style={[styles.cancel, { color: colors.secondaryLabel }]}>
              {t('common.cancel')}
            </Text>
          </Pressable>
          <Text style={[styles.title, { color: colors.label }]}>
            {t('transactions.calendarTitle')}
          </Text>
          <Pressable onPress={handleApply} hitSlop={10}>
            <Text style={[styles.apply, { color: colors.accent }]}>
              {t('transactions.calendarApply')}
            </Text>
          </Pressable>
        </View>
        <View style={styles.rangeRow}>
          <RangeCell
            label={t('transactions.calendarStart')}
            value={start}
            colors={colors}
          />
          <Text style={[styles.dash, { color: colors.tertiaryLabel }]}>–</Text>
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
          style={styles.calendar}
        />
      </SafeAreaView>
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
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  sheet: {
    borderTopLeftRadius: theme.radius.card,
    borderTopRightRadius: theme.radius.card,
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingBottom: theme.space.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.space.md,
    paddingVertical: theme.space.md,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  cancel: {
    fontSize: 14,
    fontWeight: '500',
  },
  apply: {
    fontSize: 14,
    fontWeight: '600',
  },
  rangeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.space.md,
    paddingBottom: theme.space.sm,
    gap: theme.space.sm,
  },
  rangeCell: {
    flex: 1,
  },
  rangeLabel: {
    fontSize: 11,
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
    marginTop: 14,
  },
  calendar: {
    paddingBottom: theme.space.md,
  },
});

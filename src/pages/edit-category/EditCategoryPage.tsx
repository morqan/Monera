import { useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAppSelector } from '@/app/store';
import { getAppColors, theme } from '@/app/styles/theme';
import type { TransactionKind } from '@/entities/transaction';
import { useTranslation } from '@/shared/i18n';
import { CategoryIcon, GlassBackground } from '@/shared/ui';

import { COLOR_PRESETS, ICON_GROUPS } from './lib/presets';
import { useEditCategory } from './model/useEditCategory';

const ICON_COLUMNS = 6;
const COLOR_COLUMNS = 8;
const ICON_SLOT_WIDTH = `${100 / ICON_COLUMNS}%` as const;
const COLOR_SLOT_WIDTH = `${100 / COLOR_COLUMNS}%` as const;

export function EditCategoryPage() {
  const scheme = useColorScheme();
  const colors = getAppColors(scheme === 'dark');
  const { t } = useTranslation();
  const currency = useAppSelector((s) => s.settings.currencyCode);
  const {
    budgetText,
    canSave,
    color,
    icon,
    isBuiltIn,
    kind,
    name,
    onDelete,
    save,
    setBudgetText,
    setColor,
    setIcon,
    setKind,
    setName,
  } = useEditCategory();

  const initialGroupIdx = useMemo(() => {
    const idx = ICON_GROUPS.findIndex((g) =>
      g.icons.some((name) => name === icon)
    );
    return idx >= 0 ? idx : 0;
  }, [icon]);
  const [groupIdx, setGroupIdx] = useState(initialGroupIdx);
  const currentGroup = ICON_GROUPS[groupIdx];

  return (
    <GlassBackground accent={color}>
      <SafeAreaView style={styles.screen} edges={['bottom']}>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.content}
          >
            <Text style={[styles.label, { color: colors.tertiaryLabel }]}>
              {t('category.nameLabel')}
            </Text>
            <View
              style={[
                styles.group,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
            >
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder={t('category.namePlaceholder')}
                placeholderTextColor={colors.tertiaryLabel}
                editable={!isBuiltIn}
                style={[styles.input, { color: colors.label }]}
              />
            </View>

            <Text
              style={[
                styles.label,
                styles.labelSpaced,
                { color: colors.tertiaryLabel },
              ]}
            >
              {t('category.kindLabel')}
            </Text>
            <KindSegment kind={kind} onChange={setKind} colors={colors} />

            <Text
              style={[
                styles.label,
                styles.labelSpaced,
                { color: colors.tertiaryLabel },
              ]}
            >
              {t('category.iconLabel')}
            </Text>
            <View
              style={[
                styles.iconCard,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                },
              ]}
            >
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.tabsRow}
              >
                {ICON_GROUPS.map((group, idx) => {
                  const active = idx === groupIdx;
                  return (
                    <Pressable
                      key={group.key}
                      onPress={() => setGroupIdx(idx)}
                      style={({ pressed }) => [
                        styles.tab,
                        {
                          backgroundColor: active ? colors.accent : colors.fill,
                          opacity: pressed ? 0.85 : 1,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.tabLabel,
                          {
                            color: active
                              ? colors.onAccent
                              : colors.secondaryLabel,
                          },
                        ]}
                      >
                        {t(`category.iconGroup.${group.key}` as never)}
                      </Text>
                    </Pressable>
                  );
                })}
              </ScrollView>
              <ScrollView
                style={styles.iconScroll}
                contentContainerStyle={styles.iconGrid}
                showsVerticalScrollIndicator={false}
                nestedScrollEnabled
              >
                {currentGroup.icons.map((g) => {
                  const active = g === icon;
                  return (
                    <View key={g} style={styles.iconSlot}>
                      <Pressable
                        onPress={() => setIcon(g)}
                        style={({ pressed }) => [
                          styles.iconCell,
                          {
                            backgroundColor: active
                              ? colors.accent
                              : colors.fill,
                            borderColor: active ? colors.accent : colors.border,
                            opacity: pressed ? 0.85 : 1,
                          },
                        ]}
                      >
                        <CategoryIcon
                          icon={g}
                          size={20}
                          color={active ? colors.onAccent : colors.label}
                        />
                      </Pressable>
                    </View>
                  );
                })}
              </ScrollView>
            </View>

            {kind === 'expense' ? (
              <>
                <Text
                  style={[
                    styles.label,
                    styles.labelSpaced,
                    { color: colors.tertiaryLabel },
                  ]}
                >
                  {t('category.budgetLabel')}
                </Text>
                <View
                  style={[
                    styles.group,
                    styles.budgetRow,
                    {
                      backgroundColor: colors.card,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <TextInput
                    value={budgetText}
                    onChangeText={setBudgetText}
                    placeholder={t('category.budgetPlaceholder')}
                    placeholderTextColor={colors.tertiaryLabel}
                    keyboardType="decimal-pad"
                    style={[
                      styles.input,
                      styles.budgetInput,
                      { color: colors.label },
                    ]}
                  />
                  <Text
                    style={[
                      styles.budgetCurrency,
                      { color: colors.secondaryLabel },
                    ]}
                  >
                    {currency}
                  </Text>
                </View>
              </>
            ) : null}

            <Text
              style={[
                styles.label,
                styles.labelSpaced,
                { color: colors.tertiaryLabel },
              ]}
            >
              {t('category.colorLabel')}
            </Text>
            <View style={styles.colorGrid}>
              {COLOR_PRESETS.map((c) => {
                const active = c === color;
                return (
                  <View key={c} style={styles.colorSlot}>
                    <Pressable
                      onPress={() => setColor(c)}
                      style={({ pressed }) => [
                        styles.colorCell,
                        {
                          backgroundColor: c,
                          borderColor: active ? colors.label : 'transparent',
                          opacity: pressed ? 0.85 : 1,
                        },
                      ]}
                    />
                  </View>
                );
              })}
            </View>
          </ScrollView>

          <View
            style={[
              styles.footer,
              {
                borderTopColor: colors.border,
                backgroundColor: colors.background,
              },
            ]}
          >
            {onDelete ? (
              <Pressable onPress={onDelete} style={styles.deleteRow}>
                <Text style={[styles.deleteLabel, { color: colors.danger }]}>
                  {t('common.delete')}
                </Text>
              </Pressable>
            ) : null}
            <Pressable
              disabled={!canSave}
              onPress={save}
              style={({ pressed }) => [
                styles.save,
                {
                  backgroundColor: canSave ? colors.accent : colors.fill,
                  opacity: pressed ? 0.9 : 1,
                },
              ]}
            >
              <Text
                style={[
                  styles.saveLabel,
                  { color: canSave ? colors.onAccent : colors.tertiaryLabel },
                ]}
              >
                {t('common.save')}
              </Text>
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </GlassBackground>
  );
}

function KindSegment({
  kind,
  onChange,
  colors,
}: {
  kind: TransactionKind;
  onChange: (k: TransactionKind) => void;
  colors: ReturnType<typeof getAppColors>;
}) {
  const { t } = useTranslation();
  const options: Array<{ key: TransactionKind; label: string }> = [
    { key: 'expense', label: t('create.kindExpense') },
    { key: 'income', label: t('create.kindIncome') },
  ];
  return (
    <View style={[styles.segment, { backgroundColor: colors.fill }]}>
      {options.map(({ key, label }) => {
        const active = kind === key;
        return (
          <Pressable
            key={key}
            onPress={() => onChange(key)}
            style={[
              styles.segmentItem,
              active && { backgroundColor: colors.card },
            ]}
          >
            <Text
              style={[
                styles.segmentLabel,
                { color: active ? colors.label : colors.secondaryLabel },
              ]}
            >
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  flex: { flex: 1 },
  content: {
    paddingHorizontal: theme.space.md,
    paddingTop: theme.space.md,
    paddingBottom: 120,
  },
  label: {
    fontSize: 11,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginBottom: theme.space.sm,
    marginLeft: 4,
  },
  labelSpaced: { marginTop: theme.space.md },
  group: {
    borderRadius: theme.radius.card,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
  },
  input: {
    fontSize: 15,
    paddingHorizontal: theme.space.md,
    paddingVertical: 12,
  },
  budgetRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  budgetInput: {
    flex: 1,
  },
  budgetCurrency: {
    paddingRight: theme.space.md,
    fontSize: 13,
    fontWeight: '600',
  },
  segment: {
    flexDirection: 'row',
    borderRadius: theme.radius.pill,
    padding: 3,
    gap: 3,
  },
  segmentItem: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: theme.radius.pill - 2,
    alignItems: 'center',
  },
  segmentLabel: {
    fontSize: 13,
    fontWeight: '500',
  },
  iconCard: {
    borderRadius: theme.radius.card,
    borderWidth: StyleSheet.hairlineWidth,
    paddingVertical: theme.space.sm,
  },
  tabsRow: {
    paddingHorizontal: theme.space.sm,
    gap: theme.space.xs,
    paddingBottom: theme.space.sm,
  },
  tab: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: theme.radius.pill,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  iconScroll: {
    maxHeight: 240,
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: theme.space.xs,
    paddingBottom: theme.space.xs,
  },
  iconSlot: {
    width: ICON_SLOT_WIDTH,
    aspectRatio: 1,
    padding: 4,
  },
  iconCell: {
    flex: 1,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  colorSlot: {
    width: COLOR_SLOT_WIDTH,
    aspectRatio: 1,
    padding: 4,
  },
  colorCell: {
    flex: 1,
    borderRadius: 999,
    borderWidth: 2,
  },
  footer: {
    paddingHorizontal: theme.space.md,
    paddingVertical: theme.space.md,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  deleteRow: {
    alignItems: 'center',
    paddingBottom: theme.space.sm,
  },
  deleteLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  save: {
    borderRadius: theme.radius.button,
    paddingVertical: 14,
    alignItems: 'center',
  },
  saveLabel: {
    fontSize: 15,
    fontWeight: '600',
  },
});

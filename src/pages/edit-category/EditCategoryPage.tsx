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

import { getAppColors, theme } from '@/app/styles/theme';
import type { TransactionKind } from '@/entities/transaction';
import { useTranslation } from '@/shared/i18n';
import { GlassBackground } from '@/shared/ui';

import { COLOR_PRESETS, ICON_PRESETS } from './lib/presets';
import { useEditCategory } from './model/useEditCategory';

export function EditCategoryPage() {
  const scheme = useColorScheme();
  const colors = getAppColors(scheme === 'dark');
  const { t } = useTranslation();
  const {
    canSave,
    color,
    icon,
    isBuiltIn,
    kind,
    name,
    onDelete,
    save,
    setColor,
    setIcon,
    setKind,
    setName,
  } = useEditCategory();

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
            <View style={styles.iconGrid}>
              {ICON_PRESETS.map((g) => {
                const active = g === icon;
                return (
                  <Pressable
                    key={g}
                    onPress={() => setIcon(g)}
                    style={({ pressed }) => [
                      styles.iconCell,
                      {
                        backgroundColor: active ? colors.accent : colors.card,
                        borderColor: active ? colors.accent : colors.border,
                        opacity: pressed ? 0.85 : 1,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.iconGlyph,
                        { color: active ? colors.onAccent : colors.label },
                      ]}
                    >
                      {g}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <Text
              style={[
                styles.label,
                styles.labelSpaced,
                { color: colors.tertiaryLabel },
              ]}
            >
              {t('category.colorLabel')}
            </Text>
            <View style={styles.colorRow}>
              {COLOR_PRESETS.map((c) => {
                const active = c === color;
                return (
                  <Pressable
                    key={c}
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
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.space.sm,
  },
  iconCell: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
  },
  iconGlyph: {
    fontSize: 20,
  },
  colorRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.space.sm,
  },
  colorCell: {
    width: 34,
    height: 34,
    borderRadius: 17,
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

import { X } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
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
import { useAppDispatch, useAppSelector } from '@/app/store';
import { mergeTransactions } from '@/entities/transaction';
import { useTranslation } from '@/shared/i18n';
import { parseImport, type ImportParseOutcome } from '@/shared/lib';

type Props = {
  visible: boolean;
  onClose: () => void;
};

export function ImportDataModal({ visible, onClose }: Props) {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const colors = getAppColors(isDark);
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const categories = useAppSelector((s) => s.categories.items);
  const existing = useAppSelector((s) => s.transactions.items);

  const [raw, setRaw] = useState('');

  const outcome: ImportParseOutcome | null = useMemo(() => {
    if (raw.trim().length === 0) return null;
    return parseImport(raw, categories);
  }, [raw, categories]);

  const { toAdd, duplicates } = useMemo(() => {
    if (!outcome || !outcome.ok) return { toAdd: 0, duplicates: 0 };
    const existingIds = new Set(existing.map((t) => t.id));
    let dup = 0;
    let add = 0;
    for (const tx of outcome.result.candidates) {
      if (existingIds.has(tx.id)) dup++;
      else add++;
    }
    return { toAdd: add, duplicates: dup };
  }, [outcome, existing]);

  const handleClose = () => {
    setRaw('');
    onClose();
  };

  const handleApply = () => {
    if (!outcome || !outcome.ok) return;
    dispatch(mergeTransactions(outcome.result.candidates));
    handleClose();
  };

  const canApply = outcome?.ok === true && toAdd > 0;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <SafeAreaView
        style={[styles.root, { backgroundColor: colors.background }]}
        edges={['top', 'bottom']}
      >
        <View style={styles.topBar}>
          <Text style={[styles.topTitle, { color: colors.label }]}>
            {t('import.title')}
          </Text>
          <Pressable
            onPress={handleClose}
            accessibilityRole="button"
            accessibilityLabel={t('common.close')}
            hitSlop={10}
          >
            <X size={22} color={colors.label} strokeWidth={1.8} />
          </Pressable>
        </View>
        <KeyboardAvoidingView
          style={styles.body}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView contentContainerStyle={styles.content}>
            <Text style={[styles.hint, { color: colors.secondaryLabel }]}>
              {t('import.hint')}
            </Text>
            <TextInput
              value={raw}
              onChangeText={setRaw}
              placeholder={t('import.placeholder')}
              placeholderTextColor={colors.tertiaryLabel}
              multiline
              textAlignVertical="top"
              autoCapitalize="none"
              autoCorrect={false}
              style={[
                styles.input,
                {
                  color: colors.label,
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                },
              ]}
            />
            {outcome ? (
              outcome.ok ? (
                <View
                  style={[
                    styles.summary,
                    {
                      borderColor: colors.border,
                      backgroundColor: colors.card,
                    },
                  ]}
                >
                  <Text style={[styles.summaryLine, { color: colors.label }]}>
                    {t('import.summaryFormat', {
                      format: outcome.result.format.toUpperCase(),
                    })}
                  </Text>
                  <Text style={[styles.summaryLine, { color: colors.label }]}>
                    {t('import.summaryAdd', { count: String(toAdd) })}
                  </Text>
                  {duplicates > 0 ? (
                    <Text
                      style={[
                        styles.summaryLine,
                        { color: colors.secondaryLabel },
                      ]}
                    >
                      {t('import.summaryDuplicates', {
                        count: String(duplicates),
                      })}
                    </Text>
                  ) : null}
                  {outcome.result.skipped > 0 ? (
                    <Text
                      style={[
                        styles.summaryLine,
                        { color: colors.secondaryLabel },
                      ]}
                    >
                      {t('import.summarySkipped', {
                        count: String(outcome.result.skipped),
                      })}
                    </Text>
                  ) : null}
                </View>
              ) : (
                <View
                  style={[
                    styles.summary,
                    {
                      borderColor: colors.border,
                      backgroundColor: colors.card,
                    },
                  ]}
                >
                  <Text
                    style={[styles.summaryError, { color: colors.expense }]}
                  >
                    {mapErrorReason(outcome.error.reason, t)}
                  </Text>
                </View>
              )
            ) : null}
          </ScrollView>

          <View style={styles.footer}>
            <Pressable
              onPress={handleApply}
              disabled={!canApply}
              accessibilityRole="button"
              accessibilityState={{ disabled: !canApply }}
              accessibilityLabel={t('import.apply')}
              style={({ pressed }) => [
                styles.primaryCta,
                {
                  backgroundColor: canApply ? colors.accent : colors.fill,
                  opacity: pressed && canApply ? 0.88 : 1,
                },
              ]}
            >
              <Text
                style={[
                  styles.primaryCtaLabel,
                  {
                    color: canApply ? colors.onAccent : colors.tertiaryLabel,
                  },
                ]}
              >
                {canApply
                  ? t('import.applyWithCount', { count: String(toAdd) })
                  : t('import.apply')}
              </Text>
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
}

function mapErrorReason(
  reason: string,
  t: (key: string, vars?: Record<string, string>) => string
): string {
  switch (reason) {
    case 'invalid json':
      return t('import.error.invalidJson');
    case 'no transactions':
    case 'no rows':
    case 'empty':
      return t('import.error.empty');
    case 'missing columns':
      return t('import.error.missingColumns');
    default:
      return t('import.error.generic');
  }
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.space.md,
    paddingVertical: theme.space.sm,
  },
  topTitle: {
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  body: {
    flex: 1,
  },
  content: {
    padding: theme.space.md,
    gap: theme.space.md,
  },
  hint: {
    fontSize: 13,
    fontWeight: '500',
  },
  input: {
    minHeight: 220,
    borderRadius: theme.radius.card,
    borderWidth: StyleSheet.hairlineWidth,
    padding: theme.space.md,
    fontSize: 13,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  summary: {
    borderRadius: theme.radius.card,
    borderWidth: StyleSheet.hairlineWidth,
    padding: theme.space.md,
    gap: 4,
  },
  summaryLine: {
    fontSize: 13,
    fontWeight: '500',
  },
  summaryError: {
    fontSize: 13,
    fontWeight: '600',
  },
  footer: {
    padding: theme.space.md,
  },
  primaryCta: {
    minHeight: 48,
    borderRadius: theme.radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.space.md,
  },
  primaryCtaLabel: {
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: -0.1,
  },
});

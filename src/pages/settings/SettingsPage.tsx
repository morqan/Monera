import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { getAppColors, getGlassPanelShadow, theme } from '@/app/styles/theme';
import { useAppDispatch, useAppSelector } from '@/app/store';
import { setMonthlyLimit } from '@/entities/budget';
import { clearPin, setBiometricsEnabled } from '@/entities/security';
import { patchSettings, type ThemePreference } from '@/entities/settings';
import { SetupPinModal } from '@/features/app-lock';
import { ImportDataModal } from '@/features/import-data';
import { useTranslation, type AppLocale } from '@/shared/i18n';
import {
  buildCsvExport,
  buildJsonExport,
  getBiometryKind,
  requestNotificationPermission,
  SUPPORTED_CURRENCIES,
  type BiometryKind,
} from '@/shared/lib';

const CURRENCY_SYMBOL: Record<string, string> = {
  RUB: '₽',
  USD: '$',
  EUR: '€',
  GBP: '£',
  KZT: '₸',
  UAH: '₴',
  BYN: 'Br',
  CNY: '¥',
  JPY: '¥',
  TRY: '₺',
};

import { SettingsActionRow } from './ui/SettingsActionRow';
import { SettingsInputRow } from './ui/SettingsInputRow';
import { SettingsRowGroup } from './ui/SettingsRowGroup';
import { SettingsSelectRow } from './ui/SettingsSelectRow';
import { SettingsToggleRow } from './ui/SettingsToggleRow';

export function SettingsPage() {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const colors = getAppColors(isDark);
  const panel = getGlassPanelShadow(isDark);
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const currentLocale = useAppSelector((s) => s.settings.locale);
  const currencyCode = useAppSelector((s) => s.settings.currencyCode);
  const themePref = useAppSelector((s) => s.settings.theme);
  const transactions = useAppSelector((s) => s.transactions.items);
  const categories = useAppSelector((s) => s.categories.items);
  const budgets = useAppSelector((s) => s.budgets.items);
  const monthlyLimit = useAppSelector((s) => s.budgets.monthlyLimit);
  const pinHash = useAppSelector((s) => s.security.pinHash);
  const biometricsEnabled = useAppSelector((s) => s.security.biometricsEnabled);
  const notificationsEnabled = useAppSelector(
    (s) => s.settings.notificationsEnabled
  );

  const [biometryKind, setBiometryKind] = useState<BiometryKind>('none');
  const [setupOpen, setSetupOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);

  useEffect(() => {
    let alive = true;
    getBiometryKind().then((k) => {
      if (alive) setBiometryKind(k);
    });
    return () => {
      alive = false;
    };
  }, []);

  const biometryLabel =
    biometryKind === 'face'
      ? t('settings.biometryFace')
      : biometryKind === 'touch'
      ? t('settings.biometryTouch')
      : t('settings.biometryNone');

  const confirmDisablePin = () => {
    Alert.alert(
      t('settings.pinDisableTitle'),
      t('settings.pinDisableMessage'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('settings.pinDisableCta'),
          style: 'destructive',
          onPress: () => dispatch(clearPin()),
        },
      ]
    );
  };

  const initialLimitText = useMemo(
    () =>
      monthlyLimit != null && monthlyLimit > 0 ? String(monthlyLimit) : '',
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  const [limitText, setLimitText] = useState(initialLimitText);

  const handleLimitChange = (value: string) => {
    const normalized = value.replace(/,/g, '.').replace(/[^0-9.]/g, '');
    setLimitText(normalized);
    if (normalized.length === 0) {
      dispatch(setMonthlyLimit(null));
      return;
    }
    const parsed = Number(normalized);
    if (!Number.isFinite(parsed) || parsed <= 0) {
      dispatch(setMonthlyLimit(null));
      return;
    }
    dispatch(setMonthlyLimit(Math.round(parsed * 100) / 100));
  };

  const handleNotificationsToggle = async (next: boolean) => {
    if (!next) {
      dispatch(patchSettings({ notificationsEnabled: false }));
      return;
    }
    const granted = await requestNotificationPermission();
    if (!granted) {
      Alert.alert(t('settings.notificationsDenied'));
      return;
    }
    dispatch(patchSettings({ notificationsEnabled: true }));
  };

  const shareExport = async (payload: string) => {
    try {
      await Share.share({ message: payload });
    } catch {
      Alert.alert(t('settings.exportError'));
    }
  };

  const handleExportJson = () => {
    const bundle = {
      exportedAt: new Date().toISOString(),
      transactions,
      categories,
      budgets,
    };
    shareExport(buildJsonExport(bundle));
  };

  const handleExportCsv = () => {
    shareExport(buildCsvExport(transactions, categories));
  };

  const languageOptions: Array<{ value: AppLocale; label: string }> = [
    { value: 'ru', label: t('settings.languageRu') },
    { value: 'en', label: t('settings.languageEn') },
  ];

  const currencyOptions = SUPPORTED_CURRENCIES.map((code) => ({
    value: code,
    label: `${code}${CURRENCY_SYMBOL[code] ? ' ' + CURRENCY_SYMBOL[code] : ''}`,
  }));

  const themeOptions: Array<{ value: ThemePreference; label: string }> = [
    { value: 'system', label: t('settings.themeSystem') },
    { value: 'light', label: t('settings.themeLight') },
    { value: 'dark', label: t('settings.themeDark') },
  ];

  return (
    <SafeAreaView
      style={[styles.screen, { backgroundColor: colors.groupedBackground }]}
      edges={['bottom']}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <SettingsRowGroup
          colors={colors}
          shadow={panel}
          title={t('settings.language')}
        >
          <SettingsSelectRow
            colors={colors}
            value={currentLocale}
            options={languageOptions}
            onChange={(value) =>
              dispatch(patchSettings({ locale: value as AppLocale }))
            }
          />
        </SettingsRowGroup>

        <SettingsRowGroup
          colors={colors}
          shadow={panel}
          title={t('settings.currency')}
        >
          <SettingsSelectRow
            colors={colors}
            value={currencyCode}
            options={currencyOptions}
            onChange={(value) =>
              dispatch(patchSettings({ currencyCode: value }))
            }
          />
        </SettingsRowGroup>

        <SettingsRowGroup
          colors={colors}
          shadow={panel}
          title={t('settings.monthlyBudget')}
        >
          <SettingsInputRow
            colors={colors}
            value={limitText}
            onChange={handleLimitChange}
            placeholder={t('settings.monthlyBudgetPlaceholder')}
            suffix={currencyCode}
          />
        </SettingsRowGroup>

        <SettingsRowGroup
          colors={colors}
          shadow={panel}
          title={t('settings.security')}
        >
          <SettingsToggleRow
            colors={colors}
            label={t('settings.pinLock')}
            value={pinHash != null}
            onChange={(next) => {
              if (next) {
                setSetupOpen(true);
              } else {
                confirmDisablePin();
              }
            }}
            showDivider
          />
          {pinHash != null ? (
            <SettingsActionRow
              colors={colors}
              label={t('settings.pinChange')}
              onPress={() => setSetupOpen(true)}
              showDivider
            />
          ) : null}
          <SettingsToggleRow
            colors={colors}
            label={biometryLabel}
            value={biometricsEnabled}
            disabled={pinHash == null || biometryKind === 'none'}
            onChange={(next) => dispatch(setBiometricsEnabled(next))}
            caption={
              biometryKind === 'none'
                ? t('settings.biometryUnavailable')
                : pinHash == null
                ? t('settings.biometryNeedsPin')
                : undefined
            }
          />
        </SettingsRowGroup>

        <SettingsRowGroup
          colors={colors}
          shadow={panel}
          title={t('settings.notifications')}
        >
          <SettingsToggleRow
            colors={colors}
            label={t('settings.notificationsBudget')}
            value={notificationsEnabled}
            onChange={handleNotificationsToggle}
            caption={t('settings.notificationsBudgetHint')}
          />
        </SettingsRowGroup>

        <SettingsRowGroup
          colors={colors}
          shadow={panel}
          title={t('settings.theme')}
        >
          <SettingsSelectRow
            colors={colors}
            value={themePref}
            options={themeOptions}
            onChange={(value) =>
              dispatch(patchSettings({ theme: value as ThemePreference }))
            }
          />
        </SettingsRowGroup>

        <SettingsRowGroup
          colors={colors}
          shadow={panel}
          title={t('settings.export')}
        >
          <SettingsActionRow
            colors={colors}
            label={t('settings.exportJson')}
            onPress={handleExportJson}
            showDivider
          />
          <SettingsActionRow
            colors={colors}
            label={t('settings.exportCsv')}
            onPress={handleExportCsv}
          />
        </SettingsRowGroup>

        <SettingsRowGroup
          colors={colors}
          shadow={panel}
          title={t('settings.importTitle')}
        >
          <SettingsActionRow
            colors={colors}
            label={t('settings.importOpen')}
            onPress={() => setImportOpen(true)}
          />
        </SettingsRowGroup>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.tertiaryLabel }]}>
            {t('settings.about')} · {t('settings.version')} 0.1
          </Text>
        </View>
      </ScrollView>
      <SetupPinModal
        visible={setupOpen}
        onClose={() => setSetupOpen(false)}
        onDone={() => setSetupOpen(false)}
      />
      <ImportDataModal
        visible={importOpen}
        onClose={() => setImportOpen(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    padding: theme.space.md,
    paddingTop: theme.space.lg,
    paddingBottom: theme.space.xl,
  },
  footer: {
    marginTop: theme.space.lg,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    fontWeight: '500',
  },
});

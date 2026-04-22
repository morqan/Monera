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
import { patchSettings, type ThemePreference } from '@/entities/settings';
import { useTranslation, type AppLocale } from '@/shared/i18n';
import {
  buildCsvExport,
  buildJsonExport,
  SUPPORTED_CURRENCIES,
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
import { SettingsRowGroup } from './ui/SettingsRowGroup';
import { SettingsSelectRow } from './ui/SettingsSelectRow';

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

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.tertiaryLabel }]}>
            {t('settings.about')} · {t('settings.version')} 0.1
          </Text>
        </View>
      </ScrollView>
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

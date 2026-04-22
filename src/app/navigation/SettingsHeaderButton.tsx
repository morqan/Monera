import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Settings } from 'lucide-react-native';
import { Pressable, useColorScheme } from 'react-native';

import { getAppColors } from '@/app/styles/theme';
import { useTranslation } from '@/shared/i18n';

import type { RootStackParamList } from './types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function SettingsHeaderButton() {
  const navigation = useNavigation<Nav>();
  const isDark = useColorScheme() === 'dark';
  const colors = getAppColors(isDark);
  const { t } = useTranslation();

  return (
    <Pressable
      onPress={() => navigation.navigate('Settings')}
      accessibilityRole="button"
      accessibilityLabel={t('settings.title')}
      hitSlop={10}
    >
      <Settings size={20} color={colors.headerTint} strokeWidth={1.75} />
    </Pressable>
  );
}

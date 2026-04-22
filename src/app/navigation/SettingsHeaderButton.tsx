import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Pressable, StyleSheet, Text, useColorScheme } from 'react-native';

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
      <Text style={[styles.glyph, { color: colors.headerTint }]}>⚙︎</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  glyph: {
    fontSize: 22,
    fontWeight: '600',
  },
});

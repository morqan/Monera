import { Plus } from 'lucide-react-native';
import { Pressable, useColorScheme } from 'react-native';

import { getGlassFabShadow, type AppColors } from '@/app/styles/theme';
import { useTranslation } from '@/shared/i18n';

import { transactionsListStyles } from '../styles';

type Props = {
  colors: AppColors;
  onPress: () => void;
};

export function AddFab({ colors, onPress }: Props) {
  const isDark = useColorScheme() === 'dark';
  const fabShadow = getGlassFabShadow(isDark);
  const { t } = useTranslation();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        transactionsListStyles.fab,
        fabShadow,
        {
          backgroundColor: colors.accent,
          opacity: pressed ? 0.9 : 1,
          borderWidth: 1,
          borderColor: colors.fabRing,
        },
      ]}
      accessibilityRole="button"
      accessibilityLabel={t('create.titleNew')}
    >
      <Plus size={24} color={colors.onAccent} strokeWidth={2} />
    </Pressable>
  );
}

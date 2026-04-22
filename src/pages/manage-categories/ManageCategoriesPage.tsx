import { ChevronRight } from 'lucide-react-native';
import { useMemo } from 'react';
import {
  Pressable,
  SectionList,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import type { RootStackParamList } from '@/app/navigation/types';
import { useAppSelector } from '@/app/store';
import {
  getAppColors,
  getGlassRowShadow,
  theme,
  type AppColors,
} from '@/app/styles/theme';
import { useCategoryName, type Category } from '@/entities/category';
import { useTranslation } from '@/shared/i18n';
import { hexToRgba } from '@/shared/lib';
import { CategoryIcon, GlassBackground, GlassSurface } from '@/shared/ui';

type Section = {
  title: string;
  data: Category[];
};

export function ManageCategoriesPage() {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const colors = getAppColors(isDark);
  const { t } = useTranslation();
  const categories = useAppSelector((s) => s.categories.items);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const getName = useCategoryName();

  const sections = useMemo<Section[]>(() => {
    const expense = categories.filter((c) => c.kind === 'expense');
    const income = categories.filter((c) => c.kind === 'income');
    return [
      { title: t('create.kindExpense'), data: expense },
      { title: t('create.kindIncome'), data: income },
    ].filter((s) => s.data.length > 0);
  }, [categories, t]);

  return (
    <GlassBackground>
      <SafeAreaView style={styles.screen} edges={['bottom']}>
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <CategoryRowItem
              category={item}
              name={getName(item)}
              colors={colors}
              onPress={() =>
                navigation.navigate('EditCategory', { categoryId: item.id })
              }
            />
          )}
          renderSectionHeader={({ section }) => (
            <View style={styles.sectionHeader}>
              <Text
                style={[
                  styles.sectionHeaderLabel,
                  { color: colors.secondaryLabel },
                ]}
              >
                {section.title}
              </Text>
            </View>
          )}
          contentContainerStyle={styles.content}
          stickySectionHeadersEnabled={false}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={
            <Pressable
              onPress={() => navigation.navigate('EditCategory')}
              style={({ pressed }) => [
                styles.addBtn,
                {
                  backgroundColor: colors.accent,
                  opacity: pressed ? 0.85 : 1,
                },
              ]}
            >
              <Text style={[styles.addLabel, { color: colors.onAccent }]}>
                {t('home.addCategory')}
              </Text>
            </Pressable>
          }
        />
      </SafeAreaView>
    </GlassBackground>
  );
}

function CategoryRowItem({
  category,
  name,
  colors,
  onPress,
}: {
  category: Category;
  name: string;
  colors: AppColors;
  onPress: () => void;
}) {
  const isDark = useColorScheme() === 'dark';
  const shadow = getGlassRowShadow(isDark);
  const accent = category.color ?? colors.accent;
  return (
    <GlassSurface
      colors={colors}
      isDark={isDark}
      variant="row"
      tint={accent}
      shadowStyle={shadow}
      style={styles.rowShell}
    >
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [styles.row, { opacity: pressed ? 0.9 : 1 }]}
      >
        <View
          style={[
            styles.iconWrap,
            { backgroundColor: hexToRgba(accent, 0.14) },
          ]}
        >
          <CategoryIcon icon={category.icon} size={18} color={accent} />
        </View>
        <Text
          style={[styles.rowLabel, { color: colors.label }]}
          numberOfLines={1}
        >
          {name}
        </Text>
        <ChevronRight
          size={18}
          color={colors.tertiaryLabel}
          strokeWidth={1.75}
        />
      </Pressable>
    </GlassSurface>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: {
    paddingHorizontal: theme.space.md,
    paddingTop: theme.space.sm,
    paddingBottom: 120,
  },
  sectionHeader: {
    marginTop: theme.space.md,
    marginBottom: theme.space.sm,
    paddingHorizontal: theme.space.xs,
  },
  sectionHeaderLabel: {
    fontSize: 11,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  rowShell: {
    marginBottom: theme.space.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.space.md,
    paddingHorizontal: theme.space.md,
    paddingVertical: 12,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
  },
  addBtn: {
    marginTop: theme.space.lg,
    borderRadius: theme.radius.button,
    paddingVertical: 12,
    alignItems: 'center',
  },
  addLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
});

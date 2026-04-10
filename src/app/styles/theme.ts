/**
 * Liquid Glass — все цвета здесь, чтобы менять палитру в одном месте.
 * Яркая энергичная схема: насыщенный «стеклянный» хедер, неоновые акценты.
 */

import {
  DarkTheme,
  DefaultTheme,
  type Theme as NavigationTheme,
} from '@react-navigation/native';
import type { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import type { ViewStyle } from 'react-native';

export type AppColors = {
  background: string;
  groupedBackground: string;
  card: string;
  border: string;
  label: string;
  secondaryLabel: string;
  tertiaryLabel: string;
  accent: string;
  income: string;
  expense: string;
  danger: string;
  fill: string;
  fabRing: string;
  /** Текст и иконки на заливке accent (кнопки, чипы). */
  onAccent: string;
  /** Сплошная панель навбара (iOS + Android). */
  headerSurface: string;
  /** Заголовок в навбаре (inline + large title). */
  headerTitle: string;
  /** Кнопки «назад» и барные элементы. */
  headerTint: string;
  shadowPanel: string;
  shadowRow: string;
  shadowFab: string;
};

export function getAppColors(isDark: boolean): AppColors {
  if (isDark) {
    return {
      background: '#050818',
      groupedBackground: '#0A0F28',
      card: 'rgba(255, 255, 255, 0.11)',
      border: 'rgba(130, 210, 255, 0.38)',
      label: '#FFFFFF',
      secondaryLabel: 'rgba(220, 240, 255, 0.78)',
      tertiaryLabel: 'rgba(170, 210, 255, 0.55)',
      accent: '#00D4FF',
      income: '#3DFFB4',
      expense: '#FF5C9A',
      danger: '#FF5C9A',
      fill: 'rgba(0, 212, 255, 0.16)',
      fabRing: 'rgba(255, 255, 255, 0.5)',
      onAccent: '#041018',
      headerSurface: '#00B8FF',
      headerTitle: '#FFFFFF',
      headerTint: '#B6FFF9',
      shadowPanel: '#40C4FF',
      shadowRow: '#00B8FF',
      shadowFab: '#00E5FF',
    };
  }

  return {
    background: '#DCE6FF',
    groupedBackground: '#CCD9FF',
    card: 'rgba(255, 255, 255, 0.72)',
    border: 'rgba(255, 255, 255, 0.95)',
    label: '#071229',
    secondaryLabel: 'rgba(20, 40, 80, 0.68)',
    tertiaryLabel: 'rgba(50, 70, 120, 0.5)',
    accent: '#0057FF',
    income: '#00A356',
    expense: '#E4005B',
    danger: '#E4005B',
    fill: 'rgba(0, 87, 255, 0.14)',
    fabRing: 'rgba(255, 255, 255, 0.98)',
    onAccent: '#FFFFFF',
    headerSurface: '#0057FF',
    headerTitle: '#FFFFFF',
    headerTint: '#C8F6FF',
    shadowPanel: '#2B7BFF',
    shadowRow: '#0066FF',
    shadowFab: '#0057FF',
  };
}

export function getNavigationTheme(isDark: boolean): NavigationTheme {
  const c = getAppColors(isDark);
  const base = isDark ? DarkTheme : DefaultTheme;
  return {
    ...base,
    colors: {
      ...base.colors,
      primary: c.headerTint,
      background: c.groupedBackground,
      card: c.card,
      text: c.label,
      border: c.border,
      notification: c.accent,
    },
  };
}

export function getNativeStackScreenOptions(
  isDark: boolean
): NativeStackNavigationOptions {
  const c = getAppColors(isDark);
  const fabShadow = getGlassFabShadow(isDark);

  return {
    headerShadowVisible: false,
    headerTintColor: c.headerTint,
    headerTitleStyle: {
      fontSize: 17,
      fontWeight: '600',
      color: c.headerTitle,
    },
    headerLargeTitleStyle: {
      fontSize: 34,
      fontWeight: '700',
      color: c.headerTitle,
    },
    headerStyle: {
      ...fabShadow,
      backgroundColor: c.headerSurface,
    },
  };
}

/** Стеклянные панели — тени из глобальной палитры. */
export function getGlassPanelShadow(isDark: boolean): ViewStyle {
  const c = getAppColors(isDark);
  return {
    shadowColor: c.shadowPanel,
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: isDark ? 0.45 : 0.28,
    shadowRadius: 32,
    elevation: 10,
  };
}

export function getGlassRowShadow(isDark: boolean): ViewStyle {
  const c = getAppColors(isDark);
  return {
    shadowColor: c.shadowRow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: isDark ? 0.28 : 0.18,
    shadowRadius: 16,
    elevation: 4,
  };
}

export function getGlassFabShadow(isDark: boolean): ViewStyle {
  const c = getAppColors(isDark);
  return {
    shadowColor: c.shadowFab,
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: isDark ? 0.55 : 0.38,
    shadowRadius: 22,
    elevation: 14,
  };
}

export const theme = {
  radius: {
    card: 22,
    row: 18,
    pill: 14,
    button: 16,
  },
  space: {
    xs: 6,
    sm: 10,
    md: 16,
    lg: 20,
    xl: 28,
  },
} as const;

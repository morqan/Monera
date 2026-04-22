/**
 * Monera design tokens — minimal «quiet luxury».
 * Правило: 1 акцент (violet) + серая шкала + 2 семантических (income/expense).
 * Вдохновение: Linear · Things 3 · Revolut.
 */

import {
  DarkTheme,
  DefaultTheme,
  type Theme as NavigationTheme,
} from '@react-navigation/native';
import type { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import type { TextStyle, ViewStyle } from 'react-native';

export type AppColors = {
  background: string;
  groupedBackground: string;
  card: string;
  cardElevated: string;
  border: string;
  hairline: string;
  label: string;
  secondaryLabel: string;
  tertiaryLabel: string;
  accent: string;
  accentMuted: string;
  income: string;
  expense: string;
  danger: string;
  fill: string;
  fabRing: string;
  onAccent: string;
  headerSurface: string;
  headerTitle: string;
  headerTint: string;
  shadowPanel: string;
  shadowRow: string;
  shadowFab: string;
};

/** Единственный акцент всего приложения. */
export const ACCENT = '#7C5CFF';
export const ACCENT_MUTED = 'rgba(124, 92, 255, 0.16)';

export function getAppColors(isDark: boolean): AppColors {
  if (isDark) {
    return {
      background: '#0A0A0F',
      groupedBackground: '#0A0A0F',
      card: 'rgba(255, 255, 255, 0.06)',
      cardElevated: 'rgba(255, 255, 255, 0.09)',
      border: 'rgba(255, 255, 255, 0.08)',
      hairline: 'rgba(255, 255, 255, 0.06)',
      label: '#F5F5F7',
      secondaryLabel: 'rgba(245, 245, 247, 0.64)',
      tertiaryLabel: 'rgba(245, 245, 247, 0.36)',
      accent: ACCENT,
      accentMuted: ACCENT_MUTED,
      income: '#30D158',
      expense: '#FF453A',
      danger: '#FF453A',
      fill: 'rgba(255, 255, 255, 0.05)',
      fabRing: 'rgba(255, 255, 255, 0.12)',
      onAccent: '#FFFFFF',
      headerSurface: '#0A0A0F',
      headerTitle: '#F5F5F7',
      headerTint: ACCENT,
      shadowPanel: '#000000',
      shadowRow: '#000000',
      shadowFab: ACCENT,
    };
  }

  return {
    background: '#FAFAFA',
    groupedBackground: '#F2F2F4',
    card: '#FFFFFF',
    cardElevated: '#FFFFFF',
    border: 'rgba(10, 10, 15, 0.08)',
    hairline: 'rgba(10, 10, 15, 0.06)',
    label: '#0A0A0F',
    secondaryLabel: 'rgba(10, 10, 15, 0.60)',
    tertiaryLabel: 'rgba(10, 10, 15, 0.38)',
    accent: ACCENT,
    accentMuted: 'rgba(124, 92, 255, 0.12)',
    income: '#1B9A3E',
    expense: '#E53935',
    danger: '#E53935',
    fill: 'rgba(10, 10, 15, 0.04)',
    fabRing: 'rgba(10, 10, 15, 0.08)',
    onAccent: '#FFFFFF',
    headerSurface: '#FAFAFA',
    headerTitle: '#0A0A0F',
    headerTint: ACCENT,
    shadowPanel: '#0A0A0F',
    shadowRow: '#0A0A0F',
    shadowFab: ACCENT,
  };
}

export function getNavigationTheme(isDark: boolean): NavigationTheme {
  const c = getAppColors(isDark);
  const base = isDark ? DarkTheme : DefaultTheme;
  return {
    ...base,
    colors: {
      ...base.colors,
      primary: c.accent,
      background: c.background,
      card: c.headerSurface,
      text: c.label,
      border: c.hairline,
      notification: c.accent,
    },
  };
}

export function getNativeStackScreenOptions(
  isDark: boolean
): NativeStackNavigationOptions {
  const c = getAppColors(isDark);
  return {
    headerShadowVisible: false,
    headerTintColor: c.headerTint,
    headerTitleStyle: {
      fontSize: 17,
      fontWeight: '600',
      color: c.headerTitle,
    },
    headerLargeTitleStyle: {
      fontSize: 28,
      fontWeight: '700',
      color: c.headerTitle,
    },
    headerStyle: {
      backgroundColor: c.headerSurface,
    },
  };
}

export function getGlassPanelShadow(isDark: boolean): ViewStyle {
  return {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: isDark ? 0.35 : 0.08,
    shadowRadius: 24,
    elevation: 6,
  };
}

export function getGlassRowShadow(isDark: boolean): ViewStyle {
  return {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: isDark ? 0.2 : 0.05,
    shadowRadius: 8,
    elevation: 2,
  };
}

export function getGlassFabShadow(isDark: boolean): ViewStyle {
  return {
    shadowColor: ACCENT,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: isDark ? 0.4 : 0.25,
    shadowRadius: 18,
    elevation: 10,
  };
}

/** Категориальные цвета — приглушённая Tailwind-шкала. */
export const CATEGORY_PALETTE = [
  '#7C5CFF', // violet (акцент)
  '#3B82F6', // blue
  '#06B6D4', // cyan
  '#10B981', // emerald
  '#F59E0B', // amber
  '#EF4444', // red
  '#EC4899', // pink
  '#8B5CF6', // purple
  '#14B8A6', // teal
  '#F97316', // orange
  '#64748B', // slate
  '#A855F7', // violet-alt
  '#22C55E', // green
  '#0EA5E9', // sky
  '#D97706', // amber-dark
  '#94A3B8', // muted
] as const;

export const theme = {
  radius: {
    card: 16,
    row: 14,
    pill: 12,
    button: 14,
    full: 999,
  },
  space: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    xxl: 32,
  },
} as const;

/** Типографическая шкала — компактная, iOS-native. */
export const typography = {
  size: {
    display: 28,
    title: 20,
    headline: 17,
    body: 15,
    callout: 14,
    caption: 12,
    micro: 11,
  },
  weight: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.35,
    relaxed: 1.5,
  },
} as const;

export const text = {
  display: {
    fontSize: typography.size.display,
    fontWeight: '700',
    letterSpacing: -0.6,
  } as TextStyle,
  title: {
    fontSize: typography.size.title,
    fontWeight: '600',
    letterSpacing: -0.3,
  } as TextStyle,
  headline: {
    fontSize: typography.size.headline,
    fontWeight: '600',
    letterSpacing: -0.2,
  } as TextStyle,
  body: {
    fontSize: typography.size.body,
    fontWeight: '400',
    letterSpacing: -0.1,
  } as TextStyle,
  bodyStrong: {
    fontSize: typography.size.body,
    fontWeight: '600',
    letterSpacing: -0.1,
  } as TextStyle,
  callout: {
    fontSize: typography.size.callout,
    fontWeight: '500',
    letterSpacing: -0.1,
  } as TextStyle,
  caption: {
    fontSize: typography.size.caption,
    fontWeight: '500',
    letterSpacing: 0,
  } as TextStyle,
  micro: {
    fontSize: typography.size.micro,
    fontWeight: '500',
    letterSpacing: 0.2,
    textTransform: 'uppercase',
  } as TextStyle,
};

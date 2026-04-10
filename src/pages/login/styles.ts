import { StyleSheet } from 'react-native';

import { getAppColors } from '@/app/styles/theme';

export function getLoginPalette(isDark: boolean) {
  const c = getAppColors(isDark);
  return {
    bg: c.groupedBackground,
    group: c.card,
    border: c.border,
    label: c.label,
    secondary: c.secondaryLabel,
    field: c.label,
    placeholder: c.tertiaryLabel,
    accent: c.accent,
    error: c.danger,
    fabRing: c.fabRing,
    onAccent: c.onAccent,
  };
}

export const loginStyles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 34,
    fontWeight: '700',
    letterSpacing: 0.37,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 17,
    marginBottom: 28,
  },
  group: {
    borderRadius: 18,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
  },
  input: {
    fontSize: 17,
    paddingHorizontal: 16,
    paddingVertical: 14,
    minHeight: 48,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginLeft: 16,
  },
  cta: {
    marginTop: 24,
  },
  error: {
    fontSize: 15,
    marginTop: 12,
    lineHeight: 20,
  },
  primaryButton: {
    marginTop: 20,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  primaryButtonLabel: {
    fontSize: 17,
    fontWeight: '600',
  },
});

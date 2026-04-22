import { StyleSheet } from 'react-native';

import { theme } from '@/app/styles/theme';

export const transactionRowStyles = StyleSheet.create({
  shell: {
    marginBottom: theme.space.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: theme.space.md - 2,
    paddingHorizontal: theme.space.md,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.space.md,
  },
  iconLabel: {
    fontSize: 16,
  },
  meta: {
    flex: 1,
    minWidth: 0,
    paddingRight: theme.space.sm,
  },
  title: {
    fontSize: 15,
    fontWeight: '500',
    letterSpacing: -0.2,
  },
  note: {
    fontSize: 13,
    lineHeight: 17,
    marginTop: 1,
  },
  date: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 3,
    letterSpacing: 0.1,
  },
  amount: {
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: -0.2,
    marginLeft: theme.space.sm,
    flexShrink: 0,
    maxWidth: 140,
    textAlign: 'right',
  },
});

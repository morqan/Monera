import { StyleSheet } from 'react-native';

import { theme } from '@/app/styles/theme';

export const transactionRowStyles = StyleSheet.create({
  shell: {
    marginBottom: theme.space.sm,
    borderRadius: theme.radius.row,
    borderWidth: StyleSheet.hairlineWidth,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.space.md - 2,
    paddingHorizontal: theme.space.md,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.space.sm + 2,
  },
  iconLabel: {
    fontSize: 15,
    fontWeight: '700',
  },
  meta: {
    flex: 1,
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: -0.41,
  },
  subtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  amount: {
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: -0.41,
  },
});

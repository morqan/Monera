import { StyleSheet } from 'react-native';

import { theme } from '@/app/styles/theme';

export const transactionsListStyles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  list: {
    flex: 1,
  },
  belowHeader: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: theme.space.md,
    paddingTop: theme.space.sm,
  },
  filtersWrap: {
    marginBottom: theme.space.md,
  },
  filtersRow: {
    flexDirection: 'row',
    gap: theme.space.sm,
  },
  filterChip: {
    flex: 1,
    minHeight: 40,
    borderRadius: theme.radius.pill,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.space.md,
  },
  filterChipLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  sectionsList: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 120,
  },
  sectionHeader: {
    marginBottom: theme.space.sm,
    marginTop: theme.space.xs,
    paddingHorizontal: theme.space.xs,
  },
  sectionHeaderLabel: {
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  fabWrap: {
    position: 'absolute',
    right: theme.space.lg,
    bottom: theme.space.lg,
  },
  fab: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabLabel: {
    fontSize: 28,
    fontWeight: '400',
    marginTop: -2,
  },
  empty: {
    flex: 1,
    paddingHorizontal: theme.space.xl,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyCard: {
    width: '100%',
    borderRadius: theme.radius.card,
    padding: theme.space.xl,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
  },
  emptyIcon: {
    width: 72,
    height: 72,
    borderRadius: theme.radius.row,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.space.md,
  },
  emptyGlyph: {
    fontSize: 32,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  emptySubtitle: {
    fontSize: 15,
    textAlign: 'center',
    marginTop: theme.space.sm,
    lineHeight: 22,
  },
  emptyCta: {
    marginTop: theme.space.lg,
    borderRadius: theme.radius.button,
    paddingVertical: 14,
    paddingHorizontal: theme.space.xl,
    minWidth: 220,
    alignItems: 'center',
  },
  emptyCtaLabel: {
    fontSize: 17,
    fontWeight: '600',
  },
});

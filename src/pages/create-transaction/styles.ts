import { StyleSheet } from 'react-native';

import { theme } from '@/app/styles/theme';

export const createTransactionStyles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: theme.space.md,
    paddingTop: theme.space.md,
    paddingBottom: 120,
  },
  group: {
    borderRadius: theme.radius.card,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
    marginBottom: theme.space.md,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '500',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    marginBottom: theme.space.sm,
    marginLeft: 4,
  },
  fieldLabelSpaced: {
    marginTop: 8,
  },
  segment: {
    flexDirection: 'row',
    borderRadius: theme.radius.pill,
    padding: 3,
    gap: 3,
  },
  segmentItem: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: theme.radius.pill - 2,
    alignItems: 'center',
  },
  segmentItemInactive: {
    backgroundColor: 'transparent',
  },
  segmentLabel: {
    fontSize: 13,
    fontWeight: '500',
  },
  input: {
    fontSize: 17,
    fontWeight: '500',
    paddingHorizontal: theme.space.md,
    paddingVertical: 12,
    letterSpacing: -0.3,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.space.md,
    paddingVertical: 10,
    minHeight: 48,
  },
  rowPlain: {
    borderTopWidth: 0,
  },
  dateControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  caretGlyph: {
    fontSize: 16,
  },
  rowLabel: {
    fontSize: 15,
  },
  rowValue: {
    fontSize: 15,
    fontWeight: '500',
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.space.sm,
  },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: theme.radius.pill,
    borderWidth: StyleSheet.hairlineWidth,
  },
  chipLabel: {
    fontSize: 13,
    fontWeight: '500',
  },
  note: {
    minHeight: 80,
    fontSize: 15,
    paddingHorizontal: theme.space.md,
    paddingVertical: 10,
    textAlignVertical: 'top',
  },
  footer: {
    paddingHorizontal: theme.space.md,
    paddingVertical: theme.space.md,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  deleteRow: {
    alignItems: 'center',
    paddingBottom: theme.space.sm,
  },
  deleteLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  save: {
    borderRadius: theme.radius.button,
    paddingVertical: 14,
    alignItems: 'center',
  },
  saveBelowDelete: {
    marginTop: theme.space.sm,
  },
  saveLabel: {
    fontSize: 15,
    fontWeight: '600',
  },
  caretBtn: {
    width: 44,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
});

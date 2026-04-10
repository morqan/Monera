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
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: -0.08,
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
    padding: 4,
    gap: 4,
  },
  segmentItem: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: theme.radius.pill - 2,
    alignItems: 'center',
  },
  segmentItemInactive: {
    backgroundColor: 'transparent',
  },
  segmentLabel: {
    fontSize: 15,
    fontWeight: '600',
  },
  input: {
    fontSize: 20,
    fontWeight: '600',
    paddingHorizontal: theme.space.md,
    paddingVertical: 14,
    letterSpacing: -0.5,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.space.md,
    paddingVertical: 12,
    minHeight: 52,
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
    fontSize: 18,
  },
  rowLabel: {
    fontSize: 17,
  },
  rowValue: {
    fontSize: 17,
    fontWeight: '500',
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.space.sm,
  },
  chip: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: theme.radius.pill,
    borderWidth: StyleSheet.hairlineWidth,
  },
  chipLabel: {
    fontSize: 15,
    fontWeight: '600',
  },
  note: {
    minHeight: 100,
    fontSize: 17,
    paddingHorizontal: theme.space.md,
    paddingVertical: 12,
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
    fontSize: 15,
    fontWeight: '600',
  },
  save: {
    borderRadius: theme.radius.button,
    paddingVertical: 16,
    alignItems: 'center',
  },
  saveBelowDelete: {
    marginTop: theme.space.sm,
  },
  saveLabel: {
    fontSize: 17,
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

/**
 * Shared utilities and small pure helpers.
 */

export { authenticateWithBiometry, getBiometryKind } from './biometrics';
export type { BiometryKind } from './biometrics';
export { hexToRgba } from './color';
export { createId } from './createId';
export { generateSalt, hashPin } from './crypto/hashPin';
export { buildCsvExport, buildJsonExport } from './exportData';
export type { ExportBundle } from './exportData';
export {
  currentRange,
  customRange,
  formatRangeTitle,
  isCurrentRange,
  parseISODate,
  rangeContainsISO,
  rangeFromPreset,
  rangesEqual,
  shiftRange,
  todayISODate,
  toISODate,
} from './dateRange';
export type { DateRange, RangePreset } from './dateRange';
export { formatMoney, SUPPORTED_CURRENCIES } from './formatMoney';
export type { CurrencyCode } from './formatMoney';
export { logger } from './logger';
export {
  currentMonthKey,
  formatMonthTitle,
  monthKeyFromDateString,
  parseMonthKey,
  shiftMonth,
  toMonthKey,
} from './month';
export type { MonthKey } from './month';
export { loadJson, persistRootState, saveJson, STORAGE_KEYS } from './storage';
export type { PersistedSlices } from './storage';

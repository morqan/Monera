/**
 * Shared utilities and small pure helpers.
 */

export { hexToRgba } from './color';
export { createId } from './createId';
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

import type { BudgetsState } from '@/entities/budget';
import type { CategoriesState } from '@/entities/category';
import type { SecurityState } from '@/entities/security';
import type { Settings } from '@/entities/settings';
import type { TransactionsState } from '@/entities/transaction';

import { saveJson } from './jsonStorage';
import { STORAGE_KEYS } from './keys';

export type PersistedSlices = {
  transactions: TransactionsState;
  categories: CategoriesState;
  budgets: BudgetsState;
  settings: Settings;
  security: SecurityState;
};

export async function persistRootState(state: PersistedSlices): Promise<void> {
  await Promise.all([
    saveJson(STORAGE_KEYS.transactions, state.transactions.items),
    saveJson(STORAGE_KEYS.categories, state.categories.items),
    saveJson(STORAGE_KEYS.budgets, {
      items: state.budgets.items,
      monthlyLimit: state.budgets.monthlyLimit,
    }),
    saveJson(STORAGE_KEYS.settings, state.settings),
    saveJson(STORAGE_KEYS.security, {
      pinHash: state.security.pinHash,
      pinSalt: state.security.pinSalt,
      biometricsEnabled: state.security.biometricsEnabled,
    }),
  ]);
}

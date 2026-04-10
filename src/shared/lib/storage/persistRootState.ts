import type { CategoriesState } from '@/entities/category';
import type { Settings } from '@/entities/settings';
import type { TransactionsState } from '@/entities/transaction';

import { saveJson } from './jsonStorage';
import { STORAGE_KEYS } from './keys';

export type PersistedSlices = {
  transactions: TransactionsState;
  categories: CategoriesState;
  settings: Settings;
};

export async function persistRootState(state: PersistedSlices): Promise<void> {
  await Promise.all([
    saveJson(STORAGE_KEYS.transactions, state.transactions.items),
    saveJson(STORAGE_KEYS.categories, state.categories.items),
    saveJson(STORAGE_KEYS.settings, state.settings),
  ]);
}

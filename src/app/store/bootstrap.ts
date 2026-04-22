import { createAsyncThunk } from '@reduxjs/toolkit';

import { hydrateBudgets, type Budget } from '@/entities/budget';
import {
  defaultCategories,
  hydrateCategories,
  migrateCategoryIcons,
  type Category,
} from '@/entities/category';
import { hydrateSecurity, type SecurityPersisted } from '@/entities/security';
import {
  defaultSettings,
  hydrateSettings,
  type Settings,
} from '@/entities/settings';
import { hydrateSession } from '@/entities/session';
import { hydrateTransactions, type Transaction } from '@/entities/transaction';
import { loadJson, STORAGE_KEYS } from '@/shared/lib';
import type { SessionUser } from '@/shared/types/sessionUser';

export const bootstrapApp = createAsyncThunk(
  'app/bootstrap',
  async (_, { dispatch }) => {
    const [tx, cat, budgetsRaw, set, sessionUser, security] = await Promise.all(
      [
        loadJson<Transaction[]>(STORAGE_KEYS.transactions),
        loadJson<Category[]>(STORAGE_KEYS.categories),
        loadJson<Budget[] | { items: Budget[]; monthlyLimit: number | null }>(
          STORAGE_KEYS.budgets
        ),
        loadJson<Settings>(STORAGE_KEYS.settings),
        loadJson<SessionUser>(STORAGE_KEYS.sessionUser),
        loadJson<SecurityPersisted>(STORAGE_KEYS.security),
      ]
    );

    const budgets = Array.isArray(budgetsRaw)
      ? { items: budgetsRaw, monthlyLimit: null }
      : budgetsRaw ?? { items: [], monthlyLimit: null };

    const sessionEmail = sessionUser?.email?.trim();
    dispatch(
      hydrateSession(
        sessionEmail && sessionEmail.length > 0 ? sessionEmail : null
      )
    );

    dispatch(hydrateTransactions(tx ?? []));
    dispatch(
      hydrateCategories(
        migrateCategoryIcons(cat && cat.length > 0 ? cat : defaultCategories)
      )
    );
    dispatch(hydrateBudgets(budgets));
    dispatch(hydrateSettings(set ?? defaultSettings));
    dispatch(
      hydrateSecurity(
        security ?? {
          pinHash: null,
          pinSalt: null,
          biometricsEnabled: false,
        }
      )
    );
  }
);

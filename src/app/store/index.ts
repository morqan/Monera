import { configureStore } from '@reduxjs/toolkit';

import { categoriesReducer } from '@/entities/category';
import { sessionReducer } from '@/entities/session';
import { settingsReducer } from '@/entities/settings';
import { transactionsReducer } from '@/entities/transaction';
import { baseApi } from '@/shared/api';
import { persistRootState } from '@/shared/lib';

export { bootstrapApp } from './bootstrap';

let storeHydrated = false;

export function markStoreHydrated() {
  storeHydrated = true;
}

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    transactions: transactionsReducer,
    categories: categoriesReducer,
    settings: settingsReducer,
    session: sessionReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});

store.subscribe(() => {
  if (!storeHydrated) {
    return;
  }
  persistRootState({
    transactions: store.getState().transactions,
    categories: store.getState().categories,
    settings: store.getState().settings,
  }).catch(() => {
    /* persistence failures are non-fatal */
  });
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export { useAppDispatch, useAppSelector } from './hooks';

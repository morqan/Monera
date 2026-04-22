import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { Transaction } from './types';

export type TransactionsState = {
  items: Transaction[];
};

const initialState: TransactionsState = {
  items: [],
};

const transactionsSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    hydrateTransactions(state, action: PayloadAction<Transaction[]>) {
      state.items = action.payload;
    },
    addTransaction(state, action: PayloadAction<Transaction>) {
      state.items = [action.payload, ...state.items];
    },
    updateTransaction(state, action: PayloadAction<Transaction>) {
      const idx = state.items.findIndex((t) => t.id === action.payload.id);
      if (idx === -1) {
        return;
      }
      state.items[idx] = action.payload;
    },
    deleteTransaction(state, action: PayloadAction<string>) {
      state.items = state.items.filter((t) => t.id !== action.payload);
    },
    reassignCategory(
      state,
      action: PayloadAction<{ fromCategoryId: string; toCategoryId: string }>
    ) {
      const { fromCategoryId, toCategoryId } = action.payload;
      state.items = state.items.map((t) =>
        t.categoryId === fromCategoryId ? { ...t, categoryId: toCategoryId } : t
      );
    },
    deleteByCategory(state, action: PayloadAction<string>) {
      state.items = state.items.filter((t) => t.categoryId !== action.payload);
    },
  },
});

export const {
  hydrateTransactions,
  addTransaction,
  updateTransaction,
  deleteTransaction,
  reassignCategory,
  deleteByCategory,
} = transactionsSlice.actions;

export const transactionsReducer = transactionsSlice.reducer;

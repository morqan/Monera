import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { Budget } from './types';

export type BudgetsState = {
  items: Budget[];
};

const initialState: BudgetsState = {
  items: [],
};

const budgetsSlice = createSlice({
  name: 'budgets',
  initialState,
  reducers: {
    hydrateBudgets(state, action: PayloadAction<Budget[]>) {
      state.items = action.payload;
    },
    setBudget(state, action: PayloadAction<Budget>) {
      const { categoryId, limit } = action.payload;
      const idx = state.items.findIndex((b) => b.categoryId === categoryId);
      if (limit <= 0) {
        if (idx >= 0) {
          state.items.splice(idx, 1);
        }
        return;
      }
      if (idx >= 0) {
        state.items[idx] = { categoryId, limit };
      } else {
        state.items.push({ categoryId, limit });
      }
    },
    clearBudget(state, action: PayloadAction<string>) {
      state.items = state.items.filter((b) => b.categoryId !== action.payload);
    },
  },
});

export const { hydrateBudgets, setBudget, clearBudget } = budgetsSlice.actions;
export const budgetsReducer = budgetsSlice.reducer;

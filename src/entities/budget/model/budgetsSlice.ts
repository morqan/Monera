import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { Budget } from './types';

export type BudgetsState = {
  items: Budget[];
  monthlyLimit: number | null;
};

export type BudgetsHydratePayload = {
  items: Budget[];
  monthlyLimit: number | null;
};

const initialState: BudgetsState = {
  items: [],
  monthlyLimit: null,
};

const budgetsSlice = createSlice({
  name: 'budgets',
  initialState,
  reducers: {
    hydrateBudgets(state, action: PayloadAction<BudgetsHydratePayload>) {
      state.items = action.payload.items;
      state.monthlyLimit = action.payload.monthlyLimit;
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
    setMonthlyLimit(state, action: PayloadAction<number | null>) {
      const value = action.payload;
      state.monthlyLimit = value != null && value > 0 ? value : null;
    },
  },
});

export const { hydrateBudgets, setBudget, clearBudget, setMonthlyLimit } =
  budgetsSlice.actions;
export const budgetsReducer = budgetsSlice.reducer;

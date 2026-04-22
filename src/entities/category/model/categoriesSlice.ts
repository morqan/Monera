import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import { defaultCategories } from '../lib/defaultCategories';
import type { Category } from './types';

export type CategoriesState = {
  items: Category[];
};

const initialState: CategoriesState = {
  items: defaultCategories,
};

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    hydrateCategories(state, action: PayloadAction<Category[]>) {
      state.items = action.payload;
    },
    addCategory(state, action: PayloadAction<Category>) {
      state.items.push(action.payload);
    },
    updateCategory(state, action: PayloadAction<Category>) {
      const idx = state.items.findIndex((c) => c.id === action.payload.id);
      if (idx >= 0) {
        state.items[idx] = action.payload;
      }
    },
    deleteCategory(state, action: PayloadAction<string>) {
      state.items = state.items.filter((c) => c.id !== action.payload);
    },
  },
});

export const {
  hydrateCategories,
  addCategory,
  updateCategory,
  deleteCategory,
} = categoriesSlice.actions;

export const categoriesReducer = categoriesSlice.reducer;

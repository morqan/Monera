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
  },
});

export const { hydrateCategories } = categoriesSlice.actions;

export const categoriesReducer = categoriesSlice.reducer;

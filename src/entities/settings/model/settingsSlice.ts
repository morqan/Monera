import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { Settings } from './types';

export const defaultSettings: Settings = {
  currencyCode: 'RUB',
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState: defaultSettings,
  reducers: {
    hydrateSettings(_state, action: PayloadAction<Settings>) {
      return { ...defaultSettings, ...action.payload };
    },
    patchSettings(state, action: PayloadAction<Partial<Settings>>) {
      Object.assign(state, action.payload);
    },
  },
});

export const { hydrateSettings, patchSettings } = settingsSlice.actions;

export const settingsReducer = settingsSlice.reducer;

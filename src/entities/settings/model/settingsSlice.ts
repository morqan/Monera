import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import { DEFAULT_LOCALE, deviceLocale } from '@/shared/i18n';

import type { Settings } from './types';

export const defaultSettings: Settings = {
  currencyCode: 'RUB',
  locale: deviceLocale ?? DEFAULT_LOCALE,
  theme: 'system',
  notificationsEnabled: false,
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState: defaultSettings,
  reducers: {
    hydrateSettings(_state, action: PayloadAction<Partial<Settings>>) {
      return { ...defaultSettings, ...action.payload };
    },
    patchSettings(state, action: PayloadAction<Partial<Settings>>) {
      Object.assign(state, action.payload);
    },
  },
});

export const { hydrateSettings, patchSettings } = settingsSlice.actions;

export const settingsReducer = settingsSlice.reducer;

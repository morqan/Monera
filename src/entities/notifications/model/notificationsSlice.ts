import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type NotificationsState = {
  lastFiredByCategory: Record<string, string>;
  lastFiredGlobal: string | null;
};

const initialState: NotificationsState = {
  lastFiredByCategory: {},
  lastFiredGlobal: null,
};

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    hydrateNotifications(_state, action: PayloadAction<NotificationsState>) {
      return action.payload;
    },
    markCategoryFired(
      state,
      action: PayloadAction<{ categoryId: string; monthKey: string }>
    ) {
      state.lastFiredByCategory[action.payload.categoryId] =
        action.payload.monthKey;
    },
    markGlobalFired(state, action: PayloadAction<string>) {
      state.lastFiredGlobal = action.payload;
    },
    resetNotifications(state) {
      state.lastFiredByCategory = {};
      state.lastFiredGlobal = null;
    },
  },
});

export const {
  hydrateNotifications,
  markCategoryFired,
  markGlobalFired,
  resetNotifications,
} = notificationsSlice.actions;
export const notificationsReducer = notificationsSlice.reducer;

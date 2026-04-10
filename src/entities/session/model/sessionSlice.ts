import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type SessionState = {
  email: string | null;
};

const initialState: SessionState = {
  email: null,
};

export const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    hydrateSession: (state, action: PayloadAction<string | null>) => {
      state.email = action.payload;
    },
    setSessionUser: (state, action: PayloadAction<string>) => {
      state.email = action.payload;
    },
    clearSession: (state) => {
      state.email = null;
    },
  },
});

export const { hydrateSession, setSessionUser, clearSession } =
  sessionSlice.actions;

export const sessionReducer = sessionSlice.reducer;

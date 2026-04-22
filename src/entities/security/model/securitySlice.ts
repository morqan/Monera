import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type SecurityState = {
  pinHash: string | null;
  pinSalt: string | null;
  biometricsEnabled: boolean;
  locked: boolean;
};

export type SecurityPersisted = {
  pinHash: string | null;
  pinSalt: string | null;
  biometricsEnabled: boolean;
};

const initialState: SecurityState = {
  pinHash: null,
  pinSalt: null,
  biometricsEnabled: false,
  locked: false,
};

const securitySlice = createSlice({
  name: 'security',
  initialState,
  reducers: {
    hydrateSecurity(state, action: PayloadAction<SecurityPersisted>) {
      state.pinHash = action.payload.pinHash;
      state.pinSalt = action.payload.pinSalt;
      state.biometricsEnabled = action.payload.biometricsEnabled;
      state.locked = action.payload.pinHash != null;
    },
    setPin(state, action: PayloadAction<{ hash: string; salt: string }>) {
      state.pinHash = action.payload.hash;
      state.pinSalt = action.payload.salt;
      state.locked = false;
    },
    clearPin(state) {
      state.pinHash = null;
      state.pinSalt = null;
      state.biometricsEnabled = false;
      state.locked = false;
    },
    setBiometricsEnabled(state, action: PayloadAction<boolean>) {
      state.biometricsEnabled = action.payload;
    },
    lock(state) {
      if (state.pinHash != null) {
        state.locked = true;
      }
    },
    unlock(state) {
      state.locked = false;
    },
  },
});

export const {
  hydrateSecurity,
  setPin,
  clearPin,
  setBiometricsEnabled,
  lock,
  unlock,
} = securitySlice.actions;
export const securityReducer = securitySlice.reducer;

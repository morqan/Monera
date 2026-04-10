export const STORAGE_KEYS = {
  transactions: '@monera/transactions',
  categories: '@monera/categories',
  settings: '@monera/settings',
  /** Logged-in user (email only; password is never persisted). */
  sessionUser: '@monera/session-user',
} as const;

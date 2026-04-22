export const STORAGE_KEYS = {
  transactions: '@monera/transactions',
  categories: '@monera/categories',
  budgets: '@monera/budgets',
  settings: '@monera/settings',
  /** Logged-in user (email only; password is never persisted). */
  sessionUser: '@monera/session-user',
  security: '@monera/security',
} as const;

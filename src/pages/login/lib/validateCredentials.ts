const EMAIL_RE =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

/**
 * Medium strength: ≥8 chars, lowercase, uppercase, digit.
 */
export function isValidEmail(email: string): boolean {
  const t = email.trim();
  return t.length > 0 && EMAIL_RE.test(t);
}

export function isMediumPassword(password: string): boolean {
  if (password.length < 8) {
    return false;
  }
  if (!/[a-z]/.test(password)) {
    return false;
  }
  if (!/[A-Z]/.test(password)) {
    return false;
  }
  if (!/\d/.test(password)) {
    return false;
  }
  return true;
}

export type LoginValidationError =
  | 'email'
  | 'password'
  | 'password_weak'
  | null;

export function getLoginValidationError(
  email: string,
  password: string
): LoginValidationError {
  if (!isValidEmail(email)) {
    return 'email';
  }
  if (password.length === 0) {
    return 'password';
  }
  if (!isMediumPassword(password)) {
    return 'password_weak';
  }
  return null;
}

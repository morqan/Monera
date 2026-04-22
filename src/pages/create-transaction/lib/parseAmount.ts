import { evaluateExpression } from './evaluateExpression';

export function parseAmount(raw: string): number | null {
  const result = evaluateExpression(raw);
  if (result == null || result <= 0) {
    return null;
  }
  return result;
}

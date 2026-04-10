export function parseAmount(raw: string): number | null {
  const normalized = raw.replace(/\s/g, '').replace(',', '.');
  if (normalized === '' || normalized === '.') {
    return null;
  }
  const n = Number.parseFloat(normalized);
  if (!Number.isFinite(n) || n <= 0) {
    return null;
  }
  return Math.round(n * 100) / 100;
}

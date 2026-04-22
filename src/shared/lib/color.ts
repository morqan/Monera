export function hexToRgba(input: string, alpha: number): string {
  if (input.startsWith('rgba') || input.startsWith('rgb')) {
    return input;
  }
  const hex = input.replace('#', '');
  if (hex.length !== 6) {
    return input;
  }
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

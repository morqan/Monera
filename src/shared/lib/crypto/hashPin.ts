/* eslint-disable no-bitwise */
const FNV_OFFSET = 2166136261;
const FNV_PRIME = 16777619;
const ROUNDS = 5000;

function fnvRound(seed: number, input: string): number {
  let h = seed >>> 0;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, FNV_PRIME) >>> 0;
  }
  return h >>> 0;
}

export function hashPin(pin: string, salt: string): string {
  let h1 = FNV_OFFSET;
  let h2 = FNV_OFFSET ^ 0x9e3779b9;
  const base = `${salt}:${pin}:${salt.length}`;
  for (let r = 0; r < ROUNDS; r++) {
    h1 = fnvRound(h1 ^ r, base);
    h2 = fnvRound(h2 ^ (r * 2654435761), `${r}:${base}`);
  }
  return (
    (h1 >>> 0).toString(16).padStart(8, '0') +
    (h2 >>> 0).toString(16).padStart(8, '0')
  );
}

export function generateSalt(): string {
  const bytes = new Uint8Array(16);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = Math.floor(Math.random() * 256);
  }
  let out = '';
  for (let i = 0; i < bytes.length; i++) {
    out += bytes[i].toString(16).padStart(2, '0');
  }
  return out;
}

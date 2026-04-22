const OPERATORS = new Set(['+', '-', '*', '/']);

function normalize(raw: string): string {
  return raw
    .replace(/\s/g, '')
    .replace(/,/g, '.')
    .replace(/[×x]/gi, '*')
    .replace(/[÷]/g, '/')
    .replace(/[−–—]/g, '-');
}

type Tokenizer = {
  src: string;
  i: number;
};

function parseNumber(tk: Tokenizer): number | null {
  let j = tk.i;
  let hasDot = false;
  while (j < tk.src.length) {
    const ch = tk.src[j];
    if (ch >= '0' && ch <= '9') {
      j++;
    } else if (ch === '.' && !hasDot) {
      hasDot = true;
      j++;
    } else {
      break;
    }
  }
  if (j === tk.i) return null;
  const n = Number.parseFloat(tk.src.slice(tk.i, j));
  if (!Number.isFinite(n)) return null;
  tk.i = j;
  return n;
}

function parseTerm(tk: Tokenizer): number | null {
  let acc = parseNumber(tk);
  if (acc == null) return null;
  while (tk.i < tk.src.length) {
    const op = tk.src[tk.i];
    if (op !== '*' && op !== '/') break;
    tk.i++;
    const rhs = parseNumber(tk);
    if (rhs == null) return null;
    if (op === '/') {
      if (rhs === 0) return null;
      acc = acc / rhs;
    } else {
      acc = acc * rhs;
    }
  }
  return acc;
}

function parseExpr(tk: Tokenizer): number | null {
  let acc = parseTerm(tk);
  if (acc == null) return null;
  while (tk.i < tk.src.length) {
    const op = tk.src[tk.i];
    if (op !== '+' && op !== '-') break;
    tk.i++;
    const rhs = parseTerm(tk);
    if (rhs == null) return null;
    acc = op === '+' ? acc + rhs : acc - rhs;
  }
  return acc;
}

export function evaluateExpression(raw: string): number | null {
  const src = normalize(raw);
  if (src.length === 0) return null;
  const tk: Tokenizer = { src, i: 0 };
  const result = parseExpr(tk);
  if (result == null || tk.i !== src.length) return null;
  if (!Number.isFinite(result)) return null;
  return Math.round(result * 100) / 100;
}

export function hasOperators(raw: string): boolean {
  const normalized = normalize(raw);
  for (let i = 0; i < normalized.length; i++) {
    if (OPERATORS.has(normalized[i])) return true;
  }
  return false;
}

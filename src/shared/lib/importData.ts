import type { Category } from '@/entities/category';
import type { Transaction, TransactionKind } from '@/entities/transaction';

import { createId } from './createId';

export type ImportFormat = 'json' | 'csv';

export type ImportResult = {
  format: ImportFormat;
  candidates: Transaction[];
  skipped: number;
  skippedReasons: string[];
};

export type ParseError = {
  reason: string;
};

export type ImportParseOutcome =
  | { ok: true; result: ImportResult }
  | { ok: false; error: ParseError };

function normalizeKind(value: unknown): TransactionKind | null {
  if (value === 'income' || value === 'expense') return value;
  return null;
}

function normalizeISODate(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  if (!/^\d{4}-\d{2}-\d{2}/.test(trimmed)) return null;
  const d = new Date(trimmed);
  if (Number.isNaN(d.getTime())) return null;
  return trimmed.slice(0, 10);
}

function normalizeAmount(value: unknown): number | null {
  const num = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(num) || num <= 0) return null;
  return Math.round(num * 100) / 100;
}

function resolveCategoryId(
  hint: unknown,
  categories: Category[]
): string | null {
  if (typeof hint !== 'string' || hint.length === 0) return null;
  const byId = categories.find((c) => c.id === hint);
  if (byId) return byId.id;
  const byLocale = categories.find((c) => c.localeKey === hint);
  if (byLocale) return byLocale.id;
  const byName = categories.find(
    (c) => c.name.toLowerCase() === hint.toLowerCase()
  );
  if (byName) return byName.id;
  return null;
}

function buildTransaction(params: {
  id?: string;
  kind: TransactionKind;
  amount: number;
  categoryId: string;
  date: string;
  note?: string;
  createdAt?: string;
}): Transaction {
  const createdAt = params.createdAt ?? new Date().toISOString();
  return {
    id: params.id ?? createId(),
    kind: params.kind,
    amount: params.amount,
    categoryId: params.categoryId,
    date: params.date,
    note: params.note ?? '',
    createdAt,
  };
}

type RowDraft = {
  id?: unknown;
  kind?: unknown;
  amount?: unknown;
  categoryId?: unknown;
  category?: unknown;
  date?: unknown;
  note?: unknown;
  createdAt?: unknown;
};

function parseRow(
  row: RowDraft,
  categories: Category[]
):
  | { tx: Transaction; reason?: undefined }
  | { tx?: undefined; reason: string } {
  const kind = normalizeKind(row.kind);
  if (!kind) return { reason: 'bad kind' };
  const amount = normalizeAmount(row.amount);
  if (amount == null) return { reason: 'bad amount' };
  const date = normalizeISODate(row.date);
  if (!date) return { reason: 'bad date' };
  const categoryHint = row.categoryId ?? row.category;
  const categoryId = resolveCategoryId(categoryHint, categories);
  if (!categoryId) return { reason: 'unknown category' };
  return {
    tx: buildTransaction({
      id: typeof row.id === 'string' ? row.id : undefined,
      kind,
      amount,
      categoryId,
      date,
      note: typeof row.note === 'string' ? row.note : undefined,
      createdAt: typeof row.createdAt === 'string' ? row.createdAt : undefined,
    }),
  };
}

function parseJson(raw: string, categories: Category[]): ImportParseOutcome {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return { ok: false, error: { reason: 'invalid json' } };
  }
  const rows: unknown[] = Array.isArray(parsed)
    ? parsed
    : Array.isArray((parsed as { transactions?: unknown })?.transactions)
    ? (parsed as { transactions: unknown[] }).transactions
    : [];
  if (rows.length === 0) {
    return { ok: false, error: { reason: 'no transactions' } };
  }
  const candidates: Transaction[] = [];
  const reasons: string[] = [];
  let skipped = 0;
  for (const row of rows) {
    if (row == null || typeof row !== 'object') {
      skipped++;
      continue;
    }
    const outcome = parseRow(row as RowDraft, categories);
    if (outcome.tx) {
      candidates.push(outcome.tx);
    } else {
      skipped++;
      reasons.push(outcome.reason);
    }
  }
  return {
    ok: true,
    result: {
      format: 'json',
      candidates,
      skipped,
      skippedReasons: reasons,
    },
  };
}

function parseCsvRow(line: string): string[] {
  const out: string[] = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"') {
        if (line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        current += ch;
      }
      continue;
    }
    if (ch === '"') {
      inQuotes = true;
      continue;
    }
    if (ch === ',') {
      out.push(current);
      current = '';
      continue;
    }
    current += ch;
  }
  out.push(current);
  return out;
}

function parseCsv(raw: string, categories: Category[]): ImportParseOutcome {
  const lines = raw
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);
  if (lines.length < 2) {
    return { ok: false, error: { reason: 'no rows' } };
  }
  const header = parseCsvRow(lines[0]).map((h) => h.toLowerCase());
  const idx = {
    id: header.indexOf('id'),
    date: header.indexOf('date'),
    kind: header.indexOf('kind'),
    amount: header.indexOf('amount'),
    category: header.indexOf('category'),
    note: header.indexOf('note'),
    createdAt: header.indexOf('createdat'),
  };
  if (idx.kind < 0 || idx.amount < 0 || idx.category < 0 || idx.date < 0) {
    return { ok: false, error: { reason: 'missing columns' } };
  }
  const candidates: Transaction[] = [];
  const reasons: string[] = [];
  let skipped = 0;
  for (let i = 1; i < lines.length; i++) {
    const cells = parseCsvRow(lines[i]);
    const outcome = parseRow(
      {
        id: idx.id >= 0 ? cells[idx.id] : undefined,
        date: cells[idx.date],
        kind: cells[idx.kind],
        amount: cells[idx.amount],
        category: cells[idx.category],
        note: idx.note >= 0 ? cells[idx.note] : undefined,
        createdAt: idx.createdAt >= 0 ? cells[idx.createdAt] : undefined,
      },
      categories
    );
    if (outcome.tx) {
      candidates.push(outcome.tx);
    } else {
      skipped++;
      reasons.push(outcome.reason);
    }
  }
  return {
    ok: true,
    result: {
      format: 'csv',
      candidates,
      skipped,
      skippedReasons: reasons,
    },
  };
}

export function parseImport(
  raw: string,
  categories: Category[]
): ImportParseOutcome {
  const trimmed = raw.trim();
  if (trimmed.length === 0) {
    return { ok: false, error: { reason: 'empty' } };
  }
  if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
    return parseJson(trimmed, categories);
  }
  return parseCsv(trimmed, categories);
}

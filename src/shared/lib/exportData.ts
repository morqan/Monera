import type { Budget } from '@/entities/budget';
import type { Category } from '@/entities/category';
import type { Transaction } from '@/entities/transaction';

export type ExportBundle = {
  exportedAt: string;
  transactions: Transaction[];
  categories: Category[];
  budgets: Budget[];
};

export function buildJsonExport(bundle: ExportBundle): string {
  return JSON.stringify(bundle, null, 2);
}

const CSV_HEADER = 'id,date,kind,amount,category,note,createdAt';

function escapeCsv(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function buildCsvExport(
  transactions: Transaction[],
  categories: Category[]
): string {
  const catMap = new Map(categories.map((c) => [c.id, c]));
  const rows = transactions.map((t) => {
    const cat = catMap.get(t.categoryId);
    const categoryName = cat?.localeKey ?? cat?.name ?? '';
    return [
      t.id,
      t.date,
      t.kind,
      String(t.amount),
      escapeCsv(categoryName),
      escapeCsv(t.note ?? ''),
      t.createdAt,
    ].join(',');
  });
  return [CSV_HEADER, ...rows].join('\n');
}

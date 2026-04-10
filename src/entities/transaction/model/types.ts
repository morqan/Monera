export type TransactionKind = 'income' | 'expense';

export type Transaction = {
  id: string;
  kind: TransactionKind;
  amount: number;
  categoryId: string;
  date: string;
  note: string;
  createdAt: string;
};

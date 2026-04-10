import type { TransactionKind } from '@/entities/transaction';

export type Category = {
  id: string;
  name: string;
  kind: TransactionKind;
};

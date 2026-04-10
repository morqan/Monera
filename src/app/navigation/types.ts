import type { Transaction } from '@/entities/transaction';

export type CreateTransactionScreenParams = {
  /** Редактирование по id из store */
  transactionId?: string;
  /** Снимок транзакции для открытия формы (id сохраняется при сохранении) */
  transaction?: Transaction;
};

export type RootStackParamList = {
  Login: undefined;
  TransactionsList: undefined;
  CreateTransaction: CreateTransactionScreenParams | undefined;
};

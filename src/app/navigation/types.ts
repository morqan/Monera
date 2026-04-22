import type { Transaction, TransactionKind } from '@/entities/transaction';

export type CreateTransactionScreenParams = {
  /** Редактирование по id из store */
  transactionId?: string;
  /** Снимок транзакции для открытия формы (id сохраняется при сохранении) */
  transaction?: Transaction;
  /** Предвыбранная категория */
  categoryId?: string;
  /** Предвыбранный тип */
  kind?: TransactionKind;
};

export type EditCategoryScreenParams = {
  /** Редактирование существующей категории */
  categoryId?: string;
  /** Тип по умолчанию при создании */
  defaultKind?: TransactionKind;
};

export type CategoryTransactionsScreenParams = {
  categoryId: string;
};

export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  TransactionsList: undefined;
  CategoryTransactions: CategoryTransactionsScreenParams;
  CreateTransaction: CreateTransactionScreenParams | undefined;
  Settings: undefined;
  EditCategory: EditCategoryScreenParams | undefined;
  ManageCategories: undefined;
  Insights: undefined;
};

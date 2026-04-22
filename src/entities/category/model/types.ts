import type { TransactionKind } from '@/entities/transaction';

export type Category = {
  id: string;
  name: string;
  kind: TransactionKind;
  /** Если задан — категория встроенная и её имя берётся из i18n. */
  localeKey?: string;
  /** Эмодзи или имя иконки. Опционально для совместимости. */
  icon?: string;
  /** HEX-цвет акцента. Опционально. */
  color?: string;
};

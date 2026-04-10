import type { Category } from '../model/types';

export const defaultIncomeCategories: Category[] = [
  { id: 'inc-salary', name: 'Зарплата', kind: 'income' },
  { id: 'inc-bonus', name: 'Премия', kind: 'income' },
  { id: 'inc-freelance', name: 'Фриланс', kind: 'income' },
  { id: 'inc-invest', name: 'Инвестиции', kind: 'income' },
  { id: 'inc-gift', name: 'Подарок', kind: 'income' },
  { id: 'inc-other', name: 'Другое', kind: 'income' },
];

export const defaultExpenseCategories: Category[] = [
  { id: 'exp-food', name: 'Продукты', kind: 'expense' },
  { id: 'exp-home', name: 'Дом', kind: 'expense' },
  { id: 'exp-transport', name: 'Транспорт', kind: 'expense' },
  { id: 'exp-health', name: 'Здоровье', kind: 'expense' },
  { id: 'exp-leisure', name: 'Досуг', kind: 'expense' },
  { id: 'exp-subscriptions', name: 'Подписки', kind: 'expense' },
  { id: 'exp-other', name: 'Другое', kind: 'expense' },
];

export const defaultCategories: Category[] = [
  ...defaultIncomeCategories,
  ...defaultExpenseCategories,
];

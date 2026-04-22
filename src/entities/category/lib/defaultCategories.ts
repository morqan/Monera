import type { Category } from '../model/types';

export const defaultIncomeCategories: Category[] = [
  {
    id: 'inc-salary',
    name: 'Зарплата',
    kind: 'income',
    localeKey: 'salary',
    icon: '💼',
    color: '#3DFFB4',
  },
  {
    id: 'inc-bonus',
    name: 'Премия',
    kind: 'income',
    localeKey: 'bonus',
    icon: '🎉',
    color: '#FFC857',
  },
  {
    id: 'inc-freelance',
    name: 'Фриланс',
    kind: 'income',
    localeKey: 'freelance',
    icon: '🧑‍💻',
    color: '#00D4FF',
  },
  {
    id: 'inc-invest',
    name: 'Инвестиции',
    kind: 'income',
    localeKey: 'invest',
    icon: '📈',
    color: '#7CF6A7',
  },
  {
    id: 'inc-gift',
    name: 'Подарок',
    kind: 'income',
    localeKey: 'gift',
    icon: '🎁',
    color: '#FF9FD1',
  },
  {
    id: 'inc-other',
    name: 'Другое',
    kind: 'income',
    localeKey: 'otherIncome',
    icon: '✨',
    color: '#B6FFF9',
  },
];

export const defaultExpenseCategories: Category[] = [
  {
    id: 'exp-food',
    name: 'Продукты',
    kind: 'expense',
    localeKey: 'food',
    icon: '🛒',
    color: '#FFB86B',
  },
  {
    id: 'exp-home',
    name: 'Дом',
    kind: 'expense',
    localeKey: 'home',
    icon: '🏠',
    color: '#9FD8FF',
  },
  {
    id: 'exp-transport',
    name: 'Транспорт',
    kind: 'expense',
    localeKey: 'transport',
    icon: '🚌',
    color: '#C2A0FF',
  },
  {
    id: 'exp-health',
    name: 'Здоровье',
    kind: 'expense',
    localeKey: 'health',
    icon: '💊',
    color: '#FF6BA3',
  },
  {
    id: 'exp-leisure',
    name: 'Досуг',
    kind: 'expense',
    localeKey: 'leisure',
    icon: '🎮',
    color: '#FFE066',
  },
  {
    id: 'exp-subscriptions',
    name: 'Подписки',
    kind: 'expense',
    localeKey: 'subscriptions',
    icon: '🔁',
    color: '#64FFE1',
  },
  {
    id: 'exp-other',
    name: 'Другое',
    kind: 'expense',
    localeKey: 'otherExpense',
    icon: '•••',
    color: '#C8D4FF',
  },
];

export const defaultCategories: Category[] = [
  ...defaultIncomeCategories,
  ...defaultExpenseCategories,
];

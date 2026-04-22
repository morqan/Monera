import type { Category } from '../model/types';

export const defaultIncomeCategories: Category[] = [
  {
    id: 'inc-salary',
    name: 'Зарплата',
    kind: 'income',
    localeKey: 'salary',
    icon: 'Briefcase',
    color: '#3DFFB4',
  },
  {
    id: 'inc-bonus',
    name: 'Премия',
    kind: 'income',
    localeKey: 'bonus',
    icon: 'PartyPopper',
    color: '#FFC857',
  },
  {
    id: 'inc-freelance',
    name: 'Фриланс',
    kind: 'income',
    localeKey: 'freelance',
    icon: 'Laptop',
    color: '#00D4FF',
  },
  {
    id: 'inc-invest',
    name: 'Инвестиции',
    kind: 'income',
    localeKey: 'invest',
    icon: 'TrendingUp',
    color: '#7CF6A7',
  },
  {
    id: 'inc-gift',
    name: 'Подарок',
    kind: 'income',
    localeKey: 'gift',
    icon: 'Gift',
    color: '#FF9FD1',
  },
  {
    id: 'inc-other',
    name: 'Другое',
    kind: 'income',
    localeKey: 'otherIncome',
    icon: 'Sparkles',
    color: '#B6FFF9',
  },
];

export const defaultExpenseCategories: Category[] = [
  {
    id: 'exp-food',
    name: 'Продукты',
    kind: 'expense',
    localeKey: 'food',
    icon: 'ShoppingCart',
    color: '#FFB86B',
  },
  {
    id: 'exp-home',
    name: 'Дом',
    kind: 'expense',
    localeKey: 'home',
    icon: 'Home',
    color: '#9FD8FF',
  },
  {
    id: 'exp-transport',
    name: 'Транспорт',
    kind: 'expense',
    localeKey: 'transport',
    icon: 'Bus',
    color: '#C2A0FF',
  },
  {
    id: 'exp-health',
    name: 'Здоровье',
    kind: 'expense',
    localeKey: 'health',
    icon: 'Pill',
    color: '#FF6BA3',
  },
  {
    id: 'exp-leisure',
    name: 'Досуг',
    kind: 'expense',
    localeKey: 'leisure',
    icon: 'Gamepad2',
    color: '#FFE066',
  },
  {
    id: 'exp-subscriptions',
    name: 'Подписки',
    kind: 'expense',
    localeKey: 'subscriptions',
    icon: 'RefreshCw',
    color: '#64FFE1',
  },
  {
    id: 'exp-other',
    name: 'Другое',
    kind: 'expense',
    localeKey: 'otherExpense',
    icon: 'MoreHorizontal',
    color: '#C8D4FF',
  },
];

export const defaultCategories: Category[] = [
  ...defaultIncomeCategories,
  ...defaultExpenseCategories,
];

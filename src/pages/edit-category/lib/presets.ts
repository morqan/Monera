import type { CategoryIconName } from '@/shared/ui';

export type IconGroupKey =
  | 'money'
  | 'work'
  | 'tech'
  | 'leisure'
  | 'health'
  | 'shopping'
  | 'food'
  | 'home'
  | 'transport'
  | 'nature'
  | 'people'
  | 'other';

export const ICON_GROUPS: Array<{
  key: IconGroupKey;
  icons: CategoryIconName[];
}> = [
  {
    key: 'money',
    icons: [
      'Wallet',
      'Banknote',
      'Coins',
      'PiggyBank',
      'CreditCard',
      'DollarSign',
      'Bitcoin',
      'TrendingUp',
      'TrendingDown',
      'Percent',
      'Calculator',
      'Receipt',
      'Landmark',
    ],
  },
  {
    key: 'work',
    icons: [
      'Briefcase',
      'Building2',
      'FileText',
      'Pencil',
      'BookOpen',
      'GraduationCap',
    ],
  },
  {
    key: 'tech',
    icons: [
      'Laptop',
      'Monitor',
      'Smartphone',
      'Printer',
      'Wifi',
      'Headphones',
      'Tv',
      'Camera',
      'Gamepad2',
      'Dices',
    ],
  },
  {
    key: 'leisure',
    icons: [
      'Film',
      'Music',
      'Ticket',
      'Palette',
      'Popcorn',
      'PartyPopper',
      'Sparkles',
      'Gift',
      'Star',
    ],
  },
  {
    key: 'health',
    icons: [
      'Heart',
      'HeartPulse',
      'Pill',
      'Stethoscope',
      'Activity',
      'Glasses',
      'Dumbbell',
    ],
  },
  {
    key: 'shopping',
    icons: ['ShoppingCart', 'ShoppingBag', 'Store', 'Tag', 'Package', 'Shirt'],
  },
  {
    key: 'food',
    icons: [
      'UtensilsCrossed',
      'Utensils',
      'Coffee',
      'CupSoda',
      'Beer',
      'Wine',
      'Pizza',
      'Sandwich',
      'Soup',
      'Cookie',
      'IceCream',
      'Apple',
    ],
  },
  {
    key: 'home',
    icons: [
      'Home',
      'Sofa',
      'Bed',
      'Bath',
      'Lightbulb',
      'Flame',
      'Droplets',
      'Wrench',
      'Hammer',
      'Fuel',
    ],
  },
  {
    key: 'transport',
    icons: [
      'Car',
      'Bus',
      'Train',
      'TramFront',
      'Truck',
      'Ship',
      'Plane',
      'Bike',
      'MapPin',
      'Luggage',
      'Tent',
      'Mountain',
    ],
  },
  {
    key: 'nature',
    icons: ['Sun', 'Cloud', 'TreePine', 'Leaf', 'PawPrint'],
  },
  {
    key: 'people',
    icons: ['Baby', 'User', 'Users'],
  },
  {
    key: 'other',
    icons: ['RefreshCw', 'MoreHorizontal'],
  },
];

export const ICON_PRESETS: CategoryIconName[] = ICON_GROUPS.flatMap(
  (g) => g.icons
);

export const COLOR_PRESETS = [
  '#3DFFB4',
  '#00D4FF',
  '#0057FF',
  '#C2A0FF',
  '#FF9FD1',
  '#FF6BA3',
  '#E4005B',
  '#FFB86B',
  '#FFC857',
  '#FFE066',
  '#7CF6A7',
  '#00A356',
  '#64FFE1',
  '#9FD8FF',
  '#B6FFF9',
  '#C8D4FF',
];

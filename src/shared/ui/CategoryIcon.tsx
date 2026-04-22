import {
  Baby,
  Banknote,
  Beer,
  Bike,
  BookOpen,
  Briefcase,
  Bus,
  Camera,
  Car,
  Coffee,
  Coins,
  Cookie,
  CreditCard,
  DollarSign,
  Dumbbell,
  Film,
  Fuel,
  Gamepad2,
  Gift,
  GraduationCap,
  HeartPulse,
  Home,
  Landmark,
  Laptop,
  Lightbulb,
  MoreHorizontal,
  Music,
  PartyPopper,
  PawPrint,
  PiggyBank,
  Pill,
  Pizza,
  Plane,
  RefreshCw,
  Shirt,
  ShoppingBag,
  ShoppingCart,
  Smartphone,
  Sofa,
  Sparkles,
  Stethoscope,
  Train,
  TrendingUp,
  UtensilsCrossed,
  Wallet,
  type LucideIcon,
} from 'lucide-react-native';
import { StyleSheet, Text } from 'react-native';

export const CATEGORY_ICON_MAP = {
  Baby,
  Banknote,
  Beer,
  Bike,
  BookOpen,
  Briefcase,
  Bus,
  Camera,
  Car,
  Coffee,
  Coins,
  Cookie,
  CreditCard,
  DollarSign,
  Dumbbell,
  Film,
  Fuel,
  Gamepad2,
  Gift,
  GraduationCap,
  HeartPulse,
  Home,
  Landmark,
  Laptop,
  Lightbulb,
  MoreHorizontal,
  Music,
  PartyPopper,
  PawPrint,
  PiggyBank,
  Pill,
  Pizza,
  Plane,
  RefreshCw,
  Shirt,
  ShoppingBag,
  ShoppingCart,
  Smartphone,
  Sofa,
  Sparkles,
  Stethoscope,
  Train,
  TrendingUp,
  UtensilsCrossed,
  Wallet,
} satisfies Record<string, LucideIcon>;

export type CategoryIconName = keyof typeof CATEGORY_ICON_MAP;

export const CATEGORY_ICON_NAMES = Object.keys(
  CATEGORY_ICON_MAP
) as CategoryIconName[];

export function isCategoryIconName(value: unknown): value is CategoryIconName {
  return (
    typeof value === 'string' &&
    Object.prototype.hasOwnProperty.call(CATEGORY_ICON_MAP, value)
  );
}

type Props = {
  icon: string | null | undefined;
  size: number;
  color: string;
  strokeWidth?: number;
};

export function CategoryIcon({ icon, size, color, strokeWidth = 1.75 }: Props) {
  if (isCategoryIconName(icon)) {
    const Icon = CATEGORY_ICON_MAP[icon];
    return <Icon size={size} color={color} strokeWidth={strokeWidth} />;
  }

  const fallback = icon && icon.length > 0 ? icon : '•';
  return (
    <Text style={[styles.glyph, { fontSize: size, color }]}>{fallback}</Text>
  );
}

const styles = StyleSheet.create({
  glyph: {
    textAlign: 'center',
    lineHeight: undefined,
  },
});

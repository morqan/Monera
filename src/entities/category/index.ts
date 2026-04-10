export type { Category } from './model/types';
export {
  defaultCategories,
  defaultExpenseCategories,
  defaultIncomeCategories,
} from './lib/defaultCategories';
export { categoriesReducer, hydrateCategories } from './model/categoriesSlice';
export type { CategoriesState } from './model/categoriesSlice';

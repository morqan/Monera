export type { Category } from './model/types';
export {
  defaultCategories,
  defaultExpenseCategories,
  defaultIncomeCategories,
} from './lib/defaultCategories';
export { useCategoryName } from './lib/useCategoryName';
export {
  addCategory,
  categoriesReducer,
  deleteCategory,
  hydrateCategories,
  updateCategory,
} from './model/categoriesSlice';
export type { CategoriesState } from './model/categoriesSlice';

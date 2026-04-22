import { useTranslation } from '@/shared/i18n';

import type { Category } from '../model/types';

export function useCategoryName() {
  const { t } = useTranslation();
  return (category: Pick<Category, 'name' | 'localeKey'>) => {
    if (category.localeKey) {
      return t(`categories.${category.localeKey}` as never, {
        defaultValue: category.name,
      });
    }
    return category.name;
  };
}

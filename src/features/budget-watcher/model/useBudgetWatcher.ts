import { useEffect, useRef } from 'react';

import { useAppDispatch, useAppSelector } from '@/app/store';
import { markCategoryFired, markGlobalFired } from '@/entities/notifications';
import { useTranslation } from '@/shared/i18n';
import {
  currentMonthKey,
  fireBudgetNotification,
  formatMoney,
  monthKeyFromDateString,
} from '@/shared/lib';

export function useBudgetWatcher() {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const enabled = useAppSelector((s) => s.settings.notificationsEnabled);
  const currency = useAppSelector((s) => s.settings.currencyCode);
  const locale = useAppSelector((s) => s.settings.locale);
  const transactions = useAppSelector((s) => s.transactions.items);
  const categories = useAppSelector((s) => s.categories.items);
  const budgets = useAppSelector((s) => s.budgets.items);
  const monthlyLimit = useAppSelector((s) => s.budgets.monthlyLimit);
  const lastFiredByCategory = useAppSelector(
    (s) => s.notifications.lastFiredByCategory
  );
  const lastFiredGlobal = useAppSelector(
    (s) => s.notifications.lastFiredGlobal
  );

  const scheduledRef = useRef(false);

  useEffect(() => {
    if (!enabled) return;
    if (scheduledRef.current) return;
    scheduledRef.current = true;

    const timer = setTimeout(() => {
      scheduledRef.current = false;
      const month = currentMonthKey();
      const spentByCategory = new Map<string, number>();
      let totalExpenseThisMonth = 0;
      for (const tx of transactions) {
        if (tx.kind !== 'expense') continue;
        if (monthKeyFromDateString(tx.date) !== month) continue;
        spentByCategory.set(
          tx.categoryId,
          (spentByCategory.get(tx.categoryId) ?? 0) + tx.amount
        );
        totalExpenseThisMonth += tx.amount;
      }

      for (const b of budgets) {
        const spent = spentByCategory.get(b.categoryId) ?? 0;
        if (spent <= b.limit) continue;
        if (lastFiredByCategory[b.categoryId] === month) continue;
        const category = categories.find((c) => c.id === b.categoryId);
        const name = category
          ? category.localeKey
            ? t(`categories.${category.localeKey}` as 'categories.salary')
            : category.name
          : '';
        const over = spent - b.limit;
        void fireBudgetNotification(
          t('notifications.categoryTitle', { category: name }),
          t('notifications.categoryBody', {
            over: formatMoney(over, currency, locale),
            limit: formatMoney(b.limit, currency, locale),
          })
        );
        dispatch(
          markCategoryFired({ categoryId: b.categoryId, monthKey: month })
        );
      }

      if (
        monthlyLimit != null &&
        totalExpenseThisMonth > monthlyLimit &&
        lastFiredGlobal !== month
      ) {
        const over = totalExpenseThisMonth - monthlyLimit;
        void fireBudgetNotification(
          t('notifications.globalTitle'),
          t('notifications.globalBody', {
            over: formatMoney(over, currency, locale),
            limit: formatMoney(monthlyLimit, currency, locale),
          })
        );
        dispatch(markGlobalFired(month));
      }
    }, 250);

    return () => {
      clearTimeout(timer);
      scheduledRef.current = false;
    };
  }, [
    enabled,
    transactions,
    categories,
    budgets,
    monthlyLimit,
    lastFiredByCategory,
    lastFiredGlobal,
    currency,
    locale,
    t,
    dispatch,
  ]);
}

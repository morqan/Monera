import { useEffect, type PropsWithChildren } from 'react';

import { useAppSelector } from '@/app/store';
import { setAppLocale } from '@/shared/i18n';

/**
 * Синхронизирует i18next с пользовательской настройкой locale.
 */
export function LocaleGate({ children }: PropsWithChildren) {
  const locale = useAppSelector((s) => s.settings.locale);

  useEffect(() => {
    if (locale) {
      setAppLocale(locale);
    }
  }, [locale]);

  return <>{children}</>;
}

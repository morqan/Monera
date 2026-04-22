import { type PropsWithChildren } from 'react';
import { Provider } from 'react-redux';
import { store } from '@/app/store';
import '@/shared/i18n';

import { ErrorBoundary } from './ErrorBoundary';
import { LocaleGate } from './LocaleGate';
import { StoreGate } from './StoreGate';

/**
 * Root provider composition for the application.
 */
export function AppProviders({ children }: PropsWithChildren) {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <StoreGate>
          <LocaleGate>{children}</LocaleGate>
        </StoreGate>
      </Provider>
    </ErrorBoundary>
  );
}

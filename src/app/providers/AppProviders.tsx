import { type PropsWithChildren } from 'react';
import { Provider } from 'react-redux';
import { store } from '@/app/store';

import { StoreGate } from './StoreGate';

/**
 * Root provider composition for the application.
 */
export function AppProviders({ children }: PropsWithChildren) {
  return (
    <Provider store={store}>
      <StoreGate>{children}</StoreGate>
    </Provider>
  );
}

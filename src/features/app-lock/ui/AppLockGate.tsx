import { useEffect, useRef, type PropsWithChildren } from 'react';
import { AppState, type AppStateStatus } from 'react-native';

import { useAppDispatch, useAppSelector } from '@/app/store';
import { lock } from '@/entities/security';

import { LockScreen } from './LockScreen';

export function AppLockGate({ children }: PropsWithChildren) {
  const dispatch = useAppDispatch();
  const pinHash = useAppSelector((s) => s.security.pinHash);
  const locked = useAppSelector((s) => s.security.locked);
  const lastStateRef = useRef<AppStateStatus>(AppState.currentState);

  useEffect(() => {
    const sub = AppState.addEventListener('change', (next) => {
      const prev = lastStateRef.current;
      lastStateRef.current = next;
      if (prev === 'active' && (next === 'background' || next === 'inactive')) {
        dispatch(lock());
      }
    });
    return () => sub.remove();
  }, [dispatch]);

  if (pinHash && locked) {
    return <LockScreen />;
  }
  return <>{children}</>;
}

import { type PropsWithChildren, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  useColorScheme,
  View,
} from 'react-native';
import { getAppColors } from '@/app/styles/theme';
import { bootstrapApp, markStoreHydrated, useAppDispatch } from '@/app/store';

export function StoreGate({ children }: PropsWithChildren) {
  const dispatch = useAppDispatch();
  const scheme = useColorScheme();
  const colors = getAppColors(scheme === 'dark');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;

    dispatch(bootstrapApp())
      .unwrap()
      .catch(() => {
        /* ignore: keep empty / defaults */
      })
      .finally(() => {
        if (active) {
          markStoreHydrated();
          setReady(true);
        }
      });

    return () => {
      active = false;
    };
  }, [dispatch]);

  if (!ready) {
    return (
      <View style={[styles.boot, { backgroundColor: colors.background }]}>
        <ActivityIndicator color={colors.accent} size="large" />
      </View>
    );
  }

  return <>{children}</>;
}

const styles = StyleSheet.create({
  boot: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

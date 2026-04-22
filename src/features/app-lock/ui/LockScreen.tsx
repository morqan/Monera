import { Fingerprint, Lock, ScanFace } from 'lucide-react-native';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, useColorScheme, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { getAppColors, theme } from '@/app/styles/theme';
import { useAppDispatch, useAppSelector } from '@/app/store';
import { unlock } from '@/entities/security';
import { useTranslation } from '@/shared/i18n';
import {
  authenticateWithBiometry,
  getBiometryKind,
  hashPin,
  type BiometryKind,
} from '@/shared/lib';

import { PinDots } from './PinDots';
import { PinPad } from './PinPad';

const PIN_LENGTH = 4;

export function LockScreen() {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const colors = getAppColors(isDark);
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const pinHash = useAppSelector((s) => s.security.pinHash);
  const pinSalt = useAppSelector((s) => s.security.pinSalt);
  const biometricsEnabled = useAppSelector((s) => s.security.biometricsEnabled);

  const [value, setValue] = useState('');
  const [error, setError] = useState(false);
  const [biometryKind, setBiometryKind] = useState<BiometryKind>('none');
  const shake = useRef(new Animated.Value(0)).current;
  const triedBiometryRef = useRef(false);

  useEffect(() => {
    let alive = true;
    getBiometryKind().then((k) => {
      if (alive) setBiometryKind(k);
    });
    return () => {
      alive = false;
    };
  }, []);

  const tryBiometry = useCallback(async () => {
    const ok = await authenticateWithBiometry(t('lock.biometryPrompt'));
    if (ok) {
      dispatch(unlock());
    }
  }, [dispatch, t]);

  useEffect(() => {
    if (!biometricsEnabled || biometryKind === 'none') return;
    if (triedBiometryRef.current) return;
    triedBiometryRef.current = true;
    tryBiometry();
  }, [biometricsEnabled, biometryKind, tryBiometry]);

  useEffect(() => {
    if (value.length !== PIN_LENGTH) return;
    if (!pinHash || !pinSalt) return;
    if (hashPin(value, pinSalt) === pinHash) {
      dispatch(unlock());
      setValue('');
      setError(false);
      return;
    }
    setError(true);
    Animated.sequence([
      Animated.timing(shake, {
        toValue: 8,
        duration: 60,
        useNativeDriver: true,
      }),
      Animated.timing(shake, {
        toValue: -8,
        duration: 60,
        useNativeDriver: true,
      }),
      Animated.timing(shake, {
        toValue: 6,
        duration: 60,
        useNativeDriver: true,
      }),
      Animated.timing(shake, {
        toValue: 0,
        duration: 60,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setValue('');
      setError(false);
    });
  }, [value, pinHash, pinSalt, dispatch, shake]);

  const biometryIcon = useMemo(() => {
    if (!biometricsEnabled || biometryKind === 'none') return undefined;
    if (biometryKind === 'face') {
      return <ScanFace size={26} color={colors.accent} strokeWidth={1.8} />;
    }
    return <Fingerprint size={26} color={colors.accent} strokeWidth={1.8} />;
  }, [biometricsEnabled, biometryKind, colors.accent]);

  return (
    <SafeAreaView
      style={[styles.root, { backgroundColor: colors.background }]}
      edges={['top', 'bottom']}
    >
      <View style={styles.header}>
        <View
          style={[
            styles.iconWrap,
            {
              backgroundColor: colors.accentMuted,
              borderColor: colors.border,
            },
          ]}
        >
          <Lock size={22} color={colors.accent} strokeWidth={1.8} />
        </View>
        <Text style={[styles.title, { color: colors.label }]}>
          {t('lock.title')}
        </Text>
        <Text style={[styles.subtitle, { color: colors.secondaryLabel }]}>
          {t('lock.subtitle')}
        </Text>
      </View>

      <Animated.View
        style={[styles.dots, { transform: [{ translateX: shake }] }]}
      >
        <PinDots
          colors={colors}
          length={PIN_LENGTH}
          filled={value.length}
          error={error}
        />
      </Animated.View>

      <View style={styles.pad}>
        <PinPad
          colors={colors}
          value={value}
          maxLength={PIN_LENGTH}
          onChange={setValue}
          biometryIcon={biometryIcon}
          onBiometryPress={biometryIcon ? tryBiometry : undefined}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingHorizontal: theme.space.md,
  },
  header: {
    alignItems: 'center',
    marginTop: theme.space.xl,
    gap: theme.space.sm,
  },
  iconWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 13,
    fontWeight: '500',
  },
  dots: {
    marginTop: theme.space.xl,
    marginBottom: theme.space.xl,
  },
  pad: {
    flex: 1,
    justifyContent: 'center',
    paddingBottom: theme.space.xl,
  },
});

import { useCallback, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  useColorScheme,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { RootStackParamList } from '@/app/navigation/types';
import { useAppDispatch } from '@/app/store';
import { setSessionUser } from '@/entities/session';
import { useTranslation } from '@/shared/i18n';
import { saveJson, STORAGE_KEYS } from '@/shared/lib';
import type { SessionUser } from '@/shared/types/sessionUser';

import { getGlassFabShadow, getGlassRowShadow } from '@/app/styles/theme';

import {
  getLoginValidationError,
  type LoginValidationError,
} from './lib/validateCredentials';
import { getLoginPalette, loginStyles } from './styles';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Login'>;

function validationKey(code: LoginValidationError): string | null {
  switch (code) {
    case 'email':
      return 'login.validationEmail';
    case 'password':
      return 'login.validationPassword';
    case 'password_weak':
      return 'login.validationPasswordWeak';
    default:
      return null;
  }
}

export function LoginPage() {
  const navigation = useNavigation<Nav>();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const palette = getLoginPalette(isDark);
  const groupLift = getGlassRowShadow(isDark);
  const ctaLift = getGlassFabShadow(isDark);

  const onSubmit = useCallback(async () => {
    const errCode = getLoginValidationError(email, password);
    if (errCode) {
      const key = validationKey(errCode);
      setError(key ? t(key) : '');
      return;
    }

    setError(null);
    const trimmed = email.trim();
    const payload: SessionUser = { email: trimmed };

    try {
      await saveJson(STORAGE_KEYS.sessionUser, payload);
    } catch {
      setError(t('login.errorSave'));
      return;
    }

    dispatch(setSessionUser(trimmed));
    navigation.reset({
      index: 0,
      routes: [{ name: 'Home' }],
    });
  }, [dispatch, email, navigation, password, t]);

  return (
    <SafeAreaView style={[loginStyles.screen, { backgroundColor: palette.bg }]}>
      <KeyboardAvoidingView
        style={loginStyles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={loginStyles.content}>
          <Text style={[loginStyles.title, { color: palette.label }]}>
            {t('login.title')}
          </Text>
          <Text style={[loginStyles.subtitle, { color: palette.secondary }]}>
            {t('login.brand')}
          </Text>

          <View
            style={[
              loginStyles.group,
              groupLift,
              {
                backgroundColor: palette.group,
                borderColor: palette.border,
              },
            ]}
          >
            <TextInput
              style={[loginStyles.input, { color: palette.field }]}
              placeholder={t('login.email')}
              placeholderTextColor={palette.placeholder}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              value={email}
              onChangeText={setEmail}
            />
            <View
              style={[loginStyles.divider, { backgroundColor: palette.border }]}
            />
            <TextInput
              style={[loginStyles.input, { color: palette.field }]}
              placeholder={t('login.password')}
              placeholderTextColor={palette.placeholder}
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          {error ? (
            <Text style={[loginStyles.error, { color: palette.error }]}>
              {error}
            </Text>
          ) : null}

          <Pressable
            style={({ pressed }) => [
              loginStyles.primaryButton,
              ctaLift,
              {
                backgroundColor: palette.accent,
                opacity: pressed ? 0.85 : 1,
                borderWidth: 1,
                borderColor: palette.fabRing,
              },
            ]}
            onPress={() => {
              onSubmit().catch(() => {
                setError(t('login.errorGeneric'));
              });
            }}
          >
            <Text
              style={[
                loginStyles.primaryButtonLabel,
                { color: palette.onAccent },
              ]}
            >
              {t('login.submit')}
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

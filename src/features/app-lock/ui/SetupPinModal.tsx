import { X } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { getAppColors, theme } from '@/app/styles/theme';
import { useAppDispatch } from '@/app/store';
import { setPin } from '@/entities/security';
import { useTranslation } from '@/shared/i18n';
import { generateSalt, hashPin } from '@/shared/lib';

import { PinDots } from './PinDots';
import { PinPad } from './PinPad';

const PIN_LENGTH = 4;

type Props = {
  visible: boolean;
  onClose: () => void;
  onDone: () => void;
};

type Step = 'enter' | 'confirm';

export function SetupPinModal({ visible, onClose, onDone }: Props) {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const colors = getAppColors(isDark);
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const [step, setStep] = useState<Step>('enter');
  const [first, setFirst] = useState('');
  const [value, setValue] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!visible) {
      setStep('enter');
      setFirst('');
      setValue('');
      setError(false);
    }
  }, [visible]);

  useEffect(() => {
    if (value.length !== PIN_LENGTH) return;
    if (step === 'enter') {
      setFirst(value);
      setValue('');
      setStep('confirm');
      return;
    }
    if (value === first) {
      const salt = generateSalt();
      dispatch(setPin({ hash: hashPin(value, salt), salt }));
      onDone();
      return;
    }
    setError(true);
    setTimeout(() => {
      setValue('');
      setFirst('');
      setStep('enter');
      setError(false);
    }, 600);
  }, [value, step, first, dispatch, onDone]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView
        style={[styles.root, { backgroundColor: colors.background }]}
        edges={['top', 'bottom']}
      >
        <View style={styles.topBar}>
          <Pressable
            onPress={onClose}
            accessibilityRole="button"
            accessibilityLabel={t('common.close')}
            hitSlop={10}
          >
            <X size={22} color={colors.label} strokeWidth={1.8} />
          </Pressable>
        </View>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.label }]}>
            {step === 'enter'
              ? t('lock.setupEnterTitle')
              : t('lock.setupConfirmTitle')}
          </Text>
          <Text style={[styles.subtitle, { color: colors.secondaryLabel }]}>
            {error
              ? t('lock.setupMismatch')
              : step === 'enter'
              ? t('lock.setupEnterSubtitle')
              : t('lock.setupConfirmSubtitle')}
          </Text>
        </View>
        <View style={styles.dots}>
          <PinDots
            colors={colors}
            length={PIN_LENGTH}
            filled={value.length}
            error={error}
          />
        </View>
        <View style={styles.pad}>
          <PinPad
            colors={colors}
            value={value}
            maxLength={PIN_LENGTH}
            onChange={setValue}
          />
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingHorizontal: theme.space.md,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingVertical: theme.space.sm,
  },
  header: {
    alignItems: 'center',
    marginTop: theme.space.md,
    gap: theme.space.sm,
    paddingHorizontal: theme.space.lg,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'center',
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

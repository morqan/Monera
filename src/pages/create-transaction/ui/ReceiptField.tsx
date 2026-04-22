import { useState } from 'react';
import {
  ActionSheetIOS,
  Alert,
  Image,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { type AppColors, theme } from '@/app/styles/theme';
import { useTranslation } from '@/shared/i18n';

type Props = {
  attachmentUri: string | undefined;
  onCapture: () => void;
  onPick: () => void;
  onRemove: () => void;
  colors: AppColors;
};

export function ReceiptField({
  attachmentUri,
  onCapture,
  onPick,
  onRemove,
  colors,
}: Props) {
  const { t } = useTranslation();
  const [previewOpen, setPreviewOpen] = useState(false);

  const hasAttachment = !!attachmentUri;

  const openMenu = () => {
    const cameraLabel = t('create.receiptCamera');
    const libraryLabel = t('create.receiptLibrary');
    const removeLabel = t('create.receiptRemove');
    const cancelLabel = t('common.cancel');

    if (Platform.OS === 'ios') {
      const options = hasAttachment
        ? [cameraLabel, libraryLabel, removeLabel, cancelLabel]
        : [cameraLabel, libraryLabel, cancelLabel];
      const destructiveIdx = hasAttachment ? 2 : undefined;
      const cancelIdx = options.length - 1;
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options,
          cancelButtonIndex: cancelIdx,
          destructiveButtonIndex: destructiveIdx,
        },
        (idx) => {
          if (idx === 0) onCapture();
          else if (idx === 1) onPick();
          else if (hasAttachment && idx === 2) onRemove();
        }
      );
      return;
    }

    const buttons: {
      text: string;
      onPress?: () => void;
      style?: 'cancel' | 'destructive';
    }[] = [
      { text: cameraLabel, onPress: onCapture },
      { text: libraryLabel, onPress: onPick },
    ];
    if (hasAttachment) {
      buttons.push({
        text: removeLabel,
        style: 'destructive',
        onPress: onRemove,
      });
    }
    buttons.push({ text: cancelLabel, style: 'cancel' });
    Alert.alert(t('create.receiptMenuTitle'), undefined, buttons);
  };

  if (!hasAttachment) {
    return (
      <Pressable
        onPress={openMenu}
        style={[
          styles.addButton,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
      >
        <Text style={[styles.addLabel, { color: colors.accent }]}>
          {t('create.receiptAdd')}
        </Text>
      </Pressable>
    );
  }

  return (
    <>
      <View
        style={[
          styles.attached,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
      >
        <Pressable
          onPress={() => setPreviewOpen(true)}
          style={styles.thumbWrap}
        >
          <Image
            source={{ uri: attachmentUri }}
            style={styles.thumb}
            resizeMode="cover"
          />
        </Pressable>
        <View style={styles.actions}>
          <Pressable onPress={openMenu} style={styles.actionBtn}>
            <Text style={[styles.actionLabel, { color: colors.accent }]}>
              {t('create.receiptReplace')}
            </Text>
          </Pressable>
          <Pressable onPress={onRemove} style={styles.actionBtn}>
            <Text style={[styles.actionLabel, { color: colors.danger }]}>
              {t('create.receiptRemove')}
            </Text>
          </Pressable>
        </View>
      </View>

      <Modal
        visible={previewOpen}
        animationType="fade"
        transparent={false}
        onRequestClose={() => setPreviewOpen(false)}
      >
        <SafeAreaView style={styles.previewRoot}>
          <View style={styles.previewHeader}>
            <Pressable
              onPress={() => setPreviewOpen(false)}
              hitSlop={12}
              style={styles.previewClose}
            >
              <Text style={styles.previewCloseLabel}>{t('common.close')}</Text>
            </Pressable>
            <Text style={styles.previewTitle}>
              {t('create.receiptPreviewTitle')}
            </Text>
            <View style={styles.previewClose} />
          </View>
          <View style={styles.previewBody}>
            <Image
              source={{ uri: attachmentUri }}
              style={styles.previewImage}
              resizeMode="contain"
            />
          </View>
        </SafeAreaView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  addButton: {
    borderRadius: theme.radius.card,
    borderWidth: StyleSheet.hairlineWidth,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: theme.space.md,
  },
  addLabel: {
    fontSize: 15,
    fontWeight: '500',
  },
  attached: {
    borderRadius: theme.radius.card,
    borderWidth: StyleSheet.hairlineWidth,
    padding: theme.space.sm,
    marginBottom: theme.space.md,
    flexDirection: 'row',
    gap: theme.space.md,
    alignItems: 'center',
  },
  thumbWrap: {
    borderRadius: theme.radius.pill,
    overflow: 'hidden',
  },
  thumb: {
    width: 72,
    height: 72,
  },
  actions: {
    flex: 1,
    gap: 4,
  },
  actionBtn: {
    paddingVertical: 6,
  },
  actionLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  previewRoot: {
    flex: 1,
    backgroundColor: '#000',
  },
  previewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.space.md,
    paddingVertical: theme.space.sm,
  },
  previewClose: {
    minWidth: 72,
  },
  previewCloseLabel: {
    color: '#fff',
    fontSize: 15,
  },
  previewTitle: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  previewBody: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
});

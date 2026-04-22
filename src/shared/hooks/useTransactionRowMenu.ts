import { useCallback } from 'react';
import { ActionSheetIOS, Alert, Platform } from 'react-native';

import { useTranslation } from '@/shared/i18n';

type Args = {
  onEdit: (id: string) => void;
  onDuplicate: (id: string) => void;
};

export function useTransactionRowMenu({ onEdit, onDuplicate }: Args) {
  const { t } = useTranslation();

  return useCallback(
    (transactionId: string) => {
      const editLabel = t('common.edit');
      const duplicateLabel = t('transactions.duplicate');
      const cancelLabel = t('common.cancel');

      if (Platform.OS === 'ios') {
        ActionSheetIOS.showActionSheetWithOptions(
          {
            options: [editLabel, duplicateLabel, cancelLabel],
            cancelButtonIndex: 2,
          },
          (idx) => {
            if (idx === 0) onEdit(transactionId);
            else if (idx === 1) onDuplicate(transactionId);
          }
        );
        return;
      }

      Alert.alert(t('transactions.rowMenuTitle'), undefined, [
        { text: editLabel, onPress: () => onEdit(transactionId) },
        { text: duplicateLabel, onPress: () => onDuplicate(transactionId) },
        { text: cancelLabel, style: 'cancel' },
      ]);
    },
    [onEdit, onDuplicate, t]
  );
}

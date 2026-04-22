import { Pressable, Text, View } from 'react-native';

import type { AppColors } from '@/app/styles/theme';
import { useTranslation } from '@/shared/i18n';

import { createTransactionStyles } from '../styles';

type Props = {
  canSave: boolean;
  onSave: () => void;
  onDelete?: () => void;
  colors: AppColors;
};

export function SaveFooter({ canSave, onSave, onDelete, colors }: Props) {
  const { t } = useTranslation();
  return (
    <View
      style={[
        createTransactionStyles.footer,
        { borderTopColor: colors.border, backgroundColor: colors.background },
      ]}
    >
      {onDelete ? (
        <Pressable
          onPress={onDelete}
          style={({ pressed }) => [
            createTransactionStyles.deleteRow,
            { opacity: pressed ? 0.7 : 1 },
          ]}
        >
          <Text
            style={[
              createTransactionStyles.deleteLabel,
              { color: colors.expense },
            ]}
          >
            {t('create.deleteItem')}
          </Text>
        </Pressable>
      ) : null}
      <Pressable
        onPress={onSave}
        disabled={!canSave}
        style={({ pressed }) => [
          createTransactionStyles.save,
          onDelete ? createTransactionStyles.saveBelowDelete : null,
          {
            backgroundColor: canSave ? colors.accent : colors.fill,
            opacity: pressed && canSave ? 0.9 : 1,
            ...(canSave ? { borderWidth: 1, borderColor: colors.fabRing } : {}),
          },
        ]}
      >
        <Text
          style={[
            createTransactionStyles.saveLabel,
            {
              color: canSave ? colors.onAccent : colors.secondaryLabel,
            },
          ]}
        >
          {t('common.save')}
        </Text>
      </Pressable>
    </View>
  );
}

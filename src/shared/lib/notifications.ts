import { Platform } from 'react-native';
import notifee, { AuthorizationStatus } from '@notifee/react-native';

const CHANNEL_ID = 'budget-alerts';
let channelEnsured = false;

async function ensureChannel(): Promise<void> {
  if (Platform.OS !== 'android' || channelEnsured) return;
  await notifee.createChannel({
    id: CHANNEL_ID,
    name: 'Бюджет / Budget',
  });
  channelEnsured = true;
}

export async function requestNotificationPermission(): Promise<boolean> {
  try {
    const settings = await notifee.requestPermission();
    return (
      settings.authorizationStatus === AuthorizationStatus.AUTHORIZED ||
      settings.authorizationStatus === AuthorizationStatus.PROVISIONAL
    );
  } catch {
    return false;
  }
}

export async function fireBudgetNotification(
  title: string,
  body: string
): Promise<void> {
  await ensureChannel();
  try {
    await notifee.displayNotification({
      title,
      body,
      android: {
        channelId: CHANNEL_ID,
        smallIcon: 'ic_launcher',
        pressAction: { id: 'default' },
      },
    });
  } catch {
    // best-effort
  }
}

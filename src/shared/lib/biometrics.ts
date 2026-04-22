import ReactNativeBiometrics, { BiometryTypes } from 'react-native-biometrics';

const rnBiometrics = new ReactNativeBiometrics({
  allowDeviceCredentials: false,
});

export type BiometryKind = 'face' | 'touch' | 'iris' | 'none';

export async function getBiometryKind(): Promise<BiometryKind> {
  try {
    const { available, biometryType } = await rnBiometrics.isSensorAvailable();
    if (!available) return 'none';
    if (biometryType === BiometryTypes.FaceID) return 'face';
    if (biometryType === BiometryTypes.TouchID) return 'touch';
    if (biometryType === BiometryTypes.Biometrics) return 'touch';
    return 'touch';
  } catch {
    return 'none';
  }
}

export async function authenticateWithBiometry(
  promptMessage: string
): Promise<boolean> {
  try {
    const { success } = await rnBiometrics.simplePrompt({
      promptMessage,
      cancelButtonText: undefined,
    });
    return success === true;
  } catch {
    return false;
  }
}

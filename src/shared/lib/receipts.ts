import RNFS from 'react-native-fs';
import {
  launchCamera,
  launchImageLibrary,
  type Asset,
} from 'react-native-image-picker';

const RECEIPTS_DIR = `${RNFS.DocumentDirectoryPath}/receipts`;

async function ensureDir(): Promise<void> {
  const exists = await RNFS.exists(RECEIPTS_DIR);
  if (!exists) {
    await RNFS.mkdir(RECEIPTS_DIR);
  }
}

function extensionFor(asset: Asset): string {
  const fromName = asset.fileName?.split('.').pop();
  if (fromName && fromName.length <= 5) return fromName.toLowerCase();
  if (asset.type?.includes('png')) return 'png';
  return 'jpg';
}

async function persistAsset(
  asset: Asset,
  transactionId: string
): Promise<string | null> {
  if (!asset.uri) return null;
  await ensureDir();
  const ext = extensionFor(asset);
  const destPath = `${RECEIPTS_DIR}/${transactionId}.${ext}`;
  const srcPath = asset.uri.replace(/^file:\/\//, '');
  try {
    if (await RNFS.exists(destPath)) {
      await RNFS.unlink(destPath);
    }
    await RNFS.copyFile(srcPath, destPath);
  } catch {
    return null;
  }
  return `file://${destPath}`;
}

export async function pickReceiptFromLibrary(
  transactionId: string
): Promise<string | null> {
  const result = await launchImageLibrary({
    mediaType: 'photo',
    selectionLimit: 1,
    includeBase64: false,
    quality: 0.8,
  });
  if (result.didCancel) return null;
  const asset = result.assets?.[0];
  if (!asset) return null;
  return persistAsset(asset, transactionId);
}

export async function captureReceiptFromCamera(
  transactionId: string
): Promise<string | null> {
  const result = await launchCamera({
    mediaType: 'photo',
    saveToPhotos: false,
    includeBase64: false,
    quality: 0.8,
  });
  if (result.didCancel) return null;
  const asset = result.assets?.[0];
  if (!asset) return null;
  return persistAsset(asset, transactionId);
}

export async function removeReceiptFile(uri: string): Promise<void> {
  if (!uri.startsWith('file://')) return;
  const path = uri.replace(/^file:\/\//, '');
  try {
    if (await RNFS.exists(path)) {
      await RNFS.unlink(path);
    }
  } catch {
    // best-effort cleanup
  }
}

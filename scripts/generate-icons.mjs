import sharp from 'sharp';
import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

const ROOT = resolve(process.cwd());
const MASTER = resolve(ROOT, 'assets/brand/icon-master.svg');
const FOREGROUND = resolve(ROOT, 'assets/brand/icon-foreground.svg');
const IOS_APPICON = resolve(
  ROOT,
  'ios/Monera/Images.xcassets/AppIcon.appiconset'
);
const ANDROID_RES = resolve(ROOT, 'android/app/src/main/res');
const PLAY_STORE = resolve(ROOT, 'assets/brand/play-store-512.png');
const ACCENT_BG = '#4B3199';

const androidDensities = [
  { dir: 'mipmap-mdpi', legacy: 48, foreground: 108 },
  { dir: 'mipmap-hdpi', legacy: 72, foreground: 162 },
  { dir: 'mipmap-xhdpi', legacy: 96, foreground: 216 },
  { dir: 'mipmap-xxhdpi', legacy: 144, foreground: 324 },
  { dir: 'mipmap-xxxhdpi', legacy: 192, foreground: 432 },
];

async function ensureDir(path) {
  await mkdir(dirname(path), { recursive: true });
}

async function writePng(source, size, outPath, opts = {}) {
  await ensureDir(outPath);
  const pipeline = sharp(source, { density: Math.max(96, size) }).resize(
    size,
    size,
    { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }
  );
  if (opts.flatten) {
    pipeline.flatten({ background: opts.flatten });
  }
  if (opts.roundMask) {
    const mask = Buffer.from(
      `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><circle cx="${
        size / 2
      }" cy="${size / 2}" r="${size / 2}" fill="#fff"/></svg>`
    );
    pipeline.composite([{ input: mask, blend: 'dest-in' }]);
  }
  await pipeline.png().toFile(outPath);
  console.log('  ✓', outPath.replace(ROOT + '/', ''));
}

async function writeIosAppIcon() {
  console.log('iOS AppIcon:');
  const out = resolve(IOS_APPICON, 'AppIcon-1024.png');
  await writePng(MASTER, 1024, out, {
    flatten: { r: 0x7c, g: 0x5c, b: 0xff },
  });

  const contents = {
    images: [
      {
        filename: 'AppIcon-1024.png',
        idiom: 'universal',
        platform: 'ios',
        size: '1024x1024',
      },
    ],
    info: { author: 'xcode', version: 1 },
  };
  await writeFile(
    resolve(IOS_APPICON, 'Contents.json'),
    JSON.stringify(contents, null, 2) + '\n'
  );
  console.log('  ✓ Contents.json');
}

async function writeAndroidIcons() {
  console.log('Android icons:');
  for (const d of androidDensities) {
    const densityDir = resolve(ANDROID_RES, d.dir);
    await writePng(MASTER, d.legacy, resolve(densityDir, 'ic_launcher.png'));
    await writePng(
      MASTER,
      d.legacy,
      resolve(densityDir, 'ic_launcher_round.png'),
      {
        roundMask: true,
      }
    );
    await writePng(
      FOREGROUND,
      d.foreground,
      resolve(densityDir, 'ic_launcher_foreground.png')
    );
  }

  const adaptiveXml = `<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@color/ic_launcher_background" />
    <foreground android:drawable="@mipmap/ic_launcher_foreground" />
</adaptive-icon>
`;
  const anydpi = resolve(ANDROID_RES, 'mipmap-anydpi-v26');
  await mkdir(anydpi, { recursive: true });
  await writeFile(resolve(anydpi, 'ic_launcher.xml'), adaptiveXml);
  await writeFile(resolve(anydpi, 'ic_launcher_round.xml'), adaptiveXml);
  console.log('  ✓ mipmap-anydpi-v26/ic_launcher{,_round}.xml');

  const valuesDir = resolve(ANDROID_RES, 'values');
  await mkdir(valuesDir, { recursive: true });
  const colorsPath = resolve(valuesDir, 'colors.xml');
  let colorsXml = '';
  try {
    colorsXml = await readFile(colorsPath, 'utf8');
  } catch {
    colorsXml = `<?xml version="1.0" encoding="utf-8"?>\n<resources>\n</resources>\n`;
  }
  if (!colorsXml.includes('ic_launcher_background')) {
    colorsXml = colorsXml.replace(
      '</resources>',
      `    <color name="ic_launcher_background">${ACCENT_BG}</color>\n</resources>`
    );
    await writeFile(colorsPath, colorsXml);
    console.log('  ✓ values/colors.xml (added ic_launcher_background)');
  } else {
    console.log('  · values/colors.xml already has ic_launcher_background');
  }
}

async function writePlayStore() {
  console.log('Play Store:');
  await writePng(MASTER, 512, PLAY_STORE, {
    flatten: { r: 0x7c, g: 0x5c, b: 0xff },
  });
}

await writeIosAppIcon();
await writeAndroidIcons();
await writePlayStore();
console.log('\nDone.');

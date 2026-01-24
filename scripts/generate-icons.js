#!/usr/bin/env node
/**
 * PWA 아이콘 생성 스크립트
 * favicon.svg를 기반으로 다양한 크기의 PWA 아이콘을 생성합니다.
 */

import sharp from 'sharp';
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PUBLIC_DIR = join(__dirname, '..', 'public');
const FAVICON_SVG = join(PUBLIC_DIR, 'favicon.svg');

// 생성할 아이콘 설정
const ICONS = [
  { name: 'pwa-192x192.png', size: 192 },
  { name: 'pwa-512x512.png', size: 512 },
  { name: 'apple-touch-icon.png', size: 180 },
  { name: 'favicon-32x32.png', size: 32 },
  { name: 'favicon-16x16.png', size: 16 },
];

async function generateIcons() {
  console.log('PWA 아이콘 생성 시작...\n');

  const svgBuffer = readFileSync(FAVICON_SVG);

  // PNG 아이콘 생성
  for (const icon of ICONS) {
    const outputPath = join(PUBLIC_DIR, icon.name);
    await sharp(svgBuffer)
      .resize(icon.size, icon.size)
      .png()
      .toFile(outputPath);
    console.log(`✅ ${icon.name} (${icon.size}x${icon.size})`);
  }

  // favicon.ico 생성 (32x32 PNG를 ICO로 변환)
  // ICO는 단순히 PNG를 .ico 확장자로 저장 (대부분의 브라우저가 PNG ICO를 지원)
  const icoBuffer = await sharp(svgBuffer)
    .resize(32, 32)
    .png()
    .toBuffer();
  writeFileSync(join(PUBLIC_DIR, 'favicon.ico'), icoBuffer);
  console.log('✅ favicon.ico (32x32)');

  // mask-icon.svg 생성 (Safari 핀탭용 - 단색 버전)
  const maskIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect width="100" height="100" fill="black" rx="20"/>
  <text x="50" y="70" font-family="Arial, sans-serif" font-size="60" font-weight="bold" fill="white" text-anchor="middle">M</text>
</svg>`;
  writeFileSync(join(PUBLIC_DIR, 'mask-icon.svg'), maskIconSvg);
  console.log('✅ mask-icon.svg');

  console.log('\n모든 아이콘이 생성되었습니다!');
}

generateIcons().catch(console.error);

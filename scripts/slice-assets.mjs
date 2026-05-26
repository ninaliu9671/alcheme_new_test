// Slice UI_v1_素材图.png into 6 transparent PNG assets.
// Usage: node scripts/slice-assets.mjs
import { Jimp } from "jimp";
import path from "node:path";
import fs from "node:fs/promises";

const SRC = path.resolve("UI_v1_素材图.png");
const OUT_DIR = path.resolve("public/assets");

// Pixels brighter than this (sum of RGB) become transparent.
const WHITE_THRESHOLD = 720; // 0..765
// Soft edge: pixels between SOFT_LOW..WHITE_THRESHOLD get partial alpha.
const SOFT_LOW = 660;

// Approximate regions for each asset in the 2x3 grid (fractions of W/H).
// (left, top, right, bottom) — tuned to the sample image; auto-crop tightens after.
const REGIONS = [
  { name: "witch-broom",     box: [0.02, 0.02, 0.36, 0.55] },
  { name: "witch-cauldron",  box: [0.34, 0.02, 0.66, 0.55] },
  { name: "treasure-box",    box: [0.62, 0.02, 0.99, 0.55] },
  { name: "snowdrop-left",   box: [0.02, 0.55, 0.34, 0.99] },
  { name: "snowdrop-right",  box: [0.32, 0.55, 0.64, 0.99] },
  { name: "butterfly",       box: [0.66, 0.55, 0.99, 0.99] },
];

function makeWhiteTransparent(img) {
  const { width, height, data } = img.bitmap;
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    const sum = r + g + b;
    if (sum >= WHITE_THRESHOLD) {
      data[i + 3] = 0;
    } else if (sum > SOFT_LOW) {
      const t = (sum - SOFT_LOW) / (WHITE_THRESHOLD - SOFT_LOW);
      data[i + 3] = Math.round(255 * (1 - t));
    }
  }
  return img;
}

function autoCrop(img, pad = 6) {
  const { width, height, data } = img.bitmap;
  let minX = width, minY = height, maxX = 0, maxY = 0;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const a = data[(y * width + x) * 4 + 3];
      if (a > 10) {
        if (x < minX) minX = x;
        if (y < minY) minY = y;
        if (x > maxX) maxX = x;
        if (y > maxY) maxY = y;
      }
    }
  }
  if (maxX < minX) return img;
  minX = Math.max(0, minX - pad);
  minY = Math.max(0, minY - pad);
  maxX = Math.min(width - 1, maxX + pad);
  maxY = Math.min(height - 1, maxY + pad);
  return img.crop({ x: minX, y: minY, w: maxX - minX + 1, h: maxY - minY + 1 });
}

async function main() {
  await fs.mkdir(OUT_DIR, { recursive: true });
  const src = await Jimp.read(SRC);
  const W = src.bitmap.width, H = src.bitmap.height;
  console.log(`Source: ${W}x${H}`);

  for (const { name, box } of REGIONS) {
    const [l, t, r, b] = box;
    const x = Math.round(l * W);
    const y = Math.round(t * H);
    const w = Math.round((r - l) * W);
    const h = Math.round((b - t) * H);
    const piece = src.clone().crop({ x, y, w, h });
    makeWhiteTransparent(piece);
    autoCrop(piece);
    const out = path.join(OUT_DIR, `${name}.png`);
    await piece.write(out);
    console.log(`✓ ${name}.png  ${piece.bitmap.width}x${piece.bitmap.height}`);
  }
}

main().catch((e) => { console.error(e); process.exit(1); });

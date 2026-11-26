// Runs after `vite build`. Photos uploaded through /admin can be large phone
// pictures, so this shrinks every image in dist/images/uploads/ to at most
// 1600 px wide and re-compresses it, keeping the same file name and format.
// The originals stay untouched in the repository (public/images/uploads/).
import { existsSync, readdirSync, statSync, writeFileSync } from "node:fs";
import sharp from "sharp";

const DIR = "dist/images/uploads";
const MAX_WIDTH = 1600;
const formats = { ".jpg": "jpeg", ".jpeg": "jpeg", ".png": "png", ".webp": "webp" };

if (!existsSync(DIR)) {
  console.log("No uploaded images to optimise");
  process.exit(0);
}
let saved = 0;
for (const name of readdirSync(DIR)) {
  const format = formats[name.slice(name.lastIndexOf(".")).toLowerCase()];
  if (!format) continue;
  const file = `${DIR}/${name}`;
  const before = statSync(file).size;
  const output = await sharp(file)
    .rotate() // apply the phone's orientation before stripping metadata
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .toFormat(format, format === "png" ? { compressionLevel: 9, palette: true } : { quality: 80 })
    .toBuffer();
  if (output.length < before) {
    writeFileSync(file, output);
    saved += before - output.length;
  }
}
console.log(`Optimised uploaded images, saved ${(saved / 1e6).toFixed(1)} MB`);

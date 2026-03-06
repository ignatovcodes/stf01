/**
 * Сжимает PNG в mini-app/images для укладывания в лимиты Git.
 * Сохраняет хорошее качество для веба (карточки меню).
 * Использование: node scripts/compress-images.js
 */
import sharp from "sharp";
import { readdir, stat } from "node:fs/promises";
import { join, extname } from "node:path";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
import { renameSync } from "node:fs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const IMAGES_DIR = join(__dirname, "..", "images");
const MAX_SIDE = 800; // достаточно для карточек меню (в т.ч. retina)
const PNG_OPTIONS = { compressionLevel: 9, adaptiveFiltering: true };

async function compressImages() {
  const files = await readdir(IMAGES_DIR);
  const pngs = files.filter((f) => extname(f).toLowerCase() === ".png");
  if (pngs.length === 0) {
    console.log("В images/ нет PNG.");
    return;
  }

  let totalBefore = 0;
  let totalAfter = 0;

  for (const name of pngs) {
    const path = join(IMAGES_DIR, name);
    const before = (await stat(path)).size;
    totalBefore += before;

    await sharp(path)
      .resize(MAX_SIDE, MAX_SIDE, { fit: "inside", withoutEnlargement: true })
      .png(PNG_OPTIONS)
      .toFile(path + ".tmp");

    renameSync(path + ".tmp", path);
    const after = (await stat(path)).size;
    totalAfter += after;
    const pct = before > 0 ? Math.round((1 - after / before) * 100) : 0;
    console.log(`${name}: ${(before / 1024).toFixed(0)} KB → ${(after / 1024).toFixed(0)} KB (-${pct}%)`);
  }

  console.log("\nИтого:");
  console.log(`  Было:  ${(totalBefore / 1024 / 1024).toFixed(1)} MB`);
  console.log(`  Стало: ${(totalAfter / 1024 / 1024).toFixed(1)} MB`);
  console.log(`  Сжатие: ${Math.round((1 - totalAfter / totalBefore) * 100)}%`);
}

compressImages().catch((err) => {
  if (err.code === "ERR_MODULE_NOT_FOUND" || err.message?.includes("sharp")) {
    console.error("Сначала установите зависимости: npm install");
    process.exit(1);
  }
  console.error(err);
  process.exit(1);
});

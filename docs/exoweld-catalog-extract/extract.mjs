import fs from "node:fs/promises";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const pdfjsLib = await import("pdfjs-dist/legacy/build/pdf.mjs");

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pdfPath = path.resolve(__dirname, "..", "CCECO EXOWELD- IEC CATALOG.pdf");
const outDir = path.resolve(__dirname, "output");
const imagesDir = path.join(outDir, "images");
const textDir = path.join(outDir, "pages");

await fs.mkdir(imagesDir, { recursive: true });
await fs.mkdir(textDir, { recursive: true });

const data = new Uint8Array(await fs.readFile(pdfPath));
const loadingTask = pdfjsLib.getDocument({
  data,
  useSystemFonts: true,
  disableFontFace: true,
});
const pdf = await loadingTask.promise;

console.log(`Pages: ${pdf.numPages}`);

const allPages = [];
const imageIndex = [];
let imageCount = 0;
const seenImageHashes = new Set();

function bufferHash(buf) {
  // Fast-ish dedupe key: size + first/last bytes
  const a = buf[0] ?? 0;
  const b = buf[Math.floor(buf.length / 2)] ?? 0;
  const c = buf[buf.length - 1] ?? 0;

  return `${buf.length}:${a}:${b}:${c}`;
}

async function saveImage(nameHint, bytes, ext) {
  const hash = bufferHash(bytes);

  if (seenImageHashes.has(hash)) return null;
  seenImageHashes.add(hash);

  imageCount += 1;
  const filename = `${String(imageCount).padStart(4, "0")}-${nameHint}.${ext}`;
  const full = path.join(imagesDir, filename);

  await fs.writeFile(full, bytes);
  imageIndex.push({ id: imageCount, file: `images/${filename}`, nameHint });
  return filename;
}

let sharp;

try {
  // Prefer project-root sharp if present
  sharp = require(path.resolve(__dirname, "..", "..", "node_modules", "sharp"));
} catch {
  try {
    sharp = require("sharp");
  } catch {
    sharp = null;
  }
}

async function saveRgbaImage(nameHint, width, height, rgba) {
  if (!sharp) {
    // Fallback: write .rgba + .json sidecar
    const hash = bufferHash(Buffer.from(rgba));

    if (seenImageHashes.has(hash)) return null;
    seenImageHashes.add(hash);
    imageCount += 1;
    const base = `${String(imageCount).padStart(4, "0")}-${nameHint}`;

    await fs.writeFile(path.join(imagesDir, `${base}.rgba`), Buffer.from(rgba));
    await fs.writeFile(
      path.join(imagesDir, `${base}.json`),
      JSON.stringify({ width, height, format: "rgba" }, null, 2),
    );
    imageIndex.push({
      id: imageCount,
      file: `images/${base}.rgba`,
      nameHint,
      width,
      height,
    });
    return `${base}.rgba`;
  }

  const png = await sharp(Buffer.from(rgba), {
    raw: { width, height, channels: 4 },
  })
    .png()
    .toBuffer();

  return saveImage(nameHint, png, "png");
}

for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
  const page = await pdf.getPage(pageNum);
  const textContent = await page.getTextContent();

  // Also keep line-ish grouping by Y position
  const linesMap = new Map();

  for (const item of textContent.items) {
    if (!("str" in item) || !item.str) continue;
    const y = Math.round(item.transform[5]);
    const x = item.transform[4];

    if (!linesMap.has(y)) linesMap.set(y, []);
    linesMap.get(y).push({ x, str: item.str });
  }
  const lines = [...linesMap.entries()]
    .sort((a, b) => b[0] - a[0])
    .map(([, parts]) =>
      parts
        .sort((a, b) => a.x - b.x)
        .map((p) => p.str)
        .join(" ")
        .replace(/\s+/g, " ")
        .trim(),
    )
    .filter(Boolean);

  const pageText = lines.join("\n");

  await fs.writeFile(path.join(textDir, `page-${String(pageNum).padStart(3, "0")}.txt`), pageText);

  // Extract images via operator list
  const ops = await page.getOperatorList();
  const OPS = pdfjsLib.OPS;
  const imgNames = new Set();

  for (let i = 0; i < ops.fnArray.length; i++) {
    const fn = ops.fnArray[i];

    if (
      fn === OPS.paintImageXObject ||
      fn === OPS.paintInlineImageXObject ||
      fn === OPS.paintImageXObjectRepeat ||
      fn === OPS.paintInlineImageXObjectGroup
    ) {
      const arg = ops.argsArray[i]?.[0];

      if (typeof arg === "string") imgNames.add(arg);
    }
  }

  for (const name of imgNames) {
    try {
      const img = await new Promise((resolve, reject) => {
        let resolved = false;

        page.objs.get(name, (obj) => {
          resolved = true;
          resolve(obj);
        });
        // Some images live in commonObjs
        setTimeout(() => {
          if (resolved) return;
          try {
            page.commonObjs.get(name, (obj) => resolve(obj));
          } catch (e) {
            reject(e);
          }
        }, 50);
      });

      if (!img) continue;

      const hint = `p${String(pageNum).padStart(3, "0")}-${name.replace(/[^\w.-]+/g, "_")}`;

      if (img.data && img.width && img.height) {
        // Usually Uint8ClampedArray RGBA or RGB
        const channels = Math.round(img.data.length / (img.width * img.height));
        let rgba;

        if (channels === 4) {
          rgba = img.data;
        } else if (channels === 3) {
          rgba = new Uint8ClampedArray(img.width * img.height * 4);
          for (let i = 0, j = 0; i < img.data.length; i += 3, j += 4) {
            rgba[j] = img.data[i];
            rgba[j + 1] = img.data[i + 1];
            rgba[j + 2] = img.data[i + 2];
            rgba[j + 3] = 255;
          }
        } else if (channels === 1) {
          rgba = new Uint8ClampedArray(img.width * img.height * 4);
          for (let i = 0, j = 0; i < img.data.length; i++, j += 4) {
            rgba[j] = rgba[j + 1] = rgba[j + 2] = img.data[i];
            rgba[j + 3] = 255;
          }
        } else {
          continue;
        }
        await saveRgbaImage(hint, img.width, img.height, rgba);
      } else if (img.bitmap) {
        // ImageBitmap - skip for now
      }
    } catch {
      // ignore missing image objects
    }
  }

  allPages.push({
    page: pageNum,
    lineCount: lines.length,
    preview: lines.slice(0, 8),
    textFile: `pages/page-${String(pageNum).padStart(3, "0")}.txt`,
  });

  if (pageNum % 5 === 0 || pageNum === pdf.numPages) {
    console.log(`Processed page ${pageNum}/${pdf.numPages} (images so far: ${imageCount})`);
  }
}

await fs.writeFile(
  path.join(outDir, "manifest.json"),
  JSON.stringify(
    {
      source: "CCECO EXOWELD- IEC CATALOG.pdf",
      pages: pdf.numPages,
      imagesExtracted: imageCount,
      imageIndex,
      pageIndex: allPages,
    },
    null,
    2,
  ),
);

// Combined raw text
const combined = [];

for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
  const t = await fs.readFile(
    path.join(textDir, `page-${String(pageNum).padStart(3, "0")}.txt`),
    "utf8",
  );

  combined.push(`\n\n===== PAGE ${pageNum} =====\n\n${t}`);
}
await fs.writeFile(path.join(outDir, "all-text.txt"), combined.join(""));

console.log(`Done. Images: ${imageCount}. Output: ${outDir}`);

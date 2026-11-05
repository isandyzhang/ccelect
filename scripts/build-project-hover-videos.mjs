import { spawn } from "node:child_process";
import { mkdir } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import sharp from "sharp";

const root = path.resolve(import.meta.dirname, "..");
const ffmpeg =
  process.env.FFMPEG ??
  "C:\\Users\\andy103\\AppData\\Local\\Microsoft\\WinGet\\Packages\\Gyan.FFmpeg.Essentials_Microsoft.Winget.Source_8wekyb3d8bbwe\\ffmpeg-9.0.1-essentials_build\\bin\\ffmpeg.exe";
const outDir = path.join(root, "public", "videos", "ccelect");
const previewDir = path.join(os.tmpdir(), "ccelect-hover-previews");
const previewOnly = process.argv.includes("--preview");
const fps = 24;
const seconds = 5;
const frames = fps * seconds;

function blurMask(src, w, h, radius) {
  const tmp = new Float32Array(src.length);
  const out = new Float32Array(src.length);
  const div = radius * 2 + 1;

  for (let y = 0; y < h; y++) {
    let sum = 0;
    for (let x = -radius; x <= radius; x++) sum += src[y * w + Math.min(w - 1, Math.max(0, x))];
    for (let x = 0; x < w; x++) {
      tmp[y * w + x] = sum / div;
      sum -= src[y * w + Math.min(w - 1, Math.max(0, x - radius))];
      sum += src[y * w + Math.min(w - 1, Math.max(0, x + radius + 1))];
    }
  }

  for (let x = 0; x < w; x++) {
    let sum = 0;
    for (let y = -radius; y <= radius; y++) sum += tmp[Math.min(h - 1, Math.max(0, y)) * w + x];
    for (let y = 0; y < h; y++) {
      out[y * w + x] = sum / div;
      sum -= tmp[Math.min(h - 1, Math.max(0, y - radius)) * w + x];
      sum += tmp[Math.min(h - 1, Math.max(0, y + radius + 1)) * w + x];
    }
  }

  return out;
}

function dilate(mask, w, h, radius) {
  return filterMask(mask, w, h, radius, Math.max);
}

function erode(mask, w, h, radius) {
  return filterMask(mask, w, h, radius, Math.min);
}

function filterMask(mask, w, h, radius, pick) {
  const out = new Float32Array(mask.length);

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let value = pick === Math.min ? 1 : 0;
      const y0 = Math.max(0, y - radius);
      const y1 = Math.min(h - 1, y + radius);
      const x0 = Math.max(0, x - radius);
      const x1 = Math.min(w - 1, x + radius);
      for (let yy = y0; yy <= y1; yy++) {
        for (let xx = x0; xx <= x1; xx++) value = pick(value, mask[yy * w + xx]);
      }
      out[y * w + x] = value;
    }
  }

  return out;
}

function insetSky(mask, w, h) {
  const closed = erode(dilate(mask, w, h, 3), w, h, 10);
  const soft = blurMask(closed, w, h, 2);
  for (let i = 0; i < soft.length; i++) {
    soft[i] = soft[i] < 0.55 ? 0 : Math.min(1, (soft[i] - 0.55) / 0.45);
  }
  return soft;
}

function buildEdgeSky(data, w, h, edgeLimit) {
  const mask = new Float32Array(w * h);
  const seen = new Uint8Array(w * h);
  const stack = [];

  for (let x = 0; x < w; x += 2) {
    stack.push(x);
    seen[x] = 1;
  }

  while (stack.length) {
    const i = stack.pop();
    const x = i % w;
    const y = (i / w) | 0;
    const o = i * 4;
    mask[i] = 1;

    const next = [
      [x - 1, y],
      [x + 1, y],
      [x, y - 1],
      [x, y + 1],
    ];

    for (const [nx, ny] of next) {
      if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
      const n = ny * w + nx;
      if (seen[n]) continue;
      const no = n * 4;
      const dist = Math.hypot(data[no] - data[o], data[no + 1] - data[o + 1], data[no + 2] - data[o + 2]);
      if (dist > edgeLimit) continue;
      seen[n] = 1;
      stack.push(n);
    }
  }

  return insetSky(mask, w, h);
}

function buildSkyMask(data, w, h, mode) {
  if (mode === "edge") return buildEdgeSky(data, w, h, 22);

  const mask = new Float32Array(w * h);
  const seen = new Uint8Array(w * h);
  let sr = 0;
  let sg = 0;
  let sb = 0;
  let sn = 0;
  const sampleRows = Math.min(10, h);

  for (let y = 0; y < sampleRows; y++) {
    for (let x = 0; x < w; x++) {
      const o = (y * w + x) * 4;
      sr += data[o];
      sg += data[o + 1];
      sb += data[o + 2];
      sn += 1;
    }
  }

  sr /= sn;
  sg /= sn;
  sb /= sn;

  const stack = [];
  for (let x = 0; x < w; x += 2) {
    stack.push(x);
    seen[x] = 1;
  }

  while (stack.length) {
    const i = stack.pop();
    const x = i % w;
    const y = (i / w) | 0;
    const o = i * 4;
    const dist = Math.hypot(data[o] - sr, data[o + 1] - sg, data[o + 2] - sb);

    if (y > 1 && dist > 46) continue;
    mask[i] = 1;

    const next = [
      [x - 1, y],
      [x + 1, y],
      [x, y - 1],
      [x, y + 1],
    ];

    for (const [nx, ny] of next) {
      if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
      const n = ny * w + nx;
      if (seen[n]) continue;
      seen[n] = 1;
      stack.push(n);
    }
  }

  return insetSky(mask, w, h);
}

async function loadImage(file) {
  const source = sharp(path.join(root, file)).rotate();
  const meta = await source.metadata();
  const width = meta.width > 1280 ? 1280 : meta.width - (meta.width % 2);
  const pipeline = sharp(path.join(root, file)).rotate().resize({ width, withoutEnlargement: true });
  const { data, info } = await pipeline.ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const w = info.width - (info.width % 2);
  const h = info.height - (info.height % 2);
  if (w === info.width && h === info.height) return { data, w, h };

  const cropped = Buffer.alloc(w * h * 4);
  for (let y = 0; y < h; y++) {
    data.copy(cropped, y * w * 4, y * info.width * 4, y * info.width * 4 + w * 4);
  }
  return { data: cropped, w, h };
}

function encode(w, h, outFile, draw) {
  return new Promise((resolve, reject) => {
    const child = spawn(
      ffmpeg,
      [
        "-y",
        "-f",
        "rawvideo",
        "-pix_fmt",
        "rgba",
        "-s",
        `${w}x${h}`,
        "-r",
        String(fps),
        "-i",
        "pipe:0",
        "-an",
        "-c:v",
        "libx264",
        "-preset",
        "medium",
        "-crf",
        "23",
        "-pix_fmt",
        "yuv420p",
        "-movflags",
        "+faststart",
        outFile,
      ],
      { stdio: ["pipe", "ignore", "pipe"] }
    );
    let stderr = "";
    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });
    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(stderr.slice(-800)));
    });

    const frame = Buffer.alloc(w * h * 4);
    const writeAll = async () => {
      for (let index = 0; index < frames; index++) {
        draw(frame, index);
        const copy = Buffer.from(frame);
        if (!child.stdin.write(copy)) {
          await new Promise((done) => child.stdin.once("drain", done));
        }
      }
      child.stdin.end();
    };

    writeAll().catch(reject);
  });
}

async function writePreview(data, mask, w, h, file) {
  const preview = Buffer.from(data);
  for (let i = 0; i < mask.length; i++) {
    const o = i * 4;
    const m = mask[i];
    preview[o] = Math.min(255, preview[o] * (1 - m) + 255 * m);
    preview[o + 2] = preview[o + 2] * (1 - m);
  }
  await sharp(preview, { raw: { width: w, height: h, channels: 4 } })
    .jpeg({ quality: 70 })
    .toFile(file);
}

function findSpark(data, w, h) {
  const points = [];
  const x0 = Math.floor(w * 0.4);
  const x1 = Math.floor(w * 0.56);
  const y0 = Math.floor(h * 0.46);
  const y1 = Math.floor(h * 0.6);
  let top = h;

  for (let y = y0; y < y1; y++) {
    for (let x = x0; x < x1; x++) {
      const o = (y * w + x) * 4;
      const lum = (data[o] + data[o + 1] + data[o + 2]) / 3;
      if (lum > 42) continue;
      points.push([x, y]);
      if (y < top) top = y;
    }
  }

  const mold = points.filter(([, y]) => y <= top + 18);
  const chosen = mold.length ? mold : points;
  if (!chosen.length) return { x: Math.round(w * 0.47), y: Math.round(h * 0.51) };

  const sx = chosen.reduce((sum, [x]) => sum + x, 0) / chosen.length;
  const sy = chosen.reduce((sum, [, y]) => sum + y, 0) / chosen.length;
  return { x: Math.round(sx), y: Math.round(sy) };
}

async function buildClouds(file, outName, mode) {
  const { data, w, h } = await loadImage(file);
  const mask = buildSkyMask(data, w, h, mode);
  const covered = mask.reduce((sum, value) => sum + (value > 0.2 ? 1 : 0), 0) / mask.length;
  console.log(`${outName}: ${w}x${h}, sky ${(covered * 100).toFixed(1)}%`);

  if (previewOnly) {
    await writePreview(data, mask, w, h, path.join(previewDir, `${outName}-mask.jpg`));
    return;
  }

  const base = Buffer.from(data);
  const rowHas = new Uint8Array(h);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (mask[y * w + x] > 0) {
        rowHas[y] = 1;
        break;
      }
    }
  }
  await encode(w, h, path.join(outDir, `${outName}.mp4`), (frame, index) => {
    base.copy(frame);
    const t = index / (frames - 1);
    const envelope = Math.sin(t * Math.PI);
    const drift = Math.round(envelope * w * 0.045);
    if (drift < 1) return;

    for (let y = 0; y < h; y++) {
      if (!rowHas[y]) continue;
      const row = y * w;
      for (let x = 0; x < w; x++) {
        const m = mask[row + x];
        if (m <= 0) continue;
        const srcX = Math.min(w - 1, Math.max(0, x - drift));
        if (mask[row + srcX] < 0.45) continue;
        const amount = envelope * m;
        const o = (row + x) * 4;
        const so = (row + srcX) * 4;
        frame[o] = frame[o] * (1 - amount) + base[so] * amount;
        frame[o + 1] = frame[o + 1] * (1 - amount) + base[so + 1] * amount;
        frame[o + 2] = frame[o + 2] * (1 - amount) + base[so + 2] * amount;
      }
    }
  });
}

async function buildSpark(file, outName) {
  const { data, w, h } = await loadImage(file);
  const spark = findSpark(data, w, h);
  console.log(`${outName}: ${w}x${h}, spark ${spark.x},${spark.y}`);

  if (previewOnly) {
    const preview = Buffer.from(data);
    const o = (spark.y * w + spark.x) * 4;
    for (let dy = -8; dy <= 8; dy++) {
      for (let dx = -8; dx <= 8; dx++) {
        const x = spark.x + dx;
        const y = spark.y + dy;
        if (x < 0 || y < 0 || x >= w || y >= h) continue;
        const i = (y * w + x) * 4;
        preview[i] = 255;
        preview[i + 1] = 40;
        preview[i + 2] = 40;
      }
    }
    preview[o] = 255;
    await sharp(preview, { raw: { width: w, height: h, channels: 4 } })
      .jpeg({ quality: 70 })
      .toFile(path.join(previewDir, `${outName}-mark.jpg`));
    return;
  }

  const base = Buffer.from(data);
  const embers = [
    [0, 0, 1],
    [-18, -10, 0.45],
    [14, -16, 0.35],
    [-8, -28, 0.28],
    [22, -6, 0.22],
  ];

  await encode(w, h, path.join(outDir, `${outName}.mp4`), (frame, index) => {
    base.copy(frame);
    const t = index / (frames - 1);
    const envelope = Math.sin(t * Math.PI);
    const flicker = 0.75 + 0.25 * Math.sin(t * Math.PI * 9);
    const strength = envelope * flicker;
    if (strength < 0.02) return;

    for (const [ex, ey, scale] of embers) {
      const cx = spark.x + ex;
      const cy = spark.y + ey - envelope * 10 * scale;
      const radius = (scale === 1 ? 28 : 10) * (0.7 + strength);
      const reach = radius * 3;
      const yStart = Math.max(0, Math.floor(cy - reach));
      const yEnd = Math.min(h - 1, Math.ceil(cy + reach));
      const xStart = Math.max(0, Math.floor(cx - reach));
      const xEnd = Math.min(w - 1, Math.ceil(cx + reach));

      for (let y = yStart; y <= yEnd; y++) {
        for (let x = xStart; x <= xEnd; x++) {
          const dx = x - cx;
          const dy = y - cy;
          const d2 = dx * dx + dy * dy;
          const glow = Math.exp(-d2 / (2 * radius * radius)) * strength * scale;
          const core = Math.exp(-d2 / (2 * (radius * 0.28) * (radius * 0.28))) * strength * scale;
          if (glow < 0.01) continue;
          const o = (y * w + x) * 4;
          frame[o] = Math.min(255, frame[o] + 255 * core + 190 * glow);
          frame[o + 1] = Math.min(255, frame[o + 1] + 170 * core + 72 * glow);
          frame[o + 2] = Math.min(255, frame[o + 2] + 40 * core);
        }
      }
    }
  });
}

await mkdir(outDir, { recursive: true });
if (previewOnly) await mkdir(previewDir, { recursive: true });
await buildClouds("public/images/ccelect/project-fab.jpg", "project-fab-clouds", "edge");
await buildClouds("public/images/ccelect/project-incinerator.jpg", "project-incinerator-clouds", "global");
await buildSpark("public/images/ccelect/project-metro-retouched.webp", "project-metro-spark");
console.log(previewOnly ? "previews ready" : "videos ready");

/**
 * Build organized EXOWELD IEC catalog markdown + cropped product images.
 * v2: robust page mapping + type-based OCR lookup.
 */
import fs from "node:fs/promises";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const sharp = require(
  path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    "..",
    "..",
    "node_modules",
    "sharp",
  ),
);

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "output");
const imagesSrc = path.join(root, "images");
const ocrSrc = path.join(root, "ocr");
const deliver = path.join(__dirname, "..", "exoweld-iec-catalog");
const pagesDir = path.join(deliver, "pages");
const productsDir = path.join(deliver, "products");

await fs.rm(deliver, { recursive: true, force: true });
await fs.mkdir(pagesDir, { recursive: true });
await fs.mkdir(productsDir, { recursive: true });

const imageFiles = (await fs.readdir(imagesSrc))
  .filter((f) => f.endsWith(".png"))
  .sort();

/** @type {{pdfPage:number, catalogPage:number|null, file:string, full:string, size:number, ocrText:string}[]} */
const entries = [];

for (const file of imageFiles) {
  const ocrPath = path.join(ocrSrc, file.replace(/\.png$/i, ".txt"));
  let ocrText = "";

  try {
    ocrText = await fs.readFile(ocrPath, "utf8");
  } catch {
    ocrText = "";
  }

  // Normalize OCR noise for matching
  const ocrNorm = ocrText
    .replace(/,/g, " ")
    .replace(/mm\?/gi, "mm2")
    .replace(/\u00a0/g, " ");

  const footerMatch = ocrNorm.match(/\bPAGE\s+(\d{1,2})\b/i);
  const nameMatch = file.match(/-p(\d{3})-/i);
  const pdfPage = nameMatch ? Number(nameMatch[1]) : null;

  if (!pdfPage) continue;

  let catalogPage = footerMatch ? Number(footerMatch[1]) : null;

  // OCR sometimes reads PAGE 32 as 82 etc.
  if (catalogPage != null && (catalogPage < 1 || catalogPage > 52)) {
    catalogPage = null;
  }
  // Fallback: catalog footer pages are typically PDF page - 1 for this file
  if (catalogPage == null && pdfPage >= 2) {
    catalogPage = pdfPage - 1;
  }
  if (catalogPage == null) catalogPage = pdfPage;

  const full = path.join(imagesSrc, file);
  const size = (await fs.stat(full)).size;

  entries.push({ pdfPage, catalogPage, file, full, size, ocrText: ocrNorm });
}

// Prefer largest image per PDF page (full page over insets)
const byPdf = new Map();

for (const e of entries) {
  const prev = byPdf.get(e.pdfPage);

  if (!prev || e.size > prev.size) byPdf.set(e.pdfPage, e);
}

// Also index by catalog page (largest wins)
const byCatalog = new Map();

for (const e of byPdf.values()) {
  const prev = byCatalog.get(e.catalogPage);

  if (!prev || e.size > prev.size) byCatalog.set(e.catalogPage, e);
}

// Copy pages as page-XX.png using catalog page
for (const [num, e] of [...byCatalog.entries()].sort((a, b) => a[0] - b[0])) {
  if (num < 1 || num > 52) continue;
  const outName = `page-${String(num).padStart(2, "0")}.png`;

  await fs.copyFile(e.full, path.join(pagesDir, outName));

  if (num >= 8 && num <= 44 && e.size > 40000) {
    const meta = await sharp(e.full).metadata();
    const w = meta.width;
    const h = meta.height;
    const cropW = Math.round(w * 0.34);
    const cropH = Math.round(h * 0.3);

    await sharp(e.full)
      .extract({
        left: Math.round(w * 0.015),
        top: Math.round(h * 0.05),
        width: cropW,
        height: cropH,
      })
      .png()
      .toFile(
        path.join(
          productsDir,
          `page-${String(num).padStart(2, "0")}-diagram.png`,
        ),
      );
  }
}

const PRODUCT_TYPES = [
  { id: "we", series: "W", title: "WE", nameZh: "線對線直通", desc: "Wire-to-wire through / splice" },
  { id: "wt", series: "W", title: "WT", nameZh: "線對線 T 接", desc: "Wire-to-wire T connection", page: 9 },
  { id: "wx", series: "W", title: "WX", nameZh: "線對線交叉", desc: "Wire-to-wire cross (X)", page: 10 },
  { id: "wf", series: "W", title: "WF", nameZh: "線對線平行", desc: "Wire-to-wire parallel", page: 10 },
  { id: "wp", series: "W", title: "WP", nameZh: "線對線垂直搭接", desc: "Wire-to-wire parallel/vertical tap", page: 11 },
  { id: "wl", series: "W", title: "WL", nameZh: "線對線 L 接", desc: "Wire-to-wire L", page: 12 },
  { id: "wxl", series: "W", title: "WXL", nameZh: "線對線 XL 接", desc: "Wire-to-wire XL", page: 13 },
  { id: "wes", series: "W", title: "WES", nameZh: "線對線直通（小型）", desc: "Wire-to-wire splice compact", page: 13 },
  { id: "wts", series: "W", title: "WTS", nameZh: "線對線 T（小型）", desc: "Wire-to-wire T compact", page: 14 },
  { id: "gee", series: "G", title: "GEE", nameZh: "接地棒對線直通", desc: "Ground rod to wire end/run", page: 15 },
  { id: "get", series: "G", title: "GET", nameZh: "接地棒對線 T 接", desc: "Ground rod to wire T", page: 16 },
  { id: "ges", series: "G", title: "GES", nameZh: "接地棒對線側接", desc: "Ground rod to wire side", page: 16 },
  { id: "gst", series: "G", title: "GST", nameZh: "接地棒對線斜 T", desc: "Ground rod to wire angled T", page: 17 },
  { id: "gts", series: "G", title: "GTS", nameZh: "接地棒對線搭接", desc: "Ground rod to wire tap", page: 17 },
  { id: "gey", series: "G", title: "GEY", nameZh: "接地棒對線 Y 接", desc: "Ground rod to wire Y", page: 18 },
  { id: "gep", series: "G", title: "GEP", nameZh: "接地棒對線平行", desc: "Ground rod to wire parallel", page: 19 },
  { id: "gve", series: "G", title: "GVE", nameZh: "接地棒接續", desc: "Ground rod splice", page: 19 },
  { id: "gbn", series: "G", title: "GBN", nameZh: "接地棒對扁銅排", desc: "Ground rod to busbar", page: 20 },
  { id: "gbt", series: "G", title: "GBT", nameZh: "接地棒對扁銅排 T", desc: "Ground rod to busbar T", page: 21 },
  { id: "shea", series: "S", title: "SHEA", nameZh: "鋼板對線（水平 A）", desc: "Steel surface to cable H-A", page: 22 },
  { id: "sheb", series: "S", title: "SHEB", nameZh: "鋼板對線（水平 B）", desc: "Steel surface to cable H-B", page: 22 },
  { id: "shta", series: "S", title: "SHTA", nameZh: "鋼板對線 T（A）", desc: "Steel to cable T-A", page: 23 },
  { id: "shtb", series: "S", title: "SHTB", nameZh: "鋼板對線 T（B）", desc: "Steel to cable T-B", page: 23 },
  { id: "sves", series: "S", title: "SVES", nameZh: "鋼管／立柱對線", desc: "Vertical steel/pipe to cable", page: 24 },
  { id: "sved", series: "S", title: "SVED", nameZh: "鋼管對線 D 型", desc: "Vertical steel to cable D", page: 24 },
  { id: "sveu", series: "S", title: "SVEU", nameZh: "鋼管對線 U 型", desc: "Vertical steel to cable U", page: 25 },
  { id: "svtv", series: "S", title: "SVTV", nameZh: "鋼管對線垂直 T", desc: "Vertical steel to cable T", page: 25 },
  { id: "svtha", series: "S", title: "SVTHA", nameZh: "鋼管對線水平 T（A）", desc: "Steel horizontal T-A", page: 26 },
  { id: "svthb", series: "S", title: "SVTHB", nameZh: "鋼管對線水平 T（B）", desc: "Steel horizontal T-B", page: 26 },
  { id: "sveh", series: "S", title: "SVEH", nameZh: "鋼管對線側向（L/R）", desc: "Vertical steel side L/R", page: 27 },
  { id: "rheh", series: "R", title: "RHEH", nameZh: "鋼筋對線水平", desc: "Rebar to wire horizontal", page: 28 },
  { id: "rhxh", series: "R", title: "RHXH", nameZh: "鋼筋對線交叉", desc: "Rebar to wire cross", page: 31 },
  { id: "rvxh", series: "R", title: "RVXH", nameZh: "鋼筋對線垂直交叉", desc: "Rebar to wire vertical cross", page: 33 },
  { id: "pk", series: "P", title: "PK", nameZh: "線對扁銅排", desc: "Cable to busbar", page: 35 },
  { id: "pv", series: "P", title: "PV", nameZh: "線對扁銅排垂直", desc: "Cable to busbar vertical", page: 36 },
  { id: "pt", series: "P", title: "PT", nameZh: "線對扁銅排 T", desc: "Cable to busbar T", page: 37 },
  { id: "be", series: "B", title: "BE", nameZh: "扁銅排對扁銅排", desc: "Busbar to busbar end", page: 38 },
  { id: "beh", series: "B", title: "BEH", nameZh: "扁銅排水平搭接", desc: "Busbar horizontal", page: 38 },
  { id: "btv", series: "B", title: "BTV", nameZh: "扁銅排垂直 T", desc: "Busbar vertical T", page: 39 },
  { id: "bs", series: "B", title: "BS", nameZh: "扁銅排對鋼結構", desc: "Busbar to steel", page: 40 },
  { id: "bvse", series: "B", title: "BVSE", nameZh: "扁銅排對鋼立面", desc: "Busbar to vertical steel", page: 41 },
  { id: "erb", series: "E", title: "ERB", nameZh: "線端端子／耳片", desc: "Cable lug / terminal", page: 42 },
  { id: "cshea", series: "C", title: "CSHEA", nameZh: "陰極防蝕鋼板對線", desc: "CP steel to cable", page: 43 },
  { id: "cwl", series: "C", title: "CWL", nameZh: "陰極防蝕線對線 L", desc: "CP wire L", page: 44 },
  { id: "cwe", series: "C", title: "CWE", nameZh: "陰極防蝕線對線直通", desc: "CP wire through", page: 44 },
];

const SERIES_META = {
  W: { title: "W 系列 — 線對線（Wire to Wire）", desc: "銅導體對銅導體：直通、T、交叉、平行、L 等。" },
  G: { title: "G 系列 — 接地棒對線（Ground Rod to Wire）", desc: "接地棒（常見 1/2\"、5/8\"、3/4\"）與銅導體／扁銅排。" },
  S: { title: "S 系列 — 鋼板／鋼管對線（Steel Sheets & Pipes）", desc: "鋼結構、鋼板、鋼管與銅導體。" },
  R: { title: "R 系列 — 鋼筋對線（Wire to Rebar）", desc: "鋼筋（常見 Ø10 / Ø25 mm）與銅導體。" },
  P: { title: "P 系列 — 線對扁銅排（Cable to Busbar）", desc: "銅導體與扁銅排。" },
  B: { title: "B 系列 — 扁銅排連接（Busbar）", desc: "扁銅排對扁銅排、扁銅排對鋼結構。" },
  E: { title: "E 系列 — 端子（Lugs / Terminals）", desc: "線端端子／耳片型熔模。" },
  C: { title: "C 系列 — 陰極防蝕（Cathodic Protection）", desc: "陰極防蝕專用熔接劑（CP）與對應熔模。" },
};

function parseRows(ocrText, typeCode) {
  const rows = [];
  // Allow optional punctuation after mold suffix; weld metal may be "2X 150", "B45", "CP-32"
  const re = new RegExp(
    String.raw`\b(${typeCode})-([A-Z0-9./()-]+)\s+(\d+)\s+((?:[Bb]|CP-?)?(?:\d+\s*[Xx]\s*)?\d+)(?:\s+(DX-?3))?`,
    "gi",
  );
  let m;

  while ((m = re.exec(ocrText)) !== null) {
    rows.push({
      moldType: `${m[1].toUpperCase()}-${m[2]}`,
      priceCode: m[3],
      weldMetal: m[4].replace(/\s+/g, " ").trim(),
      accessory: m[5] ? "DX-3" : "",
    });
  }
  const seen = new Set();

  return rows.filter((r) => {
    if (seen.has(r.moldType)) return false;
    seen.add(r.moldType);
    return true;
  });
}

function findOcrForType(typeCode) {
  const chunks = [];
  const pagesHit = new Set();
  const needle = new RegExp(`\\b${typeCode}-`, "i");

  for (const e of byPdf.values()) {
    if (needle.test(e.ocrText)) {
      chunks.push(e.ocrText);
      pagesHit.add(e.catalogPage);
    }
  }
  // Also include PDF text extract for BE page if present
  return { text: chunks.join("\n"), pages: [...pagesHit].sort((a, b) => a - b) };
}

function mdTable(rows) {
  if (!rows.length) {
    return "_（此頁 OCR 未能可靠解析規格表，請直接查看對應頁面圖片）_\n";
  }
  const lines = [
    "| 熔模型號 Mold Type | Price Code | Weld Metal | 配件 |",
    "| --- | --- | --- | --- |",
  ];

  for (const r of rows) {
    lines.push(
      `| \`${r.moldType}\` | ${r.priceCode} | ${r.weldMetal} | ${r.accessory || "—"} |`,
    );
  }
  return `${lines.join("\n")}\n`;
}

// Merge BE/BEH from PDF text extract (page was vector text)
try {
  const beText = await fs.readFile(path.join(root, "pages", "page-039.txt"), "utf8");
  const fake = {
    pdfPage: 39,
    catalogPage: 38,
    file: "page-039-text",
    full: null,
    size: 0,
    ocrText: beText.replace(/,/g, " "),
  };
  // Attach to catalog 38 OCR by appending into byCatalog entry if exists
  const existing = byCatalog.get(38);

  if (existing) existing.ocrText += `\n${fake.ocrText}`;
  else byCatalog.set(38, fake);
  // Ensure type search sees it
  byPdf.set(39, {
    ...(byPdf.get(39) || fake),
    ocrText: `${byPdf.get(39)?.ocrText || ""}\n${fake.ocrText}`,
  });
} catch {
  /* ignore */
}

const md = [];

md.push(`# CCECO EXOWELD IEC 型錄整理

> 來源：\`docs/CCECO EXOWELD- IEC CATALOG.pdf\`（52 頁）  
> 產出：整頁圖擷取 + 接點示意裁切 + Tesseract OCR 規格表  
> **注意**：OCR 可能誤讀數字（如 \`115\`→\`15\`、\`mm²\`→\`mm?\`）；正式規格／報價請以原 PDF 或業務確認為準。  
> 聯絡：cce@ccelect.com.tw ｜ http://www.ccelect.com.tw

## 目錄

- [公司與產品概要](#公司與產品概要)
- [熱熔接原理與優點](#熱熔接原理與優點)
- [施工步驟](#施工步驟)
- [熔接劑與工具配件](#熔接劑與工具配件)
- [型號編排說明](#型號編排說明)
- [系列一覽](#系列一覽)
${Object.entries(SERIES_META)
  .map(([k, v]) => `  - [${v.title}](#series-${k.toLowerCase()})`)
  .join("\n")}
- [應用與其他產品](#應用與其他產品)
- [完整頁面圖片索引](#完整頁面圖片索引)

---

## 公司與產品概要

位於台灣台北的 **CHI CHI Electric Company（集集電工業）**，從事電氣接地連接器製造與工程研發。台灣市場供應電力系統、鐵路、捷運與土木專案；外銷日本、東南亞，並透過 ATI Tectoniks（香港）及澳洲、中國、美國等據點銷售。

**主要產品**：Exoweld／Tectoweld 熱熔接、軌道銲接、Ionic Earthing Array、低電阻回填、接地棒、匯流排與組件。

**型錄宣稱符合**：ISO 9000、UL 467（E305374）、IEEE Std. 837／80／1100、NEC Article 250。

![封面](pages/page-01.png)

---

## 熱熔接原理與優點

熱熔接在**不需外部電源／熱源**下完成銅對銅或銅對鋼的電氣連接。熔接粉於石墨熔模內點燃後產生熔融金屬流入熔腔，冷卻形成**分子級永久接合**。

**優點**：載流能力等同導體、不鬆脫腐蝕、可承受重複故障、施工簡便可攜、可目視檢查。

適用材質含普通鋼、不鏽鋼、鋼軌、銅包鋼、鑄鐵、青銅、黃銅、矽青銅、鍍鋅等。

![原理](pages/page-03.png)

---

## 施工步驟

1. 乾燥熔模與導體  
2. 清潔導體  
3. 放入熔模並鎖定把手  
4. 裝填熔接劑、點火、冷卻、清渣（詳見原 PDF 圖示）

![步驟](pages/page-04.png)

---

## 熔接劑與工具配件

| 項目 | 說明 |
| --- | --- |
| Weld Metal A | 一般銅線／銅排／接地棒 |
| Weld Metal B | 軌道銲接 |
| Weld Metal C | 鑄鐵構件 |
| Weld Metal CP | 陰極防蝕 |
| 熔模選項 \`-S\` | Split crucible（WT／WX），例 \`WT-100/100-S\` |
| 熔模選項 \`-G\` | Wear plate，例 \`WT-100/100-G\` |
| CL-3 / CL-4 | 熔模把手（依熔模號選用） |
| CLR 系列 | 鐵路用把手 |
| 鍊條把手 | CL-3CV／CH、CL-4CV／CH（管／樑） |
| S-2 / S-3 | 清渣工具 |
| IGNITOR | 打火石點火器 |
| MCB-1 | 熔模刷 |
| CUTTER1 | 棘輪電纜剪 |
| TORCH | 預熱噴槍頭 |
| Tool Kit | 完整施工工具組 |

![工具](pages/page-05.png)
![配件](pages/page-06.png)

---

## 型號編排說明

範例：Conductor A \`95 mm²\` + Conductor B \`35 mm²\` + 形式 \`WE\` → 熔模 \`WE-95/35\`。

表格欄位通常為：**Conductor A/B**、**Mold Type**、**Price Code**、**Weld Metal**（必要時含 DX-3）。

| 系列 | 接點形式 |
| --- | --- |
| **W** Wire to Wire | WE/WES, WT, WF, WX/WXS, WL, WXL, WP |
| **G** Ground Rod to Wire | GBN, GES, GTS, GBT, GET, GVE, GEP, GEY, GEE, GST |
| **S** Steel Sheets & Pipes | SHEA, SHEB, SHTA, SHTB, SVED, SVEH, SVES, SVEU, SVTV, SVTHA, SVTHB |
| **R** Wire to Rebar | RVXH, RHXH, RHEH |

![訂購說明](pages/page-08.png)

---

## 系列一覽
`);

const json = {};
const bySeries = {};

for (const p of PRODUCT_TYPES) (bySeries[p.series] ??= []).push(p);

for (const [series, products] of Object.entries(bySeries)) {
  const meta = SERIES_META[series];

  md.push(`\n<a id="series-${series.toLowerCase()}"></a>\n`);
  md.push(`## ${meta.title}\n\n${meta.desc}\n`);

  for (const prod of products) {
    const found = findOcrForType(prod.title);
    const rows = parseRows(found.text, prod.title);
    const page = prod.page ?? found.pages[0] ?? null;

    md.push(`### ${prod.title} — ${prod.nameZh}\n`);
    md.push(`${prod.desc}\n`);
    if (page != null) {
      md.push(`- 型錄頁：PAGE ${page}${found.pages.length > 1 ? `（相關頁：${found.pages.join(", ")}）` : ""}`);
      const pageRel = `pages/page-${String(page).padStart(2, "0")}.png`;

      try {
        await fs.access(path.join(deliver, pageRel));
        md.push(`- 整頁圖：[![](${pageRel})](${pageRel})`);
      } catch {
        /* missing */
      }
      const diagram = `products/page-${String(page).padStart(2, "0")}-diagram.png`;

      try {
        await fs.access(path.join(deliver, diagram));
        md.push(`- 示意圖：![${prod.title}](${diagram})`);
      } catch {
        /* missing */
      }
      md.push("");
    } else {
      md.push(
        `\n> 型錄目錄有列出 **${prod.title}**，但本 PDF 未找到獨立規格表；請向業務索取或參考其他版型錄。\n`,
      );
    }

    md.push(mdTable(rows));
    md.push("");

    json[prod.title] = { ...prod, page, pages: found.pages, rows };
  }
}

md.push(`---

## 應用與其他產品

### Tech Tip：接地網材料與成本

主導體 ≥ 150 mm² 時，建議以約 **50 mm²** 中繼線連接主網與接地棒（取代直接大型 GET），可簡化施工並節省材料。

![Tech Tip](pages/page-47.png)

### Tectoweld Ground Plates

接地板 AG201（2 孔）／AG401（4 孔），可接受至約 100 mm² 導體，符合 NEMA／IEC。

![Ground Plates](pages/page-46.png)

### Personnel Protection Safety Mesh

人員防護網（IEEE Std. 80-1986），標準約 1.5×1.5 m、1.5×2 m。

![Safety Mesh](pages/page-48.png)

### Ionic Earthing Array

離子接地陣列：穩定低接地電阻解決方案。

![Ionic](pages/page-49.png)

### 聯絡資訊

**CHI CHI Electric Company, Ltd**  
No. 2-2, Yun-Ho Street, Taipei, Taiwan  
TEL: (02) 2363-2992　FAX: (02) 2363-9044  
E-Mail: cce@ccelect.com.tw  

![封底相關](pages/page-50.png)

---

## 完整頁面圖片索引

| 頁碼 | 檔案 |
| --- | --- |
`);

for (const num of [...byCatalog.keys()].sort((a, b) => a - b)) {
  if (num < 1 || num > 52) continue;
  const rel = `pages/page-${String(num).padStart(2, "0")}.png`;

  md.push(`| ${num} | [${rel}](${rel}) |`);
}

md.push(`
---

## 檔案結構

\`\`\`
docs/exoweld-iec-catalog/
├── README.md       ← 本整理文件
├── products.json   ← 結構化規格（機器可讀）
├── pages/          ← 整頁型錄圖 page-XX.png
└── products/       ← 接點示意裁切 page-XX-diagram.png
\`\`\`

中間產物（原始 OCR、擷取腳本）在 \`docs/exoweld-catalog-extract/\`。
`);

await fs.writeFile(path.join(deliver, "README.md"), md.join("\n"), "utf8");
await fs.writeFile(
  path.join(deliver, "products.json"),
  JSON.stringify(json, null, 2),
  "utf8",
);

const withRows = Object.values(json).filter((p) => p.rows.length).length;

console.log(`README written. Pages: ${byCatalog.size}. Types with rows: ${withRows}/${PRODUCT_TYPES.length}`);

import fs from "fs";
import path from "path";

const root = "c:/github/ccelect/src/content/pages";
const dummy = (n) => `/src/assets/images/ccelect/dummy/product-${n}.svg`;

const seriesMeta = {
  w: { codes: ["WE", "WT", "WX", "WP", "WL", "WXL"], img: 1 },
  g: { codes: ["GEE", "GET", "GST", "GEY", "GEP"], img: 2 },
  s: { codes: ["SHEA", "SHEB", "SVES"], img: 3 },
  r: { codes: ["RHEH", "RHXH"], img: 4 },
  p: { codes: ["PK", "PV", "PY", "PT"], img: 5 },
  b: { codes: ["BE", "BEH", "BT", "BTV"], img: 1 },
  e: { codes: ["ERW"], img: 2 },
};

const copy = {
  "zh-tw": {
    prefix: "",
    contact: "/contact/",
    exoweldTitle: "Exoweld 熱熔接型錄",
    exoweldDesc: "Exoweld 銅熱熔接系列型錄：W、G、S、R、P、B、E 系列接點形式。",
    eyebrow: "Exoweld 熱熔接型錄",
    heading: "依導體與接點形式選擇系列",
    subtext: "系列名稱沿用公司舊型錄。實際熔模、熔接劑及線徑規格請交由業務部確認。",
    helpHeading: "不確定該選哪一系列？",
    helpText: "提供導體材質、線徑、接點形式、需求數量及施工環境，我們會協助確認產品與報價。",
    helpLinkText: "聯絡工程業務",
    seriesLabel: (k) => `${k.toUpperCase()} 系列`,
    seriesDesc: {
      w: "WE、WT、WX、WP、WL、WXL 等銅導體接點形式。",
      g: "GEE、GET、GST、GEY、GEP 等導體與接地極連接形式。",
      s: "SHEA、SHEB、SVES 等特殊接點形式與對應型錄。",
      r: "RHEH、RHXH 系列接點形式。",
      p: "PK、PV、PY、PT 系列接點形式。",
      b: "BE、BEH、BT、BTV 系列接點形式。",
      e: "ERW 系列接點形式。",
    },
    catalogHeading: (k) => `${k.toUpperCase()} 系列型號`,
    catalogSub: (k) => `選擇 ${k.toUpperCase()} 系列接點型號，查看產品資訊或聯絡業務確認規格。`,
    catalogEyebrow: (k) => `Exoweld ／ ${k.toUpperCase()} 系列`,
    modelDesc: (code, k) =>
      `${code} 為 Exoweld ${k.toUpperCase()} 系列銅熱熔接接點型號（Demo）。實際熔模與導體規格請洽業務。`,
    imageAlt: "產品示意照片",
    detailCategory: "Exoweld ／ W 系列",
    detailSummary: (code) =>
      `${code} 銅導體熱熔接接點型號，適用於依舊型錄配置的 Exoweld W 系列熔接工程。`,
    detailDesc: (code) => [
      `${code} 屬於 W 系列銅導體接點形式，可依現場導體尺寸與接點需求搭配對應熔模與熔接劑。`,
      "本頁為單品詳情公版 Demo。正式規格、模具編號與焊接劑用量請以業務確認資料為準。",
      "施工前請確認導體清潔、模具乾燥與安全防護，並依操作手冊完成點火與冷卻程序。",
    ],
    features: [
      "適用銅導體熱熔接接點配置",
      "可依線徑與接點形式選配熔模",
      "沿用公司舊型錄命名，便於對照既有工程資料",
      "適合接地、等電位與銅導體接續工程",
      "正式規格請洽業務確認",
    ],
    backToSeries: "返回 W 系列",
    note: "本頁為 Exoweld W 系列單品詳情 Demo。正式規格請以業務確認為準。",
    imageHint: "點擊圖片可放大檢視（Demo）",
    labels: { series: "系列", model: "型號", family: "接點分類", status: "狀態", familyValue: "銅導體接點" },
  },
  en: {
    prefix: "/en",
    contact: "/en/contact/",
    exoweldTitle: "Exoweld catalogs",
    exoweldDesc: "W, G, S, R, P, B, and E series exothermic welding catalogs.",
    eyebrow: "Exoweld catalogs",
    heading: "Select series by conductor and joint type",
    subtext: "Series names follow legacy catalogs. Confirm mold, powder, and conductor specs with sales.",
    helpHeading: "Not sure which series to choose?",
    helpText:
      "Share conductor material, size, joint type, quantity, and site conditions. We will help confirm the right product.",
    helpLinkText: "Contact sales",
    seriesLabel: (k) => `${k.toUpperCase()} series`,
    seriesDesc: {
      w: "Copper conductor joints such as WE, WT, WX, WP, WL, and WXL.",
      g: "Conductor-to-ground electrode joints such as GEE, GET, GST, GEY, and GEP.",
      s: "Special joint forms such as SHEA, SHEB, and SVES.",
      r: "RHEH and RHXH joint forms.",
      p: "PK, PV, PY, and PT joint forms.",
      b: "BE, BEH, BT, and BTV joint forms.",
      e: "ERW joint forms.",
    },
    catalogHeading: (k) => `${k.toUpperCase()} series models`,
    catalogSub: (k) =>
      `Choose a ${k.toUpperCase()} series joint model to view product details or contact sales.`,
    catalogEyebrow: (k) => `Exoweld / ${k.toUpperCase()} series`,
    modelDesc: (code, k) =>
      `${code} is an Exoweld ${k.toUpperCase()} series copper exothermic joint model (Demo). Confirm mold and conductor specs with sales.`,
    imageAlt: "Product placeholder",
    detailCategory: "Exoweld / W series",
    detailSummary: (code) =>
      `${code} copper conductor exothermic joint model for Exoweld W series installations based on legacy catalogs.`,
    detailDesc: (code) => [
      `${code} belongs to the W series copper conductor joint family and can be paired with matching molds and welding powder by conductor size.`,
      "This page is a product-detail template demo. Confirm final specs, mold numbers, and powder amounts with sales.",
      "Before welding, clean conductors, dry the mold, follow safety procedures, and complete ignition and cooling per the manual.",
    ],
    features: [
      "For copper conductor exothermic joints",
      "Pair molds by conductor size and joint form",
      "Legacy catalog naming for existing project cross-reference",
      "Suitable for grounding, bonding, and copper splices",
      "Confirm final specs with sales",
    ],
    backToSeries: "Back to W series",
    note: "Demo product detail for Exoweld W series. Confirm final specs with sales.",
    imageHint: "Click image to enlarge (Demo)",
    labels: {
      series: "Series",
      model: "Model",
      family: "Joint family",
      status: "Status",
      familyValue: "Copper conductor joints",
    },
  },
  ja: {
    prefix: "/ja",
    contact: "/ja/contact/",
    exoweldTitle: "Exoweld カタログ",
    exoweldDesc: "Exoweld アルミテルミット溶接シリーズ：W・G・S・R・P・B・E シリーズ。",
    eyebrow: "Exoweld カタログ",
    heading: "導体と接点形式でシリーズを選択",
    subtext: "シリーズ名は旧カタログに準拠します。溶模・溶接剤・線径仕様は営業部へご確認ください。",
    helpHeading: "どのシリーズを選ぶか迷っていますか？",
    helpText: "導体材質、線径、接点形式、数量、施工環境をお知らせください。製品選定をお手伝いします。",
    helpLinkText: "営業へ連絡",
    seriesLabel: (k) => `${k.toUpperCase()} シリーズ`,
    seriesDesc: {
      w: "WE、WT、WX、WP、WL、WXL など銅導体接点形式。",
      g: "GEE、GET、GST、GEY、GEP など導体と接地極の接続形式。",
      s: "SHEA、SHEB、SVES など特殊接点形式。",
      r: "RHEH、RHXH シリーズ接点形式。",
      p: "PK、PV、PY、PT シリーズ接点形式。",
      b: "BE、BEH、BT、BTV シリーズ接点形式。",
      e: "ERW シリーズ接点形式。",
    },
    catalogHeading: (k) => `${k.toUpperCase()} シリーズ型番`,
    catalogSub: (k) =>
      `${k.toUpperCase()} シリーズの接点型番を選択し、製品情報を確認するか営業へご連絡ください。`,
    catalogEyebrow: (k) => `Exoweld ／ ${k.toUpperCase()} シリーズ`,
    modelDesc: (code, k) =>
      `${code} は Exoweld ${k.toUpperCase()} シリーズの銅熱熔接接点型番です（Demo）。溶模と導体仕様は営業へご確認ください。`,
    imageAlt: "製品プレースホルダー",
    detailCategory: "Exoweld ／ W シリーズ",
    detailSummary: (code) =>
      `${code} は旧カタログに基づく Exoweld W シリーズ銅導体熱熔接接点型番です。`,
    detailDesc: (code) => [
      `${code} は W シリーズ銅導体接点形式で、線径と接点条件に応じた溶模・溶接剤と組み合わせます。`,
      "本ページは製品詳細テンプレートの Demo です。正式仕様、型番、溶接剤量は営業確認資料に従ってください。",
      "施工前に導体清掃、溶模乾燥、安全対策を確認し、手順書どおり点火と冷却を行ってください。",
    ],
    features: [
      "銅導体の熱熔接接点に対応",
      "線径と接点形式に応じて溶模を選定",
      "旧カタログ名称を踏襲し既存資料と照合しやすい",
      "接地・等電位・銅導体接続工事に適用",
      "正式仕様は営業へ確認",
    ],
    backToSeries: "W シリーズへ戻る",
    note: "Exoweld W シリーズ製品詳細の Demo です。正式仕様は営業確認に従ってください。",
    imageHint: "画像をクリックして拡大（Demo）",
    labels: {
      series: "シリーズ",
      model: "型番",
      family: "接点区分",
      status: "状態",
      familyValue: "銅導体接点",
    },
  },
};

function yamlList(items, indent = 8) {
  const pad = " ".repeat(indent);
  return items.map((i) => `${pad}- ${i}`).join("\n");
}

function catalogItem({ id, category, title, description, image, imageAlt, specs, href }) {
  return `      - id: ${id}
        category: ${category}
        title: ${title}
        description: ${description}
        image: ${image}
        imageAlt: ${imageAlt}
        specifications:
${yamlList(specs, 10)}
        href: ${href}`;
}

function writeExoweldIndex(locale, c) {
  const items = Object.keys(seriesMeta)
    .map((k) =>
      catalogItem({
        id: `series-${k}`,
        category: "Exoweld",
        title: c.seriesLabel(k),
        description: c.seriesDesc[k],
        image: dummy(seriesMeta[k].img),
        imageAlt: c.imageAlt,
        specs: seriesMeta[k].codes,
        href: `${c.prefix}/products/exoweld/${k}-series/`,
      })
    )
    .join("\n");

  const content = `---
_schema: default
permalink: null
title: ${c.exoweldTitle}
description: ${c.exoweldDesc}
pageSections:
  - _component: page-sections/products/product-catalog
    eyebrowText: ${c.eyebrow}
    heading: ${c.heading}
    subtext: ${c.subtext}
    helpHeading: ${c.helpHeading}
    helpText: ${c.helpText}
    helpLink: ${c.contact}
    helpLinkText: ${c.helpLinkText}
    items:
${items}
---
`;
  const file = path.join(root, locale, "products/exoweld.md");
  fs.writeFileSync(file, content, "utf8");
  console.log("wrote", file);
}

function writeSeriesCatalog(locale, c, key) {
  const meta = seriesMeta[key];
  const isW = key === "w";
  const items = meta.codes
    .map((code, i) =>
      catalogItem({
        id: code.toLowerCase(),
        category: c.catalogEyebrow(key),
        title: code,
        description: c.modelDesc(code, key),
        image: dummy((i % 5) + 1),
        imageAlt: c.imageAlt,
        specs: [code],
        href: isW ? `${c.prefix}/products/exoweld/w-series/${code.toLowerCase()}/` : c.contact,
      })
    )
    .join("\n");

  const content = `---
_schema: default
permalink: null
title: ${c.seriesLabel(key)}
description: ${c.seriesDesc[key]}
pageSections:
  - _component: page-sections/products/product-catalog
    eyebrowText: ${c.catalogEyebrow(key)}
    heading: ${c.catalogHeading(key)}
    subtext: ${c.catalogSub(key)}
    helpHeading: ${c.helpHeading}
    helpText: ${c.helpText}
    helpLink: ${c.contact}
    helpLinkText: ${c.helpLinkText}
    items:
${items}
---
`;
  const dir = path.join(root, locale, "products/exoweld");
  fs.mkdirSync(dir, { recursive: true });
  const file = path.join(dir, `${key}-series.md`);
  fs.writeFileSync(file, content, "utf8");
  console.log("wrote", file);
}

function writeWDetail(locale, c, code) {
  const slug = code.toLowerCase();
  const imgIndex = (["WE", "WT", "WX", "WP", "WL", "WXL"].indexOf(code) % 5) + 1;
  const content = `---
_schema: default
permalink: null
title: ${code}
description: ${c.detailSummary(code)}
pageSections:
  - _component: page-sections/products/product-detail
    category: ${c.detailCategory}
    heading: ${code}
    summary: ${c.detailSummary(code)}
    description:
${c.detailDesc(code).map((p) => `      - ${p}`).join("\n")}
    image: ${dummy(imgIndex)}
    imageAlt: ${code} ${c.imageAlt}
    imageHint: ${c.imageHint}
    primaryCta:
      text: ${c.helpLinkText}
      href: ${c.contact}
    secondaryCta:
      text: ${c.backToSeries}
      href: ${c.prefix}/products/exoweld/w-series/
    features:
${yamlList(c.features, 6)}
    specifications:
      - label: ${c.labels.series}
        value: W
      - label: ${c.labels.model}
        value: ${code}
      - label: ${c.labels.family}
        value: ${c.labels.familyValue}
      - label: ${c.labels.status}
        value: Demo
    note: ${c.note}
---
`;
  const dir = path.join(root, locale, "products/exoweld/w-series");
  fs.mkdirSync(dir, { recursive: true });
  const file = path.join(dir, `${slug}.md`);
  fs.writeFileSync(file, content, "utf8");
  console.log("wrote", file);
}

for (const locale of ["zh-tw", "en", "ja"]) {
  const c = copy[locale];
  writeExoweldIndex(locale, c);
  for (const key of Object.keys(seriesMeta)) writeSeriesCatalog(locale, c, key);
  for (const code of seriesMeta.w.codes) writeWDetail(locale, c, code);
}

console.log("done");

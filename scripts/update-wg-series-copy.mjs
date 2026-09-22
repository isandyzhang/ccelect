import fs from "fs";
import path from "path";

const root = "c:/github/ccelect/src/content/pages";
const dummy = (n) => `/src/assets/images/ccelect/dummy/product-${n}.svg`;

const wCodes = ["WE", "WT", "WX", "WP", "WL", "WXL"];
const gCodes = ["GEE", "GET", "GST", "GEY", "GEP"];

function yamlList(items, indent = 6) {
  const pad = " ".repeat(indent);
  return items.map((i) => `${pad}- ${i}`).join("\n");
}

function catalogItems(codes, category, descFn, hrefFn, startImg = 1) {
  return codes
    .map((code, i) => {
      const img = ((startImg - 1 + i) % 5) + 1;
      return `      - id: ${code.toLowerCase()}
        category: ${category}
        title: ${code}
        description: ${descFn(code)}
        image: ${dummy(img)}
        imageAlt: ${code}
        specifications:
          - ${code}
        href: ${hrefFn(code)}`;
    })
    .join("\n");
}

const locales = {
  "zh-tw": {
    prefix: "",
    contact: "/contact/",
    helpHeading: "不確定該選哪一型號？",
    helpText: "提供導體材質、線徑、接點形式、需求數量及施工環境，我們會協助確認產品與報價。",
    helpLinkText: "聯絡工程業務",
    w: {
      title: "W 系列-線對線",
      desc: "銅導體線對線熱熔接接點：WE、WT、WX、WP、WL、WXL。",
      eyebrow: "Exoweld ／ W 系列",
      heading: "W 系列-線對線",
      subtext: "適用銅導體與銅導體之間的熱熔接接點配置。先了解系列用途，再選擇對應型號。",
      overviewTitle: "什麼是線對線接點？",
      overview: [
        "W 系列專用於銅導體與銅導體之間的熱熔接連接，常見於接地網導體接續、等電位連結與銅線延長。",
        "依舊型錄命名，涵蓋 WE、WT、WX、WP、WL、WXL 等接點形式；實際熔模、熔接劑與線徑規格請洽業務確認。",
        "選型時請提供導體材質、線徑、接點角度／形式與施工環境，以確保模具與焊接劑匹配。",
      ],
      overviewFeatures: [
        "銅導體對銅導體（線對線）熱熔接",
        "涵蓋直通、T 接、交叉等常見接點形式",
        "適用接地網、等電位與銅線接續工程",
        "正式規格與模具編號請以業務確認為準",
      ],
      productsHeading: "W 系列商品",
      countLabel: "共 {count} 個商品",
      category: "Exoweld ／ W 系列-線對線",
      modelDesc: (c) => `${c} 為 W 系列線對線銅導體接點型號（Demo）。實際熔模與導體規格請洽業務。`,
      href: (c) => `/products/exoweld/w-series/${c.toLowerCase()}/`,
      indexTitle: "W 系列-線對線",
      indexDesc: "銅導體線對線接點：WE、WT、WX、WP、WL、WXL。",
      detailCategory: "Exoweld ／ W 系列-線對線",
      backToSeries: "返回 W 系列-線對線",
      detailSummary: (c) => `${c} 屬 W 系列線對線銅導體熱熔接接點，適用導體對導體之熔接配置。`,
    },
    g: {
      title: "G 系列-線對接地棒",
      desc: "導體對接地棒熱熔接接點：GEE、GET、GST、GEY、GEP。",
      eyebrow: "Exoweld ／ G 系列",
      heading: "G 系列-線對接地棒",
      subtext: "適用銅導體與接地棒（接地極）之間的熱熔接接點配置。先了解系列用途，再選擇對應型號。",
      overviewTitle: "什麼是線對接地棒接點？",
      overview: [
        "G 系列專用於導體與接地棒／接地極之間的熱熔接連接，常見於垂直接地極引出與接地網銜接。",
        "依舊型錄命名，涵蓋 GEE、GET、GST、GEY、GEP 等接點形式；實際熔模、熔接劑與接地棒規格請洽業務確認。",
        "選型時請提供導體線徑、接地棒直徑／材質、接點形式與施工環境。",
      ],
      overviewFeatures: [
        "銅導體對接地棒（線對接地極）熱熔接",
        "適用垂直接地極引出與接地網銜接",
        "涵蓋多種導體與接地棒組合形式",
        "正式規格與模具編號請以業務確認為準",
      ],
      productsHeading: "G 系列商品",
      countLabel: "共 {count} 個商品",
      category: "Exoweld ／ G 系列-線對接地棒",
      modelDesc: (c) => `${c} 為 G 系列線對接地棒接點型號（Demo）。實際熔模與導體規格請洽業務。`,
      href: () => "/contact/",
      indexTitle: "G 系列-線對接地棒",
      indexDesc: "導體對接地棒接點：GEE、GET、GST、GEY、GEP。",
    },
  },
  en: {
    prefix: "/en",
    contact: "/en/contact/",
    helpHeading: "Not sure which model to choose?",
    helpText: "Share conductor material, size, joint type, quantity, and site conditions. We will help confirm the right product.",
    helpLinkText: "Contact sales",
    w: {
      title: "W series - wire to wire",
      desc: "Copper conductor-to-conductor joints: WE, WT, WX, WP, WL, WXL.",
      eyebrow: "Exoweld / W series",
      heading: "W series - wire to wire",
      subtext: "For exothermic joints between copper conductors. Read the series overview, then choose a model.",
      overviewTitle: "What is a wire-to-wire joint?",
      overview: [
        "The W series is for copper-to-copper conductor exothermic connections, commonly used in grounding grids, equipotential bonding, and conductor extensions.",
        "Legacy catalog names include WE, WT, WX, WP, WL, and WXL. Confirm mold, powder, and conductor specs with sales.",
        "Share conductor size, joint geometry, and site conditions when selecting a model.",
      ],
      overviewFeatures: [
        "Copper-to-copper (wire-to-wire) exothermic joints",
        "Covers straight, tee, and cross joint forms",
        "For grounding grids, bonding, and copper splices",
        "Confirm final mold numbers with sales",
      ],
      productsHeading: "W series products",
      countLabel: "{count} products",
      category: "Exoweld / W series - wire to wire",
      modelDesc: (c) => `${c} is a W series wire-to-wire copper joint model (Demo). Confirm mold and conductor specs with sales.`,
      href: (c) => `/en/products/exoweld/w-series/${c.toLowerCase()}/`,
      indexTitle: "W series - wire to wire",
      indexDesc: "Copper conductor-to-conductor joints: WE, WT, WX, WP, WL, WXL.",
      detailCategory: "Exoweld / W series - wire to wire",
      backToSeries: "Back to W series - wire to wire",
      detailSummary: (c) => `${c} is a W series wire-to-wire copper exothermic joint for conductor-to-conductor connections.`,
    },
    g: {
      title: "G series - wire to ground rod",
      desc: "Conductor-to-ground-rod joints: GEE, GET, GST, GEY, GEP.",
      eyebrow: "Exoweld / G series",
      heading: "G series - wire to ground rod",
      subtext: "For exothermic joints between conductors and ground rods. Read the series overview, then choose a model.",
      overviewTitle: "What is a wire-to-ground-rod joint?",
      overview: [
        "The G series connects conductors to ground rods or electrodes, commonly used for vertical electrode taps and grid interfaces.",
        "Legacy catalog names include GEE, GET, GST, GEY, and GEP. Confirm mold, powder, and rod specs with sales.",
        "Share conductor size, rod diameter/material, joint form, and site conditions when selecting a model.",
      ],
      overviewFeatures: [
        "Conductor-to-ground-rod exothermic joints",
        "For vertical electrode taps and grid connections",
        "Multiple conductor and rod combinations",
        "Confirm final mold numbers with sales",
      ],
      productsHeading: "G series products",
      countLabel: "{count} products",
      category: "Exoweld / G series - wire to ground rod",
      modelDesc: (c) => `${c} is a G series wire-to-ground-rod joint model (Demo). Confirm mold and conductor specs with sales.`,
      href: () => "/en/contact/",
      indexTitle: "G series - wire to ground rod",
      indexDesc: "Conductor-to-ground-rod joints: GEE, GET, GST, GEY, GEP.",
    },
  },
  ja: {
    prefix: "/ja",
    contact: "/ja/contact/",
    helpHeading: "どの型番を選ぶか迷っていますか？",
    helpText: "導体材質、線径、接点形式、数量、施工環境をお知らせください。製品選定をお手伝いします。",
    helpLinkText: "営業へ連絡",
    w: {
      title: "W シリーズ-線対線",
      desc: "銅導体どうしの熱熔接接点：WE、WT、WX、WP、WL、WXL。",
      eyebrow: "Exoweld ／ W シリーズ",
      heading: "W シリーズ-線対線",
      subtext: "銅導体どうしの熱熔接接点向けです。シリーズ用途を確認してから型番を選択してください。",
      overviewTitle: "線対線接点とは？",
      overview: [
        "W シリーズは銅導体どうしの熱熔接接続向けで、接地網の導体接続、等電位ボンディング、銅線延長などに用いられます。",
        "旧カタログ名称として WE、WT、WX、WP、WL、WXL があります。溶模・溶接剤・線径は営業へご確認ください。",
        "選定時は導体材質・線径・接点形状・施工環境をお知らせください。",
      ],
      overviewFeatures: [
        "銅導体どうし（線対線）の熱熔接",
        "直通・T 継手・交差など一般的な接点形式に対応",
        "接地網・等電位・銅線接続工事向け",
        "正式仕様と溶模番号は営業確認に従ってください",
      ],
      productsHeading: "W シリーズ製品",
      countLabel: "全 {count} 製品",
      category: "Exoweld ／ W シリーズ-線対線",
      modelDesc: (c) => `${c} は W シリーズ線対線の銅導体接点型番です（Demo）。溶模と導体仕様は営業へご確認ください。`,
      href: (c) => `/ja/products/exoweld/w-series/${c.toLowerCase()}/`,
      indexTitle: "W シリーズ-線対線",
      indexDesc: "銅導体どうしの接点：WE、WT、WX、WP、WL、WXL。",
      detailCategory: "Exoweld ／ W シリーズ-線対線",
      backToSeries: "W シリーズ-線対線へ戻る",
      detailSummary: (c) => `${c} は W シリーズ線対線の銅導体熱熔接接点で、導体どうしの接続に適します。`,
    },
    g: {
      title: "G シリーズ-線対接地棒",
      desc: "導体と接地棒の熱熔接接点：GEE、GET、GST、GEY、GEP。",
      eyebrow: "Exoweld ／ G シリーズ",
      heading: "G シリーズ-線対接地棒",
      subtext: "導体と接地棒（接地極）の熱熔接接点向けです。シリーズ用途を確認してから型番を選択してください。",
      overviewTitle: "線対接地棒接点とは？",
      overview: [
        "G シリーズは導体と接地棒／接地極の熱熔接接続向けで、垂直接地極の引出や接地網との接続に用いられます。",
        "旧カタログ名称として GEE、GET、GST、GEY、GEP があります。溶模・溶接剤・接地棒仕様は営業へご確認ください。",
        "選定時は導体線径、接地棒径／材質、接点形式、施工環境をお知らせください。",
      ],
      overviewFeatures: [
        "導体と接地棒（線対接地極）の熱熔接",
        "垂直接地極引出と接地網接続向け",
        "複数の導体・接地棒組合せに対応",
        "正式仕様と溶模番号は営業確認に従ってください",
      ],
      productsHeading: "G シリーズ製品",
      countLabel: "全 {count} 製品",
      category: "Exoweld ／ G シリーズ-線対接地棒",
      modelDesc: (c) => `${c} は G シリーズ線対接地棒の接点型番です（Demo）。溶模と導体仕様は営業へご確認ください。`,
      href: () => "/ja/contact/",
      indexTitle: "G シリーズ-線対接地棒",
      indexDesc: "導体と接地棒の接点：GEE、GET、GST、GEY、GEP。",
    },
  },
};

function writeSeriesPage(locale, key, codes, meta, shared) {
  const content = `---
_schema: default
permalink: null
title: ${meta.title}
description: ${meta.desc}
pageSections:
  - _component: page-sections/products/product-catalog
    eyebrowText: ${meta.eyebrow}
    heading: ${meta.heading}
    subtext: ${meta.subtext}
    overviewTitle: ${meta.overviewTitle}
    overview:
${yamlList(meta.overview, 6)}
    overviewFeatures:
${yamlList(meta.overviewFeatures, 6)}
    productsHeading: ${meta.productsHeading}
    countLabel: ${meta.countLabel}
    helpHeading: ${shared.helpHeading}
    helpText: ${shared.helpText}
    helpLink: ${shared.contact}
    helpLinkText: ${shared.helpLinkText}
    items:
${catalogItems(codes, meta.category, meta.modelDesc, meta.href)}
---
`;
  const file = path.join(root, locale, `products/exoweld/${key}-series.md`);
  fs.writeFileSync(file, content, "utf8");
  console.log("wrote", file);
}

function patchExoweldIndex(locale, wMeta, gMeta) {
  const file = path.join(root, locale, "products/exoweld.md");
  let t = fs.readFileSync(file, "utf8");
  // Replace W series card title/description blocks more carefully with simple replacements
  t = t
    .replace(/title: W 系列\n/, `title: ${wMeta.indexTitle}\n`)
    .replace(/title: W series\n/, `title: ${wMeta.indexTitle}\n`)
    .replace(/title: W シリーズ\n/, `title: ${wMeta.indexTitle}\n`)
    .replace(
      /description: WE、WT、WX、WP、WL、WXL 等銅導體接點形式。\n/,
      `description: ${wMeta.indexDesc}\n`
    )
    .replace(
      /description: Copper conductor joints such as WE, WT, WX, WP, WL, and WXL\.\n/,
      `description: ${wMeta.indexDesc}\n`
    )
    .replace(
      /description: WE、WT、WX、WP、WL、WXL など銅導体接点形式。\n/,
      `description: ${wMeta.indexDesc}\n`
    )
    .replace(/title: G 系列\n/, `title: ${gMeta.indexTitle}\n`)
    .replace(/title: G series\n/, `title: ${gMeta.indexTitle}\n`)
    .replace(/title: G シリーズ\n/, `title: ${gMeta.indexTitle}\n`)
    .replace(
      /description: GEE、GET、GST、GEY、GEP 等導體與接地極連接形式。\n/,
      `description: ${gMeta.indexDesc}\n`
    )
    .replace(
      /description: Conductor-to-ground electrode joints such as GEE, GET, GST, GEY, and GEP\.\n/,
      `description: ${gMeta.indexDesc}\n`
    )
    .replace(
      /description: GEE、GET、GST、GEY、GEP など導体と接地極の接続形式。\n/,
      `description: ${gMeta.indexDesc}\n`
    );
  fs.writeFileSync(file, t, "utf8");
  console.log("patched", file);
}

function patchWDetails(locale, wMeta, shared) {
  for (const code of wCodes) {
    const file = path.join(root, locale, `products/exoweld/w-series/${code.toLowerCase()}.md`);
    if (!fs.existsSync(file)) continue;
    let t = fs.readFileSync(file, "utf8");
    t = t
      .replace(/^description: .+$/m, `description: ${wMeta.detailSummary(code)}`)
      .replace(/^\s+category: .+$/m, `    category: ${wMeta.detailCategory}`)
      .replace(/^\s+summary: .+$/m, `    summary: ${wMeta.detailSummary(code)}`)
      .replace(/^\s+text: .+\n\s+href: .+\/w-series\/$/m, `      text: ${wMeta.backToSeries}\n      href: ${shared.prefix}/products/exoweld/w-series/`);
    // Fix secondaryCta more reliably
    t = t.replace(
      /secondaryCta:\n\s+text: .+\n\s+href: .+/m,
      `secondaryCta:\n      text: ${wMeta.backToSeries}\n      href: ${shared.prefix}/products/exoweld/w-series/`
    );
    fs.writeFileSync(file, t, "utf8");
    console.log("patched", file);
  }
}

for (const [locale, shared] of Object.entries(locales)) {
  writeSeriesPage(locale, "w", wCodes, shared.w, shared);
  writeSeriesPage(locale, "g", gCodes, shared.g, shared);
  patchExoweldIndex(locale, shared.w, shared.g);
  patchWDetails(locale, shared.w, shared);
}

console.log("done");

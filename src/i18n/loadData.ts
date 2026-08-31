import type { Locale } from "./config";
import { defaultLocale, isLocale } from "./config";

import footerEn from "@data/en/footer.json";
import mainNavEn from "@data/en/mainNav.json";
import seoEn from "@data/en/seo.json";
import footerJa from "@data/ja/footer.json";
import mainNavJa from "@data/ja/mainNav.json";
import seoJa from "@data/ja/seo.json";
import footerZh from "@data/zh-tw/footer.json";
import mainNavZh from "@data/zh-tw/mainNav.json";
import productsNavZh from "@data/zh-tw/productsNav.json";
import seoZh from "@data/zh-tw/seo.json";
import productsNavEn from "@data/en/productsNav.json";
import productsNavJa from "@data/ja/productsNav.json";
import siteConfig from "@data/site.json";

const seoMap = {
  "zh-tw": seoZh,
  en: seoEn,
  ja: seoJa,
} as const;

const navMap = {
  "zh-tw": mainNavZh,
  en: mainNavEn,
  ja: mainNavJa,
} as const;

const footerMap = {
  "zh-tw": footerZh,
  en: footerEn,
  ja: footerJa,
} as const;

const productsNavMap = {
  "zh-tw": productsNavZh,
  en: productsNavEn,
  ja: productsNavJa,
} as const;

export function getSeo(locale: Locale = defaultLocale) {
  return seoMap[locale] ?? seoMap[defaultLocale];
}

export function getMainNav(locale: Locale = defaultLocale) {
  return navMap[locale] ?? navMap[defaultLocale];
}

export function getFooter(locale: Locale = defaultLocale) {
  return footerMap[locale] ?? footerMap[defaultLocale];
}

export function getProductsNav(locale: Locale = defaultLocale) {
  return productsNavMap[locale] ?? productsNavMap[defaultLocale];
}

export function resolveLocale(value?: string | null): Locale {
  if (value && isLocale(value)) return value;
  return defaultLocale;
}

const lineLabels: Record<Locale, { label: string; shortLabel: string }> = {
  "zh-tw": {
    label: "透過 LINE 官方帳號聯絡我們",
    shortLabel: "LINE",
  },
  en: {
    label: "Contact us on LINE",
    shortLabel: "LINE",
  },
  ja: {
    label: "LINE 公式アカウントでお問い合わせ",
    shortLabel: "LINE",
  },
};

export function getLineContact(locale: Locale = defaultLocale) {
  const href = siteConfig.lineOfficialAccountUrl?.trim() ?? "";
  const labels = lineLabels[locale] ?? lineLabels[defaultLocale];

  return {
    href,
    basicId: siteConfig.lineBasicId?.trim() ?? "",
    iconSrc: siteConfig.lineIconSrc?.trim() ?? "/images/line-icon.svg",
    ...labels,
  };
}

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
import seoZh from "@data/zh-tw/seo.json";

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

export function getSeo(locale: Locale = defaultLocale) {
  return seoMap[locale] ?? seoMap[defaultLocale];
}

export function getMainNav(locale: Locale = defaultLocale) {
  return navMap[locale] ?? navMap[defaultLocale];
}

export function getFooter(locale: Locale = defaultLocale) {
  return footerMap[locale] ?? footerMap[defaultLocale];
}

export function resolveLocale(value?: string | null): Locale {
  if (value && isLocale(value)) return value;
  return defaultLocale;
}

/** Locale config — 繁中預設、英、日 */
export const locales = ["zh-tw", "en", "ja"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "zh-tw";

export const localeHtmlLang: Record<Locale, string> = {
  "zh-tw": "zh-Hant",
  en: "en",
  ja: "ja",
};

export const localeLabels: Record<Locale, string> = {
  "zh-tw": "繁中",
  en: "EN",
  ja: "日本語",
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/** Parse content id like `zh-tw/about` or `en/blog-post` */
export function parseLocaleId(id: string): { locale: Locale; rest: string } {
  const parts = id.split("/");
  if (parts.length >= 2 && isLocale(parts[0])) {
    return { locale: parts[0], rest: parts.slice(1).join("/") };
  }
  return { locale: defaultLocale, rest: id };
}

/** Page URL slug param for [...slug] catch-all (no leading slash) */
export function pageSlugParam(locale: Locale, rest: string): string | undefined {
  const clean = rest.replace(/\/index$/, "").replace(/^index$/, "");
  if (locale === defaultLocale) {
    return clean.length ? clean : undefined;
  }
  return clean.length ? `${locale}/${clean}` : locale;
}

/** Public path for a page key like `about` or `` (home) */
export function localizedHref(locale: Locale, pageKey: string): string {
  const key = pageKey.replace(/^\/+|\/+$/g, "");
  if (locale === defaultLocale) {
    return key ? `/${key}/` : "/";
  }
  return key ? `/${locale}/${key}/` : `/${locale}/`;
}

/** Blog list href */
export function blogListHref(locale: Locale): string {
  return locale === defaultLocale ? "/blog/" : `/${locale}/blog/`;
}

/** Blog post href */
export function blogPostHref(locale: Locale, postRest: string): string {
  const slug = postRest.replace(/\.mdx?$/, "");
  return locale === defaultLocale ? `/blog/${slug}/` : `/${locale}/blog/${slug}/`;
}

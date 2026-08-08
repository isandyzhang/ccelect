import type { Locale } from "./config";

const ui = {
  "zh-tw": {
    shareArticle: "分享本文：",
    shareEmail: "以 Email 分享",
    copyLink: "複製連結",
    previous: "上一則",
    next: "下一則",
    backHome: "返回首頁",
    search: "搜尋",
    searchUnavailable: "搜尋暫時無法使用，請稍後再試。",
    recentPosts: "相關文章",
    allTags: "全部",
    language: "語言",
    latestNews: "最新文章",
    noPosts: "目前尚無文章。",
  },
  en: {
    shareArticle: "Share this article:",
    shareEmail: "Share via Email",
    copyLink: "Copy link",
    previous: "Previous",
    next: "Next",
    backHome: "Back home",
    search: "Search",
    searchUnavailable: "Search is unavailable right now. Please try again later.",
    recentPosts: "Related posts",
    allTags: "All",
    language: "Language",
    latestNews: "Latest posts",
    noPosts: "No posts yet.",
  },
  ja: {
    shareArticle: "この記事をシェア：",
    shareEmail: "メールでシェア",
    copyLink: "リンクをコピー",
    previous: "前へ",
    next: "次へ",
    backHome: "ホームへ戻る",
    search: "検索",
    searchUnavailable: "現在検索を利用できません。後でもう一度お試しください。",
    recentPosts: "関連記事",
    allTags: "すべて",
    language: "言語",
    latestNews: "最新記事",
    noPosts: "記事はまだありません。",
  },
} as const;

export type UiKey = keyof (typeof ui)["zh-tw"];

export function t(locale: Locale, key: UiKey): string {
  return ui[locale][key] ?? ui["zh-tw"][key];
}

export function dateLocale(locale: Locale): string {
  if (locale === "zh-tw") return "zh-TW";
  if (locale === "ja") return "ja-JP";
  return "en-US";
}

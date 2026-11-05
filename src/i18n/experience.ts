import { defaultLocale, isLocale, localizedHref } from "./config";

export function localeFromPath(pathname: string) {
  const segment = pathname.split("/").filter(Boolean)[0] ?? "";

  return isLocale(segment) ? segment : defaultLocale;
}

export function contactHref(pathname: string, href = "/contact/") {
  return /^\/(?:en\/|ja\/)?contact\/?(?:[?#]|$)/.test(href)
    ? href.replace(
        /^\/(?:en\/|ja\/)?contact\/?/,
        localizedHref(localeFromPath(pathname), "contact")
      )
    : href;
}

export const experienceText = {
  "zh-tw": {
    search: "搜尋",
    loading: "搜尋中…",
    more: "載入更多結果",
    retry: "重試",
    filter: "依類型篩選結果",
    unavailable: "搜尋暫時無法使用，請重試。",
    empty: "找不到「{query}」的結果，請試試其他關鍵字。",
    count: "「{query}」共有 {count} 筆結果",
    products: "商品櫥窗",
    browse: "瀏覽商品分類",
    contact: "聯絡我們",
    previous: "上一張",
    next: "下一張",
    image: "圖片",
    details: "詳情",
    features: "特點",
    applications: "應用場景",
    videos: "影片",
    projects: "工程實績",
    itemCount: "共 {count} 個商品",
    viewProduct: "查看產品資訊",
    series: "系列資訊",
    pending: "示範資料：正式規格、熔模與用量請洽業務確認。",
    untranslated: "尚無此語言版本",
    openMenu: "開啟選單",
    closeMenu: "關閉選單",
  },
  en: {
    search: "Search",
    loading: "Searching…",
    more: "Load more results",
    retry: "Retry",
    filter: "Filter results by type",
    unavailable: "Search is unavailable. Please try again.",
    empty: "No results for “{query}”. Try another search term.",
    count: "{count} results for “{query}”",
    products: "Products",
    browse: "Browse product categories",
    contact: "Contact us",
    previous: "Previous image",
    next: "Next image",
    image: "Image",
    details: "Details",
    features: "Features",
    applications: "Applications",
    videos: "Videos",
    projects: "Projects",
    itemCount: "{count} products",
    viewProduct: "View product details",
    series: "Series information",
    pending: "Demo information: confirm final specifications, molds and quantities with sales.",
    untranslated: "Translation unavailable",
    openMenu: "Open navigation menu",
    closeMenu: "Close navigation menu",
  },
  ja: {
    search: "検索",
    loading: "検索中…",
    more: "さらに表示",
    retry: "再試行",
    filter: "種類で絞り込む",
    unavailable: "検索を利用できません。もう一度お試しください。",
    empty: "「{query}」の結果がありません。別のキーワードをお試しください。",
    count: "「{query}」の検索結果：{count} 件",
    products: "製品一覧",
    browse: "製品カテゴリを見る",
    contact: "お問い合わせ",
    previous: "前の画像",
    next: "次の画像",
    image: "画像",
    details: "詳細",
    features: "特長",
    applications: "用途",
    videos: "動画",
    projects: "施工実績",
    itemCount: "製品数：{count}",
    viewProduct: "製品情報を見る",
    series: "シリーズ情報",
    pending: "デモ情報：正式な仕様・金型・使用量は営業担当にご確認ください。",
    untranslated: "翻訳はまだありません",
    openMenu: "メニューを開く",
    closeMenu: "メニューを閉じる",
  },
} as const;

# 集集電工業股份有限公司 — 官方網站

以靜態網站重構 [集集電工業既有官網](http://www.ccelect.com.tw/chinese/supplier.html)（CCElect），提供公司介紹、商品櫥窗、技術訊息、工程實績與聯絡管道。

| 項目     | 內容                                                                                               |
| -------- | -------------------------------------------------------------------------------------------------- |
| 公司     | 集集電工業股份有限公司                                                                             |
| 參考站   | [http://www.ccelect.com.tw/chinese/supplier.html](http://www.ccelect.com.tw/chinese/supplier.html) |
| 正式網域 | `https://www.ccelect.com.tw`                                                                       |
| 框架     | [Astro](https://astro.build/)（靜態輸出 SSG）                                                      |
| 起點範本 | [Astro Jetstream](https://github.com/CloudCannon/astro-jetstream)（已替換為集集電品牌與內容）      |
| 語系     | 繁體中文（預設）／English／日本語                                                                  |

---

## 專案現況

- 已以 **Jetstream** 為骨架完成官網起點：品牌色、字體、多語選單與主要頁面
- 主選單對齊舊站七項：關於我們、商品櫥窗、技術訊息、工程實績、市場服務、聯絡我們
- 商品／工程／服務等頁目前為佔位內容，後續依型錄與素材補齊
- **LINE 官方帳號**一期採按鈕／連結導向（連結待客戶提供；不做 Messaging API）
- 全站靜態輸出，可部署至靜態主機或 Cloudflare／Netlify／Vercel 等

---

## 技術方案

| 層面       | 採用                   | 說明                                                             |
| ---------- | ---------------------- | ---------------------------------------------------------------- |
| 框架       | **Astro**              | 內容型官網、預設靜態 HTML                                        |
| 起點範本   | **Astro Jetstream**    | 元件、版型與 content collections；品牌已替換                     |
| 樣式       | CSS 變數＋主題 token   | 見 [`docs/brand-colors.md`](./docs/brand-colors.md)              |
| 字體       | 思源黑體／Noto Sans TC | 見 [`docs/typography.md`](./docs/typography.md)                  |
| 內容       | Markdown／MDX          | `src/content/pages`、`src/content/blog`                          |
| 多語系     | Astro `i18n`           | 預設 `zh-tw`（無前綴）；`/en/`、`/ja/`                           |
| 聯絡／LINE | 按鈕導向 LINE 官方帳號 | 一期不做 Messaging API                                           |
| 部署       | 靜態 `dist/`           | `astro.config.mjs` 的 `site` 已設為 `https://www.ccelect.com.tw` |

---

## 本機開發

環境：Node.js **22+**（見 `package.json` 的 `engines`）、npm。

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # 輸出至 ./dist/
npm run preview   # 預覽建置結果
npm run check     # ESLint + Stylelint + Prettier
npm run check:fix # 自動修正可修項目
```

Windows PowerShell 若因執行原則無法載入 `npm.ps1`，可改用 `npm.cmd`：

```powershell
npm.cmd run dev
```

---

## 第一次寫 Astro：先理解這四件事

### 1. `.astro` 元件的結構

Astro 元件通常由「建置時程式、HTML 模板、樣式、瀏覽器腳本」組成：

```astro
---
import Button from './Button.astro';

const { title = '預設標題' } = Astro.props;
---

<section>
  <h1>{title}</h1>
  <Button text="聯絡我們" />
</section>

<style>
  /* 預設只套用到目前元件 */
  section {
    padding: 2rem;
  }
</style>

<script>
  // 這一段才會在瀏覽器執行
  console.log('page loaded');
</script>
```

- `---` 之間的程式在建置或伺服器端執行。
- `Astro.props` 是父元件傳入的資料。
- `{condition && <Component />}` 用於條件顯示。
- `{items.map(...)}` 用於重複渲染。
- `<slot />` 是父元件放進子元件的內容。
- Astro 元件預設輸出 HTML，不會自動把整套元件 JavaScript 傳到瀏覽器。

### 2. 本專案以內容驅動頁面

本專案不是每個網址都手寫一個 `.astro` 頁面。大部分頁面先在 Markdown frontmatter 描述內容，再由 Astro 選擇元件：

```yaml
---
title: 首頁
pageSections:
  - _component: page-sections/heroes/hero-center
    heading: 首頁標題
    subtext: 首頁說明
---
```

上面的 `_component` 會對應到：

```text
src/components/page-sections/heroes/hero-center/HeroCenter.astro
```

其他欄位會作為 props 傳入該元件，概念上等同：

```astro
<HeroCenter heading="首頁標題" subtext="首頁說明" />
```

### 3. 首頁從內容到 HTML 的流程

```text
src/content/pages/zh-tw/index.md
        ↓
src/content.config.ts 載入並驗證 pages collection
        ↓
src/pages/[...slug].astro 透過 getStaticPaths() 產生 URL
        ↓
src/layouts/Page.astro 加入主選單、Footer 與頁面區塊
        ↓
src/components/utils/MainComponent.astro
        ↓
src/components/utils/renderBlock.astro 根據 _component 尋找元件
        ↓
HeroCenter.astro、FeatureGrid.astro、CtaCenter.astro 等元件
        ↓
src/layouts/BaseLayout.astro 輸出完整 HTML
```

`getStaticPaths()` 在建置時決定動態路由，因此：

```text
src/content/pages/zh-tw/index.md  → /
src/content/pages/zh-tw/about.md  → /about/
src/content/pages/en/about.md     → /en/about/
src/content/pages/ja/about.md     → /ja/about/
```

### 4. 修改需求時先找哪裡

| 想修改的內容             | 優先查看的位置                                     |
| ------------------------ | -------------------------------------------------- |
| 頁面標題、文案、圖片     | `src/content/pages/{語系}/`                        |
| Blog 文章                | `src/content/blog/{語系}/`                         |
| 導覽列、Footer、SEO 資料 | `src/data/{語系}/`                                 |
| 區塊 HTML、CSS、動畫     | `src/components/page-sections/`                    |
| Button、Heading 等小元件 | `src/components/building-blocks/`                  |
| 全站色彩、間距、字型     | `src/styles/variables/`、`src/styles/themes/`      |
| URL 與多語路徑           | `src/pages/`、`src/i18n/`、`src/content.config.ts` |

修改樣式時優先使用既有 CSS token，例如：

```css
.example {
  color: var(--color-text-strong);
  padding: var(--spacing-2xl);
  border-radius: var(--radius-sm);
}
```

不要一開始就閱讀所有元件。第一次熟悉專案，建議依序追蹤：

1. `src/content/pages/zh-tw/index.md`
2. `src/pages/[...slug].astro`
3. `src/layouts/Page.astro`
4. `src/components/utils/renderBlock.astro`
5. `src/components/page-sections/heroes/hero-center/HeroCenter.astro`

---

## 資訊架構（主選單）

```
首頁
關於我們        /about/
商品櫥窗        /products/     （佔位，型錄待補）
技術訊息        /blog/
工程實績        /projects/     （佔位）
市場服務        /services/     （佔位）
聯絡我們        /contact/
```

英／日路徑加上語系前綴，例如 `/en/about/`、`/ja/contact/`。語言切換為導覽列下拉選單。

**公司重點（首頁／關於頁素材）**

- 成立：1979（民國 68）
- 業務：接地鋁熱熔接材料與模具、電解式接地棒、接地材料、避雷材料、接地測試與設計諮詢
- 認證摘要：台電型式試驗、與 ERICO 技術合作、UL（E305374）、ISO 9001 等
- 聯絡：台北市雲和街 2-2 號 · 886-2-23632992 · [cce@ccelect.com.tw](mailto:cce@ccelect.com.tw)

---

## 目錄結構（精簡）

```text
ccelect/
├── docs/                     # 品牌色、字體、上游範本說明
├── public/
├── src/
│   ├── components/           # UI／導覽（含語言切換）
│   │   ├── building-blocks/  # Button、Heading、Card 等基礎元件
│   │   ├── navigation/       # 主選單、Footer、語言與主題切換
│   │   ├── page-sections/    # Hero、Feature、CTA、FAQ 等完整區塊
│   │   └── utils/            # 動態元件渲染與共用工具
│   ├── content/
│   │   ├── pages/{zh-tw,en,ja}/
│   │   └── blog/{zh-tw,en,ja}/
│   ├── data/{zh-tw,en,ja}/   # 主選單、頁尾、SEO
│   ├── i18n/                 # locale 與路徑 helper
│   ├── layouts/              # HTML 外框、SEO、主選單與 Footer
│   ├── pages/                # Astro 檔案路由（含 en／ja）
│   ├── styles/               # 主題與色票 token
│   └── content.config.ts     # Content Collections 與資料 schema
├── astro.config.mjs
├── package.json
└── README.md
```

更多文件索引見 [`docs/README.md`](./docs/README.md)。

---

## LINE 官方帳號（一期）

採 **按鈕／連結導向**，不做 LINE Login、不做 Messaging API。

| 項目     | 說明                                                                                                                     |
| -------- | ------------------------------------------------------------------------------------------------------------------------ |
| 行為     | 點按鈕 → 開啟 LINE 加好友或聊天                                                                                          |
| 連結     | 優先用 [LINE Official Account Manager](https://manager.line.biz/) 複製的加好友連結；或 `https://line.me/R/ti/p/@BasicID` |
| 實作     | 靜態 `<a href="...">`；設定集中管理，避免到處硬編                                                                        |
| 部署影響 | **無需後端**                                                                                                             |

客戶需提供：Basic ID（`@xxxxx`）或加好友 URL、（可選）QR Code、按鈕文案。

不在一期：Messaging API、表單推播到 LINE、LINE Login。

---

## 建議後續分期

| 階段 | 內容                                               |
| ---- | -------------------------------------------------- |
| 現在 | Jetstream 骨架、品牌、多語選單、主要頁面佔位       |
| 下一 | 商品型錄 content 結構、工程實績照片專欄、LINE 連結 |
| 之後 | 型錄深度、SEO／轉址、正式部署切換                  |

---

## 營業項目（參考站）

1. 接地用鋁熱熔接劑與模具製造、銷售（Exothermic welding material & mold）
2. 電解式接地棒施工銷售（Chemical rod）
3. 其它接地材料（Earth rod & grounding material）
4. 避雷材料製造銷售（Lightning protection equipment）
5. 接地測試（Earthing test）

---

## 相關連結

- 參考官網：[http://www.ccelect.com.tw/chinese/supplier.html](http://www.ccelect.com.tw/chinese/supplier.html)
- Astro：[https://astro.build/](https://astro.build/) · [文件](https://docs.astro.build/) · [部署](https://docs.astro.build/en/guides/deploy/)
- 上游範本說明：[`docs/jetstream-upstream-README.md`](./docs/jetstream-upstream-README.md)
- LINE Official Account Manager：[https://manager.line.biz/](https://manager.line.biz/)

---

## 授權

- 本站圖文版權屬集集電工業股份有限公司（或依實際約定）
- 起點範本 Astro Jetstream 請遵守其上游授權要求
- 本 repo 原始碼授權見 [`LICENSE.md`](./LICENSE.md)

---

## 變更紀錄

| 日期       | 決議                                                                                |
| ---------- | ----------------------------------------------------------------------------------- |
| 2026-08-04 | 採用靜態網站（Astro）；LINE 一期按鈕導向                                            |
| 2026-08-04 | 初選 ProCleaning；後改以 **Astro Jetstream** 為實際骨架                             |
| 2026-08-08 | 匯入 Jetstream：品牌樣式、繁中內容、zh-tw／en／ja 多語                              |
| 2026-08-12 | 對齊舊站七項主選單；商品／工程／服務佔位頁；語言切換改下拉選單；README 改為反映現況 |
| 2026-08-14 | 新增 Astro 初學者導覽、首頁渲染流程、常見修改位置；開發環境更新為 Node.js 22+       |

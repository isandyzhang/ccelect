# 集集電工業

集集電工業股份有限公司官方網站。內容涵蓋公司介紹、接地與避雷產品、技術訊息、工程實績與聯絡方式。

|          |                                                                 |
| -------- | --------------------------------------------------------------- |
| 網站     | https://ccelect.isandyzhang.workers.dev/                       |
| 正式網域 | https://www.ccelect.com.tw                                      |
| 技術     | Astro 6，靜態輸出                                               |
| 語系     | 繁體中文（預設）、English、日本語                               |
| 部署     | 推上 `main` 後由 GitHub Actions 建置並部署至 Cloudflare Workers |

## 開發

需要 Node.js 22 以上。`.nvmrc` 與 CI 使用 Node.js 24。

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # 輸出 dist/，並建立搜尋索引
npm run preview
npm run check
```

Windows 若無法執行 `npm.ps1`，改用 `npm.cmd`。

## 內容位置

| 修改            | 位置                                                        |
| --------------- | ----------------------------------------------------------- |
| 頁面文案        | `src/content/pages/{zh-tw,en,ja}/`                          |
| 技術文章        | `src/content/blog/{zh-tw,en,ja}/`                           |
| 導覽、頁尾、SEO | `src/data/{zh-tw,en,ja}/`                                   |
| 區塊版面        | `src/components/page-sections/`                             |
| 色彩與字級      | `src/styles/`、`docs/brand-colors.md`、`docs/typography.md` |

頁面由 Markdown frontmatter 的 `pageSections` 組成。`_component` 對應 `src/components/` 下的區塊。`draft: true` 只在本機預覽，正式建置會排除。

## 網站結構

```text
/             首頁
/about/       關於我們
/products/    商品
/blog/        技術訊息
/projects/    工程實績
/services/    市場服務
/contact/     聯絡我們
```

英文與日文路徑加上 `/en/`、`/ja/`。

## 部署

`.github/workflows/deploy.yml` 在推上 `main` 時執行建置與 `wrangler deploy`。Worker 名稱與靜態目錄見 `wrangler.jsonc`。

## 目錄

```text
src/content/      頁面與文章
src/components/   區塊與基礎元件
src/data/         導覽與 SEO
src/i18n/         語系
public/           直接提供的靜態檔
docs/             品牌與內容說明
```

## 授權

網站圖文屬集集電工業股份有限公司。程式授權見 [`LICENSE.md`](./LICENSE.md)。

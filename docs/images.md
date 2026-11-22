# 圖片管理

## 正式網站圖片

`public/images/ccelect/` 放網站直接使用、網址固定的成品，依用途分類：

| 目錄 | 用途與命名 |
| --- | --- |
| `brand/` | 品牌標誌：`logo-black.png`、`logo-white.png` |
| `home/` | 首頁：`ignition-poster.jpg`、`product-display.png` |
| `projects/` | 工程實績：`fab.jpg`、`hsr.webp`、`metro.webp` 等 |
| `products/<model>/` | 各型號的去背圖、圖面、實拍照片 |
| `accessories/` | 配件與工具情境成品 |
| `grounding/` | 接地互動展示場景 |

每個產品的命名規則：

- `cutout.png`：商品列表使用的透明去背成品。
- `diagram.svg` 或 `diagram.jpg`：接點圖面。不同格式可能有不同內容，不以副檔名判斷重複。
- `diagram-conductors.png`：有明確用途的圖面變體。
- `photo-hero.jpg`：產品主實拍照。
- `photo-mold-open.jpg`、`photo-setup.jpg`、`photo-joint.jpg`：依拍攝內容命名。

例如 WP 的正式網址是 `/images/ccelect/products/wp/cutout.png`。
工具實拍成品使用 `accessories/<tool>/photo-hero.jpg`。目前選圖來源為
`lighter-0384.jpg`、`handle-0389.jpg`、`brush-0376.jpg`、`clean-shave-0387.jpg`，
原檔保留在 `assets/source/ccelect/accessories/`；網站版依 EXIF 轉正並縮至最長邊 1200px。
同一工具目錄另有 `diagram.svg`（分類導覽用、可編輯黑白向量線稿）及
`cutout.png`（探索產品線用、AI 優化透明背景圖）。工具介紹頁仍保留實拍照供對照。
線稿參考原始照片與型錄第 6 頁的工具圖示，不包含嵌入式點陣圖。

工具去背圖使用內建 imagegen 製作。提示詞重點：保留照片中的工具結構與材質，
移除桌面、人物與其他物件，以中性棚拍光線提升清晰度，完整置中、透明背景、無文字與落地陰影。
點火機保留金屬本體、扳機與圓孔；模夾保留雙把手、立柱、蝶形螺帽及連桿；
毛刷保留多面刷頭與木柄並補全手部遮住的柄端；清模鏟保留彎柄、焊點與鏟頭。

WP、WL、WXL 的 `cutout.png` 是參照 WX 材質生成的 AI 示意圖，不是原始實拍。
產品型號放在資料夾，檔名不再重複型號，也不使用 `v2`、`enhanced`、`final-final` 等製作歷程名稱。

## Astro 處理的圖片

`src/assets/images/` 中的圖片由現有 Astro 圖片載入流程處理，保留此機制：

- `ccelect/certifications/`：證書。
- `ccelect/testing/`：試驗照片。
- `ccelect/projects/`：施工照片。
- `ccelect/products/`：現有文章使用的產品照片。
- `ccelect/placeholders/`：尚未提供正式圖的產品佔位圖。
- `template/`：Jetstream 模板素材，與集集電的正式素材分開。
- `component-docs/`：元件文件示例素材。

不要為同一張圖同時在 `public` 與 `src/assets` 新增副本；依消費端原本使用的載入方式選擇一個位置。

## 原始素材與封存

以下目錄位於網站發布目錄之外，不會被 Astro 原樣複製到網站：

- `assets/source/ccelect/products/`：產品原始照片。
- `assets/source/ccelect/accessories/`：配件原始照片；相機編號保留在描述性檔名中，方便回查。
- `assets/archive/ccelect/public/`：舊公開素材、未採用版本與修圖前備份。
- `assets/archive/ccelect/astro/`：原本放在 Astro 素材區但已無引用的舊圖。

封存素材保留舊分類與檔名，便於追溯。`before-brightening/` 是原先隱藏的亮度調整備份。
只有 SHA-256 完全一致的未使用檔案才合併，不以肉眼相似作為刪除依據。

[image-migration.json](./image-migration.json) 記錄這次整理時的舊路徑、新路徑、分類、大小、SHA-256 與當時找到的引用。
這是搬移快照，不是持續更新的素材資料庫；`duplicate` 表示已合併到另一份內容完全相同的檔案。

## 後續新增或更換圖片

1. 原始照片先放 `assets/source/`，製作中的圖不要放入 `public/`。
2. 選定正式版本後，依用途與型號放入成品目錄，使用小寫英文字母與連字號。
3. 替換圖片前，仍需留存的舊版放入 `assets/archive/`；正式檔名保持穩定。
4. 若更動路徑，同步更新三種語言內容、元件、CMS 設定及素材產生腳本。
5. 執行 `npm run build`，並檢查相關頁面。部署後如使用 CDN，需配合清除圖片快取。

影片維持 `public/videos/`，影片製作腳本及中間檔維持 `scripts/assets/`；型錄 PDF 與擷取資料維持 `docs/`，不混入網站成品圖片。

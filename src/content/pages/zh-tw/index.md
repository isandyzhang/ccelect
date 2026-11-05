---
_schema: default
permalink:
title: 首頁
description: >-
  集集電工業股份有限公司提供 Exoweld 鋁熱熔接材料與模具、接地與避雷材料，以及接地測量、設計與技術支援。
keywords:
  - 集集電
  - Exoweld
  - 鋁熱熔接
  - 接地
  - 避雷
pageSections:
  - _component: page-sections/heroes/hero-image-banner
    id: homepage-banner
    imageSource: /images/ccelect/banner-ignition.jpg
    imageAlt: 接地鋁熱熔接與接地／避雷解決方案
    videoIntroSource: /videos/ccelect/hero-ignition-intro.mp4
    videoSource: /videos/ccelect/hero-loop.mp4
    scrollMask: true
    heading: 接地鋁熱熔接與<br />接地／避雷解決方案
    subtext: 自 1979 年投入接地工程材料與技術，提供 Exoweld 熱熔接系統、接地與避雷組件、<br />接地測量、設計諮詢及現場技術支援。
    buttonSections: []
  - _component: page-sections/features/grounding-experience
    id: grounding-experience
  - _component: page-sections/features/feature-grid
    id: products
    eyebrowIcon: {}
    eyebrowText: 主打產品
    heading: Exoweld<br />熱熔接系統
    subtext: 火泥熔模與銅導體熔接方案，涵蓋 W 系列銅導體接點（WE、WT、WX、WP、WL、WXL）<br />與 G 系列導體／接地極連接（GEE、GET、GST、GEY、GEP）。
    featureGrid:
      features:
        - _component: page-sections/products/product-showcase
          link: /products/exoweld/
          columnSpan: 12
          image:
            source: /images/ccelect/prd-display-enhanced.png
            alt: Exoweld 火泥熔模、熔接成品與銅導體接點
            rounded: false
      gridMaxWidth: none
    maxContentWidth: 2xl
    paddingVertical: none
    colorScheme: dark
    backgroundColor: none
    contentBackground: false
    rounded: false
  - _component: page-sections/features/feature-grid
    id: project-fields
    class: feature-grid-mosaic
    eyebrowIcon: {}
    eyebrowText: ""
    heading: ""
    subtext: ""
    featureGrid:
      features:
        - _component: page-sections/features/feature-grid/feature-item
          title: 台灣高鐵工程
          link: /projects/
          columnSpan: 4
          image:
            source: /images/ccelect/project-hsr-retouched.webp
            alt: 台灣高鐵接地與避雷工程現場紀錄
        - _component: page-sections/features/feature-grid/feature-item
          title: 捷運與機場捷運工程
          link: /projects/
          columnSpan: 4
          image:
            source: /images/ccelect/project-metro-retouched.webp
            alt: 捷運軌道接地工程現場紀錄
        - _component: page-sections/features/feature-grid/feature-item
          title: 台電工程
          link: /projects/
          columnSpan: 4
          image:
            source: /images/ccelect/project-taipower-retouched.webp
            alt: 台電工程接地與避雷現場紀錄
        - _component: page-sections/features/feature-grid/feature-item
          title: 積體電路及光電廠
          link: /projects/
          columnSpan: 4
          image:
            source: /images/ccelect/project-fab.jpg
            alt: 積體電路與光電廠廠房外觀
        - _component: page-sections/features/feature-grid/feature-item
          title: 資源回收廠
          link: /projects/
          columnSpan: 8
          image:
            source: /images/ccelect/project-incinerator.jpg
            alt: 資源回收廠焚化爐外觀
      gridMaxWidth: none
    maxContentWidth: 2xl
    paddingVertical: 4xl
    colorScheme: light
    backgroundColor: highlight-grid
    contentBackground: false
    rounded: false
  - _component: page-sections/features/business-scope
    id: technical-reading
    motion: hover
    eyebrowText: 技術閱讀
    heading: 從材料特性到系統設計
    subtext: 整理舊站技術資料，提供規格、施工與接地設計的基礎閱讀。
    items:
      - id: weld
        figure: "01"
        title: 鋁熱熔接的電氣與機械特性
        description: 了解分子結合、載流能力、溫升與接點強度。
        link: /blog/exothermic-welding-properties/
      - id: process
        figure: "02"
        title: 火泥熔接施工流程與現場準備
        description: 從模具乾燥、固定導體到點火與完成後檢查。
        link: /blog/exothermic-welding-process/
      - id: rod
        figure: "03"
        title: 接地系統設計的基本分類與考量
        description: 區分電力系統、設備、避雷與電子設備接地需求。
        link: /blog/grounding-system-design/
  - _component: page-sections/ctas/cta-center
    id: credentials
    eyebrowIcon: {}
    eyebrowText: 品質歷程
    heading: 從型式試驗到品質系統
    subtext: >-
      歷史紀錄包含 1981 年台電型式試驗、1999 年 UL 熔接試樣檢驗及後續 ISO 品質系統認證；現行證書與歷史測試分開呈現。
    buttonSections:
      - _component: building-blocks/core-elements/button
        text: 查看公司沿革與認證
        hideText: false
        link: /about/#certifications
        iconName: arrow-right
        iconPosition: after
        variant: primary
        size: md
    maxContentWidth: xl
    paddingVertical: 2xl
    colorScheme: dark
    backgroundColor: highlight-radial-gradient
    contentBackground: false
    rounded: false
  - _component: page-sections/ctas/cta-center
    id: contact-cta
    eyebrowIcon: {}
    eyebrowText: 規格與專案洽詢
    heading: 需要選型、測量或設計支援？
    subtext: 台北市雲和街 2-2 號 · 886-2-23632992 · cce@ccelect.com.tw
    buttonSections:
      - _component: building-blocks/core-elements/button
        text: Email 業務部
        hideText: false
        link: mailto:cce@ccelect.com.tw
        iconName: envelope
        iconPosition: before
        variant: primary
        size: md
      - _component: building-blocks/core-elements/button
        text: 聯絡資訊
        hideText: false
        link: /contact/
        iconName: arrow-right
        iconPosition: after
        variant: secondary
        size: md
    maxContentWidth: xl
    paddingVertical: 2xl
    colorScheme: light
    backgroundColor: base
    contentBackground: false
    rounded: false
---

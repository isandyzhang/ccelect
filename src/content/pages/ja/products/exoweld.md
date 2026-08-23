---
_schema: default
permalink: null
title: Exoweld カタログ
description: W／G／S／R／P／B／E シリーズのテルミット溶接型録。
pageSections:
- _component: page-sections/builders/custom-section
  id: products-layout
  maxContentWidth: 3xl
  paddingHorizontal: md
  paddingVertical: lg
  colorScheme: light
  backgroundColor: base
  contentBackground: false
  rounded: false
  contentSections:
  - _component: building-blocks/wrappers/split
    distributionMode: quarter-three-quarters
    minSplitWidth: 768
    reverseOrderOnMobile: true
    alignmentVertical: start
    firstColumnContentSections:
    - _component: navigation/products-side
    secondColumnContentSections:
    - _component: building-blocks/core-elements/breadcrumb
      items:
      - label: ホーム
        href: /ja/
      - label: 商品
        href: /ja/products/
      - label: Exoweld カタログ
    - _component: building-blocks/core-elements/heading
      level: h2
      size: lg
      alignmentHorizontal: start
      text: Exoweld カタログ
    - _component: page-sections/features/feature-grid
      eyebrowIcon: {}
      eyebrowText: Exoweld カタログ
      heading: 導体と接点形式でシリーズを選定
      subtext: シリーズ名は旧カタログに準拠。金型・溶接剤・線径は営業部にご確認ください。
      featureGrid:
        features:
        - _component: page-sections/features/feature-grid/feature-item
          title: W 系列
          description: WE、WT、WX、WP、WL、WXL 等銅導體接點形式。
          image:
            source: /src/assets/images/ccelect/legacy/product-exoweld-we.jpg
            alt: Exoweld WE 系列導體接點與規格示意
            rounded: true
          eyebrowIcon:
            _component: building-blocks/core-elements/icon
            name: bolt
            size: 2xl
            color: brand
            background: true
        - _component: page-sections/features/feature-grid/feature-item
          title: G 系列
          description: GEE、GET、GST、GEY、GEP 等導體與接地極連接形式。
          eyebrowIcon:
            _component: building-blocks/core-elements/icon
            name: bolt
            size: 2xl
            color: brand
            background: true
        - _component: page-sections/features/feature-grid/feature-item
          title: S 系列
          description: SHEA、SHEB、SVES 等特殊接點形式與對應型錄。
          eyebrowIcon:
            _component: building-blocks/core-elements/icon
            name: bolt
            size: 2xl
            color: brand
            background: true
        - _component: page-sections/features/feature-grid/feature-item
          title: R 系列
          description: RHEH、RHXH 系列接點形式。
          eyebrowIcon:
            _component: building-blocks/core-elements/icon
            name: bolt
            size: 2xl
            color: brand
            background: true
        - _component: page-sections/features/feature-grid/feature-item
          title: P 系列
          description: PK、PV、PY、PT 系列接點形式。
          eyebrowIcon:
            _component: building-blocks/core-elements/icon
            name: bolt
            size: 2xl
            color: brand
            background: true
        - _component: page-sections/features/feature-grid/feature-item
          title: B 系列
          description: BE、BEH、BT、BTV 系列接點形式。
          eyebrowIcon:
            _component: building-blocks/core-elements/icon
            name: bolt
            size: 2xl
            color: brand
            background: true
        - _component: page-sections/features/feature-grid/feature-item
          title: E 系列
          description: ERW 系列接點形式。
          eyebrowIcon:
            _component: building-blocks/core-elements/icon
            name: bolt
            size: 2xl
            color: brand
            background: true
      maxContentWidth: 2xl
      paddingVertical: 4xl
      colorScheme: light
      backgroundColor: base
      contentBackground: false
      rounded: false
- _component: page-sections/ctas/cta-center
  id: product-contact
  eyebrowIcon: {}
  eyebrowText: 仕様・見積
  heading: 導体と現場条件をお知らせください
  subtext: 導体材質、線径、接点形式、数量、現場環境をご提示ください。
  buttonSections:
  - _component: building-blocks/core-elements/button
    text: メール
    hideText: false
    link: mailto:cce@ccelect.com.tw
    iconName: envelope
    iconPosition: before
    variant: primary
    size: md
  - _component: building-blocks/core-elements/button
    text: お問い合わせ
    hideText: false
    link: /ja/contact/
    iconName: arrow-right
    iconPosition: after
    variant: secondary
    size: md
  maxContentWidth: xl
  paddingVertical: 2xl
  colorScheme: dark
  backgroundColor: highlight-radial-gradient
  contentBackground: false
  rounded: false
---

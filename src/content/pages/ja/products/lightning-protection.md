---
_schema: default
permalink: null
title: 避雷部品
description: 避雷導体の接続・固定・支持部品。
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
      - label: 避雷部品
    - _component: building-blocks/core-elements/heading
      level: h2
      size: lg
      alignmentHorizontal: start
      text: 避雷部品
    - _component: page-sections/features/feature-grid
      eyebrowIcon: {}
      eyebrowText: 避雷部品
      heading: 接続・固定・支持金具
      subtext: 旧カタログ 8 品目。適用導線・型番は営業部にご確認ください。
      featureGrid:
        features:
        - _component: page-sections/features/feature-grid/feature-item
          title: 導線接續配件
          description: Pressure T-Type Cable Splicer 304A／304B 與 Bronze Cross Run Clamp 119。
          eyebrowIcon:
            _component: building-blocks/core-elements/icon
            name: arrows-right-left
            size: 2xl
            color: brand
            background: true
        - _component: page-sections/features/feature-grid/feature-item
          title: Point Base 與 Adapter
          description: Parallel Wire Flat Surface Point Base 62、Adjustable Point Adapter 63A 等品項。
          eyebrowIcon:
            _component: building-blocks/core-elements/icon
            name: adjustments-horizontal
            size: 2xl
            color: brand
            background: true
        - _component: page-sections/features/feature-grid/feature-item
          title: Terminal Support
          description: 67A／67B 銅合金支撐件，對應不同內牙與導線規格。
          image:
            source: /src/assets/images/ccelect/legacy/product-terminal-support.jpg
            alt: Terminal Support 67A／67B 避雷導線支撐件
            rounded: true
          eyebrowIcon:
            _component: building-blocks/core-elements/icon
            name: wrench
            size: 2xl
            color: brand
            background: true
        - _component: page-sections/features/feature-grid/feature-item
          title: 多用途固定配件
          description: Bronze Large Multi Purpose Clamp 297 與 Clamp to Flat Surface 298A。
          eyebrowIcon:
            _component: building-blocks/core-elements/icon
            name: paper-clip
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

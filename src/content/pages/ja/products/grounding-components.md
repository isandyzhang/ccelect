---
_schema: default
permalink: null
title: 溶接型接地部品
description: 埋込接地板と接地端子板。
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
      - label: 溶接型接地部品
    - _component: building-blocks/core-elements/heading
      level: h2
      size: lg
      alignmentHorizontal: start
      text: 溶接型接地部品
    - _component: page-sections/features/feature-grid
      eyebrowIcon: {}
      eyebrowText: 溶接型接地部品
      heading: プレハブ接地部品
      subtext: 建築・設備接地向けの埋込接点部品。
      featureGrid:
        features:
        - _component: page-sections/features/feature-grid/feature-item
          title: Ground Plate
          description: 埋入型接地板，舊型錄包含 AG201-100、AG401-100、AG401-250。
          image:
            source: /src/assets/images/ccelect/legacy/product-ground-plate.jpg
            alt: 埋入型 Ground Plate 接地板組件示意
            rounded: true
          eyebrowIcon:
            _component: building-blocks/core-elements/icon
            name: square-3-stack-3d
            size: 2xl
            color: brand
            background: true
        - _component: page-sections/features/feature-grid/feature-item
          title: 接地端子板
          description: KS、KZ 接地端子板系列，供工程接地引接使用。
          eyebrowIcon:
            _component: building-blocks/core-elements/icon
            name: rectangle-group
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

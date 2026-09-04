---
_schema: default
permalink: null
title: 避雷組件
description: 避雷導線接續、固定與支撐配件。
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
              - label: 首頁
                href: /
              - label: 商品櫥窗
                href: /products/
              - label: 避雷組件
          - _component: building-blocks/core-elements/heading
            level: h2
            size: lg
            alignmentHorizontal: start
            text: 避雷組件
          - _component: page-sections/features/feature-grid
            eyebrowIcon: {}
            eyebrowText: 避雷組件
            heading: 接續、固定與支撐配件
            subtext: 舊型錄共列八項避雷配件，以下呈現代表品項；尺寸與適用導線請洽業務部確認。
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
    eyebrowText: 選型與報價
    heading: 提供導體、接點與施工條件
    subtext: 請提供導體材質、線徑、接點形式、數量及現場環境，業務部將協助確認適用產品。
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
        text: 查看聯絡方式
        hideText: false
        link: /contact/
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

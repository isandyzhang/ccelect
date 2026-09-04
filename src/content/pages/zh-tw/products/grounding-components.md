---
_schema: default
permalink: null
title: 熱熔接型接地組件
description: 埋入型接地板與接地端子板等預製接地組件。
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
              - label: 熱熔接型接地組件
          - _component: building-blocks/core-elements/heading
            level: h2
            size: lg
            alignmentHorizontal: start
            text: 熱熔接型接地組件
          - _component: page-sections/features/feature-grid
            eyebrowIcon: {}
            eyebrowText: 熱熔接型接地組件
            heading: 預製接地組件
            subtext: 提供建築與設備接地所需的埋入式接點組件。
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

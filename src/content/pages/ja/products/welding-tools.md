---
_schema: default
permalink: null
title: 溶接材料・工具
description: 熔模、溶接剤、クランプ、現場工具。
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
              - label: 溶接材料・工具
          - _component: building-blocks/core-elements/heading
            level: h2
            size: lg
            alignmentHorizontal: start
            text: 溶接材料・工具
          - _component: page-sections/features/feature-grid
            eyebrowIcon: {}
            eyebrowText: 溶接材料・工具
            heading: 金型、溶接剤、現場工具
            subtext: 接点形式と施工条件に合わせて選定。使用前に金型の状態と乾燥を確認してください。
            featureGrid:
              features:
                - _component: page-sections/features/feature-grid/feature-item
                  title: 熔模與分割型熔模
                  description: 火泥熔模、分割型熔模及耐磨板等石墨模具相關品項。
                  image:
                    source: /src/assets/images/ccelect/legacy/product-investment-casting.jpg
                    alt: Exoweld 火泥熔模外觀示意
                    rounded: true
                  eyebrowIcon:
                    _component: building-blocks/core-elements/icon
                    name: cube
                    size: 2xl
                    color: brand
                    background: true
                - _component: page-sections/features/feature-grid/feature-item
                  title: 模夾
                  description: 泛用模夾、鏈條模夾及 ML-3 模夾等固定工具。
                  eyebrowIcon:
                    _component: building-blocks/core-elements/icon
                    name: wrench-screwdriver
                    size: 2xl
                    color: brand
                    background: true
                - _component: page-sections/features/feature-grid/feature-item
                  title: 熔接劑與點火清模
                  description: 鋁箔包熔接劑、點火機、清模板及毛刷等品項。
                  eyebrowIcon:
                    _component: building-blocks/core-elements/icon
                    name: fire
                    size: 2xl
                    color: brand
                    background: true
                - _component: page-sections/features/feature-grid/feature-item
                  title: 施工附屬工具
                  description: 電纜剪線鉗、卡式噴燈及工具箱等現場用品。
                  eyebrowIcon:
                    _component: building-blocks/core-elements/icon
                    name: briefcase
                    size: 2xl
                    color: brand
                    background: true
            maxContentWidth: 2xl
            paddingVertical: 4xl
            colorScheme: light
            backgroundColor: surface-linear-gradient
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

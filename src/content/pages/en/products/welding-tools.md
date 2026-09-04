---
_schema: default
permalink: null
title: Welding materials & tools
description: Molds, welding powder, clamps, and field tools.
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
              - label: Home
                href: /en/
              - label: Products
                href: /en/products/
              - label: Welding materials & tools
          - _component: building-blocks/core-elements/heading
            level: h2
            size: lg
            alignmentHorizontal: start
            text: Welding materials & tools
          - _component: page-sections/features/feature-grid
            eyebrowIcon: {}
            eyebrowText: Welding materials & tools
            heading: Molds, powder, and field tools
            subtext: Match tools to joint form and site conditions. Check mold condition and dryness before use.
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
    eyebrowText: Specs & quotes
    heading: Share conductor and site requirements
    subtext: Provide conductor type, size, joint form, quantity, and site conditions for product confirmation.
    buttonSections:
      - _component: building-blocks/core-elements/button
        text: Email sales
        hideText: false
        link: mailto:cce@ccelect.com.tw
        iconName: envelope
        iconPosition: before
        variant: primary
        size: md
      - _component: building-blocks/core-elements/button
        text: Contact us
        hideText: false
        link: /en/contact/
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

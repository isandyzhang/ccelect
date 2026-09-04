---
_schema: default
permalink: null
title: 商品
description: 商品 category index.
keywords:
  - Exoweld
  - grounding
  - lightning
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
          - _component: building-blocks/core-elements/heading
            level: h2
            size: lg
            alignmentHorizontal: start
            text: 商品
          - _component: building-blocks/wrappers/grid
            label: 商品大類
            layout: start
            minItemWidth: 200
            maxItemWidth: 320
            gap: md
            items:
              - contentSections:
                  - _component: building-blocks/wrappers/card
                    paddingHorizontal: md
                    paddingVertical: md
                    rounded: true
                    border: true
                    backgroundColor: base
                    link: /ja/products/exoweld/
                    beforeContentSections:
                      - _component: building-blocks/core-elements/image
                        source: /src/assets/images/ccelect/legacy/product-exoweld-we.jpg
                        alt: Exoweld WE シリーズ
                        aspectRatio: landscape
                        rounded: false
                    contentSections:
                      - _component: building-blocks/core-elements/heading
                        level: h3
                        size: md
                        alignmentHorizontal: start
                        text: Exoweld カタログ
                      - _component: building-blocks/core-elements/list
                        direction: vertical
                        alignmentHorizontal: start
                        size: md
                        listType: bullet
                        items:
                          - text: W シリーズ
                            link: /ja/products/exoweld/
                          - text: G シリーズ
                            link: /ja/products/exoweld/
                          - text: S シリーズ
                            link: /ja/products/exoweld/
                          - text: R シリーズ
                            link: /ja/products/exoweld/
                          - text: P シリーズ
                            link: /ja/products/exoweld/
                      - _component: building-blocks/core-elements/button
                        text: もっと見る
                        link: /ja/products/exoweld/
                        variant: secondary
                        size: sm
              - contentSections:
                  - _component: building-blocks/wrappers/card
                    paddingHorizontal: md
                    paddingVertical: md
                    rounded: true
                    border: true
                    backgroundColor: base
                    link: /ja/products/welding-tools/
                    beforeContentSections:
                      - _component: building-blocks/core-elements/image
                        source: /src/assets/images/ccelect/legacy/product-investment-casting.jpg
                        alt: 火泥熔模
                        aspectRatio: landscape
                        rounded: false
                    contentSections:
                      - _component: building-blocks/core-elements/heading
                        level: h3
                        size: md
                        alignmentHorizontal: start
                        text: 溶接材料・工具
                      - _component: building-blocks/core-elements/list
                        direction: vertical
                        alignmentHorizontal: start
                        size: md
                        listType: bullet
                        items:
                          - text: 材料及工具
                            link: /ja/products/welding-tools/
                          - text: クランプ
                            link: /ja/products/welding-tools/
                          - text: 溶接剤・清掃
                            link: /ja/products/welding-tools/
                          - text: 付属工具
                            link: /ja/products/welding-tools/
                      - _component: building-blocks/core-elements/button
                        text: もっと見る
                        link: /ja/products/welding-tools/
                        variant: secondary
                        size: sm
              - contentSections:
                  - _component: building-blocks/wrappers/card
                    paddingHorizontal: md
                    paddingVertical: md
                    rounded: true
                    border: true
                    backgroundColor: base
                    link: /ja/products/grounding-components/
                    beforeContentSections:
                      - _component: building-blocks/core-elements/image
                        source: /src/assets/images/ccelect/legacy/product-ground-plate.jpg
                        alt: Ground Plate
                        aspectRatio: landscape
                        rounded: false
                    contentSections:
                      - _component: building-blocks/core-elements/heading
                        level: h3
                        size: md
                        alignmentHorizontal: start
                        text: 溶接型接地部品
                      - _component: building-blocks/core-elements/list
                        direction: vertical
                        alignmentHorizontal: start
                        size: md
                        listType: bullet
                        items:
                          - text: Ground Plate
                            link: /ja/products/grounding-components/
                          - text: 接地端子板
                            link: /ja/products/grounding-components/
                      - _component: building-blocks/core-elements/button
                        text: もっと見る
                        link: /ja/products/grounding-components/
                        variant: secondary
                        size: sm
              - contentSections:
                  - _component: building-blocks/wrappers/card
                    paddingHorizontal: md
                    paddingVertical: md
                    rounded: true
                    border: true
                    backgroundColor: base
                    link: /ja/products/grounding-materials/
                    beforeContentSections:
                      - _component: building-blocks/core-elements/image
                        source: /src/assets/images/ccelect/legacy/product-ion-ground-rod.jpg
                        alt: イオン式接地棒
                        aspectRatio: landscape
                        rounded: false
                    contentSections:
                      - _component: building-blocks/core-elements/heading
                        level: h3
                        size: md
                        alignmentHorizontal: start
                        text: 一般接地材料
                      - _component: building-blocks/core-elements/list
                        direction: vertical
                        alignmentHorizontal: start
                        size: md
                        listType: bullet
                        items:
                          - text: 接地棒
                            link: /ja/products/grounding-materials/
                          - text: 接地銅バー
                            link: /ja/products/grounding-materials/
                          - text: 圧着・固定具
                            link: /ja/products/grounding-materials/
                          - text: 接地抵抗測定器
                            link: /ja/products/grounding-materials/
                          - text: 付属材料
                            link: /ja/products/grounding-materials/
                      - _component: building-blocks/core-elements/button
                        text: もっと見る
                        link: /ja/products/grounding-materials/
                        variant: secondary
                        size: sm
              - contentSections:
                  - _component: building-blocks/wrappers/card
                    paddingHorizontal: md
                    paddingVertical: md
                    rounded: true
                    border: true
                    backgroundColor: base
                    link: /ja/products/lightning-protection/
                    beforeContentSections:
                      - _component: building-blocks/core-elements/image
                        source: /src/assets/images/ccelect/legacy/product-terminal-support.jpg
                        alt: Terminal Support
                        aspectRatio: landscape
                        rounded: false
                    contentSections:
                      - _component: building-blocks/core-elements/heading
                        level: h3
                        size: md
                        alignmentHorizontal: start
                        text: 避雷部品
                      - _component: building-blocks/core-elements/list
                        direction: vertical
                        alignmentHorizontal: start
                        size: md
                        listType: bullet
                        items:
                          - text: 接続クランプ
                            link: /ja/products/lightning-protection/
                          - text: ポイントベース
                            link: /ja/products/lightning-protection/
                          - text: Terminal Support
                            link: /ja/products/lightning-protection/
                          - text: 多用途クランプ
                            link: /ja/products/lightning-protection/
                      - _component: building-blocks/core-elements/button
                        text: もっと見る
                        link: /ja/products/lightning-protection/
                        variant: secondary
                        size: sm
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

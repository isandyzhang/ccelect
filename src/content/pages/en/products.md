---
_schema: default
permalink: null
title: Products
description: Products category index.
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
              - label: Home
                href: /en/
              - label: Products
          - _component: building-blocks/core-elements/heading
            level: h2
            size: lg
            alignmentHorizontal: start
            text: Products
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
                    link: /en/products/exoweld/
                    beforeContentSections:
                      - _component: building-blocks/core-elements/image
                        source: /src/assets/images/ccelect/legacy/product-exoweld-we.jpg
                        alt: Exoweld WE series
                        aspectRatio: landscape
                        rounded: false
                    contentSections:
                      - _component: building-blocks/core-elements/heading
                        level: h3
                        size: md
                        alignmentHorizontal: start
                        text: Exoweld catalogs
                      - _component: building-blocks/core-elements/list
                        direction: vertical
                        alignmentHorizontal: start
                        size: md
                        listType: bullet
                        items:
                          - text: W series
                            link: /en/products/exoweld/
                          - text: G series
                            link: /en/products/exoweld/
                          - text: S series
                            link: /en/products/exoweld/
                          - text: R series
                            link: /en/products/exoweld/
                          - text: P series
                            link: /en/products/exoweld/
                      - _component: building-blocks/core-elements/button
                        text: More
                        link: /en/products/exoweld/
                        variant: secondary
                        size: sm
              - contentSections:
                  - _component: building-blocks/wrappers/card
                    paddingHorizontal: md
                    paddingVertical: md
                    rounded: true
                    border: true
                    backgroundColor: base
                    link: /en/products/welding-tools/
                    beforeContentSections:
                      - _component: building-blocks/core-elements/image
                        source: /src/assets/images/ccelect/legacy/product-investment-casting.jpg
                        alt: Exothermic mold
                        aspectRatio: landscape
                        rounded: false
                    contentSections:
                      - _component: building-blocks/core-elements/heading
                        level: h3
                        size: md
                        alignmentHorizontal: start
                        text: Welding materials & tools
                      - _component: building-blocks/core-elements/list
                        direction: vertical
                        alignmentHorizontal: start
                        size: md
                        listType: bullet
                        items:
                          - text: Materials & tools
                            link: /en/products/welding-tools/
                          - text: Clamps
                            link: /en/products/welding-tools/
                          - text: Powder & cleaning
                            link: /en/products/welding-tools/
                          - text: Accessories
                            link: /en/products/welding-tools/
                      - _component: building-blocks/core-elements/button
                        text: More
                        link: /en/products/welding-tools/
                        variant: secondary
                        size: sm
              - contentSections:
                  - _component: building-blocks/wrappers/card
                    paddingHorizontal: md
                    paddingVertical: md
                    rounded: true
                    border: true
                    backgroundColor: base
                    link: /en/products/grounding-components/
                    beforeContentSections:
                      - _component: building-blocks/core-elements/image
                        source: /src/assets/images/ccelect/legacy/product-ground-plate.jpg
                        alt: Ground plate
                        aspectRatio: landscape
                        rounded: false
                    contentSections:
                      - _component: building-blocks/core-elements/heading
                        level: h3
                        size: md
                        alignmentHorizontal: start
                        text: Welded grounding assemblies
                      - _component: building-blocks/core-elements/list
                        direction: vertical
                        alignmentHorizontal: start
                        size: md
                        listType: bullet
                        items:
                          - text: Ground Plate
                            link: /en/products/grounding-components/
                          - text: Terminal plates
                            link: /en/products/grounding-components/
                      - _component: building-blocks/core-elements/button
                        text: More
                        link: /en/products/grounding-components/
                        variant: secondary
                        size: sm
              - contentSections:
                  - _component: building-blocks/wrappers/card
                    paddingHorizontal: md
                    paddingVertical: md
                    rounded: true
                    border: true
                    backgroundColor: base
                    link: /en/products/grounding-materials/
                    beforeContentSections:
                      - _component: building-blocks/core-elements/image
                        source: /src/assets/images/ccelect/legacy/product-ion-ground-rod.jpg
                        alt: Chemical ground rod
                        aspectRatio: landscape
                        rounded: false
                    contentSections:
                      - _component: building-blocks/core-elements/heading
                        level: h3
                        size: md
                        alignmentHorizontal: start
                        text: General grounding materials
                      - _component: building-blocks/core-elements/list
                        direction: vertical
                        alignmentHorizontal: start
                        size: md
                        listType: bullet
                        items:
                          - text: Ground rods
                            link: /en/products/grounding-materials/
                          - text: Copper busbars
                            link: /en/products/grounding-materials/
                          - text: Clamps & connectors
                            link: /en/products/grounding-materials/
                          - text: Earth meters
                            link: /en/products/grounding-materials/
                          - text: Accessories
                            link: /en/products/grounding-materials/
                      - _component: building-blocks/core-elements/button
                        text: More
                        link: /en/products/grounding-materials/
                        variant: secondary
                        size: sm
              - contentSections:
                  - _component: building-blocks/wrappers/card
                    paddingHorizontal: md
                    paddingVertical: md
                    rounded: true
                    border: true
                    backgroundColor: base
                    link: /en/products/lightning-protection/
                    beforeContentSections:
                      - _component: building-blocks/core-elements/image
                        source: /src/assets/images/ccelect/legacy/product-terminal-support.jpg
                        alt: Terminal support
                        aspectRatio: landscape
                        rounded: false
                    contentSections:
                      - _component: building-blocks/core-elements/heading
                        level: h3
                        size: md
                        alignmentHorizontal: start
                        text: Lightning components
                      - _component: building-blocks/core-elements/list
                        direction: vertical
                        alignmentHorizontal: start
                        size: md
                        listType: bullet
                        items:
                          - text: Cable splicers & clamps
                            link: /en/products/lightning-protection/
                          - text: Point bases & adapters
                            link: /en/products/lightning-protection/
                          - text: Terminal Support
                            link: /en/products/lightning-protection/
                          - text: Multi-purpose clamps
                            link: /en/products/lightning-protection/
                      - _component: building-blocks/core-elements/button
                        text: More
                        link: /en/products/lightning-protection/
                        variant: secondary
                        size: sm
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

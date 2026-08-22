---
_schema: default
permalink:
title: Products
description: CCElect product category overview (catalog detail pages in progress).
pageSections:
  - _component: page-sections/heroes/hero-center
    eyebrowIcon: {}
    eyebrowText: Products
    heading: Category overview
    headingSize: 3xl
    subtext: Category outline based on the legacy catalog structure; detailed SKUs coming soon.
    buttonSections:
      - _component: building-blocks/core-elements/button
        text: Request catalog / quote
        hideText: false
        link: /en/contact/
        iconName: arrow-right
        iconPosition: after
        variant: primary
        size: md
    image:
      source: /src/assets/images/hero-1.svg
      alt: Products
      rounded: true
    icons: []
    backgroundDecoration: false
    sectionHeight: default
    maxContentWidth: lg
    colorScheme: inherit
    backgroundColor: highlight-grid
    contentBackground: true
    verticalOffset:
      size: nav-height
      direction: back
    rounded: false
    paddingVertical: md
  - _component: page-sections/features/feature-grid
    id: catalog
    eyebrowIcon: {}
    eyebrowText: Categories
    heading: Legacy catalog structure
    subtext: >-
      Source — [legacy company / catalog site](http://www.ccelect.com.tw/chinese/supplier.html)
    featureGrid:
      features:
        - _component: page-sections/features/feature-grid/feature-item
          title: Exoweld catalogs
          description: W / G / S / R / P / B / E series catalogs (detail pages TBD).
          eyebrowIcon:
            _component: building-blocks/core-elements/icon
            name: book-open
            size: 2xl
            color: brand
            background: true
        - _component: page-sections/features/feature-grid/feature-item
          title: Welding materials & tools
          description: Molds, clamps, cleaning plates, igniters, foil packs, and accessories.
          eyebrowIcon:
            _component: building-blocks/core-elements/icon
            name: wrench-screwdriver
            size: 2xl
            color: brand
            background: true
        - _component: page-sections/features/feature-grid/feature-item
          title: Welded grounding assemblies
          description: Embedded ground plates and terminal plates.
          eyebrowIcon:
            _component: building-blocks/core-elements/icon
            name: square-3-stack-3d
            size: 2xl
            color: brand
            background: true
        - _component: page-sections/features/feature-grid/feature-item
          title: General grounding materials
          description: Chemical / copper-clad rods, busbars, C-clamps, cable clamps, meters.
          eyebrowIcon:
            _component: building-blocks/core-elements/icon
            name: cube
            size: 2xl
            color: brand
            background: true
        - _component: page-sections/features/feature-grid/feature-item
          title: Lightning components
          description: Clamps, point bases, terminal supports, and related LPS accessories.
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
---

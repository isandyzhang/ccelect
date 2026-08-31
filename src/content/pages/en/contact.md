---
_schema: default
permalink:
title: Contact
description: >-
  Contact CCElect: 2-2 Yunhe St., Taipei · 886-2-23632992 · cce@ccelect.com.tw
pageSections:
  - _component: page-sections/ctas/cta-form
    id:
    eyebrowIcon: {}
    eyebrowText: Contact us
    heading: Call or email<br /><span class="highlight-text">for specs &amp; quotes</span>
    subtext: >-
      Address: 2-2 Yunhe St., Taipei<br />Tel: 886-2-23632992 · Fax:
      886-2-23639044<br />Email: cce@ccelect.com.tw<br />LINE: @iaf5267c
    formAction: ./
    formBlocks:
      - _component: building-blocks/forms/input
        label: Name
        name: name
        type: text
        required: true
      - _component: building-blocks/forms/input
        label: Company
        name: company
        type: text
        required: false
      - _component: building-blocks/forms/input
        label: Email
        name: email
        type: email
        required: true
      - _component: building-blocks/forms/textarea
        label: Message
        name: message
        required: true
      - _component: building-blocks/forms/submit
        text: Send
        variant: primary
        size: md
        iconPosition: before
        hideText: false
        disabled: false
    buttonSections:
      - _component: building-blocks/core-elements/button
        text: Chat on LINE
        hideText: false
        link: https://line.me/R/ti/p/@iaf5267c
        iconName: arrow-right
        iconPosition: after
        variant: tertiary
        size: md
      - _component: building-blocks/core-elements/button
        text: Email us
        hideText: false
        link: mailto:cce@ccelect.com.tw
        iconName: arrow-right
        iconPosition: after
        variant: secondary
        size: md
    reverse: false
    maxContentWidth: 2xl
    paddingVertical: 4xl
    colorScheme:
    backgroundColor: highlight-grid
    contentBackground: true
    verticalOffset:
      size: none
      direction: front
    rounded: true
---

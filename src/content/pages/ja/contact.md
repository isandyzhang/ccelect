---
_schema: default
permalink:
title: お問い合わせ
description: 集集電工業へのお問い合わせ。
pageSections:
  - _component: page-sections/ctas/cta-form
    id:
    eyebrowIcon: {}
    eyebrowText: お問い合わせ
    heading: ご連絡ください
    subtext: >-
      住所：台北市雲和街 2-2 号 · TEL：886-2-23632992 · Email：cce@ccelect.com.tw
    formAction: ./
    formBlocks:
      - _component: building-blocks/forms/input
        label: お名前
        name: name
        type: text
        required: true
      - _component: building-blocks/forms/input
        label: 会社名
        name: company
        type: text
        required: false
      - _component: building-blocks/forms/input
        label: メール
        name: email
        type: email
        required: true
      - _component: building-blocks/forms/textarea
        label: 内容
        name: message
        required: true
      - _component: building-blocks/forms/submit
        text: 送信
        variant: primary
        size: md
        iconPosition: before
        hideText: false
        disabled: false
    buttonSections:
      - _component: building-blocks/core-elements/button
        text: メールで問い合わせ
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

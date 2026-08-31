---
_schema: default
permalink:
title: お問い合わせ
description: >-
  集集電への連絡：台北市雲和街 2-2 号 · 886-2-23632992 · cce@ccelect.com.tw
pageSections:
  - _component: page-sections/ctas/cta-form
    id:
    eyebrowIcon: {}
    eyebrowText: お問い合わせ
    heading: お電話・メールで<br /><span class="highlight-text">仕様・見積をご相談</span>
    subtext: >-
      住所：台北市雲和街 2-2 号<br />電話：886-2-23632992　FAX：886-2-23639044<br
      />Email：cce@ccelect.com.tw<br />LINE：@iaf5267c
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
        label: Email
        name: email
        type: email
        required: true
      - _component: building-blocks/forms/textarea
        label: メッセージ
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
        text: LINE で相談
        hideText: false
        link: https://line.me/R/ti/p/@iaf5267c
        iconName: arrow-right
        iconPosition: after
        variant: tertiary
        size: md
      - _component: building-blocks/core-elements/button
        text: メールで相談
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

---
_schema: default
permalink:
title: 聯絡我們
description: >-
  聯絡集集電工業：地址、電話、Email 與表單。
pageSections:
  - _component: page-sections/ctas/cta-form
    id:
    eyebrowIcon: {}
    eyebrowText: 聯絡我們
    heading: 歡迎來電或來信<br /><span class="highlight-text">洽詢規格與報價</span>
    subtext: >-
      地址：台北市雲和街 2-2 號 · 電話：886-2-23632992 · Email：cce@ccelect.com.tw。<br />LINE 官方帳號整合採按鈕導向（連結待客戶提供）。
    formAction: ./
    formBlocks:
      - _component: building-blocks/forms/input
        label: 姓名
        name: name
        type: text
        required: true
      - _component: building-blocks/forms/input
        label: 公司
        name: company
        type: text
        required: false
      - _component: building-blocks/forms/input
        label: Email
        name: email
        type: email
        required: true
      - _component: building-blocks/forms/textarea
        label: 訊息
        name: message
        required: true
      - _component: building-blocks/forms/submit
        text: 送出
        variant: primary
        size: md
        iconPosition: before
        hideText: false
        disabled: false
    buttonSections:
      - _component: building-blocks/core-elements/button
        text: Email 諮詢
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

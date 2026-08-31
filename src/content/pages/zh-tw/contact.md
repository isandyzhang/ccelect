---
_schema: default
permalink:
title: 聯絡我們
description: 集集電工業業務部地址、電話、傳真與 Email；洽詢產品規格、報價、測量及設計服務。
keywords:
  - 集集電聯絡方式
  - 接地材料詢價
  - Exoweld 報價
pageSections:
  - _component: page-sections/ctas/cta-form
    id: contact
    eyebrowIcon: {}
    eyebrowText: 聯絡我們
    heading: 需要更多資訊？<br /><span class="highlight-text">歡迎與我們聯絡</span>
    subtext: >-
      業務部將協助您確認產品規格、報價與技術服務。<br />地址：106 台北市大安區雲和街 2-2 號<br />電話：886-2-23632992（台灣地區可撥
      02-2363-2992）　傳真：886-2-23639044<br />Email：cce@ccelect.com.tw<br />LINE 官方帳號：@iaf5267c
    formAction: ./
    formBlocks:
      - _component: building-blocks/forms/input
        label: 姓名
        name: name
        type: text
        required: true
      - _component: building-blocks/forms/input
        label: 公司名稱
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
        text: 送出訊息
        variant: primary
        size: md
        iconPosition: before
        hideText: false
        disabled: false
    buttonSections:
      - _component: building-blocks/core-elements/button
        text: LINE 官方帳號
        hideText: false
        link: https://line.me/R/ti/p/@iaf5267c
        iconName: arrow-right
        iconPosition: after
        variant: tertiary
        size: md
      - _component: building-blocks/core-elements/button
        text: Email 業務部
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

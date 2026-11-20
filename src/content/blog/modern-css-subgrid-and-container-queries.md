---
title: "現代 CSS 佈局進階指南：Subgrid 與 Container Queries 的心智模型與實踐"
description: "告別傳統視窗斷點思維，透過子網格（Subgrid）與容器查詢（@container）構建真正組件級響應的現代介面。"
pubDate: 2026-11-18T11:00:00.000Z
category: "CSS & Web"
tags: ["CSS", "Layout", "Subgrid", "Container Queries", "Web Standards"]
featured: false
draft: false
---

長久以來，前端工程師受限於**視窗尺寸（Viewport-driven Breakpoints）**。每當我們希望一個卡片組件在側邊欄、主內容區或彈出視窗中呈現不同排版時，往往必須透過父層 class（如 `.sidebar .card`）來進行樣式覆寫，破壞了組件的封裝性。

隨著 **CSS Container Queries** 與 **CSS Grid Level 2 (Subgrid)** 獲得現代瀏覽器的全面支援（Baseline Widely Available），我們終於迎來了真正的**組件級自適應排版（Component-Driven Layout）**。

> 「組件不該關心視窗有多寬，它只需對它所棲身的容器負責。」
> —— *現代響應式設計憲章*

---

## 1. CSS Subgrid：終結卡片內容高度不齊的困境

在傳統的多欄卡片佈局中，標題長短不一會導致卡片內的按鈕、標籤與元資料無法水平對齊。Subgrid 允許巢狀子元素直接繼承父層網格的行列定義：

```css
/* 父層網格容器 */
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--space-6);
}

/* 子卡片採用 subgrid 繼承垂直行軌道 */
.card-item {
  display: grid;
  grid-row: span 3;
  grid-template-rows: subgrid;
  background-color: var(--color-surface);
  border-radius: var(--radius-lg);
  padding: var(--space-5);
  border: var(--border-thin);
}

.card-title {
  grid-row: 1;
}

.card-excerpt {
  grid-row: 2;
}

.card-footer {
  grid-row: 3;
  align-self: end;
}
```

如此一來，同一列中的所有卡片，無論標題是單行或三行，所有卡片的摘要與頁尾按鈕都會**自動整齊對齊**，完全不需依賴 JavaScript 計算或硬編碼 `min-height`。

---

## 2. Container Queries：以容器為基準的樣式蛻變

宣告容器上下文後，內部元素可直接使用 `@container` 規則：

```css
/* 宣告容器類型與名稱 */
.post-card-container {
  container-type: inline-size;
  container-name: card;
}

/* 預設小尺寸卡片（直式單欄） */
.post-card {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

/* 當卡片容器寬度大於 480px 時，自動轉為橫向圖文排版 */
@container card (min-width: 480px) {
  .post-card {
    display: grid;
    grid-template-columns: 180px 1fr;
    align-items: center;
  }
}
```

---

## 3. 視窗媒體查詢 vs. 容器查詢對比

| 特性比較 | Viewport Media Queries (@media) | Container Queries (@container) |
|---|---|---|
| 響應基準 | 整個瀏覽器視窗寬度 (`100vw`) | 最近的具名或匿名容器寬度 (`100cqw`) |
| 組件重用性 | 低（必須受制於全域斷點） | 極高（在側邊欄與首頁皆可完美適配） |
| 維護成本 | 容易產生冗餘的父層 class 覆寫 | 封裝於單一組件內部，單一職責 |
| 瀏覽器支援度 | 100% | Chrome 105+, Safari 16+, Firefox 110+ |

---

## 4. 在 Starlit Library 中的應用實踐

在我們的圖書館主題中，最新文章列表與推薦文章卡片即全面應用了這兩項標準：
1. **文章標題與標籤網格**：卡片內部的分類標籤與發布日期使用 Subgrid 鎖定基線。
2. **行動裝置自適應折疊**：在寬度小於 640px 時，所有卡片自動平滑退回單欄閱讀流，保留純粹而舒適的文字節奏。

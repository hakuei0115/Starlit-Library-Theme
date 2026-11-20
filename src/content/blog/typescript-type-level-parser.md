---
title: "TypeScript 5.x 類型級元編程：構建靜態驗證的 SQL 查詢解析器"
description: "運用條件類型、樣板字面量型別與遞迴元組推導，在編譯時期直接驗證 SQL 語法與輸出型別定義。"
pubDate: 2026-11-17T09:15:00.000Z
category: "TypeScript"
tags: ["TypeScript", "Type Systems", "Metaprogramming", "Compiler"]
featured: true
draft: false
---

TypeScript 的型別系統已被形式化證明為**圖靈完備（Turing Complete）**。這意味著我們可以在型別檢查階段執行任意計算，包括文字剖析、語法樹建構乃至代數運算。

本文將帶領讀者深入 TypeScript 5.x 的型別級元編程技術，親手構建一個在編譯階段即可靜態解析 SQL `SELECT` 語句並推導出強型別結果物件的型別解析器。

> 「如果錯誤可以在編譯期被捕捉，就絕不讓它流向執行期。」
> —— *型別工程的最高準則*

---

## 1. 核心型別算子與心智模型

構建型別級解析器需要熟練掌握以下三項核心算子：

1. **樣板字面量型別（Template Literal Types）**：將字串當作型別進行模式匹配與切分。
2. **條件型別與 `infer` 關鍵字（Conditional Types & Infer）**：從型別表達式中提取未知型別變數。
3. **遞迴尾呼叫優化（Tail-Recursion Elimination）**：突破 TypeScript 預設的 1000 層型別堆疊限制。

---

## 2. 實作步驟：從 SQL 字串到 AST

### 2.1 標記切分（Tokenization）

首先，我們需要將 SQL 查詢字串依照空格或逗號切分為 Token 陣列：

```typescript
// 去除字串前後多餘空白
type Trim<S extends string> = S extends ` ${infer Rest}` | `\n${infer Rest}` | `\t${infer Rest}`
  ? Trim<Rest>
  : S extends `${infer Rest} ` | `${infer Rest}\n` | `${infer Rest}\t`
    ? Trim<Rest>
    : S;

// 依據逗點分割選取欄位
type SplitColumns<S extends string> = S extends `${infer Col},${infer Rest}`
  ? [Trim<Col>, ...SplitColumns<Rest>]
  : [Trim<S>];
```

### 2.2 查詢語法樹抽取（AST Extraction）

接下來，定義符合 `SELECT <fields> FROM <table>` 模式的匹配邏輯：

```typescript
type ParseSelect<Query extends string> = Trim<Query> extends `SELECT ${infer Fields} FROM ${infer Table}`
  ? {
      action: 'SELECT';
      fields: SplitColumns<Fields>;
      table: Trim<Table>;
    }
  : { error: 'Syntax Error: Expected SELECT <fields> FROM <table>' };
```

### 2.3 結合資料庫 Schema 的動態型別推導

假設我們擁有以下資料庫架構定義：

```typescript
interface Schema {
  users: {
    id: number;
    username: string;
    email: string;
    created_at: Date;
  };
  posts: {
    id: number;
    title: string;
    author_id: number;
    view_count: number;
  };
}

// 根據解析出的欄位與資料表，推導出回傳資料的精確型別
type QueryResult<AST, S extends Record<string, any>> = AST extends {
  table: infer T extends keyof S;
  fields: infer F extends Array<string>;
}
  ? F[number] extends '*'
    ? S[T]
    : { [K in F[number] as K extends keyof S[T] ? K : never]: S[T][K & keyof S[T]] }
  : never;
```

---

## 3. 型別安全驗證矩陣

下表展示了編譯時期對不同 SQL 查詢的推導結果：

| 查詢語句 (SQL Query) | 推導出的型別結果 (TypeScript Type) | 編譯狀態 |
|---|---|---|
| `SELECT id, username FROM users` | `{ id: number; username: string; }` | 🟢 通過 |
| `SELECT * FROM posts` | `{ id: number; title: string; ... }` | 🟢 通過 |
| `SELECT invalid_col FROM users` | `{}` (欄位名稱不匹配) | 🟡 型別防護 |
| `UPDATE users SET name = 'Mascot'` | `Syntax Error` | 🔴 靜態拒絕 |

---

## 4. 效能與最佳實踐

雖然型別元編程極具威力，但在大型專案中過度使用深度遞迴型別可能導致 `tsserver` 回應遲緩或編輯器記憶體溢出。

- **避免深層笛卡爾積**：避免在未受限的聯合型別（Unions）上進行分配條件型別操作。
- **使用標記快取（Brand Cache）**：對中間解析結果進行別名封裝以利用編譯器內部快取。
- **保持型別邊界清晰**：型別元編程應聚焦於高價值的 API 界面防護，內部實作則保持簡潔。

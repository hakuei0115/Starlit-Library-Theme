---
title: "自主 Agent 協同架構：狀態機拓撲與非同步訊息匯流排設計"
description: "解構多 Agent 協同系統中的長任務調度、容錯重試機制與基於訊息板的分散式狀態同步。"
pubDate: 2026-11-19T16:00:00.000Z
category: "AI & Systems"
tags: ["Multi-Agent", "State Machine", "Workflow", "Distributed Systems"]
featured: false
draft: false
---

隨著單一 LLM 處理上下文能力與推理能力的躍升，軟體工程正從「Prompt Engineering」典範移轉至「**多 Agent 協同工程（Multi-Agent Orchestration）**」。

然而，缺乏結構約束的多 Agent 溝通往往會陷入死迴圈、上下文過載（Context Blowup）以及任務漂移（Task Drift）。為了解決這些問題，我們必須為 Agent 系統引入分散式系統中成熟的**確定性狀態機（Finite State Machine）**與**公用訊息板（Message Board / Event Bus）**架構。

> 「自主性來自約束：唯有定義嚴格的狀態轉移邊界，Agent 才能在邊界內大膽探索。」
> —— *多 Agent 系統架構模式*

---

## 1. 集中協調器（Coordinator）與專業工作節點（Workers）

在經典的 Swarm 拓撲中，職責劃分如下：

- **Coordinator**：負責解析使用者高階意圖、劃分互斥工作邊界（Exclusive File Ownership）、指派任務並裁決衝突。
- **Specialized Workers**：各司其職（如 Core UI、Content Architecture、Pages Integration），彼此不重疊寫入相同檔案。
- **Independent Verifier**：在所有工作節點宣告完成後，進行自動化建置測試、無障礙驗證與端對端審查。

---

## 2. 狀態機拓撲與轉移圖

整個協同工作流程可以形式化定義為六個核心狀態：

```text
[INIT] ──▶ [PLANNING] ──▶ [DISPATCHED]
                               │
            ┌──────────────────┴──────────────────┐
            ▼                                     ▼
     [WORKER: IN_PROGRESS]                 [WORKER: WAITING]
            │                                     │
            └──────────────────┬──────────────────┘
                               ▼
                       [VERIFICATION]
                               │
               ┌───────────────┴───────────────┐
               ▼                               ▼
       [PASSED: DONE]                  [FAILED: RETRY]
```

### 2.1 數學終止性證明（Termination Condition）

假設任務集包含 $N$ 個互斥單元，每個單元的修復成功機率為 $p > 0$。給定最大嘗試次數 $M$，所有單元都在 $M$ 次內修復成功的機率（假設各單元彼此獨立）滿足：

$$
P(\text{AllPassed}) = \prod_{i=1}^{N} \left(1 - (1 - p_i)^M\right) \xrightarrow{M \to \infty} 1
$$

---

## 3. 非同步訊息板架構（Shared Message Board）

為了避免點對點 RPC 造成的網狀依賴，所有 Agent 共享一個單向追加（Append-Only）的訊息板。

```typescript
interface SwarmMessage {
  seq: number;
  from: string;
  to?: string | '@all';
  text: string;
  timestamp: string;
  kind?: 'brief' | 'progress' | 'handoff' | 'done';
}

class MessageBoard {
  private messages: SwarmMessage[] = [];
  private listeners: Set<(msg: SwarmMessage) => void> = new Set();

  public post(from: string, text: string, to?: string): SwarmMessage {
    const msg: SwarmMessage = {
      seq: this.messages.length + 1,
      from,
      to,
      text,
      timestamp: new Date().toISOString(),
    };
    this.messages.push(msg);
    this.listeners.forEach((fn) => fn(msg));
    return msg;
  }

  public readSince(seq: number): SwarmMessage[] {
    return this.messages.filter((m) => m.seq > seq);
  }
}
```

### 3.1 核心溝通準則

1. **醒來（Wakeup）機制精確化**：使用 `@name` 明確喚醒接手的同儕，避免廣播造成所有待命 Agent 不必要的 token 消耗。
2. **傳遞產出而非僅狀態**：貼文應包含具體的檔案清單、介面規範或錯誤日誌，而非單純回報「done」。
3. **無狀態轉移保證**：Worker 完成交付物後即進入休眠狀態，等待下一次排程喚醒。

---

## 4. 總結

將確定性狀態機的嚴謹性與現代 LLM 的靈活推論能力相結合，正是實現可靠自主軟體工程的最佳路徑。

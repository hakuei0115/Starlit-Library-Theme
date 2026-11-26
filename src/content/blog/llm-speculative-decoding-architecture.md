---
title: "深入剖析大語言模型投機解碼（Speculative Decoding）架構與加速實踐"
description: "探索 Draft Model 與 Target Model 的協同架構，從驗證機制、樹狀採樣到記憶體頻寬瓶頸的完整系統解析。"
pubDate: 2026-11-16T14:30:00.000Z
category: "AI & Systems"
tags: ["LLM", "Inference", "Speculative Decoding", "AI Architecture"]
featured: true
draft: false
---

在當代大型語言模型（LLM）的推論部署中，**自回歸解碼（Autoregressive Decoding）** 是制約吞吐量與延遲的核心瓶頸。每次產生單一 Token 均需將數十億甚至千億參數的權重從高頻寬記憶體（HBM）搬移至運算單元（SRAM/ALU），導致推論過程受限於記憶體頻寬（Memory-Bound）而非計算算力（Compute-Bound）。

**投機解碼（Speculative Decoding）** 透過引入輕量級草稿模型（Draft Model）與強大的目標模型（Target Model）協同運作，打破了逐字解碼的序列限制。

> 「以小博大：讓草稿模型大膽猜測，由目標模型一次批次並行驗證。」
> —— *高吞吐量 LLM 系統設計法則*

---

## 1. 核心瓶頸：Arithmetic Intensity 與記憶體頻寬

自回歸推論在批次大小（Batch Size）較小時，其運算強度（Arithmetic Intensity, FLOPs/Byte）極低：

$$
\text{Intensity} \approx \frac{2 \times P \times \text{tokens}}{2 \times P \times \text{bytes/param}} \approx 1 \text{ FLOP/Byte}
$$

對於 A100 GPU（運算力 312 TFLOPS，記憶體頻寬 2.0 TB/s），需要達到約 156 FLOP/Byte 才能飽和運算核心。投機解碼的核心思想是在一次記憶體權重讀取中，並行驗證多個候選 Token，大幅提升計算強度。

---

## 2. 演算法運作機制：Draft 與 Target 協同

投機解碼的完整演算法步驟如下：

1. **草稿生成階段**：小模型（例如 1B 參數）以標準自回歸方式快速產生 $K$ 個候選 Token：
   $$
   \hat{x}_{1}, \hat{x}_{2}, \dots, \hat{x}_{K} \sim M_{\text{draft}}
   $$
2. **並行驗證階段**：目標模型（例如 70B 參數）僅需單次 Forward Pass，即可同時取得這 $K$ 個 Token 的真實機率分佈：
   $$
   P(x_i \mid x_{<i})
   $$
3. **接受-拒絕採樣（Acceptance Rejection Sampling）**：
   依據機率比率決定是否接受該 Token：
   $$
   \alpha_i = \min\left(1, \frac{P(x_i)}{Q(x_i)}\right)
   $$

```python
import torch

def speculative_step(draft_model, target_model, prefix, gamma=4):
    """
    執行單步投機解碼驗證迴圈
    gamma: 草稿步數 (Lookahead steps)
    """
    # 1. Draft 階段生成 gamma 個 token
    draft_tokens = []
    curr = prefix
    for _ in range(gamma):
        logits = draft_model(curr)[:, -1, :]
        next_token = torch.argmax(logits, dim=-1, keepdim=True)
        draft_tokens.append(next_token)
        curr = torch.cat([curr, next_token], dim=-1)
    
    candidates = torch.cat(draft_tokens, dim=-1)
    
    # 2. Target 階段批次評估所有 candidates
    eval_input = torch.cat([prefix, candidates], dim=-1)
    target_logits = target_model(eval_input)[:, -gamma-1:-1, :]
    target_preds = torch.argmax(target_logits, dim=-1)
    
    # 3. 貪婪驗證比對
    accepted = []
    for i in range(gamma):
        if candidates[:, i] == target_preds[:, i]:
            accepted.append(candidates[:, i])
        else:
            # 拒絕並以 Target 分佈採樣修正 Token
            accepted.append(target_preds[:, i])
            break
            
    return torch.cat(accepted, dim=-1)
```

---

## 3. 效能評測與加速比分析

下表以**示意數字**（非實測結果）說明不同草稿長度 $K$ 與加速比的關係，實際表現取決於硬體、模型與工作負載：

| 草稿模型 / 目標模型 | 步數 $K$ | 驗證接受率 $\bar{\alpha}$ | 吞吐量 (tokens/s) | 實際加速比 |
|---|---|---|---|---|
| 8B（標準自回歸） | — | — | 34.2 | 1.00×（8B 基準） |
| 1B + 8B | 3 | 78.4% | 68.9 | 2.01× |
| 1B + 8B | 5 | 71.2% | 82.5 | 2.41× |
| 70B（標準自回歸） | — | — | 18.6 | 1.00×（70B 基準） |
| 草稿頭 + 70B | 4 | 82.1% | 51.4 | 2.76× |

### 3.1 關鍵權衡點

- **草稿模型的大小選擇**：草稿模型延遲應小於目標模型延遲的 $1/(K+1)$，否則草稿生成本身的開銷將侵蝕加速紅利。
- **KV Cache 複用機制**：驗證失敗時，需精確截斷（Rollback）目標模型與草稿模型的 KV Cache 指針。

---

## 4. 結語與未來展望

投機解碼不僅是軟體演算法的勝利，更是系統層次對硬體物理極限（記憶體頻寬 vs 計算單元）的深刻回應。隨著 Medusa、Eagle 等多頭投機預測架構的成熟，現代推論引擎已能將延遲降低至原本的三分之一，為即時對話與自主 Agent 系統奠定了堅實基礎。

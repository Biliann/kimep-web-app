# Model selection (npm run probe:models)

Measured on 18 November 2026 with the real grounded system prompt (about 8k tokens of handbook) and two questions: Russian (Finance minimum and price per credit, expected "50" and "163 230") and Kazakh (Law minimum, expected "75"). Streaming, tools enabled. "First token" is the time to the first answer character.

| Model | Lang | Status | First token | Total | Facts | Verdict |
|---|---|---|---|---|---|---|
| moonshotai/kimi-k3.1-pro | ru, kk | timeout | none within 60 s | n/a | 0/2, 0/1 | unusable (earlier plain requests took 100–150 s to first token) |
| nvidia/nemotron-3.5-lightning-30b-a3b | ru | ok | 0.4 s | 0.9 s | 2/2 | fast, correct Russian |
| | kk | ok | 0.4 s | 2.3 s | 1/1 | Kazakh text is garbled; last-resort fallback only |
| **google/gemma-4-31b-it** | ru | ok | 2.1 s | 4.5 s | 2/2 | **primary** |
| | kk | ok | 2.4 s | 7.1 s | 1/1 | natural Kazakh, correct facts |
| mistralai/mistral-large-4-1t-a52b | ru | ok | 3.5 s | 16.0 s | 2/2 | good quality, variable speed: first fallback |
| | kk | ok | 21.9 s | 26.5 s | 1/1 | correct but slow, a Latin letter slipped into a Kazakh word |
| nvidia/nemotron-3-ultra-550b-a55b | ru | ok | 0.9 s | 3.4 s | 2/2 | |
| | kk | empty | none | 1.6 s | 0/1 | returned no text |
| nvidia/nemotron-3.5-super-vl-120b-a12b | ru | ok | 0.8 s | 1.5 s | 2/2 | |
| | kk | ok | 0.8 s | 4.6 s | 0/1 | **wrong fact**: said 50 instead of 75 for Law |
| z-ai/glm-5.3-flash | ru, kk | timeout | none within 60 s | n/a | 0/3 | unusable |
| minimaxai/minimax-m3.1-flash | ru, kk | timeout | none within 60 s | n/a | 0/3 | unusable |
| deepseek-ai/deepseek-v4.1-flash | n/a | HTTP 410 | n/a | n/a | n/a | retired on 2026-11-16 |

Only `moonshotai/kimi-k3.1-pro` is visible among the Moonshot models for this key (no K2.x, no K3). The chain is `google/gemma-4-31b-it` → `mistralai/mistral-large-4-1t-a52b` → `nvidia/nemotron-3.5-lightning-30b-a3b`, configured with `NIM_MODEL` and `NIM_FALLBACK_MODELS`. Gemma needs no reasoning switch; for reasoning models the client sends `enable_thinking: false` or `reasoning_effort: low` and never forwards `reasoning_content`.

// Minimal NVIDIA NIM (OpenAI-compatible) streaming client. Runs only on the server.
export const NIM_URL = "https://integrate.api.nvidia.com/v1/chat/completions";

export type NimErrorKind = "auth" | "rate" | "server" | "timeout" | "network" | "bad_request" | "not_found";
export class NimError extends Error {
  kind: NimErrorKind;
  status: number;
  constructor(kind: NimErrorKind, status = 0, detail = "") {
    super(`${kind} ${status} ${detail}`.trim());
    this.kind = kind;
    this.status = status;
  }
}
export type ToolCall = { id: string; name: string; arguments: string };
export type NimEvent = { type: "text"; text: string } | { type: "tools"; calls: ToolCall[] } | { type: "done" };
export type Msg = Record<string, unknown>;

/** Per-model request extras. Reasoning is switched off where the model supports it: for short grounded answers it only adds latency. */
export function modelExtras(model: string): Record<string, unknown> {
  if (/nemotron/i.test(model)) return { chat_template_kwargs: { enable_thinking: false } };
  if (/kimi-k3/i.test(model)) return { reasoning_effort: "low" };
  if (/kimi-k2\.5|kimi-k2\.6/i.test(model)) return { chat_template_kwargs: { thinking: false } };
  return {};
}

export type StreamOptions = {
  apiKey: string;
  model: string;
  messages: Msg[];
  tools?: readonly unknown[];
  /** Abort if no byte at all arrives in this time. */
  firstByteMs: number;
  /** Abort if no answer text (or tool call) arrives in this time. */
  firstContentMs: number;
  /** Abort if the stream goes silent for this long once the answer has started. */
  idleMs?: number;
  /** Hard cap for the whole call. */
  totalMs: number;
  maxTokens?: number;
  temperature?: number;
  signal?: AbortSignal;
};

export async function* streamCompletion(o: StreamOptions): AsyncGenerator<NimEvent> {
  const ctrl = new AbortController();
  let reason: "timeout" | "client" | null = null;
  const abort = (r: "timeout" | "client") => { reason = r; ctrl.abort(); };
  const onClientAbort = () => abort("client");
  o.signal?.addEventListener("abort", onClientAbort);
  const total = setTimeout(() => abort("timeout"), o.totalMs);
  let phase = setTimeout(() => abort("timeout"), o.firstByteMs);
  const reset = (ms: number) => { clearTimeout(phase); phase = setTimeout(() => abort("timeout"), ms); };
  try {
    let res: Response;
    try {
      res = await fetch(NIM_URL, {
        method: "POST",
        signal: ctrl.signal,
        headers: { Authorization: `Bearer ${o.apiKey}`, "Content-Type": "application/json", Accept: "text/event-stream" },
        body: JSON.stringify({
          model: o.model,
          messages: o.messages,
          stream: true,
          temperature: o.temperature ?? 0.25,
          max_tokens: o.maxTokens ?? 1400,
          ...(o.tools?.length ? { tools: o.tools, tool_choice: "auto" } : {}),
          ...modelExtras(o.model),
        }),
      });
    } catch {
      throw new NimError(reason === "timeout" ? "timeout" : "network");
    }
    if (!res.ok || !res.body) {
      const detail = (await res.text().catch(() => "")).slice(0, 300);
      const s = res.status;
      throw new NimError(s === 401 || s === 403 ? "auth" : s === 404 || s === 410 ? "not_found" : s === 429 ? "rate" : s >= 500 ? "server" : "bad_request", s, detail);
    }
    reset(o.firstContentMs);
    const reader = res.body.getReader();
    const dec = new TextDecoder();
    let buf = "";
    let gotContent = false;
    const calls = new Map<number, ToolCall>();
    let inThink = false;
    let pending = "";
    const clean = (chunk: string) => {
      // Drop inline <think>…</think> blocks some models emit; reasoning is never sent to the client.
      pending += chunk;
      let out = "";
      for (;;) {
        if (inThink) {
          const end = pending.indexOf("</think>");
          if (end < 0) { pending = pending.slice(-8); return out; }
          pending = pending.slice(end + 8).replace(/^\s+/, "");
          inThink = false;
        } else {
          const start = pending.indexOf("<think>");
          if (start >= 0) { out += pending.slice(0, start); pending = pending.slice(start + 7); inThink = true; continue; }
          const keep = /<t?h?i?n?k?$/.exec(pending);
          const cut = keep ? pending.length - keep[0].length : pending.length;
          out += pending.slice(0, cut);
          pending = pending.slice(cut);
          return out;
        }
      }
    };
    try {
      for (;;) {
        let chunk: ReadableStreamReadResult<Uint8Array>;
        try { chunk = await reader.read(); } catch { throw new NimError(reason === "timeout" ? "timeout" : "network"); }
        if (chunk.done) break;
        if (gotContent) reset(o.idleMs ?? 10_000);
        buf += dec.decode(chunk.value, { stream: true });
        let nl: number;
        while ((nl = buf.indexOf("\n")) >= 0) {
          const line = buf.slice(0, nl).trim();
          buf = buf.slice(nl + 1);
          if (!line.startsWith("data:")) continue;
          const payload = line.slice(5).trim();
          if (payload === "[DONE]") continue;
          let j: any;
          try { j = JSON.parse(payload); } catch { continue; }
          const d = j.choices?.[0]?.delta;
          if (!d) continue;
          // d.reasoning_content / d.reasoning are intentionally ignored.
          if (Array.isArray(d.tool_calls)) {
            for (const tc of d.tool_calls) {
              const cur = calls.get(tc.index ?? 0) ?? { id: "", name: "", arguments: "" };
              if (tc.id) cur.id = tc.id;
              if (tc.function?.name) cur.name += tc.function.name;
              if (tc.function?.arguments) cur.arguments += tc.function.arguments;
              calls.set(tc.index ?? 0, cur);
            }
            if (!gotContent) { gotContent = true; reset(o.idleMs ?? 10_000); }
          }
          if (typeof d.content === "string" && d.content) {
            const text = clean(d.content);
            if (text) {
              if (!gotContent) { gotContent = true; reset(o.idleMs ?? 10_000); }
              yield { type: "text", text };
            }
          }
        }
      }
    } finally {
      try { await reader.cancel(); } catch { /* ignore */ }
    }
    const tail = pending && !inThink ? pending : "";
    if (tail) yield { type: "text", text: tail };
    if (calls.size) yield { type: "tools", calls: [...calls.values()].map((c, i) => ({ ...c, id: c.id || `call_${i}` })) };
    yield { type: "done" };
  } finally {
    clearTimeout(total);
    clearTimeout(phase);
    o.signal?.removeEventListener("abort", onClientAbort);
  }
}

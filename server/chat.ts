import type { IncomingMessage, ServerResponse } from "node:http";
import { buildSystemPrompt, type Lang } from "./systemPrompt.ts";
import { toolDefinitions, runTool } from "./tools.ts";
import { streamCompletion, NimError, type Msg } from "./nim.ts";
import { programs, isProgramId } from "../src/programs.ts";

type Env = Record<string, string | undefined>;
const env = (): Env => process.env;

// ---- validation -----------------------------------------------------------
const LANGS = ["en", "ru", "kk"] as const;
export function validate(body: unknown): { ok: true; messages: { role: "user" | "assistant"; content: string }[]; language: Lang; programId: string } | { ok: false; error: string } {
  if (!body || typeof body !== "object") return { ok: false, error: "bad_request" };
  const b = body as Record<string, unknown>;
  if (!Array.isArray(b.messages) || b.messages.length === 0) return { ok: false, error: "bad_request" };
  const msgs: { role: "user" | "assistant"; content: string }[] = [];
  for (const m of b.messages.slice(-12)) {
    if (!m || typeof m !== "object") return { ok: false, error: "bad_request" };
    const { role, content } = m as Record<string, unknown>;
    if ((role !== "user" && role !== "assistant") || typeof content !== "string") return { ok: false, error: "bad_request" };
    if (content.length > 1000) return { ok: false, error: "too_long" };
    msgs.push({ role, content });
  }
  while (msgs.length && msgs[0].role !== "user") msgs.shift();
  if (!msgs.length || msgs[msgs.length - 1].role !== "user" || !msgs[msgs.length - 1].content.trim()) return { ok: false, error: "bad_request" };
  const language = (LANGS as readonly string[]).includes(String(b.language)) ? (b.language as Lang) : "en";
  const programId = typeof b.programId === "string" && isProgramId(b.programId) ? b.programId : "bis";
  return { ok: true, messages: msgs, language, programId };
}

// ---- rate limit (in memory) -----------------------------------------------
// TODO: for real traffic use a shared store (Upstash Redis / Vercel KV); serverless instances do not share memory.
const hits = new Map<string, number[]>();
export function rateLimited(ip: string, now = Date.now(), limit = Number(env().CHAT_RATE_LIMIT ?? 20), windowMs = 10 * 60_000): boolean {
  const list = (hits.get(ip) ?? []).filter((t) => now - t < windowMs);
  if (list.length >= limit) { hits.set(ip, list); return true; }
  list.push(now);
  hits.set(ip, list);
  if (hits.size > 5000) for (const [k, v] of hits) if (!v.some((t) => now - t < windowMs)) hits.delete(k);
  return false;
}

// ---- origin check ---------------------------------------------------------
export function originAllowed(req: IncomingMessage): boolean {
  const e = env();
  const host = String(req.headers["x-forwarded-host"] ?? req.headers.host ?? "");
  const origin = String(req.headers.origin ?? "");
  const referer = String(req.headers.referer ?? "");
  const allowed = new Set((e.ALLOWED_ORIGINS ?? "").split(",").map((s) => s.trim()).filter(Boolean));
  const check = (u: string) => {
    try { const x = new URL(u); return x.host === host || allowed.has(x.origin) || allowed.has(x.host); } catch { return false; }
  };
  if (origin) return check(origin);
  if (referer) return check(referer);
  return !e.VERCEL && e.NODE_ENV !== "production"; // no Origin: only tolerated in local development
}

function clientIp(req: IncomingMessage): string {
  const f = String(req.headers["x-forwarded-for"] ?? "").split(",")[0].trim();
  return f || req.socket?.remoteAddress || "unknown";
}

async function readJson(req: IncomingMessage & { body?: unknown }): Promise<unknown> {
  if (req.body !== undefined) return typeof req.body === "string" ? JSON.parse(req.body) : req.body;
  const chunks: Buffer[] = [];
  let size = 0;
  for await (const c of req) {
    size += (c as Buffer).length;
    if (size > 64_000) throw new Error("too_large");
    chunks.push(c as Buffer);
  }
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}

function json(res: ServerResponse, status: number, body: unknown) {
  if (res.headersSent) return;
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" });
  res.end(JSON.stringify(body));
}

const errorStatus: Record<string, number> = { bad_request: 400, too_long: 413, origin: 403, rate: 429, no_key: 503, unavailable: 503, timeout: 504 };

// ---- core -----------------------------------------------------------------
/** Sent as the control character U+001E: the client discards everything received so far (a model stalled mid-answer and the next one starts over). */
export const RESET = "\u001e";
export function modelChain(): string[] {
  const e = env();
  return [...(e.NIM_MODEL ?? "").split(","), ...(e.NIM_FALLBACK_MODELS ?? "").split(",")].map((s) => s.trim()).filter(Boolean);
}

/**
 * Streams an answer as plain text. Tries each model in NIM_MODEL / NIM_FALLBACK_MODELS in turn
 * as long as nothing has been sent to the client yet. Throws a short code on failure.
 */
export async function* answer(opts: { messages: { role: "user" | "assistant"; content: string }[]; language: Lang; programId: string; signal?: AbortSignal; now?: Date }): AsyncGenerator<string> {
  const e = env();
  const apiKey = e.NVIDIA_API_KEY;
  const models = modelChain();
  if (!apiKey || !models.length) throw new Error("no_key");
  const system = buildSystemPrompt({ language: opts.language, programId: opts.programId, programName: programs[opts.programId].name, today: opts.now ?? new Date() });
  const firstByteMs = Number(e.NIM_FIRST_BYTE_MS ?? 15_000);
  const firstContentMs = Number(e.NIM_FIRST_TOKEN_MS ?? 30_000);
  const totalMs = Number(e.NIM_TOTAL_MS ?? 55_000);
  const idleMs = Number(e.NIM_IDLE_MS ?? 10_000);
  const chainBudgetMs = Number(e.NIM_CHAIN_MS ?? 50_000);
  const startedAt = Date.now();
  let lastError = "unavailable";
  for (const model of models) {
    if (Date.now() - startedAt > chainBudgetMs) break; // stop trying further models, let the client fall back
    let useTools = true;
    let sent = false;
    const convo: Msg[] = [{ role: "system", content: system }, ...opts.messages];
    try {
      for (let round = 0; round < 4; round++) {
        let toolCalls: { id: string; name: string; arguments: string }[] = [];
        let roundText = "";
        try {
          for await (const ev of streamCompletion({ apiKey, model, messages: convo, tools: useTools ? toolDefinitions : undefined, firstByteMs, firstContentMs, idleMs, totalMs, signal: opts.signal })) {
            if (ev.type === "text") { roundText += ev.text; sent = true; yield ev.text; }
            else if (ev.type === "tools") toolCalls = ev.calls;
          }
        } catch (err) {
          // some models reject the tools parameter: retry this model once without it
          if (err instanceof NimError && err.kind === "bad_request" && useTools && !sent) { useTools = false; round--; continue; }
          throw err;
        }
        if (!toolCalls.length) {
          if (!sent) throw new NimError("server", 0, "empty answer");
          return;
        }
        convo.push({ role: "assistant", content: roundText || null, tool_calls: toolCalls.map((c) => ({ id: c.id, type: "function", function: { name: c.name, arguments: c.arguments } })) });
        for (const c of toolCalls) {
          let result: unknown;
          try { result = runTool(c.name, JSON.parse(c.arguments || "{}")); } catch { result = { error: "Invalid tool arguments" }; }
          convo.push({ role: "tool", tool_call_id: c.id, content: JSON.stringify(result) });
        }
      }
      return; // tool rounds exhausted after producing text
    } catch (err) {
      if (opts.signal?.aborted) return;
      lastError = err instanceof NimError ? err.kind : "unavailable";
      console.error(`[chat] model ${model} failed: ${err instanceof Error ? err.message : err}`);
      if (err instanceof NimError && err.kind === "auth") throw new Error("unavailable");
      if (sent) { yield RESET; sent = false; } // partial answer already sent: tell the client to drop it, then try the next model
    }
  }
  throw new Error(lastError === "rate" ? "rate" : lastError === "timeout" ? "timeout" : "unavailable");
}

export default async function handler(req: IncomingMessage & { body?: unknown }, res: ServerResponse) {
  if (req.method === "OPTIONS") { res.writeHead(204, { Allow: "POST, OPTIONS" }); res.end(); return; }
  if (req.method !== "POST") { res.setHeader("Allow", "POST, OPTIONS"); return json(res, 405, { error: "method" }); }
  if (!originAllowed(req)) return json(res, 403, { error: "origin" });
  if (rateLimited(clientIp(req))) return json(res, 429, { error: "rate" });
  let body: unknown;
  try { body = await readJson(req); } catch { return json(res, 400, { error: "bad_request" }); }
  const v = validate(body);
  if (!v.ok) return json(res, errorStatus[v.error] ?? 400, { error: v.error });

  const ctrl = new AbortController();
  res.on("close", () => { if (!res.writableEnded) ctrl.abort(); });
  try {
    for await (const text of answer({ messages: v.messages, language: v.language, programId: v.programId, signal: ctrl.signal })) {
      if (!res.headersSent) {
        res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store, no-transform", "X-Accel-Buffering": "no" });
      }
      res.write(text);
    }
    if (!res.headersSent) return json(res, 503, { error: "unavailable" });
    res.end();
  } catch (err) {
    const code = err instanceof Error && err.message in errorStatus ? err.message : "unavailable";
    if (res.headersSent) { res.end(); return; }
    json(res, errorStatus[code] ?? 503, { error: code });
  }
}

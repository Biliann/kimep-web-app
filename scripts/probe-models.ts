// Picks the NIM model for the assistant. Sends the REAL grounded system prompt plus Russian and
// Kazakh questions to every Moonshot (Kimi) model your key can use, and to extra candidates.
// Usage: npm run probe:models   (key from .env.local as NVIDIA_API_KEY; never printed)
// Extra candidates: NIM_PROBE_MODELS="vendor/model,vendor/model"
import { loadEnvFile } from "./loadEnv.ts";
import { streamCompletion, NimError } from "../server/nim.ts";
import { buildSystemPrompt } from "../server/systemPrompt.ts";
import { toolDefinitions } from "../server/tools.ts";
loadEnvFile();
const key = process.env.NVIDIA_API_KEY;
if (!key) { console.error("NVIDIA_API_KEY is missing. Put it in .env.local (see .env.example)."); process.exit(1); }

const list = await fetch("https://integrate.api.nvidia.com/v1/models", { headers: { Authorization: `Bearer ${key}` } });
if (!list.ok) { console.error("GET /v1/models failed:", list.status); process.exit(1); }
const ids: string[] = ((await list.json()) as any).data.map((m: any) => m.id);
const kimi = ids.filter((i) => i.startsWith("moonshotai/"));
const extra = (process.env.NIM_PROBE_MODELS ?? "").split(",").map((s) => s.trim()).filter(Boolean);
const candidates = [...new Set([...kimi, ...extra])];
console.log(`Models visible to this key: ${ids.length}. Moonshot: ${kimi.join(", ") || "none"}.\nProbing: ${candidates.join(", ")}\n`);

const questions = [
  { lang: "ru", q: "Какой минимальный балл ЕНТ нужен для поступления на Finance и сколько стоит один кредит?", must: ["50", "163 230"] },
  { lang: "kk", q: "Құқықтану бағдарламасына түсу үшін ҰБТ-дан ең төмен қанша балл керек?", must: ["75"] },
];
const system = (lang: "ru" | "kk") => buildSystemPrompt({ language: lang, programId: "finance", programName: "Bachelor of Finance", today: new Date() });
const rows: string[][] = [];
for (const model of candidates) {
  for (const { lang, q, must } of questions) {
    const t0 = Date.now();
    let first = 0, firstContent = 0, text = "", status = "ok";
    try {
      for await (const ev of streamCompletion({ apiKey: key, model, messages: [{ role: "system", content: system(lang as "ru") }, { role: "user", content: q }], tools: toolDefinitions, firstByteMs: 60_000, firstContentMs: 90_000, totalMs: 120_000 })) {
        if (!first) first = Date.now() - t0;
        if (ev.type === "text") { if (!firstContent) firstContent = Date.now() - t0; text += ev.text; }
      }
      if (!text) status = "empty";
    } catch (e) { status = e instanceof NimError ? `${e.kind}${e.status ? " " + e.status : ""}` : "error"; }
    const total = Date.now() - t0;
    const facts = must.filter((m) => text.replace(/ /g, " ").includes(m)).length + "/" + must.length;
    rows.push([model, lang, status, firstContent ? (firstContent / 1000).toFixed(1) + "s" : "-", (total / 1000).toFixed(1) + "s", facts, text.replace(/\s+/g, " ").slice(0, 110)]);
    console.log(rows[rows.length - 1].join(" | "));
  }
}
console.log("\nmodel | lang | status | first token | total | facts | answer start");
console.log("Pick a model with status ok, first token under ~3 s, all facts present and natural Kazakh. Set NIM_MODEL (and NIM_FALLBACK_MODELS) accordingly.");

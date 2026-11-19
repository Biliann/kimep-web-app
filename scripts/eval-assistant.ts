// Runs every case in tests/assistant-eval/cases.json through the real /api/chat and prints a pass/fail table.
// Usage: npm run eval:assistant            (starts its own dev server on :5199)
//        BASE_URL=http://localhost:5173 npm run eval:assistant     (use a running server; mind its rate limit)
//        npm run eval:assistant -- --only=ru-   (filter by id prefix)    --report  (write REPORT.md)
import { spawn, type ChildProcess } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { loadEnvFile } from "./loadEnv.ts";
loadEnvFile();

type Case = { id: string; lang: "ru" | "kk" | "en"; kind: string; programId: string; question: string; mustInclude: string[]; mustNotInclude: string[]; mustMatch: string[]; mustNotMatch: string[]; expectSource: string[]; maxChars?: number };
const cases: Case[] = JSON.parse(readFileSync("tests/assistant-eval/cases.json", "utf8"));
const only = process.argv.find((a) => a.startsWith("--only="))?.slice(7);
const selected = cases.filter((c) => !only || c.id.startsWith(only));

let server: ChildProcess | null = null;
let base = process.env.BASE_URL ?? "";
async function up(url: string) { try { const r = await fetch(url, { method: "OPTIONS" }); return r.status < 500; } catch { return false; } }
if (!base) {
  base = "http://localhost:5199";
  server = spawn("npx", ["vite", "--port", "5199", "--strictPort"], { env: { ...process.env, CHAT_RATE_LIMIT: "100000" }, stdio: "ignore" });
  for (let i = 0; i < 60 && !(await up(base + "/api/chat")); i++) await new Promise((r) => setTimeout(r, 500));
}
const stop = () => { server?.kill(); };
process.on("exit", stop);

const norm = (s: string) => s.replace(/ /g, " ").replace(/(?<=\d)[ ,](?=\d{3}(?!\d))/g, "");
const tagRe = /\[(source|page):\s*[a-zA-Z]+(?:\s*,\s*(?:(?:source|page):)?\s*[a-zA-Z]+)*\s*\]/g;
const stripTags = (s: string) => s.replace(tagRe, "").trim();
const sourcesIn = (s: string) => [...s.matchAll(tagRe)].filter((m) => m[1] === "source").flatMap((m) => m[0].replace(/[\[\]]/g, "").split(",").map((x) => x.replace(/^\s*(source|page):/, "").trim()));
function detect(text: string) {
  const t = stripTags(text).replace(/https?:\S+|\S+@\S+/g, "");
  const kz = (t.match(/[әғқңөұүһіӘҒҚҢӨҰҮҺІ]/g) ?? []).length;
  const cyr = (t.match(/[а-яёА-ЯЁәғқңөұүһіӘҒҚҢӨҰҮҺІ]/g) ?? []).length;
  const lat = (t.match(/[a-zA-Z]/g) ?? []).length;
  return { kz, cyr, lat };
}
function langOk(lang: Case["lang"], text: string): string | null {
  const { kz, cyr, lat } = detect(text);
  if (lang === "en") return lat >= 10 && cyr <= 3 ? null : "answer not in English";
  if (cyr < lat * 0.6) return `answer not in ${lang === "ru" ? "Russian" : "Kazakh"}`;
  if (lang === "kk") return kz >= 3 ? null : "answer not in Kazakh";
  return kz > 3 ? "answered in Kazakh instead of Russian" : null;
}
const leaks = ["KNOWLEDGE BASE", "HOW TO ANSWER", "TODAY'S DATE", "SOURCE INDEX", "<think>", "reasoning_content", "NVIDIA_API_KEY", "nv" + "api-"];

async function ask(c: Case): Promise<{ text: string; status: number; ms: number }> {
  const t0 = Date.now();
  for (let attempt = 0; attempt < 2; attempt++) {
    const res = await fetch(base + "/api/chat", { method: "POST", headers: { "Content-Type": "application/json", Origin: new URL(base).origin }, body: JSON.stringify({ messages: [{ role: "user", content: c.question }], language: c.lang, programId: c.programId }) });
    let text = await res.text();
    const cut = text.lastIndexOf("\u001e"); // server restarted the answer with another model
    if (cut >= 0) text = text.slice(cut + 1);
    if (res.status === 200 && text.trim()) return { text, status: 200, ms: Date.now() - t0 };
    if (attempt === 1) return { text, status: res.status, ms: Date.now() - t0 };
  }
  throw new Error("unreachable");
}
function grade(c: Case, text: string): string[] {
  const fails: string[] = [];
  const n = norm(text).toLowerCase();
  for (const item of c.mustInclude) if (!item.split("|").some((alt) => n.includes(norm(alt).toLowerCase()))) fails.push(`missing "${item}"`);
  for (const bad of c.mustNotInclude) if (n.includes(norm(bad).toLowerCase())) fails.push(`contains "${bad}"`);
  for (const re of c.mustMatch) if (!new RegExp(re, "i").test(norm(text))) fails.push(`no match /${re}/`);
  for (const re of c.mustNotMatch) if (new RegExp(re, "i").test(norm(text))) fails.push(`forbidden /${re}/`);
  if (c.expectSource.length && !c.expectSource.some((s) => sourcesIn(text).includes(s))) fails.push(`no source tag (${c.expectSource.join("|")})`);
  if (c.maxChars && stripTags(text).length > c.maxChars) fails.push(`too long (${stripTags(text).length} > ${c.maxChars})`);
  const l = langOk(c.lang, text); if (l) fails.push(l);
  for (const k of leaks) if (text.includes(k)) fails.push(`leak "${k}"`);
  if (text.includes(String.fromCharCode(0x2014))) fails.push("contains a long dash");
  return fails;
}

const results: { id: string; kind: string; ok: boolean; ms: number; fails: string[]; answer: string }[] = [];
let next = 0;
async function worker() {
  while (next < selected.length) {
    const c = selected[next++];
    try {
      const r = await ask(c);
      const fails = r.status === 200 ? grade(c, r.text) : [`API ${r.status}: ${r.text.slice(0, 80)}`];
      results.push({ id: c.id, kind: c.kind, ok: fails.length === 0, ms: r.ms, fails, answer: r.text });
    } catch (e) { results.push({ id: c.id, kind: c.kind, ok: false, ms: 0, fails: ["error " + String(e)], answer: "" }); }
    const r = results[results.length - 1];
    console.log(`${r.ok ? "PASS" : "FAIL"}  ${r.id.padEnd(20)} ${(r.ms / 1000).toFixed(1).padStart(5)}s  ${r.fails.join("; ")}`);
  }
}
await Promise.all([worker(), worker(), worker()]);
stop();
results.sort((a, b) => a.id.localeCompare(b.id));
const pass = results.filter((r) => r.ok).length;
const by = (k: string) => { const rs = results.filter((r) => r.kind === k); return `${rs.filter((r) => r.ok).length}/${rs.length}`; };
console.log(`\n${pass}/${results.length} passed · facts ${by("fact")} · calculations ${by("tool")} · traps ${by("trap")} · model chain: ${process.env.NIM_MODEL}${process.env.NIM_FALLBACK_MODELS ? " → " + process.env.NIM_FALLBACK_MODELS : ""}`);
writeFileSync("tests/assistant-eval/last-run.json", JSON.stringify(results, null, 1));
if (process.argv.includes("--report")) {
  const lines = ["# Assistant evaluation report", "", `Run: ${new Date().toISOString()} · model chain: \`${process.env.NIM_MODEL}${process.env.NIM_FALLBACK_MODELS ? " → " + process.env.NIM_FALLBACK_MODELS : ""}\``, "", `**${pass}/${results.length} passed** · facts ${by("fact")} · calculations ${by("tool")} · traps ${by("trap")}`, "", "| Case | Result | Time | Why |", "|---|---|---|---|", ...results.map((r) => `| ${r.id} | ${r.ok ? "pass" : "FAIL"} | ${(r.ms / 1000).toFixed(1)}s | ${r.fails.join("; ").replace(/\|/g, "/")} |`)];
  const bad = results.filter((r) => !r.ok);
  if (bad.length) lines.push("", "## Failures", ...bad.map((r) => `### ${r.id}\n${r.fails.join("; ")}\n\n> ${r.answer.replace(/\n/g, "\n> ")}`));
  writeFileSync("tests/assistant-eval/REPORT.md", lines.join("\n") + "\n");
}
process.exit(pass === results.length ? 0 : 1);

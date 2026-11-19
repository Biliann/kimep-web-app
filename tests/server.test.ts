import test from "node:test";
import assert from "node:assert/strict";
import { validate, rateLimited, originAllowed, modelChain } from "../server/chat.ts";
import { runTool } from "../server/tools.ts";
import { buildKnowledge } from "../src/knowledge/buildKnowledge.ts";
import { buildSystemPrompt } from "../server/systemPrompt.ts";
import { programs, programIds } from "../src/programs.ts";

const msg = (role: string, content: string) => ({ role, content });

test("validation: roles, length, history size and language", () => {
  assert.equal(validate(null).ok, false);
  assert.equal(validate({ messages: [] }).ok, false);
  assert.equal(validate({ messages: [msg("system", "x")] }).ok, false);
  assert.equal(validate({ messages: [msg("user", "a".repeat(1001))] }).ok, false);
  assert.equal(validate({ messages: [msg("user", "a".repeat(1000))] }).ok, true);
  assert.equal(validate({ messages: [msg("assistant", "hi")] }).ok, false); // must end with a user message
  const long = Array.from({ length: 30 }, (_, i) => msg(i % 2 ? "assistant" : "user", "m" + i));
  long.push(msg("user", "last"));
  const v = validate({ messages: long, language: "kk", programId: "law" });
  assert.ok(v.ok);
  if (v.ok) {
    assert.ok(v.messages.length <= 12);
    assert.equal(v.messages[0].role, "user"); // never starts with an assistant turn
    assert.equal(v.messages.at(-1)!.content, "last");
    assert.equal(v.language, "kk");
    assert.equal(v.programId, "law");
  }
  const d = validate({ messages: [msg("user", "hi")], language: "fr", programId: "nope" });
  assert.ok(d.ok && d.language === "en" && d.programId === "bis");
});
test("rate limit: 20 requests per window per IP, then blocked, then released", () => {
  const t0 = 1_000_000;
  for (let i = 0; i < 20; i++) assert.equal(rateLimited("1.1.1.1", t0 + i, 20, 600_000), false);
  assert.equal(rateLimited("1.1.1.1", t0 + 100, 20, 600_000), true);
  assert.equal(rateLimited("2.2.2.2", t0 + 100, 20, 600_000), false);
  assert.equal(rateLimited("1.1.1.1", t0 + 700_000, 20, 600_000), false);
});
test("origin check accepts the own host only", () => {
  const req = (headers: Record<string, string>) => ({ headers }) as never;
  assert.equal(originAllowed(req({ host: "site.example", origin: "https://site.example" })), true);
  assert.equal(originAllowed(req({ host: "site.example", origin: "https://evil.example" })), false);
  assert.equal(originAllowed(req({ host: "site.example", referer: "https://site.example/#cost" })), true);
  assert.equal(originAllowed(req({ host: "site.example", referer: "https://evil.example/" })), false);
  process.env.VERCEL = "1";
  assert.equal(originAllowed(req({ host: "site.example" })), false); // no Origin in production
  delete process.env.VERCEL;
});
test("model chain comes from environment variables", () => {
  process.env.NIM_MODEL = "a/one";
  process.env.NIM_FALLBACK_MODELS = "b/two, c/three";
  assert.deepEqual(modelChain(), ["a/one", "b/two", "c/three"]);
});
test("knowledge base is built from data and covers every program and the key facts", () => {
  const k = buildKnowledge();
  for (const id of programIds) assert.ok(k.includes(programs[id].code), id);
  for (const fact of ["163 230", "4 896 900", "23 831 580", "9 130", "74 270", "108 050", "71 180", "682 320", "29 950", "15 August 2027", "uao@kimep.kz", "finaid@kimep.kz", "2104", "NOT IN THE HANDBOOK"]) assert.ok(k.includes(fact), fact);
  assert.ok(!k.includes("undefined") && !k.includes("NaN") && !k.includes("[object"));
});
test("system prompt carries today's date, the rules and the handbook, never a key", () => {
  const p = buildSystemPrompt({ language: "ru", programId: "bis", programName: "Bachelor of Information Systems", today: new Date("2026-11-18T10:00:00Z") });
  assert.match(p, /TODAY'S DATE: 2026-11-18/);
  assert.match(p, /ONLY from the KNOWLEDGE BASE/);
  assert.match(p, /\[source:fees\]/);
  assert.ok(!new RegExp("nv" + "api", "i").test(p));
});
test("tools: UNT check and tuition run deterministic code", () => {
  const ok = runTool("check_unt_scores", { program_id: "bis", reading_literacy: 4, math_literacy: 4, history_kz: 10, elective_subject: 20, profile_subject: 15 }) as any;
  assert.equal(ok.result, "success"); assert.equal(ok.total, 53);
  const low = runTool("check_unt_scores", { program_id: "finance", reading_literacy: 3, math_literacy: 3, history_kz: 8, elective_subject: 10, profile_subject: 10 }) as any;
  assert.equal(low.result, "warning"); assert.equal(low.points_short_of_total_minimum, 16);
  assert.ok((runTool("check_unt_scores", { program_id: "nope" }) as any).error);
  const t = runTool("calculate_tuition", { credits_per_semester: 15, semesters: 2 }) as any;
  assert.equal(t.first_academic_year.tuition_KZT, "4 896 900");
  const whole = runTool("calculate_tuition", { credits_per_semester: 18, whole_program: true }) as any;
  assert.equal(whole.whole_period.tuition_KZT, "23 831 580");
});

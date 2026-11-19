import test from "node:test";
import assert from "node:assert/strict";
import { parseHash } from "../src/router.ts";
import { translations } from "../src/translations.ts";
import { tokenizeInline, parseTags, toBlocks } from "../src/assistant/parse.ts";
import { localAnswer } from "../src/assistant/local.ts";

test("old hash links redirect into the five new sections", () => {
  const cases: [string, string, string][] = [
    ["#checker", "scores", "checker"], ["#requirements", "scores", "requirements"], ["#english", "scores", "english"],
    ["#documents", "docs", ""], ["#deadlines", "docs", "deadlines"], ["#apply", "docs", "steps"], ["#tuition", "cost", ""],
    ["#faq", "faq", ""], ["#contacts", "faq", "contacts"], ["#program", "home", ""], ["#overview", "home", ""],
    ["#scores/english", "scores", "english"], ["", "home", ""], ["#unknown", "home", ""], ["#constructor", "home", ""],
  ];
  for (const [hash, page, section] of cases) assert.deepEqual(parseHash(hash), { page, section }, hash);
});
test("translations: every entry has Russian and Kazakh text and keeps placeholders", () => {
  for (const [key, [ru, kk]] of Object.entries(translations)) {
    assert.ok(ru.trim() && kk.trim(), key);
    for (const ph of key.match(/\{\w+\}/g) ?? []) { assert.ok(ru.includes(ph), key + " ru"); assert.ok(kk.includes(ph), key + " kk"); }
  }
  assert.ok(Object.keys(translations).length > 250);
});
test("assistant tags: sources and pages are extracted, lists and half-typed tags handled", () => {
  const r = parseTags("Answer [source:fees, school] [source:aid] [page:cost]", false);
  assert.deepEqual(r.sources, ["fees", "school", "aid"]); assert.deepEqual(r.pages, ["cost"]); assert.equal(r.body, "Answer");
  assert.equal(parseTags("Typing [sour", true).body, "Typing");
});
test("markdown: model text only becomes plain tokens, unsafe links stay text", () => {
  const toks = tokenizeInline("**bold** <img src=x onerror=alert(1)> [ok](https://kimep.kz) [bad](javascript:alert(1))");
  assert.deepEqual(toks.filter((t) => t.type !== "text").map((t) => t.type), ["bold", "link"]);
  assert.ok(toks.some((t) => t.type === "text" && t.text.includes("<img src=x onerror=alert(1)>"))); // kept as text; React escapes it
  assert.ok(!toks.some((t) => t.type === "link" && t.href.startsWith("javascript")));
  const blocks = toBlocks("Intro:\n* one\n* two\n\n1. a\n2. b");
  assert.deepEqual(blocks.map((b) => b.kind), ["p", "ul", "ol"]);
});
test("offline fallback answers from the FAQ and gives up on unrelated questions", () => {
  const faq = [
    { q: "How much is tuition?", a: "KZT 163,230 per credit.", source: "fees" },
    { q: "Which medical documents do I need?", a: "Form 075/u and 065/u.", source: "medical" },
  ];
  assert.equal(localAnswer("how much does tuition cost per credit", faq)?.source, "fees");
  assert.equal(localAnswer("medical documents list", faq)?.source, "medical");
  assert.equal(localAnswer("weather tomorrow in paris", faq), null);
});

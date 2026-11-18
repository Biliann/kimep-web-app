// Lists user-visible English strings that have no Russian/Kazakh translation yet.
import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { translations } from "../src/translations.ts";
import * as data from "../src/data.ts";
import { programs } from "../src/programs.ts";

const norm = (s: string) => s.replace(/\s+/g, " ").trim();
const have = new Set(Object.keys(translations).map(norm));
const missing = new Set<string>();
const needed = new Set<string>();
const monthRe = /\b(January|February|March|April|May|June|July|August|September|October|November|December)\b/g;
const check = (s: string) => {
  const n = norm(s);
  needed.add(n);
  if (!n.replace(monthRe, "").replace(/[\d\s–-]/g, "")) return; // plain dates: month names are translated automatically
  if (n.length < 2 || !/\p{L}{2}/u.test(n) || have.has(n)) return;
  if (/^(https?:|mailto:|tel:|[\w.+-]+@[\w.-]+$|\+?[\d\s()-]+$|\d{4}-\d\d-\d\d$)/.test(n)) return;
  missing.add(n);
};
// 1) strings the UI actually shows from the data modules (assistant-only facts are written in English for the model)
const pick = (rows: Record<string, unknown>[], keys: string[]) => rows.forEach((r) => keys.forEach((k) => typeof r[k] === "string" && check(r[k] as string)));
pick(Object.values(data.sources), ["title", "published"]);
pick(data.englishLevels, ["name"]);
pick(data.englishRules.slice(0, 5), ["text"]);
pick(data.documents, ["stage", "title", "detail"]);
pick(data.steps, ["title", "detail"]);
pick(data.deadlines, ["intake", "category", "enrollment", "classes"]);
pick(data.contacts, ["name", "for"]);
pick(data.faq, ["q", "a"]);
check(data.scholarships2026.contact);
for (const p of Object.values(programs)) { check(p.name.replace(/^Bachelor of /, "")); if (p.note) check(p.note); p.subjects.forEach(check); p.sectionNames.forEach(check); }
// 2) literals passed to t() / tf() in the UI, plus the label tables
const files: string[] = [];
const scan = (d: string) => { for (const f of readdirSync(d)) { const p = d + "/" + f; if (statSync(p).isDirectory()) scan(p); else if (/\.tsx$/.test(f)) files.push(p); } };
scan("src");
for (const f of files) {
  const src = readFileSync(f, "utf8");
  for (const m of src.matchAll(/\bt[f]?\(\s*(?:"((?:[^"\\]|\\.)*)"|`([^`$]*)`)/g)) check((m[1] ?? m[2]).replace(/\\"/g, '"'));
  for (const m of src.matchAll(/(?:label|title|sub|note|summary):\s*"((?:[^"\\]|\\.)*)"/g)) check(m[1]);
}
for (const f of ["src/pages/Cost.tsx"]) for (const m of readFileSync(f, "utf8").matchAll(/^\s+(?:tuition|activity|medical|textbookDeposit|bed|dormDeposit|foundation): "([^"]+)"/gm)) check(m[1]);
for (const f of ["src/Assistant.tsx", "src/components/Shell.tsx"]) for (const m of readFileSync(f, "utf8").matchAll(/(?:home|scores|cost|docs|faq): "([^"]+)"/g)) check(m[1]);
if (process.argv.includes("--write")) {
  const keys = [...needed].filter((k) => have.has(k) && translations[k]).sort((a, b) => a.localeCompare(b));
  const body = keys.map((k) => `  ${JSON.stringify(k)}: ${JSON.stringify(translations[k])},`).join("\n");
  writeFileSync("src/translations.ts", `// Russian and Kazakh strings. Key = the English text shown on the site. Generated list: only strings the UI uses.\n// Check coverage with: node --experimental-strip-types scripts/missing-translations.ts\nexport const translations: Record<string, [string, string]> = {\n${body}\n};\n`);
  console.error(`wrote ${keys.length} entries`);
}
console.log([...missing].sort().map((s) => JSON.stringify(s)).join("\n"));
console.error(`\n${missing.size} missing`);

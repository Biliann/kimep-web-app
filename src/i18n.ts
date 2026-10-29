import { useSyncExternalStore } from "react";
import * as data from "./data";
import { programs, requirementsVerified } from "./programs";
import { useSelectedProgram } from "./programSelection";
import { translations } from "./translations";
export type Language = "en" | "ru" | "kk";
const normalize = (s: string) => s.replace(/\s+/g, " ").trim();
let language: Language = "en";
try {
  const saved = localStorage.getItem("kimep-language-v1");
  if (saved === "ru" || saved === "kk" || saved === "en") language = saved;
} catch {}
const listeners = new Set<() => void>();
export function getLanguage() {
  return language;
}
export function setLanguage(next: Language) {
  language = next;
  document.documentElement.lang = next;
  try {
    localStorage.setItem("kimep-language-v1", next);
  } catch {}
  listeners.forEach((fn) => fn());
}
const reverse = new Map<string, string>();
for (const [key, values] of Object.entries(translations))
  for (const value of values)
    if (value !== key) reverse.set(normalize(value), key);
export function t(value: string): string {
  const normalized = normalize(value);
  const key = translations[normalized]
    ? normalized
    : reverse.get(normalized) || normalized;
  if (language === "en") return key;
  const row = translations[key];
  if (row) return row[language === "ru" ? 0 : 1];
  let text = value;
  const terms: Record<string, [string, string]> = {
    January: ["января", "қаңтар"],
    February: ["февраля", "ақпан"],
    March: ["марта", "наурыз"],
    April: ["апреля", "сәуір"],
    May: ["мая", "мамыр"],
    June: ["июня", "маусым"],
    July: ["июля", "шілде"],
    August: ["августа", "тамыз"],
    September: ["сентября", "қыркүйек"],
    October: ["октября", "қазан"],
    November: ["ноября", "қараша"],
    December: ["декабря", "желтоқсан"],
    each: ["в каждом разделе", "әр бөлімде"],
  };
  for (const [a, b] of Object.entries(terms))
    text = text.replace(
      new RegExp("\\b" + a + "\\b", "g"),
      b[language === "ru" ? 0 : 1],
    );
  return text;
}
export function useLanguage() {
  return useSyncExternalStore(
    (fn) => {
      listeners.add(fn);
      return () => {
        listeners.delete(fn);
      };
    },
    () => language,
    () => "en" as Language,
  );
}
function translate<T>(value: T): T {
  if (typeof value === "string") return t(value) as T;
  if (Array.isArray(value)) return value.map(translate) as T;
  if (value && typeof value === "object")
    return Object.fromEntries(
      Object.entries(value).map(([key, v]) => [key, translate(v)]),
    ) as T;
  return value;
}
export function useContent() {
  useLanguage();
  const selected = useSelectedProgram();
  const program = translate(programs[selected]);
  const content = translate(data);
  const faq = content.faq.map(row => ({...row}));
  faq[0] = { ...faq[0], q: t("What UNT score do I need?") + " · " + program.name,
    a: `${t("Minimum overall")}: ${program.unt}/140. ${program.sectionNames.map((name, i) => name + ": " + program.sectionMinimums[i]).join("; ")}. ${t("Basic eligibility is not an admission or scholarship guarantee.")}`, source: "admission", lastVerified: t(requirementsVerified) };
  faq[1] = { ...faq[1], q: t("Which profile subjects should I take?"), a: program.subjects.join(" + ") + ". " + t("Standard high-school route. Other education routes need individual review."), source: "admission", lastVerified: t(requirementsVerified) };
  return { ...content, program, faq, sources: { ...content.sources,
    admission: { ...content.sources.admission, lastVerified: t(requirementsVerified) },
    school: { ...content.sources.school, lastVerified: t(requirementsVerified) },
    program: { ...content.sources.program, title: program.name + (selected === "management" ? " · 2025–2026" : ""), url: program.url, lastVerified: t(requirementsVerified) }
  }};
}
document.documentElement.lang = language;
export function translateCheckerDetail(value: string) {
  if (language === "en") return value;
  const total = value.match(/(?:Total: |Your total is )(\d+)\/140/);
  if (!total) return t(value);
  const n = total[1];
  if (value.startsWith("Your total is"))
    return language === "ru"
      ? `Ваш общий балл — ${n}/140, минимумы всех пяти разделов выполнены. Подготовьте документы и подтвердите уровень английского. Это не решение о зачислении.`
      : `Жалпы балыңыз — ${n}/140, бес бөлімнің минимумдары орындалды. Құжаттарды дайындап, ағылшын деңгейін растаңыз. Бұл қабылдау шешімі емес.`;
  const minimum = value.match(/minimum (\d+)/)?.[1] || "50";
  const below = value.match(/Below section minimum: (.*?)\./)?.[1];
  return language === "ru"
    ? `Общий балл: ${n}/140 (минимум ${minimum}). ${below ? "Ниже минимума: " + below.split(", ").map(t).join(", ") + "." : "Минимумы всех разделов выполнены."} Уточните дальнейшие варианты в приёмной комиссии.`
    : `Жалпы балл: ${n}/140 (минимум ${minimum}). ${below ? "Минимум орындалмады: " + below.split(", ").map(t).join(", ") + "." : "Барлық бөлім минимумдары орындалды."} Келесі мүмкіндіктерді қабылдау комиссиясынан нақтылаңыз.`;
}

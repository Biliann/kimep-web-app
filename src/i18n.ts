import { useSyncExternalStore } from "react";
import * as data from "./data";
import { programs } from "./programs";
import { useSelectedProgram } from "./programSelection";
import { translations } from "./translations";

export type Language = "en" | "ru" | "kk";
const normalize = (s: string) => s.replace(/\s+/g, " ").trim();

function initialLanguage(): Language {
  try {
    const saved = localStorage.getItem("kimep-language-v1");
    if (saved === "ru" || saved === "kk" || saved === "en") return saved;
  } catch {}
  const nav = (typeof navigator !== "undefined" ? navigator.language : "").toLowerCase();
  return nav.startsWith("kk") ? "kk" : nav.startsWith("ru") ? "ru" : "ru"; // audience is mainly Russian/Kazakh speaking
}
let language: Language = initialLanguage();
const listeners = new Set<() => void>();
export const getLanguage = () => language;
export function setLanguage(next: Language) {
  language = next;
  document.documentElement.lang = next;
  try { localStorage.setItem("kimep-language-v1", next); } catch {}
  listeners.forEach((fn) => fn());
}

const reverse = new Map<string, string>();
for (const [key, values] of Object.entries(translations))
  for (const value of values) if (value !== key) reverse.set(normalize(value), key);

const months: Record<string, [string, string]> = {
  January: ["января", "қаңтар"], February: ["февраля", "ақпан"], March: ["марта", "наурыз"], April: ["апреля", "сәуір"],
  May: ["мая", "мамыр"], June: ["июня", "маусым"], July: ["июля", "шілде"], August: ["августа", "тамыз"],
  September: ["сентября", "қыркүйек"], October: ["октября", "қазан"], November: ["ноября", "қараша"], December: ["декабря", "желтоқсан"],
};
export function t(value: string): string {
  const normalized = normalize(value);
  const key = translations[normalized] ? normalized : reverse.get(normalized) || normalized;
  if (language === "en") return key;
  const row = translations[key];
  if (row) return row[language === "ru" ? 0 : 1];
  let text = value;
  for (const [a, b] of Object.entries(months)) text = text.replace(new RegExp("\\b" + a + "\\b", "g"), b[language === "ru" ? 0 : 1]);
  return text;
}
/** Translate a template and fill {name} placeholders. */
export function tf(value: string, vars: Record<string, string | number>): string {
  return t(value).replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ""));
}
export function useLanguage() {
  return useSyncExternalStore((fn) => { listeners.add(fn); return () => { listeners.delete(fn); }; }, () => language, () => "ru" as Language);
}
function translate<T>(value: T): T {
  if (typeof value === "string") return t(value) as T;
  if (Array.isArray(value)) return value.map(translate) as T;
  if (value && typeof value === "object") return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, translate(v)])) as T;
  return value;
}
/** All site data translated into the current language, plus the selected program. */
export function useContent() {
  useLanguage();
  const selected = useSelectedProgram();
  return { ...translate(data), program: translate(programs[selected]), programId: selected };
}
export function useT() {
  useLanguage();
  return t;
}
document.documentElement.lang = language;

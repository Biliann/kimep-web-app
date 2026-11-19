// Offline fallback: when the AI service is unreachable the assistant answers from the site's own FAQ,
// so it is never "dead". Simple prefix-stem keyword matching works for English, Russian and Kazakh.
export type FaqItem = { q: string; a: string; source: string };
const stem = (w: string) => w.toLowerCase().replace(/[^\p{L}\p{N}]/gu, "").slice(0, 5);
const stop = new Set(["what", "which", "does", "need", "have", "where", "когда", "какой", "какие", "нужно", "нужен", "можно", "қандай", "керек", "болады"]);
const words = (s: string) => s.split(/\s+/).map(stem).filter((w) => w.length >= 3 && !stop.has(w));

const pageFor: Record<string, string> = { fees: "cost", priceList: "cost", aid: "cost", school: "scores", guideKz: "scores", admission: "docs", medical: "docs", deadlines: "docs", tests: "scores" };

export function localAnswer(question: string, faq: FaqItem[]): { text: string; source?: string; page?: string } | null {
  const qw = new Set(words(question));
  if (!qw.size) return null;
  let best: { f: FaqItem; score: number } | null = null;
  for (const f of faq) {
    const qs = words(f.q), as = new Set(words(f.a));
    let score = 0;
    for (const w of qw) { if (qs.includes(w)) score += 3; else if (as.has(w)) score += 1; }
    if (!best || score > best.score) best = { f, score };
  }
  if (!best || best.score < 3) return null;
  return { text: best.f.a, source: best.f.source, page: pageFor[best.f.source] };
}

// Pure parsing for assistant answers (no JSX, unit-tested). Model output is only ever turned into
// plain tokens; nothing here produces HTML.
export type Token = { type: "text"; text: string } | { type: "bold"; text: string } | { type: "link"; text: string; href: string };
const inlineRe = /(\*\*[^*]+\*\*|\[[^\]]+\]\(https:\/\/[^\s)]+\))/g;
export function tokenizeInline(text: string): Token[] {
  return text.split(inlineRe).filter(Boolean).map((part): Token => {
    if (part.startsWith("**") && part.endsWith("**") && part.length > 4) return { type: "bold", text: part.slice(2, -2) };
    const m = /^\[([^\]]+)\]\((https:\/\/[^\s)]+)\)$/.exec(part);
    if (m) return { type: "link", text: m[1], href: m[2] };
    return { type: "text", text: part };
  });
}
export function parseTags(text: string, streaming: boolean) {
  const sources: string[] = [];
  const pages: string[] = [];
  // accepts [source:fees], [source:fees, school] and [source:fees][source:school]
  let body = text.replace(/\[(source|page):\s*([a-zA-Z]+(?:\s*,\s*(?:(?:source|page):)?\s*[a-zA-Z]+)*)\s*\]/g, (_, kind: string, ids: string) => {
    for (const id of ids.split(",")) (kind === "source" ? sources : pages).push(id.replace(/^\s*(source|page):/, "").trim());
    return "";
  });
  if (streaming) body = body.replace(/\[[^\]]{0,24}$/, ""); // hide a half-typed tag
  return { body: body.replace(/[ \t]+\n/g, "\n").trim(), sources: [...new Set(sources)], pages: [...new Set(pages)] };
}
export type Block = { kind: "p" | "ul" | "ol"; lines: string[] };
export function toBlocks(text: string): Block[] {
  const blocks: Block[] = [];
  for (const raw of text.split("\n")) {
    const line = raw.trimEnd();
    if (!line.trim()) { blocks.push({ kind: "p", lines: [] }); continue; }
    const kind = /^\s*[-*•]\s+/.test(line) ? "ul" : /^\s*\d+[.)]\s+/.test(line) ? "ol" : "p";
    const last = blocks[blocks.length - 1];
    if (last && last.kind === kind && (kind !== "p" || last.lines.length)) last.lines.push(line);
    else if (last && last.kind === "p" && !last.lines.length && kind === "p") last.lines.push(line);
    else blocks.push({ kind, lines: [line] });
  }
  return blocks.filter((b) => b.lines.length);
}

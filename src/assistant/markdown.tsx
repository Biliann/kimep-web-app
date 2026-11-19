import { Fragment, type ReactNode } from "react";
import { tokenizeInline, toBlocks } from "./parse";

function inline(text: string): ReactNode[] {
  return tokenizeInline(text).map((tok, i) =>
    tok.type === "bold" ? <strong key={i}>{tok.text}</strong>
    : tok.type === "link" ? <a key={i} href={tok.href} target="_blank" rel="noreferrer">{tok.text}</a>
    : <Fragment key={i}>{tok.text}</Fragment>);
}
export function Markdown({ text }: { text: string }) {
  return (
    <>
      {toBlocks(text).map((b, i) => {
        if (b.kind === "ul") return <ul key={i}>{b.lines.map((l, j) => <li key={j}>{inline(l.replace(/^\s*[-*•]\s+/, ""))}</li>)}</ul>;
        if (b.kind === "ol") return <ol key={i}>{b.lines.map((l, j) => <li key={j}>{inline(l.replace(/^\s*\d+[.)]\s+/, ""))}</li>)}</ol>;
        return <p key={i}>{b.lines.map((l, j) => <Fragment key={j}>{j > 0 && <br />}{inline(l.replace(/^#+\s*/, ""))}</Fragment>)}</p>;
      })}
    </>
  );
}

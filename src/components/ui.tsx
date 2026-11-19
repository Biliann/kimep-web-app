import { useId, useState, type ReactNode } from "react";
import { ChevronDown, TriangleAlert } from "lucide-react";
import { useContent, useT } from "../i18n";
import { programIds, programs } from "../programs";
import { setSelectedProgram, useSelectedProgram } from "../programSelection";
import type { SourceKey } from "../data";

export function Accordion({ title, children, defaultOpen = false }: { title: ReactNode; children: ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  const id = useId();
  return (
    <div className="acc" data-open={open}>
      <button type="button" aria-expanded={open} aria-controls={id} onClick={() => setOpen(!open)}>
        <span>{title}</span>
        <ChevronDown aria-hidden="true" />
      </button>
      <div className="acc-panel" id={id} role="region" aria-hidden={!open} {...(!open ? { inert: true } : {})}>
        <div><div className="acc-body">{children}</div></div>
      </div>
    </div>
  );
}

/** Compact warning: icon + one line + "details". Used for source conflicts. */
export function Note({ summary, children }: { summary: ReactNode; children: ReactNode }) {
  const t = useT();
  return (
    <details className="note">
      <summary><TriangleAlert aria-hidden="true" /><span>{summary} <u>{t("details")}</u></span></summary>
      <p>{children}</p>
    </details>
  );
}

/** One line of sources at the bottom of a section, with the links in a drop-down. */
export function Sources({ ids }: { ids: SourceKey[] }) {
  const t = useT();
  const { sources, verified } = useContent();
  const list = [...new Set(ids)];
  return (
    <footer className="sources">
      <details>
        <summary>{t("Sources")}: {list.map((i) => sources[i].title).slice(0, 2).join(" · ")}{list.length > 2 ? " …" : ""} · {t("verified")} {verified}</summary>
        <ul>
          {list.map((i) => (
            <li key={i}><a href={sources[i].url} target="_blank" rel="noreferrer">{sources[i].title}</a> <span className="muted">· {sources[i].published}</span></li>
          ))}
        </ul>
      </details>
    </footer>
  );
}

export function ProgramPicker({ label }: { label?: string }) {
  const t = useT();
  const selected = useSelectedProgram();
  return (
    <label className="picker">
      {label ?? t("Your program")}
      <select value={selected} onChange={(e) => setSelectedProgram(e.target.value)}>
        {programIds.map((id) => (
          <option key={id} value={id}>{t(programs[id].name.replace(/^Bachelor of /, ""))}</option>
        ))}
      </select>
    </label>
  );
}

export function Head({ title, lead }: { title: string; lead?: string }) {
  return (
    <header className="band"><div className="wrap">
      <h1>{title}</h1>
      {lead && <p className="lead">{lead}</p>}
    </div></header>
  );
}

import { useEffect, useState } from "react";
import { useContent, useT } from "../i18n";
import { fmtDate } from "../format";
import { Head, Note, Sources } from "../components/ui";

const KEY = "kimep-pathway-checklist-v1"; // same key as before, saved ticks survive the redesign

function Steps() {
  const t = useT();
  const { steps } = useContent();
  return (
    <section className="section" id="steps">
      <h2>{t("How to apply")}</h2>
      <ol className="timeline">
        {steps.map((s, i) => (
          <li key={s.title}><span className="n" aria-hidden="true">{i + 1}</span><div><h3>{s.title}</h3><p>{s.detail}</p></div></li>
        ))}
      </ol>
    </section>
  );
}

function Checklist() {
  const t = useT();
  const { documents } = useContent();
  const [checked, setChecked] = useState<string[]>(() => {
    try {
      const v = JSON.parse(localStorage.getItem(KEY) || "[]");
      return Array.isArray(v) ? v.filter((x: unknown) => typeof x === "string") : [];
    } catch { return []; }
  });
  const [confirm, setConfirm] = useState(false);
  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify(checked)); } catch {} }, [checked]);
  const done = documents.filter((d) => checked.includes(d.id)).length;
  const stages = [...new Set(documents.map((d) => d.stage))];
  const toggle = (id: string) => setChecked((c) => (c.includes(id) ? c.filter((x) => x !== id) : [...c, id]));
  return (
    <section className="section" id="checklist">
      <h2>{t("Documents checklist")}</h2>
      <div role="progressbar" aria-valuemin={0} aria-valuemax={documents.length} aria-valuenow={done} aria-label={t("Checklist progress")} className="progress"><i style={{ width: `${(done / documents.length) * 100}%` }} /></div>
      <p className="hint">{done} / {documents.length} · {t("Saved only in this browser.")}</p>
      {stages.map((stage) => (
        <div className="stage" key={stage}>
          <h3>{stage}</h3>
          {documents.filter((d) => d.stage === stage).map((d) => (
            <label className="check" key={d.id}>
              <input type="checkbox" checked={checked.includes(d.id)} onChange={() => toggle(d.id)} />
              <span><b>{d.title}</b><small>{d.detail}</small></span>
            </label>
          ))}
        </div>
      ))}
      {checked.length > 0 && (confirm
        ? <div className="chips"><span>{t("Clear all ticks?")}</span><button className="btn small" onClick={() => { setChecked([]); setConfirm(false); }}>{t("Yes, clear")}</button><button className="btn small ghost" onClick={() => setConfirm(false)}>{t("Cancel")}</button></div>
        : <div><button className="btn small ghost" onClick={() => setConfirm(true)}>{t("Reset checklist")}</button></div>)}
      <Note summary={t("KIMEP's own sources differ on three document details.")}>
        {t("Agreement: the guides say sign, scan and upload under SIGNED CONTRACT, while the website page says to hand in two printed copies. Chest X-ray: two radiologist stamps, or two signatures plus two stamps valid for 6 months. Confirm both with Admissions and the Medical Center.")}
      </Note>
    </section>
  );
}

function Deadlines() {
  const t = useT();
  const { deadlines } = useContent();
  const intakes = [...new Set(deadlines.map((d) => d.intake))];
  const [filter, setFilter] = useState("all");
  const today = new Date().toISOString().slice(0, 10);
  const rows = deadlines.filter((d) => filter === "all" || d.intake === filter);
  return (
    <section className="section" id="deadlines">
      <h2>{t("Deadlines")}</h2>
      <p>{t("New Kazakhstan school graduates apply for the Fall 2027 intake. The other rows are for international, transfer and reinstated applicants.")}</p>
      <div className="chips" role="group" aria-label={t("Filter deadlines")}>
        <button type="button" className="chip" aria-pressed={filter === "all"} onClick={() => setFilter("all")}>{t("All")}</button>
        {intakes.map((i) => <button key={i} type="button" className="chip" aria-pressed={filter === i} onClick={() => setFilter(i)}>{i}</button>)}
      </div>
      <div className="deadlines">
        {rows.map((d) => {
          const closed = today > d.end;
          return (
            <div className="deadline" key={d.category + d.intake}>
              <div className="k"><b>{d.intake}</b><small>{d.category}</small></div>
              <div className="k"><small>{t("Apply until")}</small><b>{fmtDate(d.end)}</b><span className={closed ? "state-closed" : "state-open"}>{closed ? t("closed") : t("open")}</span></div>
              <div className="k"><small>{t("Enrollment")}</small>{d.enrollment}</div>
              <div className="k"><small>{t("Classes start")}</small>{d.classes}</div>
            </div>
          );
        })}
      </div>
      <p className="hint">{t("Applications open on 16 October 2026 according to the live schedule; the guide says 15 October. Applying early is recommended.")}</p>
    </section>
  );
}

export default function Docs() {
  const t = useT();
  return (
    <>
      <Head title={t("Documents and dates")} lead={t("The steps, what to prepare and when.")} />
      <div className="page">
        <Steps />
        <Checklist />
        <Deadlines />
        <Sources ids={["admission", "guideKz", "school", "medical", "deadlines"]} />
      </div>
    </>
  );
}

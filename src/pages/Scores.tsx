import { useEffect, useMemo, useState, type FormEvent } from "react";
import { CircleAlert, CircleCheck, Info, Search, TriangleAlert } from "lucide-react";
import { tf, useContent, useT } from "../i18n";
import { checkAdmission, type CheckerResult } from "../checker";
import { programs, programIds, sectionMaximums } from "../programs";
import { setSelectedProgram, useSelectedProgram } from "../programSelection";
import { Accordion, Head, Note, ProgramPicker, Sources } from "../components/ui";

function Checker() {
  const t = useT();
  const { program } = useContent();
  const id = useSelectedProgram();
  const [path, setPath] = useState("school");
  const [subjectsOk, setSubjectsOk] = useState(true);
  const [scores, setScores] = useState(["", "", "", "", ""]);
  const [result, setResult] = useState<CheckerResult | null>(null);
  useEffect(() => { setResult(null); setScores(["", "", "", "", ""]); setSubjectsOk(true); }, [id]);
  const raw = programs[id];
  const submit = (e: FormEvent) => {
    e.preventDefault();
    setResult(checkAdmission({
      citizenship: path === "foreign" ? "international" : "kz",
      route: path === "college" ? "vocational" : "school",
      program: id,
      subjects: subjectsOk ? raw.subjectKey : "other",
      scores,
    }));
  };
  const note = (r: CheckerResult) => {
    if (r.status === "success") return tf("Your total is {n}/140 and all five section minimums are met. Next: prepare your documents and confirm your English level. This is not an admission decision.", { n: r.total ?? 0 });
    if (r.total !== undefined) {
      const parts = [tf("Total: {n}/140, the published minimum is {min}.", { n: r.total, min: r.minimumTotal ?? 0 })];
      if (r.shortBy) parts.push(tf("You are {n} points short.", { n: r.shortBy }));
      if (r.belowMinimum?.length) parts.push(t("Below the section minimum") + ": " + r.belowMinimum.map(t).join(", ") + ".");
      parts.push(t("Ask Admissions about your options."));
      return parts.join(" ");
    }
    return t(r.detail);
  };
  const Icon = result?.status === "success" ? CircleCheck : result?.status === "invalid" ? CircleAlert : TriangleAlert;
  const title = (r: CheckerResult) => r.status === "success" ? t("You appear to meet the basic UNT requirement.") : t(r.title);
  return (
    <section className="section" id="checker">
      <h2>{t("Do my scores qualify?")}</h2>
      <ProgramPicker />
      {program.creative ? (
        <div className="status review"><Info aria-hidden="true" /><h3>{t("Journalism uses creative exams.")}</h3><p>{t(programs[id].note ?? "")} {t("There is no total UNT threshold to check; ask Admissions for the exam date.")}</p></div>
      ) : (
        <form className="checker card" onSubmit={submit} noValidate>
          <label>{t("Who are you?")}
            <select value={path} onChange={(e) => { setPath(e.target.value); setResult(null); }}>
              <option value="school">{t("Kazakhstan high-school graduate")}</option>
              <option value="college">{t("College or vocational graduate")}</option>
              <option value="foreign">{t("International student")}</option>
            </select>
          </label>
          <fieldset style={{ border: 0, padding: 0, margin: 0 }}>
            <legend className="hint" style={{ marginBottom: 6 }}>{t("Did you take these profile subjects?")} <b>{program.subjects.join(" + ")}</b></legend>
            <div className="radios">
              <label className="radio"><input type="radio" name="subj" checked={subjectsOk} onChange={() => { setSubjectsOk(true); setResult(null); }} />{t("Yes")}</label>
              <label className="radio"><input type="radio" name="subj" checked={!subjectsOk} onChange={() => { setSubjectsOk(false); setResult(null); }} />{t("No, different subjects")}</label>
            </div>
          </fieldset>
          <div className="grid5">
            {program.sectionNames.map((name, i) => (
              <label key={name}>{name}
                <input inputMode="numeric" pattern="[0-9]*" autoComplete="off" value={scores[i]} aria-describedby={`h${i}`}
                  onChange={(e) => { const s = [...scores]; s[i] = e.target.value; setScores(s); setResult(null); }} />
                <span className="hint" id={`h${i}`}>{t("0 to")} {sectionMaximums[i]} · {t("minimum")} {raw.sectionMinimums[i]}</span>
              </label>
            ))}
          </div>
          <button className="btn" type="submit">{t("Check my scores")}</button>
          <div aria-live="polite" role="status">
            {result && <div className={"status " + result.status}><Icon aria-hidden="true" /><h3>{title(result)}</h3><p>{note(result)}</p></div>}
          </div>
        </form>
      )}
    </section>
  );
}

function Requirements() {
  const t = useT();
  const { program } = useContent();
  const selected = useSelectedProgram();
  const [q, setQ] = useState("");
  const [min, setMin] = useState<"all" | "50" | "75" | "creative">("all");
  const rows = useMemo(() => programIds.filter((id) => {
    const p = programs[id];
    if (min === "50" && p.unt !== 50) return false;
    if (min === "75" && p.unt !== 75) return false;
    if (min === "creative" && !p.creative) return false;
    const hay = `${t(p.name)} ${p.name} ${p.code} ${p.short} ${p.subjects.map(t).join(" ")}`.toLowerCase();
    return hay.includes(q.trim().toLowerCase());
  }), [q, min, t]);
  void program;
  return (
    <section className="section" id="requirements">
      <h2>{t("Requirements for every program")}</h2>
      <div className="toolbar">
        <label className="search">
          <span className="sr">{t("Search programs")}</span>
          <Search aria-hidden="true" />
          <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={t("Search a program or subject")} />
        </label>
        <div className="chips" role="group" aria-label={t("Filter by minimum")}>
          {([["all", t("All")], ["50", "50"], ["75", "75"], ["creative", t("Creative exam")]] as const).map(([v, label]) => (
            <button key={v} type="button" className="chip" aria-pressed={min === v} onClick={() => setMin(v)}>{label}</button>
          ))}
        </div>
      </div>
      <div className="table">
        <div className="row th" aria-hidden="true"><span>{t("Program")}</span><span>{t("Minimum")}</span><span>{t("Profile subjects")}</span><span>{t("Section minimums")}</span></div>
        {rows.map((id) => {
          const p = programs[id];
          return (
            <button type="button" className="row" key={id} data-selected={selected === id} aria-pressed={selected === id} onClick={() => setSelectedProgram(id)}>
              <span className="name"><b>{t(p.name.replace(/^Bachelor of /, ""))}</b><small>{p.code} · {p.short}{p.note ? " · " + t(p.note) : ""}</small></span>
              <span><span className="lab">{t("Minimum")}</span><b>{p.creative ? t("Creative exams") : `${p.unt} / 140`}</b></span>
              <span><span className="lab">{t("Profile subjects")}</span>{p.creative ? "—" : p.subjects.map(t).join(" + ")}</span>
              <span><span className="lab">{t("Section minimums")}</span>{p.creative ? t("UNT History and Reading are considered") : p.sectionMinimums.join(" · ")}</span>
            </button>
          );
        })}
        {rows.length === 0 && <div className="row">{t("No program matches.")}</div>}
      </div>
      <p className="hint">{t("Section minimums are in this order")}: {t("Reading Literacy")} · {t("Mathematical Literacy")} · {t("History of Kazakhstan")} · {t("elective")} · {t("profile")}. {t("Defaults: 3, 3, 5, 5, 5. Cognitive Sciences needs 5 in Mathematical Literacy.")}</p>
      <Note summary={t("Political Science is in the admission guide but not on the website list.")}>{t("Confirm its UNT subjects with Admissions before relying on this row.")}</Note>
    </section>
  );
}

function English() {
  const t = useT();
  const { englishLevels, englishRules } = useContent();
  return (
    <section className="section" id="english">
      <h2>{t("English level")}</h2>
      <ul className="rules">
        {englishRules.slice(0, 2).map((r) => <li key={r.text}>{r.text}</li>)}
      </ul>
      <div className="scroll" tabIndex={0} role="region" aria-label={t("English levels and certificates")}>
        <table>
          <thead><tr><th>{t("Level")}</th><th>CEFR</th><th>IELTS</th><th>TOEFL iBT*</th><th>Duolingo</th><th>PTE</th><th>Cambridge</th><th>LanguageCert</th></tr></thead>
          <tbody>
            {englishLevels.map((l) => (
              <tr key={l.name}><th scope="row">{l.name}</th><td>{l.cefr}</td><td>{l.ielts}</td><td>{l.toefl}</td><td>{l.duolingo}</td><td>{l.pte}</td><td>{l.cambridge}</td><td>{l.languageCert}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
      <Accordion title={t("Law applicants (LL.B. and B.I.L.)")}>
        <p>{englishRules[4].text}</p>
      </Accordion>
      <Note summary={t("The Duolingo and TOEFL rows are unclear in KIMEP's table.")}>{t("Duolingo ranges for UF A and UF B overlap, and TOEFL iBT still shows the old 0–120 scale although a new 1–6 scale started on 21 January 2026. Ask Admissions how your result is placed.")}</Note>
    </section>
  );
}

export default function Scores() {
  const t = useT();
  return (
    <>
      <Head title={t("UNT scores")} />
      <div className="page">
        <Checker />
        <Requirements />
        <English />
        <Sources ids={["school", "admission", "guideKz"]} />
      </div>
    </>
  );
}

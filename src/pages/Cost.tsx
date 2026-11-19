import { Fragment, useMemo, useState } from "react";
import { Minus, Plus } from "lucide-react";
import { useContent, useT } from "../i18n";
import { calculateTuition } from "../tuition";
import { kzt, num } from "../format";
import { programs } from "../programs";
import { useSelectedProgram } from "../programSelection";
import { tuitionRules } from "../data";
import { Head, ProgramPicker, Sources } from "../components/ui";

function Stepper({ value, min, max, onChange, label }: { value: number; min: number; max: number; onChange: (n: number) => void; label: string }) {
  const clamp = (n: number) => Math.min(max, Math.max(min, n));
  return (
    <div className="stepper" role="group" aria-label={label}>
      <button type="button" aria-label="−" onClick={() => onChange(clamp(value - 1))}><Minus size={18} aria-hidden="true" /></button>
      <input inputMode="numeric" aria-label={label} value={value} onChange={(e) => onChange(clamp(Number(e.target.value.replace(/\D/g, "")) || min))} />
      <button type="button" aria-label="+" onClick={() => onChange(clamp(value + 1))}><Plus size={18} aria-hidden="true" /></button>
    </div>
  );
}

const lineName: Record<string, string> = {
  tuition: "Tuition",
  activity: "Student activity fee",
  medical: "Medical examination fee",
  textbookDeposit: "Textbook security deposit",
  bed: "Residence hall bed",
  dormDeposit: "Residence hall security deposit",
  foundation: "Foundation English",
};

function Calculator() {
  const t = useT();
  const id = useSelectedProgram();
  const p = programs[id];
  const [perSemester, setPerSemester] = useState(15);
  const [mode, setMode] = useState<"whole" | "semesters">("semesters");
  const [semesters, setSemesters] = useState(2);
  const [dorm, setDorm] = useState(false);
  const [months, setMonths] = useState(9);
  const [foundation, setFoundation] = useState(0);
  const [grant, setGrant] = useState(0);
  const [view, setView] = useState<"year" | "semester" | "program">("year");
  const totalCredits = p.credits ?? tuitionRules.exampleProgramCredits;
  const r = useMemo(() => calculateTuition({
    creditsPerSemester: perSemester,
    semesters,
    totalCredits: mode === "whole" ? totalCredits : undefined,
    scholarshipPercent: grant,
    dormitory: dorm,
    dormMonthsPerYear: months,
    foundationLevels: foundation,
  }), [perSemester, semesters, mode, totalCredits, grant, dorm, months, foundation]);
  const b = r[view];
  const groups: { g: string; title: string; note?: string }[] = [
    { g: "tuition", title: t("Tuition") },
    { g: "fees", title: t("Mandatory fees") },
    { g: "deposits", title: t("Deposits"), note: t("paid separately, not tuition") },
    { g: "housing", title: t("Residence hall") },
    { g: "foundation", title: t("Foundation English") },
  ];
  const periodLabel = { semester: t("First semester"), year: t("First academic year"), program: mode === "whole" ? t("Whole program") : t("Chosen period") };
  return (
    <section className="section" id="calculator">
      <div className="calc">
        <div className="card inputs">
          <ProgramPicker />
          <div>
            <label htmlFor="cps" style={{ display: "flex", gap: 6 }}>{t("Credits per semester")}: <b>{perSemester}</b></label>
            <input id="cps" type="range" min={6} max={21} value={perSemester} onChange={(e) => setPerSemester(Number(e.target.value))} />
            <span className="hint">{t("Recommended 15–18 per semester (30–36 per year).")}</span>
          </div>
          <div>
            <div className="chips" role="group" aria-label={t("Length of study")}>
              <button type="button" className="chip" aria-pressed={mode === "semesters"} onClick={() => setMode("semesters")}>{t("Choose semesters")}</button>
              <button type="button" className="chip" aria-pressed={mode === "whole"} onClick={() => setMode("whole")}>{t("Whole program")}</button>
            </div>
            {mode === "semesters"
              ? <div style={{ marginTop: 10 }}><Stepper value={semesters} min={1} max={12} onChange={setSemesters} label={t("Number of semesters")} /></div>
              : <p className="hint" style={{ marginTop: 8 }}>{p.credits ? `${totalCredits} ${t("credits")}` : `${totalCredits} ${t("credits, the example in KIMEP's price list; check your program's catalog")}`} · {t("Semesters")}: {r.program.semesters}</p>}
          </div>
          <div>
            <label className="radio" style={{ display: "flex" }}><input type="checkbox" checked={dorm} onChange={(e) => setDorm(e.target.checked)} />{t("I need the residence hall")}</label>
            {dorm && <div style={{ marginTop: 10 }}><span className="hint">{t("Months per academic year")}</span><Stepper value={months} min={1} max={12} onChange={setMonths} label={t("Months per academic year")} /></div>}
          </div>
          <div>
            <span className="hint" id="fl">{t("Foundation English levels")}</span>
            <div className="chips" role="group" aria-labelledby="fl">
              {[0, 1, 2, 3].map((n) => <button key={n} type="button" className="chip" aria-pressed={foundation === n} onClick={() => setFoundation(n)}>{n}</button>)}
            </div>
          </div>
          <div>
            <span className="hint" id="gl">{t("Grant covers, what if (% of tuition)")}</span>
            <div className="chips" role="group" aria-labelledby="gl">
              {[0, 25, 50, 100].map((n) => <button key={n} type="button" className="chip" aria-pressed={grant === n} onClick={() => setGrant(n)}>{n}%</button>)}
            </div>
          </div>
        </div>
        <div style={{ display: "grid", gap: 16 }} aria-live="polite">
          <div className="total">
            <small>{periodLabel[view]} · {t("Semesters")}: {b.semesters} · {t("Credits")}: {b.credits}</small>
            <b>{kzt(b.total)}</b>
          </div>
          <div className="chips" role="group" aria-label={t("Show total for")}>
            {(["semester", "year", "program"] as const).map((v) => <button key={v} type="button" className="chip" aria-pressed={view === v} onClick={() => setView(v)}>{periodLabel[v]}</button>)}
          </div>
          <table className="breakdown">
            <thead><tr><th>{t("Item")}</th><th>KZT</th></tr></thead>
            <tbody>
              {groups.map(({ g, title, note }) => {
                const lines = b.lines.filter((l) => l.group === g);
                if (!lines.length) return null;
                return (
                  <Fragment key={g}>
                    {g !== "tuition" && <tr className="grp"><td colSpan={2}>{title}{note ? ` · ${note}` : ""}</td></tr>}
                    {lines.map((l) => <tr key={l.id}><td>{t(lineName[l.id])}</td><td>{num(l.amount)}</td></tr>)}
                    {g === "tuition" && b.grant > 0 && <tr className="neg"><td>{t("Grant (what if)")} {grant}%</td><td>−{num(b.grant)}</td></tr>}
                  </Fragment>
                );
              })}
            </tbody>
            <tfoot><tr><td>{t("Total")}</td><td>{num(b.total)}</td></tr></tfoot>
          </table>
          <p className="hint">{t("2026–2027 rates. KIMEP may change them in later academic years. Late payment and late registration fees are not included.")}</p>
        </div>
      </div>
    </section>
  );
}

function Scholarships() {
  const t = useT();
  const { scholarships2026, sources } = useContent();
  return (
    <section className="section" id="scholarships">
      <h2>{t("Scholarships")}</h2>
      <p>{t("The published 2026 offer was the Intellectual Olympiad: 15 grants of 100% and 15 of 50% of tuition, for 2026 graduates. Grants cover tuition only. Nothing for 2027 is published yet.")}</p>
      <p><a href={sources.aid.url} target="_blank" rel="noreferrer">{t("Official scholarships page")}</a> · {scholarships2026.contact}</p>
    </section>
  );
}

export default function Cost() {
  const t = useT();
  return (
    <>
      <Head title={t("Cost of study")} />
      <div className="page">
        <Calculator />
        <Scholarships />
        <Sources ids={["fees", "priceList", "aid"]} />
      </div>
    </>
  );
}

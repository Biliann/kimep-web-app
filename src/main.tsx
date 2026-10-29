import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowUpRight,
  ArrowRight,
  BookOpen,
  ChevronRight,
  CircleHelp,
  ClipboardCheck,
  FileText,
  GraduationCap,
  Menu,
  Search,
  ShieldCheck,
  X,
  CalendarDays,
  Wallet,
  Globe2,
  Mail,
  Phone,
  ExternalLink,
  RotateCcw,
} from "lucide-react";
import type { SourceKey } from "./data";
import { checkAdmission, type CheckerInput } from "./checker";
import "./style.css";
import {
  t,
  useContent,
  useLanguage,
  setLanguage,
  getLanguage,
  type Language,
  translateCheckerDetail,
} from "./i18n";
import AssistantDemo from "./AssistantDemo";
import { programs, programIds } from "./programs";
import { useSelectedProgram, setSelectedProgram } from "./programSelection";
const navigation = [
  ["home", t("Overview"), BookOpen],
  ["checker", t("Admission checker"), ShieldCheck],
  ["program", t("Programs"), GraduationCap],
  ["requirements", t("Requirements"), FileText],
  ["documents", t("Documents checklist"), ClipboardCheck],
  ["apply", t("How to apply"), ArrowRight],
  ["english", t("English placement"), Globe2],
  ["tuition", t("Tuition & financial aid"), Wallet],
  ["deadlines", t("Dates & deadlines"), CalendarDays],
  ["faq", t("Common questions"), CircleHelp],
  ["contacts", t("Contacts & links"), Mail],
] as const;
type Page = (typeof navigation)[number][0];
function Source({ id }: { id: SourceKey }) {
  const {
    sources,
    program,
    verified,
    documents,
    steps,
    deadlines,
    fees,
    contacts,
    faq,
    englishLevels,
  } = useContent();
  return (
    <p className="source">
      <a href={sources[id].url} target="_blank" rel="noreferrer">
        {t("Official source")}
        <ArrowUpRight size={12} />
      </a>
      <span>
        {t("Verified from KIMEP:")}
        {sources[id].lastVerified}
      </span>
    </p>
  );
}
function LinkButton({
  to,
  children,
  secondary = false,
}: {
  to: string;
  children: React.ReactNode;
  secondary?: boolean;
}) {
  return (
    <a className={"button " + (secondary ? "secondary" : "")} href={to}>
      {children}
      <ArrowUpRight size={17} />
    </a>
  );
}
function Notice({ children }: { children: React.ReactNode }) {
  return (
    <div className="notice">
      <CircleHelp size={18} />
      <div>{children}</div>
    </div>
  );
}
function Heading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <header className="page-heading">
      <div className="eyebrow">{eyebrow}</div>
      <h1>{title}</h1>
      <p>{description}</p>
    </header>
  );
}
const currency = (n: number) => new Intl.NumberFormat("en-US").format(n);
const date = (value: string) => {
  const d = new Date(value + "T12:00:00Z");
  const month = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ][d.getUTCMonth()];
  if (getLanguage() === "kk")
    return `${d.getUTCFullYear()} жылғы ${d.getUTCDate()} ${t(month)}`;
  if (getLanguage() === "ru")
    return `${d.getUTCDate()} ${t(month)} ${d.getUTCFullYear()}`;
  return `${d.getUTCDate()} ${month} ${d.getUTCFullYear()}`;
};
function Overview() {
  const {
    sources,
    program,
    verified,
    documents,
    steps,
    deadlines,
    fees,
    contacts,
    faq,
    englishLevels,
  } = useContent();
  const startLinks = [
    {
      to: "checker",
      title: t("Check your requirements"),
      detail: t("See the basic UNT rules for your application."),
      icon: ShieldCheck,
    },
    {
      to: "documents",
      title: t("Prepare your documents"),
      detail: t("Use a checklist that saves your progress."),
      icon: ClipboardCheck,
    },
    {
      to: "apply",
      title: t("Follow the application steps"),
      detail: t("Know what to do, from applying to registration."),
      icon: ArrowRight,
    },
    {
      to: "program",
      title: t("Explore programs"),
      detail: t("Understand the program and what you study."),
      icon: GraduationCap,
    },
  ];
  return (
    <div className="home-minimal">
      <section className="home-intro">
        <div className="intro-copy">
          <span className="simple-kicker">{t("KIMEP ADMISSIONS GUIDE")}</span>
          <h1>
            {t("Applying to KIMEP,")}
            <br />
            {t("made simple.")}
          </h1>
          <p>
            {t("Requirements, documents and next steps.")}
            <br />
            {t("Everything you need to get started.")}
          </p>
          <LinkButton to="#checker">{t("Check my requirements")}</LinkButton>
          <p className="independent-note">
            {t(
              "Independent student project · Not an official university service",
            )}
          </p>
        </div>
        <a
          href="https://www.kimep.kz/"
          target="_blank"
          rel="noreferrer"
          className="home-logo-link"
          aria-label={t("Visit the official KIMEP University website")}
        >
          <img
            className="home-logo"
            src="/kimep-logo.png"
            width="406"
            height="536"
            alt={t("KIMEP University")}
          />
        </a>
      </section>
      <section className="start-section">
        <h2>{t("Where would you like to start?")}</h2>
        <div className="start-grid">
          {startLinks.map(({ to, title, detail, icon: Icon }) => (
            <a key={to} className="start-card" href={"#" + to}>
              <Icon size={21} strokeWidth={1.7} />
              <div>
                <h3>{title}</h3>
                <p>{detail}</p>
              </div>
              <ChevronRight size={18} />
            </a>
          ))}
        </div>
      </section>
      <section className="at-a-glance">
        <div className="section-heading">
          <h2>{program.name}</h2>
          <a href="#requirements">
            {t("View requirements")}
            <ArrowUpRight size={14} />
          </a>
        </div>
        <div className="glance-grid">
          <div>
            <span>{t("UNT minimum")}</span>
            <strong>
              {program.unt} {t("points")}
            </strong>
            <small>{t("Section minimums also apply.")}</small>
          </div>
          <div>
            <span>{t("Profile subjects")}</span>
            <strong>{program.subjects.join(" + ")}</strong>
            <small>{t("Standard high-school route.")}</small>
          </div>
          <div>
            <span>{t("English")}</span>
            <strong>{t("IELTS or placement")}</strong>
            <small>
              <a href="#english">{t("See your English options →")}</a>
            </small>
          </div>
        </div>
        <Source id="school" />
      </section>
      <section className="home-more">
        <h2>{t("More useful information")}</h2>
        <div>
          <a href="#tuition">
            {t("Tuition & financial aid")}
            <ArrowUpRight size={16} />
          </a>
          <a href="#deadlines">
            {t("Dates & deadlines")}
            <ArrowUpRight size={16} />
          </a>
          <a href="#faq">
            {t("Common questions")}
            <ArrowUpRight size={16} />
          </a>
          <a href="#contacts">
            {t("Contact KIMEP")}
            <ArrowUpRight size={16} />
          </a>
        </div>
      </section>
    </div>
  );
}
function Checker() {
  const selected = useSelectedProgram();
  useEffect(() => { setInput(previous => ({ ...previous, program: selected, subjects: "", scores: ["", "", "", "", ""] })); setResult(null); }, [selected]);
  const {
    sources,
    program,
    verified,
    documents,
    steps,
    deadlines,
    fees,
    contacts,
    faq,
    englishLevels,
  } = useContent();
  const [input, setInput] = useState<CheckerInput>({
    citizenship: "kz",
    route: "school",
    program: selected,
    subjects: "",
    scores: ["", "", "", "", ""],
  });
  const [certificate, setCertificate] = useState("none");
  const [result, setResult] = useState<ReturnType<
    typeof checkAdmission
  > | null>(null);
  const change = (key: keyof CheckerInput, value: string) => {
    setInput({ ...input, [key]: value });
    setResult(null);
  };
  return (
    <>
      <Heading
        eyebrow={t("01 / YOUR STARTING POINT")}
        title={t("Check the basic requirements.")}
        description={t(
          "A quick guide for your situation. Your answers stay in this tab and are not sent anywhere.",
        )}
      />
      <div className="two-column checker-layout">
        <form
          className="panel"
          onSubmit={(e) => {
            e.preventDefault();
            setResult(checkAdmission({ ...input, program: selected }));
          }}
          noValidate
        >
          <h2>{t("Tell us about your application")}</h2>
          <div className="field-grid">
            <label>
              {t("Citizenship")}
              <select
                value={input.citizenship}
                onChange={(e) => change("citizenship", e.target.value)}
              >
                <option value="kz">{t("Kazakhstan citizen")}</option>
                <option value="international">
                  {t("International applicant")}
                </option>
              </select>
            </label>
            <label>
              {t("Education route")}
              <select
                value={input.route}
                onChange={(e) => change("route", e.target.value)}
              >
                <option value="school">
                  {t("High-school graduate / final year")}
                </option>
                <option value="transfer">
                  {t("Transfer / reinstatement")}
                </option>
                <option value="vocational">
                  {t("Vocational / college graduate")}
                </option>
              </select>
            </label>
          </div>
          <label>
            {t("Intended program")}
            <select
              value={selected}
              onChange={(e) => setSelectedProgram(e.target.value)}
            >
              {programIds.map(id => <option key={id} value={id}>{t(programs[id].name)}</option>)}
            </select>
          </label>
          {input.citizenship === "kz" &&
            input.route === "school" && (
              <>
                <label>
                  {t("UNT profile subjects")}
                  <select
                    value={input.subjects}
                    onChange={(e) => change("subjects", e.target.value)}
                  >
                    <option value="">{t("Choose your subject combination")}</option>
                    <option value={program.subjectKey}>{program.subjects.join(" + ")}</option>
                    <option value="other">
                      {t("Another combination / not sure")}
                    </option>
                  </select>
                </label>
                <fieldset>
                  <legend>{t("Enter your five UNT section scores")}</legend>
                  <p className="small muted">
                    {t("Your total is calculated from these scores.")}
                  </p>
                  <div className="score-grid">
                    {program.sectionNames.map((name, i) => (
                      <label key={name}>
                        {name}
                        <input
                          type="number"
                          inputMode="numeric"
                          min={0}
                          max={program.sectionMaximums[i]}
                          step="1"
                          placeholder={"0–" + program.sectionMaximums[i]}
                          value={input.scores[i]}
                          onChange={(e) => {
                            const scores = [...input.scores];
                            scores[i] = e.target.value;
                            setInput({ ...input, scores });
                            setResult(null);
                          }}
                        />
                      </label>
                    ))}
                  </div>
                </fieldset>
              </>
            )}
          <label>
            {t("English certificate")}
            <select
              value={certificate}
              onChange={(e) => {
                setCertificate(e.target.value);
                setResult(null);
              }}
            >
              <option value="none">{t("No certificate yet")}</option>
              <option value="ielts">IELTS Academic</option>
              <option value="other">{t("Another accepted certificate")}</option>
            </select>
          </label>
          <button className="button" type="submit">
            {t("Check my next step")}
            <ArrowRight size={17} />
          </button>
          <div aria-live="polite" role="status">
            {result && (
              <div className={"result " + result.status}>
                <h3>{t(result.title)}</h3>
                <p>{translateCheckerDetail(result.detail)}</p>
                <p>
                  {certificate === "none"
                    ? t(
                        "No certificate yet? Ask Admissions to arrange English placement.",
                      )
                    : t(
                        "Your certificate must be valid and reviewed by KIMEP for English placement.",
                      )}
                </p>
                <a href="#documents">{t("Open the documents checklist →")}</a>
              </div>
            )}
          </div>
        </form>
        <aside>
          <div className="dark-panel">
            <ShieldCheck size={28} />
            <h2>{t("Guidance you can understand.")}</h2>
            <p>
              {t(
                "Meeting a score threshold is one part of applying. KIMEP makes the final admission decision.",
              )}
            </p>
            <ul>
              <li>{t("Checks all five UNT sections")}</li>
              <li>{t("Uses the selected program’s published thresholds")}</li>
              <li>{t("Points special cases to Admissions")}</li>
            </ul>
            <Source id="school" />
          </div>
          <Notice>
            {t(
              "This checker uses fixed rules. It does not assess scholarships, certificate validity, visa eligibility or admission approval.",
            )}
          </Notice>
        </aside>
      </div>
    </>
  );
}
function Program() {
  const { program, sources } = useContent();
  const selected = useSelectedProgram();
  return <>
    <Heading eyebrow={t("02 / EXPLORE YOUR PROGRAM")} title={t("Find your direction.")} description={t("Compare four majors, then follow one clear application path.")} />
    <div className="major-cards">
      {programIds.map(id => <button type="button" className={selected === id ? "major-card selected" : "major-card"} aria-pressed={selected === id} key={id} onClick={() => setSelectedProgram(id)}>
        <span className="badge">{programs[id].short} · {programs[id].code}</span>
        <h3>{t(programs[id].name)}</h3><p>{t(programs[id].description)}</p>
        <strong>{programs[id].unt}+ {t("UNT minimum")}</strong>
        <small>{programs[id].subjects.map(t).join(" + ")}</small>
      </button>)}
    </div>
    <div className="program-intro panel">
      <div><span className="badge">{program.short} · {program.code}</span><h2>{program.name}</h2><p>{program.school}</p><p>{program.description}</p><Source id="program" /></div>
      <div className="facts-grid"><div><b>{program.credits}</b><span>{t("KIMEP credits")}</span></div><div><b>{program.ects}</b><span>ECTS</span></div><div><b>{program.unt}+</b><span>{t("UNT · section rules apply")}</span></div></div>
    </div>
    <div className="panel"><h2>{t("What you will study")}</h2><div className="chips">{program.topics.map(topic => <span key={topic}>{topic}</span>)}</div><Source id="program" /></div>
    <div className="panel"><h2>{t("Where these skills can lead")}</h2><p>{t("Career examples depend on experience and employer requirements. A degree does not guarantee a job or professional licence.")}</p><div className="chips">{program.careers.map(career => <span key={career}>{career}</span>)}</div></div>
    {selected === "bis" && <Notice><strong>{t("A published difference to confirm:")}</strong>{t("the current school page lists 146 credits / 241 ECTS. The older Bang College page lists 146 / 240. We display the program’s current school page; ask the school which curriculum applies to your intake. Four years is the fee sheet’s example pathway, not a guaranteed duration.")} <a href={sources.legacy.url} target="_blank" rel="noreferrer">{t("Compare older source ↗")}</a></Notice>}
    {selected === "management" && <Notice>{t("Curriculum details use the 2025–2026 official catalog. Confirm the curriculum for your intake with the school. Admission thresholds use the 2026–2027 admissions guide.")}</Notice>}
    <div className="actions"><LinkButton to="#checker">{t("Check requirements")}</LinkButton><LinkButton to="#apply" secondary>{t("See application steps")}</LinkButton></div>
  </>;
}
function Requirements() {
  const {
    sources,
    program,
    verified,
    documents,
    steps,
    deadlines,
    fees,
    contacts,
    faq,
    englishLevels,
  } = useContent();
  return (
    <>
      <Heading
        eyebrow={t("03 / ADMISSION REQUIREMENTS")}
        title={t("What you need to apply.")}
        description={t(
          "The standard route below is for Kazakhstan high-school graduates applying to your selected program.",
        )}
      />
      <div className="two-column">
        <article className="panel">
          <span className="badge">{t("REQUIRED · STANDARD LOCAL ROUTE")}</span>
          <h2>{t("UNT: the total is only part of it.")}</h2>
          <div className="requirement-total">
            {program.unt}
            <span>{t("minimum overall")}</span>
          </div>
          <ul className="row-list">
            {program.sectionNames.map((x, i) => (
              <li key={x}>
                <span>{x}</span>
                <strong>
                  {program.sectionMinimums[i]} {t("minimum")}
                </strong>
              </li>
            ))}
          </ul>
          <p>
            <strong>{t("Profile subjects:")}</strong>
            {program.subjects.join(" + ")}
          </p>
          <Source id="school" />
        </article>
        <article className="panel">
          <span className="badge pale">
            {t("PLACEMENT · ENGLISH STUDY ROUTE")}
          </span>
          <h2>{t("Your English level sets your starting point.")}</h2>
          <p>
            {t(
              "A valid accepted certificate can replace KIMEP’s English placement test. IELTS is one option.",
            )}
          </p>
          <p>
            {t(
              "For example, the published IELTS Academic threshold for Academic English is 5.5 overall with at least 5.0 in every section.",
            )}
          </p>
          <p>
            {t(
              "Lower levels have Foundation / Provisional routes. Ask KIMEP which route applies to you.",
            )}
          </p>
          <a href="#english" className="text-link">
            {t("See English placement")}
            <ArrowRight size={15} />
          </a>
          <Source id="school" />
        </article>
      </div>
      <div className="three-grid topics">
        <article className="panel">
          <h3>{t("Education documents")}</h3>
          <p>
            {t(
              "Certificate and transcript copies, followed by the originals. Foreign education documents need recognition and notarized Kazakh or Russian translation.",
            )}
          </p>
          <Source id="school" />
        </article>
        <article className="panel">
          <h3>{t("Medical documents")}</h3>
          <p>
            {t(
              "Prepare the university’s medical package and submit it to the Medical Center before registration.",
            )}
          </p>
          <a href="#documents">{t("Open checklist →")}</a>
          <Source id="medical" />
        </article>
        <article className="panel">
          <h3>{t("Other applicant routes")}</h3>
          <p>
            {t(
              "International, vocational, transfer, IB, NIS and other special cases need route-specific review. Do not assume the standard checker covers you.",
            )}
          </p>
          <a href="#contacts">{t("Ask Admissions →")}</a>
          <Source id="school" />
        </article>
      </div>
    </>
  );
}
function Documents() {
  const {
    sources,
    program,
    verified,
    documents,
    steps,
    deadlines,
    fees,
    contacts,
    faq,
    englishLevels,
  } = useContent();
  const key = "kimep-pathway-checklist-v1";
  const [checked, setChecked] = useState<string[]>(() => {
    try {
      const v = JSON.parse(localStorage.getItem(key) || "[]");
      return Array.isArray(v)
        ? v.filter(
            (x: unknown) =>
              typeof x === "string" && documents.some((d) => d.id === x),
          )
        : [];
    } catch {
      return [];
    }
  });
  const [saved, setSaved] = useState(true);
  const [confirmReset, setConfirmReset] = useState(false);
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(checked));
      setSaved(true);
    } catch {
      setSaved(false);
    }
  }, [checked]);
  return (
    <>
      <Heading
        eyebrow={t("04 / GET ORGANIZED")}
        title={t("Your documents checklist.")}
        description={t(
          "For the standard Kazakhstan high-school route. No account, uploads or personal documents needed here.",
        )}
      />
      <div className="progress-panel">
        <div>
          <strong>
            {checked.length} {t("of")} {documents.length} {t("steps ready")}
          </strong>
          <span>
            {saved
              ? t("Progress saved in this browser")
              : t(
                  "Browser storage unavailable · progress lasts for this visit",
                )}
          </span>
        </div>
        <progress
          value={checked.length}
          max={documents.length}
          aria-label={t("Checklist progress")}
        />
        <button className="text-button" onClick={() => setConfirmReset(true)}>
          <RotateCcw size={14} />
          {t("Reset")}
        </button>
      </div>
      {confirmReset && (
        <div className="notice">
          <div>
            {t("Clear your checklist progress?")}{" "}
            <button
              className="text-button"
              onClick={() => {
                setChecked([]);
                setConfirmReset(false);
              }}
            >
              {t("Yes, clear it")}
            </button>
            <button
              className="text-button"
              onClick={() => setConfirmReset(false)}
            >
              {t("Keep progress")}
            </button>
          </div>
        </div>
      )}
      <Notice>
        {t(
          "International and transfer applicants need a different document list.",
        )}{" "}
        <a href="#contacts">{t("Contact Admissions")}</a>
        {t("before using this as your final checklist.")}
      </Notice>
      {[
        t("Before applying"),
        t("Online application"),
        t("After receiving your school certificate"),
        t("Medical documents"),
        t("Before enrollment"),
      ].map((stage, i) => (
        <section className="checklist-stage" key={stage}>
          <h2>
            <span className="step-number">
              {String(i + 1).padStart(2, "0")}
            </span>
            {stage}
          </h2>
          <div className="panel check-items">
            {documents
              .filter((d) => d.stage === stage)
              .map((d) => (
                <div
                  className={
                    "check-item " + (checked.includes(d.id) ? "done" : "")
                  }
                  key={d.id}
                >
                  <label>
                    <input
                      type="checkbox"
                      checked={checked.includes(d.id)}
                      onChange={(e) =>
                        setChecked(
                          e.target.checked
                            ? [...checked, d.id]
                            : checked.filter((x) => x !== d.id),
                        )
                      }
                    />
                    <span>
                      <strong>{d.title}</strong>
                      <small>{d.detail}</small>
                    </span>
                  </label>
                  <a
                    className="item-source"
                    href={sources[d.source].url}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={"Official source for " + d.title}
                  >
                    <ExternalLink size={15} />
                  </a>
                </div>
              ))}
          </div>
          {stage === t("Medical documents") && (
            <details className="medical-details">
              <summary>
                {t("See the medical checks and supporting certificates")}
              </summary>
              <p>
                {t(
                  "KIMEP lists therapist, eye doctor, ENT, surgeon and neurologist checks, plus fluorography, microreaction and a stool test for helminth eggs. Narcology and psycho-neurology certificates are listed as supporting records for obtaining Form 075/u and can be requested through eGov.",
                )}
              </p>
              <p>
                {t(
                  "The admissions PDF has a misplaced neurologist entry; the medical page lists it clearly. Confirm the exact package with the center before arranging tests.",
                )}
              </p>
              <Source id="medical" />
            </details>
          )}
        </section>
      ))}
      <p className="muted small">
        {t(
          "Ticking a box records your own progress. It does not verify a document or submit it to KIMEP. Clear browser data or use another device and this progress will not be available.",
        )}
      </p>
      <Source id="admission" />
    </>
  );
}
function Apply() {
  const {
    sources,
    program,
    verified,
    documents,
    steps,
    deadlines,
    fees,
    contacts,
    faq,
    englishLevels,
  } = useContent();
  return (
    <>
      <Heading
        eyebrow={t("05 / ONE STEP AT A TIME")}
        title={t("From application to registration.")}
        description={t(
          "Start early. Add documents as they become available, and keep checking your email.",
        )}
      />
      <div className="timeline">
        {steps.map((s, i) => (
          <article key={s.title}>
            <span className="timeline-number">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div>
              <h2>{s.title}</h2>
              <p>{s.detail}</p>
              <Source id={s.source} />
            </div>
          </article>
        ))}
      </div>
      <Notice>
        <strong>{t("Under 18?")}</strong>
        {t(
          "The current guide says a parent or legal guardian must also sign your agreement. The PDF asks for a signed upload, while the web page mentions two paper copies. Follow the portal instructions and ask Admissions to confirm whether both are needed.",
        )}
      </Notice>
      <LinkButton to={sources.portal.url}>
        {t("Open the official Applicant Portal")}
      </LinkButton>
    </>
  );
}
function English() {
  const {
    sources,
    program,
    verified,
    documents,
    steps,
    deadlines,
    fees,
    contacts,
    faq,
    englishLevels,
  } = useContent();
  const [test, setTest] = useState("ielts");
  return (
    <>
      <Heading
        eyebrow={t("06 / FIND YOUR STARTING LEVEL")}
        title={t("Do I need IELTS?")}
        description={t(
          "IELTS is one way to show your English level. It is not the only way to apply.",
        )}
      />
      <div className="two-column">
        <article className="dark-panel">
          <Globe2 size={30} />
          <h2>
            {t("No certificate yet?")}
            <br />
            {t("You still have a next step.")}
          </h2>
          <p>
            {t(
              "Complete your application and upload your ID, then arrange KIMEP English placement through Admissions.",
            )}
          </p>
          <a
            href={sources.tests.url}
            className="light-link"
            target="_blank"
            rel="noreferrer"
          >
            {t("View official test information")}
            <ArrowUpRight size={15} />
          </a>
          <Source id="school" />
        </article>
        <article className="panel">
          <h2>{t("What does placement mean?")}</h2>
          <p>
            {t(
              "Placement decides which English courses you start with. It is separate from checking your UNT results.",
            )}
          </p>
          <p>
            {t(
              "The table includes Academic English and Foundation / Provisional levels. A lower level can mean extra English study, time and fees.",
            )}
          </p>
          <p>
            {t("Final placement and certificate acceptance belong to KIMEP.")}
          </p>
          <Source id="school" />
        </article>
      </div>
      <section>
        <div className="section-heading">
          <div>
            <div className="eyebrow">{t("PUBLISHED PLACEMENT TABLE")}</div>
            <h2>{t("Compare your certificate.")}</h2>
          </div>
          <label className="test-select">
            {t("Certificate")}
            <select value={test} onChange={(e) => setTest(e.target.value)}>
              <option value="ielts">IELTS Academic</option>
              <option value="pte">PTE Academic</option>
              <option value="cambridge">Cambridge FCE / B2 First</option>
              <option value="languageCert">LanguageCert Academic</option>
              <option value="duolingo">
                {t("Duolingo · confirm unclear bands")}
              </option>
              <option value="toefl">{t("TOEFL iBT · legacy scale")}</option>
            </select>
          </label>
        </div>
        {test === "toefl" && (
          <Notice>
            <strong>{t("Legacy scale only.")}</strong>
            {t(
              "KIMEP’s table still displays the old TOEFL scale and says the 1–6 values will be updated. Do not convert or use these values for a new-format result. Ask Admissions for current thresholds and section rules.",
            )}
          </Notice>
        )}
        {test === "duolingo" && (
          <Notice>
            <strong>{t("The official table needs clarification.")}</strong>
            {t(
              "Its A and B bands overlap, and the B row gives a section minimum that does not fit part of its overall range. These values are reproduced for transparency and are not used for automatic placement.",
            )}
          </Notice>
        )}
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>{t("Starting level")}</th>
                <th>CEFR</th>
                <th>
                  {test === "ielts"
                    ? "IELTS Academic"
                    : test === "toefl"
                      ? t("Legacy TOEFL iBT overall")
                      : test === "duolingo"
                        ? "Duolingo"
                        : test === "pte"
                          ? "PTE Academic"
                          : test === "cambridge"
                            ? "Cambridge FCE"
                            : "LanguageCert Academic"}
                </th>
              </tr>
            </thead>
            <tbody>
              {englishLevels.map((l) => (
                <tr key={l.name}>
                  <td>
                    <strong>{l.name}</strong>
                  </td>
                  <td>{l.cefr}</td>
                  <td>
                    {
                      l[
                        test as
                          | "ielts"
                          | "toefl"
                          | "duolingo"
                          | "pte"
                          | "cambridge"
                          | "languageCert"
                      ]
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {test === "toefl" && (
          <p className="small muted">
            {t(
              "The official table also lists legacy section bands. Open the source for those bands; this overview cannot determine TOEFL eligibility.",
            )}
          </p>
        )}
        <p className="small muted">
          {t(
            "CEFR is a framework for language levels. UF means Undergraduate Foundation. A score is not an admission decision.",
          )}
        </p>
        <Source id="school" />
      </section>
    </>
  );
}
function Tuition() {
  const {
    sources,
    program,
    verified,
    documents,
    steps,
    deadlines,
    fees,
    contacts,
    faq,
    englishLevels,
  } = useContent();
  const [credits, setCredits] = useState("30");
  const n = Number(credits);
  const valid =
    credits.trim() !== "" && Number.isInteger(n) && n >= 1 && n <= 60;
  return (
    <>
      <Heading
        eyebrow={t("07 / PLAN YOUR BUDGET")}
        title={t("Understand the cost.")}
        description={t(
          "Published undergraduate prices for 2026–2027. These are not a quote for 2027–2028.",
        )}
      />
      <div className="two-column">
        <article className="dark-panel">
          <span className="eyebrow">{t("TUITION PER KIMEP CREDIT")}</span>
          <div className="price">
            {currency(fees[0].amount)} <small>KZT</small>
          </div>
          <p>{t("You pay for the number of credits you take.")}</p>
          <label>
            {t("Credits to estimate")}
            <input
              type="number"
              min="1"
              max="60"
              step="1"
              value={credits}
              onChange={(e) => setCredits(e.target.value)}
            />
          </label>
          <div aria-live="polite" className="estimate">
            {valid ? (
              <>
                <strong>{currency(n * fees[0].amount)} KZT</strong>
                <span>
                  {t("Tuition only ·")}
                  {n}
                  {t("credits ×")}
                  {currency(fees[0].amount)}
                </span>
              </>
            ) : (
              <span>{t("Enter a whole number from 1 to 60.")}</span>
            )}
          </div>
          <p className="small">
            {t(
              "An estimate at the published rate. Fees, housing, English preparation and future price changes are separate. Course load depends on your plan.",
            )}
          </p>
          <Source id="fees" />
        </article>
        <article className="panel">
          <span className="badge pale">{t("PUBLISHED YEARLY EXAMPLE")}</span>
          <h2>{t("30–36 credits")}</h2>
          <p className="cost-range">4,896,900–5,876,280 KZT</p>
          <p>
            {t(
              "Tuition for one year at the 2026–2027 rate, before other charges.",
            )}
          </p>
          <p>
            {t(
              "The fee sheet uses a four-year, 146-credit pathway as an example. Study length and your bill depend on your course plan and English placement.",
            )}
          </p>
          <Notice>
            {t(
              "Fees can change in later years. Confirm payment terms and your final amount with KIMEP.",
            )}
          </Notice>
          <Source id="feesKz" />
        </article>
      </div>
      <section>
        <h2>{t("Other fees and deposits")}</h2>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>{t("Item")}</th>
                <th>{t("Amount, KZT")}</th>
                <th>{t("When it applies")}</th>
              </tr>
            </thead>
            <tbody>
              {fees.slice(1).map((f) => (
                <tr key={f.name}>
                  <td>
                    <strong>{f.name}</strong>
                    <small className="cell-sub">{f.kind}</small>
                  </td>
                  <td>{currency(f.amount)}</td>
                  <td>{f.unit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="small muted">
          {t(
            "Deposits are shown separately from tuition. Ask the relevant office about collection, carry-over and refund conditions.",
          )}
        </p>
        <Source id="fees" />
      </section>
      <section className="aid-panel">
        <div>
          <div className="eyebrow">{t("FINANCIAL AID")}</div>
          <h2>{t("Explore support early.")}</h2>
          <p>
            {t(
              "Scholarships have their own applications, eligibility rules and deadlines. Admission does not guarantee funding. Many 2026 offers are already past their deadline; confirm availability for your intake.",
            )}
          </p>
          <LinkButton to={sources.aid.url} secondary>
            {t("View official scholarship opportunities")}
          </LinkButton>
        </div>
        <div>
          <h3>{t("Financial Aid Office")}</h3>
          <a href="mailto:finaid@kimep.kz">finaid@kimep.kz</a>
          <p>
            +7 727 270 43 16
            <br />
            {t("Mobile / WhatsApp: +7 707 970 43 16")}
          </p>
          <Source id="aid" />
        </div>
      </section>
    </>
  );
}
function Deadlines() {
  const {
    sources,
    program,
    verified,
    documents,
    steps,
    deadlines,
    fees,
    contacts,
    faq,
    englishLevels,
  } = useContent();
  const [filter, setFilter] = useState("All");
  const shown = deadlines.filter(
    (d) => filter === "All" || d.intake.startsWith(t(filter)),
  );
  return (
    <>
      <Heading
        eyebrow={t("08 / SAVE THE DATES")}
        title={t("Plan around your intake.")}
        description={t(
          "Dates depend on your applicant category. The latest published schedule includes 2027 intakes.",
        )}
      />
      <div className="filter-tabs" aria-label={t("Filter deadlines")}>
        {["All", "Fall", "Spring", "Summer"].map((x) => (
          <button
            key={x}
            aria-pressed={filter === x}
            className={filter === x ? "active" : ""}
            onClick={() => setFilter(x)}
          >
            {x === "All" ? t("All intakes") : t(x) + " 2027"}
          </button>
        ))}
      </div>
      <div className="deadline-grid">
        {shown.map((d) => (
          <article className="panel deadline-card" key={d.category + d.intake}>
            <span className="badge">{d.intake}</span>
            <p className="small muted">{d.category}</p>
            <div className="eyebrow">{t("APPLICATION DEADLINE")}</div>
            <h2>{date(d.end)}</h2>
            <dl>
              <div>
                <dt>{t("Applications open")}</dt>
                <dd>{date(d.start)}</dd>
              </div>
              <div>
                <dt>{t("Enrollment period")}</dt>
                <dd>{d.enrollment}</dd>
              </div>
              <div>
                <dt>{t("Classes start")}</dt>
                <dd>{d.classes}</dd>
              </div>
            </dl>
            <Source id="deadlines" />
          </article>
        ))}
      </div>
      <Notice>
        <strong>{t("Two different opening dates are published.")}</strong>
        {t(
          "The 2026–2027 brochure says applications open each year on 15 October; the live 2027 schedule gives 16 October 2026. We use the intake-specific schedule above. These are not scholarship deadlines. Source page update date is not shown; last verified",
        )}
        {verified}.
      </Notice>
    </>
  );
}
function FAQ() {
  const {
    sources,
    program,
    verified,
    documents,
    steps,
    deadlines,
    fees,
    contacts,
    faq,
    englishLevels,
  } = useContent();
  const [query, setQuery] = useState("");
  const shown = faq.filter((f) =>
    (f.q + " " + f.a).toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <>
      <Heading
        eyebrow={t("09 / STRAIGHTFORWARD ANSWERS")}
        title={t("Questions? Start here.")}
        description={t(
          "Short, predefined answers based on official information. Search by a word such as IELTS, UNT or medical.",
        )}
      />
      <div className="search-field">
        <Search size={20} />
        <input
          aria-label={t("Search common questions")}
          placeholder={t("Search your question…")}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {query && (
          <button aria-label={t("Clear search")} onClick={() => setQuery("")}>
            <X size={18} />
          </button>
        )}
      </div>
      <p className="small muted" aria-live="polite">
        {shown.length} {shown.length === 1 ? t("answer") : t("answers")}
      </p>
      <div className="faq-list">
        {shown.map((f) => (
          <details key={f.q}>
            <summary>{f.q}</summary>
            <p>{f.a}</p>
            <Source id={f.source} />
          </details>
        ))}
      </div>
      {!shown.length && (
        <div className="empty-state">
          <CircleHelp size={32} />
          <h2>{t("No matching questions yet.")}</h2>
          <p>{t("Try a shorter word, or ask KIMEP Admissions directly.")}</p>
          <a href="#contacts">{t("Find the right contact →")}</a>
        </div>
      )}
    </>
  );
}
function Contacts() {
  const {
    sources,
    program,
    verified,
    documents,
    steps,
    deadlines,
    fees,
    contacts,
    faq,
    englishLevels,
  } = useContent();
  return (
    <>
      <Heading
        eyebrow={t("10 / THE RIGHT PEOPLE")}
        title={t("Get help from KIMEP.")}
        description={t(
          "Use the office that handles your question. This independent guide cannot make admissions decisions.",
        )}
      />
      <div className="two-column">
        {contacts.map((c) => (
          <article className="panel contact-card" key={c.name}>
            <div className="contact-icon">
              <Mail size={23} />
            </div>
            <h2>{c.name}</h2>
            <p>{c.for}</p>
            <a href={"mailto:" + c.email}>
              {c.email}
              <ArrowUpRight size={16} />
            </a>
            <a href={"tel:" + c.phone.replaceAll(" ", "")}>
              <Phone size={14} />
              {c.phone}
            </a>
            <p className="small muted">
              {t("Mobile / WhatsApp:")}
              {c.mobile}
            </p>
            <Source id={c.source} />
          </article>
        ))}
      </div>
      <section className="panel">
        <h2>{t("Official links")}</h2>
        <div className="official-links">
          {(
            [
              "portal",
              "contacts",
              "program",
              "deadlines",
              "tests",
              "aid",
              "medical",
              "transfer",
              "international",
            ] as SourceKey[]
          ).map((k) => (
            <a key={k} href={sources[k].url} target="_blank" rel="noreferrer">
              {sources[k].title}
              <ArrowUpRight size={17} />
            </a>
          ))}
          <a href="https://www.kimep.kz/" target="_blank" rel="noreferrer">
            {t("KIMEP University website")}
            <ArrowUpRight size={17} />
          </a>
        </div>
        <p className="small muted">
          {t(
            "Admissions: 4 Abai Avenue, Valikhanov building, Almaty 050010. Some English links redirect to Kazakh pages; use the language selector on the official website.",
          )}
        </p>
      </section>
      <section className="panel">
        <h2>{t("About this project")}</h2>
        <p>
          {t(
            "A student university project covering four majors with a shared admissions guide. It is not an official KIMEP service.",
          )}
        </p>
        <p>
          {t(
            "No account is needed. Checker answers stay in memory; document checklist progress is stored only in your browser. The site has no application submission or live AI chatbot. The assistant demo uses predefined sample questions and answers.",
          )}
        </p>
        <p className="small muted">
          {t("Verified on")}
          {verified}
          {t(". Requirements can change after this date.")}
        </p>
      </section>
    </>
  );
}
const pages: Record<Page, () => React.JSX.Element> = {
  home: Overview,
  checker: Checker,
  program: Program,
  requirements: Requirements,
  documents: Documents,
  apply: Apply,
  english: English,
  tuition: Tuition,
  deadlines: Deadlines,
  faq: FAQ,
  contacts: Contacts,
};
function getPage(): Page {
  const p = location.hash.slice(1);
  return Object.hasOwn(pages, p) ? (p as Page) : "home";
}
function ProgramSelector() {
  const selected = useSelectedProgram();
  return <section className="program-selector" aria-label={t("Your program")}>
    <label>{t("Your program")}<select value={selected} onChange={e => setSelectedProgram(e.target.value)}>{programIds.map(id => <option key={id} value={id}>{t(programs[id].name)}</option>)}</select></label>
    <p>{t("Your choice updates the overview, requirements, checker and assistant.")} <a href="#program">{t("Compare majors →")}</a></p>
  </section>;
}
function App() {
  const language = useLanguage();
  const { sources } = useContent();
  const [page, setPage] = useState<Page>(getPage);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const f = () => {
      setPage(getPage());
      setOpen(false);
      window.scrollTo(0, 0);
    };
    window.addEventListener("hashchange", f);
    return () => window.removeEventListener("hashchange", f);
  }, []);
  useEffect(() => {
    document.title =
      t(navigation.find((x) => x[0] === page)?.[1] || "Overview") +
      " · KIMEP Pathway";
    document.getElementById("main")?.focus({ preventScroll: true });
  }, [page, language]);
  const Content = pages[page];
  return (
    <>
      <a
        href="#main"
        className="skip-link"
        onClick={(e) => {
          e.preventDefault();
          document.getElementById("main")?.focus();
        }}
      >
        {t("Skip to content")}
      </a>
      <aside className={"sidebar " + (open ? "is-open" : "")}>
        <a className="brand" href="#home">
          <span>
            KIMEP <b>Pathway</b>
            <small>{t("Independent admissions guide")}</small>
          </span>
        </a>
        <div className="sidebar-caption">{t("Explore the guide")}</div>
        <nav aria-label={t("Main navigation")}>
          {navigation.map(([id, label, Icon]) => (
            <a
              key={id}
              className={page === id ? "active" : ""}
              aria-current={page === id ? "page" : undefined}
              href={"#" + id}
            >
              <Icon size={18} />
              <span>{t(label)}</span>
              {page === id && (
                <ChevronRight className="nav-chevron" size={15} />
              )}
            </a>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <p>
            {t("Based on official KIMEP sources.")}
            <br />
            {t("Independent student project.")}
          </p>
          <a href={sources.portal.url} target="_blank" rel="noreferrer">
            {t("Apply at KIMEP")}
            <ArrowUpRight size={16} />
          </a>
        </div>
      </aside>
      {open && (
        <button
          className="mobile-shade"
          aria-label={t("Close navigation")}
          onClick={() => setOpen(false)}
        />
      )}
      <div className="site-shell">
        <header className="topbar">
          <button
            className="menu-button"
            aria-label={open ? t("Close menu") : t("Open menu")}
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
          <div className="breadcrumb">
            {t("ADMISSIONS")}
            <ChevronRight size={12} />
            <span>
              {t(navigation.find((x) => x[0] === page)?.[1] || "Overview")}
            </span>
          </div>
          <div className="topbar-right">
            <label className="language-switch">
              <span className="sr-only">{t("Language")}</span>
              <select
                aria-label={t("Language")}
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
              >
                <option value="en">EN · English</option>
                <option value="ru">RU · Русский</option>
                <option value="kk">KZ · Қазақша</option>
              </select>
            </label>
            <a href={sources.portal.url} target="_blank" rel="noreferrer">
              {t("Apply at KIMEP")}
              <ArrowUpRight size={14} />
            </a>
          </div>
        </header>
        <main id="main" tabIndex={-1}>
          <ProgramSelector />
          <Content />
        </main>
        <footer>
          <div>
            <GraduationCap size={20} />
            <span>
              <strong>KIMEP Pathway</strong>
              <br />
              {t(
                "Independent student project. Always confirm final requirements with KIMEP University.",
              )}
            </span>
          </div>
          <a href="#contacts">
            {t("Sources & contacts")}
            <ArrowUpRight size={14} />
          </a>
        </footer>
      </div>
      <AssistantDemo />
    </>
  );
}

createRoot(document.getElementById("root")!).render(<App />);

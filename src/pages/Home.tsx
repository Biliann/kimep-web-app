import { Calculator, ChevronRight, ClipboardCheck, ExternalLink, FileText } from "lucide-react";
import { getLanguage, useContent, useT } from "../i18n";
import { fmtDate, kzt } from "../format";
import { href } from "../router";
import { ProgramPicker } from "../components/ui";
import { tuitionRules } from "../data";

export default function Home() {
  const t = useT();
  const { program, deadlines, sources } = useContent();
  const portal = getLanguage() === "kk" ? sources.portal.url.replace("en-US", "kk-KZ") : sources.portal.url;
  const facts: [string, string][] = [
    [t("UNT minimum"), program.creative ? t("Creative exams") : `${program.unt} / 140`],
    [t("Profile subjects"), program.creative ? "—" : program.subjects.join(" + ")],
    [t("Tuition per credit"), kzt(tuitionRules.perCredit)],
    [t("Apply by (Fall 2027)"), fmtDate(deadlines[0].end)],
  ];
  const actions = [
    { to: href("scores", "checker"), Icon: ClipboardCheck, title: t("Do my scores qualify?"), sub: t("Check your UNT points") },
    { to: href("cost"), Icon: Calculator, title: t("How much will it cost?"), sub: t("Tuition, fees, housing") },
    { to: href("docs"), Icon: FileText, title: t("Which documents, and by when?"), sub: t("Checklist and deadlines") },
  ];
  return (
    <div className="page">
      <section className="hero">
        <div className="hero-top rise" style={{ ["--i" as string]: 0 }}>
          <img src="/kimep-logo.png" alt="KIMEP University" width="54" height="72" />
          <h1>{t("Your way into KIMEP")}</h1>
        </div>
        <p className="lead rise" style={{ ["--i" as string]: 1 }}>{t("Scores, costs, documents and dates for bachelor applicants, in one place.")}</p>
        <div className="rise" style={{ ["--i" as string]: 2 }}><ProgramPicker /></div>
      </section>
      <section aria-label={t("Key numbers")} className="facts rise" style={{ ["--i" as string]: 3 }}>
        {facts.map(([k, v]) => (<div className="fact" key={k}><b>{v}</b><span>{k}</span></div>))}
      </section>
      <section className="actions" aria-label={t("What do you want to know?")}>
        {actions.map(({ to, Icon, title, sub }, i) => (
          <a className="action rise" style={{ ["--i" as string]: 4 + i }} href={to} key={to}>
            <span className="ic"><Icon aria-hidden="true" /></span>
            <span><b>{title}</b><small>{sub}</small></span>
            <ChevronRight aria-hidden="true" />
          </a>
        ))}
        <a className="action rise" style={{ ["--i" as string]: 7 }} href={portal} target="_blank" rel="noreferrer">
          <span className="ic"><ExternalLink aria-hidden="true" /></span>
          <span><b>{t("Where do I apply?")}</b><small>{t("Official KIMEP Applicant Portal")}</small></span>
          <ChevronRight aria-hidden="true" />
        </a>
      </section>
      <p className="footer">{t("Independent student project, not an official KIMEP service. Only KIMEP makes admission decisions.")}</p>
    </div>
  );
}

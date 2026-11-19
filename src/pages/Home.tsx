import { ChevronRight } from "lucide-react";
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
    [t("Tuition per credit"), kzt(tuitionRules.perCredit)],
    [t("Apply by (Fall 2027)"), fmtDate(deadlines[0].end)],
  ];
  const actions = [
    { to: href("scores", "checker"), title: t("Do my scores qualify?") },
    { to: href("cost"), title: t("How much will it cost?") },
    { to: href("docs"), title: t("Which documents, and by when?") },
  ];
  return (
    <>
      <section className="band hero">
        <div className="wrap">
          <h1>{t("Your way into KIMEP")}</h1>
          <p className="lead">{t("Scores, costs, documents and dates for bachelor applicants, in one place.")}</p>
          <ProgramPicker />
        </div>
      </section>
      <div className="page">
        <section aria-label={t("Key numbers")} className="facts">
          {facts.map(([k, v]) => (<div className="fact" key={k}><b>{v}</b><span>{k}</span></div>))}
        </section>
        <section className="actions" aria-label={t("What do you want to know?")}>
          {actions.map(({ to, title }) => (
            <a className="action" href={to} key={to}><b>{title}</b><ChevronRight aria-hidden="true" /></a>
          ))}
          <a className="action" href={portal} target="_blank" rel="noreferrer"><b>{t("Where do I apply?")}</b><ChevronRight aria-hidden="true" /></a>
        </section>
      </div>
    </>
  );
}

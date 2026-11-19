import { Calculator, CircleHelp, ClipboardCheck, FileText, House } from "lucide-react";
import { setLanguage, useLanguage, useT, type Language } from "../i18n";
import { href, type Page, type Route } from "../router";

const items: { page: Page; label: string; Icon: typeof House }[] = [
  { page: "home", label: "Home", Icon: House },
  { page: "scores", label: "UNT scores", Icon: ClipboardCheck },
  { page: "cost", label: "Cost", Icon: Calculator },
  { page: "docs", label: "Documents & dates", Icon: FileText },
  { page: "faq", label: "Questions", Icon: CircleHelp },
];
const shortLabel: Record<Page, string> = { home: "Home", scores: "UNT", cost: "Cost", docs: "Documents", faq: "Questions" };

export function Header({ route }: { route: Route }) {
  const t = useT();
  const lang = useLanguage();
  return (
    <header className="header">
      <div className="header-in">
        <a className="brand" href={href("home")} aria-label={t("KIMEP Pathway, home")}>
          <img src="/kimep-logo.png" alt="" width="27" height="36" />
          <span>Pathway</span>
        </a>
        <nav className="nav" aria-label={t("Main navigation")}>
          {items.map(({ page, label }) => (
            <a key={page} href={href(page)} aria-current={route.page === page ? "page" : undefined}>{t(label)}</a>
          ))}
        </nav>
        <div className="lang" role="group" aria-label={t("Language")}>
          {(["ru", "kk", "en"] as Language[]).map((l) => (
            <button key={l} type="button" aria-pressed={lang === l} lang={l} onClick={() => setLanguage(l)}>{l === "kk" ? "ҚАЗ" : l.toUpperCase()}</button>
          ))}
        </div>
      </div>
    </header>
  );
}

export function TabBar({ route }: { route: Route }) {
  const t = useT();
  return (
    <nav className="tabbar" aria-label={t("Main navigation")}>
      {items.map(({ page, Icon }) => (
        <a key={page} href={href(page)} aria-current={route.page === page ? "page" : undefined}>
          <Icon aria-hidden="true" />
          <span>{t(shortLabel[page])}</span>
        </a>
      ))}
    </nav>
  );
}

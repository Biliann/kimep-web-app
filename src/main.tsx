import "@fontsource-variable/roboto";
import { lazy, StrictMode, Suspense, useEffect } from "react";
import { createRoot } from "react-dom/client";
import "./style.css";
import { useLanguage, useT } from "./i18n";
import { useRoute } from "./router";
import { Footer, Header, TabBar } from "./components/Shell";
import Home from "./pages/Home";
import Scores from "./pages/Scores";
import Cost from "./pages/Cost";
import Docs from "./pages/Docs";
import Faq from "./pages/Faq";

const Assistant = lazy(() => import("./Assistant"));
const views = { home: Home, scores: Scores, cost: Cost, docs: Docs, faq: Faq };

function App() {
  useLanguage();
  const t = useT();
  const route = useRoute();
  const View = views[route.page];
  useEffect(() => {
    // after navigation: jump to the requested section, or to the top of the new page
    const el = route.section ? document.getElementById(route.section) : null;
    if (el) el.scrollIntoView({ block: "start" });
    else window.scrollTo(0, 0);
  }, [route.page, route.section]);
  useEffect(() => { document.title = "KIMEP Pathway · " + t("Admissions made clearer"); }, [t]);
  return (
    <>
      <a className="skip" href="#main">{t("Skip to content")}</a>
      <Header route={route} />
      <main id="main"><View /></main>
      <Footer />
      <TabBar route={route} />
      <Suspense fallback={null}><Assistant /></Suspense>
    </>
  );
}
createRoot(document.getElementById("root")!).render(<StrictMode><App /></StrictMode>);

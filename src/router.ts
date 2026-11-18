import { useEffect, useState } from "react";

export const pages = ["home", "scores", "cost", "docs", "faq"] as const;
export type Page = (typeof pages)[number];

// Old hash links keep working: they redirect into the five new sections.
const legacy: Record<string, string> = {
  overview: "home", program: "home",
  checker: "scores/checker", requirements: "scores/requirements", english: "scores/english",
  tuition: "cost", fees: "cost",
  documents: "docs", apply: "docs/steps", deadlines: "docs/deadlines",
  contacts: "faq/contacts",
};
export type Route = { page: Page; section: string };
export function parseHash(hash: string): Route {
  let raw = hash.replace(/^#\/?/, "");
  if (Object.hasOwn(legacy, raw.split("/")[0])) raw = legacy[raw.split("/")[0]];
  const [p, section = ""] = raw.split("/");
  return { page: (pages as readonly string[]).includes(p) ? (p as Page) : "home", section };
}
export function href(page: Page, section = "") { return "#" + page + (section ? "/" + section : ""); }
export function useRoute(): Route {
  const [route, setRoute] = useState<Route>(() => parseHash(location.hash));
  useEffect(() => {
    // normalise legacy links in the address bar
    const fix = () => {
      const r = parseHash(location.hash);
      const want = href(r.page, r.section);
      if (location.hash && location.hash !== want && !location.hash.startsWith("#" + r.page)) history.replaceState(null, "", want);
      setRoute(r);
    };
    fix();
    window.addEventListener("hashchange", fix);
    return () => window.removeEventListener("hashchange", fix);
  }, []);
  return route;
}
export function go(page: Page, section = "") { location.hash = href(page, section); }

import { getLanguage, t } from "./i18n";
export const num = (n: number) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
export const kzt = (n: number) => num(n) + " KZT";
const monthsEn = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
/** ISO date (YYYY-MM-DD) in the active language. */
export function fmtDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  const lang = getLanguage();
  const month = t(monthsEn[m - 1]);
  if (lang === "en") return `${d} ${monthsEn[m - 1]} ${y}`;
  return lang === "kk" ? `${y} жылғы ${d} ${month}` : `${d} ${month} ${y}`;
}

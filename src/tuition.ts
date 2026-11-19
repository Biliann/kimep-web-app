import { fees, tuitionRules } from "./data.ts";

// Pure tuition model. Every rate comes from src/data.ts (2026–2027 price list).
const rate = (name: string): number => {
  const row = fees.find((f) => f.name === name);
  if (!row) throw new Error("Missing fee: " + name);
  return row.amount;
};
export const rates = {
  perCredit: tuitionRules.perCredit,
  activityPerSemester: rate("Student activity fee"),
  medicalPerYear: rate("Medical examination fee"),
  textbookDepositPerYear: rate("Textbook security deposit"),
  bedPerMonth: rate("Residence hall bed"),
  dormDepositPerSemester: rate("Residence hall security deposit"),
  foundationPerLevel: rate("Foundation English"),
};

export type TuitionInput = {
  /** Credits taken in each semester (recommended 15–18). */
  creditsPerSemester: number;
  /** Number of semesters to price when totalCredits is not given. */
  semesters?: number;
  /** Price the whole program: tuition = totalCredits × rate, semesters = ceil(total / perSemester). */
  totalCredits?: number;
  /** Share of tuition covered by a grant, 0–100. A grant covers tuition only. */
  scholarshipPercent?: number;
  /** Live in the residence hall. */
  dormitory?: boolean;
  /** Months of residence per academic year. */
  dormMonthsPerYear?: number;
  /** Foundation English levels assigned, 0–3. Paid once, before the academic program. */
  foundationLevels?: number;
};
export type Line = { id: string; amount: number; group: "tuition" | "fees" | "deposits" | "housing" | "foundation" };
export type Breakdown = {
  semesters: number;
  credits: number;
  lines: Line[];
  grant: number;
  tuitionAfterGrant: number;
  fees: number;
  deposits: number;
  housing: number;
  foundation: number;
  total: number;
};

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));
const int = (n: unknown, fallback: number) => (Number.isFinite(Number(n)) ? Math.round(Number(n)) : fallback);

function priceSemesters(input: TuitionInput, semesters: number, credits: number): Breakdown {
  const years = Math.ceil(semesters / 2);
  const pct = clamp(int(input.scholarshipPercent, 0), 0, 100);
  const levels = clamp(int(input.foundationLevels, 0), 0, 3);
  const months = input.dormitory ? clamp(int(input.dormMonthsPerYear, 0), 0, 12) : 0;
  const tuition = credits * rates.perCredit;
  const grant = Math.round((tuition * pct) / 100);
  const lines: Line[] = [
    { id: "tuition", amount: tuition, group: "tuition" },
    { id: "activity", amount: rates.activityPerSemester * semesters, group: "fees" },
    { id: "medical", amount: rates.medicalPerYear * years, group: "fees" },
    { id: "textbookDeposit", amount: rates.textbookDepositPerYear * years, group: "deposits" },
  ];
  if (input.dormitory) {
    lines.push({ id: "bed", amount: rates.bedPerMonth * months * years, group: "housing" });
    lines.push({ id: "dormDeposit", amount: rates.dormDepositPerSemester * semesters, group: "deposits" });
  }
  if (levels > 0) lines.push({ id: "foundation", amount: rates.foundationPerLevel * levels, group: "foundation" });
  const sum = (g: Line["group"]) => lines.filter((l) => l.group === g).reduce((a, l) => a + l.amount, 0);
  const tuitionAfterGrant = tuition - grant;
  const f = sum("fees"), d = sum("deposits"), h = sum("housing"), fo = sum("foundation");
  return { semesters, credits, lines, grant, tuitionAfterGrant, fees: f, deposits: d, housing: h, foundation: fo, total: tuitionAfterGrant + f + d + h + fo };
}

export function calculateTuition(input: TuitionInput) {
  const perSemester = clamp(int(input.creditsPerSemester, 15), 1, 40);
  const full = input.totalCredits && input.totalCredits > 0 ? Math.round(input.totalCredits) : 0;
  const programSemesters = full ? Math.ceil(full / perSemester) : clamp(int(input.semesters, 8), 1, 16);
  const programCredits = full || perSemester * programSemesters;
  return {
    semester: priceSemesters(input, 1, perSemester),
    year: priceSemesters(input, 2, perSemester * 2),
    program: priceSemesters(input, programSemesters, programCredits),
  };
}

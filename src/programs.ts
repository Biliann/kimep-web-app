import { program as bis, sources, type SourceKey } from "./data.ts";

// Every row below comes from the official high-school requirements page and the
// 2026–2027 admission guide. Credits and ECTS are filled only where an official
// program page states them; otherwise they stay undefined and the UI says "ask".
const common = ["Reading Literacy", "Mathematical Literacy", "History of Kazakhstan"];
export const sectionMaximums = [10, 10, 20, 50, 50];
const standardMinimums = [3, 3, 5, 5, 5];
const rules = "https://www.kimep.kz/prospective-students/kz/admission/high-school-graduates/";

type Row = {
  id: string;
  code: string;
  name: string;
  short: string;
  unt: number | null;
  subjects: string[];
  subjectKey: string;
  minimums?: number[];
  url?: string;
  source?: SourceKey;
  school?: string;
  note?: string;
  description?: string;
  topics?: string[];
  careers?: string[];
};

const rows: Row[] = [
  { id: "bis", code: bis.code, name: bis.name, short: bis.short, unt: 50, subjects: ["Mathematics", "Informatics"], subjectKey: "math-informatics", url: sources.program.url, school: bis.school,
    description: "Build software, organize data and connect technology with business needs.", topics: ["Software and databases", "Data analysis", "IT project management"], careers: ["Software developer", "Systems analyst", "Data / BI analyst"] },
  { id: "cs", code: "6B06102", name: "Bachelor of Computer Science", short: "BSCS", unt: 50, subjects: ["Mathematics", "Informatics"], subjectKey: "math-informatics", note: "All Computer Science students take a math placement test." },
  { id: "economics", code: "6B04106", name: "Bachelor of Economics", short: "BAE", unt: 50, subjects: ["Geography", "Mathematics"], subjectKey: "geography-math" },
  { id: "finance", code: "6B04105", name: "Bachelor of Finance", short: "BFIN", unt: 50, subjects: ["Geography", "Mathematics"], subjectKey: "geography-math", school: "Bang College of Business", url: "https://www.kimep.kz/bang-college-of-business/kz/bachelor-of-finance/",
    description: "Study how businesses raise capital, evaluate investments and manage financial risk.", topics: ["Corporate finance", "Investments", "Financial markets and risk"], careers: ["Financial analyst", "Investment analyst", "Risk analyst"] },
  { id: "management", code: "6B04103", name: "Bachelor of Management", short: "BMGT", unt: 50, subjects: ["Geography", "Mathematics"], subjectKey: "geography-math", school: "Bang College of Business", url: "https://www.kimep.kz/about/files/2025/07/Catalog-2025-2026_final.pdf",
    description: "Learn to lead people, improve business operations and develop responsible organizations.", topics: ["Leadership and people", "Operations and strategy", "Entrepreneurship"], careers: ["Operations coordinator", "HR specialist", "Business development specialist"] },
  { id: "accounting", code: "6B04104", name: "Bachelor of Accounting and Audit", short: "BACTA", unt: 50, subjects: ["Geography", "Mathematics"], subjectKey: "geography-math" },
  { id: "marketing", code: "6B04102", name: "Bachelor of Marketing", short: "BMKT", unt: 50, subjects: ["Geography", "Mathematics"], subjectKey: "geography-math" },
  { id: "pma", code: "6B04101", name: "Bachelor of Public and Municipal Administration", short: "BPMA", unt: 50, subjects: ["Geography", "Mathematics"], subjectKey: "geography-math" },
  { id: "law", code: "6B04201", name: "Bachelor of International Law", short: "BIL", unt: 75, subjects: ["World History", "Foundations of Law"], subjectKey: "history-law", school: "School of Law", url: "https://www.kimep.kz/school-of-law/kz/bil-program/",
    description: "Explore legal systems, international agreements and cross-border legal issues.", topics: ["Public international law", "Private international law", "Legal research and international trade"], careers: ["Legal researcher", "Corporate legal support", "International organization support"], note: "Stricter English rules apply to law applicants." },
  { id: "jurisprudence", code: "6B04202", name: "Bachelor of Laws (Jurisprudence)", short: "BLLB", unt: 75, subjects: ["World History", "Foundations of Law"], subjectKey: "history-law", school: "School of Law", note: "Stricter English rules apply to law applicants." },
  { id: "ir", code: "6B03101", name: "Bachelor of International Relations", short: "BIR", unt: 50, subjects: ["Foreign Language", "World History"], subjectKey: "language-history" },
  { id: "polsci", code: "6B03103", name: "Bachelor of Political Science", short: "BPS", unt: 50, subjects: ["Foreign Language", "World History"], subjectKey: "language-history", source: "admission", note: "Listed in the admission guide but not on the website requirements page. Confirm with Admissions." },
  { id: "translation", code: "6B02301", name: "Bachelor of Translation Studies", short: "BATS", unt: 50, subjects: ["Foreign Language", "World History"], subjectKey: "language-history" },
  { id: "languages", code: "6B01701", name: "Bachelor of Foreign Language: Two Foreign Languages", short: "BAFL", unt: 75, subjects: ["Foreign Language", "World History"], subjectKey: "language-history", note: "Pedagogical track." },
  { id: "cognitive", code: "6B02302", name: "Bachelor of Cognitive Sciences", short: "BACS", unt: 50, subjects: ["Foreign Language", "World History"], subjectKey: "language-history", minimums: [3, 5, 5, 5, 5], note: "Mathematical Literacy needs at least 5, not 3." },
  { id: "psychology", code: "6B03102", name: "Bachelor of Psychology", short: "BAP", unt: 50, subjects: ["Geography", "Biology"], subjectKey: "geography-biology" },
  { id: "journalism", code: "6B03201", name: "Bachelor of Journalism", short: "BAJ", unt: null, subjects: [], subjectKey: "creative", note: "Two online creative exams (an essay and a written interview). UNT History of Kazakhstan and Reading Literacy scores are also taken into account." },
];

function build(r: Row) {
  const creative = r.unt === null;
  const sectionNames = creative ? [...common] : [...common, ...r.subjects];
  return {
    id: r.id,
    name: r.name,
    short: r.short,
    code: r.code,
    school: r.school,
    creative,
    unt: r.unt ?? 0,
    subjects: r.subjects,
    subjectKey: r.subjectKey,
    sectionNames,
    sectionMinimums: r.minimums ?? standardMinimums,
    sectionMaximums,
    credits: r.id === "bis" ? bis.credits : undefined,
    ects: r.id === "bis" ? bis.ects : undefined,
    url: r.url ?? rules,
    source: (r.source ?? (r.url ? "program" : "school")) as SourceKey,
    note: r.note,
    description: r.description ?? "",
    topics: r.topics ?? [],
    careers: r.careers ?? [],
  };
}
export type Program = ReturnType<typeof build>;
export const programs: Record<string, Program> = Object.fromEntries(rows.map((r) => [r.id, build(r)]));
export type ProgramId = string;
export const programIds: ProgramId[] = rows.map((r) => r.id);
export function isProgramId(value: string): value is ProgramId {
  return Object.hasOwn(programs, value);
}
export const requirementsVerified = "18 November 2026";

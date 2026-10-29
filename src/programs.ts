import { program as bis, sources } from "./data.ts";
const common = { ...bis, ects: 240, school: "Bang College of Business" };
function sections(subjects: string[]) { return [...bis.sectionNames.slice(0, 3), ...subjects]; }
export const programs = {
  bis: { ...bis, subjectKey: "math-informatics", url: sources.program.url,
    description: "Build software, organize data and connect technology with business needs.",
    topics: ["Software and databases", "Data analysis", "IT project management"],
    careers: ["Software developer", "Systems analyst", "Data / BI analyst"] },
  finance: { ...common, name: "Bachelor of Finance", short: "BFIN", code: "6B04105", unt: 50,
    subjects: ["Geography", "Mathematics"], sectionNames: sections(["Geography", "Mathematics"]), subjectKey: "geography-math",
    url: "https://www.kimep.kz/bang-college-of-business/kz/bachelor-of-finance/",
    description: "Study how businesses raise capital, evaluate investments and manage financial risk.",
    topics: ["Corporate finance", "Investments", "Financial markets and risk"],
    careers: ["Financial analyst", "Investment analyst", "Risk analyst"] },
  management: { ...common, name: "Bachelor of Management", short: "BMGT", code: "6B04103", unt: 50,
    subjects: ["Geography", "Mathematics"], sectionNames: sections(["Geography", "Mathematics"]), subjectKey: "geography-math",
    url: "https://www.kimep.kz/about/files/2025/07/Catalog-2025-2026_final.pdf",
    description: "Learn to lead people, improve business operations and develop responsible organizations.",
    topics: ["Leadership and people", "Operations and strategy", "Entrepreneurship"],
    careers: ["Operations coordinator", "HR specialist", "Business development specialist"] },
  law: { ...common, name: "Bachelor of International Law", short: "BIL", code: "6B04201", school: "School of Law", unt: 75,
    subjects: ["World History", "Foundations of Law"], sectionNames: sections(["World History", "Foundations of Law"]), subjectKey: "history-law",
    url: "https://www.kimep.kz/school-of-law/kz/bil-program/",
    description: "Explore legal systems, international agreements and cross-border legal issues.",
    topics: ["Public international law", "Private international law", "Legal research and international trade"],
    careers: ["Legal researcher", "Corporate legal support", "International organization support"] },
};
export type ProgramId = keyof typeof programs;
export const programIds = Object.keys(programs) as ProgramId[];
export function isProgramId(value: string): value is ProgramId { return Object.hasOwn(programs, value); }
export const requirementsVerified = "29 October 2026";

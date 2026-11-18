import { checkAdmission } from "../src/checker.ts";
import { programs, programIds, isProgramId } from "../src/programs.ts";
import { calculateTuition } from "../src/tuition.ts";
import { tuitionRules } from "../src/data.ts";
import { kzt } from "../src/knowledge/buildKnowledge.ts";

// Calculations are never left to the model: the server runs these deterministic functions.
export const toolDefinitions = [
  {
    type: "function",
    function: {
      name: "check_unt_scores",
      description:
        "Check five UNT section scores against KIMEP's published basic requirements for a bachelor program. Use whenever the user gives UNT scores.",
      parameters: {
        type: "object",
        properties: {
          program_id: { type: "string", enum: programIds, description: "Program id from the knowledge base" },
          reading_literacy: { type: "integer", description: "0–10" },
          math_literacy: { type: "integer", description: "0–10" },
          history_kz: { type: "integer", description: "History of Kazakhstan, 0–20" },
          elective_subject: { type: "integer", description: "First profile subject, 0–50 (the program's elective, e.g. Geography)" },
          profile_subject: { type: "integer", description: "Second profile subject, 0–50 (the program's specialized subject, e.g. Mathematics)" },
        },
        required: ["program_id", "reading_literacy", "math_literacy", "history_kz", "elective_subject", "profile_subject"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "calculate_tuition",
      description:
        "Calculate KIMEP bachelor tuition and fees for 2026–2027 rates. Use for any cost question with a credit load, number of semesters, whole program, residence hall, Foundation English or a grant percentage.",
      parameters: {
        type: "object",
        properties: {
          credits_per_semester: { type: "integer", description: "Credits per semester, recommended 15–18" },
          semesters: { type: "integer", description: "Number of semesters to price (ignored if whole_program is true)" },
          whole_program: { type: "boolean", description: "Price the whole program (146 credits as in the price list example, or the program's own official credits)" },
          program_id: { type: "string", enum: programIds, description: "Optional program id" },
          scholarship_percent: { type: "integer", description: "What-if share of tuition covered by a grant, 0–100" },
          residence_hall: { type: "boolean" },
          residence_months_per_year: { type: "integer", description: "Months of residence per academic year" },
          foundation_levels: { type: "integer", description: "Foundation English levels, 0–3" },
        },
        required: ["credits_per_semester"],
      },
    },
  },
] as const;

type Args = Record<string, unknown>;
const num = (v: unknown, d = 0) => (Number.isFinite(Number(v)) ? Number(v) : d);

export function runTool(name: string, args: Args): unknown {
  if (name === "check_unt_scores") {
    const id = String(args.program_id ?? "");
    if (!isProgramId(id)) return { error: "Unknown program_id. Ask which program the user means.", valid: programIds };
    const p = programs[id];
    const scores = [args.reading_literacy, args.math_literacy, args.history_kz, args.elective_subject, args.profile_subject].map((x) => String(x ?? ""));
    const r = checkAdmission({ citizenship: "kz", route: "school", program: id, subjects: p.subjectKey, scores });
    return {
      program: p.name,
      sections: p.sectionNames.map((n, i) => ({ name: n, minimum: p.sectionMinimums[i], maximum: p.sectionMaximums[i] })),
      minimum_total: p.creative ? null : p.unt,
      result: r.status,
      total: r.total ?? null,
      points_short_of_total_minimum: r.shortBy ?? null,
      sections_below_minimum: r.belowMinimum ?? [],
      message: r.detail,
      reminder: "Basic requirement only; not an admission or grant decision. Cite [source:school].",
    };
  }
  if (name === "calculate_tuition") {
    const id = String(args.program_id ?? "");
    const full = Boolean(args.whole_program);
    const credits = full ? (isProgramId(id) && programs[id].credits ? programs[id].credits! : tuitionRules.exampleProgramCredits) : undefined;
    const r = calculateTuition({
      creditsPerSemester: num(args.credits_per_semester, 15),
      semesters: args.semesters === undefined ? undefined : num(args.semesters),
      totalCredits: credits,
      scholarshipPercent: num(args.scholarship_percent),
      dormitory: Boolean(args.residence_hall),
      dormMonthsPerYear: num(args.residence_months_per_year, 9),
      foundationLevels: num(args.foundation_levels),
    });
    const fmt = (b: typeof r.year) => ({
      semesters: b.semesters,
      credits: b.credits,
      tuition_KZT: kzt(b.lines[0].amount),
      grant_KZT: kzt(b.grant),
      tuition_after_grant_KZT: kzt(b.tuitionAfterGrant),
      mandatory_fees_KZT: kzt(b.fees),
      deposits_KZT: kzt(b.deposits),
      residence_hall_bed_KZT: kzt(b.housing),
      foundation_english_KZT: kzt(b.foundation),
      total_KZT: kzt(b.total),
    });
    return {
      first_semester: fmt(r.semester),
      first_academic_year: fmt(r.year),
      whole_period: fmt(r.program),
      notes: [
        "2026–2027 rates; KIMEP may change them in later years.",
        full && !(isProgramId(id) && programs[id].credits) ? "Whole program uses the price-list example of 146 credits; the exact credits of the program are not in our sources." : "",
        "Deposits are paid separately and are not tuition. A grant covers tuition only. Cite [source:fees].",
      ].filter(Boolean),
    };
  }
  return { error: "Unknown tool" };
}

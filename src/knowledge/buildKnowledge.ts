import {
  sources, verified, fees, otherFees, tuitionRules, englishRules, englishLevels, placementTests,
  bela, scholarships2026, discrepancies, documents, steps, deadlines, contacts, faq, type SourceKey,
} from "../data.ts";
import { programs, programIds, sectionMaximums } from "../programs.ts";
import { calculateTuition } from "../tuition.ts";
import { calendar, degrees, policies, routes, catalogChecked, type Fact } from "../catalog.ts";

// The assistant's whole "training" is this handbook. It is generated from the same
// structured data that powers the website, so updating data.ts updates the assistant.
export const kzt = (n: number) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
const src = (id: SourceKey) => `[source:${id}]`;

export const pageIds = {
  home: "Home: choose a program, four quick actions, key numbers",
  scores: "UNT score checker, requirements table for all programs, English levels",
  cost: "Tuition calculator and scholarships",
  docs: "Application steps, documents checklist and deadlines",
  faq: "Frequently asked questions and contacts",
} as const;
export type PageId = keyof typeof pageIds;

function programsBlock(): string {
  const lines = programIds.map((id) => {
    const p = programs[id];
    if (p.creative)
      return `- ${p.name} (${p.short}, ${p.code}): NO overall UNT threshold. ${p.note} ${src(p.source)}`;
    const mins = p.sectionNames.map((n, i) => `${n} ≥${p.sectionMinimums[i]}`).join("; ");
    return `- ${p.name} (${p.short}, ${p.code}; program id "${id}"): total ≥${p.unt}/140; ${mins}; profile subjects: ${p.subjects.join(" + ")}.${p.note ? " Note: " + p.note : ""}${p.credits ? ` ${p.credits} KIMEP credits, ${p.ects} ECTS (older sources say 240 ECTS, the 2026-2027 Catalog says 242).` : ""} ${src(p.source)}`;
  });
  return lines.join("\n");
}

function costExamples(): string {
  const y15 = calculateTuition({ creditsPerSemester: 15 }).year;
  const y18 = calculateTuition({ creditsPerSemester: 18 }).year;
  const full = calculateTuition({ creditsPerSemester: 18, totalCredits: tuitionRules.exampleProgramCredits }).program;
  return [
    `- 30 credits a year (15 per semester): tuition ${kzt(y15.lines[0].amount)} KZT per year.`,
    `- 36 credits a year (18 per semester): tuition ${kzt(y18.lines[0].amount)} KZT per year.`,
    `- Price-list example, whole 4-year program of ${tuitionRules.exampleProgramCredits} credits: tuition ${kzt(full.lines[0].amount)} KZT.`,
  ].join("\n");
}

export function buildKnowledge(): string {
  const out: string[] = [];
  out.push(`KNOWLEDGE BASE · KIMEP University bachelor admission handbook · facts last verified ${verified}. Every fact carries a source id like [source:fees]; cite the ids you use.`);

  out.push(`## ABOUT\nThis is an independent student guide. Only KIMEP makes admission decisions. Applications go through the official Applicant Portal ${src("portal")}: ${sources.portal.url}`);

  out.push(`## UNT FORMAT AND THRESHOLDS (standard Kazakhstan high-school route)
Five UNT sections: Reading Literacy (max ${sectionMaximums[0]}), Mathematical Literacy (max ${sectionMaximums[1]}), History of Kazakhstan (max ${sectionMaximums[2]}), elective subject (max ${sectionMaximums[3]}), specialized profile subject (max ${sectionMaximums[4]}); total max 140. Default section minimums: Reading Literacy 3, Mathematical Literacy 3, every other section 5. The Ministry sets UNT passing scores for admission. Thresholds below are KIMEP's published basic requirements, NOT grant thresholds and NOT an admission guarantee. International, vocational/college and transfer applicants need an individual review by Admissions. ${src("school")} ${src("admission")}
${programsBlock()}`);

  out.push(`## TUITION AND FEES · academic year 2026–2027 · KIMEP may change rates in later years ${src("fees")} ${src("priceList")}
- Tuition: ${kzt(tuitionRules.perCredit)} KZT per credit, the SAME for all undergraduate programs in the price list. Tuition equals the credits you plan to take in the semester; you choose the number of courses.
- Recommended load: ${tuitionRules.recommendedCreditsPerYear[0]}–${tuitionRules.recommendedCreditsPerYear[1]} credits a year (10–12 courses), i.e. ${tuitionRules.recommendedCreditsPerSemester[0]}–${tuitionRules.recommendedCreditsPerSemester[1]} per semester. Summer study is optional.
${costExamples()}
${fees.filter((f) => f.name !== "Undergraduate tuition").map((f) => `- ${f.name}: ${kzt(f.amount)} KZT ${f.unit} (${f.kind}).`).join("\n")}
${otherFees.map((f) => (f.amount ? `- ${f.name}: ${kzt(f.amount)} KZT, ${f.unit}.` : `- ${f.name}: ${f.unit}.`)).join("\n")}
- Payment options: ${tuitionRules.paymentOptions.map((o, i) => `(${i + 1}) ${o}`).join("; ")}.
- Pay in advance: transfers between Kazakhstani banks can take 3+ business days. Include payer and student full name and IIN, the student ID and the service title.
- A scholarship/grant never covers accommodation, student and medical fees, fines, library payments or deposits ${src("aid")}.
- The calculator on the website (page "cost") and the calculate_tuition tool compute totals; do not do long arithmetic yourself.`);

  out.push(`## ENGLISH ${src("school")} ${src("admission")} ${src("guideKz")}
${englishRules.map((r) => "- " + r.text).join("\n")}
Level table (CEFR; IELTS Academic; TOEFL iBT legacy 0–120 scale; PTE; Cambridge B2 First; LanguageCert; Duolingo):
${englishLevels.map((l) => `- ${l.name}: ${l.cefr}; IELTS ${l.ielts}; TOEFL ${l.toefl}; PTE ${l.pte}; Cambridge ${l.cambridge}; LanguageCert ${l.languageCert}; Duolingo ${l.duolingo}`).join("\n")}
TOEFL iBT reports use a new 1–6 scale from 21 January 2026; KIMEP has not published the conversion, so refer such results to Admissions.`);

  out.push(`## TESTS AND EXAMS ${src("tests")}
${placementTests.map((p) => `- ${p.name}: ${p.detail}`).join("\n")}
- KIMEP exam results are valid only for admission to KIMEP and within one calendar year; tests can be taken twice; admission exams cannot be retaken.
- ${bela.detail} ${src("school")}`);

  out.push(`## APPLICATION STEPS (standard Kazakhstan high-school route) ${src("admission")}
The portal works 24/7. Documents are accepted in Russian, Kazakh or English, or with a notarized translation into one of them. Foreign education documents need a notarized translation into Kazakh or Russian and recognition (nostrification) during the first semester.
${steps.map((s, i) => `${i + 1}. ${s.title}: ${s.detail} ${src(s.source)}`).join("\n")}
Originals of the school certificate and transcript can be submitted from 15 June ${src("admission")}; early enrollment lets you register for courses, which opens in mid-July.`);

  out.push(`## DOCUMENT CHECKLIST\n${documents.map((d) => `- [${d.stage}] ${d.title}: ${d.detail} ${src(d.source)}`).join("\n")}`);

  out.push(`## DEADLINES (2027 intakes) ${src("deadlines")}
Fall 2027 is the intake for new Kazakhstan high-school graduates: applications 16 October 2026 to 15 August 2027, enrollment 20 June to 25 August 2027, classes start 25 August 2027. Spring 2027 and Summer 2027 rows are for transfer/reinstated and/or international applicants, not for new Kazakhstan school graduates. Applying early is recommended. Financial Aid has its own deadlines.
${deadlines.map((d) => `- ${d.category} · ${d.intake}: applications ${d.start} to ${d.end}; enrollment ${d.enrollment}; classes start ${d.classes}`).join("\n")}`);

  out.push(`## SCHOLARSHIPS ${src("aid")}
${scholarships2026.note}
- ${scholarships2026.olympiad.name}: ${scholarships2026.olympiad.count}; ${scholarships2026.olympiad.covers} Duration: ${scholarships2026.olympiad.duration}. Held: ${scholarships2026.olympiad.heldOn}. To keep it: ${scholarships2026.olympiad.keep}
- ${scholarships2026.contact}
Not published anywhere we checked: grant passing scores, grant percentages for 2027, number of places for 2027.`);

  out.push(`## CONTACTS (use these when the handbook has no answer)\n${contacts.map((c) => `- ${c.name} (${c.for}): ${[c.email, c.phone, c.mobile && "mobile/WhatsApp " + c.mobile].filter(Boolean).join(", ")} ${src(c.source)}`).join("\n")}
Admissions Office address: 4 Abai Avenue, Almaty 050010, working hours 9:00–19:00 ${src("contacts")}.`);

  const facts = (title: string, list: Fact[]) => `## ${title}\n${list.map((f) => `- ${f.text} ${src(f.source)}`).join("\n")}`;
  out.push(facts(`ACADEMIC CALENDAR 2026-2027 (read from the Catalog on ${catalogChecked}; compare every date with TODAY'S DATE and say whether it is past, current or upcoming)`, calendar));
  out.push(facts("DEGREE STRUCTURE: credits, ECTS and General Education of every bachelor program", degrees));
  out.push(facts("STUDYING AT KIMEP: credits, GPA, payment and scholarship rules", policies));
  out.push(facts("OTHER ENTRY ROUTES: college graduates, transfer, international, IB and NIS", routes));

  out.push(`## FAQ\n${faq.map((f) => `Q: ${f.q}\nA: ${f.a} ${src(f.source)}`).join("\n")}`);

  out.push(`## KNOWN CONFLICTS BETWEEN OFFICIAL SOURCES (name BOTH values and advise to confirm)\n${discrepancies.map((d) => `- ${d.topic}: ${d.values.join("  VS  ")}. ${d.advice} ${d.sources.map((s) => src(s as SourceKey)).join(" ")}`).join("\n")}`);

  out.push(`## NOT IN THE HANDBOOK (never guess; say you do not know and give the right contact)
Grant passing scores and chances of getting a grant; scholarship percentages or amounts for 2027; fees for 2027–2028 or later years; number of places; admission probability for given scores; course-by-course curricula (the handbook has only the structure and totals, the full list is in the Catalog PDF); exact dormitory availability; course syllabi; other universities.`);

  out.push(`## SOURCE INDEX\n${(Object.keys(sources) as SourceKey[]).map((k) => `- ${k}: ${sources[k].title}: ${sources[k].url}`).join("\n")}`);
  return out.join("\n\n");
}

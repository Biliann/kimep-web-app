export const verified = "18 November 2026";
export const verifiedEarlier = "26 October 2026";
const base = "https://www.kimep.kz/prospective-students/";
export const sources = {
  admission: {
    title: "Undergraduate admission guide, 2026–2027",
    url: base + "files/2026/02/HowToApplyENGUgrad_2026-27.pdf",
    lastVerified: verified,
    published: "2026–2027 edition",
  },
  school: {
    title: "High-school graduate requirements",
    url: base + "kz/admission/high-school-graduates/",
    lastVerified: verified,
    published: "No update date shown",
  },
  program: {
    title: "BIS · School of Computer Science and Artificial Intelligence",
    url: "https://www.kimep.kz/school-of-computer-science-and-artificial-intelligence/bachelor-of-information-system/",
    lastVerified: verifiedEarlier,
    published: "No update date shown",
  },
  guideKz: {
    title: "Undergraduate admission guide for Kazakhstan citizens (Kazakh edition, April 2026)",
    url: base + "files/2026/04/HowToApplyKAZugrad.pdf",
    lastVerified: verified,
    published: "April 2026 file path",
  },
  priceList: {
    title: "Tuition and fees for all programs, 2026–2027",
    url: base + "files/2026/05/Tuition-and-fees-eng-2026-27.pdf",
    lastVerified: verified,
    published: "2026–2027 edition",
  },
  legacy: {
    title: "BIS · older Bang College page (Kazakh)",
    url: "https://www.kimep.kz/bang-college-of-business/kz/bachelor-of-information-systems/",
    lastVerified: verifiedEarlier,
    published: "No update date shown",
  },
  fees: {
    title: "Undergraduate tuition and fees, 2026–2027",
    url: base + "files/2026/05/tuition_fees_ugrad_eng.pdf",
    lastVerified: verified,
    published: "2026–2027 edition, May 2026 path",
  },
  feesKz: {
    title: "Undergraduate fees, Kazakh edition, 2026–2027",
    url: base + "files/2026/05/tuition_fees_ugrad_kaz.pdf",
    lastVerified: verifiedEarlier,
    published: "2026–2027 edition",
  },
  deadlines: {
    title: "Application deadlines · 2027 intakes",
    url: base + "kz/admission/application-deadlines/",
    lastVerified: verified,
    published: "2027 intake schedule; no page update date",
  },
  medical: {
    title: "Medical documents",
    url: base + "kz/medical-documents/",
    lastVerified: verified,
    published: "No update date shown",
  },
  aid: {
    title: "Scholarships for newly admitted students",
    url: base + "kz/financial-aid/scholarships-for-newly-admitted-students/",
    lastVerified: verified,
    published: "2026–2027 offers",
  },
  tests: {
    title: "KIMEP tests, interviews and exams",
    url: base + "kz/admission/kimep-university-tests-schedule/",
    lastVerified: verified,
    published: "Live schedule",
  },
  transfer: {
    title: "Transfer and reinstatement",
    url: base + "kz/admission/admission-for-transfer-and-reinstated-students/",
    lastVerified: verifiedEarlier,
    published: "No update date shown",
  },
  international: {
    title: "International students at KIMEP",
    url: "https://www.kimep.kz/diam/kz/international-students-coming-to-kimep/",
    lastVerified: verifiedEarlier,
    published: "No update date shown; contains legacy program counts",
  },
  portal: {
    title: "Official applicant portal",
    url: "https://www.kimep.kz/ext/application/online/en-US/",
    lastVerified: verifiedEarlier,
    published: "Live service",
  },
  contacts: {
    title: "Admissions office",
    url: base + "en/",
    lastVerified: verified,
    published: "Live contact page",
  },
};
export type SourceKey = keyof typeof sources;
export const program = {
  name: "Bachelor of Information Systems",
  short: "BIS",
  code: "6B06101",
  school: "School of Computer Science and Artificial Intelligence",
  credits: 146,
  ects: 241,
  unt: 50,
  subjects: ["Mathematics", "Informatics"],
  sectionMinimums: [3, 3, 5, 5, 5],
  sectionMaximums: [10, 10, 20, 50, 50],
  sectionNames: [
    "Reading Literacy",
    "Mathematical Literacy",
    "History of Kazakhstan",
    "Mathematics",
    "Informatics",
  ],
  source: "program" as SourceKey,
};
export const fees = [
  {
    name: "Undergraduate tuition",
    amount: 163230,
    unit: "per KIMEP credit",
    kind: "Tuition",
  },
  {
    name: "Student activity fee",
    amount: 9130,
    unit: "per semester",
    kind: "Student fee",
  },
  {
    name: "Medical examination fee",
    amount: 6560,
    unit: "per academic year",
    kind: "Student fee",
  },
  {
    name: "Textbook security deposit",
    amount: 74270,
    unit: "per academic year",
    kind: "Deposit",
  },
  {
    name: "Residence hall bed",
    amount: 108050,
    unit: "per month, if used",
    kind: "Optional housing",
  },
  {
    name: "Residence hall security deposit",
    amount: 71180,
    unit: "per semester, if used",
    kind: "Deposit",
  },
  {
    name: "Foundation English",
    amount: 682320,
    unit: "per level, if assigned",
    kind: "Conditional cost",
  },
].map((x) => ({
  ...x,
  source: "fees" as SourceKey,
  lastVerified: verified,
  academicYear: "2026–2027",
}));
export const otherFees = [
  { name: "Late payment fee", amount: 29950, unit: "as listed in the price list" },
  { name: "Late registration fee", amount: 15380, unit: "per course" },
  { name: "Official transcript / diploma supplement", amount: 2960, unit: "per unit" },
  { name: "Duplicate or replacement of diploma / certificate", amount: 8500, unit: "per issue" },
  { name: "Withdrawal administrative fee", amount: 22400, unit: "per withdrawal" },
  { name: "Textbook rental fee", amount: 0, unit: "25% of textbook replacement cost, collected from the textbook security deposit" },
].map((x) => ({ ...x, source: "priceList" as SourceKey, lastVerified: verified, academicYear: "2026–2027" }));
export const tuitionRules = {
  perCredit: 163230,
  recommendedCreditsPerYear: [30, 36] as [number, number],
  recommendedCreditsPerSemester: [15, 18] as [number, number],
  exampleProgramCredits: 146,
  exampleProgramYears: 4,
  sameForAllUndergraduate: true,
  paymentOptions: [
    "A single payment for the whole period of study, made when you sign the Contract for Educational Services; the tuition then stays unchanged (retakes and extra courses are exceptions)",
    "A single payment for the whole semester at the start of the semester",
    "Three installments during the semester",
    "An individual payment schedule arranged with the Financial Aid Office",
  ],
  source: "fees" as SourceKey,
  lastVerified: verified,
};
export const englishRules = [
  "English is not an admission requirement for bachelor programs, but teaching at KIMEP is in English, so every student's English level must be determined.",
  "Students who skip the English level procedure start from the lowest level, UF C.",
  "A valid accepted certificate exempts you from the KIMEP English test. KIMEP's TOEFL institution code is 2104.",
  "Foundation English has three levels, UF A, UF B and UF C. Each level is 225 contact hours (3 hours a day, 5 days a week) and costs KZT 682 320. It is a mandatory part of the program and cannot be waived; a poor grade means retaking it.",
  "Bachelor of Laws (LL.B.) and Bachelor of International Law (B.I.L.) applicants: IELTS 6.5+ (or an equivalent approved certificate) means direct placement in academic courses. IELTS 5.5 or 6.0 (or an equivalent) requires an interview; the result may be admission with parallel English study, or a recommendation to choose an alternative academic track.",
].map((text) => ({ text, source: "school" as SourceKey, lastVerified: verified }));
export const placementTests = [
  {
    name: "Math placement test · Computer Science (BSCS)",
    detail:
      "For students of the School of Computer Science and Mathematics bachelor of Computer Science program. 20 multiple-choice questions, 50 minutes, maximum 20 points (arithmetic, algebra, geometry). A score of 12 or more places you in Calculus I; below 12 places you in College Algebra.",
    source: "tests" as SourceKey,
    lastVerified: verified,
  },
  {
    name: "Creative exam · Journalism",
    detail:
      "Journalism applicants take two creative exams (an essay and a written interview), held online. UNT History of Kazakhstan and Reading Literacy scores are also taken into account. The exam date is announced separately by KIMEP.",
    source: "tests" as SourceKey,
    lastVerified: verified,
  },
];
export const bela = {
  detail:
    "BELA (early registration) status lets new students register for fall courses early, before the official enrollment order. Requirements: enter your UNT scores and ICT number in the applicant portal with the required subject combination; register an English test result (TOEFL, IELTS or Duolingo) in the International Certificates section; hand in the original school certificate in person or by courier; sign the BELA agreement. Students with BELA status switch to normal status after the enrollment order in August.",
  source: "school" as SourceKey,
  lastVerified: verified,
};
export const scholarships2026 = {
  note: "These are the offers published for applicants entering in 2026. They are not open offers for 2027; ask Financial Aid for the current opportunities and deadlines.",
  olympiad: {
    name: "Intellectual Olympiad grants for 2026 school and college graduates",
    covers: "100% or 50% of tuition only. Grants do not cover accommodation, student and medical fees, fines, library payments or any deposits.",
    count: "15 grants of 100% and 15 grants of 50%",
    duration: "4 academic years, not extended",
    heldOn: "29 March 2026, KIMEP campus (stage 1 English certificate, stage 2 subject exam)",
    keep:
      "Keep full academic load (at least 4 courses or 12 credits per semester) and a semester GPA of at least 3.50; retaken and withdrawn courses are excluded. Grants are subject to a 38-credit limit.",
  },
  contact: "Financial Aid: finaid@kimep.kz, +7 727 270 43 16. The Admissions Office does not advise on scholarships.",
  source: "aid" as SourceKey,
  lastVerified: verified,
};
export const discrepancies = [
  {
    id: "ects",
    topic: "BIS ECTS credits",
    values: ["241 ECTS (current School of Computer Science and AI page)", "240 ECTS (older Bang College page)"],
    advice: "Both pages list 146 KIMEP credits. Confirm ECTS with the school.",
    sources: ["program", "legacy"],
  },
  {
    id: "agreement",
    topic: "Educational Services Agreement format",
    values: ["Sign each page, scan and upload under SIGNED CONTRACT (2026–2027 English guide and the April 2026 Kazakh guide)", "Print, sign and hand in two copies to Admissions before course registration ends (website page)"],
    advice: "Confirm with Admissions whether paper copies are still required.",
    sources: ["admission", "guideKz", "school"],
  },
  {
    id: "xray",
    topic: "Chest X-ray conclusion",
    values: ["Two radiologist stamps (medical page and admission guide)", "Two doctors' signatures and two stamps, valid for 6 months (high-school page)"],
    advice: "Confirm exact requirements with the Medical Center.",
    sources: ["medical", "admission", "school"],
  },
  {
    id: "opening",
    topic: "Application opening date",
    values: ["15 October (guide: every year)", "16 October 2026 (live 2027 intake schedule)"],
    advice: "Use the intake schedule; the portal is available all year.",
    sources: ["admission", "deadlines"],
  },
  {
    id: "duolingo",
    topic: "Duolingo ranges for UF A and UF B",
    values: ["UF A: 94 (≥80 in each section)", "UF B: 60–94 (≥75 in each section)"],
    advice: "The ranges overlap; KIMEP assigns the level, ask Admissions.",
    sources: ["school", "admission"],
  },
  {
    id: "toefl",
    topic: "TOEFL iBT scale",
    values: ["Legacy 0–120 ranges (51–66 for Academic English)", "New 1–6 scale from 21 January 2026; KIMEP says values will be updated"],
    advice: "If your TOEFL report uses the new scale, ask Admissions how it is converted.",
    sources: ["school", "admission"],
  },
  {
    id: "polsci",
    topic: "Political Science (6B03103) UNT row",
    values: ["Listed in the 2026–2027 admission guide together with International Relations and Translation Studies", "Not listed on the website high-school requirements page"],
    advice: "Confirm the program's UNT subjects with Admissions.",
    sources: ["admission", "school"],
  },
];
export const englishLevels = [
  {
    name: "Academic English",
    cefr: "B2",
    ielts: "5.5 · each ≥5.0",
    pte: "39+",
    cambridge: "160+",
    languageCert: "60",
    duolingo: "95+ · each ≥90",
    toefl: "51–66",
  },
  {
    name: "Foundation A / Provisional A",
    cefr: "B1+",
    ielts: "5.0 · each ≥4.5",
    pte: "31–38",
    cambridge: "159",
    languageCert: "50",
    duolingo: "94 · each ≥80",
    toefl: "37–50",
  },
  {
    name: "Foundation B / Provisional B",
    cefr: "B1 low",
    ielts: "4.5 · each ≥4.0",
    pte: "24–30",
    cambridge: "140–158",
    languageCert: "40",
    duolingo: "60–94 · each ≥75",
    toefl: "26–36",
  },
  {
    name: "Foundation C / Provisional C",
    cefr: "A2",
    ielts: "4.0 · each ≥3.5",
    pte: "10–23",
    cambridge: "Not listed",
    languageCert: "Not listed",
    duolingo: "10–59",
    toefl: "14–25",
  },
].map((x) => ({ ...x, source: "school" as SourceKey, lastVerified: verified }));
export const documents = [
  {
    id: "email",
    stage: "Before applying",
    title: "Choose an email you check regularly",
    detail: "KIMEP sends official decisions and messages there.",
    source: "admission",
  },
  {
    id: "id",
    stage: "Online application",
    title: "Upload both sides of your ID",
    detail:
      "This checklist covers Kazakhstan high-school applicants. International and transfer routes need separate review.",
    source: "admission",
  },
  {
    id: "photo",
    stage: "Online application",
    title: "Upload your photo in the Photo field",
    detail: "JPEG, 300 ppi, at least 8 MP, high quality with low compression.",
    source: "school",
  },
  {
    id: "english",
    stage: "Online application",
    title: "Upload a valid English certificate, if you have one",
    detail:
      "Optional certificate upload. Without one, arrange KIMEP English placement. Tick this after choosing your route.",
    source: "school",
  },
  {
    id: "school",
    stage: "After receiving your school certificate",
    title: "Upload your certificate and transcript",
    detail: "Add copies as soon as the originals are available.",
    source: "school",
  },
  {
    id: "unt",
    stage: "After receiving your school certificate",
    title: "Enter your UNT results and ICT number",
    detail: "ICT is the test identifier shown with your UNT results.",
    source: "school",
  },
  {
    id: "original",
    stage: "Before enrollment",
    title: "Submit the original certificate and transcript",
    detail:
      "The 2026–2027 guide says originals can be submitted from 15 June. Confirm the date for your intake.",
    source: "admission",
  },
  {
    id: "075",
    stage: "Medical documents",
    title: "Prepare Form 075/u",
    detail:
      "Health certificate with physician checks and tests listed by KIMEP. Ask the Medical Center about the exact examinations.",
    source: "medical",
  },
  {
    id: "065",
    stage: "Medical documents",
    title: "Copy your vaccination record · Form 065/u",
    detail: "A copy from your vaccination or outpatient card.",
    source: "medical",
  },
  {
    id: "xray",
    stage: "Medical documents",
    title: "Prepare the chest X-ray and conclusion",
    detail:
      "Attach it to Form 075/u. The medical page requests two radiologist stamps; the admissions page also specifies two signatures and validity within six months. Confirm with the center.",
    source: "medical",
  },
  {
    id: "medsubmit",
    stage: "Medical documents",
    title: "Submit medical originals to the Medical Center",
    detail:
      "The center may require translation of foreign records. An X-ray taken outside Kazakhstan needs verification by an Almaty radiologist.",
    source: "medical",
  },
  {
    id: "contract",
    stage: "Before enrollment",
    title: "Review, sign and upload your agreement",
    detail:
      "Use Acceptance Package, sign every page and upload under SIGNED CONTRACT. If under 18, a parent or guardian also signs. Ask whether paper copies are required.",
    source: "admission",
  },
  {
    id: "register",
    stage: "Before enrollment",
    title: "Confirm registration readiness with advising",
    detail:
      "Admission alone does not finish course registration. Complete the agreement, medical requirements and university instructions.",
    source: "admission",
  },
].map((x) => ({ ...x, source: x.source as SourceKey, lastVerified: verified }));
export const steps = [
  [
    "Apply online",
    "Start in the official Applicant Portal. Upload ID, photo and any valid English certificate.",
    "school",
  ],
  [
    "Add your education and UNT records",
    "Upload your certificate and transcript when ready. Enter your UNT scores and ICT number.",
    "school",
  ],
  [
    "Deliver originals and medical documents",
    "Give education originals to Admissions and medical originals to the Medical Center.",
    "medical",
  ],
  [
    "Confirm your English level",
    "Use a valid accepted certificate or the KIMEP placement procedure. Your level determines your English study route.",
    "school",
  ],
  [
    "Read your decision and sign the agreement",
    "Check email and Acceptance Package. The current guide asks for a signed scan; the web page still mentions paper copies. Confirm both with Admissions.",
    "admission",
  ],
  [
    "Prepare to register for courses",
    "Contact Student Academic Support for scheduling, tuition calculation and registration steps.",
    "admission",
  ],
].map(([title, detail, source]) => ({
  title,
  detail,
  source: source as SourceKey,
  lastVerified: verified,
}));
export const deadlines = [
  {
    category: "Undergraduate · Kazakhstan & international",
    intake: "Fall 2027",
    start: "2026-10-16",
    end: "2027-08-15",
    enrollment: "20 June–25 August 2027",
    classes: "25 August 2027",
  },
  {
    category: "International applicants",
    intake: "Spring 2027",
    start: "2026-10-16",
    end: "2026-12-10",
    enrollment: "26 December 2026–10 January 2027",
    classes: "11 January 2027",
  },
  {
    category: "Transfer & reinstatement",
    intake: "Spring 2027",
    start: "2026-10-16",
    end: "2026-12-30",
    enrollment: "26 December 2026–10 January 2027",
    classes: "11 January 2027",
  },
  {
    category: "International applicants",
    intake: "Summer I 2027",
    start: "2026-10-16",
    end: "2027-04-24",
    enrollment: "19–23 May 2027",
    classes: "24 May 2027",
  },
  {
    category: "International applicants",
    intake: "Summer II 2027",
    start: "2026-10-16",
    end: "2027-06-10",
    enrollment: "3–12 July 2027",
    classes: "12 July 2027",
  },
].map((x) => ({
  ...x,
  source: "deadlines" as SourceKey,
  lastVerified: verified,
}));
export const contacts = [
  {
    name: "Admissions",
    for: "Applications, documents and admission decisions",
    email: "uao@kimep.kz",
    phone: "+7 727 270 42 13",
    mobile: "+7 707 170 42 13",
    source: "contacts",
  },
  {
    name: "Financial Aid",
    for: "Scholarship eligibility, deadlines and funding",
    email: "finaid@kimep.kz",
    phone: "+7 727 270 43 16",
    mobile: "+7 707 970 43 16",
    source: "admission",
  },
  {
    name: "Medical Center",
    for: "Medical forms, checks and foreign medical records",
    email: "med.center@kimep.kz",
    phone: "+7 727 237 48 05",
    mobile: "+7 747 830 32 46",
    source: "admission",
  },
  {
    name: "Student Academic Support",
    for: "Course registration, schedules and tuition calculation",
    email: "advising@kimep.kz",
    phone: "+7 727 270 42 68",
    mobile: "+7 701 309 16 24",
    source: "admission",
  },
  {
    name: "Foundation English",
    for: "Questions about the Foundation English program",
    email: "",
    phone: "+7 701 717 38 06",
    mobile: "",
    source: "fees",
  },
  {
    name: "Residence Hall",
    for: "Accommodation for students from outside Almaty and international students",
    email: "",
    phone: "+7 727 237 47 73",
    mobile: "+7 701 679 47 09",
    source: "fees",
  },
].map((x) => ({ ...x, source: x.source as SourceKey, lastVerified: verified }));
export const faq = [
  [
    "What UNT score do I need for Information Systems?",
    "At least 50 overall. Reading Literacy and Mathematical Literacy each need 3; History of Kazakhstan and both profile subjects each need 5. These are the published basic thresholds, not a scholarship guarantee.",
    "school",
  ],
  [
    "Which profile subjects should I take?",
    "Mathematics and Informatics for the standard Information Systems high-school route. Vocational and transfer routes need separate assessment.",
    "school",
  ],
  [
    "Do I need IELTS to apply?",
    "IELTS is not the only route. KIMEP accepts listed valid English certificates or uses its placement procedure. A lower English level can lead to Foundation English. Confirm your assigned route with Admissions.",
    "school",
  ],
  [
    "Can I start before I receive my school certificate?",
    "Yes. Start your online application with available documents, then add your education records as soon as you receive them.",
    "admission",
  ],
  [
    "When do I submit the original certificate?",
    "The 2026–2027 guide gives 15 June as the start for originals. Submit the certificate and transcript to Admissions and confirm the date for your own intake.",
    "admission",
  ],
  [
    "Which medical documents do I need?",
    "Form 075/u, a vaccination record copy (065/u), and the chest X-ray with conclusion. The Medical Center lists physician checks, lab tests and supporting certificates. Use the expanded checklist for details.",
    "medical",
  ],
  [
    "Can an international student apply?",
    "Yes. Contact Admissions about the international route, education recognition, interview and immigration requirements. The local UNT checker does not assess international eligibility.",
    "international",
  ],
  [
    "Where do I submit my application?",
    "Use KIMEP’s official Applicant Portal. This student project does not receive your documents or submit an application for you.",
    "portal",
  ],
  [
    "How will I know the admission decision?",
    "Check your email and the Acceptance Package area of the Applicant Portal. Only KIMEP can issue the decision.",
    "admission",
  ],
  [
    "How much is tuition?",
    "The 2026–2027 rate is KZT 163,230 per KIMEP credit. Multiply it by your credit load, then account for fees and any assigned Foundation English. Future-year rates may change.",
    "fees",
  ],
  [
    "Who can help with scholarships?",
    "Financial Aid: finaid@kimep.kz, +7 727 270 43 16. Funding has separate rules and deadlines. Admission does not guarantee a scholarship.",
    "aid",
  ],
  [
    "Can I register for courses immediately?",
    "Follow your enrollment instructions first. An unsigned agreement or incomplete medical documents can block registration. Ask Student Academic Support for your next step.",
    "admission",
  ],
  [
    "Is tuition the same for every program?",
    "Yes for bachelor programs. In the 2026–2027 price list every undergraduate program, including Economics, Finance, Management, Information Systems, Computer Science, Law and Psychology, costs KZT 163,230 per credit. Rates for later years may change.",
    "priceList",
  ],
  [
    "How can I pay tuition?",
    "Four options: one payment for the whole period of study when you sign the contract (the tuition then stays unchanged); one payment for each semester at its start; three installments within the semester; or an individual schedule arranged with the Financial Aid Office (+7 727 270 43 16).",
    "fees",
  ],
  [
    "What happens if I pay or register late?",
    "The 2026–2027 price list lists a late payment fee of KZT 29,950 and a late registration fee of KZT 15,380 per course. Bank transfers can take 3 or more business days, so pay in advance.",
    "priceList",
  ],
  [
    "Are there scholarships for 2027 applicants?",
    "The published 2026 offer was the Intellectual Olympiad: 15 grants of 100% and 15 of 50% of tuition, held on 29 March 2026 for 2026 graduates. Grants cover tuition only. Opportunities for 2027 are not published in the sources we checked, so ask Financial Aid: finaid@kimep.kz, +7 727 270 43 16.",
    "aid",
  ],
  [
    "Do Law applicants need a higher English level?",
    "Yes. For LL.B. and B.I.L., IELTS 6.5+ (or an equivalent approved certificate) means direct placement in academic courses. IELTS 5.5 or 6.0 (or equivalent) requires an interview; you may be admitted with parallel English study or advised to choose another track.",
    "guideKz",
  ],
  [
    "Is there a math test for Computer Science?",
    "Yes. Computer Science (BSCS) students take a math placement test: 20 multiple-choice questions in 50 minutes, maximum 20 points. 12 or more places you in Calculus I; below 12 places you in College Algebra.",
    "tests",
  ],
  [
    "What is Foundation English?",
    "A mandatory English program for students whose English level is below Academic English. It has three levels (UF A, UF B, UF C); each is 225 contact hours and costs KZT 682,320. It cannot be waived and a poor grade means retaking the level.",
    "school",
  ],
  [
    "What is BELA early registration?",
    "BELA status lets new students register for fall courses early. You need valid UNT scores in the applicant portal, a registered English test result, the original school certificate handed in, and a signed BELA agreement. It changes to normal status after the August enrollment order.",
    "school",
  ],
  [
    "How do Journalism applicants apply?",
    "Journalism uses two creative exams (an essay and a written interview) held online, plus your UNT History of Kazakhstan and Reading Literacy scores. KIMEP announces the exam date separately; check the applicant portal.",
    "tests",
  ],
].map(([q, a, source]) => ({
  q,
  a,
  source: source as SourceKey,
  lastVerified: verified,
}));

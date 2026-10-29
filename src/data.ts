export const verified = "26 October 2026";
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
    lastVerified: verified,
    published: "No update date shown",
  },
  legacy: {
    title: "BIS · older Bang College page (Kazakh)",
    url: "https://www.kimep.kz/bang-college-of-business/kz/bachelor-of-information-systems/",
    lastVerified: verified,
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
    lastVerified: verified,
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
    lastVerified: verified,
    published: "No update date shown",
  },
  international: {
    title: "International students at KIMEP",
    url: "https://www.kimep.kz/diam/kz/international-students-coming-to-kimep/",
    lastVerified: verified,
    published: "No update date shown; contains legacy program counts",
  },
  portal: {
    title: "Official applicant portal",
    url: "https://www.kimep.kz/ext/application/online/en-US/",
    lastVerified: verified,
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
].map(([q, a, source]) => ({
  q,
  a,
  source: source as SourceKey,
  lastVerified: verified,
}));

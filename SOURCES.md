# Official source register

Research date: 26 October 2026; re-verified against the primary sources on 18 November 2026 (Asia/Almaty). Facts re-checked on 18 November carry that date in `src/data.ts`; sources not re-opened keep 26 October. Official KIMEP information is the authority; no forum claims are used as requirements. English URLs often redirect to Kazakh; use the university language selector as needed.

## admission: Undergraduate admission guide, 2026–2027

https://www.kimep.kz/prospective-students/files/2026/02/HowToApplyENGUgrad_2026-27.pdf

Edition/update: 2026–2027 edition. Last verified: 26 October 2026.

## school: High-school graduate requirements

https://www.kimep.kz/prospective-students/kz/admission/high-school-graduates/

Edition/update: No update date shown. Last verified: 26 October 2026.

## program: BIS · School of Computer Science and Artificial Intelligence

https://www.kimep.kz/school-of-computer-science-and-artificial-intelligence/bachelor-of-information-system/

Edition/update: No update date shown. Last verified: 26 October 2026.

## guideKz: Admission guide for Kazakhstan citizens (Kazakh, April 2026)

https://www.kimep.kz/prospective-students/files/2026/04/HowToApplyKAZugrad.pdf

Edition/update: April 2026 file path, linked from the live high-school page. Last verified: 18 November 2026. Adds the stricter English rules for LL.B. and B.I.L. applicants.

## priceList: Tuition and fees for all programs, 2026–2027

https://www.kimep.kz/prospective-students/files/2026/05/Tuition-and-fees-eng-2026-27.pdf

Edition/update: 2026–2027 edition. Last verified: 18 November 2026. All undergraduate programs (including Economics, Journalism, PMA, IR, Management, Marketing, Accounting, Finance, Jurisprudence, International Law, Cognitive Sciences, Psychology, Foreign Languages, Translation, Information Systems, Computer Science and Political Science) are priced at KZT 163 230 per credit. Also lists late payment fee (29 950), late registration fee (15 380 per course), transcript (2 960), duplicate diploma (8 500), withdrawal fee (22 400).

## legacy: BIS · older Bang College page (Kazakh)

https://www.kimep.kz/bang-college-of-business/kz/bachelor-of-information-systems/

Edition/update: No update date shown. Last verified: 26 October 2026.

## fees: Undergraduate tuition and fees, 2026–2027

https://www.kimep.kz/prospective-students/files/2026/05/tuition_fees_ugrad_eng.pdf

Edition/update: 2026–2027 edition, May 2026 path. Last verified: 26 October 2026.

## feesKz: Undergraduate fees, Kazakh edition, 2026–2027

https://www.kimep.kz/prospective-students/files/2026/05/tuition_fees_ugrad_kaz.pdf

Edition/update: 2026–2027 edition. Last verified: 26 October 2026.

## deadlines: Application deadlines · 2027 intakes

https://www.kimep.kz/prospective-students/kz/admission/application-deadlines/

Edition/update: 2027 intake schedule; no page update date. Last verified: 26 October 2026.

## medical: Medical documents

https://www.kimep.kz/prospective-students/kz/medical-documents/

Edition/update: No update date shown. Last verified: 26 October 2026.

## aid: Scholarships for newly admitted students

https://www.kimep.kz/prospective-students/kz/financial-aid/scholarships-for-newly-admitted-students/

Edition/update: 2026–2027 offers. Last verified: 26 October 2026.

## tests: KIMEP tests, interviews and exams

https://www.kimep.kz/prospective-students/kz/admission/kimep-university-tests-schedule/

Edition/update: Live schedule. Last verified: 26 October 2026.

## transfer: Transfer and reinstatement

https://www.kimep.kz/prospective-students/kz/admission/admission-for-transfer-and-reinstated-students/

Edition/update: No update date shown. Last verified: 26 October 2026.

## international: International students at KIMEP

https://www.kimep.kz/diam/kz/international-students-coming-to-kimep/

Edition/update: No update date shown; contains legacy program counts. Last verified: 26 October 2026.

## portal: Official applicant portal

https://www.kimep.kz/ext/application/online/en-US/

Edition/update: Live service. Last verified: 26 October 2026.

## contacts: Admissions office

https://www.kimep.kz/prospective-students/en/

Edition/update: Live contact page. Last verified: 26 October 2026.

## Re-verification log, 18 November 2026

Opened and compared with `src/data.ts`: high-school requirements page, application-deadlines page, medical-documents page, scholarships page, tests page, the 2026–2027 English admission guide, the April 2026 Kazakh guide, the English fee sheet and the general price list. Results:

- **Fees.** Every figure in `fees` matches the fee sheet and the price list (163 230 per credit; 9 130 per semester; 6 560 per year; 74 270 deposit; bed 108 050 per month; hall deposit 71 180 per semester; Foundation 682 320 per level, 225 contact hours). The 30–36 credit recommendation and the 4 896 900 / 5 876 280 / 23 831 580 examples also match. Previously unchecked items added: late payment 29 950, late registration 15 380 per course.
- **One price for all programs.** The price list shows a single undergraduate rate for all 17 listed bachelor programs. The calculator therefore uses one rate; no per-program override is needed.
- **Programs.** The official high-school page lists 16 bachelor programs with UNT rules (Economics, Management, Accounting and Audit, Finance, Public and Municipal Administration, Marketing, International Law, Jurisprudence, International Relations, Foreign Language: Two Foreign Languages, Cognitive Sciences, Translation Studies, Information Systems, Computer Science, Journalism, Psychology). The 2026–2027 guide additionally groups Political Science (6B03103) with International Relations and Translation Studies; the web page does not list it. The site includes Political Science with a visible "confirm with Admissions" note (see below).
- **Thresholds.** Total 50 for most programs; 75 for International Law, Jurisprudence and Foreign Language: Two Foreign Languages. Reading and Mathematical Literacy minimum 3, other sections 5, except Cognitive Sciences: Mathematical Literacy minimum 5. Journalism: two online creative exams; UNT History of Kazakhstan and Reading Literacy scores are taken into account; no total threshold.
- **Credits and ECTS.** Only BIS has official values (146 / 241, see conflict below). The earlier build copied 146 credits and 240 ECTS onto the other three programs; that was unsupported and has been removed. The calculator uses 146 credits only as the price-list example for a whole program and labels it so.
- **Deadlines.** The intake schedule matches `deadlines` (Fall 2027 applications 16 October 2026–15 August 2027; enrollment 20 June–25 August 2027; classes 25 August 2027; Spring 2027 and Summer intakes as listed).
- **Medical.** Form 075/u with therapist, ophthalmologist, ENT, surgeon and neurologist checks; fluorography, microreaction, stool test; narcology and psycho-neurology certificates (eGov); copy of Form 065/u; chest X-ray with radiologist conclusion; X-ray taken outside Kazakhstan needs verification by an Almaty radiologist.
- **English.** The website states English is not an admission requirement; students without a determined level start at UF C; KIMEP's TOEFL institution code is 2104; Foundation has three levels of 225 contact hours and cannot be waived. LL.B. and B.I.L. applicants: IELTS 6.5+ gives direct placement; IELTS 5.5 or 6.0 (or equivalent) requires an interview (April 2026 guide). The IELTS/TOEFL/Duolingo/PTE/Cambridge/LanguageCert table matches the earlier data.
- **Computer Science math placement test.** The tests page confirms a math placement test (20 multiple-choice questions, 50 minutes, maximum 20; 12 or more places into Calculus I, below 12 into College Algebra) for students of the BSCS program. It describes it for Computer Science students, not for every applicant.
- **Scholarships.** The page publishes the 2026-intake Intellectual Olympiad only (15 grants of 100% and 15 of 50%, held 29 March 2026, tuition only, 4 years, GPA 3.50, 38-credit limit). No 2027 offer is published yet; the site does not present these as open.
- **2027–2028 editions.** No 2027–2028 guide or price list is linked from the live pages and guessed file paths return 404, so the 2026–2027 files remain current.
- **Admission contacts.** Phone and email values for Admissions, Financial Aid, Medical Center and Student Academic Support match the guides; Foundation English coordinator (+7 701 717 38 06) and Residence Hall (+7 727 237 47 73, +7 701 679 47 09) added from the fee sheet.

## New or restated conflicts

- **Political Science (6B03103).** Present in the English guide's UNT table, absent from the web page's program list. Shown with a confirmation note; the assistant is told to say so.
- **Agreement format.** Both guides (English 2026–2027 and Kazakh April 2026) say sign, scan and upload under SIGNED CONTRACT; the web page still says to hand in two printed copies. Both shown.
- **X-ray conclusion.** Medical page and guide: two radiologist stamps. High-school page: two doctors' signatures and two stamps, valid six months. Both shown.
- **Application opening date.** Guide: 15 October every year; live intake schedule: 16 October 2026. Both shown.
- **BIS ECTS.** 241 (current school page) vs 240 (older Bang College page). Both shown.
- **Duolingo ranges for UF A / UF B overlap; TOEFL iBT table still uses the legacy scale.** Unchanged, flagged.

## Evidence and reconciliation

- Admissions: 2026–2027 English brochure and live high-school page agree on BIS 50 overall, literacy minimums 3 each, other sections 5 each and Mathematics + Informatics. These are standard Kazakhstan high-school thresholds, not grant thresholds or admission guarantees.
- School: current School of Computer Science and Artificial Intelligence BIS page lists 146 KIMEP credits / 241 ECTS. The older Bang College Kazakh page lists 146 / 240. No clear page-update dates resolve the conflict; the site displays the current school page and flags the difference.
- Duration: the undergraduate fee sheet uses a four-year / 146-credit example. It is not evidence that every student finishes in four years.
- English: IELTS is not an exclusive admission requirement. The live page accepts valid certificates as an alternative to KIMEP placement. Foundation / Provisional rows exist. Exact assignment is left to KIMEP.
- Duolingo: official A row is 94 (each ≥80), B row 60–94 (each ≥75), which overlap and appear internally inconsistent. Reproduced with an explicit caution; no automatic English placement is implemented.
- TOEFL: the admissions page and PDF retain legacy 0–120 ranges while mentioning the new 1–6 scale from 21 January 2026. The site labels these legacy-only and refers new-scale results to Admissions; it does not borrow scholarship thresholds for general placement.
- Agreement: PDF instructs signed scan upload in SIGNED CONTRACT and parent/guardian signature for minors. The web page mentions two paper copies. The site flags the difference and advises confirmation. No page-update date establishes which instruction supersedes the other.
- Medical: dedicated medical page includes neurologist, tests and eGov supporting certificates. Admissions page adds X-ray validity within six months and two signatures, while the medical page says two stamps. Site identifies the difference and points to Medical Center. These are institutional document instructions, not medical advice.
- Dates: live 2027 intake schedule gives opening 16 October 2026, versus the brochure’s recurring 15 October statement. The site uses intake-specific dates and discloses the one-day difference. Spring transfer dates are not represented as dates for Kazakhstan new high-school applicants. Fall undergraduate deadline is 15 August 2027 for local and international applicants.
- Fees: English and Kazakh 2026–2027 PDFs agree: 163,230 KZT/credit; activity 9,130/semester; medical 6,560/year; textbook deposit 74,270/year; hall bed 108,050/month; hall deposit 71,180/semester; Foundation 682,320/level. These are explicitly not future-year quotes.
- Scholarships: separate applications and deadlines. Existing 2026 offers may have expired. The website links live opportunities rather than presenting expired grants as open.
- International and transfer: admissions exists, but local standard thresholds do not assess those routes. Office review is needed; this MVP does not claim to be a complete international eligibility engine.

## Checker input format

For technical upper-bound validation, cross-checked the UNT subject format at the official university page https://www.ksu.edu.kz/en/enrollee/profilnye-predmety-ent/ and the Ministry’s 2026 announcement https://www.gov.kz/org/sci/press/news/details/1209963?lang=ru . Literacy maxima 10 each, History 20, profile scores 50 each; total 140. KIMEP remains the source for program admission minimums.

## Project reference

KIMEP University advising plan.pdf was read as project context. Its wider advising, sign-in and later AI functions are intentionally outside the authorized Phase 1 admissions-only scope. It is not used as authority for admissions rules.

## Visual asset

Home-page KIMEP logo: user-provided image, added unchanged on 26 October 2026. Its link goes to the official university website. The guide retains its independent student-project notice.

## Screenshots of official pages

Two content-only crops (tables and headings, no photographs of people) taken with Playwright on 19 November 2026 and stored in `public/`:

- `kimep-deadlines.png`: the Fall 2027 bachelor block of https://www.kimep.kz/prospective-students/kz/admission/application-deadlines/ (shown on Documents and dates).
- `kimep-unt-table.png`: heading and first two rows of the program table on https://www.kimep.kz/prospective-students/kz/admission/high-school-graduates/ (shown on UNT scores).

Each is shown with a source caption and a link to the original. The pages are in Kazakh. They are quoted as evidence of what KIMEP publishes; the site's own numbers still come from `src/data.ts`. If KIMEP changes these pages, retake the crops.

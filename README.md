# KIMEP Pathway — Phase 1

An independent admissions information website for prospective undergraduate students. The program catalog covers Information Systems, Finance, Management and International Law. This is a student project, not an official KIMEP University service.

## Run locally

Install Node.js 22.13+ (Node 24 recommended). Extract the project and open a terminal in its folder.

```bash
npm ci
npm run dev
```

Open the local URL Vite prints. No Java, Docker, database, login, API key or AI service is needed.

```bash
npm test
npm run build
npm run preview
```

`npm run build` type-checks TypeScript and creates the static `dist/` folder. `npm test` runs meaningful boundary tests for the basic UNT checker.

## Site structure

The sidebar opens 11 hash-linked views: Overview, Admission checker, Programs, Requirements, Documents checklist, How to apply, English placement, Tuition & financial aid, Dates & deadlines, Common questions, Contacts & links. A direct URL such as `/#documents` survives refresh. Unknown hashes safely fall back to Overview.

- `src/data.ts`: reusable program rules, sources, documents, deadlines, English levels, fees, contacts and FAQ, with verification metadata.
- `src/checker.ts`: pure, deterministic rules for the Kazakhstan high-school route for all four supported programs. It validates five scores, subject pairing and applicant route. No admission decisions are made.
- `src/main.tsx`: React views and shared UI helpers. Hash navigation avoids server route configuration.
- `src/style.css`: responsive design, focus states, reduced motion and print styles. Purple and white styling uses the exact user-supplied KIMEP logo on the home page. The image is not redrawn, cropped or recolored. Its presence does not imply official university endorsement.
- `tests/checker.test.ts`: threshold, section minimum, invalid input and special-route tests.
- `SOURCES.md`: official references, dated evidence and unresolved differences.
- `VERIFICATION.md`: what was tested and practical limitations.

The checklist uses versioned localStorage and stores only item IDs, not personal records. Other form answers live in memory and are cleared when the view is unmounted. No analytics, uploads, authentication or backend is included. Google Fonts is optional with local font fallbacks.

## Deployment

The website is a static Vite build. On Vercel or another static host:

1. Import this source repository, or upload the extracted source through the host's normal workflow.
2. Set framework to Vite; build command `npm run build`; output directory `dist`.
3. Deploy. There are no environment variables.
4. Check the home page, `/#checker`, and `/#documents` after refresh.

For manual static hosting, upload the **contents** of `dist/`. Do not open `dist/index.html` using a `file://` URL: module assets need an HTTP server. The `.openai/hosting.json` file connects the hosted Sites version to its project and should be preserved for updates to that Site. Use your own Site identity when making an independent copy.

## Later Spring Boot integration

Keep the present display data shapes and replace `src/data.ts` reads with a small API client once an approved backend exists. Checker rules should also be enforced by the backend if they ever become part of an actual submission workflow. This phase does not include student data or course planning.

## Facts to update each year (and before each intake)

- UNT overall and section thresholds, accepted subject pairs and special routes.
- Program school, name, curriculum version, total credits / ECTS and expected duration.
- Accepted English certificates, validity, every placement threshold, TOEFL scale and Foundation fees.
- Tuition per credit, student and medical fees, deposits, housing and payment conditions.
- Intake dates, originals submission windows, course registration and enrollment periods.
- Scholarship eligibility, coverage, application links, deadlines and continuation conditions.
- Medical forms, tests, validity, translation and signature/stamp requirements.
- Office contacts, application portal fields, agreement signing and paper-original requirements.

When updating a fact, change its structured entry and verification metadata, recheck related FAQ/overview explanations, run tests/build, then publish. Do not advance the verified date unless the source was checked again. 2026–2027 fee rates are not promised for Fall 2027.

## Admissions assistant demo

The bottom-right AI assistant button opens a clearly labeled MVP concept. Six sample questions reuse answers and official sources from `src/data.ts`. No free-text messages, model, API, backend or external requests are used. The short sample conversation stays in memory and persists across handbook views until reload; Start again clears it. Escape and the close control dismiss the panel. UI and responsive styling live in `src/AssistantDemo.tsx` and `src/assistant.css`.

## Languages

English, Russian and Kazakh are available in the header. The language preference uses `kimep-language-v1` in localStorage and survives refresh. `src/translations.ts` holds the translation catalogue; `src/i18n.ts` provides the shared React subscription, translation lookup, localized data and checker-result formatting. The original admission rules and numeric values remain in `src/data.ts` and `src/checker.ts`. Checklist state uses language-independent IDs. Official certificate names and Applicant Portal field names are retained to match the external university system. Dates use explicit translated month names for consistent Kazakh rendering across browser runtimes. External source documents remain in the language published by KIMEP.


## Program selection and verified requirements

`src/programs.ts` is the shared program catalog used by the overview, comparison cards, requirements, checker, FAQ and predefined assistant. The selected stable program ID is stored locally; changing the program clears checker scores and assistant turns. General documents, English placement, deadlines and fee rules remain shared because they are university-wide, rather than being duplicated as separate program rules. An applicant must explicitly choose their actual UNT subject combination before checking.

| Program | Code | Minimum UNT | Profile subjects |
| --- | --- | --- | --- |
| Information Systems | 6B06101 | 50 | Mathematics + Informatics |
| Finance | 6B04105 | 50 | Geography + Mathematics |
| Management | 6B04103 | 50 | Geography + Mathematics |
| International Law | 6B04201 | 75 | World History + Foundations of Law |

All four require at least 3 in Reading Literacy, 3 in Mathematical Literacy, and 5 in History of Kazakhstan and each profile subject. These thresholds cover the standard Kazakhstan high-school route, not admission decisions or scholarship eligibility. Other applicant routes are referred to Admissions.

Requirements checked on 29 October 2026 against KIMEP's [2026–2027 admissions guide](https://www.kimep.kz/prospective-students/files/2026/02/HowToApplyENGUgrad_2026-27.pdf) and [high-school requirements](https://www.kimep.kz/prospective-students/kz/admission/high-school-graduates/). Program descriptions link to the relevant official school pages. Management curriculum uses the 2025–2026 catalog and is visibly labelled as such; confirm the curriculum for your intake. New content is available in English, Russian and Kazakh.

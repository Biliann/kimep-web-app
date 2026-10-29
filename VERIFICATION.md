# Verification — 26 October 2026

Story: a prospective BIS applicant opens the handbook, checks basic UNT eligibility, prepares documents, understands English placement and costs, then follows official application links. All user interaction is frontend-only; no backend or database is required for this phase.

## Automated checks

- TypeScript type-check and Vite production build passed.
- Eight Node test cases passed, covering total 50, total 49, every section minimum, high totals with a failed section, blanks, negative values, fractions, nonnumeric input, excessive scores, maximum 140, subject mismatch and special applicant routes.
- React review: module-level view components; hooks called consistently; versioned localStorage with malformed-value handling and storage-error fallback; data and rules separated; no unnecessary backend, effects or data requests.

## Browser checks

Desktop Chromium at approximately 1363 × 936, plus a 390px-wide iframe viewport (375px usable width after scrollbar). This is responsive browser verification, not a test on a physical phone.

- Home, checker, program, requirements, checklist, application steps, English, tuition, deadlines, FAQ and contacts rendered.
- Navigation and direct hash URLs worked. Page refresh preserved the selected route.
- Empty checker submission displayed validation; five valid scores totaling 50 displayed the qualified basic-threshold message without claiming admission.
- Checklist: checked item and progress count survived reload.
- FAQ: search with no match produced the useful empty state; clearing restored all answers; IELTS answer accordion opened.
- English: selecting Duolingo updated the table and showed its official-data caveat.
- Tuition: changing 30 to 36 credits changed estimate from 4,896,900 to 5,876,280 KZT.
- Deadline filter: Spring 2027 displayed the international and transfer cards only.
- Mobile menu opened and navigation selected a view; hidden off-canvas links are removed from visibility.
- No document-level horizontal overflow on desktop home or the mobile English page; tables have their own scroll container.
- Main office mailto/tel links and official URLs inspected. Primary official sources and application portal were opened through web retrieval during research. No real application, email, phone call or external form was submitted.
- Captured app console contained no app errors/warnings. Browser extension metadata errors were unrelated to this site and excluded.

## Fixes made

- Allowed the exact internal preview hostname in Vite configuration, then restarted preview.
- Unknown hash lookup uses an own-property check, preventing inherited object names from being treated as views.
- Closed mobile sidebar uses visibility hiding so offscreen links do not stay in the keyboard navigation order.
- Exposed the English, ECTS, agreement, medical and opening-date discrepancies instead of inventing resolutions.

## Evidence and limitations

Screenshots: `screenshots/desktop.jpg` and `screenshots/mobile.jpg`. The mobile screenshot shows the phone-width frame inside the desktop test browser. The home page now uses the user-supplied university logo in its original proportions.

This does not certify university approval or exhaustive accessibility compliance. No physical iOS/Android, screen-reader or cross-browser test was available. External pages can change, redirect language or become unavailable after verification. Scholarship awards and international/transfer eligibility need university review. Production publishing status is verified by Sites separately from the local browser checks.

## Purple and white update — 26 October 2026

Simplified the home page to four primary actions, a short BIS summary and supporting links. Removed the decorative campus drawing, large promotional cards and serif headlines. Applied purple and white styling across the existing views. Logo bytes match the uploaded original (SHA-256 checked); rendered image reports its correct native dimensions of 406 × 536. Production TypeScript/Vite build passed. Desktop preview and mobile-width layout were visually checked. Existing admissions logic and source verification dates were preserved.

## Predefined assistant demo — 29 October 2026

Added a purple bottom-right AI assistant launcher and a non-modal, responsive chat panel. All six sample question buttons reuse existing FAQ answers and source metadata. The panel is explicitly labeled as an MVP concept with predefined answers, not a live AI service. No text entry, model, API calls or persistent chat storage were introduced.

TypeScript and Vite production build passed. Browser checks confirmed open/close, all sample buttons, visible answers, conversation reset, Escape dismissal with focus return, and the English next-step link opening the correct page. Checked in desktop Chromium and a 390px-wide iframe; the mobile panel fits the viewport and the conversation scrolls separately. No application console errors were captured. Screenshot: `screenshots/assistant-demo.jpg`.

## English, Russian and Kazakh — 29 October 2026

Added a shared, persistent EN/RU/KZ language selector and translated navigation, page content, forms, validation, checklist stages, FAQ, fee information, deadlines, contacts and predefined assistant. Scores, prices, document identifiers, URLs and rules retain the original structured source values. Official certificate titles and portal field names are preserved. Browser coverage checks across all ten detail views found only intentionally retained certificate names and email addresses as standalone English text in Kazakh mode. Tested Russian empty-score validation, Russian assistant answer, Kazakh deadline filtering after a language change and checklist progress after switching languages and refreshing. Fixed deadline filters to retain canonical internal values across language changes. Dates use explicit month names because the browser runtime returned placeholder month names for Kazakh Intl formatting.

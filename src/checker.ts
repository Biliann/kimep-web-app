import { programs, isProgramId } from "./programs.ts";
export type CheckerInput = {
  citizenship: string;
  route: string;
  program: string;
  subjects: string;
  scores: string[];
};
export function checkAdmission(input: CheckerInput) {
  if (!isProgramId(input.program))
    return {
      status: "review",
      title: "This program needs a separate check.",
      detail:
        "Choose one of the supported programs or ask Admissions about another major.",
    };
  const program = programs[input.program];
  if (input.citizenship !== "kz" || input.route !== "school")
    return {
      status: "review",
      title: "Your application needs an individual review.",
      detail:
        "International, vocational and transfer routes can have different rules. Contact Admissions; the local high-school UNT thresholds are not applied to you.",
    };
  if (input.subjects !== program.subjectKey)
    return {
      status: "warning",
      title: "Check your UNT profile subjects.",
      detail:
        "Select the published subject combination shown for your chosen program, or ask Admissions about your options.",
    };
  const scores = input.scores.map(Number);
  if (
    input.scores.length !== 5 ||
    input.scores.some((x) => x.trim() === "") ||
    scores.some(
      (s, i) => !Number.isInteger(s) || s < 0 || s > program.sectionMaximums[i],
    )
  )
    return {
      status: "invalid",
      title: "Enter all five valid section scores.",
      detail:
        "Use whole numbers: literacy sections 0–10, History 0–20, profile subjects 0–50.",
    };
  const total = scores.reduce((a, b) => a + b, 0);
  const below = scores.flatMap((s, i) =>
    s < program.sectionMinimums[i] ? [program.sectionNames[i]] : [],
  );
  if (total < program.unt || below.length)
    return {
      status: "warning",
      title: "Your scores are below the published minimum.",
      detail: `Total: ${total}/140 (minimum ${program.unt}). ${below.length ? "Below section minimum: " + below.join(", ") + "." : "All section minimums are met."} Contact Admissions about your next options.`,
    };
  return {
    status: "success",
    title: "You appear to meet the basic UNT requirement.",
    detail: `Your total is ${total}/140 and all five section minimums are met. Next: prepare your documents and confirm your English placement. This is not an admission decision.`,
  };
}

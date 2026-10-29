import test from "node:test";
import assert from "node:assert/strict";
import { checkAdmission, type CheckerInput } from "../src/checker.ts";
const base: CheckerInput = {
  citizenship: "kz",
  route: "school",
  program: "bis",
  subjects: "math-informatics",
  scores: ["5", "5", "10", "15", "15"],
};
test("exact total 50 with all sections passes the basic check", () =>
  assert.equal(checkAdmission(base).status, "success"));
test("49 fails despite valid section minimums", () =>
  assert.equal(
    checkAdmission({ ...base, scores: ["5", "5", "9", "15", "15"] }).status,
    "warning",
  ));
test("a low literacy score fails despite high total", () =>
  assert.equal(
    checkAdmission({ ...base, scores: ["2", "8", "20", "40", "40"] }).status,
    "warning",
  ));
test("each of the five section minimums is enforced", () => {
  for (let i = 0; i < 5; i++) {
    const scores = ["10", "10", "20", "50", "50"];
    scores[i] = String([3, 3, 5, 5, 5][i] - 1);
    assert.equal(checkAdmission({ ...base, scores }).status, "warning");
  }
});
test("blank, negative, decimals, nonnumbers and excessive inputs are invalid", () => {
  for (const value of ["", "-1", "4.5", "abc", "11"]) {
    assert.equal(
      checkAdmission({ ...base, scores: [value, "5", "10", "15", "15"] })
        .status,
      "invalid",
    );
  }
  assert.equal(
    checkAdmission({ ...base, scores: ["5", "5", "21", "15", "15"] }).status,
    "invalid",
  );
  assert.equal(
    checkAdmission({ ...base, scores: ["5", "5", "10", "51", "15"] }).status,
    "invalid",
  );
});
test("maximum valid scores pass", () =>
  assert.equal(
    checkAdmission({ ...base, scores: ["10", "10", "20", "50", "50"] }).status,
    "success",
  ));
test("international, transfer, vocational and other program need review", () => {
  for (const overrides of [
    { citizenship: "international" },
    { route: "transfer" },
    { route: "vocational" },
    { program: "other" },
  ])
    assert.equal(checkAdmission({ ...base, ...overrides }).status, "review");
});
test("mismatched subjects cannot pass", () =>
  assert.equal(
    checkAdmission({ ...base, subjects: "other" }).status,
    "warning",
  ));

for (const [major, subjectPair, threshold] of [
  ["bis", "math-informatics", 50],
  ["finance", "geography-math", 50],
  ["management", "geography-math", 50],
  ["law", "history-law", 75],
] as const) {
  test(`${major}: exact threshold passes; one below fails`, () => {
    const input = { ...base, program: major, subjects: subjectPair };
    const scores = ["3", "3", "5", "20", String(threshold - 31)];
    assert.equal(checkAdmission({ ...input, scores }).status, "success");
    scores[4] = String(threshold - 32);
    assert.equal(checkAdmission({ ...input, scores }).status, "warning");
  });
  test(`${major}: all sections and the correct subjects are mandatory`, () => {
    for (let i = 0; i < 5; i++) {
      const scores = ["10", "10", "20", "50", "50"];
      scores[i] = String([3, 3, 5, 5, 5][i] - 1);
      assert.equal(checkAdmission({ ...base, program: major, subjects: subjectPair, scores }).status, "warning");
    }
    assert.equal(checkAdmission({ ...base, program: major, subjects: "" }).status, "warning");
    assert.equal(checkAdmission({ ...base, program: major, subjects: subjectPair === "math-informatics" ? "history-law" : "math-informatics" }).status, "warning");
  });
}
test("law does not inherit the 50-point business threshold", () => {
  const result = checkAdmission({ ...base, program: "law", subjects: "history-law" });
  assert.equal(result.status, "warning");
  assert.match(result.detail, /minimum 75/);
});

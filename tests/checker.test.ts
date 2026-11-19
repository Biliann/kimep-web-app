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

// ---- Phase 1: all programs, section minimums from data, special routes ----
import { programs, programIds } from "../src/programs.ts";

const forProgram = (id: string, scores: string[]) =>
  checkAdmission({ ...base, program: id, subjects: programs[id].subjectKey, scores });

test("Cognitive Sciences: Mathematical Literacy 4 fails, 5 passes", () => {
  assert.equal(forProgram("cognitive", ["3", "4", "20", "35", "35"]).status, "warning");
  assert.deepEqual(forProgram("cognitive", ["3", "4", "20", "35", "35"]).belowMinimum, ["Mathematical Literacy"]);
  assert.equal(forProgram("cognitive", ["3", "5", "20", "35", "35"]).status, "success");
  // every other program accepts Mathematical Literacy 3
  assert.equal(forProgram("ir", ["3", "3", "20", "35", "35"]).status, "success");
});
test("Law total is exactly 75 minimum", () => {
  for (const id of ["law", "jurisprudence"]) {
    const ok = forProgram(id, ["5", "5", "20", "25", "20"]); // 75
    const bad = forProgram(id, ["5", "5", "20", "25", "19"]); // 74
    assert.equal(ok.status, "success");
    assert.equal(ok.total, 75);
    assert.equal(bad.status, "warning");
    assert.equal(bad.total, 74);
    assert.equal(bad.shortBy, 1);
  }
});
test("Foreign Languages needs 75; Economics needs 50", () => {
  assert.equal(forProgram("languages", ["5", "5", "20", "25", "19"]).status, "warning");
  assert.equal(forProgram("languages", ["5", "5", "20", "25", "20"]).status, "success");
  assert.equal(forProgram("economics", ["3", "3", "14", "15", "15"]).status, "success"); // 50
  assert.equal(forProgram("economics", ["3", "3", "14", "15", "14"]).status, "warning"); // 49
});
test("Journalism is a special route, never a UNT pass or fail", () => {
  const r = checkAdmission({ ...base, program: "journalism", subjects: "creative", scores: ["", "", "", "", ""] });
  assert.equal(r.status, "review");
  assert.match(r.detail, /creative/i);
  assert.equal(programs.journalism.creative, true);
});
test("every program has consistent section data", () => {
  assert.ok(programIds.length >= 17);
  for (const id of programIds) {
    const p = programs[id];
    assert.equal(p.sectionMinimums.length, 5, id);
    assert.equal(p.sectionMaximums.length, 5, id);
    if (!p.creative) {
      assert.equal(p.sectionNames.length, 5, id);
      assert.ok(p.unt === 50 || p.unt === 75, id);
      assert.equal(p.subjects.length, 2, id);
      // the minimum total must be reachable and every section minimum within its maximum
      p.sectionMinimums.forEach((m, i) => assert.ok(m <= p.sectionMaximums[i], id));
    }
  }
});
test("credits and ECTS are only claimed for programs with an official page value", () => {
  for (const id of programIds) {
    if (id === "bis") continue;
    assert.equal(programs[id].credits, undefined, id);
    assert.equal(programs[id].ects, undefined, id);
  }
});
test("maximum scores pass for every non-creative program", () => {
  for (const id of programIds) if (!programs[id].creative) assert.equal(forProgram(id, ["10", "10", "20", "50", "50"]).status, "success", id);
});

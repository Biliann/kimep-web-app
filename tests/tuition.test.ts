import test from "node:test";
import assert from "node:assert/strict";
import { calculateTuition, rates } from "../src/tuition.ts";
import { programs, programIds } from "../src/programs.ts";

const tuitionOnly = (credits: number, semesters: number) =>
  calculateTuition({ creditsPerSemester: credits, semesters }).program.lines.find((l) => l.id === "tuition")!.amount;

test("price list examples: 30, 36 credits a year and the 146-credit program", () => {
  assert.equal(rates.perCredit, 163230);
  assert.equal(calculateTuition({ creditsPerSemester: 15 }).year.lines[0].amount, 4896900);
  assert.equal(calculateTuition({ creditsPerSemester: 18 }).year.lines[0].amount, 5876280);
  const full = calculateTuition({ creditsPerSemester: 18, totalCredits: 146 }).program;
  assert.equal(full.lines[0].amount, 23831580);
  assert.equal(full.semesters, 9); // ceil(146 / 18)
  assert.equal(tuitionOnly(15, 8), 120 * 163230);
});
test("fees are per semester or per academic year, deposits are separate", () => {
  const y = calculateTuition({ creditsPerSemester: 15 }).year;
  assert.equal(y.fees, 2 * 9130 + 6560);
  assert.equal(y.deposits, 74270);
  assert.equal(y.total, 4896900 + 2 * 9130 + 6560 + 74270);
  const s = calculateTuition({ creditsPerSemester: 15 }).semester;
  assert.equal(s.fees, 9130 + 6560); // first semester also opens the academic year
  const three = calculateTuition({ creditsPerSemester: 15, semesters: 3 }).program;
  assert.equal(three.fees, 3 * 9130 + 2 * 6560);
  assert.equal(three.deposits, 2 * 74270);
});
test("a grant reduces tuition only, never fees, deposits, housing or Foundation", () => {
  const input = { creditsPerSemester: 15, semesters: 2, dormitory: true, dormMonthsPerYear: 9, foundationLevels: 1 } as const;
  const none = calculateTuition({ ...input, scholarshipPercent: 0 }).year;
  const half = calculateTuition({ ...input, scholarshipPercent: 50 }).year;
  const all = calculateTuition({ ...input, scholarshipPercent: 100 }).year;
  assert.equal(none.grant, 0);
  assert.equal(half.grant, 4896900 / 2);
  assert.equal(all.tuitionAfterGrant, 0);
  for (const k of ["fees", "deposits", "housing", "foundation"] as const) {
    assert.equal(half[k], none[k]);
    assert.equal(all[k], none[k]);
  }
  assert.equal(all.total, none.fees + none.deposits + none.housing + none.foundation);
});
test("housing and Foundation English use the published rates", () => {
  const y = calculateTuition({ creditsPerSemester: 15, dormitory: true, dormMonthsPerYear: 10, foundationLevels: 2 }).year;
  assert.equal(y.housing, 10 * 108050);
  assert.equal(y.deposits, 74270 + 2 * 71180);
  assert.equal(y.foundation, 2 * 682320);
  const noDorm = calculateTuition({ creditsPerSemester: 15, dormitory: false, dormMonthsPerYear: 10 }).year;
  assert.equal(noDorm.housing, 0);
});
test("inputs are clamped to sane values", () => {
  const r = calculateTuition({ creditsPerSemester: -5, semesters: 999, scholarshipPercent: 500, foundationLevels: 9 });
  assert.equal(r.semester.credits, 1);
  assert.equal(r.program.semesters, 16);
  assert.equal(r.year.grant, r.year.lines[0].amount);
  assert.equal(r.year.foundation, 3 * 682320);
});
test("the same per-credit price applies to every undergraduate program", () => {
  for (const id of programIds) assert.ok(programs[id].name.startsWith("Bachelor"), id);
  assert.equal(rates.perCredit, 163230);
});

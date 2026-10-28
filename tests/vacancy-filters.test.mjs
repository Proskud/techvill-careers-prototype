import test from "node:test";
import assert from "node:assert/strict";
import { directionLabel, matchesVacancy, salaryLabel, vacancyCountLabel } from "../src/data/vacancy-filters.mjs";

test("Russian vacancy counts include empty results", () => {
  assert.equal(vacancyCountLabel(0), "0 вакансий");
  assert.equal(vacancyCountLabel(1), "1 вакансия");
  assert.equal(vacancyCountLabel(2), "2 вакансии");
  assert.equal(vacancyCountLabel(11), "11 вакансий");
  assert.equal(vacancyCountLabel(21), "21 вакансия");
});

test("direction label reflects zero, one or multiple selections", () => {
  assert.equal(directionLabel([]), "Все направления");
  assert.equal(directionLabel(["ai"]), "AI и данные");
  assert.equal(directionLabel(["ai", "product"]), "2 направления");
  assert.equal(directionLabel(["ai", "product", "platform"]), "3 направления");
});

test("selected directions use union; title search intersects the selection", () => {
  const jobs = [{ title: "ML-инженер", direction: "ai" }, { title: "Product designer", direction: "product" }, { title: "DevOps", direction: "platform" }];
  assert.equal(jobs.filter(job => matchesVacancy(job, [], "")).length, 3);
  assert.equal(jobs.filter(job => matchesVacancy(job, ["ai", "product"], "")).length, 2);
  assert.equal(jobs.filter(job => matchesVacancy(job, ["ai", "product"], " DESIGNER ")).length, 1);
  assert.equal(jobs.filter(job => matchesVacancy(job, ["ai"], "designer")).length, 0);
  assert.ok(matchesVacancy({ title: "Ведущий разработчик", direction: "ai" }, [], "ВЕДУЩИЙ"));
});

test("missing or blank salaries stay absent; approved strings retain their wording", () => {
  for (const salary of [undefined, null, "", "   ", 50000]) assert.equal(salaryLabel({ salary }), "");
  assert.equal(salaryLabel({ salary: "  по договорённости  " }), "по договорённости");
});

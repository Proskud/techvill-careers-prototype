export const vacancyDirections = [
  { key: "ai", label: "AI и данные" },
  { key: "platform", label: "Платформа" },
  { key: "product", label: "Продукты" },
];

// Optional approved display string; missing salary must not create an empty block.
export function salaryLabel(job) {
  return typeof job.salary === "string" ? job.salary.trim() : "";
}

// Vacancy row subtitle: approved salary («от 100 000 ₽»), schedule and work format, skipping whatever is missing.
// Never invent a salary — a job without an approved `salary` string simply shows schedule and format.
export function vacancySubtitle(job) {
  const schedule = typeof job.schedule === "string" ? job.schedule.trim() : "";
  const format = typeof job.format === "string" ? job.format.trim() : "";
  return [salaryLabel(job), schedule, format].filter(Boolean).join(" · ");
}

export function vacancyCountLabel(count) {
  const last = count % 10;
  const lastTwo = count % 100;
  const noun = lastTwo >= 11 && lastTwo <= 14 ? "вакансий" : last === 1 ? "вакансия" : last >= 2 && last <= 4 ? "вакансии" : "вакансий";
  return `${count} ${noun}`;
}

export function directionLabel(selected) {
  if (!selected.length) return "Все направления";
  if (selected.length === 1) return vacancyDirections.find(item => item.key === selected[0])?.label || "Все направления";
  return `${selected.length} направления`;
}

export function matchesVacancy(job, selected, query) {
  const normalized = value => value.trim().toLocaleLowerCase("ru").replaceAll("ё", "е").replaceAll("\u00a0", " ").replace(/[‑–—]/g, "-");
  return (!selected.length || selected.includes(job.direction)) && normalized(job.title).includes(normalized(query));
}

import { MONTHS } from "@/lib/data";

export function isTimelineOverdue(timeline: string): boolean {
  const parts = timeline.trim().split(" ");
  if (parts.length !== 2) return false;

  const [monthName, yearStr] = parts;
  const monthIndex = MONTHS.findIndex((m) => m === monthName);
  const year = parseInt(yearStr);

  if (monthIndex === -1 || isNaN(year)) return false;

  // overdue once we're past the end of that target month
  const endOfTargetMonth = new Date(year, monthIndex + 1, 0, 23, 59, 59);
  return new Date() > endOfTargetMonth;
}

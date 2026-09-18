import { format, formatDistanceToNow, differenceInDays } from "date-fns";

export function formatDate(dateStr: string): string {
  return format(new Date(dateStr), "MMM d, yyyy");
}

export function formatDateShort(dateStr: string): string {
  return format(new Date(dateStr), "MMM d");
}

export function getArcDay(startDate: string): number {
  return differenceInDays(new Date(), new Date(startDate)) + 1;
}

export function getTodayString(): string {
  return new Date().toISOString().split("T")[0];
}

export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

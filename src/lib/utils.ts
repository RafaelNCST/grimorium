import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a timestamp as a relative time string (e.g., "há 2 dias", "há 1 semana")
 * @param timestamp - The timestamp to format
 * @param locale - The locale to use for formatting (default: "pt")
 * @returns A formatted relative time string
 */
export function formatRelativeTime(timestamp: number, locale: string = "pt"): string {
  const now = Date.now();
  const diffInMs = now - timestamp;
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  const diffInWeeks = Math.floor(diffInDays / 7);
  const diffInMonths = Math.floor(diffInDays / 30);
  const diffInYears = Math.floor(diffInDays / 365);

  if (locale === "pt" || locale === "pt-BR") {
    if (diffInMinutes < 1) return "agora";
    if (diffInMinutes < 60) return `há ${diffInMinutes} minuto${diffInMinutes > 1 ? "s" : ""}`;
    if (diffInHours < 24) return `há ${diffInHours} hora${diffInHours > 1 ? "s" : ""}`;
    if (diffInDays < 7) return `há ${diffInDays} dia${diffInDays > 1 ? "s" : ""}`;
    if (diffInWeeks < 4) return `há ${diffInWeeks} semana${diffInWeeks > 1 ? "s" : ""}`;
    if (diffInMonths < 12) return `há ${diffInMonths} ${diffInMonths === 1 ? "mês" : "meses"}`;
    return `há ${diffInYears} ano${diffInYears > 1 ? "s" : ""}`;
  }

  // English
  if (diffInMinutes < 1) return "now";
  if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`;
  if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
  if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
  if (diffInWeeks < 4) return `${diffInWeeks} week${diffInWeeks > 1 ? "s" : ""} ago`;
  if (diffInMonths < 12) return `${diffInMonths} month${diffInMonths > 1 ? "s" : ""} ago`;
  return `${diffInYears} year${diffInYears > 1 ? "s" : ""} ago`;
}

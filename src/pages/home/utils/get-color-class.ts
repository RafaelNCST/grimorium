export function getColorClass(days: number): string {
  if (days === 0) return "text-green-400";
  if (days <= 2) return "text-green-300";
  if (days <= 5) return "text-yellow-300";
  if (days <= 10) return "text-orange-400";
  return "text-red-400";
}

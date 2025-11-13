/**
 * Safely parses JSON with fallback
 * @param value - String to parse
 * @param fallback - Default value if parsing fails
 * @returns Parsed value or fallback
 */
export function safeJsonParse<T = string[]>(
  value: string | undefined | null | unknown,
  fallback: T = [] as T
): T {
  // If value is null or undefined, return fallback
  if (value === null || value === undefined) {
    return fallback;
  }

  // If value is already an array, return it as is
  if (Array.isArray(value)) {
    return value as T;
  }

  // If value is not a string, return fallback
  if (typeof value !== 'string') {
    return fallback;
  }

  // If value is an empty string, return fallback
  if (value.trim() === '') {
    return fallback;
  }

  // Try to parse JSON
  try {
    const parsed = JSON.parse(value);
    return parsed as T;
  } catch (error) {
    console.warn('[safeJsonParse] Failed to parse JSON:', value, error);
    return fallback;
  }
}

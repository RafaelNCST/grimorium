import { z } from "zod";

/**
 * Safely parses JSON with Zod validation
 * @param value - The JSON string to parse
 * @param schema - The Zod schema to validate against
 * @param fallback - The fallback value if parsing or validation fails
 * @returns The parsed and validated value, or the fallback
 */
export function safeJSONParse<T>(
  value: string | null | undefined,
  schema: z.ZodType<T>,
  fallback: T
): T {
  if (!value) {
    return fallback;
  }

  try {
    const parsed = JSON.parse(value);
    const result = schema.safeParse(parsed);

    if (result.success) {
      return result.data;
    } else {
      console.warn("[safeJSONParse] Validation failed:", result.error);
      return fallback;
    }
  } catch (error) {
    console.warn("[safeJSONParse] Parse error:", error);
    return fallback;
  }
}

// Common schemas for reuse
export const stringArraySchema = z.array(z.string());
export const numberArraySchema = z.array(z.number());
export const unknownObjectSchema = z.record(z.unknown());
export const unknownArraySchema = z.array(z.unknown());

// Entity reference schema (used in many places)
export const entityRefSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
});

export const entityRefArraySchema = z.array(entityRefSchema);

// Region/Location schema
export const locationSchema = z.object({
  id: z.string(),
  name: z.string(),
});

export const locationArraySchema = z.array(locationSchema);

// Faction timeline era schema
export const factionTimelineEraSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  events: z.array(z.unknown()).optional(),
});

export const factionTimelineSchema = z.array(factionTimelineEraSchema);

// Hierarchy title schema
export const hierarchyTitleSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  level: z.number().optional(),
  characterId: z.string().optional(),
});

export const hierarchySchema = z.array(hierarchyTitleSchema);

// Field visibility schema
export const fieldVisibilitySchema = z.record(z.boolean());

// Sticky note schema (for books)
export const stickyNoteSchema = z.object({
  id: z.string(),
  content: z.string(),
  color: z.string().optional(),
  position: z
    .object({
      x: z.number(),
      y: z.number(),
    })
    .optional(),
});

export const stickyNotesSchema = z.array(stickyNoteSchema);

// Checklist item schema (for books)
export const checklistItemSchema = z.object({
  id: z.string(),
  text: z.string(),
  completed: z.boolean(),
});

export const checklistItemsSchema = z.array(checklistItemSchema);

// Sections config schema (for books)
export const sectionConfigSchema = z.object({
  id: z.string(),
  visible: z.boolean(),
  order: z.number().optional(),
});

export const sectionsConfigSchema = z.array(sectionConfigSchema);

// Tabs config schema (for books)
export const tabConfigSchema = z.object({
  id: z.string(),
  label: z.string(),
  visible: z.boolean(),
  order: z.number().optional(), // Optional for backward compatibility
});

export const tabsConfigSchema = z.array(tabConfigSchema);

// Content block schema (for power system)
export const blockContentSchema = z.unknown(); // This should be refined based on actual BlockContent type

// Helper functions for specific common cases
export function safeParseStringArray(
  value: string | null | undefined
): string[] {
  return safeJSONParse(value, stringArraySchema, []);
}

export function safeParseEntityRefs(
  value: string | null | undefined
): Array<{ id: string; name?: string }> {
  return safeJSONParse(value, entityRefArraySchema, []);
}

export function safeParseLocations(
  value: string | null | undefined
): Array<{ id: string; name: string }> {
  return safeJSONParse(value, locationArraySchema, []);
}

export function safeParseFieldVisibility(
  value: string | null | undefined
): Record<string, boolean> {
  return safeJSONParse(value, fieldVisibilitySchema, {});
}

export function safeParseUnknownObject(
  value: string | null | undefined
): Record<string, unknown> {
  return safeJSONParse(value, unknownObjectSchema, {});
}

export function safeParseUnknownArray(
  value: string | null | undefined
): unknown[] {
  return safeJSONParse(value, unknownArraySchema, []);
}

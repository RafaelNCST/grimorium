import { z } from "zod";

export const factionFormSchema = z.object({
  // Basic Required fields
  image: z.string().optional(),
  name: z
    .string()
    .min(1, "validation.name_required")
    .max(200, "validation.name_max_length"),
  summary: z
    .string()
    .min(1, "validation.summary_required")
    .max(500, "validation.summary_max_length"),
  status: z.string().min(1, "validation.status_required"),
  factionType: z.string().min(1, "validation.faction_type_required"),

  // Advanced - Alignment
  alignment: z.string().optional(),

  // Advanced - Relationships
  influence: z.string().optional(),
  publicReputation: z.string().optional(),
  externalInfluence: z
    .string()
    .max(500, "validation.external_influence_max_length")
    .optional(),

  // Advanced - Internal Structure
  governmentForm: z
    .string()
    .max(500, "validation.government_form_max_length")
    .optional(),
  rulesAndLaws: z.array(z.string()).optional(),
  importantSymbols: z.array(z.string()).optional(),
  mainResources: z.array(z.string()).optional(),
  economy: z.string().max(500, "validation.economy_max_length").optional(),
  treasuresAndSecrets: z.array(z.string()).optional(),
  currencies: z.array(z.string()).optional(),

  // Advanced - Power (1-10 scale)
  militaryPower: z.number().min(1).max(10).optional(),
  politicalPower: z.number().min(1).max(10).optional(),
  culturalPower: z.number().min(1).max(10).optional(),
  economicPower: z.number().min(1).max(10).optional(),

  // Advanced - Culture
  factionMotto: z
    .string()
    .max(300, "validation.faction_motto_max_length")
    .optional(),
  traditionsAndRituals: z.array(z.string()).optional(),
  beliefsAndValues: z.array(z.string()).optional(),
  languagesUsed: z.array(z.string()).optional(),
  uniformAndAesthetics: z
    .string()
    .max(500, "validation.uniform_aesthetics_max_length")
    .optional(),
  races: z.array(z.string()).optional(),

  // Advanced - History
  foundationDate: z
    .string()
    .max(200, "validation.foundation_date_max_length")
    .optional(),
  foundationHistorySummary: z
    .string()
    .max(500, "validation.foundation_history_max_length")
    .optional(),
  founders: z.array(z.string()).optional(),
  chronology: z
    .array(
      z.object({
        id: z.string(),
        title: z.string(),
        date: z.string(),
        description: z.string().max(500),
      })
    )
    .optional(),

  // Advanced - Narrative
  organizationObjectives: z
    .string()
    .max(500, "validation.objectives_max_length")
    .optional(),
  narrativeImportance: z
    .string()
    .max(500, "validation.narrative_importance_max_length")
    .optional(),
  inspirations: z
    .string()
    .max(500, "validation.inspirations_max_length")
    .optional(),
});

export type FactionFormSchema = z.infer<typeof factionFormSchema>;

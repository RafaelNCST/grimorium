import { z } from "zod";

export const FactionSchema = z.object({
  // Campos obrigatórios
  name: z
    .string()
    .min(1, { message: "faction-detail:validation.name_required" })
    .max(200, { message: "faction-detail:validation.name_max_length" })
    .trim(),

  summary: z
    .string()
    .min(1, { message: "faction-detail:validation.summary_required" })
    .max(500, { message: "faction-detail:validation.summary_max_length" })
    .trim(),

  status: z
    .string()
    .min(1, { message: "faction-detail:validation.status_required" }),

  factionType: z
    .string()
    .min(1, { message: "faction-detail:validation.faction_type_required" }),

  // Campos opcionais
  image: z.string().optional(),

  // Internal Structure
  governmentForm: z
    .string()
    .max(500, {
      message: "faction-detail:validation.government_form_max_length",
    })
    .optional(),
  rulesAndLaws: z.array(z.string()).optional(),
  mainResources: z.array(z.string()).optional(),
  economy: z
    .string()
    .max(500, { message: "faction-detail:validation.economy_max_length" })
    .optional(),
  symbolsAndSecrets: z
    .string()
    .max(500, {
      message: "faction-detail:validation.symbols_and_secrets_max_length",
    })
    .optional(),
  currencies: z.array(z.string()).optional(),

  // Relationships
  influence: z.string().optional(),
  publicReputation: z.string().optional(),
  externalInfluence: z
    .string()
    .max(500, {
      message: "faction-detail:validation.external_influence_max_length",
    })
    .optional(),

  // Culture
  factionMotto: z
    .string()
    .max(300, { message: "faction-detail:validation.faction_motto_max_length" })
    .optional(),
  traditionsAndRituals: z.array(z.string()).optional(),
  beliefsAndValues: z.array(z.string()).optional(),
  languagesUsed: z.array(z.string()).optional(),
  uniformAndAesthetics: z
    .string()
    .max(500, {
      message: "faction-detail:validation.uniform_and_aesthetics_max_length",
    })
    .optional(),
  races: z.array(z.string()).optional(),

  // History
  foundationDate: z
    .string()
    .max(200, {
      message: "faction-detail:validation.foundation_date_max_length",
    })
    .optional(),
  foundationHistorySummary: z
    .string()
    .max(500, {
      message:
        "faction-detail:validation.foundation_history_summary_max_length",
    })
    .optional(),
  founders: z.array(z.string()).optional(),
  alignment: z.string().optional(),

  // Narrative
  organizationObjectives: z
    .string()
    .max(500, {
      message: "faction-detail:validation.organization_objectives_max_length",
    })
    .optional(),
  narrativeImportance: z
    .string()
    .max(500, {
      message: "faction-detail:validation.narrative_importance_max_length",
    })
    .optional(),
  inspirations: z
    .string()
    .max(500, { message: "faction-detail:validation.inspirations_max_length" })
    .optional(),

  // Power
  militaryPower: z.number().min(1).max(10).optional(),
  politicalPower: z.number().min(1).max(10).optional(),
  culturalPower: z.number().min(1).max(10).optional(),
  economicPower: z.number().min(1).max(10).optional(),

  // Relations (não validamos aqui pois são objetos complexos)
  hierarchy: z.any().optional(),
});

export type FactionFormData = z.infer<typeof FactionSchema>;

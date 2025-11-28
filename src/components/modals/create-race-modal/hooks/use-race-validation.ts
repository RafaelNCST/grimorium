import { z } from "zod";

export const raceFormSchema = z.object({
  // Required basic fields
  name: z
    .string()
    .min(1, "validation.name_required")
    .max(150, "validation.name_max_length"),
  domain: z.array(z.string()).min(1, "validation.domain_required"),
  summary: z
    .string()
    .min(1, "validation.summary_required")
    .max(500, "validation.summary_max_length"),

  // Optional basic fields
  image: z.string().optional(),
  scientificName: z
    .string()
    .max(150, "validation.scientific_name_max_length")
    .optional(),

  // Culture and Myths (all optional)
  alternativeNames: z.array(z.string().max(100)).optional(),
  culturalNotes: z
    .string()
    .max(1500, "validation.cultural_notes_max_length")
    .optional(),

  // Appearance and Characteristics (all optional)
  generalAppearance: z
    .string()
    .max(500, "validation.general_appearance_max_length")
    .optional(),
  lifeExpectancy: z
    .string()
    .max(100, "validation.life_expectancy_max_length")
    .optional(),
  averageHeight: z
    .string()
    .max(100, "validation.average_height_max_length")
    .optional(),
  averageWeight: z
    .string()
    .max(100, "validation.average_weight_max_length")
    .optional(),
  specialPhysicalCharacteristics: z
    .string()
    .max(500, "validation.special_physical_characteristics_max_length")
    .optional(),

  // Behaviors (all optional)
  habits: z.string().optional(),
  reproductiveCycle: z.string().optional(),
  otherReproductiveCycleDescription: z
    .string()
    .max(500, "validation.other_reproductive_cycle_max_length")
    .optional(),
  diet: z.string().optional(),
  elementalDiet: z
    .string()
    .max(50, "validation.elemental_diet_max_length")
    .optional(),
  communication: z.array(z.string()).optional(),
  moralTendency: z.string().optional(),
  socialOrganization: z
    .string()
    .max(500, "validation.social_organization_max_length")
    .optional(),
  habitat: z.array(z.string().max(50)).optional(),

  // Power (all optional)
  physicalCapacity: z.string().optional(),
  specialCharacteristics: z
    .string()
    .max(500, "validation.special_characteristics_max_length")
    .optional(),
  weaknesses: z
    .string()
    .max(500, "validation.weaknesses_max_length")
    .optional(),

  // Narrative (all optional)
  storyMotivation: z
    .string()
    .max(500, "validation.story_motivation_max_length")
    .optional(),
  inspirations: z
    .string()
    .max(500, "validation.inspirations_max_length")
    .optional(),
});

export type RaceFormSchema = z.infer<typeof raceFormSchema>;

import { z } from "zod";

export const characterFormSchema = z.object({
  // Required fields
  name: z.string().min(1, "validation.name_required").max(100, "validation.name_max_length"),
  role: z.string().min(1, "validation.role_required"),
  age: z.string().min(1, "validation.age_required"),
  gender: z.string().min(1, "validation.gender_required"),
  description: z.string().min(1, "validation.description_required").max(500, "validation.description_max_length"),
  image: z.string().optional(),

  // Appearance (Advanced - all optional)
  height: z.string().optional(),
  skinTone: z.string().optional(),
  skinToneColor: z.string().optional(),
  weight: z.string().optional(),
  physicalType: z.string().optional(),
  hair: z.string().optional(),
  eyes: z.string().optional(),
  face: z.string().optional(),
  distinguishingFeatures: z.string().optional(),
  speciesAndRace: z.string().optional(),

  // Behavior and Tastes (Advanced - all optional)
  archetype: z.string().optional(),
  personality: z.string().max(500, "validation.personality_max_length").optional(),
  hobbies: z.string().max(250, "validation.hobbies_max_length").optional(),
  dreamsAndGoals: z.string().max(250, "validation.dreams_max_length").optional(),
  fearsAndTraumas: z.string().max(250, "validation.fears_max_length").optional(),
  favoriteFood: z.string().optional(),
  favoriteMusic: z.string().optional(),

  // Alignment (Advanced - optional)
  alignment: z.string().optional(),

  // Locations and Organizations (Advanced - all optional)
  birthPlace: z.string().optional(),
  affiliatedPlace: z.string().optional(),
  organization: z.string().optional(),
});

export type CharacterFormSchema = z.infer<typeof characterFormSchema>;

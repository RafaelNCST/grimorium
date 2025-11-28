import i18next from "i18next";
import { z } from "zod";

// Helper function to get translation
const t = (key: string) => i18next.t(key);

export const CharacterSchema = z.object({
  // Campos obrigatórios
  name: z
    .string()
    .min(1, { message: "character-detail:validation.name_required" })
    .max(100, { message: "character-detail:validation.name_max_length" })
    .trim(),

  age: z
    .string()
    .min(1, { message: "character-detail:validation.age_required" })
    .max(50, { message: "character-detail:validation.age_max_length" })
    .trim(),

  role: z
    .string()
    .min(1, { message: "character-detail:validation.role_required" }),

  gender: z
    .string()
    .min(1, { message: "character-detail:validation.gender_required" }),

  description: z
    .string()
    .min(1, { message: "character-detail:validation.description_required" })
    .max(500, { message: "character-detail:validation.description_max_length" })
    .trim(),

  // Campos opcionais
  image: z.string().optional(),
  alignment: z.string().optional(),
  status: z.string().optional(),

  // Appearance fields
  height: z
    .string()
    .max(50, { message: "character-detail:validation.height_max_length" })
    .optional(),
  weight: z
    .string()
    .max(50, { message: "character-detail:validation.weight_max_length" })
    .optional(),
  skinTone: z
    .string()
    .max(100, { message: "character-detail:validation.skin_tone_max_length" })
    .optional(),
  physicalType: z.string().optional(),
  hair: z
    .string()
    .max(100, { message: "character-detail:validation.hair_max_length" })
    .optional(),
  eyes: z
    .string()
    .max(200, { message: "character-detail:validation.eyes_max_length" })
    .optional(),
  face: z
    .string()
    .max(200, { message: "character-detail:validation.face_max_length" })
    .optional(),
  distinguishingFeatures: z
    .string()
    .max(400, {
      message: "character-detail:validation.distinguishing_features_max_length",
    })
    .optional(),
  speciesAndRace: z.array(z.string()).optional(),

  // Behavior fields
  archetype: z.string().optional(),
  personality: z
    .string()
    .max(500, { message: "character-detail:validation.personality_max_length" })
    .optional(),
  hobbies: z
    .string()
    .max(500, { message: "character-detail:validation.hobbies_max_length" })
    .optional(),
  dreamsAndGoals: z
    .string()
    .max(500, {
      message: "character-detail:validation.dreams_and_goals_max_length",
    })
    .optional(),
  fearsAndTraumas: z
    .string()
    .max(500, {
      message: "character-detail:validation.fears_and_traumas_max_length",
    })
    .optional(),
  favoriteFood: z
    .string()
    .max(100, {
      message: "character-detail:validation.favorite_food_max_length",
    })
    .optional(),
  favoriteMusic: z
    .string()
    .max(100, {
      message: "character-detail:validation.favorite_music_max_length",
    })
    .optional(),

  // History
  birthPlace: z.array(z.string()).optional(),
  nicknames: z.array(z.string()).optional(),
  past: z
    .string()
    .max(1000, { message: "character-detail:validation.past_max_length" })
    .optional(),

  // Relations (não validamos aqui pois são objetos complexos)
  family: z.any().optional(),
  relationships: z.any().optional(),
});

export type CharacterFormData = z.infer<typeof CharacterSchema>;

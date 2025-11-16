import { z } from 'zod';

export const RegionSchema = z.object({
  // Campos obrigatórios
  name: z
    .string()
    .min(1, 'Nome é obrigatório')
    .max(200, 'Nome deve ter no máximo 200 caracteres')
    .trim(),

  scale: z
    .string()
    .min(1, 'Escala é obrigatória'),

  summary: z
    .string()
    .min(1, 'Resumo é obrigatório')
    .max(500, 'Resumo deve ter no máximo 500 caracteres')
    .trim(),

  // Campos opcionais
  climate: z
    .string()
    .max(200, 'Clima deve ter no máximo 200 caracteres')
    .trim()
    .optional(),
  parentId: z
    .string()
    .nullable()
    .optional(),

  image: z
    .string()
    .optional(),

  // Environment fields (opcionais exceto climate)
  currentSeason: z.string().optional(),
  customSeasonName: z.string().optional(),
  generalDescription: z.string().optional(),
  regionAnomalies: z.array(z.string()).optional(),

  // Arrays de IDs - Information fields
  residentFactions: z.array(z.string()).optional(),
  dominantFactions: z.array(z.string()).optional(),
  importantCharacters: z.array(z.string()).optional(),
  racesFound: z.array(z.string()).optional(),
  itemsFound: z.array(z.string()).optional(),

  // Narrative fields
  narrativePurpose: z.string().optional(),
  uniqueCharacteristics: z.string().optional(),
  politicalImportance: z.string().optional(),
  religiousImportance: z.string().optional(),
  worldPerception: z.string().optional(),
  regionMysteries: z.array(z.string()).optional(),
  inspirations: z.array(z.string()).optional(),
});

export type RegionFormData = z.infer<typeof RegionSchema>;

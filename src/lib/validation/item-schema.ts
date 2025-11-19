import { z } from "zod";

// Schema base sem validações condicionais (para uso com .pick(), .shape, etc.)
export const ItemSchemaBase = z.object({
  // Campos obrigatórios
  name: z
    .string()
    .min(1, "item-detail:validation.name_required")
    .max(150, "item-detail:validation.name_max_length")
    .trim(),

  status: z.string().min(1, "item-detail:validation.status_required"),

  category: z.string().min(1, "item-detail:validation.category_required"),

  basicDescription: z
    .string()
    .min(1, "item-detail:validation.basic_description_required")
    .max(500, "item-detail:validation.basic_description_max_length")
    .trim(),

  // Campos opcionais
  image: z.string().optional(),

  customCategory: z
    .string()
    .max(100, "item-detail:validation.custom_category_max_length")
    .trim()
    .optional(),

  appearance: z
    .string()
    .max(500, "item-detail:validation.appearance_max_length")
    .trim()
    .optional(),

  origin: z
    .string()
    .max(500, "item-detail:validation.origin_max_length")
    .trim()
    .optional(),

  storyRarity: z.string().optional(),

  narrativePurpose: z
    .string()
    .max(500, "item-detail:validation.narrative_purpose_max_length")
    .trim()
    .optional(),

  usageRequirements: z
    .string()
    .max(250, "item-detail:validation.usage_requirements_max_length")
    .trim()
    .optional(),

  usageConsequences: z
    .string()
    .max(250, "item-detail:validation.usage_consequences_max_length")
    .trim()
    .optional(),

  itemUsage: z
    .string()
    .max(500, "item-detail:validation.item_usage_max_length")
    .trim()
    .optional(),

  // Arrays
  alternativeNames: z.array(z.string()).optional(),
});

// Schema completo com validações condicionais
export const ItemSchema = ItemSchemaBase.refine(
  (data) => {
    // Se category é "other", customCategory deve estar preenchido
    if (data.category === "other") {
      return !!data.customCategory && data.customCategory.trim().length > 0;
    }
    return true;
  },
  {
    message: "item-detail:validation.custom_category_required",
    path: ["customCategory"], // O erro será associado ao campo customCategory
  }
);

export type ItemFormData = z.infer<typeof ItemSchema>;

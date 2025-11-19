import { z } from "zod";

export const itemFormSchema = z
  .object({
    // Required fields
    name: z
      .string()
      .min(1, "validation.name_required")
      .max(150, "validation.name_max_length"),
    status: z.string().min(1, "validation.status_required"),
    category: z.string().min(1, "validation.category_required"),
    basicDescription: z
      .string()
      .min(1, "validation.basic_description_required")
      .max(500, "validation.basic_description_max_length"),
    image: z.string().optional(),

    // Advanced fields (all optional)
    appearance: z
      .string()
      .max(500, "validation.appearance_max_length")
      .optional(),
    origin: z.string().max(500, "validation.origin_max_length").optional(),
    alternativeNames: z.array(z.string().max(100)).optional(),
    storyRarity: z.string().optional(),
    narrativePurpose: z
      .string()
      .max(500, "validation.narrative_purpose_max_length")
      .optional(),
    usageRequirements: z
      .string()
      .max(250, "validation.usage_requirements_max_length")
      .optional(),
    usageConsequences: z
      .string()
      .max(250, "validation.usage_consequences_max_length")
      .optional(),
    itemUsage: z
      .string()
      .max(500, "validation.item_usage_max_length")
      .optional(),

    // Custom category (only used when category is "other")
    customCategory: z.string().max(50).optional(),
  })
  .refine(
    (data) => {
      // Se category é "other", customCategory deve estar preenchido
      if (data.category === "other") {
        return !!data.customCategory && data.customCategory.trim().length > 0;
      }
      return true;
    },
    {
      message: "validation.custom_category_required",
      path: ["customCategory"], // O erro será associado ao campo customCategory
    }
  );

export type ItemFormSchema = z.infer<typeof itemFormSchema>;

import { z } from "zod";

import type { IPlotEvent } from "@/types/plot-types";

export const plotArcFormSchema = z.object({
  // Basic Required fields
  name: z
    .string()
    .min(1, "validation.name_required")
    .max(200, "validation.name_max_length"),
  description: z
    .string()
    .min(1, "validation.description_required")
    .max(1000, "validation.description_max_length"),
  status: z.string().min(1, "validation.status_required"),
  size: z.string().min(1, "validation.size_required"),
  focus: z
    .string()
    .min(1, "validation.focus_required")
    .max(500, "validation.focus_max_length"),
  events: z.array(z.custom<IPlotEvent>()).optional().default([]),

  // Advanced - Relationships
  importantCharacters: z.array(z.string()).optional(),
  importantFactions: z.array(z.string()).optional(),
  importantItems: z.array(z.string()).optional(),
  importantRegions: z.array(z.string()).optional(),

  // Advanced - Narrative
  arcMessage: z
    .string()
    .max(500, "validation.arc_message_max_length")
    .optional(),
  worldImpact: z
    .string()
    .max(500, "validation.world_impact_max_length")
    .optional(),
});

export type PlotArcFormSchema = z.infer<typeof plotArcFormSchema>;

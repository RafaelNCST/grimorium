import { z } from "zod";

export const NoteSchema = z.object({
  name: z
    .string()
    .min(1, "notes:validation.name_required")
    .max(200, "notes:validation.name_max_length")
    .trim(),
});

export type NoteFormData = z.infer<typeof NoteSchema>;

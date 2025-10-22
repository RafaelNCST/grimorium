import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const raceGroupSchema = z.object({
  name: z
    .string()
    .min(1, "Nome do grupo é obrigatório")
    .max(300, "Nome do grupo deve ter no máximo 300 caracteres"),
  description: z
    .string()
    .min(1, "Resumo é obrigatório")
    .max(500, "Resumo deve ter no máximo 500 caracteres"),
});

export type RaceGroupFormSchema = z.infer<typeof raceGroupSchema>;

export function useRaceGroupValidation() {
  return useForm<RaceGroupFormSchema>({
    resolver: zodResolver(raceGroupSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });
}

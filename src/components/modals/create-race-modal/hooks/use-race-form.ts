import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { raceFormSchema, type RaceFormSchema } from "./use-race-validation";

const DEFAULT_FORM_VALUES: RaceFormSchema = {
  // Required basic fields
  name: "",
  domain: [],
  summary: "",

  // Optional basic fields
  image: "",
  scientificName: "",

  // Culture and Myths
  alternativeNames: [],
  raceViews: [],
  rites: [],
  taboos: [],
  curiosities: [],

  // Appearance and Characteristics
  generalAppearance: "",
  lifeExpectancy: "",
  averageHeight: "",
  averageWeight: "",
  specialPhysicalCharacteristics: "",

  // Behaviors
  habits: "",
  reproductiveCycle: "",
  diet: "",
  elementalDiet: "",
  communication: [],
  moralTendency: "",
  socialOrganization: "",
  habitat: [],
  behavioralTendency: "",

  // Power
  physicalCapacity: "",
  specialCharacteristics: "",
  weaknesses: "",

  // Narrative
  storyMotivation: "",
  inspirations: "",
};

export const useRaceForm = () => {
  const form = useForm<RaceFormSchema>({
    resolver: zodResolver(raceFormSchema),
    defaultValues: DEFAULT_FORM_VALUES,
    mode: "onChange",
  });

  return form;
};

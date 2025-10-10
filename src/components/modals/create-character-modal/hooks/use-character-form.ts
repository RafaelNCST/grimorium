import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  characterFormSchema,
  type CharacterFormSchema,
} from "./use-character-validation";

const DEFAULT_FORM_VALUES: CharacterFormSchema = {
  name: "",
  role: "",
  age: "",
  gender: "",
  description: "",
  image: "",
  height: "",
  skinTone: "",
  skinToneColor: "",
  weight: "",
  physicalType: "",
  hair: "",
  eyes: "",
  face: "",
  distinguishingFeatures: "",
  speciesAndRace: "",
  archetype: "",
  personality: "",
  hobbies: "",
  dreamsAndGoals: "",
  fearsAndTraumas: "",
  favoriteFood: "",
  favoriteMusic: "",
  alignment: "",
  birthPlace: "",
  affiliatedPlace: "",
  organization: "",
};

export const useCharacterForm = () => {
  const form = useForm<CharacterFormSchema>({
    resolver: zodResolver(characterFormSchema),
    defaultValues: DEFAULT_FORM_VALUES,
    mode: "onChange",
  });

  return form;
};

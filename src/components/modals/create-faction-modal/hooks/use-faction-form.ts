import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  factionFormSchema,
  type FactionFormSchema,
} from "./use-faction-validation";

const DEFAULT_FORM_VALUES: FactionFormSchema = {
  image: "",
  name: "",
  summary: "",
  status: "",
  factionType: "",

  // Alignment
  alignment: "",

  // Relationships
  influence: "",
  publicReputation: "",
  externalInfluence: "",

  // Internal Structure
  governmentForm: "",
  rulesAndLaws: [],
  mainResources: [],
  economy: "",
  symbolsAndSecrets: "",
  currencies: [],

  // Power
  militaryPower: 5,
  politicalPower: 5,
  culturalPower: 5,
  economicPower: 5,

  // Culture
  factionMotto: "",
  traditionsAndRituals: [],
  beliefsAndValues: [],
  languagesUsed: [],
  uniformAndAesthetics: "",
  races: [],

  // History
  foundationDate: "",
  foundationHistorySummary: "",
  founders: [],

  // Narrative
  organizationObjectives: "",
  narrativeImportance: "",
  inspirations: "",
};

export const useFactionForm = () => {
  const form = useForm<FactionFormSchema>({
    resolver: zodResolver(factionFormSchema),
    defaultValues: DEFAULT_FORM_VALUES,
    mode: "onChange",
  });

  return form;
};

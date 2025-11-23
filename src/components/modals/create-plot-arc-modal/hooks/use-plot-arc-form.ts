import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  plotArcFormSchema,
  type PlotArcFormSchema,
} from "./use-plot-arc-validation";

const DEFAULT_FORM_VALUES: PlotArcFormSchema = {
  name: "",
  description: "",
  status: "",
  size: "",
  focus: "",
  events: [],

  // Relationships
  importantCharacters: [],
  importantFactions: [],
  importantItems: [],
  importantRegions: [],

  // Narrative
  arcMessage: "",
  worldImpact: "",
};

export const usePlotArcForm = () => {
  const form = useForm<PlotArcFormSchema>({
    resolver: zodResolver(plotArcFormSchema),
    defaultValues: DEFAULT_FORM_VALUES,
    mode: "onChange",
  });

  return form;
};

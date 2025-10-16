import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { itemFormSchema, type ItemFormSchema } from "./use-item-validation";

const DEFAULT_FORM_VALUES: ItemFormSchema = {
  name: "",
  status: "",
  category: "",
  basicDescription: "",
  image: "",
  appearance: "",
  origin: "",
  alternativeNames: [],
  storyRarity: "",
  narrativePurpose: "",
  usageRequirements: "",
  usageConsequences: "",
  customCategory: "",
};

export const useItemForm = () => {
  const form = useForm<ItemFormSchema>({
    resolver: zodResolver(itemFormSchema),
    defaultValues: DEFAULT_FORM_VALUES,
    mode: "onChange",
  });

  return form;
};

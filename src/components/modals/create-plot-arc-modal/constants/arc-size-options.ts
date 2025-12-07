import { Sparkle, Feather, Book, Library } from "lucide-react";

import type { GridSelectOption } from "@/components/forms/FormSelectGrid";
import type { PlotArcSize } from "@/types/plot-types";

export const ARC_SIZE_OPTIONS: GridSelectOption<PlotArcSize>[] = [
  {
    value: "mini",
    label: "sizes.mini",
    description: "sizes.mini_description",
    icon: Sparkle,
    backgroundColor: "violet-500/10",
    borderColor: "violet-500/30",
  },
  {
    value: "small",
    label: "sizes.small",
    description: "sizes.small_description",
    icon: Feather,
    backgroundColor: "blue-500/10",
    borderColor: "blue-500/30",
  },
  {
    value: "medium",
    label: "sizes.medium",
    description: "sizes.medium_description",
    icon: Book,
    backgroundColor: "indigo-500/10",
    borderColor: "indigo-500/30",
  },
  {
    value: "large",
    label: "sizes.large",
    description: "sizes.large_description",
    icon: Library,
    backgroundColor: "purple-500/10",
    borderColor: "purple-500/30",
  },
];

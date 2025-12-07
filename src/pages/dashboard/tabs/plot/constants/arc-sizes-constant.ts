import { Sparkle, Feather, Book, Library } from "lucide-react";

import type { PlotArcSize } from "@/types/plot-types";

import type { LucideIcon } from "lucide-react";

export interface IArcSizeConstant {
  value: PlotArcSize;
  icon: LucideIcon;
  color: string;
  hoverColor: string;
  activeColor: string;
  translationKey: string;
  descriptionKey: string;
}

export const ARC_SIZES_CONSTANT: IArcSizeConstant[] = [
  {
    value: "mini",
    icon: Sparkle,
    color: "bg-card text-muted-foreground border-border",
    hoverColor:
      "hover:bg-violet-500/10 hover:text-violet-600 hover:border-violet-500/20",
    activeColor:
      "bg-violet-500/20 text-violet-600 border-violet-500/30 ring-2 ring-violet-500/50",
    translationKey: "sizes.mini",
    descriptionKey: "sizes.mini_description",
  },
  {
    value: "small",
    icon: Feather,
    color: "bg-card text-muted-foreground border-border",
    hoverColor:
      "hover:bg-blue-500/10 hover:text-blue-600 hover:border-blue-500/20",
    activeColor:
      "bg-blue-500/20 text-blue-600 border-blue-500/30 ring-2 ring-blue-500/50",
    translationKey: "sizes.small",
    descriptionKey: "sizes.small_description",
  },
  {
    value: "medium",
    icon: Book,
    color: "bg-card text-muted-foreground border-border",
    hoverColor:
      "hover:bg-indigo-500/10 hover:text-indigo-600 hover:border-indigo-500/20",
    activeColor:
      "bg-indigo-500/20 text-indigo-600 border-indigo-500/30 ring-2 ring-indigo-500/50",
    translationKey: "sizes.medium",
    descriptionKey: "sizes.medium_description",
  },
  {
    value: "large",
    icon: Library,
    color: "bg-card text-muted-foreground border-border",
    hoverColor:
      "hover:bg-purple-500/10 hover:text-purple-600 hover:border-purple-500/20",
    activeColor:
      "bg-purple-500/20 text-purple-600 border-purple-500/30 ring-2 ring-purple-500/50",
    translationKey: "sizes.large",
    descriptionKey: "sizes.large_description",
  },
];

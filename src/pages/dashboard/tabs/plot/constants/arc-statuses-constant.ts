import { CheckCircle2, Sparkles, Clock } from "lucide-react";

import type { PlotArcStatus } from "@/types/plot-types";

import type { LucideIcon } from "lucide-react";

export interface IArcStatusConstant {
  value: PlotArcStatus;
  icon: LucideIcon;
  color: string;
  hoverColor: string;
  activeColor: string;
  translationKey: string;
}

export const ARC_STATUSES_CONSTANT: IArcStatusConstant[] = [
  {
    value: "finalizado",
    icon: CheckCircle2,
    color: "bg-card text-muted-foreground border-border",
    hoverColor:
      "hover:bg-emerald-500/10 hover:text-emerald-600 hover:border-emerald-500/20",
    activeColor:
      "bg-emerald-500/20 text-emerald-600 border-emerald-500/30 ring-2 ring-emerald-500/50",
    translationKey: "statuses.finished",
  },
  {
    value: "atual",
    icon: Sparkles,
    color: "bg-card text-muted-foreground border-border",
    hoverColor:
      "hover:bg-blue-500/10 hover:text-blue-600 hover:border-blue-500/20",
    activeColor:
      "bg-blue-500/20 text-blue-600 border-blue-500/30 ring-2 ring-blue-500/50",
    translationKey: "statuses.current",
  },
  {
    value: "planejamento",
    icon: Clock,
    color: "bg-card text-muted-foreground border-border",
    hoverColor:
      "hover:bg-amber-500/10 hover:text-amber-600 hover:border-amber-500/20",
    activeColor:
      "bg-amber-500/20 text-amber-600 border-amber-500/30 ring-2 ring-amber-500/50",
    translationKey: "statuses.planning",
  },
];

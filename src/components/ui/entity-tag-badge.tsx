import { type LucideIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";

export interface IEntityTagConfig {
  value: string;
  icon: LucideIcon;
  translationKey: string;
  colorClass: string;
  bgColorClass: string;
}

interface EntityTagBadgeProps {
  config: IEntityTagConfig;
  label: string;
  className?: string;
}

export function EntityTagBadge({ config, label, className = "" }: EntityTagBadgeProps) {
  const Icon = config.icon;

  return (
    <Badge
      className={`${config.bgColorClass} ${config.colorClass} border px-3 py-1 pointer-events-none select-none ${className}`}
    >
      <Icon className="w-3.5 h-3.5 mr-1.5" />
      <span className="text-xs font-medium">{label}</span>
    </Badge>
  );
}

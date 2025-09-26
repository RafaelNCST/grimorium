import { LucideIcon } from "lucide-react";

interface PropsStatsCard {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export function StatsCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
}: PropsStatsCard) {
  return (
    <div className="bg-card rounded-xl border border-border p-6 card-magical animate-fade-in-up">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold text-foreground mt-2">{value}</p>
          {description && (
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          )}
        </div>

        <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon className="h-6 w-6 text-primary" />
        </div>
      </div>

      {trend && (
        <div className="flex items-center mt-4 pt-4 border-t border-border">
          <span
            className={`text-sm font-medium ${
              trend.isPositive ? "text-success" : "text-destructive"
            }`}
          >
            {trend.isPositive ? "+" : ""}
            {trend.value}%
          </span>
          <span className="text-sm text-muted-foreground ml-2">
            vs mês anterior
          </span>
        </div>
      )}
    </div>
  );
}

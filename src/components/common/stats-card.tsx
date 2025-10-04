import { LucideIcon } from "lucide-react";

interface SubMetric {
  label: string;
  value: string | number;
}

interface PropsStatsCard {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  subMetrics?: SubMetric[];
}

export function StatsCard({ title, value, icon: Icon, trend, subMetrics }: PropsStatsCard) {
  return (
    <div className="bg-card rounded-xl border border-border p-6 card-magical animate-fade-in-up">
      <div className="flex items-center justify-between">
        <div className="flex-1 flex items-end justify-between pr-6">
          <div className="flex flex-col flex-1">
            <span className="text-sm font-medium text-muted-foreground">{title}</span>
            <span className="text-2xl font-bold text-foreground mt-2">{value}</span>
          </div>

          {subMetrics && subMetrics.length > 0 && (
            <>
              {subMetrics.map((metric, index) => (
                <div key={index} className="flex flex-col flex-1">
                  <span className="text-sm font-medium text-muted-foreground">{metric.label}</span>
                  <span className="text-2xl font-bold text-foreground mt-2">{metric.value}</span>
                </div>
              ))}
            </>
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

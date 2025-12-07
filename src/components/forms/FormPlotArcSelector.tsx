import * as React from "react";

import { Check, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { IPlotArc } from "@/types/plot-types";

export interface FormPlotArcSelectorProps {
  label?: string;
  value?: string;
  onChange: (value: string | undefined) => void;
  availableArcs: IPlotArc[];
  required?: boolean;
  labelClassName?: string;
  containerClassName?: string;
  noArcLabel?: string;
}

/**
 * FormPlotArcSelector - Beautiful visual arc selector
 *
 * Displays arcs as elegant cards with status indicators
 */
export const FormPlotArcSelector = React.forwardRef<
  HTMLDivElement,
  FormPlotArcSelectorProps
>(
  (
    {
      label,
      value,
      onChange,
      availableArcs,
      required,
      labelClassName,
      containerClassName,
      noArcLabel,
    },
    ref
  ) => {
    const { t } = useTranslation(["empty-states"]);
    const defaultNoArcLabel = noArcLabel || t("empty-states:plot_arc.no_arc");

    const getStatusColor = (status: string) => {
      switch (status) {
        case "atual":
          return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30";
        case "planejamento":
          return "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/30";
        case "finalizado":
          return "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/30";
        default:
          return "bg-muted text-muted-foreground border-border";
      }
    };

    const getStatusLabel = (status: string) => {
      switch (status) {
        case "atual":
          return "Atual";
        case "planejamento":
          return "Planejamento";
        case "finalizado":
          return "Finalizado";
        default:
          return status;
      }
    };

    return (
      <div className={cn("space-y-3", containerClassName)} ref={ref}>
        {label && (
          <Label className={cn("flex items-center gap-1", labelClassName)}>
            {label}
            {required && <span className="text-destructive">*</span>}
          </Label>
        )}

        <div className="space-y-2">
          {/* No Arc Option */}
          <button
            type="button"
            onClick={() => onChange(undefined)}
            className={cn(
              "w-full text-left p-3 rounded-lg border-2 transition-colors duration-200",
              "hover:bg-white/5 dark:hover:bg-white/10",
              !value
                ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                : "border-border bg-card"
            )}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors",
                    !value
                      ? "border-primary bg-primary"
                      : "border-muted-foreground/30"
                  )}
                >
                  {!value && (
                    <Check className="w-3 h-3 text-primary-foreground" />
                  )}
                </div>
                <span className="text-sm font-medium text-muted-foreground">
                  {defaultNoArcLabel}
                </span>
              </div>
            </div>
          </button>

          {/* Arc Options */}
          {availableArcs.length === 0 ? (
            <div className="p-6 text-center border-2 border-dashed border-border rounded-lg bg-muted/20">
              <Sparkles className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                {t("empty-states:plot_arc.no_arc_registered")}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Crie arcos na aba Enredo
              </p>
            </div>
          ) : (
            availableArcs.map((arc) => (
              <button
                key={arc.id}
                type="button"
                onClick={() => onChange(arc.id)}
                className={cn(
                  "w-full text-left p-4 rounded-lg border-2 transition-colors duration-200",
                  "hover:bg-white/5 dark:hover:bg-white/10",
                  value === arc.id
                    ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                    : "border-border bg-card"
                )}
              >
                <div className="flex items-start gap-3">
                  {/* Selection Indicator */}
                  <div
                    className={cn(
                      "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors mt-0.5 shrink-0",
                      value === arc.id
                        ? "border-primary bg-primary"
                        : "border-muted-foreground/30"
                    )}
                  >
                    {value === arc.id && (
                      <Check className="w-3 h-3 text-primary-foreground" />
                    )}
                  </div>

                  {/* Arc Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2 min-w-0">
                        <Sparkles className="w-4 h-4 text-primary shrink-0" />
                        <h4 className="font-semibold text-sm truncate">
                          {arc.name}
                        </h4>
                      </div>
                      <span
                        className={cn(
                          "text-xs px-2 py-0.5 rounded-full border font-medium shrink-0",
                          getStatusColor(arc.status)
                        )}
                      >
                        {getStatusLabel(arc.status)}
                      </span>
                    </div>
                    {arc.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {arc.description}
                      </p>
                    )}
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    );
  }
);

FormPlotArcSelector.displayName = "FormPlotArcSelector";

import * as React from "react";

import { Check } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { ARC_STATUSES_CONSTANT } from "@/pages/dashboard/tabs/plot/constants/arc-statuses-constant";
import type { IPlotArc } from "@/types/plot-types";

export interface FormPlotArcButtonProps {
  label?: string;
  value?: string;
  onChange: (value: string | undefined) => void;
  availableArcs: IPlotArc[];
  required?: boolean;
  labelClassName?: string;
  containerClassName?: string;
  noArcLabel?: string;
  selectArcLabel?: string;
  dialogTitle?: string;
  dialogDescription?: string;
}

/**
 * FormPlotArcButton - Button that opens a mini modal to select arc
 *
 * Clean interface with a button that opens a beautiful arc selector dialog
 */
export const FormPlotArcButton = React.forwardRef<
  HTMLDivElement,
  FormPlotArcButtonProps
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
      selectArcLabel = "Selecionar arco",
      dialogTitle = "Selecionar Arco",
      dialogDescription = "Escolha o arco narrativo para este capítulo",
    },
    ref
  ) => {
    const { t } = useTranslation(["empty-states"]);
    const [isOpen, setIsOpen] = React.useState(false);
    const defaultNoArcLabel = noArcLabel || t("empty-states:plot_arc.no_arc");

    const selectedArc = availableArcs.find((arc) => arc.id === value);

    // Map status values to their display colors (matching PlotArcCard)
    const STATUS_DISPLAY_COLORS: Record<string, string> = {
      finished:
        "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400",
      current:
        "bg-blue-500/10 border-blue-500/30 text-blue-600 dark:text-blue-400",
      planning:
        "bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400",
    };

    const getStatusButtonColor = (status: string) => {
      switch (status) {
        case "current":
          return "border-blue-500/30 bg-blue-500/5 hover:bg-blue-500/10";
        case "planning":
          return "border-amber-500/30 bg-amber-500/5 hover:bg-amber-500/10";
        case "finished":
          return "border-emerald-500/30 bg-emerald-500/5 hover:bg-emerald-500/10";
        default:
          return "border-primary/30 bg-primary/5 hover:bg-primary/10";
      }
    };

    const getStatusActiveRing = (status: string) => {
      switch (status) {
        case "current":
          return "ring-2 ring-blue-500/20";
        case "planning":
          return "ring-2 ring-amber-500/20";
        case "finished":
          return "ring-2 ring-emerald-500/20";
        default:
          return "ring-2 ring-primary/20";
      }
    };

    const getStatusIconColor = (status: string) => {
      switch (status) {
        case "current":
          return "text-blue-600 dark:text-blue-400";
        case "planning":
          return "text-amber-600 dark:text-amber-400";
        case "finished":
          return "text-emerald-600 dark:text-emerald-400";
        default:
          return "text-primary";
      }
    };

    const handleSelect = (arcId: string | undefined) => {
      onChange(arcId);
      setIsOpen(false);
    };

    return (
      <>
        <div className={cn("space-y-2", containerClassName)} ref={ref}>
          {label && (
            <Label className={cn("flex items-center gap-1", labelClassName)}>
              {label}
              {required && <span className="text-destructive">*</span>}
            </Label>
          )}

          {/* Selected Arc Display or Button */}
          {selectedArc ? (
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className={cn(
                "w-full p-3 rounded-lg border-2 transition-colors text-left h-[3.5rem]",
                getStatusButtonColor(selectedArc.status)
              )}
            >
              <div className="flex items-center gap-3 h-full">
                {(() => {
                  const statusData = ARC_STATUSES_CONSTANT.find(
                    (s) => s.value === selectedArc.status
                  );
                  return statusData
                    ? React.createElement(statusData.icon, {
                        className: cn(
                          "w-5 h-5 shrink-0",
                          getStatusIconColor(selectedArc.status)
                        ),
                      })
                    : null;
                })()}
                <div className="flex-1 min-w-0 flex items-center justify-between gap-2">
                  <h4 className="font-semibold text-sm truncate">
                    {selectedArc.name}
                  </h4>
                  {(() => {
                    const statusData = ARC_STATUSES_CONSTANT.find(
                      (s) => s.value === selectedArc.status
                    );
                    return statusData ? (
                      <span
                        className={cn(
                          "text-xs px-2 py-0.5 rounded-full border font-medium shrink-0",
                          STATUS_DISPLAY_COLORS[selectedArc.status]
                        )}
                      >
                        {t(`plot:${statusData.translationKey}`)}
                      </span>
                    ) : null;
                  })()}
                </div>
              </div>
            </button>
          ) : (
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(true)}
              className="w-full h-[3.5rem] border-2 border-dashed hover:border-primary/50 hover:bg-primary/5 transition-colors"
            >
              <div className="flex items-center gap-2">
                {(() => {
                  const currentStatusData = ARC_STATUSES_CONSTANT.find(
                    (s) => s.value === "current"
                  );
                  return currentStatusData
                    ? React.createElement(currentStatusData.icon, {
                        className: "h-5 w-5 text-primary",
                      })
                    : null;
                })()}
                <span className="font-medium">{selectArcLabel}</span>
              </div>
            </Button>
          )}
        </div>

        {/* Arc Selection Dialog */}
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {(() => {
                  const currentStatusData = ARC_STATUSES_CONSTANT.find(
                    (s) => s.value === "current"
                  );
                  return currentStatusData
                    ? React.createElement(currentStatusData.icon, {
                        className: "h-5 w-5 text-primary",
                      })
                    : null;
                })()}
                {dialogTitle}
              </DialogTitle>
              <DialogDescription>{dialogDescription}</DialogDescription>
            </DialogHeader>

            <div className="flex-1 overflow-y-auto pr-2 space-y-2">
              {/* No Arc Option */}
              <button
                type="button"
                onClick={() => handleSelect(undefined)}
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
                  {(() => {
                    const currentStatusData = ARC_STATUSES_CONSTANT.find(
                      (s) => s.value === "current"
                    );
                    return currentStatusData
                      ? React.createElement(currentStatusData.icon, {
                          className:
                            "w-8 h-8 text-muted-foreground mx-auto mb-2",
                        })
                      : null;
                  })()}
                  <p className="text-sm text-muted-foreground">
                    {t("empty-states:plot_arc.no_arc_registered")}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Crie arcos na aba Enredo
                  </p>
                </div>
              ) : (
                availableArcs.map((arc) => {
                  const statusData = ARC_STATUSES_CONSTANT.find(
                    (s) => s.value === arc.status
                  );

                  return (
                    <button
                      key={arc.id}
                      type="button"
                      onClick={() => handleSelect(arc.id)}
                      className={cn(
                        "w-full text-left p-4 rounded-lg border-2 transition-colors duration-200",
                        "hover:bg-white/5 dark:hover:bg-white/10",
                        value === arc.id
                          ? cn(
                              getStatusButtonColor(arc.status),
                              getStatusActiveRing(arc.status)
                            )
                          : "border-border bg-card"
                      )}
                    >
                      <div className="flex items-start gap-3">
                        {/* Selection Indicator */}
                        <div
                          className={cn(
                            "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors mt-0.5 shrink-0",
                            value === arc.id
                              ? cn(
                                  "border-current",
                                  getStatusIconColor(arc.status),
                                  arc.status === "current" &&
                                    "bg-blue-600 dark:bg-blue-400",
                                  arc.status === "planning" &&
                                    "bg-amber-600 dark:bg-amber-400",
                                  arc.status === "finished" &&
                                    "bg-emerald-600 dark:bg-emerald-400"
                                )
                              : "border-muted-foreground/30"
                          )}
                        >
                          {value === arc.id && (
                            <Check className="w-3 h-3 text-white dark:text-background" />
                          )}
                        </div>

                        {/* Arc Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2 min-w-0">
                              {statusData &&
                                React.createElement(statusData.icon, {
                                  className: cn(
                                    "w-4 h-4 shrink-0",
                                    getStatusIconColor(arc.status)
                                  ),
                                })}
                              <h4 className="font-semibold text-sm truncate">
                                {arc.name}
                              </h4>
                            </div>
                            {statusData && (
                              <span
                                className={cn(
                                  "text-xs px-2 py-0.5 rounded-full border font-medium shrink-0",
                                  STATUS_DISPLAY_COLORS[arc.status]
                                )}
                              >
                                {t(`plot:${statusData.translationKey}`)}
                              </span>
                            )}
                          </div>
                          {arc.description && (
                            <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                              {arc.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </DialogContent>
        </Dialog>
      </>
    );
  }
);

FormPlotArcButton.displayName = "FormPlotArcButton";

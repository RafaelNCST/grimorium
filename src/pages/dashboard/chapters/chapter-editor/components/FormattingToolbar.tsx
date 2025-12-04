import React, { useState } from "react";

import {
  Bold,
  Italic,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Undo,
  Redo,
  MessageSquare,
  Sparkles,
  Clock,
  CheckCircle2,
  Check,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { IPlotArc } from "@/types/plot-types";

import { useFormatState } from "../hooks/useFormatState";
import type { ChapterStatus } from "../types";

interface FormattingToolbarProps {
  onFormat: (command: string, value?: string) => void;
  status: ChapterStatus;
  onStatusChange: (status: ChapterStatus) => void;
  plotArcId?: string;
  availableArcs: IPlotArc[];
  onPlotArcChange: (arcId: string | undefined) => void;
  onUndo?: () => void;
  onRedo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
}

const STATUS_COLORS: Record<ChapterStatus, string> = {
  "in-progress":
    "bg-blue-500/20 text-blue-300 dark:text-blue-300 border-blue-500/30",
  draft: "bg-gray-500/20 text-gray-200 dark:text-gray-200 border-gray-500/30",
  review:
    "bg-yellow-500/20 text-yellow-300 dark:text-yellow-300 border-yellow-500/30",
  finished:
    "bg-green-500/20 text-green-300 dark:text-green-300 border-green-500/30",
  published:
    "bg-purple-500/20 text-purple-300 dark:text-purple-300 border-purple-500/30",
};

export function FormattingToolbar({
  onFormat,
  status,
  onStatusChange,
  plotArcId,
  availableArcs,
  onPlotArcChange,
  onUndo,
  onRedo,
  canUndo = true,
  canRedo = true,
}: FormattingToolbarProps) {
  const { t } = useTranslation("chapter-editor");
  const selectedArc = availableArcs.find((arc) => arc.id === plotArcId);
  const [isArcModalOpen, setIsArcModalOpen] = useState(false);

  // Use format state hook to detect active formatting
  const formatState = useFormatState();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "atual":
        return Sparkles;
      case "planejamento":
        return Clock;
      case "finalizado":
        return CheckCircle2;
      default:
        return Sparkles;
    }
  };

  const getStatusIconColor = (status: string) => {
    switch (status) {
      case "atual":
        return "text-blue-600 dark:text-blue-400";
      case "planejamento":
        return "text-amber-600 dark:text-amber-400";
      case "finalizado":
        return "text-emerald-600 dark:text-emerald-400";
      default:
        return "text-primary";
    }
  };

  const getStatusButtonColor = (status: string) => {
    switch (status) {
      case "atual":
        return "border-blue-500/30 bg-blue-500/5 hover:bg-blue-500/10";
      case "planejamento":
        return "border-amber-500/30 bg-amber-500/5 hover:bg-amber-500/10";
      case "finalizado":
        return "border-emerald-500/30 bg-emerald-500/5 hover:bg-emerald-500/10";
      default:
        return "border-primary/30 bg-primary/5 hover:bg-primary/10";
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "atual":
        return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30";
      case "planejamento":
        return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30";
      case "finalizado":
        return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30";
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

  const getStatusActiveRing = (status: string) => {
    switch (status) {
      case "atual":
        return "ring-2 ring-blue-500/20";
      case "planejamento":
        return "ring-2 ring-amber-500/20";
      case "finalizado":
        return "ring-2 ring-emerald-500/20";
      default:
        return "ring-2 ring-primary/20";
    }
  };

  return (
    <TooltipProvider delayDuration={300}>
      <div className="border-b border-border bg-card sticky top-0 z-40">
        <div className="flex items-center justify-between gap-1 px-4 py-2 overflow-x-auto">
          <div className="flex items-center gap-1">
            {/* Text Formatting */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onFormat("bold")}
                  className={cn(
                    "h-8 w-8 p-0",
                    formatState.bold && "bg-accent text-accent-foreground"
                  )}
                >
                  <Bold className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Negrito (Ctrl+B)</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onFormat("italic")}
                  className={cn(
                    "h-8 w-8 p-0",
                    formatState.italic && "bg-accent text-accent-foreground"
                  )}
                >
                  <Italic className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Itálico (Ctrl+I)</p>
              </TooltipContent>
            </Tooltip>

            <Separator orientation="vertical" className="h-6 mx-1" />

            {/* Alignment */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onFormat("justifyLeft")}
                  className={cn(
                    "h-8 w-8 p-0",
                    formatState.alignLeft && "bg-accent text-accent-foreground"
                  )}
                >
                  <AlignLeft className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Alinhar à esquerda</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onFormat("justifyCenter")}
                  className={cn(
                    "h-8 w-8 p-0",
                    formatState.alignCenter &&
                      "bg-accent text-accent-foreground"
                  )}
                >
                  <AlignCenter className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Centralizar</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onFormat("justifyRight")}
                  className={cn(
                    "h-8 w-8 p-0",
                    formatState.alignRight && "bg-accent text-accent-foreground"
                  )}
                >
                  <AlignRight className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Alinhar à direita</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onFormat("justifyFull")}
                  className={cn(
                    "h-8 w-8 p-0",
                    formatState.alignJustify &&
                      "bg-accent text-accent-foreground"
                  )}
                >
                  <AlignJustify className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Justificar</p>
              </TooltipContent>
            </Tooltip>

            <Separator orientation="vertical" className="h-6 mx-1" />

            {/* Undo/Redo */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => (onUndo ? onUndo() : onFormat("undo"))}
                  disabled={!canUndo}
                  className="h-8 w-8 p-0"
                >
                  <Undo className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Desfazer (Ctrl+Z)</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => (onRedo ? onRedo() : onFormat("redo"))}
                  disabled={!canRedo}
                  className="h-8 w-8 p-0"
                >
                  <Redo className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Refazer (Ctrl+Y)</p>
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Right side: Status and Arc */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Status */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground font-medium">
                Status do capítulo:
              </span>
              <Select
                value={status}
                onValueChange={(value: ChapterStatus) => onStatusChange(value)}
              >
                <SelectTrigger
                  className={cn(
                    "w-auto min-w-[140px] h-8 text-sm border",
                    STATUS_COLORS[status]
                  )}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="in-progress">Em Andamento</SelectItem>
                  <SelectItem value="draft">Rascunho</SelectItem>
                  <SelectItem value="review">Em Revisão</SelectItem>
                  <SelectItem value="finished">Finalizado</SelectItem>
                  <SelectItem value="published">Publicado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Arc */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground font-medium">
                Arco:
              </span>
              <button
                onClick={() => setIsArcModalOpen(true)}
                className={cn(
                  "h-8 px-3 rounded-md border text-sm font-medium cursor-pointer",
                  "hover:bg-white/5 dark:hover:bg-white/10 transition-colors duration-200",
                  selectedArc
                    ? cn(getStatusButtonColor(selectedArc.status), "border")
                    : "border-border bg-background"
                )}
              >
                <div className="flex items-center gap-2">
                  {selectedArc ? (
                    <>
                      {React.createElement(getStatusIcon(selectedArc.status), {
                        className: cn(
                          "w-4 h-4",
                          getStatusIconColor(selectedArc.status)
                        ),
                      })}
                      <span>{selectedArc.name}</span>
                    </>
                  ) : (
                    <span className="text-muted-foreground">
                      {t("arc.no_arc")}
                    </span>
                  )}
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Arc Selection Modal */}
      <Dialog open={isArcModalOpen} onOpenChange={setIsArcModalOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              {t("arc.dialog_title")}
            </DialogTitle>
            <DialogDescription>{t("arc.dialog_description")}</DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto pr-2 space-y-2">
            {/* No Arc Option */}
            <button
              type="button"
              onClick={() => {
                onPlotArcChange(undefined);
              }}
              className={cn(
                "w-full text-left p-3 rounded-lg border-2 transition-colors duration-200",
                "hover:bg-white/5 dark:hover:bg-white/10",
                !plotArcId
                  ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                  : "border-border bg-card"
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors",
                      !plotArcId
                        ? "border-primary bg-primary"
                        : "border-muted-foreground/30"
                    )}
                  >
                    {!plotArcId && (
                      <Check className="w-3 h-3 text-primary-foreground" />
                    )}
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">
                    {t("arc.no_arc")}
                  </span>
                </div>
              </div>
            </button>

            {/* Arc Options */}
            {availableArcs.length === 0 ? (
              <div className="p-6 text-center border-2 border-dashed border-border rounded-lg bg-muted/20">
                <Sparkles className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  Nenhum arco cadastrado
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Crie arcos na aba Enredo
                </p>
              </div>
            ) : (
              availableArcs.map((arc) => {
                const isSelected = plotArcId === arc.id;

                return (
                  <button
                    key={arc.id}
                    type="button"
                    onClick={() => {
                      onPlotArcChange(arc.id);
                    }}
                    className={cn(
                      "w-full text-left p-4 rounded-lg border-2 transition-colors duration-200",
                      "hover:bg-white/5 dark:hover:bg-white/10",
                      isSelected
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
                          isSelected
                            ? cn(
                                "border-current",
                                getStatusIconColor(arc.status),
                                arc.status === "atual" &&
                                  "bg-blue-600 dark:bg-blue-400",
                                arc.status === "planejamento" &&
                                  "bg-amber-600 dark:bg-amber-400",
                                arc.status === "finalizado" &&
                                  "bg-emerald-600 dark:bg-emerald-400"
                              )
                            : "border-muted-foreground/30"
                        )}
                      >
                        {isSelected && (
                          <Check className="w-3 h-3 text-white dark:text-background" />
                        )}
                      </div>

                      {/* Arc Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2 min-w-0">
                            {React.createElement(getStatusIcon(arc.status), {
                              className: cn(
                                "w-4 h-4 shrink-0",
                                getStatusIconColor(arc.status)
                              ),
                            })}
                            <h4 className="font-semibold text-sm truncate">
                              {arc.name}
                            </h4>
                          </div>
                          <span
                            className={cn(
                              "text-xs px-2 py-0.5 rounded-full border font-medium shrink-0",
                              getStatusBadgeColor(arc.status)
                            )}
                          >
                            {getStatusLabel(arc.status)}
                          </span>
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
    </TooltipProvider>
  );
}

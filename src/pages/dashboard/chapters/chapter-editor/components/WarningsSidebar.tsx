/**
 * Menu Lateral de Avisos
 *
 * Central de notificações para avisos do editor, organizados por tipo:
 * - Tipografia
 * - Gramática
 * - Metas
 */

import React, { useState } from "react";

import { X, Trash2, AlertCircle, Filter } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

import { useWarnings } from "../context/WarningsContext";
import { WarningType } from "../types/warnings";

import { WarningItem } from "./WarningItem";

interface WarningsSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WarningsSidebar({ isOpen, onClose }: WarningsSidebarProps) {
  const { t } = useTranslation(["chapter-editor", "empty-states"]);
  const {
    warnings,
    stats,
    removeWarning,
    clearAllWarnings,
    clearWarningsByType,
    getWarningsByType,
    handleWarningAction,
  } = useWarnings();

  const [selectedType, setSelectedType] = useState<WarningType | "all">("all");

  // Lista de tipos de avisos para iteração
  const warningTypes: WarningType[] = ["typography", "goals", "time"];

  // Filtra avisos por tipo selecionado
  const filteredWarnings =
    selectedType === "all" ? warnings : getWarningsByType(selectedType);

  // Handler para clique em um aviso
  const handleWarningClick = (warning: any) => {
    handleWarningAction(warning);
  };

  if (!isOpen) return null;

  return (
    <TooltipProvider delayDuration={300}>
      <div
        className={cn(
          "fixed right-0 top-8 bottom-0 w-96 bg-background border-l border-border",
          "flex flex-col shadow-xl z-50 transition-transform duration-300",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold">{t("chapter-editor:warnings.title")}</h2>
            {stats.total > 0 && (
              <span className="px-2 py-0.5 text-xs font-medium bg-primary/10 text-primary rounded-full">
                {stats.total}
              </span>
            )}
          </div>

          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Filtros e ações */}
        <div className="flex items-center justify-between gap-2 px-4 py-2 border-b border-border bg-muted/30">
          {/* Filtro por tipo */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2">
                <Filter className="w-3 h-3" />
                {selectedType === "all"
                  ? t("chapter-editor:warnings.all")
                  : t(`chapter-editor:warnings.types.${selectedType}`)}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem onClick={() => setSelectedType("all")}>
                {t("chapter-editor:warnings.all")}
                {stats.total > 0 && (
                  <span className="ml-auto text-xs text-muted-foreground">
                    {stats.total}
                  </span>
                )}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {warningTypes.map(
                (type) => (
                  <DropdownMenuItem
                    key={type}
                    onClick={() => setSelectedType(type)}
                  >
                    {t(`chapter-editor:warnings.types.${type}`)}
                    {stats.byType[type] > 0 && (
                      <span className="ml-auto text-xs text-muted-foreground">
                        {stats.byType[type]}
                      </span>
                    )}
                  </DropdownMenuItem>
                )
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Limpar avisos */}
          {warnings.length > 0 && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAllWarnings}
                  className="gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t("chapter-editor:warnings.clear_all_tooltip")}</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>

        {/* Lista de avisos */}
        <ScrollArea className="flex-1">
          {filteredWarnings.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <AlertCircle className="w-12 h-12 text-muted-foreground/30 mb-4" />
              <h3 className="text-sm font-medium text-muted-foreground mb-1">
                {t("empty-states:warnings.no_warning")}
              </h3>
              <p className="text-xs text-muted-foreground/70">
                {selectedType === "all"
                  ? t("chapter-editor:warnings.no_warnings")
                  : t("chapter-editor:warnings.no_warnings_of_type", { type: t(`chapter-editor:warnings.types.${selectedType}`).toLowerCase() })}
              </p>
            </div>
          ) : (
            <div className="p-4 space-y-3">
              {/* Avisos agrupados por tipo quando "Todos" está selecionado */}
              {selectedType === "all" ? (
                <>
                  {warningTypes.map(
                    (type) => {
                      const typeWarnings = getWarningsByType(type);
                      if (typeWarnings.length === 0) return null;

                      return (
                        <div key={type} className="space-y-2">
                          <div className="flex items-center gap-2 px-1">
                            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                              {t(`chapter-editor:warnings.types.${type}`)}
                            </h3>
                            <div className="flex-1 h-px bg-border" />
                            <span className="text-xs text-muted-foreground">
                              {typeWarnings.length}
                            </span>
                          </div>
                          {typeWarnings.map((warning) => (
                            <WarningItem
                              key={warning.id}
                              warning={warning}
                              onRemove={removeWarning}
                              onClick={handleWarningClick}
                            />
                          ))}
                        </div>
                      );
                    }
                  )}
                </>
              ) : (
                // Lista simples quando um tipo específico está selecionado
                <>
                  {filteredWarnings.map((warning) => (
                    <WarningItem
                      key={warning.id}
                      warning={warning}
                      onRemove={removeWarning}
                      onClick={handleWarningClick}
                    />
                  ))}
                </>
              )}
            </div>
          )}
        </ScrollArea>

        {/* Footer com estatísticas */}
        {stats.total > 0 && (
          <div className="px-4 py-3 border-t border-border bg-muted/30">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{t("chapter-editor:warnings.total_warnings", { count: stats.total })}</span>
              <div className="flex items-center gap-3">
                {stats.bySeverity.error > 0 && (
                  <span className="text-red-600 dark:text-red-400">
                    {stats.bySeverity.error}{" "}
                    {stats.bySeverity.error === 1 ? t("chapter-editor:warnings.critical") : t("chapter-editor:warnings.critical_plural")}
                  </span>
                )}
                {stats.bySeverity.warning > 0 && (
                  <span className="text-yellow-600 dark:text-yellow-400">
                    {stats.bySeverity.warning}{" "}
                    {stats.bySeverity.warning === 1
                      ? t("chapter-editor:warnings.important")
                      : t("chapter-editor:warnings.important_plural")}
                  </span>
                )}
                {stats.bySeverity.info > 0 && (
                  <span className="text-blue-600 dark:text-blue-400">
                    {stats.bySeverity.info}{" "}
                    {stats.bySeverity.info === 1 ? t("chapter-editor:warnings.info") : t("chapter-editor:warnings.info_plural")}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}

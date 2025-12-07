import { X, Star, MapPin, MessageSquare } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

import type { Annotation } from "../types";

interface AllAnnotationsSidebarProps {
  annotations: Annotation[];
  onClose: () => void;
  onNavigateToAnnotation: (annotationId: string) => void;
}

export function AllAnnotationsSidebar({
  annotations,
  onClose,
  onNavigateToAnnotation,
}: AllAnnotationsSidebarProps) {
  const { t } = useTranslation(["chapter-editor", "empty-states", "tooltips"]);

  const handleNavigate = (annotationId: string) => {
    onNavigateToAnnotation(annotationId);
  };

  return (
    <TooltipProvider delayDuration={300}>
      <div
        className={cn(
          "fixed right-0 top-8 bottom-0 w-96 bg-background border-l border-border",
          "flex flex-col shadow-xl z-50"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold">
              {t("annotations.all_annotations_title")}
            </h2>
            {annotations.length > 0 && (
              <span className="px-2 py-0.5 text-xs font-medium bg-primary/10 text-primary rounded-full">
                {annotations.length}
              </span>
            )}
          </div>

          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Annotations List */}
        <ScrollArea className="flex-1">
          {annotations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <MessageSquare className="w-12 h-12 text-muted-foreground/30 mb-4" />
              <h3 className="text-sm font-medium text-muted-foreground mb-1">
                {t("empty-states:annotations.no_annotation")}
              </h3>
              <p className="text-xs text-muted-foreground/70">
                {t("chapter-editor:annotations.no_annotations")}
              </p>
            </div>
          ) : (
            <div className="p-4 space-y-3">
              {annotations.map((annotation) => {
                const hasImportantNotes = annotation.notes.some(
                  (n) => n.isImportant
                );

                return (
                  <Card
                    key={annotation.id}
                    onClick={() => handleNavigate(annotation.id)}
                    className={cn(
                      "p-4 cursor-pointer",
                      "hover:bg-white/5 dark:hover:bg-white/10 hover:border-primary/30 transition-colors duration-200",
                      hasImportantNotes &&
                        "border-2 border-amber-500/50 bg-amber-500/5 hover:border-amber-500"
                    )}
                  >
                    {/* Selected text with pin icon */}
                    <div className="mb-3">
                      <p className="text-xs text-muted-foreground mb-1.5">
                        {t("annotations.selected_text")}:
                      </p>
                      <div className="flex items-start gap-2 group">
                        <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-muted-foreground group-hover:text-primary transition-colors" />
                        <p className="text-sm font-medium italic flex-1 group-hover:text-primary transition-colors">
                          "{annotation.text}"
                        </p>
                      </div>
                    </div>

                    {/* Notes count and preview */}
                    {annotation.notes.length > 0 ? (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span className="font-medium">
                            {annotation.notes.length}{" "}
                            {annotation.notes.length === 1 ? "nota" : "notas"}
                          </span>
                          {hasImportantNotes && (
                            <Tooltip>
                              <TooltipTrigger>
                                <Star className="w-3 h-3 text-amber-500 fill-current" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{t("tooltips:annotations.contains_important_notes")}</p>
                              </TooltipContent>
                            </Tooltip>
                          )}
                        </div>

                        {/* Notes preview */}
                        <div className="space-y-1.5">
                          {annotation.notes.slice(0, 3).map((note) => (
                            <div
                              key={note.id}
                              className={cn(
                                "p-2 rounded text-xs",
                                note.isImportant
                                  ? "bg-amber-500/10 border border-amber-500/30"
                                  : "bg-muted/50"
                              )}
                            >
                              <div className="flex items-start gap-1.5">
                                {note.isImportant && (
                                  <Star className="w-3 h-3 text-amber-500 fill-current shrink-0 mt-0.5" />
                                )}
                                <p className="flex-1 line-clamp-2">
                                  {note.text}
                                </p>
                              </div>
                            </div>
                          ))}
                          {annotation.notes.length > 3 && (
                            <p className="text-xs text-muted-foreground text-center pt-1">
                              +{annotation.notes.length - 3} mais...
                            </p>
                          )}
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground italic">
                        Sem notas ainda
                      </p>
                    )}
                  </Card>
                );
              })}
            </div>
          )}
        </ScrollArea>

        {/* Footer com estatísticas */}
        {annotations.length > 0 && (
          <div className="px-4 py-3 border-t border-border bg-muted/30">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Total de anotações: {annotations.length}</span>
              <div className="flex items-center gap-3">
                {(() => {
                  const importantCount = annotations.filter((a) =>
                    a.notes.some((n) => n.isImportant)
                  ).length;
                  const totalNotes = annotations.reduce(
                    (sum, a) => sum + a.notes.length,
                    0
                  );
                  return (
                    <>
                      {importantCount > 0 && (
                        <span className="text-amber-600 dark:text-amber-400">
                          {importantCount} importantes
                        </span>
                      )}
                      {totalNotes > 0 && (
                        <span>
                          {totalNotes} {totalNotes === 1 ? "nota" : "notas"}
                        </span>
                      )}
                    </>
                  );
                })()}
              </div>
            </div>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}

import { X, Star, MapPin } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
  const { t } = useTranslation("chapter-editor");

  const handleNavigate = (annotationId: string) => {
    onNavigateToAnnotation(annotationId);
  };

  return (
    <TooltipProvider delayDuration={300}>
      <div className="fixed right-0 top-8 bottom-0 w-96 bg-card border-l border-border shadow-2xl z-50 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-lg">{t("annotations.all_annotations_title")}</h3>
            <p className="text-sm text-muted-foreground">
              {annotations.length} {annotations.length === 1 ? "anotação" : "anotações"}
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Annotations List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {annotations.length === 0 ? (
            <div className="text-center text-muted-foreground text-sm py-8">
              {t("annotations.no_annotations")}
            </div>
          ) : (
            annotations.map((annotation) => {
              const hasImportantNotes = annotation.notes.some((n) => n.isImportant);

              return (
                <Card
                  key={annotation.id}
                  onClick={() => handleNavigate(annotation.id)}
                  className={cn(
                    "p-4 cursor-pointer transition-all hover:shadow-md hover:border-primary/50",
                    hasImportantNotes && "border-2 border-amber-500/50 bg-amber-500/5 hover:border-amber-500"
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
                          {annotation.notes.length} {annotation.notes.length === 1 ? "nota" : "notas"}
                        </span>
                        {hasImportantNotes && (
                          <Tooltip>
                            <TooltipTrigger>
                              <Star className="w-3 h-3 text-amber-500 fill-current" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Contém notas importantes</p>
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
                              <p className="flex-1 line-clamp-2">{note.text}</p>
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
            })
          )}
        </div>
      </div>
    </TooltipProvider>
  );
}

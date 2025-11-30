import { X, Star, Navigation } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
                className={cn(
                  "p-3",
                  hasImportantNotes && "border-2 border-amber-500 bg-amber-500/5"
                )}
              >
                {/* Selected text */}
                <div className="mb-2">
                  <p className="text-xs text-muted-foreground mb-1">
                    {t("annotations.selected_text")}:
                  </p>
                  <p className="text-sm font-medium italic bg-blue-100 dark:bg-blue-900/20 px-2 py-1 rounded">
                    "{annotation.text}"
                  </p>
                </div>

                {/* Notes */}
                {annotation.notes.length > 0 && (
                  <div className="space-y-1.5 mb-2">
                    {annotation.notes.map((note) => (
                      <div
                        key={note.id}
                        className={cn(
                          "p-2 rounded border text-xs",
                          note.isImportant
                            ? "bg-amber-50 dark:bg-amber-900/20 border-amber-300 dark:border-amber-700"
                            : "bg-muted/50 border-border"
                        )}
                      >
                        <div className="flex items-start gap-2">
                          {note.isImportant && (
                            <Star className="w-3 h-3 text-amber-500 fill-current shrink-0 mt-0.5" />
                          )}
                          <p className="flex-1">{note.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Navigate button */}
                <Button
                  variant="ghost-bright"
                  size="sm"
                  onClick={() => handleNavigate(annotation.id)}
                  className="w-full h-8"
                >
                  <Navigation className="w-3 h-3 mr-2" />
                  {t("annotations.navigate_to_text")}
                </Button>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}

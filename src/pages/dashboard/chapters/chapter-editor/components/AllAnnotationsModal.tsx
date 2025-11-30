import { Star, Navigation } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

import type { Annotation } from "../types";

interface AllAnnotationsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  annotations: Annotation[];
  onNavigateToAnnotation: (annotationId: string) => void;
}

export function AllAnnotationsModal({
  open,
  onOpenChange,
  annotations,
  onNavigateToAnnotation,
}: AllAnnotationsModalProps) {
  const { t } = useTranslation("chapter-editor");

  const handleNavigate = (annotationId: string) => {
    onNavigateToAnnotation(annotationId);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>{t("annotations.all_annotations_title")}</DialogTitle>
          <DialogDescription>
            {annotations.length} {annotations.length === 1 ? "anotação" : "anotações"} neste capítulo
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[60vh] pr-4">
          {annotations.length === 0 ? (
            <div className="text-center text-muted-foreground py-12">
              {t("annotations.no_annotations")}
            </div>
          ) : (
            <div className="space-y-4">
              {annotations.map((annotation) => {
                const hasImportantNotes = annotation.notes.some((n) => n.isImportant);

                return (
                  <Card
                    key={annotation.id}
                    className={cn(
                      "p-4",
                      hasImportantNotes && "border-2 border-amber-500 bg-amber-500/5"
                    )}
                  >
                    {/* Selected text */}
                    <div className="mb-3">
                      <p className="text-sm text-muted-foreground mb-1">
                        {t("annotations.selected_text")}:
                      </p>
                      <p className="font-medium italic bg-blue-100 dark:bg-blue-900/20 px-2 py-1 rounded">
                        "{annotation.text}"
                      </p>
                    </div>

                    {/* Notes */}
                    {annotation.notes.length > 0 && (
                      <div className="space-y-2 mb-3">
                        {annotation.notes.map((note) => (
                          <div
                            key={note.id}
                            className={cn(
                              "p-2 rounded border",
                              note.isImportant
                                ? "bg-amber-50 dark:bg-amber-900/20 border-amber-300 dark:border-amber-700"
                                : "bg-muted/50 border-border"
                            )}
                          >
                            <div className="flex items-start gap-2">
                              {note.isImportant && (
                                <Star className="w-4 h-4 text-amber-500 fill-current shrink-0 mt-0.5" />
                              )}
                              <p className="text-sm flex-1">{note.text}</p>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              {note.updatedAt ? new Date(note.updatedAt).toLocaleString() : ''}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Navigate button */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleNavigate(annotation.id)}
                      className="w-full"
                    >
                      <Navigation className="w-3 h-3 mr-2" />
                      {t("annotations.navigate_to_text")}
                    </Button>
                  </Card>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

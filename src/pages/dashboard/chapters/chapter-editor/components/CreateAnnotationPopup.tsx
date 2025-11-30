import { useState } from "react";

import { MessageSquare, X } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface CreateAnnotationPopupProps {
  selectedText: string;
  onCreateAnnotation: () => void;
  onCancel: () => void;
}

export function CreateAnnotationPopup({
  selectedText,
  onCreateAnnotation,
  onCancel,
}: CreateAnnotationPopupProps) {
  const { t } = useTranslation("chapter-editor");

  if (!selectedText) return null;

  return (
    <Card className="fixed top-20 right-6 z-40 p-4 max-w-sm shadow-xl border-2 border-primary/30 bg-card">
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex-1">
          <p className="text-sm text-muted-foreground mb-1">
            {t("annotations.selected_text")}:
          </p>
          <p className="text-sm font-medium italic line-clamp-2">"{selectedText}"</p>
        </div>
        <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0" onClick={onCancel}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      <Button onClick={onCreateAnnotation} className="w-full" size="sm">
        <MessageSquare className="w-4 h-4 mr-2" />
        {t("annotations.create")}
      </Button>
    </Card>
  );
}

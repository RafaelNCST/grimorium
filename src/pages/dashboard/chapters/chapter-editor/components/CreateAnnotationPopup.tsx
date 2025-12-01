import { MessageSquare } from "lucide-react";

import { Button } from "@/components/ui/button";

interface CreateAnnotationPopupProps {
  selectedText: string;
  position: { x: number; y: number };
  onCreateAnnotation: () => void;
}

export function CreateAnnotationPopup({
  selectedText,
  position,
  onCreateAnnotation,
}: CreateAnnotationPopupProps) {
  if (!selectedText) return null;

  return (
    <div
      data-annotation-popup
      className="fixed z-[100]"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: 'translate(-50%, -120%)',
      }}
    >
      <Button
        onClick={onCreateAnnotation}
        size="sm"
        variant="magical"
        className="h-9 px-3 shadow-xl border-2 border-primary/30 gap-2"
      >
        <MessageSquare className="w-4 h-4" />
        Anotar
      </Button>
    </div>
  );
}

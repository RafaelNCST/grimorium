import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";

import { PropsSortableSection } from "../types/overview-types";

export function SortableSection({
  section,
  isCustomizing,
  children,
  onToggleVisibility,
}: PropsSortableSection) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  if (!section.visible && !isCustomizing) {
    return null;
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative transition-all duration-200 ${
        section.type === "stats" ? "w-full" : "w-fit"
      } ${isDragging ? "opacity-50 z-50" : ""} ${
        !section.visible
          ? "opacity-50 border-2 border-dashed border-muted-foreground/30"
          : ""
      } ${
        isCustomizing
          ? "hover:shadow-lg cursor-grab active:cursor-grabbing"
          : ""
      }`}
      {...attributes}
      {...(isCustomizing ? listeners : {})}
    >
      {isCustomizing && (
        <div className="absolute -top-2 -right-2 z-10">
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0 bg-background/90 backdrop-blur-sm"
            onPointerDown={(e) => {
              e.stopPropagation();
              e.preventDefault();
            }}
            onMouseDown={(e) => {
              e.stopPropagation();
              e.preventDefault();
            }}
            onClick={(e) => {
              e.stopPropagation();
              onToggleVisibility(section.id);
            }}
          >
            {section.visible ? (
              <Eye className="w-4 h-4" />
            ) : (
              <EyeOff className="w-4 h-4" />
            )}
          </Button>
        </div>
      )}
      {children}
    </div>
  );
}

import { ArrowUp, ArrowDown, Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";

import { PropsSortableSection } from "../types/overview-types";

export function SortableSection({
  section,
  isCustomizing,
  children,
  isFirst,
  isLast,
  onToggleVisibility,
  onMoveUp,
  onMoveDown,
}: PropsSortableSection) {
  if (!section.visible && !isCustomizing) {
    return null;
  }

  return (
    <div
      className={`relative transition-all duration-200 w-full ${
        !section.visible
          ? "opacity-50 border-2 border-dashed border-muted-foreground/30 rounded-lg"
          : ""
      } ${
        isCustomizing
          ? "hover:shadow-lg hover:border hover:border-primary/30 rounded-lg"
          : ""
      }`}
    >
      {isCustomizing && (
        <div className="absolute -top-2 -right-2 z-10 flex gap-1">
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0 bg-background/90 backdrop-blur-sm"
            disabled={isFirst}
            onClick={(e) => {
              e.stopPropagation();
              onMoveUp(section.id);
            }}
          >
            <ArrowUp className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0 bg-background/90 backdrop-blur-sm"
            disabled={isLast}
            onClick={(e) => {
              e.stopPropagation();
              onMoveDown(section.id);
            }}
          >
            <ArrowDown className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0 bg-background/90 backdrop-blur-sm"
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

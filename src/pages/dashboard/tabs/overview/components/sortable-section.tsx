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
    <div className="relative w-full">
      {isCustomizing && (
        <div className="absolute top-2 right-2 z-20 flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            disabled={isFirst}
            onClick={(e) => {
              e.stopPropagation();
              onMoveUp(section.id);
            }}
          >
            <ArrowUp className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            disabled={isLast}
            onClick={(e) => {
              e.stopPropagation();
              onMoveDown(section.id);
            }}
          >
            <ArrowDown className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
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
      <div
        className={`transition-all duration-200 ${
          !section.visible
            ? "opacity-50 border-2 border-dashed border-muted-foreground/30 rounded-lg"
            : ""
        } ${
          isCustomizing
            ? "rounded-lg pt-12"
            : ""
        }`}
      >
        {children}
      </div>
    </div>
  );
}

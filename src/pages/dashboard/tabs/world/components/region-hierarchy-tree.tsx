import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDraggable, useDroppable } from "@dnd-kit/core";
import { ChevronDown, ChevronRight, GripVertical, Trash2, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { IRegionWithChildren } from "../types/region-types";
import { SCALE_COLORS } from "../constants/scale-colors";
import { cn } from "@/lib/utils";

interface RegionHierarchyTreeProps {
  regions: IRegionWithChildren[];
  onDelete: (region: IRegionWithChildren) => void;
}

interface RegionNodeProps {
  region: IRegionWithChildren;
  level: number;
  onDelete: (region: IRegionWithChildren) => void;
}

function RegionNode({ region, level, onDelete }: RegionNodeProps) {
  const { t } = useTranslation("world");
  const [isExpanded, setIsExpanded] = useState(true);
  const hasChildren = region.children.length > 0;

  // Draggable setup
  const { attributes, listeners, setNodeRef: setDragRef, isDragging } = useDraggable({
    id: `region-${region.id}`,
    data: {
      type: "region",
      region,
    },
  });

  // Droppable setup (to allow children to be dropped onto this region)
  const { setNodeRef: setDropRef, isOver } = useDroppable({
    id: `drop-region-${region.id}`,
    data: {
      type: "region-drop",
      regionId: region.id,
    },
  });

  return (
    <div className="space-y-1">
      {/* Region Row */}
      <div
        ref={setDropRef}
        className={cn(
          "flex items-center gap-2 rounded-md p-2 transition-colors",
          isOver && "bg-primary/10 border border-primary/50",
          isDragging && "opacity-50"
        )}
        style={{ paddingLeft: `${level * 1.5}rem` }}
      >
        {/* Expand/Collapse Button */}
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 p-0"
          onClick={() => setIsExpanded(!isExpanded)}
          disabled={!hasChildren}
        >
          {hasChildren ? (
            isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )
          ) : (
            <div className="h-4 w-4" />
          )}
        </Button>

        {/* Drag Handle */}
        <div
          ref={setDragRef}
          {...listeners}
          {...attributes}
          className="cursor-grab active:cursor-grabbing"
        >
          <GripVertical className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
        </div>

        {/* Region Icon */}
        <MapPin className="h-4 w-4 text-muted-foreground" />

        {/* Region Name */}
        <span className="flex-1 text-sm font-medium">{region.name}</span>

        {/* Scale Badge */}
        <Badge
          variant="secondary"
          className={`${SCALE_COLORS[region.scale]} text-xs px-2 py-0`}
        >
          {t(`scales.${region.scale}`)}
        </Badge>

        {/* Children Count */}
        {hasChildren && (
          <Badge variant="outline" className="text-xs px-2 py-0">
            {region.children.length}
          </Badge>
        )}

        {/* Delete Button */}
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={() => onDelete(region)}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>

      {/* Children */}
      {hasChildren && isExpanded && (
        <div className="space-y-1">
          {region.children.map((child) => (
            <RegionNode
              key={child.id}
              region={child}
              level={level + 1}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function RegionHierarchyTree({ regions, onDelete }: RegionHierarchyTreeProps) {
  const { t } = useTranslation("world");

  if (regions.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        {t("hierarchy_manager.no_regions")}
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {regions.map((region) => (
        <RegionNode key={region.id} region={region} level={0} onDelete={onDelete} />
      ))}
    </div>
  );
}

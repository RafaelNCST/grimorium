import { useState, useEffect, useRef, useMemo, memo } from "react";

import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  DragMoveEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
  DragOverEvent,
  defaultDropAnimationSideEffects,
  MeasuringStrategy,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  ChevronDown,
  ChevronRight,
  Trash2,
  MapPin,
  ArrowDown,
  ArrowRight,
} from "lucide-react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { SCALE_COLORS } from "../constants/scale-colors";
import { IRegionWithChildren } from "../types/region-types";

interface RegionHierarchyTreeProps {
  regions: IRegionWithChildren[];
  onDelete: (region: IRegionWithChildren) => void;
  onMoveRegion?: (regionId: string, newParentId: string | null) => void;
  onReorderRegions?: (regionIds: string[], parentId: string | null) => void;
}

interface DragItem {
  region: IRegionWithChildren;
}

type DropIndicatorType = "between" | "inside";

interface DropIndicator {
  type: DropIndicatorType;
  regionId: string;
  position?: "before" | "after";
}

// Component for the visual region item (used in tree and overlay)
const RegionItem = memo(function RegionItem({
  region,
  level = 0,
  isOverlay = false,
  showDelete = false,
  onDelete,
  isExpanded,
  onToggle,
  dragHandleProps,
}: {
  region: IRegionWithChildren;
  level?: number;
  isOverlay?: boolean;
  showDelete?: boolean;
  onDelete?: (region: IRegionWithChildren) => void;
  isExpanded?: boolean;
  onToggle?: () => void;
  dragHandleProps?: Record<string, unknown>;
}) {
  const { t } = useTranslation("world");
  const hasChildren = region.children.length > 0;

  return (
    <div
      onClick={() => {
        if (hasChildren && !isOverlay) {
          onToggle?.();
        }
      }}
      onKeyDown={(e) => {
        if (hasChildren && !isOverlay && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onToggle?.();
        }
      }}
      role={hasChildren && !isOverlay ? "button" : undefined}
      tabIndex={hasChildren && !isOverlay ? 0 : undefined}
      {...dragHandleProps}
      className={cn(
        "flex items-center gap-2 rounded-md p-2 transition-all duration-200 min-h-[40px]",
        !isOverlay && "hover:bg-white/5",
        !isOverlay && hasChildren && "cursor-pointer",
        !isOverlay && "active:cursor-grabbing",
        isOverlay &&
          "bg-background/95 border-2 border-primary shadow-2xl cursor-grabbing backdrop-blur-sm"
      )}
      style={{
        paddingLeft: isOverlay ? "0.5rem" : `${level * 1.5 + 0.5}rem`,
        ...(isOverlay
          ? {
              boxShadow:
                "0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)",
            }
          : {}),
      }}
    >
      {/* Expand/Collapse Button */}
      <div className="h-6 w-6 p-0 shrink-0 flex items-center justify-center">
        {hasChildren ? (
          isExpanded ? (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          )
        ) : (
          <div className="h-4 w-4" />
        )}
      </div>

      {/* Region Icon */}
      <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />

      {/* Region Name and Scale Badge */}
      <div className={cn("flex items-center gap-2 flex-1 min-w-0")}>
        <span className="text-sm font-medium truncate">{region.name}</span>
        <Badge
          variant="secondary"
          className={cn(
            SCALE_COLORS[region.scale],
            "text-xs px-2 py-0 shrink-0"
          )}
        >
          {t(`scales.${region.scale}`)}
        </Badge>
      </div>

      {/* Children Count */}
      {hasChildren && (
        <Badge variant="outline" className="text-xs px-2 py-0 shrink-0">
          {region.children.length}
        </Badge>
      )}

      {/* Delete Button */}
      {showDelete && onDelete && !isOverlay && (
        <Button
          variant="ghost-destructive"
          size="icon"
          className="h-7 w-7 p-0 shrink-0 transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(region);
          }}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
});

interface RegionNodeProps {
  region: IRegionWithChildren;
  level: number;
  onDelete: (region: IRegionWithChildren) => void;
  activeRegion: IRegionWithChildren | null;
  dropIndicator: DropIndicator | null;
  expandedNodes: Set<string>;
  onToggleExpand: (regionId: string) => void;
}

function RegionNode({
  region,
  level,
  onDelete,
  activeRegion,
  dropIndicator,
  expandedNodes,
  onToggleExpand,
}: RegionNodeProps) {
  const hasChildren = region.children.length > 0;
  const isExpanded = expandedNodes.has(region.id);

  const { attributes, listeners, setNodeRef, isDragging } = useSortable({
    id: region.id,
    data: {
      region,
    } as DragItem,
  });

  // Don't apply any transform - items stay in place, only reorder on drop
  const style = {
    // No transform applied, items stay static until drop
  };

  const isActive = activeRegion?.id === region.id;
  const isDropInside =
    dropIndicator?.type === "inside" && dropIndicator?.regionId === region.id;
  const isDropBefore =
    dropIndicator?.type === "between" &&
    dropIndicator?.regionId === region.id &&
    dropIndicator?.position === "before";
  const isDropAfter =
    dropIndicator?.type === "between" &&
    dropIndicator?.regionId === region.id &&
    dropIndicator?.position === "after";

  return (
    <div ref={setNodeRef} style={style}>
      {/* Drop indicator before - Positioned in the gap */}
      {isDropBefore && (
        <div className="relative h-4 my-2 mx-2">
          <div className="absolute inset-0 flex items-center">
            <div className="h-1 w-full bg-primary rounded-full shadow-[0_0_12px_rgba(59,130,246,0.8)]" />
          </div>
          <div className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center gap-1 bg-primary text-primary-foreground px-2 py-0.5 rounded-full text-xs font-medium shadow-lg">
            <ArrowDown className="h-3 w-3" />
            Posicionar aqui
          </div>
        </div>
      )}

      {/* Region Row */}
      <div
        className={cn(
          "relative select-none transition-all duration-200",
          isDragging && "opacity-40", // Semi-transparent when dragging (ghost effect)
          isDropInside &&
            "ring-4 ring-inset ring-primary bg-primary/20 rounded-md shadow-lg"
        )}
      >
        {isDropInside && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
            <div className="bg-primary text-primary-foreground px-3 py-1.5 rounded-full text-sm font-semibold shadow-xl flex items-center gap-2">
              <ArrowRight className="h-4 w-4" />
              Tornar filho
            </div>
          </div>
        )}
        <RegionItem
          region={region}
          level={level}
          showDelete={!isActive}
          onDelete={onDelete}
          isExpanded={isExpanded}
          onToggle={() => onToggleExpand(region.id)}
          dragHandleProps={{ ...listeners, ...attributes }}
        />
      </div>

      {/* Drop indicator after - Positioned in the gap */}
      {isDropAfter && (
        <div className="relative h-4 my-2 mx-2">
          <div className="absolute inset-0 flex items-center">
            <div className="h-1 w-full bg-primary rounded-full shadow-[0_0_12px_rgba(59,130,246,0.8)]" />
          </div>
          <div className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center gap-1 bg-primary text-primary-foreground px-2 py-0.5 rounded-full text-xs font-medium shadow-lg">
            <ArrowDown className="h-3 w-3" />
            Posicionar aqui
          </div>
        </div>
      )}

      {/* Children - with gap spacing */}
      {hasChildren && isExpanded && (
        <div className="space-y-4 mt-4">
          {region.children.map((child) => (
            <RegionNode
              key={child.id}
              region={child}
              level={level + 1}
              onDelete={onDelete}
              activeRegion={activeRegion}
              dropIndicator={dropIndicator}
              expandedNodes={expandedNodes}
              onToggleExpand={onToggleExpand}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function RegionHierarchyTree({
  regions,
  onDelete,
  onMoveRegion,
  onReorderRegions,
}: RegionHierarchyTreeProps) {
  const { t } = useTranslation("world");
  const [activeRegion, setActiveRegion] = useState<IRegionWithChildren | null>(
    null
  );
  const [dropIndicator, setDropIndicator] = useState<DropIndicator | null>(
    null
  );
  const [currentOverId, setCurrentOverId] = useState<string | null>(null);

  // RAF for smooth indicator updates
  const rafRef = useRef<number | null>(null);

  // Local state for optimistic updates
  const [localRegions, setLocalRegions] =
    useState<IRegionWithChildren[]>(regions);

  // Sync local state with props when regions change from parent
  useEffect(() => {
    setLocalRegions(regions);
  }, [regions]);

  // Cleanup RAF on unmount
  useEffect(
    () => () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    },
    []
  );

  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(() => {
    // Start with all nodes expanded
    const expanded = new Set<string>();
    const expandAll = (regions: IRegionWithChildren[]) => {
      regions.forEach((region) => {
        expanded.add(region.id);
        if (region.children.length > 0) {
          expandAll(region.children);
        }
      });
    };
    expandAll(regions);
    return expanded;
  });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Start drag after moving 8px (prevents accidental drags)
      },
    })
  );

  const measuring = {
    droppable: {
      strategy: MeasuringStrategy.Always,
    },
  };

  // Flatten regions for sortable context
  const allRegions = useMemo(() => {
    const flattenRegions = (
      regions: IRegionWithChildren[]
    ): IRegionWithChildren[] => {
      const result: IRegionWithChildren[] = [];
      regions.forEach((region) => {
        result.push(region);
        if (region.children.length > 0) {
          result.push(...flattenRegions(region.children));
        }
      });
      return result;
    };

    return flattenRegions(localRegions);
  }, [localRegions]);

  // Helper: Deep clone regions tree
  const cloneRegionsTree = (
    regions: IRegionWithChildren[]
  ): IRegionWithChildren[] =>
    regions.map((region) => ({
      ...region,
      children: cloneRegionsTree(region.children),
    }));

  // Helper: Find region in tree by ID
  const findRegionInTree = (
    regions: IRegionWithChildren[],
    regionId: string
  ): IRegionWithChildren | null => {
    for (const region of regions) {
      if (region.id === regionId) return region;
      const found = findRegionInTree(region.children, regionId);
      if (found) return found;
    }
    return null;
  };

  // Helper: Remove region from tree
  const removeRegionFromTree = (
    regions: IRegionWithChildren[],
    regionId: string
  ): IRegionWithChildren[] =>
    regions
      .filter((r) => r.id !== regionId)
      .map((r) => ({
        ...r,
        children: removeRegionFromTree(r.children, regionId),
      }));

  // Helper: Apply optimistic move/reorder to local state
  const applyOptimisticUpdate = (
    draggedRegionId: string,
    targetRegionId: string,
    dropType: DropIndicatorType,
    dropPosition?: "before" | "after"
  ) => {
    const newTree = cloneRegionsTree(localRegions);
    const draggedRegion = findRegionInTree(newTree, draggedRegionId);
    if (!draggedRegion) return;

    // Remove dragged region from its current position
    const treeWithoutDragged = removeRegionFromTree(newTree, draggedRegionId);

    if (dropType === "inside") {
      // Make it a child of target
      const insertIntoChildren = (
        regions: IRegionWithChildren[]
      ): IRegionWithChildren[] =>
        regions.map((region) => {
          if (region.id === targetRegionId) {
            return {
              ...region,
              children: [
                ...region.children,
                { ...draggedRegion, parentId: targetRegionId },
              ],
            };
          }
          return {
            ...region,
            children: insertIntoChildren(region.children),
          };
        });
      setLocalRegions(insertIntoChildren(treeWithoutDragged));
    } else if (dropType === "between") {
      // Make it a sibling
      const targetRegion = findRegionInTree(treeWithoutDragged, targetRegionId);
      if (!targetRegion) return;

      const targetParentId = targetRegion.parentId;
      draggedRegion.parentId = targetParentId;

      const insertAsSibling = (
        regions: IRegionWithChildren[]
      ): IRegionWithChildren[] => {
        // Check if we're at the right level
        const hasTarget = regions.some((r) => r.id === targetRegionId);
        if (!hasTarget) {
          // Recurse into children
          return regions.map((region) => ({
            ...region,
            children: insertAsSibling(region.children),
          }));
        }

        // Found the level, insert at correct position
        const targetIndex = regions.findIndex((r) => r.id === targetRegionId);
        const insertIndex =
          dropPosition === "before" ? targetIndex : targetIndex + 1;
        const newSiblings = [...regions];
        newSiblings.splice(insertIndex, 0, draggedRegion);
        return newSiblings;
      };

      if (targetParentId === null) {
        // Insert at root level
        const targetIndex = treeWithoutDragged.findIndex(
          (r) => r.id === targetRegionId
        );
        const insertIndex =
          dropPosition === "before" ? targetIndex : targetIndex + 1;
        const newRoot = [...treeWithoutDragged];
        newRoot.splice(insertIndex, 0, draggedRegion);
        setLocalRegions(newRoot);
      } else {
        // Insert within parent's children
        setLocalRegions(insertAsSibling(treeWithoutDragged));
      }
    }
  };

  const handleToggleExpand = (regionId: string) => {
    setExpandedNodes((prev) => {
      const next = new Set(prev);
      if (next.has(regionId)) {
        next.delete(regionId);
      } else {
        next.add(regionId);
      }
      return next;
    });
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const data = active.data.current as DragItem;
    if (data?.region) {
      setActiveRegion(data.region);
    }
  };

  const handleDragMove = (event: DragMoveEvent) => {
    // Cancel previous RAF if exists
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }

    // Schedule update on next frame to smooth out rapid changes
    rafRef.current = requestAnimationFrame(() => {
      const { active, over } = event;

      if (!over || !active) {
        setDropIndicator(null);
        setCurrentOverId(null);
        return;
      }

      const activeData = active.data.current as DragItem;
      const overData = over.data.current as DragItem;

      if (!activeData?.region || !overData?.region) {
        setDropIndicator(null);
        setCurrentOverId(null);
        return;
      }

      const activeRegionData = activeData.region;
      const overRegion = overData.region;

      setCurrentOverId(overRegion.id);

      // Don't show indicator if dragging over itself
      if (activeRegionData.id === overRegion.id) {
        setDropIndicator(null);
        return;
      }

      // Don't allow dropping on own children
      const isChild = (
        parent: IRegionWithChildren,
        childId: string
      ): boolean => {
        if (parent.id === childId) return true;
        return parent.children.some((c) => isChild(c, childId));
      };

      if (isChild(activeRegionData, overRegion.id)) {
        setDropIndicator(null);
        return;
      }

      // Get the DOM element to determine cursor position
      const overElement = document.getElementById(`region-${overRegion.id}`);
      if (!overElement) {
        setDropIndicator({ type: "inside", regionId: overRegion.id });
        return;
      }

      const rect = overElement.getBoundingClientRect();

      // Get actual mouse position from the drag overlay center
      const activeRect = active.rect.current.translated;
      if (!activeRect) {
        setDropIndicator({ type: "inside", regionId: overRegion.id });
        return;
      }

      // Calculate mouse Y position based on active element center
      const mouseY = activeRect.top + activeRect.height / 2;

      // Aumentar o tamanho do gap para zonas maiores e mais fáceis de acertar
      const GAP_SIZE = 28; // in pixels (aumentado de 16px para 28px)

      // Define as zonas de detecção
      // Zonas de irmão têm PRIORIDADE e ocupam todo o gap
      const beforeZoneStart = rect.top - GAP_SIZE;
      const beforeZoneEnd = rect.top;
      const afterZoneStart = rect.bottom;
      const afterZoneEnd = rect.bottom + GAP_SIZE;

      // Calculate new indicator based on mouse position
      let newIndicator: DropIndicator | null = null;

      // Lógica simplificada e clara:
      // 1. Gaps = irmão (prioridade máxima)
      // 2. Sobre o elemento = filho

      if (mouseY >= beforeZoneStart && mouseY < beforeZoneEnd) {
        // Gap acima - tornar irmão antes
        newIndicator = {
          type: "between",
          regionId: overRegion.id,
          position: "before",
        };
      } else if (mouseY > afterZoneStart && mouseY <= afterZoneEnd) {
        // Gap abaixo - tornar irmão depois
        newIndicator = {
          type: "between",
          regionId: overRegion.id,
          position: "after",
        };
      } else if (mouseY >= rect.top && mouseY <= rect.bottom) {
        // Sobre o elemento - tornar filho
        newIndicator = { type: "inside", regionId: overRegion.id };
      } else {
        // Fora da zona de detecção
        newIndicator = null;
      }

      // Atualizar o indicador imediatamente sem sistema de estabilidade
      setDropIndicator(newIndicator);
    });
  };

  const handleDragOver = (event: DragOverEvent) => {
    // This now just tracks when we move to a different droppable
    // The actual indicator calculation is done in handleDragMove
    const { over } = event;
    if (over) {
      const overData = over.data.current as DragItem;
      if (overData?.region && overData.region.id !== currentOverId) {
        setCurrentOverId(overData.region.id);
      }
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    // Cancel any pending RAF
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }

    setActiveRegion(null);
    const currentDropIndicator = dropIndicator;
    setDropIndicator(null);

    if (!over || active.id === over.id) return;

    const activeData = active.data.current as DragItem;
    const overData = over.data.current as DragItem;

    if (!activeData?.region || !overData?.region) return;

    const draggedRegion = activeData.region;
    const targetRegion = overData.region;

    // Don't drop on itself
    if (draggedRegion.id === targetRegion.id) return;

    // Don't allow dropping on own children
    const isChild = (parent: IRegionWithChildren, childId: string): boolean => {
      if (parent.id === childId) return true;
      return parent.children.some((c) => isChild(c, childId));
    };

    if (isChild(draggedRegion, targetRegion.id)) return;

    if (!currentDropIndicator) return;

    // Apply optimistic update FIRST for immediate UI feedback
    applyOptimisticUpdate(
      draggedRegion.id,
      targetRegion.id,
      currentDropIndicator.type,
      currentDropIndicator.position
    );

    if (currentDropIndicator.type === "inside") {
      // Make it a child of target
      if (onMoveRegion && draggedRegion.parentId !== targetRegion.id) {
        onMoveRegion(draggedRegion.id, targetRegion.id);
        // Auto-expand the target region
        setExpandedNodes((prev) => new Set(prev).add(targetRegion.id));
      }
    } else if (currentDropIndicator.type === "between") {
      // Make it a sibling
      const targetParentId = targetRegion.parentId;
      const siblings = allRegions.filter((r) => r.parentId === targetParentId);
      const targetIndex = siblings.findIndex((r) => r.id === targetRegion.id);

      if (targetIndex === -1) return;

      // Move to new parent if needed
      if (draggedRegion.parentId !== targetParentId && onMoveRegion) {
        onMoveRegion(draggedRegion.id, targetParentId);
      }

      // Reorder
      const reorderedSiblings = siblings.filter(
        (r) => r.id !== draggedRegion.id
      );
      const insertIndex =
        currentDropIndicator.position === "before"
          ? targetIndex
          : targetIndex + 1;

      const draggedIndex = siblings.findIndex((r) => r.id === draggedRegion.id);
      let finalInsertIndex = insertIndex;

      if (draggedIndex !== -1 && draggedIndex < targetIndex) {
        if (currentDropIndicator.position === "after") {
          finalInsertIndex--;
        }
      } else if (draggedIndex !== -1 && draggedIndex > targetIndex) {
        if (currentDropIndicator.position === "before") {
          // No adjustment needed
        }
      }

      reorderedSiblings.splice(finalInsertIndex, 0, draggedRegion);

      if (onReorderRegions) {
        onReorderRegions(
          reorderedSiblings.map((r) => r.id),
          targetParentId
        );
      }
    }
  };

  const handleDragCancel = () => {
    // Cancel any pending RAF
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }

    setActiveRegion(null);
    setDropIndicator(null);
    setCurrentOverId(null);
  };

  if (localRegions.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        {t("hierarchy_manager.no_regions")}
      </div>
    );
  }

  const dropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: "0.5",
        },
      },
    }),
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragMove={handleDragMove}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
      measuring={measuring}
    >
      <SortableContext
        items={allRegions.map((r) => r.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-4">
          {localRegions.map((region) => (
            <div key={region.id} id={`region-${region.id}`}>
              <RegionNode
                region={region}
                level={0}
                onDelete={onDelete}
                activeRegion={activeRegion}
                dropIndicator={dropIndicator}
                expandedNodes={expandedNodes}
                onToggleExpand={handleToggleExpand}
              />
            </div>
          ))}
        </div>
      </SortableContext>

      {/* Drag Overlay - renders at document.body level with high z-index */}
      {createPortal(
        <DragOverlay dropAnimation={dropAnimation} style={{ zIndex: 99999 }}>
          {activeRegion ? (
            <div className="w-auto max-w-md">
              <RegionItem region={activeRegion} isOverlay />
            </div>
          ) : null}
        </DragOverlay>,
        document.body
      )}
    </DndContext>
  );
}

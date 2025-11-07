import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  DragOverlay,
  type DragStartEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ChevronDown, ChevronRight, ChevronUp, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

import type { IPowerBlock, IPowerSection, IPowerPage, BlockContent } from "../types/power-system-types";
import {
  HeadingBlock,
  ParagraphBlock,
  UnorderedListBlock,
  NumberedListBlock,
  TagListBlock,
  DropdownBlock,
  MultiDropdownBlock,
  ImageBlock,
  IconBlock,
  IconGroupBlock,
  InformativeBlock,
  DividerBlock,
  StarsBlock,
  AttributesBlock,
  NavigatorBlock,
} from "./blocks";

interface SectionComponentProps {
  section: IPowerSection;
  blocks: IPowerBlock[];
  pages?: IPowerPage[]; // Available pages for navigator block
  isEditMode: boolean;
  isFirst?: boolean;
  isLast?: boolean;
  onUpdateSection: (title: string) => void;
  onDeleteSection: () => void;
  onAddBlock: () => void;
  onUpdateBlock: (blockId: string, content: BlockContent) => void;
  onDeleteBlock: (blockId: string) => void;
  onReorderBlocks: (blocks: IPowerBlock[]) => void;
  onPageSelect?: (pageId: string) => void; // For navigator block
  onMoveUp?: () => void;
  onMoveDown?: () => void;
}

interface SortableBlockProps {
  block: IPowerBlock;
  pages?: IPowerPage[];
  isEditMode: boolean;
  onUpdate: (content: BlockContent) => void;
  onDelete: () => void;
  onPageSelect?: (pageId: string) => void;
}

function SortableBlock({
  block,
  pages,
  isEditMode,
  onUpdate,
  onDelete,
  onPageSelect,
}: SortableBlockProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    // Torna o elemento invisível durante o drag (o DragOverlay mostrará a cópia)
    opacity: isDragging ? 0 : 1,
  };

  const renderBlock = () => {
    const commonProps = {
      block,
      isEditMode,
      onUpdate,
      onDelete,
    };

    switch (block.type) {
      case "heading":
        return <HeadingBlock {...commonProps} />;
      case "paragraph":
        return <ParagraphBlock {...commonProps} />;
      case "unordered-list":
        return <UnorderedListBlock {...commonProps} />;
      case "numbered-list":
        return <NumberedListBlock {...commonProps} />;
      case "tag-list":
        return <TagListBlock {...commonProps} />;
      case "dropdown":
        return <DropdownBlock {...commonProps} />;
      case "multi-dropdown":
        return <MultiDropdownBlock {...commonProps} />;
      case "image":
        return <ImageBlock {...commonProps} />;
      case "icon":
        return <IconBlock {...commonProps} />;
      case "icon-group":
        return <IconGroupBlock {...commonProps} />;
      case "informative":
        return <InformativeBlock {...commonProps} />;
      case "divider":
        return <DividerBlock {...commonProps} />;
      case "stars":
        return <StarsBlock {...commonProps} />;
      case "attributes":
        return <AttributesBlock {...commonProps} />;
      case "navigator":
        return <NavigatorBlock {...commonProps} pages={pages} onPageSelect={onPageSelect} />;
      default:
        return null;
    }
  };

  // Filter listeners to prevent dragging when clicking on elements with data-no-drag
  const filteredListeners = isEditMode
    ? Object.entries(listeners || {}).reduce((acc, [key, handler]) => {
        acc[key] = (event: React.SyntheticEvent) => {
          const target = event.target as HTMLElement;
          // Check if the target or any parent has data-no-drag="true"
          if (target.closest('[data-no-drag="true"]')) {
            return;
          }
          // Call the original handler
          if (handler) {
            handler(event);
          }
        };
        return acc;
      }, {} as typeof listeners)
    : {};

  // In edit mode, the entire block is draggable using the listeners
  // Interactive elements inside blocks should have data-no-drag="true" to prevent dragging
  if (isEditMode) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...filteredListeners}
        className="cursor-grab active:cursor-grabbing touch-none"
      >
        {renderBlock()}
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
    >
      {renderBlock()}
    </div>
  );
}

export function SectionComponent({
  section,
  blocks,
  pages,
  isEditMode,
  isFirst = false,
  isLast = false,
  onUpdateSection,
  onDeleteSection,
  onAddBlock,
  onUpdateBlock,
  onDeleteBlock,
  onReorderBlocks,
  onPageSelect,
  onMoveUp,
  onMoveDown,
}: SectionComponentProps) {
  const { t } = useTranslation("power-system");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const sortedBlocks = [...blocks].sort((a, b) => a.orderIndex - b.orderIndex);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    setActiveId(null);

    if (over && active.id !== over.id) {
      const oldIndex = sortedBlocks.findIndex((block) => block.id === active.id);
      const newIndex = sortedBlocks.findIndex((block) => block.id === over.id);

      const reorderedBlocks = arrayMove(sortedBlocks, oldIndex, newIndex).map(
        (block, index) => ({
          ...block,
          orderIndex: index,
        })
      );

      onReorderBlocks(reorderedBlocks);
    }
  };

  const activeBlock = activeId ? sortedBlocks.find(block => block.id === activeId) : null;

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };


  return (
    <div className="border rounded-lg bg-card" id={`section-${section.id}`}>
      {/* Section Header */}
      {isEditMode ? (
        <div className="border-b px-4 py-3">
          <div className="flex items-center gap-2">
            {/* Toggle Button in Edit Mode */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleCollapse}
              className="h-6 w-6 shrink-0 cursor-pointer"
            >
              {isCollapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>

            {/* Editable Title */}
            <Input
              value={section.title}
              onChange={(e) => onUpdateSection(e.target.value)}
              className="flex-1 text-lg font-semibold border-0 shadow-none px-2 h-auto focus-visible:ring-0"
              placeholder={t("section.title_placeholder")}
            />

            {/* Reorder Buttons */}
            {onMoveUp && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onMoveUp}
                    disabled={isFirst}
                    className="h-8 w-8 cursor-pointer"
                  >
                    <ChevronUp className="w-5 h-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-sm font-medium">
                    {t("sections.move_up")}
                  </p>
                </TooltipContent>
              </Tooltip>
            )}

            {onMoveDown && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onMoveDown}
                    disabled={isLast}
                    className="h-8 w-8 cursor-pointer"
                  >
                    <ChevronDown className="w-5 h-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-sm font-medium">
                    {t("sections.move_down")}
                  </p>
                </TooltipContent>
              </Tooltip>
            )}

            {/* Delete Button */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onDeleteSection}
                  className="text-destructive hover:bg-red-500/20 hover:text-red-600 cursor-pointer"
                >
                  <Trash2 className="w-5 h-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-sm font-medium">
                  {t("sections.delete")}
                </p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      ) : (
        <button
          onClick={toggleCollapse}
          className={cn(
            "w-full px-4 py-3 flex items-center gap-2 text-left hover:bg-muted transition-colors cursor-pointer",
            isCollapsed ? "rounded-lg" : "border-b rounded-t-lg"
          )}
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4 shrink-0" />
          ) : (
            <ChevronDown className="h-4 w-4 shrink-0" />
          )}
          <h2 className="text-lg font-semibold">
            {section.title || t("section.untitled")}
          </h2>
        </button>
      )}

      {/* Section Content */}
      {!isCollapsed && (
        <div className="p-4 space-y-3">
          {/* Blocks */}
          {sortedBlocks.length > 0 ? (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={sortedBlocks.map((block) => block.id)}
                strategy={verticalListSortingStrategy}
              >
                {sortedBlocks.map((block) => (
                  <SortableBlock
                    key={block.id}
                    block={block}
                    pages={pages}
                    isEditMode={isEditMode}
                    onUpdate={(content) => onUpdateBlock(block.id, content)}
                    onDelete={() => onDeleteBlock(block.id)}
                    onPageSelect={onPageSelect}
                  />
                ))}
              </SortableContext>

              <DragOverlay>
                {activeBlock ? (
                  <div className="cursor-grabbing opacity-80">
                    <SortableBlock
                      block={activeBlock}
                      pages={pages}
                      isEditMode={isEditMode}
                      onUpdate={(content) => onUpdateBlock(activeBlock.id, content)}
                      onDelete={() => onDeleteBlock(activeBlock.id)}
                      onPageSelect={onPageSelect}
                    />
                  </div>
                ) : null}
              </DragOverlay>
            </DndContext>
          ) : (
            !isEditMode && (
              <p className="text-sm text-muted-foreground text-center py-4">
                {t("section.empty_blocks")}
              </p>
            )
          )}

          {/* Add Block Button */}
          {isEditMode && (
            <Button
              variant="outline"
              onClick={() => {
                console.log("Add block button clicked!");
                onAddBlock();
              }}
              className="w-full cursor-pointer"
            >
              <Plus className="h-4 w-4 mr-2" />
              {t("section.add_block")}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

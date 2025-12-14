import { useState } from "react";

import {
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Plus,
  Trash2,
  Link,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

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
  SpacerBlock,
} from "./blocks";

import type {
  IPowerBlock,
  IPowerSection,
  IPowerPage,
  BlockContent,
} from "../types/power-system-types";

interface SectionComponentProps {
  section: IPowerSection;
  blocks: IPowerBlock[];
  pages?: IPowerPage[]; // Available pages for navigator block
  bookId: string; // For entity data loading
  isEditMode: boolean;
  isReadOnlyView?: boolean; // For controlling dropdown visibility (default: false)
  isFirst?: boolean;
  isLast?: boolean;
  onUpdateSection: (title: string) => void;
  onDeleteSection: () => void;
  onAddBlock: () => void;
  onUpdateBlock: (blockId: string, content: BlockContent) => void;
  onDeleteBlock: (blockId: string) => void;
  onReorderBlocks: (blocks: IPowerBlock[]) => void;
  onPageSelect?: (pageId: string) => void; // For navigator block
  currentPageId?: string; // Current page ID for navigator block
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onManageSectionLinks?: () => void; // For managing character links
}

interface BlockWrapperProps {
  block: IPowerBlock;
  pages?: IPowerPage[];
  bookId: string;
  isEditMode: boolean;
  isReadOnlyView?: boolean;
  isFirst: boolean;
  isLast: boolean;
  onUpdate: (content: BlockContent) => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onPageSelect?: (pageId: string) => void;
  currentPageId?: string;
}

function BlockWrapper({
  block,
  pages,
  bookId,
  isEditMode,
  isReadOnlyView = false,
  isFirst,
  isLast,
  onUpdate,
  onDelete,
  onMoveUp,
  onMoveDown,
  onPageSelect,
  currentPageId,
}: BlockWrapperProps) {
  const commonProps = {
    block,
    isEditMode,
    onUpdate,
    onDelete,
    onMoveUp,
    onMoveDown,
    isFirst,
    isLast,
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
      return (
        <DropdownBlock
          {...commonProps}
          isReadOnlyView={isReadOnlyView}
          bookId={bookId}
        />
      );
    case "multi-dropdown":
      return (
        <MultiDropdownBlock
          {...commonProps}
          isReadOnlyView={isReadOnlyView}
          bookId={bookId}
        />
      );
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
      return (
        <NavigatorBlock
          {...commonProps}
          pages={pages}
          onPageSelect={onPageSelect}
          currentPageId={currentPageId}
        />
      );
    case "spacer":
      return <SpacerBlock {...commonProps} />;
    default:
      return null;
  }
}

export function SectionComponent({
  section,
  blocks,
  pages,
  bookId,
  isEditMode,
  isReadOnlyView = false,
  isFirst = false,
  isLast = false,
  onUpdateSection,
  onDeleteSection,
  onAddBlock,
  onUpdateBlock,
  onDeleteBlock,
  onReorderBlocks,
  onPageSelect,
  currentPageId,
  onMoveUp,
  onMoveDown,
  onManageSectionLinks,
}: SectionComponentProps) {
  const { t } = useTranslation("power-system");
  const [isCollapsed, setIsCollapsed] = useState(false);

  const sortedBlocks = [...blocks].sort((a, b) => a.orderIndex - b.orderIndex);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleMoveBlockUp = (blockId: string) => {
    const currentIndex = sortedBlocks.findIndex((b) => b.id === blockId);
    if (currentIndex <= 0) return;

    const newBlocks = [...sortedBlocks];
    [newBlocks[currentIndex - 1], newBlocks[currentIndex]] = [
      newBlocks[currentIndex],
      newBlocks[currentIndex - 1],
    ];

    const reorderedBlocks = newBlocks.map((block, index) => ({
      ...block,
      orderIndex: index,
    }));

    onReorderBlocks(reorderedBlocks);
  };

  const handleMoveBlockDown = (blockId: string) => {
    const currentIndex = sortedBlocks.findIndex((b) => b.id === blockId);
    if (currentIndex >= sortedBlocks.length - 1) return;

    const newBlocks = [...sortedBlocks];
    [newBlocks[currentIndex], newBlocks[currentIndex + 1]] = [
      newBlocks[currentIndex + 1],
      newBlocks[currentIndex],
    ];

    const reorderedBlocks = newBlocks.map((block, index) => ({
      ...block,
      orderIndex: index,
    }));

    onReorderBlocks(reorderedBlocks);
  };

  return (
    <div className="border rounded-lg bg-card" id={`section-${section.id}`}>
      {/* Section Header */}
      {isEditMode ? (
        <div className={cn("px-4 py-3", !isCollapsed && "border-b")}>
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
              maxLength={100}
            />

            {/* Manage Links Button */}
            {onManageSectionLinks && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onManageSectionLinks}
                    className="h-8 w-8 cursor-pointer"
                  >
                    <Link className="w-5 h-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-sm font-medium">{t("links.manage")}</p>
                </TooltipContent>
              </Tooltip>
            )}

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
                  <p className="text-sm font-medium">{t("sections.move_up")}</p>
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
                  variant="ghost-destructive"
                  size="icon"
                  onClick={onDeleteSection}
                  className="cursor-pointer"
                >
                  <Trash2 className="w-5 h-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-sm font-medium">{t("sections.delete")}</p>
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
            sortedBlocks.map((block, index) => (
              <BlockWrapper
                key={block.id}
                block={block}
                pages={pages}
                bookId={bookId}
                isEditMode={isEditMode}
                isReadOnlyView={isReadOnlyView}
                isFirst={index === 0}
                isLast={index === sortedBlocks.length - 1}
                onUpdate={(content) => onUpdateBlock(block.id, content)}
                onDelete={() => onDeleteBlock(block.id)}
                onMoveUp={() => handleMoveBlockUp(block.id)}
                onMoveDown={() => handleMoveBlockDown(block.id)}
                onPageSelect={onPageSelect}
                currentPageId={currentPageId}
              />
            ))
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
              variant="secondary"
              onClick={() => {
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

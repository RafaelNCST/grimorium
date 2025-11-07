import { Plus, Search } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import type {
  IPowerBlock,
  IPowerPage,
  IPowerSection,
  IPowerSystem,
  BlockContent,
} from "../types/power-system-types";
import { SectionComponent } from "./section-component";

interface PageContentProps {
  system: IPowerSystem;
  page: IPowerPage;
  pages?: IPowerPage[]; // Available pages for navigator block
  sections: IPowerSection[];
  blocks: IPowerBlock[];
  isEditMode: boolean;
  onUpdatePageName: (name: string) => void;
  onAddSection: () => void;
  onUpdateSection: (sectionId: string, title: string) => void;
  onDeleteSection: (sectionId: string) => void;
  onReorderSections: (sections: IPowerSection[]) => void;
  onAddBlock: (sectionId: string) => void;
  onUpdateBlock: (blockId: string, content: BlockContent) => void;
  onDeleteBlock: (blockId: string) => void;
  onReorderBlocks: (sectionId: string, blocks: IPowerBlock[]) => void;
  onPageSelect?: (pageId: string) => void; // For navigator block
}

interface SectionWrapperProps {
  section: IPowerSection;
  blocks: IPowerBlock[];
  pages?: IPowerPage[];
  isEditMode: boolean;
  isFirst: boolean;
  isLast: boolean;
  onUpdateSection: (title: string) => void;
  onDeleteSection: () => void;
  onAddBlock: () => void;
  onUpdateBlock: (blockId: string, content: BlockContent) => void;
  onDeleteBlock: (blockId: string) => void;
  onReorderBlocks: (blocks: IPowerBlock[]) => void;
  onPageSelect?: (pageId: string) => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

function SectionWrapper({
  section,
  blocks,
  pages,
  isEditMode,
  isFirst,
  isLast,
  onUpdateSection,
  onDeleteSection,
  onAddBlock,
  onUpdateBlock,
  onDeleteBlock,
  onReorderBlocks,
  onPageSelect,
  onMoveUp,
  onMoveDown,
}: SectionWrapperProps) {
  return (
    <SectionComponent
      section={section}
      blocks={blocks}
      pages={pages}
      isEditMode={isEditMode}
      isFirst={isFirst}
      isLast={isLast}
      onUpdateSection={onUpdateSection}
      onDeleteSection={onDeleteSection}
      onAddBlock={onAddBlock}
      onUpdateBlock={onUpdateBlock}
      onDeleteBlock={onDeleteBlock}
      onReorderBlocks={onReorderBlocks}
      onPageSelect={onPageSelect}
      onMoveUp={onMoveUp}
      onMoveDown={onMoveDown}
    />
  );
}

export function PageContent({
  system,
  page,
  pages,
  sections,
  blocks,
  isEditMode,
  onUpdatePageName,
  onAddSection,
  onUpdateSection,
  onDeleteSection,
  onReorderSections,
  onAddBlock,
  onUpdateBlock,
  onDeleteBlock,
  onReorderBlocks,
  onPageSelect,
}: PageContentProps) {
  const { t } = useTranslation("power-system");
  const [sectionFilter, setSectionFilter] = useState("");

  const sortedSections = [...sections]
    .filter((section) =>
      section.title.toLowerCase().includes(sectionFilter.toLowerCase())
    )
    .sort((a, b) => a.orderIndex - b.orderIndex);

  const getBlocksForSection = (sectionId: string) => {
    return blocks.filter((block) => block.sectionId === sectionId);
  };

  const handleMoveSectionUp = (sectionId: string) => {
    const currentIndex = sortedSections.findIndex((s) => s.id === sectionId);
    if (currentIndex <= 0) return;

    const newSections = [...sortedSections];
    [newSections[currentIndex - 1], newSections[currentIndex]] = [
      newSections[currentIndex],
      newSections[currentIndex - 1],
    ];

    const reorderedSections = newSections.map((section, index) => ({
      ...section,
      orderIndex: index,
    }));

    onReorderSections(reorderedSections);
  };

  const handleMoveSectionDown = (sectionId: string) => {
    const currentIndex = sortedSections.findIndex((s) => s.id === sectionId);
    if (currentIndex >= sortedSections.length - 1) return;

    const newSections = [...sortedSections];
    [newSections[currentIndex], newSections[currentIndex + 1]] = [
      newSections[currentIndex + 1],
      newSections[currentIndex],
    ];

    const reorderedSections = newSections.map((section, index) => ({
      ...section,
      orderIndex: index,
    }));

    onReorderSections(reorderedSections);
  };


  return (
    <div className="flex-1 flex flex-col h-full bg-background">
      {/* Page Header */}
      <div className="border-b bg-card px-6 py-4 space-y-4">
        <div className="flex items-center justify-between gap-3">
          {/* Page Name */}
          <div className="flex-1">
            {isEditMode ? (
              <Input
                value={page.name}
                onChange={(e) => onUpdatePageName(e.target.value)}
                className="text-2xl font-bold border-0 shadow-none px-3 h-auto focus-visible:ring-0"
                placeholder={t("pages.name_placeholder")}
              />
            ) : (
              <h1 className="text-2xl font-bold">{page.name}</h1>
            )}
          </div>

          {/* Add Section Button (Edit Mode Only) */}
          {isEditMode && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="magical"
                  size="icon"
                  onClick={onAddSection}
                  className="animate-glow cursor-pointer"
                >
                  <Plus className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-sm font-medium">
                  {t("pages.add_section")}
                </p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>

        {/* Section Filter */}
        {sortedSections.length > 0 && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={sectionFilter}
              onChange={(e) => setSectionFilter(e.target.value)}
              placeholder={t("pages.filter_sections")}
              className="pl-9 pr-3 py-2"
            />
          </div>
        )}
      </div>

      {/* Page Content */}
      <ScrollArea className="flex-1">
        <div className="px-6 py-6 pb-20 max-w-4xl mx-auto">
          {sortedSections.length === 0 ? (
            <div className="flex items-center justify-center h-64">
              <p className="text-muted-foreground">
                {t("pages.empty_sections")}
              </p>
            </div>
          ) : (
            <div className="space-y-8 pb-8">
              {sortedSections.map((section, index) => (
                <SectionWrapper
                  key={section.id}
                  section={section}
                  blocks={getBlocksForSection(section.id)}
                  pages={pages}
                  isEditMode={isEditMode}
                  isFirst={index === 0}
                  isLast={index === sortedSections.length - 1}
                  onUpdateSection={(title) =>
                    onUpdateSection(section.id, title)
                  }
                  onDeleteSection={() => onDeleteSection(section.id)}
                  onAddBlock={() => {
                    console.log("onAddBlock called in page-content for section:", section.id);
                    onAddBlock(section.id);
                  }}
                  onUpdateBlock={onUpdateBlock}
                  onDeleteBlock={onDeleteBlock}
                  onReorderBlocks={(blocks) =>
                    onReorderBlocks(section.id, blocks)
                  }
                  onPageSelect={onPageSelect}
                  onMoveUp={() => handleMoveSectionUp(section.id)}
                  onMoveDown={() => handleMoveSectionDown(section.id)}
                />
              ))}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

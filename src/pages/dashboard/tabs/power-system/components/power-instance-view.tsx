import { useEffect, useState } from "react";

import { ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  getPowerLinkById,
  getPowerPageById,
  getPowerSectionById,
  getPowerSectionsByPageId,
  getPowerBlocksBySectionId,
} from "@/lib/db/power-system.service";

import { SectionComponent } from "./section-component";

import type {
  IPowerCharacterLink,
  IPowerPage,
  IPowerSection,
  IPowerBlock,
} from "../types/power-system-types";

interface PowerInstanceViewProps {
  linkId: string;
  bookId: string;
  onBack: () => void;
}

export function PowerInstanceView({
  linkId,
  bookId,
  onBack,
}: PowerInstanceViewProps) {
  const _t = useTranslation("power-system").t;
  const [link, setLink] = useState<IPowerCharacterLink | null>(null);
  const [page, setPage] = useState<IPowerPage | null>(null);
  const [sections, setSections] = useState<IPowerSection[]>([]);
  const [blocks, setBlocks] = useState<IPowerBlock[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPowerInstance();
  }, [linkId]);

  const loadPowerInstance = async () => {
    try {
      setIsLoading(true);

      // Load the power link
      const powerLink = await getPowerLinkById(linkId);
      if (!powerLink) {
        onBack();
        return;
      }

      setLink(powerLink);

      // Load data based on whether it's a page or section link
      if (powerLink.pageId) {
        // Load page + all sections + blocks
        const powerPage = await getPowerPageById(powerLink.pageId);
        if (!powerPage) {
          onBack();
          return;
        }

        setPage(powerPage);

        // Load all sections for this page
        const pageSections = await getPowerSectionsByPageId(powerLink.pageId);
        setSections(pageSections);

        // Load all blocks for all sections
        const allBlocks: IPowerBlock[] = [];
        for (const section of pageSections) {
          const sectionBlocks = await getPowerBlocksBySectionId(section.id);
          allBlocks.push(...sectionBlocks);
        }
        setBlocks(allBlocks);
      } else if (powerLink.sectionId) {
        // Load only this specific section + blocks
        const powerSection = await getPowerSectionById(powerLink.sectionId);
        if (!powerSection) {
          onBack();
          return;
        }

        setSections([powerSection]);

        // Load blocks for this section
        const sectionBlocks = await getPowerBlocksBySectionId(
          powerLink.sectionId
        );
        setBlocks(sectionBlocks);
      }
    } catch (error) {
      console.error("Error loading power instance:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Loading power...</p>
        </div>
      </div>
    );
  }

  if (!link) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Power link not found</p>
          <Button onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="border-b bg-card px-6 py-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="cursor-pointer"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>

          <div>
            <h1 className="text-2xl font-bold">
              {link.customLabel || page?.name || "Power Instance"}
            </h1>
            {link.customLabel && page?.name && (
              <p className="text-sm text-muted-foreground mt-1">{page.name}</p>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        <div className="px-6 py-6 pb-20 max-w-4xl mx-auto">
          {sections.length === 0 ? (
            <div className="flex items-center justify-center h-64">
              <p className="text-muted-foreground">No content available</p>
            </div>
          ) : (
            <div className="space-y-8">
              {sections.map((section) => (
                <SectionComponent
                  key={section.id}
                  section={section}
                  blocks={blocks.filter((b) => b.sectionId === section.id)}
                  bookId={bookId}
                  isEditMode={false}
                  isReadOnlyView
                  onUpdateSection={() => {}}
                  onDeleteSection={() => {}}
                  onAddBlock={() => {}}
                  onUpdateBlock={() => {}}
                  onDeleteBlock={() => {}}
                  onReorderBlocks={() => {}}
                />
              ))}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

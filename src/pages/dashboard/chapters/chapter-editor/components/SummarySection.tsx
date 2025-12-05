import { useState } from "react";

import { ChevronDown, ChevronUp } from "lucide-react";
import { useTranslation } from "react-i18next";

import {
  FormEntityMultiSelectAuto,
  type EntityOption,
} from "@/components/forms/FormEntityMultiSelectAuto";
import { FormTextarea } from "@/components/forms/FormTextarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

import type { EntityMention } from "../types";

interface SummarySectionProps {
  bookId: string;
  summary: string;
  mentionedCharacters: EntityMention[];
  mentionedRegions: EntityMention[];
  mentionedItems: EntityMention[];
  mentionedFactions: EntityMention[];
  mentionedRaces: EntityMention[];
  onSummaryChange: (value: string) => void;
  onMentionedCharactersChange: (value: EntityMention[]) => void;
  onMentionedRegionsChange: (value: EntityMention[]) => void;
  onMentionedItemsChange: (value: EntityMention[]) => void;
  onMentionedFactionsChange: (value: EntityMention[]) => void;
  onMentionedRacesChange: (value: EntityMention[]) => void;
}

export function SummarySection({
  bookId,
  summary,
  mentionedCharacters,
  mentionedRegions,
  mentionedItems,
  mentionedFactions,
  mentionedRaces,
  onSummaryChange,
  onMentionedCharactersChange,
  onMentionedRegionsChange,
  onMentionedItemsChange,
  onMentionedFactionsChange,
  onMentionedRacesChange,
}: SummarySectionProps) {
  const { t } = useTranslation("chapter-editor");
  const [isOpen, setIsOpen] = useState(false);

  // Helper to convert EntityMention[] to IDs
  const entitiesToIds = (entities: EntityMention[]): string[] =>
    entities.map((e) => e.id);

  return (
    <Card className="border-2 border-primary/20">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 flex items-center justify-between cursor-pointer hover:bg-white/5 dark:hover:bg-white/10 transition-colors duration-200 rounded-t-lg"
      >
        <h2 className="text-lg font-semibold">
          {t("collapsible.summary_title")}
        </h2>
        {isOpen ? (
          <ChevronUp className="w-5 h-5" />
        ) : (
          <ChevronDown className="w-5 h-5" />
        )}
      </div>

      <div
        className={cn(
          "overflow-hidden transition-all duration-300",
          isOpen ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="p-6 space-y-6">
          {/* Summary */}
          <div>
            <Label className="text-primary mb-2 block">
              {t("collapsible.summary_label")}
            </Label>
            <FormTextarea
              value={summary}
              onChange={(e) => onSummaryChange(e.target.value)}
              placeholder={t("collapsible.summary_placeholder")}
              rows={4}
              maxLength={500}
              showCharCount
              className="resize-none"
            />
          </div>

          {/* Mentioned Characters */}
          <FormEntityMultiSelectAuto
            entityType="character"
            bookId={bookId}
            label={t("collapsible.mentioned_characters")}
            placeholder={t("collapsible.mentioned_characters")}
            emptyText={t("collapsible.no_entities_selected")}
            noSelectionText={t("collapsible.no_entities_selected")}
            searchPlaceholder={t("collapsible.mentioned_characters")}
            value={entitiesToIds(mentionedCharacters)}
            onChange={(ids, entities) => onMentionedCharactersChange(entities)}
            labelClassName="text-sm font-medium text-primary"
          />

          {/* Mentioned Regions */}
          <FormEntityMultiSelectAuto
            entityType="region"
            bookId={bookId}
            label={t("collapsible.mentioned_regions")}
            placeholder={t("collapsible.mentioned_regions")}
            emptyText={t("collapsible.no_entities_selected")}
            noSelectionText={t("collapsible.no_entities_selected")}
            searchPlaceholder={t("collapsible.mentioned_regions")}
            value={entitiesToIds(mentionedRegions)}
            onChange={(ids, entities) => onMentionedRegionsChange(entities)}
            labelClassName="text-sm font-medium text-primary"
          />

          {/* Mentioned Items */}
          <FormEntityMultiSelectAuto
            entityType="item"
            bookId={bookId}
            label={t("collapsible.mentioned_items")}
            placeholder={t("collapsible.mentioned_items")}
            emptyText={t("collapsible.no_entities_selected")}
            noSelectionText={t("collapsible.no_entities_selected")}
            searchPlaceholder={t("collapsible.mentioned_items")}
            value={entitiesToIds(mentionedItems)}
            onChange={(ids, entities) => onMentionedItemsChange(entities)}
            labelClassName="text-sm font-medium text-primary"
          />

          {/* Mentioned Factions */}
          <FormEntityMultiSelectAuto
            entityType="faction"
            bookId={bookId}
            label={t("collapsible.mentioned_factions")}
            placeholder={t("collapsible.mentioned_factions")}
            emptyText={t("collapsible.no_entities_selected")}
            noSelectionText={t("collapsible.no_entities_selected")}
            searchPlaceholder={t("collapsible.mentioned_factions")}
            value={entitiesToIds(mentionedFactions)}
            onChange={(ids, entities) => onMentionedFactionsChange(entities)}
            labelClassName="text-sm font-medium text-primary"
          />

          {/* Mentioned Races */}
          <FormEntityMultiSelectAuto
            entityType="race"
            bookId={bookId}
            label={t("collapsible.mentioned_races")}
            placeholder={t("collapsible.mentioned_races")}
            emptyText={t("collapsible.no_entities_selected")}
            noSelectionText={t("collapsible.no_entities_selected")}
            searchPlaceholder={t("collapsible.mentioned_races")}
            value={entitiesToIds(mentionedRaces)}
            onChange={(ids, entities) => onMentionedRacesChange(entities)}
            labelClassName="text-sm font-medium text-primary"
          />
        </div>
      </div>
    </Card>
  );
}

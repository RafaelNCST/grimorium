import React from "react";

import { Package } from "lucide-react";
import { useTranslation } from "react-i18next";

import { FieldWithVisibilityToggle } from "@/components/detail-page/FieldWithVisibilityToggle";
import {
  DisplayTextarea,
  DisplaySelectGrid,
  type DisplaySelectGridOption,
} from "@/components/displays";
import { FormImageDisplay } from "@/components/forms/FormImageDisplay";
import { EntityDetailLayout } from "@/components/layouts/EntityDetailLayout";
import {
  ITEM_CATEGORIES_CONSTANT,
  type IItemCategory,
} from "@/components/modals/create-item-modal/constants/item-categories";
import {
  ITEM_STATUSES_CONSTANT,
  type IItemStatus,
} from "@/components/modals/create-item-modal/constants/item-statuses";
import {
  STORY_RARITIES_CONSTANT,
  type IStoryRarity,
} from "@/components/modals/create-item-modal/constants/story-rarities";
import { Badge } from "@/components/ui/badge";
import { EntityTagBadge } from "@/components/ui/entity-tag-badge";
import { Separator } from "@/components/ui/separator";
import type { IItem } from "@/lib/db/items.service";

interface ItemSuperViewProps {
  item: IItem;
  displayData: IItem;
  bookId: string;
  onBack: () => void;
}

// Helper component for empty state
const EmptyFieldState = ({ t }: { t: (key: string) => string }) => (
  <div className="text-sm text-muted-foreground py-2 px-3 bg-muted/30 rounded-md">
    <p>{t("item-detail:empty_states.no_data")}</p>
  </div>
);

export function ItemSuperView({
  item,
  displayData,
  bookId,
  onBack,
}: ItemSuperViewProps) {
  const { t } = useTranslation(["item-detail", "create-item"] as any);

  // Mock field visibility - all visible in read-only mode
  const fieldVisibility: Record<string, boolean> = {};
  const isEditing = false;
  const onFieldVisibilityToggle = () => {};

  // Get current category and status data
  const currentCategory = ITEM_CATEGORIES_CONSTANT.find(
    (c) => c.value === item.category
  );
  const CategoryIcon = currentCategory?.icon;

  const currentStatus = ITEM_STATUSES_CONSTANT.find(
    (s) => s.value === item.status
  );
  const StatusIcon = currentStatus?.icon;

  // Display category (handle "other" with custom category)
  const displayCategory =
    item.category === "other" && item.customCategory
      ? item.customCategory
      : t(`create-item:category.${item.category}`);

  // ==================
  // BASIC FIELDS
  // ==================
  const basicFields = (
    <div className="space-y-6">
      {/* Image Display */}
      <div className="flex justify-center -mx-6">
        <div className="w-full max-w-[587px] px-6">
          {item.image ? (
            <div className="relative w-full h-80 rounded-lg overflow-hidden border">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="relative w-full h-80 rounded-lg overflow-hidden">
              <FormImageDisplay
                icon={Package}
                height="h-full"
                width="w-full"
                shape="square"
                className="rounded-lg"
              />
            </div>
          )}
        </div>
      </div>

      {/* Item Info - Card style with fields stacked */}
      <div className="space-y-3">
        {/* Name */}
        <div>
          <h2 className="text-3xl font-bold">{item.name}</h2>
        </div>

        {/* Category and Status Badges */}
        <div className="flex items-center gap-2 flex-wrap">
          {currentCategory && CategoryIcon && (
            <Badge
              className={`${currentCategory.bgColorClass} ${currentCategory.colorClass} border px-3 py-1 pointer-events-none select-none`}
            >
              <CategoryIcon className="w-3.5 h-3.5 mr-1.5" />
              <span className="text-xs font-medium">{displayCategory}</span>
            </Badge>
          )}
          {currentStatus && StatusIcon && (
            <Badge
              className={`${currentStatus.bgColorClass} ${currentStatus.colorClass} border px-3 py-1 pointer-events-none select-none`}
            >
              <StatusIcon className="w-3.5 h-3.5 mr-1.5" />
              <span className="text-xs font-medium">
                {t(`create-item:${currentStatus.translationKey}`)}
              </span>
            </Badge>
          )}
        </div>

        {/* Basic Description */}
        <div>
          <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
            {item.basicDescription || (
              <span className="italic text-muted-foreground/60">
                {t("item-detail:empty_states.no_data")}
              </span>
            )}
          </p>
        </div>

        {/* Alternative Names */}
        {item.alternativeNames && item.alternativeNames.length > 0 && (
          <div>
            <p className="text-xs text-muted-foreground">
              Também conhecido como: {item.alternativeNames.join(", ")}
            </p>
          </div>
        )}
      </div>
    </div>
  );

  // ==================
  // ADVANCED FIELDS
  // ==================
  const advancedFields = (
    <div className="space-y-6">
      {/* DETAILED DESCRIPTIONS Section */}
      <div className="space-y-4">
        <h4 className="text-base font-bold text-foreground uppercase tracking-wide">
          {t("item-detail:sections.detailed_descriptions")}
        </h4>

        {/* Appearance */}
        <FieldWithVisibilityToggle
          fieldName="appearance"
          label={t("item-detail:fields.appearance")}
          isOptional
          fieldVisibility={fieldVisibility}
          isEditing={isEditing}
          onFieldVisibilityToggle={onFieldVisibilityToggle}
        >
          <DisplayTextarea value={item.appearance} />
        </FieldWithVisibilityToggle>

        {/* Origin */}
        <FieldWithVisibilityToggle
          fieldName="origin"
          label={t("item-detail:fields.origin")}
          isOptional
          fieldVisibility={fieldVisibility}
          isEditing={isEditing}
          onFieldVisibilityToggle={onFieldVisibilityToggle}
        >
          <DisplayTextarea value={item.origin} />
        </FieldWithVisibilityToggle>

        {/* Alternative Names */}
        <FieldWithVisibilityToggle
          fieldName="alternativeNames"
          label=""
          isOptional
          fieldVisibility={fieldVisibility}
          isEditing={isEditing}
          onFieldVisibilityToggle={onFieldVisibilityToggle}
        >
          <div>
            <p className="text-sm font-medium mb-2">
              {t("item-detail:fields.alternative_names")}
            </p>
            {item.alternativeNames && item.alternativeNames.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {item.alternativeNames.map((name, index) => (
                  <span
                    key={index}
                    className="text-sm px-2 py-1 bg-muted rounded-md"
                  >
                    {name}
                  </span>
                ))}
              </div>
            ) : (
              <span className="italic text-muted-foreground/60">
                {t("item-detail:empty_states.no_data")}
              </span>
            )}
          </div>
        </FieldWithVisibilityToggle>
      </div>

      <Separator />

      {/* NARRATIVE Section */}
      <div className="space-y-4">
        <h4 className="text-base font-bold text-foreground uppercase tracking-wide">
          {t("item-detail:sections.narrative")}
        </h4>

        {/* Story Rarity */}
        <FieldWithVisibilityToggle
          fieldName="storyRarity"
          label={t("item-detail:fields.story_rarity")}
          isOptional
          fieldVisibility={fieldVisibility}
          isEditing={isEditing}
          onFieldVisibilityToggle={onFieldVisibilityToggle}
        >
          <DisplaySelectGrid
            value={item.storyRarity}
            options={STORY_RARITIES_CONSTANT.map(
              (rarity): DisplaySelectGridOption => ({
                value: rarity.value,
                label: t(`create-item:${rarity.translationKey}`),
                description: t(`create-item:${rarity.descriptionKey}`),
                icon: rarity.icon,
                backgroundColor:
                  rarity.value === "common"
                    ? "gray-500/20"
                    : rarity.value === "rare"
                      ? "blue-500/20"
                      : rarity.value === "legendary"
                        ? "purple-500/20"
                        : "yellow-500/20",
                borderColor:
                  rarity.value === "common"
                    ? "gray-500/30"
                    : rarity.value === "rare"
                      ? "blue-500/30"
                      : rarity.value === "legendary"
                        ? "purple-500/30"
                        : "yellow-500/30",
              })
            )}
          />
        </FieldWithVisibilityToggle>

        {/* Narrative Purpose */}
        <FieldWithVisibilityToggle
          fieldName="narrativePurpose"
          label={t("item-detail:fields.narrative_purpose")}
          isOptional
          fieldVisibility={fieldVisibility}
          isEditing={isEditing}
          onFieldVisibilityToggle={onFieldVisibilityToggle}
        >
          <DisplayTextarea value={item.narrativePurpose} />
        </FieldWithVisibilityToggle>
      </div>

      <Separator />

      {/* MECHANICS Section */}
      <div className="space-y-4">
        <h4 className="text-base font-bold text-foreground uppercase tracking-wide">
          {t("item-detail:sections.mechanics")}
        </h4>

        {/* Usage Requirements */}
        <FieldWithVisibilityToggle
          fieldName="usageRequirements"
          label={t("item-detail:fields.usage_requirements")}
          isOptional
          fieldVisibility={fieldVisibility}
          isEditing={isEditing}
          onFieldVisibilityToggle={onFieldVisibilityToggle}
        >
          <DisplayTextarea value={item.usageRequirements} />
        </FieldWithVisibilityToggle>

        {/* Usage Consequences */}
        <FieldWithVisibilityToggle
          fieldName="usageConsequences"
          label={t("item-detail:fields.usage_consequences")}
          isOptional
          fieldVisibility={fieldVisibility}
          isEditing={isEditing}
          onFieldVisibilityToggle={onFieldVisibilityToggle}
        >
          <DisplayTextarea value={item.usageConsequences} />
        </FieldWithVisibilityToggle>

        {/* Item Usage */}
        <FieldWithVisibilityToggle
          fieldName="itemUsage"
          label={t("item-detail:fields.item_usage")}
          isOptional
          fieldVisibility={fieldVisibility}
          isEditing={isEditing}
          onFieldVisibilityToggle={onFieldVisibilityToggle}
        >
          <DisplayTextarea value={item.itemUsage} />
        </FieldWithVisibilityToggle>
      </div>
    </div>
  );

  return (
    <div className="w-full">
      <div className="container mx-auto px-4 max-w-7xl py-8">
        <EntityDetailLayout
          // Header
          onBack={onBack}
          backLabel={t("item-detail:header.back")}
          // Mode
          isEditMode={false}
          // Content
          basicFields={basicFields}
          advancedFields={advancedFields}
          advancedSectionTitle={t("item-detail:sections.advanced_info")}
          advancedSectionOpen={true}
        />
      </div>
    </div>
  );
}

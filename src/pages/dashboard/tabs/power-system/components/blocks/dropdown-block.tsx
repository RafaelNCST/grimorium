import { useState } from "react";

import { Plus, Trash2, X } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

import { useEntityData } from "../../hooks/useEntityData";
import { useEntityResolver } from "../../hooks/useEntityResolver";
import {
  type IPowerBlock,
  type DropdownContent,
} from "../../types/power-system-types";
import { CharacterHoverCard } from "../entity-views/character-hover-card";
import { FactionHoverCard } from "../entity-views/faction-hover-card";
import { ItemHoverCard } from "../entity-views/item-hover-card";
import { RaceHoverCard } from "../entity-views/race-hover-card";
import { RegionHoverCard } from "../entity-views/region-hover-card";

import { DataSourceSelector } from "./shared/data-source-selector";
import { EntitySelect } from "./shared/entity-select";

interface DropdownBlockProps {
  block: IPowerBlock;
  bookId: string;
  isEditMode: boolean;
  isReadOnlyView?: boolean;
  onUpdate: (content: DropdownContent) => void;
  onDelete: () => void;
}

export function DropdownBlock({
  block,
  bookId,
  isEditMode,
  isReadOnlyView = false,
  onUpdate,
  onDelete,
}: DropdownBlockProps) {
  const { t } = useTranslation("power-system");
  const content = block.content as DropdownContent;
  const [newOption, setNewOption] = useState("");

  // Default to 'manual' for retrocompatibility
  const dataSource = content.dataSource || "manual";

  // Hooks for entity data
  const { entities, isLoading: isLoadingEntities } = useEntityData(
    dataSource,
    bookId
  );
  const { resolvedEntities } = useEntityResolver(
    dataSource,
    content.selectedEntityId ? [content.selectedEntityId] : [],
    bookId
  );

  const selectedEntity = resolvedEntities[0];

  const handleDataSourceChange = (newSource: typeof content.dataSource) => {
    onUpdate({
      ...content,
      dataSource: newSource,
      // Clear selections when changing source
      selectedValue: undefined,
      selectedEntityId: undefined,
    });
  };

  const handleAddOption = () => {
    if (newOption.trim() && !content.options.includes(newOption.trim())) {
      onUpdate({
        ...content,
        options: [...content.options, newOption.trim()],
      });
      setNewOption("");
    }
  };

  const handleDeleteOption = (option: string) => {
    const updatedOptions = content.options.filter((o) => o !== option);
    onUpdate({
      ...content,
      options: updatedOptions,
      selectedValue:
        content.selectedValue === option ? undefined : content.selectedValue,
    });
  };

  const handleSelectEntity = (entityId: string) => {
    onUpdate({
      ...content,
      selectedEntityId: entityId,
    });
  };

  // Helper function to render the appropriate hover card based on dataSource
  const renderHoverCard = (entityId: string, children: React.ReactNode) => {
    switch (dataSource) {
      case "characters":
        return (
          <CharacterHoverCard characterId={entityId}>
            {children}
          </CharacterHoverCard>
        );
      case "factions":
        return (
          <FactionHoverCard factionId={entityId}>{children}</FactionHoverCard>
        );
      case "items":
        return <ItemHoverCard itemId={entityId}>{children}</ItemHoverCard>;
      case "races":
        return <RaceHoverCard raceId={entityId}>{children}</RaceHoverCard>;
      case "regions":
        return <RegionHoverCard regionId={entityId}>{children}</RegionHoverCard>;
      default:
        return children;
    }
  };

  if (isEditMode) {
    return (
      <div className="space-y-3 p-4 rounded-lg border bg-card">
        {/* Top row: Data source selector and delete button */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <DataSourceSelector
            value={dataSource}
            onChange={handleDataSourceChange}
          />

          <Button
            data-no-drag="true"
            variant="ghost-destructive"
            size="icon"
            onClick={onDelete}
            className="cursor-pointer"
          >
            <Trash2 className="w-5 h-5" />
          </Button>
        </div>

        {/* Manual Mode */}
        {dataSource === "manual" && (
          <>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Input
                  data-no-drag="true"
                  placeholder={t("blocks.dropdown.option_placeholder")}
                  value={newOption}
                  onChange={(e) => setNewOption(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddOption();
                    }
                  }}
                  className="flex-1"
                />
                <Button
                  data-no-drag="true"
                  onClick={handleAddOption}
                  size="sm"
                  variant="secondary"
                  className="cursor-pointer"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  {t("blocks.dropdown.add_option_button")}
                </Button>
              </div>

              {content.options.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {content.options.map((option) => (
                    <div
                      key={option}
                      className="flex items-center gap-1 px-2 py-1 rounded-md bg-muted text-sm"
                    >
                      <span>{option}</span>
                      <button
                        data-no-drag="true"
                        onClick={() => handleDeleteOption(option)}
                        className="hover:text-red-600 transition-colors cursor-pointer"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {content.options.length > 0 && (
              <Select
                value={content.selectedValue || ""}
                onValueChange={(value) =>
                  onUpdate({ ...content, selectedValue: value })
                }
              >
                <SelectTrigger data-no-drag="true">
                  <SelectValue
                    placeholder={t("blocks.dropdown.select_placeholder")}
                  />
                </SelectTrigger>
                <SelectContent>
                  {content.options.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </>
        )}

        {/* Entity Modes (Characters, Factions, Items, Races, Regions) */}
        {dataSource !== "manual" && (
          <>
            {isLoadingEntities ? (
              <div className="text-sm text-muted-foreground">
                {t("blocks.dropdown.loading_entities")}
              </div>
            ) : entities.length === 0 ? (
              <div className="text-sm text-muted-foreground">
                {t("blocks.dropdown.no_entities")}
              </div>
            ) : (
              <Select
                value={content.selectedEntityId}
                onValueChange={handleSelectEntity}
              >
                {content.selectedEntityId && selectedEntity ? (
                  renderHoverCard(
                    content.selectedEntityId,
                    <span className="inline-block w-full">
                      <SelectTrigger data-no-drag="true" className="w-full">
                        <SelectValue>{selectedEntity.name}</SelectValue>
                      </SelectTrigger>
                    </span>
                  )
                ) : (
                  <SelectTrigger data-no-drag="true">
                    <SelectValue
                      placeholder={t("blocks.dropdown.select_entity")}
                    />
                  </SelectTrigger>
                )}
                <SelectContent>
                  {entities.map((entity) => (
                    <SelectItem key={entity.id} value={entity.id}>
                      {entity.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </>
        )}
      </div>
    );
  }

  // View Mode - Manual
  if (dataSource === "manual") {
    return content.options.length > 0 ? (
      <Select
        value={content.selectedValue || ""}
        onValueChange={(value) =>
          onUpdate({ ...content, selectedValue: value })
        }
        disabled={isReadOnlyView}
      >
        <SelectTrigger
          data-no-drag="true"
          className={cn("w-full", isReadOnlyView && "!cursor-default")}
        >
          <SelectValue placeholder={t("blocks.dropdown.select_placeholder")} />
        </SelectTrigger>
        <SelectContent>
          {content.options.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    ) : null;
  }

  // View Mode - Entity modes (Characters, Factions, Items, Races)
  if (dataSource !== "manual") {
    // If no entity is selected, show the select dropdown
    if (!content.selectedEntityId) {
      return (
        <Select
          value={content.selectedEntityId || ""}
          onValueChange={(value) => handleSelectEntity(value)}
          disabled={isReadOnlyView}
        >
          <SelectTrigger
            data-no-drag="true"
            className={cn("w-full", isReadOnlyView && "!cursor-default")}
          >
            <SelectValue placeholder={t("blocks.dropdown.select_entity")} />
          </SelectTrigger>
          <SelectContent>
            {entities.map((entity) => (
              <SelectItem key={entity.id} value={entity.id}>
                {entity.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }

    // If entity is selected, wrap the SelectTrigger in appropriate HoverCard
    return (
      <Select
        value={content.selectedEntityId}
        onValueChange={(value) => handleSelectEntity(value)}
        disabled={isReadOnlyView}
      >
        {renderHoverCard(
          content.selectedEntityId,
          <span className="inline-block w-full">
            <SelectTrigger
              data-no-drag="true"
              className={cn("w-full", isReadOnlyView && "!cursor-default")}
            >
              <SelectValue>{selectedEntity?.name ?? "Loading..."}</SelectValue>
            </SelectTrigger>
          </span>
        )}
        {!isReadOnlyView && (
          <SelectContent>
            {entities.map((entity) => (
              <SelectItem key={entity.id} value={entity.id}>
                {entity.name}
              </SelectItem>
            ))}
          </SelectContent>
        )}
      </Select>
    );
  }

  return null;
}

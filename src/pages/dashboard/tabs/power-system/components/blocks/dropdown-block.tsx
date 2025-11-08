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
import {
  type IPowerBlock,
  type DropdownContent,
} from "../../types/power-system-types";
import { cn } from "@/lib/utils";
import { DataSourceSelector } from "./shared/data-source-selector";
import { EntitySelect } from "./shared/entity-select";
import { useEntityData } from "../../hooks/useEntityData";
import { useEntityResolver } from "../../hooks/useEntityResolver";
import { CharacterHoverCard } from "../entity-views/character-hover-card";

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
  const dataSource = content.dataSource || 'manual';

  // Hooks for entity data
  const { entities, isLoading: isLoadingEntities } = useEntityData(dataSource, bookId);
  const { resolvedEntities } = useEntityResolver(
    dataSource,
    content.selectedEntityId ? [content.selectedEntityId] : [],
    bookId
  );

  const selectedEntity = resolvedEntities[0];

  const handleDataSourceChange = (newSource: 'manual' | 'characters') => {
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

  if (isEditMode) {
    return (
      <div className="space-y-3 p-4 rounded-lg border bg-card">
        <div className="flex items-center justify-between gap-2 mb-2">
          <Button
            data-no-drag="true"
            variant="ghost"
            size="icon"
            onClick={onDelete}
            className="text-destructive hover:bg-red-500/20 hover:text-red-600 ml-auto cursor-pointer"
          >
            <Trash2 className="w-5 h-5" />
          </Button>
        </div>

        {/* Data Source Selector */}
        <DataSourceSelector value={dataSource} onChange={handleDataSourceChange} />

        {/* Manual Mode */}
        {dataSource === 'manual' && (
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
                <Button data-no-drag="true" onClick={handleAddOption} size="sm" variant="outline" className="cursor-pointer">
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

        {/* Characters Mode */}
        {dataSource === 'characters' && (
          <EntitySelect
            entities={entities}
            selectedId={content.selectedEntityId}
            onSelect={handleSelectEntity}
            isLoading={isLoadingEntities}
            placeholder={t('blocks.dropdown.select_entity')}
          />
        )}
      </div>
    );
  }

  // View Mode - Manual
  if (dataSource === 'manual') {
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
    ) : null;
  }

  // View Mode - Characters
  if (dataSource === 'characters') {
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

    // If entity is selected, wrap it in HoverCard
    return (
      <CharacterHoverCard characterId={content.selectedEntityId}>
        <div className="cursor-pointer">
          <Select
            value={content.selectedEntityId}
            onValueChange={(value) => handleSelectEntity(value)}
            disabled={isReadOnlyView}
          >
            <SelectTrigger
              data-no-drag="true"
              className={cn("w-full", isReadOnlyView && "!cursor-default")}
            >
              <SelectValue>
                {selectedEntity?.name ?? 'Loading...'}
              </SelectValue>
            </SelectTrigger>
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
        </div>
      </CharacterHoverCard>
    );
  }

  return null;
}

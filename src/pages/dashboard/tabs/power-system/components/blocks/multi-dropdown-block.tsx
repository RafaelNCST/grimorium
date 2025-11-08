import { useState } from "react";
import { Plus, Trash2, X } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Badge } from "@/components/ui/badge";
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
  type MultiDropdownContent,
} from "../../types/power-system-types";
import { cn } from "@/lib/utils";
import { DataSourceSelector } from "./shared/data-source-selector";
import { EntitySelect } from "./shared/entity-select";
import { useEntityData } from "../../hooks/useEntityData";
import { useEntityResolver } from "../../hooks/useEntityResolver";
import { CharacterHoverCard } from "../entity-views/character-hover-card";

interface MultiDropdownBlockProps {
  block: IPowerBlock;
  bookId: string;
  isEditMode: boolean;
  isReadOnlyView?: boolean;
  onUpdate: (content: MultiDropdownContent) => void;
  onDelete: () => void;
}

export function MultiDropdownBlock({
  block,
  bookId,
  isEditMode,
  isReadOnlyView = false,
  onUpdate,
  onDelete,
}: MultiDropdownBlockProps) {
  const { t } = useTranslation("power-system");
  const content = block.content as MultiDropdownContent;
  const [newOption, setNewOption] = useState("");

  // Default to 'manual' for retrocompatibility
  const dataSource = content.dataSource || 'manual';

  // Hooks for entity data
  const { entities, isLoading: isLoadingEntities } = useEntityData(dataSource, bookId);
  const { resolvedEntities } = useEntityResolver(
    dataSource,
    content.selectedEntityIds || [],
    bookId
  );

  const handleDataSourceChange = (newSource: 'manual' | 'characters') => {
    onUpdate({
      ...content,
      dataSource: newSource,
      // Clear selections when changing source
      selectedValues: [],
      selectedEntityIds: [],
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
      selectedValues: content.selectedValues.filter((v) => v !== option),
    });
  };

  const handleSelectValue = (value: string) => {
    if (!content.selectedValues.includes(value)) {
      onUpdate({
        ...content,
        selectedValues: [...content.selectedValues, value],
      });
    }
  };

  const handleRemoveSelectedValue = (value: string) => {
    onUpdate({
      ...content,
      selectedValues: content.selectedValues.filter((v) => v !== value),
    });
  };

  const handleSelectEntity = (entityId: string) => {
    const currentIds = content.selectedEntityIds || [];
    if (!currentIds.includes(entityId)) {
      onUpdate({
        ...content,
        selectedEntityIds: [...currentIds, entityId],
      });
    }
  };

  const handleRemoveSelectedEntity = (entityId: string) => {
    onUpdate({
      ...content,
      selectedEntityIds: (content.selectedEntityIds || []).filter((id) => id !== entityId),
    });
  };

  const availableOptions = content.options.filter(
    (option) => !content.selectedValues.includes(option)
  );

  const availableEntities = entities.filter(
    (entity) => !(content.selectedEntityIds || []).includes(entity.id)
  );

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
                  placeholder={t("blocks.multi_dropdown.option_placeholder")}
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
                  {t("blocks.multi_dropdown.add_option_button")}
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

            <Select value="" onValueChange={handleSelectValue}>
              <SelectTrigger data-no-drag="true" disabled={availableOptions.length === 0}>
                <SelectValue
                  placeholder={
                    availableOptions.length === 0
                      ? t("blocks.multi_dropdown.no_options_available")
                      : t("blocks.multi_dropdown.select_placeholder")
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {availableOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {content.selectedValues.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {content.selectedValues.map((value) => (
                  <Badge
                    key={value}
                    variant="secondary"
                    className="px-3 py-1 text-sm group"
                  >
                    {value}
                    <button
                      data-no-drag="true"
                      onClick={() => handleRemoveSelectedValue(value)}
                      className="ml-2 hover:text-red-600 transition-colors cursor-pointer"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </>
        )}

        {/* Characters Mode */}
        {dataSource === 'characters' && (
          <>
            <Select value="" onValueChange={handleSelectEntity}>
              <SelectTrigger data-no-drag="true" disabled={availableEntities.length === 0 || isLoadingEntities}>
                <SelectValue
                  placeholder={
                    isLoadingEntities
                      ? t("blocks.dropdown.loading_entities")
                      : availableEntities.length === 0
                      ? t("blocks.multi_dropdown.no_options_available")
                      : t("blocks.dropdown.select_entity")
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {availableEntities.map((entity) => (
                  <SelectItem key={entity.id} value={entity.id}>
                    {entity.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {resolvedEntities.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {resolvedEntities.map((entity) => (
                  <Badge
                    key={entity.id}
                    variant="secondary"
                    className="px-3 py-1 text-sm group"
                  >
                    {entity.name}
                    <button
                      data-no-drag="true"
                      onClick={() => handleRemoveSelectedEntity(entity.id)}
                      className="ml-2 hover:text-red-600 transition-colors cursor-pointer"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    );
  }

  // View Mode - Manual
  if (dataSource === 'manual') {
    return (
      <div className="space-y-3">
        <Select
          value=""
          onValueChange={handleSelectValue}
          disabled={isReadOnlyView || availableOptions.length === 0}
        >
          <SelectTrigger
            data-no-drag="true"
            className={cn(isReadOnlyView && "!cursor-default")}
          >
            <SelectValue
              placeholder={
                availableOptions.length === 0
                  ? t("blocks.multi_dropdown.no_options_available")
                  : t("blocks.multi_dropdown.select_placeholder")
              }
            />
          </SelectTrigger>
          <SelectContent>
            {availableOptions.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {content.selectedValues.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {content.selectedValues.map((value) => (
              <Badge
                key={value}
                variant="secondary"
                className="px-3 py-1 text-sm group"
              >
                {value}
                {!isReadOnlyView && (
                  <button
                    data-no-drag="true"
                    onClick={() => handleRemoveSelectedValue(value)}
                    className="ml-2 hover:text-red-600 transition-colors cursor-pointer"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </Badge>
            ))}
          </div>
        )}
      </div>
    );
  }

  // View Mode - Characters
  if (dataSource === 'characters') {
    return (
      <div className="space-y-3">
        <Select
          value=""
          onValueChange={handleSelectEntity}
          disabled={isReadOnlyView || availableEntities.length === 0}
        >
          <SelectTrigger
            data-no-drag="true"
            className={cn(isReadOnlyView && "!cursor-default")}
          >
            <SelectValue
              placeholder={
                availableEntities.length === 0
                  ? t("blocks.multi_dropdown.no_options_available")
                  : t("blocks.dropdown.select_entity")
              }
            />
          </SelectTrigger>
          <SelectContent>
            {availableEntities.map((entity) => (
              <SelectItem key={entity.id} value={entity.id}>
                {entity.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {resolvedEntities.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {resolvedEntities.map((entity) => (
              <CharacterHoverCard key={entity.id} characterId={entity.id}>
                <Badge
                  variant="secondary"
                  className="cursor-pointer hover:bg-secondary/80 flex items-center gap-1 px-3 py-1 text-sm"
                >
                  {entity.name}
                  {!isReadOnlyView && (
                    <button
                      data-no-drag="true"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveSelectedEntity(entity.id);
                      }}
                      className="ml-1 hover:text-red-600 transition-colors cursor-pointer"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </Badge>
              </CharacterHoverCard>
            ))}
          </div>
        )}
      </div>
    );
  }

  return null;
}

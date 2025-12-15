import { useState, useEffect, useMemo } from "react";

import { X, Search, User, Shield, Dna, Package, MapPin } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/**
 * Entity type for auto-loading from database
 */
export type EntityType = "character" | "faction" | "race" | "item" | "region";

/**
 * Option interface for entity multi-select
 */
export interface EntityOption {
  id: string;
  name: string;
  image?: string;
  // Character fields
  age?: string;
  gender?: string;
  role?: string;
  status?: string;
  description?: string;
  // Item fields
  category?: string;
  basicDescription?: string;
  // Faction fields
  summary?: string;
  factionType?: string;
  // Race fields
  scientificName?: string;
  domain?: string[];
  // Region fields
  scale?: string;
  parentId?: string;
  parentName?: string;
}

const ENTITY_ICON_MAP: Record<EntityType, any> = {
  character: User,
  faction: Shield,
  race: Dna,
  item: Package,
  region: MapPin,
};

interface FormEntityMultiSelectAutoProps {
  /**
   * Entity type to load from database
   */
  entityType: EntityType;
  /**
   * Book ID to load entities for
   */
  bookId: string;
  /**
   * Label for the field (optional - omit when using inside FieldWithVisibilityToggle)
   */
  label?: string;
  /**
   * Placeholder text for the select
   */
  placeholder: string;
  /**
   * Text shown when no options are available
   */
  emptyText: string;
  /**
   * Text shown when no items are selected
   */
  noSelectionText: string;
  /**
   * Placeholder for search input
   */
  searchPlaceholder: string;
  /**
   * Text for "no results found"
   */
  noResultsText?: string;
  /**
   * Text for counter (e.g., "selected")
   */
  counterText?: string;
  /**
   * Selected entity IDs
   */
  value: string[];
  /**
   * Callback when selection changes
   */
  onChange: (value: string[], entities: EntityOption[]) => void;
  /**
   * Whether the field is disabled
   */
  disabled?: boolean;
  /**
   * Whether the field is required
   */
  required?: boolean;
  /**
   * Custom className for label
   */
  labelClassName?: string;
  /**
   * Optional error message
   */
  error?: string;
  /**
   * Optional filter function to exclude certain entities
   */
  filter?: (entity: EntityOption) => boolean;
  /**
   * Maximum number of selections allowed (optional)
   * When set, prevents selecting more than this number of items
   */
  maxSelections?: number;
}

// Import services dynamically based on entity type
const loadEntities = async (
  entityType: EntityType,
  bookId: string
): Promise<EntityOption[]> => {
  try {
    let data: any[] = [];

    switch (entityType) {
      case "character": {
        const { getCharactersByBookId } = await import(
          "@/lib/db/characters.service"
        );
        data = await getCharactersByBookId(bookId);
        break;
      }
      case "faction": {
        const { getFactionsByBookId } = await import(
          "@/lib/db/factions.service"
        );
        data = await getFactionsByBookId(bookId);
        break;
      }
      case "race": {
        const { getRacesByBookId } = await import("@/lib/db/races.service");
        data = await getRacesByBookId(bookId);
        break;
      }
      case "item": {
        const { getItemsByBookId } = await import("@/lib/db/items.service");
        data = await getItemsByBookId(bookId);
        break;
      }
      case "region": {
        const { getRegionsByBookId } = await import("@/lib/db/regions.service");
        data = await getRegionsByBookId(bookId);
        break;
      }
    }

    // Map to EntityOption interface with all relevant fields
    return data.map((item: any) => {
      const base = {
        id: item.id,
        name: item.name,
        image: item.image,
      };

      // Add type-specific fields
      switch (entityType) {
        case "character":
          return {
            ...base,
            age: item.age,
            gender: item.gender,
            role: item.role,
            status: item.status,
            description: item.description,
          };
        case "item":
          return {
            ...base,
            category: item.category,
            basicDescription: item.basicDescription,
            status: item.status,
          };
        case "faction":
          return {
            ...base,
            summary: item.summary,
            factionType: item.factionType,
            status: item.status,
          };
        case "race":
          return {
            ...base,
            scientificName: item.scientificName,
            domain: item.domain,
            summary: item.summary,
          };
        case "region": {
          // Find parent region name if parentId exists
          const parentRegion = item.parentId
            ? data.find((r: any) => r.id === item.parentId)
            : null;
          return {
            ...base,
            scale: item.scale,
            parentId: item.parentId,
            parentName:
              parentRegion?.name ||
              (item.parentId ? "Região Neutra" : undefined),
            summary: item.summary,
          };
        }
        default:
          return base;
      }
    });
  } catch (error) {
    console.error(`Error loading ${entityType} entities:`, error);
    return [];
  }
};

/**
 * FormEntityMultiSelectAuto - Auto-loading entity multi-selection component
 *
 * Automatically loads entities from database based on entityType and bookId.
 * Updates when bookId or entityType changes.
 *
 * @example
 * ```tsx
 * <FormEntityMultiSelectAuto
 *   entityType="character"
 *   bookId={bookId}
 *   label="Resident Characters"
 *   placeholder="Select characters..."
 *   emptyText="No characters available"
 *   noSelectionText="No characters selected"
 *   searchPlaceholder="Search characters..."
 *   value={selectedCharacterIds}
 *   onChange={setSelectedCharacterIds}
 * />
 * ```
 */
export function FormEntityMultiSelectAuto({
  entityType,
  bookId,
  label,
  placeholder,
  emptyText,
  noSelectionText,
  searchPlaceholder,
  noResultsText = "No results found",
  counterText,
  value,
  onChange,
  disabled = false,
  required = false,
  labelClassName = "text-sm font-medium text-primary",
  error,
  filter,
  maxSelections,
}: FormEntityMultiSelectAutoProps) {
  const { t } = useTranslation("common");
  const [searchQuery, setSearchQuery] = useState("");
  const [options, setOptions] = useState<EntityOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Use translated text if counterText not provided
  const displayCounterText = counterText || t("form.selected");

  // Load entities from database (only once per entityType/bookId)
  useEffect(() => {
    const fetchEntities = async () => {
      if (!bookId) return;

      setIsLoading(true);
      const entities = await loadEntities(entityType, bookId);
      setOptions(entities);
      setIsLoading(false);
    };

    fetchEntities();
  }, [entityType, bookId]);

  // Selected options should come from ALL options, not filtered ones
  // Because we want to show selected items even if they don't pass the filter
  const selectedOptions = useMemo(
    () => options.filter((opt) => value.includes(opt.id)),
    [options, value]
  );

  // Available options should be filtered AND exclude selected ones
  const availableOptions = useMemo(() => {
    // First filter by custom filter (if provided)
    const filtered = filter ? options.filter(filter) : options;
    // Then exclude already selected items
    return filtered.filter((opt) => !value.includes(opt.id));
  }, [options, filter, value]);

  // Check if max selections is reached
  const isMaxReached =
    maxSelections !== undefined && value.length >= maxSelections;

  // Filter available options by search query
  const searchFilteredOptions = useMemo(
    () =>
      availableOptions.filter((opt) =>
        opt.name.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [availableOptions, searchQuery]
  );

  const handleAdd = (optionId: string) => {
    // Check if max selections is reached
    if (maxSelections !== undefined && value.length >= maxSelections) {
      return;
    }

    if (!value.includes(optionId)) {
      const newIds = [...value, optionId];
      const newEntities = options.filter((opt) => newIds.includes(opt.id));
      onChange(newIds, newEntities);
      setSearchQuery(""); // Clear search after selection
    }
  };

  const handleRemove = (optionId: string) => {
    const newIds = value.filter((id) => id !== optionId);
    const newEntities = options.filter((opt) => newIds.includes(opt.id));
    onChange(newIds, newEntities);
  };

  const getAvatarShape = (type: EntityType): string => {
    return type === "character" ? "rounded-full" : "rounded-sm";
  };

  const EntityAvatar = ({
    image,
    name,
    size
  }: {
    image?: string;
    name: string;
    size: "sm" | "md";
  }) => {
    const Icon = ENTITY_ICON_MAP[entityType];
    const avatarShape = getAvatarShape(entityType);
    const sizeClasses = size === "sm" ? "w-8 h-8" : "w-10 h-10";
    const iconSize = size === "sm" ? "w-4 h-4" : "w-5 h-5";

    if (image) {
      return (
        <Avatar className={`${sizeClasses} ${avatarShape}`}>
          <AvatarImage src={image} alt={name} />
        </Avatar>
      );
    }

    return (
      <div
        className={`${sizeClasses} ${avatarShape} bg-purple-950/40 flex items-center justify-center`}
      >
        <Icon className={`${iconSize} text-purple-400`} />
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {label && (
          <Label className={labelClassName}>
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </Label>
        )}
        <div className="text-center py-6 text-muted-foreground border border-border rounded-lg">
          <p className="text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Header with label and counter */}
      {label && (
        <div className="flex items-center justify-between min-h-[20px]">
          <Label className={labelClassName}>
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </Label>
          <span className="text-xs text-muted-foreground">
            {selectedOptions.length > 0 ? (
              <>
                {selectedOptions.length}
                {maxSelections !== undefined && ` / ${maxSelections}`}{" "}
                {displayCounterText}
              </>
            ) : (
              <span className="opacity-0">
                0{maxSelections !== undefined && ` / ${maxSelections}`}{" "}
                {displayCounterText}
              </span>
            )}
          </span>
        </div>
      )}

      {/* No options available */}
      {options.length === 0 ? (
        <div className="h-[168px] flex items-center justify-center text-muted-foreground border border-dashed border-border rounded-lg bg-muted/20">
          <p className="text-sm">{emptyText}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Dropdown selector area - Fixed height to prevent layout shift */}
          <div className="h-10">
            {isMaxReached ? (
              <div className="h-full flex items-center justify-center text-xs text-muted-foreground border border-dashed border-border rounded-lg bg-muted/20">
                <p>
                  {t("form.max_selections_reached", { max: maxSelections })}
                </p>
              </div>
            ) : availableOptions.length > 0 ? (
              <Select value="" onValueChange={handleAdd} disabled={disabled}>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent>
                  {/* Search input inside dropdown */}
                  <div className="px-2 pb-2 pt-1 border-b sticky top-0 bg-popover z-10">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                      <Input
                        placeholder={searchPlaceholder}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 h-9"
                        onClick={(e) => e.stopPropagation()}
                        onKeyDown={(e) => e.stopPropagation()}
                      />
                    </div>
                  </div>

                  {/* Options list */}
                  <div className="max-h-[300px] overflow-y-auto">
                    {searchFilteredOptions.length === 0 ? (
                      <div className="py-6 text-center text-sm text-muted-foreground">
                        {noResultsText}
                      </div>
                    ) : (
                      searchFilteredOptions.map((option) => (
                        <SelectItem
                          key={option.id}
                          value={option.id}
                          className="py-3 cursor-pointer focus:!bg-primary/10 focus:!text-foreground hover:!bg-primary/10"
                        >
                          <div className="flex items-center gap-3">
                            <EntityAvatar
                              image={option.image}
                              name={option.name}
                              size="sm"
                            />
                            <span>{option.name}</span>
                          </div>
                        </SelectItem>
                      ))
                    )}
                  </div>
                </SelectContent>
              </Select>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-muted-foreground border border-dashed border-border rounded-lg bg-muted/20">
                <p>{t("form.all_options_selected")}</p>
              </div>
            )}
          </div>

          {/* Selected items display */}
          <div>
            {selectedOptions.length > 0 ? (
              <div className="max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                <div className="flex flex-wrap gap-3">
                  {selectedOptions.map((option) => (
                    <div
                      key={option.id}
                      className="relative group flex items-center gap-2 p-2 pr-3 rounded-lg border border-border bg-card hover:bg-muted/50 transition-colors"
                    >
                      <EntityAvatar
                        image={option.image}
                        name={option.name}
                        size="md"
                      />
                      <span className="text-sm font-medium">{option.name}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 ml-1"
                        onClick={() => handleRemove(option.id)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="min-h-[115px] flex items-center justify-center text-muted-foreground border border-dashed border-border rounded-lg">
                <p className="text-sm">{noSelectionText}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}

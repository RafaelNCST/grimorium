import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { X, Search } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
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
export type EntityType = 'character' | 'faction' | 'race' | 'item' | 'region';

/**
 * Option interface for entity multi-select
 */
export interface EntityOption {
  id: string;
  name: string;
  image?: string;
}

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
   * Label for the field
   */
  label: string;
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
  onChange: (value: string[]) => void;
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
}

// Import services dynamically based on entity type
const loadEntities = async (entityType: EntityType, bookId: string): Promise<EntityOption[]> => {
  try {
    let data: any[] = [];

    switch (entityType) {
      case 'character': {
        const { getCharactersByBookId } = await import('@/lib/db/characters.service');
        data = await getCharactersByBookId(bookId);
        break;
      }
      case 'faction': {
        const { getFactionsByBookId } = await import('@/lib/db/factions.service');
        data = await getFactionsByBookId(bookId);
        break;
      }
      case 'race': {
        const { getRacesByBookId } = await import('@/lib/db/races.service');
        data = await getRacesByBookId(bookId);
        break;
      }
      case 'item': {
        const { getItemsByBookId } = await import('@/lib/db/items.service');
        data = await getItemsByBookId(bookId);
        break;
      }
      case 'region': {
        const { getRegionsByBookId } = await import('@/lib/db/regions.service');
        data = await getRegionsByBookId(bookId);
        break;
      }
    }

    // Map to EntityOption interface
    return data.map((item: any) => ({
      id: item.id,
      name: item.name,
      image: item.image,
    }));
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
}: FormEntityMultiSelectAutoProps) {
  const { t } = useTranslation("common");
  const [searchQuery, setSearchQuery] = useState("");
  const [options, setOptions] = useState<EntityOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Use translated text if counterText not provided
  const displayCounterText = counterText || t("form.selected");

  // Load entities from database
  useEffect(() => {
    const fetchEntities = async () => {
      if (!bookId) return;

      setIsLoading(true);
      const entities = await loadEntities(entityType, bookId);

      // Apply filter if provided
      const filteredEntities = filter ? entities.filter(filter) : entities;

      setOptions(filteredEntities);
      setIsLoading(false);
    };

    fetchEntities();
  }, [entityType, bookId, filter]);

  const selectedOptions = options.filter((opt) => value.includes(opt.id));
  const availableOptions = options.filter((opt) => !value.includes(opt.id));

  // Filter available options by search query
  const filteredOptions = availableOptions.filter((opt) =>
    opt.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAdd = (optionId: string) => {
    if (!value.includes(optionId)) {
      onChange([...value, optionId]);
      setSearchQuery(""); // Clear search after selection
    }
  };

  const handleRemove = (optionId: string) => {
    onChange(value.filter((id) => id !== optionId));
  };

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Label className={labelClassName}>
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </Label>
        <div className="text-center py-6 text-muted-foreground border border-border rounded-lg">
          <p className="text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Header with label and counter */}
      <div className="flex items-center justify-between">
        <Label className={labelClassName}>
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </Label>
        {selectedOptions.length > 0 && (
          <span className="text-xs text-muted-foreground">
            {selectedOptions.length} {displayCounterText}
          </span>
        )}
      </div>

      {/* No options available */}
      {options.length === 0 ? (
        <div className="text-center py-6 text-muted-foreground border border-dashed border-border rounded-lg bg-muted/20">
          <p className="text-sm">{emptyText}</p>
        </div>
      ) : (
        <>
          {/* Dropdown selector */}
          {availableOptions.length > 0 && (
            <Select onValueChange={handleAdd} disabled={disabled}>
              <SelectTrigger>
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
                  {filteredOptions.length === 0 ? (
                    <div className="py-6 text-center text-sm text-muted-foreground">
                      {noResultsText}
                    </div>
                  ) : (
                    filteredOptions.map((option) => (
                      <SelectItem
                        key={option.id}
                        value={option.id}
                        className="py-3 cursor-pointer focus:!bg-primary/10 focus:!text-foreground hover:!bg-primary/10"
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="w-8 h-8 rounded-md">
                            <AvatarImage src={option.image} alt={option.name} />
                            <AvatarFallback className="text-xs rounded-md !text-foreground">
                              {getInitials(option.name)}
                            </AvatarFallback>
                          </Avatar>
                          <span>{option.name}</span>
                        </div>
                      </SelectItem>
                    ))
                  )}
                </div>
              </SelectContent>
            </Select>
          )}

          {/* Selected items display */}
          {selectedOptions.length > 0 && (
            <div className="max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
              <div className="flex flex-wrap gap-3">
                {selectedOptions.map((option) => (
                  <div
                    key={option.id}
                    className="relative group flex items-center gap-2 p-2 pr-3 rounded-lg border border-border bg-card hover:bg-muted/50 transition-colors"
                  >
                    <Avatar className="w-10 h-10 rounded-md">
                      <AvatarImage src={option.image} alt={option.name} />
                      <AvatarFallback className="text-xs rounded-md">
                        {getInitials(option.name)}
                      </AvatarFallback>
                    </Avatar>
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
          )}

          {/* Empty state when no selection */}
          {selectedOptions.length === 0 && options.length > 0 && (
            <div className="text-center py-6 text-muted-foreground border border-dashed border-border rounded-lg">
              <p className="text-sm">{noSelectionText}</p>
            </div>
          )}
        </>
      )}

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  );
}

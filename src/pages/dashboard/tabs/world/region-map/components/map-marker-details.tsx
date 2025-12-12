import { useState, useEffect } from "react";

import { useNavigate } from "@tanstack/react-router";
import { convertFileSrc } from "@tauri-apps/api/core";
import {
  X,
  ExternalLink,
  Trash2,
  Palette,
  Check,
  ChevronDown,
  ChevronRight,
  Map as MapIcon,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

import { IRegion } from "../../types/region-types";

interface MapMarkerDetailsProps {
  region: IRegion;
  mapRegionId: string;
  mapVersionId?: string | null;
  markerColor: string;
  showLabel: boolean;
  characters: Array<{ id: string; name: string; image?: string }>;
  factions: Array<{ id: string; name: string; image?: string }>;
  races: Array<{ id: string; name: string; image?: string }>;
  items: Array<{ id: string; name: string; image?: string }>;
  isEditMode?: boolean;
  onClose: () => void;
  onRemoveMarker?: () => void;
  onColorChange?: (color: string) => void;
  onLabelToggle?: (showLabel: boolean) => void;
}

const MARKER_COLORS = [
  { name: "Roxo", value: "#8b5cf6" },
  { name: "Azul", value: "#3b82f6" },
  { name: "Verde", value: "#10b981" },
  { name: "Vermelho", value: "#ef4444" },
  { name: "Amarelo", value: "#f59e0b" },
  { name: "Rosa", value: "#ec4899" },
  { name: "Laranja", value: "#f97316" },
  { name: "Ciano", value: "#06b6d4" },
  { name: "Índigo", value: "#6366f1" },
  { name: "Lima", value: "#84cc16" },
  { name: "Branco", value: "#ffffff" },
  { name: "Preto", value: "#000000" },
];

export function MapMarkerDetails({
  region,
  mapRegionId,
  mapVersionId,
  markerColor,
  showLabel,
  characters,
  factions,
  races,
  items,
  isEditMode = true,
  onClose,
  onRemoveMarker,
  onColorChange,
  onLabelToggle,
}: MapMarkerDetailsProps) {
  const navigate = useNavigate();
  const { t } = useTranslation("world");
  const [showColorPicker, setShowColorPicker] = useState(false);

  // Load initial state from localStorage or use defaults
  const getInitialSectionState = () => {
    const stored = localStorage.getItem("mapMarkerDetailsSections");
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return {
          residentFactions: false,
          dominantFactions: false,
          importantCharacters: false,
          racesFound: false,
          itemsFound: false,
        };
      }
    }
    return {
      residentFactions: false,
      dominantFactions: false,
      importantCharacters: false,
      racesFound: false,
      itemsFound: false,
    };
  };

  const [openSections, setOpenSections] = useState(getInitialSectionState);

  // Save to localStorage whenever sections state changes
  useEffect(() => {
    localStorage.setItem(
      "mapMarkerDetailsSections",
      JSON.stringify(openSections)
    );
  }, [openSections]);

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleViewDetails = () => {
    navigate({
      to: "/dashboard/$dashboardId/tabs/world/$regionId",
      params: { dashboardId: region.bookId, regionId: region.id },
      search: {
        fromMapId: mapRegionId,
        fromMapVersionId: mapVersionId || undefined,
      },
    });
  };

  // Helper functions to parse JSON and get names
  const parseJsonArray = (jsonString?: string): string[] => {
    if (!jsonString) return [];
    try {
      return JSON.parse(jsonString);
    } catch {
      return [];
    }
  };

  const getItems = (
    ids: string[],
    list: Array<{ id: string; name: string; image?: string }>
  ) =>
    ids
      .map((id) => list.find((item) => item.id === id))
      .filter(
        (item): item is { id: string; name: string; image?: string } => !!item
      );

  const residentFactionsItems = getItems(
    parseJsonArray(region.residentFactions),
    factions
  );
  const dominantFactionsItems = getItems(
    parseJsonArray(region.dominantFactions),
    factions
  );
  const importantCharactersItems = getItems(
    parseJsonArray(region.importantCharacters),
    characters
  );
  const racesFoundItems = getItems(parseJsonArray(region.racesFound), races);
  const itemsFoundItems = getItems(parseJsonArray(region.itemsFound), items);

  return (
    <div className="bg-background border rounded-lg shadow-lg w-80 flex flex-col h-[calc(100vh-96px)] overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b flex items-center justify-between gap-4 flex-shrink-0">
        <h3 className="font-semibold text-sm truncate flex-1">{region.name}</h3>
        <Button
          variant="ghost-destructive"
          size="icon"
          className="h-8 w-8 shrink-0"
          onClick={onClose}
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1 min-h-0 overflow-y-auto">
        <div className="p-4 space-y-4">
          {/* Color Selector - Only in Edit Mode */}
          {isEditMode && (
            <div>
              <button
                onClick={() => setShowColorPicker(!showColorPicker)}
                className="flex items-center justify-between w-full p-2 rounded-lg hover:bg-muted transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Palette className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <p className="text-sm font-semibold text-purple-600 dark:text-purple-400">
                    {t("region_map.marker_color")}
                  </p>
                </div>
                <ChevronDown
                  className={cn(
                    "w-4 h-4 text-muted-foreground transition-transform",
                    showColorPicker && "rotate-180"
                  )}
                />
              </button>

              {showColorPicker && (
                <TooltipProvider delayDuration={300}>
                  <div className="grid grid-cols-6 gap-2 mt-2">
                    {MARKER_COLORS.map((color) => (
                      <Tooltip key={color.value}>
                        <TooltipTrigger asChild>
                          <button
                            onClick={() => onColorChange?.(color.value)}
                            className={cn(
                              "w-full aspect-square rounded-lg border transition-all hover:opacity-60 flex items-center justify-center",
                              markerColor === color.value
                                ? "opacity-60 border-foreground"
                                : "border-border"
                            )}
                            style={{ backgroundColor: color.value }}
                          >
                            {markerColor === color.value && (
                              <Check
                                className="w-5 h-5 text-purple-600 dark:text-purple-400 drop-shadow-lg"
                                strokeWidth={3}
                              />
                            )}
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{color.name}</p>
                        </TooltipContent>
                      </Tooltip>
                    ))}
                  </div>
                </TooltipProvider>
              )}
            </div>
          )}

          {/* Label Toggle - Only in Edit Mode */}
          {isEditMode && (
            <div>
              <button
                onClick={() => onLabelToggle?.(!showLabel)}
                className="flex items-center justify-between w-full p-2 rounded-lg hover:bg-muted transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-purple-600 dark:text-purple-400">
                    {t("region_map.show_label")}
                  </span>
                </div>
                <div
                  className={cn(
                    "w-10 h-6 rounded-full transition-colors relative",
                    showLabel ? "bg-purple-600" : "bg-muted-foreground/20"
                  )}
                >
                  <div
                    className={cn(
                      "absolute top-1 w-4 h-4 bg-white rounded-full transition-transform",
                      showLabel ? "translate-x-5" : "translate-x-1"
                    )}
                  />
                </div>
              </button>
            </div>
          )}

          {/* Image */}
          {region.image ? (
            <div className="aspect-video rounded-lg overflow-hidden bg-muted">
              <img
                src={convertFileSrc(region.image)}
                alt={region.name}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="aspect-video rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
              <MapIcon className="w-12 h-12 text-muted-foreground/30" />
            </div>
          )}

          {/* Scale */}
          <div>
            <p className="text-base font-semibold text-purple-600 dark:text-purple-400 mb-1">
              {t("region_map.scale")}
            </p>
            <p className="text-sm">{t(`scales.${region.scale}`)}</p>
          </div>

          {/* Summary */}
          {region.summary && (
            <div>
              <p className="text-sm font-semibold text-purple-600 dark:text-purple-400 mb-1">
                {t("region_map.summary")}
              </p>
              <p className="text-sm text-muted-foreground line-clamp-3">
                {region.summary}
              </p>
            </div>
          )}

          {/* Climate */}
          {region.climate && (
            <div>
              <p className="text-sm font-semibold text-purple-600 dark:text-purple-400 mb-1">
                {t("region_map.climate")}
              </p>
              <p className="text-sm">{region.climate}</p>
            </div>
          )}

          {/* Current Season */}
          {region.currentSeason && (
            <div>
              <p className="text-sm font-semibold text-purple-600 dark:text-purple-400 mb-1">
                {t("region_map.current_season")}
              </p>
              <p className="text-sm capitalize">
                {region.customSeasonName || region.currentSeason}
              </p>
            </div>
          )}

          {/* General Description */}
          {region.generalDescription && (
            <div>
              <p className="text-sm font-semibold text-purple-600 dark:text-purple-400 mb-1">
                {t("region_map.general_description")}
              </p>
              <p className="text-sm text-muted-foreground line-clamp-4">
                {region.generalDescription}
              </p>
            </div>
          )}

          {/* Narrative Purpose */}
          {region.narrativePurpose && (
            <div>
              <p className="text-sm font-semibold text-purple-600 dark:text-purple-400 mb-1">
                {t("region_map.narrative_purpose")}
              </p>
              <p className="text-sm text-muted-foreground line-clamp-3">
                {region.narrativePurpose}
              </p>
            </div>
          )}

          {/* Unique Characteristics */}
          {region.uniqueCharacteristics && (
            <div>
              <p className="text-sm font-semibold text-purple-600 dark:text-purple-400 mb-1">
                {t("region_map.unique_characteristics")}
              </p>
              <p className="text-sm text-muted-foreground line-clamp-3">
                {region.uniqueCharacteristics}
              </p>
            </div>
          )}

          {/* Resident Factions */}
          <Collapsible
            open={openSections.residentFactions}
            onOpenChange={() => toggleSection("residentFactions")}
          >
            <CollapsibleTrigger className="flex items-center justify-between w-full p-2 rounded-lg hover:bg-muted transition-colors">
              <p className="text-sm font-semibold text-purple-600 dark:text-purple-400">
                {t("region_map.resident_factions")}
                {residentFactionsItems.length > 0 && (
                  <span className="ml-1 text-purple-600/60 dark:text-purple-400/60">
                    ({residentFactionsItems.length})
                  </span>
                )}
              </p>
              {openSections.residentFactions ? (
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              ) : (
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              )}
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2">
              {residentFactionsItems.length > 0 ? (
                <div className="flex flex-col gap-2">
                  {residentFactionsItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-2 p-2 bg-muted rounded-lg"
                    >
                      {item.image ? (
                        <img
                          src={convertFileSrc(item.image)}
                          alt={item.name}
                          className="w-8 h-8 rounded object-cover flex-shrink-0"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded bg-muted-foreground/20 flex items-center justify-center flex-shrink-0">
                          <span className="text-xs text-muted-foreground font-semibold">
                            {item.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <span className="text-xs font-medium truncate">
                        {item.name}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground italic">
                  {t("create_region.no_factions_selected")}
                </p>
              )}
            </CollapsibleContent>
          </Collapsible>

          {/* Dominant Factions */}
          <Collapsible
            open={openSections.dominantFactions}
            onOpenChange={() => toggleSection("dominantFactions")}
          >
            <CollapsibleTrigger className="flex items-center justify-between w-full p-2 rounded-lg hover:bg-muted transition-colors">
              <p className="text-sm font-semibold text-purple-600 dark:text-purple-400">
                {t("region_map.dominant_factions")}
                {dominantFactionsItems.length > 0 && (
                  <span className="ml-1 text-purple-600/60 dark:text-purple-400/60">
                    ({dominantFactionsItems.length})
                  </span>
                )}
              </p>
              {openSections.dominantFactions ? (
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              ) : (
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              )}
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2">
              {dominantFactionsItems.length > 0 ? (
                <div className="flex flex-col gap-2">
                  {dominantFactionsItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-2 p-2 bg-muted rounded-lg"
                    >
                      {item.image ? (
                        <img
                          src={convertFileSrc(item.image)}
                          alt={item.name}
                          className="w-8 h-8 rounded object-cover flex-shrink-0"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded bg-muted-foreground/20 flex items-center justify-center flex-shrink-0">
                          <span className="text-xs text-muted-foreground font-semibold">
                            {item.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <span className="text-xs font-medium truncate">
                        {item.name}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground italic">
                  {t("create_region.no_factions_selected")}
                </p>
              )}
            </CollapsibleContent>
          </Collapsible>

          {/* Important Characters */}
          <Collapsible
            open={openSections.importantCharacters}
            onOpenChange={() => toggleSection("importantCharacters")}
          >
            <CollapsibleTrigger className="flex items-center justify-between w-full p-2 rounded-lg hover:bg-muted transition-colors">
              <p className="text-sm font-semibold text-purple-600 dark:text-purple-400">
                {t("region_map.important_characters")}
                {importantCharactersItems.length > 0 && (
                  <span className="ml-1 text-purple-600/60 dark:text-purple-400/60">
                    ({importantCharactersItems.length})
                  </span>
                )}
              </p>
              {openSections.importantCharacters ? (
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              ) : (
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              )}
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2">
              {importantCharactersItems.length > 0 ? (
                <div className="flex flex-col gap-2">
                  {importantCharactersItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-2 p-2 bg-muted rounded-lg"
                    >
                      {item.image ? (
                        <img
                          src={convertFileSrc(item.image)}
                          alt={item.name}
                          className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-muted-foreground/20 flex items-center justify-center flex-shrink-0">
                          <span className="text-xs text-muted-foreground font-semibold">
                            {item.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <span className="text-xs font-medium truncate">
                        {item.name}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground italic">
                  {t("create_region.no_characters_selected")}
                </p>
              )}
            </CollapsibleContent>
          </Collapsible>

          {/* Races Found */}
          <Collapsible
            open={openSections.racesFound}
            onOpenChange={() => toggleSection("racesFound")}
          >
            <CollapsibleTrigger className="flex items-center justify-between w-full p-2 rounded-lg hover:bg-muted transition-colors">
              <p className="text-sm font-semibold text-purple-600 dark:text-purple-400">
                {t("region_map.races_found")}
                {racesFoundItems.length > 0 && (
                  <span className="ml-1 text-purple-600/60 dark:text-purple-400/60">
                    ({racesFoundItems.length})
                  </span>
                )}
              </p>
              {openSections.racesFound ? (
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              ) : (
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              )}
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2">
              {racesFoundItems.length > 0 ? (
                <div className="flex flex-col gap-2">
                  {racesFoundItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-2 p-2 bg-muted rounded-lg"
                    >
                      {item.image ? (
                        <img
                          src={convertFileSrc(item.image)}
                          alt={item.name}
                          className="w-8 h-8 rounded object-cover flex-shrink-0"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded bg-muted-foreground/20 flex items-center justify-center flex-shrink-0">
                          <span className="text-xs text-muted-foreground font-semibold">
                            {item.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <span className="text-xs font-medium truncate">
                        {item.name}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground italic">
                  {t("create_region.no_races_selected")}
                </p>
              )}
            </CollapsibleContent>
          </Collapsible>

          {/* Items Found */}
          <Collapsible
            open={openSections.itemsFound}
            onOpenChange={() => toggleSection("itemsFound")}
          >
            <CollapsibleTrigger className="flex items-center justify-between w-full p-2 rounded-lg hover:bg-muted transition-colors">
              <p className="text-sm font-semibold text-purple-600 dark:text-purple-400">
                {t("region_map.items_found")}
                {itemsFoundItems.length > 0 && (
                  <span className="ml-1 text-purple-600/60 dark:text-purple-400/60">
                    ({itemsFoundItems.length})
                  </span>
                )}
              </p>
              {openSections.itemsFound ? (
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              ) : (
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              )}
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2">
              {itemsFoundItems.length > 0 ? (
                <div className="flex flex-col gap-2">
                  {itemsFoundItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-2 p-2 bg-muted rounded-lg"
                    >
                      {item.image ? (
                        <img
                          src={convertFileSrc(item.image)}
                          alt={item.name}
                          className="w-8 h-8 rounded object-cover flex-shrink-0"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded bg-muted-foreground/20 flex items-center justify-center flex-shrink-0">
                          <span className="text-xs text-muted-foreground font-semibold">
                            {item.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <span className="text-xs font-medium truncate">
                        {item.name}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground italic">
                  {t("create_region.no_items_selected")}
                </p>
              )}
            </CollapsibleContent>
          </Collapsible>
        </div>
      </ScrollArea>

      {/* Actions */}
      <div className="p-4 border-t space-y-2 flex-shrink-0">
        <Button
          onClick={handleViewDetails}
          variant="magical"
          className="w-full animate-glow"
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          {t("region_map.view_details")}
        </Button>

        {onRemoveMarker && isEditMode && (
          <Button
            variant="ghost-destructive"
            onClick={onRemoveMarker}
            className="w-full"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            {t("region_map.remove_from_map")}
          </Button>
        )}
      </div>
    </div>
  );
}

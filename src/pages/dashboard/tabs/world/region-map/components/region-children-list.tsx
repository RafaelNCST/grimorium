import { MapPin, Check, X } from "lucide-react";
import { IRegion } from "../../types/region-types";
import { IRegionMapMarker } from "@/lib/db/region-maps.service";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

interface RegionChildrenListProps {
  children: IRegion[];
  markers: IRegionMapMarker[];
  selectedChildId: string | null;
  isEditMode: boolean;
  onChildSelect: (regionId: string) => void;
  onDeselectChild?: () => void;
  onRemoveMarker?: (marker: IRegionMapMarker) => void;
}

export function RegionChildrenList({
  children,
  markers,
  selectedChildId,
  isEditMode,
  onChildSelect,
  onDeselectChild,
  onRemoveMarker,
}: RegionChildrenListProps) {
  const { t } = useTranslation("world");

  const getMarkerForRegion = (regionId: string) => {
    return markers.find((m) => m.childRegionId === regionId);
  };

  const handleChildClick = (regionId: string) => {
    if (!isEditMode) return;

    // If clicking on the same selected item, deselect it
    if (selectedChildId === regionId) {
      onDeselectChild?.();
    } else {
      onChildSelect(regionId);
    }
  };

  if (children.length === 0) {
    return (
      <div className="bg-background border rounded-lg p-4 shadow-lg w-64">
        <div className="text-center py-8">
          <p className="text-sm text-muted-foreground">
            {t("region_map.no_children")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background border rounded-lg shadow-lg w-64 flex flex-col max-h-[calc(100vh-140px)]">
      <div className="p-4 border-b">
        <h3 className="font-semibold text-sm">{t("region_map.children_title")}</h3>
        <p className="text-xs text-muted-foreground mt-1">
          {isEditMode
            ? t("region_map.click_to_select")
            : t("region_map.toggle_edit_mode")}
        </p>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2 space-y-2">
          {children.map((region) => {
            const marker = getMarkerForRegion(region.id);
            const hasMarker = !!marker;
            const isSelected = selectedChildId === region.id;

            return (
              <div
                key={region.id}
                onClick={() => handleChildClick(region.id)}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-lg border transition-all",
                  isEditMode
                    ? "cursor-pointer hover:bg-muted"
                    : "cursor-default",
                  hasMarker && "bg-muted/50",
                  isSelected && "bg-primary/10 border-primary ring-2 ring-primary/20"
                )}
              >
                <div
                  className={cn(
                    "p-2 rounded-full flex-shrink-0",
                    hasMarker ? "bg-primary/20" : "bg-muted"
                  )}
                >
                  <MapPin
                    className={cn(
                      "w-4 h-4",
                      hasMarker ? "text-primary" : "text-muted-foreground"
                    )}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{region.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {t(`scales.${region.scale}`)}
                  </p>
                </div>

                <div className="flex-shrink-0">
                  {hasMarker ? (
                    isEditMode && onRemoveMarker ? (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemoveMarker(marker);
                        }}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    ) : (
                      <div className="p-1 bg-primary/20 rounded-full">
                        <Check className="w-3 h-3 text-primary" />
                      </div>
                    )
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}

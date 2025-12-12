import { useEffect, useState } from "react";

import { useParams, useNavigate, useSearch } from "@tanstack/react-router";
import { open } from "@tauri-apps/plugin-dialog";
import { ArrowLeft, Upload } from "lucide-react";
import { useTranslation } from "react-i18next";

import { WarningDialog } from "@/components/dialogs/WarningDialog";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getCharactersByBookId } from "@/lib/db/characters.service";
import { getFactionsByBookId } from "@/lib/db/factions.service";
import { getItemsByBookId } from "@/lib/db/items.service";
import { getRacesByBookId } from "@/lib/db/races.service";
import {
  getMapByRegionId,
  addMarker,
  updateMarkerPosition,
  updateMarkerColor,
  updateMarkerLabelVisibility,
  updateMarkerScale,
  removeMarker,
  uploadMapImage,
  IRegionMapMarker,
} from "@/lib/db/region-maps.service";
import { getRegionById } from "@/lib/db/regions.service";

import { IRegion } from "../types/region-types";

import { MapCanvas } from "./components/map-canvas";
import { MapImageUploader } from "./components/map-image-uploader";
import { MapMarkerDetails } from "./components/map-marker-details";
import { MultipleMarkersPanel } from "./components/multiple-markers-panel";
import { RegionChildrenList } from "./components/region-children-list";

export function RegionMapPage() {
  const params = useParams({ strict: false });
  const search = useSearch({ strict: false });
  const versionId = (search as { versionId?: string })?.versionId || null;
  const navigate = useNavigate();
  const { t } = useTranslation(["dialogs", "common"]);

  const [region, setRegion] = useState<IRegion | null>(null);
  const [childrenRegions, setChildrenRegions] = useState<IRegion[]>([]);
  const [mapImagePath, setMapImagePath] = useState<string | null>(null);
  const [mapId, setMapId] = useState<string | null>(null);
  const [markers, setMarkers] = useState<IRegionMapMarker[]>([]);
  const [selectedMarkerIds, setSelectedMarkerIds] = useState<string[]>([]);
  const [selectedChildForPlacement, setSelectedChildForPlacement] = useState<
    string | null
  >(null);
  const [isLoading, setIsLoading] = useState(true);
  const [characters, setCharacters] = useState<
    Array<{ id: string; name: string; image?: string }>
  >([]);
  const [factions, setFactions] = useState<
    Array<{ id: string; name: string; image?: string }>
  >([]);
  const [races, setRaces] = useState<
    Array<{ id: string; name: string; image?: string }>
  >([]);
  const [items, setItems] = useState<
    Array<{ id: string; name: string; image?: string }>
  >([]);
  const [showChangeImageWarning, setShowChangeImageWarning] = useState(false);
  const [showChangeImageTooltip, setShowChangeImageTooltip] = useState(false);

  const regionId = params.regionId as string;

  useEffect(() => {
    loadData();
  }, [regionId, versionId]);

  // Close tooltip when map image changes
  useEffect(() => {
    setShowChangeImageTooltip(false);
  }, [mapImagePath]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = async (event: KeyboardEvent) => {
      // ESC key pressed - deselect child for placement or markers
      if (event.key === "Escape") {
        if (selectedChildForPlacement) {
          event.preventDefault();
          setSelectedChildForPlacement(null);
        } else if (selectedMarkerIds.length > 0) {
          event.preventDefault();
          setSelectedMarkerIds([]);
        }
        return;
      }

      // Delete key pressed with markers selected
      if (
        (event.key === "Delete" || event.key === "Del") &&
        selectedMarkerIds.length > 0
      ) {
        event.preventDefault();

        try {
          // Remove all selected markers
          await Promise.all(selectedMarkerIds.map((id) => removeMarker(id)));
          setMarkers((prev) =>
            prev.filter((m) => !selectedMarkerIds.includes(m.id))
          );
          setSelectedMarkerIds([]);
        } catch (error) {
          console.error("Failed to remove markers:", error);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedMarkerIds, selectedChildForPlacement, markers]);

  const loadData = async () => {
    try {
      setIsLoading(true);

      // Reset states before loading
      setRegion(null);
      setChildrenRegions([]);
      setMapImagePath(null);
      setMapId(null);
      setMarkers([]);
      setSelectedMarkerIds([]);

      // Load region
      const regionData = await getRegionById(regionId);
      if (!regionData) {
        navigate({
          to: "/dashboard/$dashboardId/tabs/world",
          params: { dashboardId: params.dashboardId as string },
        });
        return;
      }
      setRegion(regionData);

      // Load children regions (using a simple query for now)
      // In a real scenario, you'd have a service method to get children
      const { getRegionsByBookId } = await import("@/lib/db/regions.service");
      const allRegions = await getRegionsByBookId(regionData.bookId);
      const children = allRegions.filter((r) => r.parentId === regionId);
      setChildrenRegions(children);

      // Load map for the specific version
      const map = await getMapByRegionId(regionId, versionId);
      if (map) {
        setMapImagePath(map.imagePath);
        setMapId(map.id);

        // Load markers for this specific map
        const { getMarkersByMapId } = await import(
          "@/lib/db/region-maps.service"
        );
        const markersData = await getMarkersByMapId(map.id);

        // Clean orphaned markers (markers whose child regions no longer exist)
        const validMarkers: IRegionMapMarker[] = [];
        const orphanedMarkerIds: string[] = [];

        for (const marker of markersData) {
          const childRegion = await getRegionById(marker.childRegionId);
          if (childRegion) {
            validMarkers.push(marker);
          } else {
            orphanedMarkerIds.push(marker.id);
          }
        }

        // Remove orphaned markers from database
        if (orphanedMarkerIds.length > 0) {
          for (const markerId of orphanedMarkerIds) {
            try {
              await removeMarker(markerId);
            } catch (error) {
              console.error(
                `Failed to remove orphaned marker ${markerId}:`,
                error
              );
            }
          }
        }

        setMarkers(validMarkers);
      } else {
        setMapImagePath(null);
        setMapId(null);
        setMarkers([]);
      }

      // Load related entities
      const [charactersData, factionsData, racesData, itemsData] =
        await Promise.all([
          getCharactersByBookId(regionData.bookId),
          getFactionsByBookId(regionData.bookId),
          getRacesByBookId(regionData.bookId),
          getItemsByBookId(regionData.bookId),
        ]);

      setCharacters(
        charactersData.map((c) => ({ id: c.id, name: c.name, image: c.image }))
      );
      setFactions(
        factionsData.map((f) => ({ id: f.id, name: f.name, image: f.image }))
      );
      setRaces(
        racesData.map((r) => ({ id: r.id, name: r.name, image: r.image }))
      );
      setItems(
        itemsData.map((i) => ({ id: i.id, name: i.name, image: i.image }))
      );
    } catch (error) {
      console.error("Failed to load region map data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigate({
      to: "/dashboard/$dashboardId/tabs/world/$regionId",
      params: { dashboardId: params.dashboardId as string, regionId },
      search: versionId ? { versionId } : undefined,
    });
  };

  const handleUploadComplete = (imagePath: string, mapId: string) => {
    setMapImagePath(imagePath);
    setMapId(mapId);
    setMarkers([]); // Clear markers when new map is uploaded
    // Clear saved zoom scale so the new map starts centered with default zoom
    localStorage.removeItem(`map-scale-${imagePath}`);
  };

  const handleChangeImage = async () => {
    // Close tooltip immediately when clicking
    setShowChangeImageTooltip(false);

    // Check if there are markers placed on the map
    if (markers.length > 0) {
      setShowChangeImageWarning(true);
    } else {
      await proceedWithImageChange();
    }
  };

  const proceedWithImageChange = async () => {
    try {
      setShowChangeImageWarning(false);

      const selected = await open({
        multiple: false,
        filters: [
          {
            name: "Images",
            extensions: ["png", "jpg", "jpeg", "svg"],
          },
        ],
      });

      if (!selected || typeof selected !== "string") {
        // Close tooltip if user cancels
        setShowChangeImageTooltip(false);
        return;
      }

      const regionMap = await uploadMapImage(regionId, selected, versionId);
      setMapImagePath(regionMap.imagePath);
      setMapId(regionMap.id);
      setMarkers([]); // Clear markers when changing image
      // Clear saved zoom scale so the new map starts centered with default zoom
      localStorage.removeItem(`map-scale-${regionMap.imagePath}`);
      // Close tooltip after image change
      setShowChangeImageTooltip(false);
    } catch (error) {
      console.error("Failed to update map image:", error);
      // Close tooltip on error
      setShowChangeImageTooltip(false);
    }
  };

  const handleChildSelect = (childRegionId: string) => {
    setSelectedChildForPlacement(childRegionId);
    setSelectedMarkerIds([]); // Clear marker selection
  };

  const handleDeselectChild = () => {
    setSelectedChildForPlacement(null);
  };

  const handleMapClick = async (x: number, y: number) => {
    if (!selectedChildForPlacement || !mapId) {
      // Deselect when clicking away
      setSelectedChildForPlacement(null);
      return;
    }

    try {
      // Check if marker already exists
      const existingMarker = markers.find(
        (m) => m.childRegionId === selectedChildForPlacement
      );

      if (existingMarker) {
        // Update existing marker position
        await updateMarkerPosition(existingMarker.id, x, y);
        setMarkers((prev) =>
          prev.map((m) =>
            m.id === existingMarker.id
              ? { ...m, positionX: Math.round(x), positionY: Math.round(y) }
              : m
          )
        );
      } else {
        // Create new marker
        const newMarker = await addMarker(
          mapId,
          regionId,
          selectedChildForPlacement,
          x,
          y
        );
        setMarkers((prev) => [...prev, newMarker]);
      }

      // Clear selection after placing
      setSelectedChildForPlacement(null);
    } catch (error) {
      console.error("Failed to add/update marker:", error);
    }
  };

  const handleMarkerClick = (marker: IRegionMapMarker, ctrlKey: boolean) => {
    if (ctrlKey) {
      // Ctrl+click (or Cmd+click on Mac): add to selection
      if (selectedMarkerIds.includes(marker.id)) {
        // Deselect if already selected
        setSelectedMarkerIds((prev) => prev.filter((id) => id !== marker.id));
      } else {
        // Add to selection
        setSelectedMarkerIds((prev) => [...prev, marker.id]);
      }
    } else {
      // Normal click: select only this marker
      setSelectedMarkerIds([marker.id]);
    }
  };

  const handleMarkerDragEnd = async (
    markerId: string,
    x: number,
    y: number
  ) => {
    try {
      await updateMarkerPosition(markerId, x, y);
      setMarkers((prev) =>
        prev.map((m) =>
          m.id === markerId
            ? { ...m, positionX: Math.round(x), positionY: Math.round(y) }
            : m
        )
      );
    } catch (error) {
      console.error("Failed to update marker position:", error);
    }
  };

  const handleRemoveMarker = async (marker: IRegionMapMarker) => {
    try {
      await removeMarker(marker.id);
      setMarkers((prev) => prev.filter((m) => m.id !== marker.id));

      if (selectedMarkerIds.includes(marker.id)) {
        setSelectedMarkerIds((prev) => prev.filter((id) => id !== marker.id));
      }
    } catch (error) {
      console.error("Failed to remove marker:", error);
    }
  };

  const handleRemoveSelectedMarkers = async () => {
    if (selectedMarkerIds.length === 0) return;

    try {
      await Promise.all(selectedMarkerIds.map((id) => removeMarker(id)));
      setMarkers((prev) =>
        prev.filter((m) => !selectedMarkerIds.includes(m.id))
      );
      setSelectedMarkerIds([]);
    } catch (error) {
      console.error("Failed to remove markers:", error);
    }
  };

  const handleColorChange = async (color: string) => {
    if (selectedMarkerIds.length === 0) return;

    try {
      await Promise.all(
        selectedMarkerIds.map((id) => updateMarkerColor(id, color))
      );
      setMarkers((prev) =>
        prev.map((m) =>
          selectedMarkerIds.includes(m.id) ? { ...m, color } : m
        )
      );
    } catch (error) {
      console.error("Failed to update marker color:", error);
    }
  };

  const handleLabelToggle = async (showLabel: boolean) => {
    if (selectedMarkerIds.length === 0) return;

    try {
      await Promise.all(
        selectedMarkerIds.map((id) =>
          updateMarkerLabelVisibility(id, showLabel)
        )
      );
      setMarkers((prev) =>
        prev.map((m) =>
          selectedMarkerIds.includes(m.id) ? { ...m, showLabel } : m
        )
      );
    } catch (error) {
      console.error("Failed to update marker label visibility:", error);
    }
  };

  const handleMarkerScaleChange = async (markerId: string, scale: number) => {
    try {
      await updateMarkerScale(markerId, scale);
      setMarkers((prev) =>
        prev.map((m) => (m.id === markerId ? { ...m, scale } : m))
      );
    } catch (error) {
      console.error("Failed to update marker scale:", error);
    }
  };

  const selectedMarkers = markers.filter((m) =>
    selectedMarkerIds.includes(m.id)
  );
  const selectedMarker =
    selectedMarkers.length === 1 ? selectedMarkers[0] : null;
  const selectedRegion = selectedMarker
    ? childrenRegions.find((r) => r.id === selectedMarker.childRegionId)
    : null;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-muted-foreground">Carregando mapa...</p>
        </div>
      </div>
    );
  }

  if (!region) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-background overflow-hidden">
      {/* Region Name with Back Button - Fixed */}
      <div className="fixed top-12 left-4 z-40 h-[52px] px-3 bg-background border rounded-lg shadow-lg flex items-center gap-2">
        <Button
          onClick={handleBack}
          variant="ghost"
          size="icon"
          className="h-8 w-8"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-lg font-semibold">{region.name}</h1>
        {mapImagePath && (
          <TooltipProvider delayDuration={300}>
            <Tooltip
              open={showChangeImageTooltip}
              onOpenChange={setShowChangeImageTooltip}
            >
              <TooltipTrigger asChild>
                <Button
                  onClick={handleChangeImage}
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                >
                  <Upload className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t("common:tooltips.change_image")}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>

      {/* Left Sidebar - Children List - Fixed */}
      <div className="fixed top-28 left-4 z-30 flex flex-col gap-4">
        {mapImagePath && (
          <RegionChildrenList
            children={childrenRegions}
            markers={markers}
            selectedChildId={selectedChildForPlacement}
            isEditMode
            onChildSelect={handleChildSelect}
            onDeselectChild={handleDeselectChild}
            onRemoveMarker={handleRemoveMarker}
          />
        )}
      </div>

      {/* Right Sidebar - Marker Details - Fixed */}
      {selectedMarkerIds.length > 0 && (
        <div className="fixed top-12 right-4 z-30">
          {selectedMarkerIds.length === 1 &&
          selectedRegion &&
          selectedMarker ? (
            <MapMarkerDetails
              region={selectedRegion}
              mapRegionId={regionId}
              mapVersionId={versionId}
              markerColor={selectedMarker.color}
              showLabel={selectedMarker.showLabel}
              characters={characters}
              factions={factions}
              races={races}
              items={items}
              isEditMode
              onClose={() => setSelectedMarkerIds([])}
              onRemoveMarker={handleRemoveSelectedMarkers}
              onColorChange={handleColorChange}
              onLabelToggle={handleLabelToggle}
            />
          ) : (
            <MultipleMarkersPanel
              count={selectedMarkerIds.length}
              markers={selectedMarkers}
              onClose={() => setSelectedMarkerIds([])}
              onRemoveMarkers={handleRemoveSelectedMarkers}
              onColorChange={handleColorChange}
              onLabelToggle={handleLabelToggle}
            />
          )}
        </div>
      )}

      {/* Main Canvas */}
      <div className="fixed inset-x-0 bottom-0 top-8 w-full">
        {mapImagePath ? (
          <MapCanvas
            key={`${regionId}-${mapId}`}
            imagePath={mapImagePath}
            children={childrenRegions}
            markers={markers}
            selectedMarkerIds={selectedMarkerIds}
            selectedChildForPlacement={selectedChildForPlacement}
            onMarkerClick={handleMarkerClick}
            onMapClick={handleMapClick}
            onMarkerDragEnd={handleMarkerDragEnd}
            onMarkerScaleChange={handleMarkerScaleChange}
          />
        ) : (
          <MapImageUploader
            regionId={regionId}
            versionId={versionId}
            onUploadComplete={handleUploadComplete}
          />
        )}
      </div>

      {/* Change Image Warning Dialog */}
      <WarningDialog
        open={showChangeImageWarning}
        onOpenChange={setShowChangeImageWarning}
        title={t("dialogs:change_map_image.title")}
        description={
          markers.length === 1
            ? t("dialogs:change_map_image.description_singular", {
                count: markers.length,
              })
            : t("dialogs:change_map_image.description_plural", {
                count: markers.length,
              })
        }
        cancelText={t("dialogs:change_map_image.cancel")}
        confirmText={t("dialogs:change_map_image.confirm")}
        onConfirm={proceedWithImageChange}
      />
    </div>
  );
}

import { useEffect, useState } from "react";
import { useParams, useNavigate, useSearch } from "@tanstack/react-router";
import { ArrowLeft, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getRegionById } from "@/lib/db/regions.service";
import {
  getMapByRegionId,
  getMarkersByRegion,
  addMarker,
  updateMarkerPosition,
  updateMarkerColor,
  updateMarkerLabelVisibility,
  updateMarkerScale,
  removeMarker,
  uploadMapImage,
  IRegionMapMarker,
} from "@/lib/db/region-maps.service";
import { getCharactersByBookId } from "@/lib/db/characters.service";
import { getFactionsByBookId } from "@/lib/db/factions.service";
import { getRacesByBookId } from "@/lib/db/races.service";
import { getItemsByBookId } from "@/lib/db/items.service";
import { IRegion } from "../types/region-types";
import { MapImageUploader } from "./components/map-image-uploader";
import { MapCanvas } from "./components/map-canvas";
import { RegionChildrenList } from "./components/region-children-list";
import { MapMarkerDetails } from "./components/map-marker-details";
import { open } from "@tauri-apps/plugin-dialog";

export function RegionMapPage() {
  const params = useParams({ strict: false });
  const search = useSearch({ strict: false });
  const versionId = (search as { versionId?: string })?.versionId || null;
  const navigate = useNavigate();
  const { toast } = useToast();

  const [region, setRegion] = useState<IRegion | null>(null);
  const [childrenRegions, setChildrenRegions] = useState<IRegion[]>([]);
  const [mapImagePath, setMapImagePath] = useState<string | null>(null);
  const [mapId, setMapId] = useState<string | null>(null);
  const [markers, setMarkers] = useState<IRegionMapMarker[]>([]);
  const [selectedMarkerId, setSelectedMarkerId] = useState<string | null>(null);
  const [selectedChildForPlacement, setSelectedChildForPlacement] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [characters, setCharacters] = useState<Array<{ id: string; name: string; image?: string }>>([]);
  const [factions, setFactions] = useState<Array<{ id: string; name: string; image?: string }>>([]);
  const [races, setRaces] = useState<Array<{ id: string; name: string; image?: string }>>([]);
  const [items, setItems] = useState<Array<{ id: string; name: string; image?: string }>>([]);

  const regionId = params.regionId as string;

  useEffect(() => {
    loadData();
  }, [regionId]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = async (event: KeyboardEvent) => {
      // ESC key pressed - deselect child for placement or marker
      if (event.key === "Escape") {
        if (selectedChildForPlacement) {
          event.preventDefault();
          setSelectedChildForPlacement(null);
        } else if (selectedMarkerId) {
          event.preventDefault();
          setSelectedMarkerId(null);
        }
        return;
      }

      // Delete key pressed with a marker selected
      if ((event.key === "Delete" || event.key === "Del") && selectedMarkerId) {
        event.preventDefault();

        const marker = markers.find((m) => m.id === selectedMarkerId);
        if (marker) {
          try {
            await removeMarker(marker.id);
            setMarkers((prev) => prev.filter((m) => m.id !== marker.id));
            setSelectedMarkerId(null);
            toast({
              title: "Marcador removido",
              description: "O marcador foi removido do mapa com sucesso.",
            });
          } catch (error) {
            console.error("Failed to remove marker:", error);
            toast({
              title: "Erro ao remover marcador",
              description:
                error instanceof Error ? error.message : "Ocorreu um erro desconhecido.",
              variant: "destructive",
            });
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedMarkerId, selectedChildForPlacement, markers, toast]);

  const loadData = async () => {
    try {
      setIsLoading(true);

      // Load region
      const regionData = await getRegionById(regionId);
      if (!regionData) {
        toast({
          title: "Erro",
          description: "Região não encontrada.",
          variant: "destructive",
        });
        navigate({ to: "/dashboard/$dashboardId/tabs/world", params: { dashboardId: params.dashboardId as string } });
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
        const { getMarkersByMapId } = await import("@/lib/db/region-maps.service");
        const markersData = await getMarkersByMapId(map.id);
        setMarkers(markersData);
      } else {
        setMapImagePath(null);
        setMapId(null);
        setMarkers([]);
      }

      // Load related entities
      const [charactersData, factionsData, racesData, itemsData] = await Promise.all([
        getCharactersByBookId(regionData.bookId),
        getFactionsByBookId(regionData.bookId),
        getRacesByBookId(regionData.bookId),
        getItemsByBookId(regionData.bookId),
      ]);

      setCharacters(charactersData.map(c => ({ id: c.id, name: c.name, image: c.image })));
      setFactions(factionsData.map(f => ({ id: f.id, name: f.name, image: f.image })));
      setRaces(racesData.map(r => ({ id: r.id, name: r.name, image: r.image })));
      setItems(itemsData.map(i => ({ id: i.id, name: i.name, image: i.image })));
    } catch (error) {
      console.error("Failed to load region map data:", error);
      toast({
        title: "Erro ao carregar mapa",
        description:
          error instanceof Error ? error.message : "Ocorreu um erro desconhecido.",
        variant: "destructive",
      });
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
  };

  const handleChangeImage = async () => {
    try {
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
        return;
      }

      const regionMap = await uploadMapImage(regionId, selected, versionId);
      setMapImagePath(regionMap.imagePath);
      setMapId(regionMap.id);
      setMarkers([]); // Clear markers when changing image

      toast({
        title: "Imagem atualizada",
        description: "O mapa da região foi atualizado com sucesso.",
      });
    } catch (error) {
      console.error("Failed to update map image:", error);
      toast({
        title: "Erro ao atualizar imagem",
        description:
          error instanceof Error ? error.message : "Ocorreu um erro desconhecido.",
        variant: "destructive",
      });
    }
  };

  const handleChildSelect = (childRegionId: string) => {
    setSelectedChildForPlacement(childRegionId);
    setSelectedMarkerId(null); // Clear marker selection
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
      const existingMarker = markers.find((m) => m.childRegionId === selectedChildForPlacement);

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
        const newMarker = await addMarker(mapId, regionId, selectedChildForPlacement, x, y);
        setMarkers((prev) => [...prev, newMarker]);
      }

      // Clear selection after placing
      setSelectedChildForPlacement(null);
    } catch (error) {
      console.error("Failed to add/update marker:", error);
      toast({
        title: "Erro ao posicionar marcador",
        description:
          error instanceof Error ? error.message : "Ocorreu um erro desconhecido.",
        variant: "destructive",
      });
    }
  };

  const handleMarkerClick = (marker: IRegionMapMarker) => {
    setSelectedMarkerId(marker.id);
  };

  const handleMarkerDragEnd = async (markerId: string, x: number, y: number) => {
    try {
      await updateMarkerPosition(markerId, x, y);
      setMarkers((prev) =>
        prev.map((m) =>
          m.id === markerId ? { ...m, positionX: Math.round(x), positionY: Math.round(y) } : m
        )
      );
    } catch (error) {
      console.error("Failed to update marker position:", error);
      toast({
        title: "Erro ao mover marcador",
        description:
          error instanceof Error ? error.message : "Ocorreu um erro desconhecido.",
        variant: "destructive",
      });
    }
  };

  const handleRemoveMarker = async (marker: IRegionMapMarker) => {
    try {
      await removeMarker(marker.id);
      setMarkers((prev) => prev.filter((m) => m.id !== marker.id));

      if (selectedMarkerId === marker.id) {
        setSelectedMarkerId(null);
      }
    } catch (error) {
      console.error("Failed to remove marker:", error);
      toast({
        title: "Erro ao remover marcador",
        description:
          error instanceof Error ? error.message : "Ocorreu um erro desconhecido.",
        variant: "destructive",
      });
    }
  };

  const handleRemoveSelectedMarker = async () => {
    if (!selectedMarkerId) return;

    const marker = markers.find((m) => m.id === selectedMarkerId);
    if (marker) {
      await handleRemoveMarker(marker);
    }
  };

  const handleColorChange = async (color: string) => {
    if (!selectedMarkerId) return;

    try {
      await updateMarkerColor(selectedMarkerId, color);
      setMarkers((prev) =>
        prev.map((m) => (m.id === selectedMarkerId ? { ...m, color } : m))
      );
    } catch (error) {
      console.error("Failed to update marker color:", error);
      toast({
        title: "Erro ao alterar cor",
        description:
          error instanceof Error ? error.message : "Ocorreu um erro desconhecido.",
        variant: "destructive",
      });
    }
  };

  const handleLabelToggle = async (showLabel: boolean) => {
    if (!selectedMarkerId) return;

    try {
      await updateMarkerLabelVisibility(selectedMarkerId, showLabel);
      setMarkers((prev) =>
        prev.map((m) => (m.id === selectedMarkerId ? { ...m, showLabel } : m))
      );
    } catch (error) {
      console.error("Failed to update marker label visibility:", error);
      toast({
        title: "Erro ao alterar visibilidade do nome",
        description:
          error instanceof Error ? error.message : "Ocorreu um erro desconhecido.",
        variant: "destructive",
      });
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
      toast({
        title: "Erro ao redimensionar marcador",
        description:
          error instanceof Error ? error.message : "Ocorreu um erro desconhecido.",
        variant: "destructive",
      });
    }
  };

  const selectedMarker = markers.find((m) => m.id === selectedMarkerId);
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
      {/* Back Button - Fixed */}
      <button
        onClick={handleBack}
        className="fixed top-12 left-4 z-40 h-[52px] px-6 bg-background border rounded-lg shadow-lg hover:bg-muted transition-colors flex items-center justify-center"
      >
        <ArrowLeft className="w-6 h-6" />
      </button>

      {/* Region Name - Fixed */}
      <div className="fixed top-12 left-24 z-40 h-[52px] px-6 bg-background border rounded-lg shadow-lg flex items-center gap-2">
        <h1 className="text-lg font-semibold">{region.name}</h1>
        {mapImagePath && (
          <TooltipProvider delayDuration={300}>
            <Tooltip>
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
                <p>Alterar Imagem</p>
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
            isEditMode={true}
            onChildSelect={handleChildSelect}
            onDeselectChild={handleDeselectChild}
            onRemoveMarker={handleRemoveMarker}
          />
        )}
      </div>

      {/* Right Sidebar - Marker Details - Fixed */}
      {selectedRegion && selectedMarker && (
        <div className="fixed top-12 right-4 z-30">
          <MapMarkerDetails
            region={selectedRegion}
            markerColor={selectedMarker.color}
            showLabel={selectedMarker.showLabel}
            characters={characters}
            factions={factions}
            races={races}
            items={items}
            isEditMode={true}
            onClose={() => setSelectedMarkerId(null)}
            onRemoveMarker={handleRemoveSelectedMarker}
            onColorChange={handleColorChange}
            onLabelToggle={handleLabelToggle}
          />
        </div>
      )}

      {/* Main Canvas */}
      <div className="fixed inset-x-0 bottom-0 top-8 w-full">
        {mapImagePath ? (
          <MapCanvas
            imagePath={mapImagePath}
            children={childrenRegions}
            markers={markers}
            selectedMarkerId={selectedMarkerId}
            selectedChildForPlacement={selectedChildForPlacement}
            onMarkerClick={handleMarkerClick}
            onMapClick={handleMapClick}
            onMarkerDragEnd={handleMarkerDragEnd}
            onMarkerScaleChange={handleMarkerScaleChange}
          />
        ) : (
          <MapImageUploader regionId={regionId} versionId={versionId} onUploadComplete={handleUploadComplete} />
        )}
      </div>
    </div>
  );
}

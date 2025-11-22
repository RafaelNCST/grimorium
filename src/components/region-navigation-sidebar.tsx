import { useState } from "react";

import { X, Search, Map } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

interface IRegion {
  id: string;
  name: string;
  image?: string;
}

interface PropsRegionNavigationSidebar {
  isOpen: boolean;
  onClose: () => void;
  regions: IRegion[];
  currentRegionId?: string;
  onRegionSelect: (regionId: string) => void;
}

export function RegionNavigationSidebar({
  isOpen,
  onClose,
  regions,
  currentRegionId,
  onRegionSelect,
}: PropsRegionNavigationSidebar) {
  const [searchTerm, setSearchTerm] = useState("");

  // Separate current region from others
  const currentRegion = regions.find((region) => region.id === currentRegionId);
  const otherRegions = regions.filter(
    (region) => region.id !== currentRegionId
  );

  const filteredOtherRegions = otherRegions.filter((region) =>
    region.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      className={`fixed left-0 top-[104px] bottom-0 w-80 bg-background border-r border-border shadow-lg transition-all duration-300 ease-in-out z-40 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-card">
        <div className="flex items-center gap-2">
          <Map className="w-5 h-5 text-muted-foreground" />
          <h2 className="font-semibold">Regiões</h2>
          <span className="text-xs text-muted-foreground">
            ({regions.length})
          </span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Search */}
      <div className="p-4 border-b border-border bg-card">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar região..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Current Region */}
      {currentRegion && (
        <div className="p-2 border-b border-border bg-card">
          <div className="w-full flex items-center gap-3 p-3 rounded-lg bg-primary/10 border border-primary/30 cursor-default">
            <div className="w-10 h-10 flex-shrink-0 rounded overflow-hidden flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/10">
              {currentRegion.image ? (
                <img
                  src={currentRegion.image}
                  alt={currentRegion.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Map className="w-5 h-5 text-muted-foreground/50" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">
                {currentRegion.name}
              </p>
              <p className="text-xs text-primary font-medium">
                Visualizando atualmente
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Region List */}
      <ScrollArea className="flex-1 h-[calc(100vh-104px-220px)]">
        <div className="p-2">
          {filteredOtherRegions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Map className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>Nenhuma região encontrada</p>
            </div>
          ) : (
            <div className="space-y-1">
              {filteredOtherRegions.map((region) => (
                <button
                  key={region.id}
                  onClick={() => {
                    onRegionSelect(region.id);
                    onClose();
                  }}
                  className="w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors hover:bg-muted/50"
                >
                  <div className="w-10 h-10 flex-shrink-0 rounded overflow-hidden flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/10">
                    {region.image ? (
                      <img
                        src={region.image}
                        alt={region.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Map className="w-5 h-5 text-muted-foreground/50" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">
                      {region.name}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

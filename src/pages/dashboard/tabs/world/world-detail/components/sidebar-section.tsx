import { Plus, Globe, Mountain, MapPin } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { IWorldDetailEntity, IStickyNote } from "../types/world-detail-types";

interface PropsSidebarSection {
  entity: IWorldDetailEntity;
  stickyNotes: IStickyNote[];
  onAddStickyNote: () => void;
  getWorldName: (worldId?: string) => string | null;
  getContinentName: (continentId?: string) => string | null;
}

export function SidebarSection({
  entity,
  stickyNotes,
  onAddStickyNote,
  getWorldName,
  getContinentName,
}: PropsSidebarSection) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Ações Rápidas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={onAddStickyNote}
          >
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Nota Rápida
          </Button>
        </CardContent>
      </Card>

      {stickyNotes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Notas Rápidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stickyNotes.map((note) => (
                <div
                  key={note.id}
                  className={`p-3 rounded-lg ${note.color} text-sm`}
                >
                  {note.content}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {entity.type === "Location" && (
        <Card>
          <CardHeader>
            <CardTitle>Hierarquia</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {getWorldName(entity.worldId) && (
              <div className="flex items-center gap-2 text-sm">
                <Globe className="w-4 h-4" />
                <span>{getWorldName(entity.worldId)}</span>
              </div>
            )}
            {getContinentName(entity.continentId) && (
              <div className="flex items-center gap-2 text-sm ml-4">
                <Mountain className="w-4 h-4" />
                <span>{getContinentName(entity.continentId)}</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-sm ml-8">
              <MapPin className="w-4 h-4" />
              <span className="font-medium">{entity.name}</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

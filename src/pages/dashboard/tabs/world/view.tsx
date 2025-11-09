import { Plus, Search, MapPin, Mountain, Globe } from "lucide-react";

import { EmptyState } from "@/components/empty-state";
import { CreateContinentModal } from "@/components/modals/create-continent-modal";
import { CreateLocationModal } from "@/components/modals/create-location-modal";
import { CreateWorldModal } from "@/components/modals/create-world-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { EntityCard } from "./components/entity-card";
import { SectionHeader } from "./components/section-header";
import { StatsInfo } from "./components/stats-info";
import {
  IWorldEntity,
  IWorldEntityStats,
  IWorld,
  IContinent,
} from "./types/world-types";

interface PropsWorldView {
  bookId: string;
  searchTerm: string;
  worldEntities: IWorldEntity[];
  showCreateWorldModal: boolean;
  showCreateContinentModal: boolean;
  showCreateLocationModal: boolean;
  filteredWorlds: IWorldEntity[];
  filteredContinents: IWorldEntity[];
  filteredLocations: IWorldEntity[];
  entityStats: IWorldEntityStats;
  availableWorlds: IWorld[];
  availableContinents: IContinent[];
  onSetSearchTerm: (term: string) => void;
  onSetShowCreateWorldModal: (show: boolean) => void;
  onSetShowCreateContinentModal: (show: boolean) => void;
  onSetShowCreateLocationModal: (show: boolean) => void;
  onCreateWorld: () => void;
  onCreateContinent: () => void;
  onCreateLocation: () => void;
  onWorldCreated: (world: IWorldEntity) => void;
  onContinentCreated: (continent: IWorldEntity) => void;
  onLocationCreated: (location: IWorldEntity) => void;
  onEntityClick: (entity: IWorldEntity) => void;
  onGetTypeColor: (type: string) => string;
  onGetParentName: (parentId?: string) => string;
}

export function WorldView({
  bookId,
  searchTerm,
  worldEntities,
  showCreateWorldModal,
  showCreateContinentModal,
  showCreateLocationModal,
  filteredWorlds,
  filteredContinents,
  filteredLocations,
  entityStats,
  availableWorlds,
  availableContinents,
  onSetSearchTerm,
  onSetShowCreateWorldModal,
  onSetShowCreateContinentModal,
  onSetShowCreateLocationModal,
  onCreateWorld,
  onCreateContinent,
  onCreateLocation,
  onWorldCreated,
  onContinentCreated,
  onLocationCreated,
  onEntityClick,
  onGetTypeColor,
  onGetParentName,
}: PropsWorldView) {
  if (worldEntities.length === 0) {
    return (
      <div className="flex-1 h-full flex flex-col space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold">Mundo</h2>
            <p className="text-muted-foreground">
              Gerencie mundos, continentes e locais
            </p>
          </div>
          <Button
            variant="magical"
            size="lg"
            onClick={onCreateWorld}
            className="animate-glow"
          >
            <Plus className="w-5 h-5 mr-2" />
            Novo Mundo
          </Button>
        </div>

        <EmptyState
          icon={Globe}
          title="Nenhum mundo criado"
          description="Comece criando o primeiro mundo da sua história para organizar continentes e locais."
        />

        <CreateWorldModal
          open={showCreateWorldModal}
          onClose={() => onSetShowCreateWorldModal(false)}
          onWorldCreated={onWorldCreated}
          bookId={bookId}
        />

        <CreateContinentModal
          open={showCreateContinentModal}
          onClose={() => onSetShowCreateContinentModal(false)}
          onContinentCreated={onContinentCreated}
          bookId={bookId}
          availableWorlds={availableWorlds.map((w) => ({
            id: w.id,
            name: w.name,
          }))}
        />

        <CreateLocationModal
          open={showCreateLocationModal}
          onClose={() => onSetShowCreateLocationModal(false)}
          onLocationCreated={onLocationCreated}
          bookId={bookId}
          availableParents={[
            ...availableWorlds.map((w) => ({
              id: w.id,
              name: w.name,
              type: "World",
            })),
            ...availableContinents.map((c) => ({
              id: c.id,
              name: c.name,
              type: "Continent",
            })),
          ]}
        />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Mundo</h2>
          <p className="text-muted-foreground">
            Gerencie mundos, continentes e locais da sua história
          </p>
          <div className="mt-2">
            <StatsInfo stats={entityStats} />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 flex-wrap">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar mundos, continentes ou locais..."
            value={searchTerm}
            onChange={(e) => onSetSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="space-y-4">
        <SectionHeader
          icon={Globe}
          title="Mundos"
          count={entityStats.totalWorlds}
          entityName="mundo"
          onCreateClick={onCreateWorld}
        />

        {filteredWorlds.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredWorlds.map((entity) => (
              <EntityCard
                key={entity.id}
                entity={entity}
                onEntityClick={onEntityClick}
                getTypeColor={onGetTypeColor}
                getParentName={onGetParentName}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Globe}
            title="Nenhum mundo criado"
            description="Crie o primeiro mundo da sua história para organizar continentes e locais."
          />
        )}
      </div>

      <div className="space-y-4">
        <SectionHeader
          icon={Mountain}
          title="Continentes"
          count={entityStats.totalContinents}
          entityName="continente"
          onCreateClick={onCreateContinent}
        />

        {filteredContinents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredContinents.map((entity) => (
              <EntityCard
                key={entity.id}
                entity={entity}
                onEntityClick={onEntityClick}
                getTypeColor={onGetTypeColor}
                getParentName={onGetParentName}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Mountain}
            title="Nenhum continente criado"
            description="Crie continentes para organizar melhor os locais da sua história."
          />
        )}
      </div>

      <div className="space-y-4">
        <SectionHeader
          icon={MapPin}
          title="Locais"
          count={entityStats.totalLocations}
          entityName="local"
          onCreateClick={onCreateLocation}
        />

        {filteredLocations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredLocations.map((entity) => (
              <EntityCard
                key={entity.id}
                entity={entity}
                onEntityClick={onEntityClick}
                getTypeColor={onGetTypeColor}
                getParentName={onGetParentName}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={MapPin}
            title="Nenhum local criado"
            description="Crie locais específicos onde sua história acontece."
          />
        )}
      </div>

      <CreateWorldModal
        open={showCreateWorldModal}
        onClose={() => onSetShowCreateWorldModal(false)}
        onWorldCreated={onWorldCreated}
        bookId={bookId}
      />

      <CreateContinentModal
        open={showCreateContinentModal}
        onClose={() => onSetShowCreateContinentModal(false)}
        onContinentCreated={onContinentCreated}
        bookId={bookId}
        availableWorlds={availableWorlds.map((w) => ({
          id: w.id,
          name: w.name,
        }))}
      />

      <CreateLocationModal
        open={showCreateLocationModal}
        onClose={() => onSetShowCreateLocationModal(false)}
        onLocationCreated={onLocationCreated}
        bookId={bookId}
        availableParents={[
          ...availableWorlds.map((w) => ({
            id: w.id,
            name: w.name,
            type: "World",
          })),
          ...availableContinents.map((c) => ({
            id: c.id,
            name: c.name,
            type: "Continent",
          })),
        ]}
      />
    </div>
  );
}

import {
  Plus,
  Search,
  MapPin,
  Mountain,
  Home,
  TreePine,
  Castle,
  Globe,
  Filter,
  StickyNote,
  Edit2,
} from "lucide-react";

import { EmptyState } from "@/components/empty-state";
import { CreateContinentModal } from "@/components/modals/create-continent-modal";
import { CreateLocationModal } from "@/components/modals/create-location-modal";
import { CreateWorldModal } from "@/components/modals/create-world-modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface WorldEntity {
  id: string;
  name: string;
  type: "World" | "Continent" | "Location";
  description: string;
  parentId?: string;
  bookId: string;
  classification?: string;
  climate?: string;
  terrain?: string;
  location?: string;
  organizations?: string[];
  livingEntities?: string[];
  age?: string;
  dominantOrganization?: string;
  image?: string;
}

interface WorldViewProps {
  bookId: string;
  searchTerm: string;
  mockWorldEntities: WorldEntity[];
  showCreateWorldModal: boolean;
  showCreateContinentModal: boolean;
  showCreateLocationModal: boolean;
  worlds: WorldEntity[];
  continents: WorldEntity[];
  locations: WorldEntity[];
  filteredWorlds: WorldEntity[];
  filteredContinents: WorldEntity[];
  filteredLocations: WorldEntity[];
  totalWorlds: number;
  totalContinents: number;
  totalLocations: number;
  onSetSearchTerm: (term: string) => void;
  onSetShowCreateWorldModal: (show: boolean) => void;
  onSetShowCreateContinentModal: (show: boolean) => void;
  onSetShowCreateLocationModal: (show: boolean) => void;
  onCreateWorld: () => void;
  onCreateContinent: () => void;
  onCreateLocation: () => void;
  onWorldCreated: (world: any) => void;
  onContinentCreated: (continent: any) => void;
  onLocationCreated: (location: any) => void;
  onEntityClick: (entity: WorldEntity) => void;
  getTypeColor: (type: string) => string;
  getParentName: (parentId?: string) => string;
}

const getEntityIcon = (type: string, classification?: string) => {
  if (type === "World") return <Globe className="w-4 h-4" />;
  if (type === "Continent") return <Mountain className="w-4 h-4" />;

  // Location icons based on classification
  switch (classification?.toLowerCase()) {
    case "floresta mágica":
      return <TreePine className="w-4 h-4" />;
    case "assentamento":
    case "aldeia":
      return <Home className="w-4 h-4" />;
    case "cidade":
      return <Castle className="w-4 h-4" />;
    case "ruína mágica":
      return <Castle className="w-4 h-4" />;
    default:
      return <MapPin className="w-4 h-4" />;
  }
};

export function WorldView({
  bookId,
  searchTerm,
  mockWorldEntities,
  showCreateWorldModal,
  showCreateContinentModal,
  showCreateLocationModal,
  worlds,
  continents,
  locations,
  filteredWorlds,
  filteredContinents,
  filteredLocations,
  totalWorlds,
  totalContinents,
  totalLocations,
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
  getTypeColor,
  getParentName,
}: WorldViewProps) {
  const renderEntityCard = (entity: WorldEntity) => (
    <Card
      key={entity.id}
      className="card-magical animate-stagger cursor-pointer hover:shadow-lg transition-all"
      onClick={() => onEntityClick(entity)}
    >
      {entity.image && (
        <div className="aspect-video w-full overflow-hidden rounded-t-lg">
          <img
            src={entity.image}
            alt={entity.name}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3 flex-1">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              {getEntityIcon(entity.type, entity.classification)}
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg line-clamp-1">
                {entity.name}
              </CardTitle>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <Badge className={getTypeColor(entity.type)}>
                  {entity.type}
                </Badge>
                {entity.classification && (
                  <Badge variant="outline" className="text-xs">
                    {entity.classification}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {entity.description}
        </p>

        <div className="space-y-2 text-sm">
          {/* Parent information */}
          {entity.type === "Continent" && getParentName(entity.parentId) && (
            <div>
              <span className="font-medium">Mundo:</span>
              <span className="ml-2 text-muted-foreground">
                {getParentName(entity.parentId)}
              </span>
            </div>
          )}

          {entity.type === "Location" && (
            <>
              {getParentName(entity.parentId) && (
                <div>
                  <span className="font-medium">Continente:</span>
                  <span className="ml-2 text-muted-foreground">
                    {getParentName(entity.parentId)}
                  </span>
                </div>
              )}
              {entity.climate && (
                <div>
                  <span className="font-medium">Clima:</span>
                  <span className="ml-2 text-muted-foreground">
                    {entity.climate}
                  </span>
                </div>
              )}
            </>
          )}

          {entity.age && (
            <div>
              <span className="font-medium">Idade:</span>
              <span className="ml-2 text-muted-foreground">{entity.age}</span>
            </div>
          )}

          {entity.dominantOrganization && (
            <div>
              <span className="font-medium">Org. Dominante:</span>
              <span className="ml-2 text-muted-foreground">
                {entity.dominantOrganization}
              </span>
            </div>
          )}

          {entity.livingEntities && entity.livingEntities.length > 0 && (
            <div>
              <span className="font-medium">Entidades:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {entity.livingEntities.slice(0, 3).map((livingEntity, idx) => (
                  <Badge key={idx} variant="secondary" className="text-xs">
                    {livingEntity}
                  </Badge>
                ))}
                {entity.livingEntities.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{entity.livingEntities.length - 3}
                  </Badge>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  if (mockWorldEntities.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Mundo</h2>
            <p className="text-muted-foreground">
              Gerencie mundos, continentes e locais
            </p>
          </div>
          <Button variant="magical" onClick={onCreateWorld}>
            <Plus className="w-4 h-4 mr-2" />
            Criar Mundo
          </Button>
        </div>

        <EmptyState
          icon={Globe}
          title="Nenhum mundo criado"
          description="Comece criando o primeiro mundo da sua história para organizar continentes e locais."
          actionLabel="Criar Mundo"
          onAction={onCreateWorld}
        />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Mundo</h2>
          <p className="text-muted-foreground">
            Gerencie mundos, continentes e locais da sua história
          </p>
        </div>
      </div>

      {/* Global Search */}
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

      {/* Mundos Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Mundos
            </h3>
            <p className="text-sm text-muted-foreground">
              {totalWorlds} mundo{totalWorlds !== 1 ? "s" : ""} criado
              {totalWorlds !== 1 ? "s" : ""}
            </p>
          </div>
          <Button variant="magical" onClick={onCreateWorld}>
            <Plus className="w-4 h-4 mr-2" />
            Criar Mundo
          </Button>
        </div>

        {filteredWorlds.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredWorlds.map(renderEntityCard)}
          </div>
        ) : (
          <EmptyState
            icon={Globe}
            title="Nenhum mundo criado"
            description="Crie o primeiro mundo da sua história para organizar continentes e locais."
            actionLabel="Criar Mundo"
            onAction={onCreateWorld}
          />
        )}
      </div>

      {/* Continentes Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <Mountain className="w-5 h-5" />
              Continentes
            </h3>
            <p className="text-sm text-muted-foreground">
              {totalContinents} continente{totalContinents !== 1 ? "s" : ""}{" "}
              criado{totalContinents !== 1 ? "s" : ""}
            </p>
          </div>
          <Button variant="magical" onClick={onCreateContinent}>
            <Plus className="w-4 h-4 mr-2" />
            Criar Continente
          </Button>
        </div>

        {filteredContinents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredContinents.map(renderEntityCard)}
          </div>
        ) : (
          <EmptyState
            icon={Mountain}
            title="Nenhum continente criado"
            description="Crie continentes para organizar melhor os locais da sua história."
            actionLabel="Criar Continente"
            onAction={onCreateContinent}
          />
        )}
      </div>

      {/* Locais Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Locais
            </h3>
            <p className="text-sm text-muted-foreground">
              {totalLocations} local{totalLocations !== 1 ? "is" : ""} criado
              {totalLocations !== 1 ? "s" : ""}
            </p>
          </div>
          <Button variant="magical" onClick={onCreateLocation}>
            <Plus className="w-4 h-4 mr-2" />
            Criar Local
          </Button>
        </div>

        {filteredLocations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredLocations.map(renderEntityCard)}
          </div>
        ) : (
          <EmptyState
            icon={MapPin}
            title="Nenhum local criado"
            description="Crie locais específicos onde sua história acontece."
            actionLabel="Criar Local"
            onAction={onCreateLocation}
          />
        )}
      </div>

      {/* Modals */}
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
        availableWorlds={worlds.map((w) => ({ id: w.id, name: w.name }))}
      />

      <CreateLocationModal
        open={showCreateLocationModal}
        onClose={() => onSetShowCreateLocationModal(false)}
        onLocationCreated={onLocationCreated}
        bookId={bookId}
        availableParents={[
          ...worlds.map((w) => ({ id: w.id, name: w.name, type: "World" })),
          ...continents.map((c) => ({
            id: c.id,
            name: c.name,
            type: "Continent",
          })),
        ]}
      />
    </div>
  );
}

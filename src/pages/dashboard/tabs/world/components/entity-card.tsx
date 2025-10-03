import { Globe, Mountain, MapPin, TreePine, Home, Castle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { IWorldEntity } from "../types/world-types";

interface PropsEntityCard {
  entity: IWorldEntity;
  onEntityClick: (entity: IWorldEntity) => void;
  getTypeColor: (type: string) => string;
  getParentName: (parentId?: string) => string;
}

const getEntityIcon = (type: string, classification?: string) => {
  if (type === "World") return <Globe className="w-4 h-4" />;
  if (type === "Continent") return <Mountain className="w-4 h-4" />;

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

export function EntityCard({
  entity,
  onEntityClick,
  getTypeColor,
  getParentName,
}: PropsEntityCard) {
  return (
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
}

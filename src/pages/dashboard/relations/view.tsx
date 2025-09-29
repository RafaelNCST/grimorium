import {
  Plus,
  Edit2,
  Search,
  Network,
  Heart,
  Sword,
  Crown,
  Users,
  Zap,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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

interface Relationship {
  id: string;
  fromEntity: string;
  toEntity: string;
  type:
    | "Amizade"
    | "Romance"
    | "Rivalidade"
    | "Família"
    | "Mentor/Aluno"
    | "Inimizade"
    | "Aliança"
    | "Subordinação";
  strength: "Fraca" | "Moderada" | "Forte" | "Muito Forte";
  description: string;
  status: "Ativo" | "Tenso" | "Rompido" | "Desenvolvendo";
}

interface RelationsViewProps {
  searchTerm: string;
  selectedType: string;
  viewMode: "list" | "network";
  relationshipTypes: string[];
  filteredRelationships: Relationship[];
  onSearchTermChange: (term: string) => void;
  onSelectedTypeChange: (type: string) => void;
  onViewModeChange: (mode: "list" | "network") => void;
  onCreateRelation: () => void;
  getRelationshipColor: (type: string) => string;
  getStatusColor: (status: string) => string;
  getStrengthProgress: (strength: string) => number;
}

const getRelationshipIcon = (type: string) => {
  switch (type) {
    case "Amizade":
      return <Heart className="w-4 h-4" />;
    case "Romance":
      return <Heart className="w-4 h-4 text-red-500" />;
    case "Rivalidade":
      return <Zap className="w-4 h-4" />;
    case "Família":
      return <Users className="w-4 h-4" />;
    case "Mentor/Aluno":
      return <Crown className="w-4 h-4" />;
    case "Inimizade":
      return <Sword className="w-4 h-4" />;
    default:
      return <Network className="w-4 h-4" />;
  }
};

export function RelationsView({
  searchTerm,
  selectedType,
  viewMode,
  relationshipTypes,
  filteredRelationships,
  onSearchTermChange,
  onSelectedTypeChange,
  onViewModeChange,
  onCreateRelation,
  getRelationshipColor,
  getStatusColor,
  getStrengthProgress,
}: RelationsViewProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Mapa de Relações</h2>
          <p className="text-muted-foreground">
            Visualize as conexões entre personagens e organizações
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center border border-border rounded-lg">
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => onViewModeChange("list")}
              className="rounded-r-none"
            >
              Lista
            </Button>
            <Button
              variant={viewMode === "network" ? "default" : "ghost"}
              size="sm"
              onClick={() => onViewModeChange("network")}
              className="rounded-l-none"
            >
              Rede
            </Button>
          </div>
          <Button variant="magical" onClick={onCreateRelation}>
            <Plus className="w-4 h-4 mr-2" />
            Nova Relação
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar relações..."
            value={searchTerm}
            onChange={(e) => onSearchTermChange(e.target.value)}
            className="pl-10"
          />
        </div>

        <select
          value={selectedType}
          onChange={(e) => onSelectedTypeChange(e.target.value)}
          className="px-3 py-2 border border-border rounded-md bg-background text-foreground"
        >
          <option value="all">Todos os tipos</option>
          {relationshipTypes.slice(1).map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      {viewMode === "list" ? (
        /* List View */
        <div className="space-y-4">
          {filteredRelationships.map((relationship) => (
            <Card
              key={relationship.id}
              className="card-magical animate-stagger"
            >
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-3">
                      {/* From Entity */}
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">
                            {relationship.fromEntity
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">
                          {relationship.fromEntity}
                        </span>
                      </div>

                      {/* Relationship Arrow and Type */}
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          {getRelationshipIcon(relationship.type)}
                          <span className="text-sm text-muted-foreground">
                            →
                          </span>
                        </div>
                        <Badge
                          className={getRelationshipColor(relationship.type)}
                        >
                          {relationship.type}
                        </Badge>
                      </div>

                      {/* To Entity */}
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">
                            {relationship.toEntity
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">
                          {relationship.toEntity}
                        </span>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground mb-3">
                      {relationship.description}
                    </p>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium">
                          Intensidade:
                        </span>
                        <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-primary transition-all"
                            style={{
                              width: `${getStrengthProgress(relationship.strength)}%`,
                            }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {relationship.strength}
                        </span>
                      </div>

                      <Badge
                        className={getStatusColor(relationship.status)}
                        variant="outline"
                      >
                        {relationship.status}
                      </Badge>
                    </div>
                  </div>

                  <Button variant="ghost" size="icon">
                    <Edit2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        /* Network View - Placeholder */
        <Card className="card-magical">
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <Network className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                Visualização em Rede
              </h3>
              <p className="text-muted-foreground mb-4">
                Funcionalidade em desenvolvimento - Visualize as relações como
                um grafo interativo
              </p>
              <Button
                variant="outline"
                onClick={() => onViewModeChange("list")}
              >
                Voltar para Lista
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {filteredRelationships.length === 0 && (
        <div className="text-center py-12">
          <Network className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            Nenhuma relação encontrada
          </h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm || selectedType !== "all"
              ? "Tente ajustar seus filtros"
              : "Comece mapeando as relações entre seus personagens"}
          </p>
          <Button variant="magical" onClick={onCreateRelation}>
            <Plus className="w-4 h-4 mr-2" />
            Criar Relação
          </Button>
        </div>
      )}
    </div>
  );
}

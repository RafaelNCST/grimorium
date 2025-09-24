import { useState } from "react";

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

const mockRelationships: Relationship[] = [
  {
    id: "1",
    fromEntity: "Aelric Valorheart",
    toEntity: "Lyara Moonwhisper",
    type: "Mentor/Aluno",
    strength: "Forte",
    description:
      "Lyara descobriu os poderes de Aelric e tornou-se sua mentora, ensinando-o sobre magia e história.",
    status: "Ativo",
  },
  {
    id: "2",
    fromEntity: "Aelric Valorheart",
    toEntity: "Finn Pedraverde",
    type: "Amizade",
    strength: "Muito Forte",
    description:
      "Companheiros de jornada que desenvolveram uma amizade profunda através das aventuras compartilhadas.",
    status: "Ativo",
  },
  {
    id: "3",
    fromEntity: "Aelric Valorheart",
    toEntity: "Malachar o Sombrio",
    type: "Inimizade",
    strength: "Muito Forte",
    description:
      "Antagonistas diretos no conflito entre luz e trevas. Malachar vê Aelric como uma ameaça aos seus planos.",
    status: "Ativo",
  },
  {
    id: "4",
    fromEntity: "Ordem dos Guardiões",
    toEntity: "Culto das Sombras",
    type: "Inimizade",
    strength: "Muito Forte",
    description:
      "Organizações opostas em uma guerra ancestral entre luz e trevas.",
    status: "Ativo",
  },
  {
    id: "5",
    fromEntity: "Finn Pedraverde",
    toEntity: "Guilda dos Artífices",
    type: "Subordinação",
    strength: "Moderada",
    description:
      "Finn é membro da guilda mas mantém certa independência em suas aventuras.",
    status: "Ativo",
  },
  {
    id: "6",
    fromEntity: "Lyara Moonwhisper",
    toEntity: "Malachar o Sombrio",
    type: "Rivalidade",
    strength: "Forte",
    description:
      "Antigos conhecidos que escolheram caminhos opostos na magia. Há respeito mútuo mas discordância fundamental.",
    status: "Tenso",
  },
];

export function RelationsTab() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [viewMode, setViewMode] = useState<"list" | "network">("list");

  const relationshipTypes = [
    "all",
    "Amizade",
    "Romance",
    "Rivalidade",
    "Família",
    "Mentor/Aluno",
    "Inimizade",
    "Aliança",
    "Subordinação",
  ];

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

  const getRelationshipColor = (type: string) => {
    switch (type) {
      case "Amizade":
        return "bg-success text-success-foreground";
      case "Romance":
        return "bg-pink-500 text-white";
      case "Rivalidade":
        return "bg-accent text-accent-foreground";
      case "Família":
        return "bg-primary text-primary-foreground";
      case "Mentor/Aluno":
        return "bg-blue-500 text-white";
      case "Inimizade":
        return "bg-destructive text-destructive-foreground";
      case "Aliança":
        return "bg-green-600 text-white";
      case "Subordinação":
        return "bg-secondary text-secondary-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Ativo":
        return "bg-success text-success-foreground";
      case "Tenso":
        return "bg-accent text-accent-foreground";
      case "Rompido":
        return "bg-destructive text-destructive-foreground";
      case "Desenvolvendo":
        return "bg-primary text-primary-foreground";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  const getStrengthProgress = (strength: string) => {
    switch (strength) {
      case "Muito Forte":
        return 100;
      case "Forte":
        return 75;
      case "Moderada":
        return 50;
      case "Fraca":
        return 25;
      default:
        return 0;
    }
  };

  const filteredRelationships = mockRelationships.filter((relationship) => {
    const matchesSearch =
      relationship.fromEntity
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      relationship.toEntity.toLowerCase().includes(searchTerm.toLowerCase()) ||
      relationship.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType =
      selectedType === "all" || relationship.type === selectedType;
    return matchesSearch && matchesType;
  });

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
              onClick={() => setViewMode("list")}
              className="rounded-r-none"
            >
              Lista
            </Button>
            <Button
              variant={viewMode === "network" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("network")}
              className="rounded-l-none"
            >
              Rede
            </Button>
          </div>
          <Button variant="magical">
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
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
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
              <Button variant="outline" onClick={() => setViewMode("list")}>
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
          <Button variant="magical">
            <Plus className="w-4 h-4 mr-2" />
            Criar Relação
          </Button>
        </div>
      )}
    </div>
  );
}

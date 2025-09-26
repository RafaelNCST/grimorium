import { useState } from "react";

import { RelationsView } from "./view";

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
    // This will be implemented in the view component
    return type;
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

  const handleCreateRelation = () => {
    console.log("Create new relation");
  };

  return (
    <RelationsView
      searchTerm={searchTerm}
      selectedType={selectedType}
      viewMode={viewMode}
      relationshipTypes={relationshipTypes}
      filteredRelationships={filteredRelationships}
      onSearchTermChange={setSearchTerm}
      onSelectedTypeChange={setSelectedType}
      onViewModeChange={setViewMode}
      onCreateRelation={handleCreateRelation}
      getRelationshipColor={getRelationshipColor}
      getStatusColor={getStatusColor}
      getStrengthProgress={getStrengthProgress}
    />
  );
}
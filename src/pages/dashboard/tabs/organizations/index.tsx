import { useState } from "react";

import { useNavigate } from "@tanstack/react-router";

import { useLanguageStore } from "@/stores/language-store";

import { OrganizationsView } from "./view";

interface OrganizationTitle {
  id: string;
  name: string;
  description: string;
  level: number; // 1 = highest rank, higher numbers = lower ranks
}

interface OrganizationMember {
  characterId: string;
  characterName: string;
  titleId: string;
  joinDate: string;
}

interface Organization {
  id: string;
  name: string;
  photo?: string;
  alignment: "Bem" | "Neutro" | "Caótico";
  description: string;
  type:
    | "Militar"
    | "Comercial"
    | "Mágica"
    | "Religiosa"
    | "Culto"
    | "Governamental"
    | "Outros";
  influence: "Inexistente" | "Baixa" | "Média" | "Alta" | "Dominante";
  leaders: string[];
  objectives: string[];
  members: OrganizationMember[];
  titles: OrganizationTitle[];
  dominatedLocations: string[];
  baseLocation?: string;
  world?: string;
  continent?: string;
}

interface OrganizationsTabProps {
  bookId: string;
}

const mockOrganizations: Organization[] = [
  {
    id: "1",
    name: "Ordem dos Guardiões",
    alignment: "Bem",
    description:
      "Antiga ordem militar dedicada à proteção do reino e preservação da luz.",
    type: "Militar",
    influence: "Alta",
    leaders: ["Lyara Moonwhisper"],
    objectives: [
      "Proteger o reino das forças das trevas",
      "Preservar a magia da luz",
    ],
    world: "Aethermoor",
    continent: "Continente Central",
    baseLocation: "Cidadela da Luz",
    dominatedLocations: ["Cidadela da Luz", "Postos Avançados"],
    titles: [
      {
        id: "t1",
        name: "Guardião Supremo",
        description: "Líder máximo da ordem",
        level: 1,
      },
    ],
    members: [
      {
        characterId: "c1",
        characterName: "Lyara Moonwhisper",
        titleId: "t1",
        joinDate: "Era Atual, 1090",
      },
    ],
  },
];

export function OrganizationsTab({ bookId }: OrganizationsTabProps) {
  const { t } = useLanguageStore();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAlignment, setSelectedAlignment] = useState<string>("all");
  const [selectedWorld, setSelectedWorld] = useState<string>("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [organizations, setOrganizations] = useState(mockOrganizations);

  const alignments = ["all", "Bem", "Neutro", "Caótico"];
  const worlds = ["all", "Aethermoor"];

  const handleCreateOrganization = () => {
    setShowCreateModal(true);
  };

  const handleOrganizationCreated = (newOrganization: any) => {
    setOrganizations((prev) => [...prev, newOrganization]);
  };

  const handleOrganizationClick = (orgId: string) => {
    navigate({
      to: "/dashboard/$dashboardId/tabs/organization/$orgId",
      params: { dashboardId: bookId, orgId: orgId },
    });
  };

  const filteredOrganizations = organizations.filter((org) => {
    const matchesSearch =
      org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      org.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAlignment =
      selectedAlignment === "all" || org.alignment === selectedAlignment;
    const matchesWorld = selectedWorld === "all" || org.world === selectedWorld;
    return matchesSearch && matchesAlignment && matchesWorld;
  });

  // Statistics
  const totalByAlignment = {
    bem: organizations.filter((o) => o.alignment === "Bem").length,
    neutro: organizations.filter((o) => o.alignment === "Neutro").length,
    caotico: organizations.filter((o) => o.alignment === "Caótico").length,
  };

  return (
    <OrganizationsView
      bookId={bookId}
      organizations={organizations}
      filteredOrganizations={filteredOrganizations}
      totalByAlignment={totalByAlignment}
      searchTerm={searchTerm}
      selectedAlignment={selectedAlignment}
      selectedWorld={selectedWorld}
      showCreateModal={showCreateModal}
      alignments={alignments}
      worlds={worlds}
      onSearchTermChange={setSearchTerm}
      onSelectedAlignmentChange={setSelectedAlignment}
      onSelectedWorldChange={setSelectedWorld}
      onShowCreateModalChange={setShowCreateModal}
      onCreateOrganization={handleCreateOrganization}
      onOrganizationCreated={handleOrganizationCreated}
      onOrganizationClick={handleOrganizationClick}
    />
  );
}

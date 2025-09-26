export interface OrganizationTitle {
  id: string;
  name: string;
  description: string;
  level: number;
}

export interface OrganizationMember {
  characterId: string;
  characterName: string;
  titleId: string;
  joinDate: string;
}

export interface Organization {
  id: string;
  name: string;
  photo?: string;
  alignment: "Bem" | "Neutro" | "Caótico";
  description: string;
  type: string;
  influence: string;
  leaders: string[];
  objectives: string[];
  members: OrganizationMember[];
  titles: OrganizationTitle[];
  dominatedLocations: string[];
  dominatedContinents: string[];
  dominatedWorlds: string[];
  baseLocation?: string;
  world?: string;
  continent?: string;
}

// Mock data - in real app this would come from state management
export const mockOrganizations: Record<string, Organization> = {
  "1": {
    id: "1",
    name: "Ordem dos Guardiões",
    alignment: "Bem",
    description:
      "Antiga ordem militar dedicada à proteção do reino e preservação da luz. Formada pelos melhores guerreiros e magos, esta organização secular tem defendido os inocentes contra as forças das trevas por gerações. Seus membros são conhecidos por sua honra, coragem e dedicação inabalável à justiça.",
    type: "Militar",
    influence: "Alta",
    leaders: ["Lyara Moonwhisper"],
    objectives: [
      "Proteger o reino das forças das trevas",
      "Preservar a magia da luz",
      "Treinar novos guardiões",
      "Manter a paz entre os reinos",
      "Combater cultos sombrios",
    ],
    world: "Aethermoor",
    continent: "Continente Central",
    baseLocation: "Cidadela da Luz",
    dominatedLocations: ["Cidadela da Luz", "Postos Avançados"],
    dominatedContinents: [],
    dominatedWorlds: [],
    titles: [
      {
        id: "t1",
        name: "Guardião Supremo",
        description: "Líder máximo da ordem",
        level: 1,
      },
      {
        id: "t2",
        name: "Comandante",
        description: "Líder militar regional",
        level: 2,
      },
      {
        id: "t3",
        name: "Cavaleiro",
        description: "Guerreiro experiente",
        level: 3,
      },
      {
        id: "t4",
        name: "Escudeiro",
        description: "Guerreiro em treinamento",
        level: 4,
      },
    ],
    members: [
      {
        characterId: "c1",
        characterName: "Lyara Moonwhisper",
        titleId: "t1",
        joinDate: "Era Atual, 1090",
      },
      {
        characterId: "c2",
        characterName: "Aelric Valorheart",
        titleId: "t4",
        joinDate: "Era Atual, 1113",
      },
      {
        characterId: "c3",
        characterName: "Sir Marcus Lightbringer",
        titleId: "t2",
        joinDate: "Era Atual, 1095",
      },
    ],
  },
};

// Mock data for dropdowns
export const availableLocations = [
  { id: "l1", name: "Cidadela da Luz", type: "Fortaleza" },
  { id: "l2", name: "Torre Sombria", type: "Torre" },
  { id: "l3", name: "Aldeia de Pedraverde", type: "Aldeia" },
  { id: "l4", name: "Floresta das Lamentações", type: "Floresta" },
  { id: "l5", name: "Postos Avançados", type: "Posto" },
];

export const availableWorlds = [
  { id: "w1", name: "Aethermoor", type: "Mundo" },
];

export const availableContinents = [
  { id: "c1", name: "Continente Central", type: "Continente" },
  { id: "c2", name: "Terras Sombrias", type: "Continente" },
];

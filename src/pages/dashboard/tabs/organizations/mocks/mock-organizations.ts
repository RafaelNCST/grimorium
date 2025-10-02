import { IOrganization } from "@/types/organization-types";

export const MOCK_ORGANIZATIONS: IOrganization[] = [
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
    dominatedContinents: [],
    dominatedWorlds: [],
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

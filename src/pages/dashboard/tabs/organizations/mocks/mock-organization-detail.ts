import { IOrganization } from "@/types/organization-types";

export const MOCK_ORGANIZATIONS_DETAIL: Record<string, IOrganization> = {
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

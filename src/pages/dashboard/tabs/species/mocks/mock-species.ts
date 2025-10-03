import { ISpecies } from "../types/species-types";

export const MOCK_SPECIES: ISpecies[] = [
  {
    id: "1",
    knownName: "Elfos",
    scientificName: "Homo elvensis",
    description:
      "Seres mágicos de longa vida com orelhas pontiagudas e grande afinidade com a natureza.",
    races: [
      {
        id: "1",
        name: "Elfos da Floresta",
        description: "Elfos que vivem em harmonia com as florestas antigas.",
        history:
          "Os Elfos da Floresta são os guardiões ancestrais das florestas sagradas...",
        type: "Terrestre",
        physicalCharacteristics:
          "Pele clara com tons esverdeados, cabelos longos...",
        culture:
          "Vivem em comunidades arbóreas, respeitando os ciclos naturais...",
        speciesId: "1",
      },
      {
        id: "2",
        name: "Elfos do Mar",
        description:
          "Elfos adaptados à vida aquática com habilidades marinhas.",
        history:
          "Descendentes dos primeiros elfos que migraram para os oceanos...",
        type: "Aquática",
        physicalCharacteristics: "Pele azulada, guelras funcionais...",
        culture: "Sociedade baseada na harmonia com as correntes oceânicas...",
        speciesId: "1",
      },
    ],
  },
  {
    id: "2",
    knownName: "Dragões",
    scientificName: "Draco magnus",
    description: "Criaturas ancestrais de grande poder mágico e sabedoria.",
    races: [
      {
        id: "3",
        name: "Dragão de Fogo",
        description: "Dragões que dominam o elemento fogo.",
        history: "Nascidos das chamas primordiais do mundo...",
        type: "Voadora",
        physicalCharacteristics: "Escamas vermelhas, hálito de fogo...",
        culture: "Territorialistas, vivem em cavernas vulcânicas...",
        speciesId: "2",
      },
    ],
  },
];

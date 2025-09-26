export interface CharacterDetail {
  id: string;
  name: string;
  age: number;
  race: string;
  class: string;
  level: number;
  homeland: string;
  currentLocation: string;
  organization: string;
  backstory: string;
  personality: string;
  appearance: string;
  goals: string;
  fears: string;
  relationships: Array<{
    characterId: string;
    type: string;
    description: string;
  }>;
  stats: {
    strength: number;
    dexterity: number;
    constitution: number;
    intelligence: number;
    wisdom: number;
    charisma: number;
  };
  skills: string[];
  virtues: string[];
  flaws: string[];
  inventory: Array<{
    id: string;
    name: string;
    quantity: number;
  }>;
  image?: string;
}

export const mockCharacterDetail = {
  id: "1",
  name: "Aelric Valorheart",
  age: 23,
  gender: "masculino",
  appearance:
    "Jovem de estatura média com cabelos castanhos ondulados e olhos verdes penetrantes. Possui uma cicatriz no braço direito de uma batalha antiga. Veste sempre uma armadura de couro reforçado com detalhes em bronze, e carrega uma espada élfica herdada de seus antepassados. Seus olhos brilham com uma luz sobrenatural quando usa magia.",
  role: "protagonista",
  personality:
    "Determinado e corajoso, mas às vezes impulsivo. Possui um forte senso de justiça e não hesita em ajudar os necessitados. É naturalmente carismático e inspira confiança nos outros. Tem tendência a se sacrificar pelos outros, o que às vezes o coloca em situações perigosas. Apesar de sua juventude, demonstra uma sabedoria além de seus anos.",
  description:
    "Um jovem pastor que descobre possuir poderes mágicos ancestrais e se torna o último guardião de uma antiga profecia.",
  organization: "Ordem dos Guardiões",
  birthPlace: "Vila Pedraverde",
  affiliatedPlace: "Capital Elaria",
  alignment: "bem",
  qualities: [
    "Corajoso",
    "Determinado",
    "Leal",
    "Otimista",
    "Protetor",
    "Carismático",
    "Altruísta",
    "Intuitivo",
  ],
  image:
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
  chapterMentions: 12,
  firstAppearance: "Capítulo 1",
  lastAppearance: "Capítulo 12",
  family: {
    father: null,
    mother: null,
    children: [],
    siblings: [],
    spouse: null,
    halfSiblings: [],
    unclesAunts: [],
    grandparents: [],
    cousins: [],
  },
  relationships: [
    {
      id: "rel-1",
      characterId: "2",
      type: "amizade",
      intensity: 85,
    },
    {
      id: "rel-2",
      characterId: "4",
      type: "interesse_amoroso",
      intensity: 70,
    },
    {
      id: "rel-3",
      characterId: "8",
      type: "rivalidade",
      intensity: 60,
    },
  ],
};

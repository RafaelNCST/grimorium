export interface ICharacter {
  id: string;
  name: string;
  age?: number;
  appearance?: string;
  role: string;
  personality?: string;
  description: string;
  organization: string;
  birthPlace?: string;
  affiliatedPlace?: string;
  alignment?: string;
  image?: string;
  qualities: string[];
}

export const MOCK_BOOK_CHARACTERS = (bookId: string): ICharacter[] => {
  if (bookId === "1") {
    return [
      {
        id: "1",
        name: "Aelric Valorheart",
        age: 23,
        appearance:
          "Jovem de estatura média com cabelos castanhos ondulados e olhos verdes penetrantes. Possui uma cicatriz no braço direito de uma batalha antiga. Veste sempre uma armadura de couro reforçado com detalhes em bronze, e carrega uma espada élfica herdada de seus antepassados. Seus olhos brilham com uma luz sobrenatural quando usa magia.",
        description:
          "Um jovem pastor que descobre possuir poderes mágicos ancestrais.",
        role: "protagonista",
        personality:
          "Determinado e corajoso, mas às vezes impulsivo. Possui um forte senso de justiça e não hesita em ajudar os necessitados. É naturalmente carismático e inspira confiança nos outros. Tem tendência a se sacrificar pelos outros, o que às vezes o coloca em situações perigosas. Apesar de sua juventude, demonstra uma sabedoria além de seus anos.",
        organization: "Ordem dos Guardiões",
        birthPlace: "Vila Pedraverde",
        affiliatedPlace: "Capital Elaria",
        alignment: "bem",
        image:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
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
      },
      {
        id: "2",
        name: "Lyara Moonwhisper",
        age: 247,
        description:
          "Mentora élfica com conhecimento profundo sobre magia antiga.",
        role: "secundario",
        organization: "Ordem dos Guardiões",
        birthPlace: "Floresta Sombria",
        affiliatedPlace: "Capital Elaria",
        alignment: "bem",
        qualities: ["Sábia", "Misteriosa", "Protetora"],
      },
      {
        id: "3",
        name: "Malachar o Sombrio",
        age: 45,
        description:
          "Antigo mago que busca o poder absoluto através da magia negra.",
        role: "antagonista",
        organization: "Culto das Sombras",
        birthPlace: "Montanhas do Norte",
        affiliatedPlace: "Torre Sombria",
        alignment: "caotico",
        qualities: ["Ambicioso", "Cruel", "Inteligente"],
      },
      {
        id: "4",
        name: "Finn Pedraverde",
        age: 67,
        description: "Anão ferreiro e companheiro leal do protagonista.",
        role: "secundario",
        organization: "Guilda dos Ferreiros",
        birthPlace: "Montanhas do Norte",
        affiliatedPlace: "Vila Pedraverde",
        alignment: "bem",
        qualities: ["Leal", "Trabalhador", "Teimoso"],
      },
      {
        id: "5",
        name: "Seraphina Nightblade",
        age: 28,
        description: "Assassina habilidosa que serve aos interesses sombrios.",
        role: "vilao",
        organization: "Culto das Sombras",
        birthPlace: "Capital Elaria",
        affiliatedPlace: "Submundo",
        alignment: "caotico",
        qualities: ["Ágil", "Letal", "Calculista"],
      },
    ];
  }
  return [];
};

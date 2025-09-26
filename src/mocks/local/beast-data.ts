export interface Mythology {
  id: string;
  people: string;
  version: string;
}

export interface Beast {
  id: string;
  name: string;
  alternativeNames: string[];
  race: string;
  species: string;
  basicDescription: string;
  appearanceDescription: string;
  behaviors: string;
  habit: string;
  habitat: string[];
  humanComparison: string;
  weaknesses: string[];
  preys: string[];
  predators: string[];
  threatLevel: { name: string; color: string };
  mythologies: Mythology[];
  inspirations: string;
  image: string;
}

export const mockBeast: Beast = {
  id: "1",
  name: "Dragão Sombrio",
  alternativeNames: ["Wyrm das Trevas", "Senhor da Noite"],
  race: "Dracônico",
  species: "Reptiliano",
  basicDescription:
    "Criatura ancestral de escamas negras que domina as artes da magia sombria.",
  appearanceDescription:
    "Um dragão de tamanho colossal com escamas que parecem absorver a luz ao redor. Seus olhos brilham com um fogo violeta intenso, e suas garras são capazes de rasgar tanto carne quanto metal. Possui chifres curvos que se estendem para trás de sua cabeça majestosa, e suas asas, quando abertas, podem cobrir uma área equivalente a uma pequena cidade.",
  behaviors:
    "Extremamente territorialista e orgulhoso. Prefere atacar de surpresa, usando sua capacidade de se mover através das sombras. É incrivelmente inteligente e manipulativo, frequentemente fazendo acordos com mortais apenas para quebrar os termos quando mais conveniente. Demonstra particular desprezo por outras criaturas dracônicas.",
  habit: "noturno",
  habitat: ["Montanhas Sombrias", "Cavernas Profundas"],
  humanComparison: "impossível de ganhar",
  weaknesses: [
    "Luz solar direta causa desconforto",
    "Magia de luz pura",
    "Armas forjadas com metal celestial",
  ],
  preys: [
    "Elfos Sombrios",
    "Orcs das Montanhas",
    "Criaturas menores dracônicas",
  ],
  predators: [],
  threatLevel: { name: "apocalíptico", color: "red" },
  mythologies: [
    {
      id: "myth-1",
      people: "Elfos da Floresta",
      version:
        "Para os elfos, o Dragão Sombrio é conhecido como 'Nalagor, o Devorador de Estrelas'. Segundo suas lendas, ele nasceu da primeira noite que existiu no mundo, quando as trevas se separaram da luz. É visto como uma força natural inevitável, não necessariamente maligna, mas definitivamente perigosa.",
    },
    {
      id: "myth-2",
      people: "Humanos do Norte",
      version:
        "Os nórdicos o chamam de 'Mörkserpent' e acreditam que ele é o precursor do fim dos tempos. Suas lendas dizem que quando ele despertar completamente de seu sono milenar, as estrelas cairão do céu e a Era da Luz chegará ao fim.",
    },
  ],
  inspirations:
    "Baseado em Smaug de Tolkien, com elementos de Alduin de Skyrim. Inspiração visual vem de dragões orientais misturados com dragões ocidentais clássicos. A mitologia se inspira em Jörmungandr da mitologia nórdica.",
  image:
    "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop",
};

export const habits = [
  "diurno",
  "noturno",
  "crepuscular",
  "migratório",
  "caótico",
  "subterrâneo",
];

export const humanComparisons = [
  "impotente",
  "mais fraco",
  "ligeiramente mais fraco",
  "igual",
  "ligeiramente mais forte",
  "mais forte",
  "impossível de ganhar",
];

export const threatLevels = [
  { name: "inexistente", color: "green" },
  { name: "baixo", color: "blue" },
  { name: "médio", color: "yellow" },
  { name: "mortal", color: "orange" },
  { name: "apocalíptico", color: "red" },
];

// Mock linked notes - could potentially be moved to global mocks if shared
export const mockLinkedNotes = [
  {
    id: "note-1",
    name: "Comportamento Noturno dos Dragões",
    content:
      "Observações sobre os padrões de comportamento dos dragões durante a noite. O Dragão Sombrio mostra características únicas...",
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-15"),
    linkCreatedAt: new Date("2024-01-12"),
  },
];

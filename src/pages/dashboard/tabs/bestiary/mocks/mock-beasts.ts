import { Beast } from "@/mocks/local/beast-data";

export const MOCK_BEASTS: Beast[] = [
  {
    id: "1",
    name: "Dragão Sombrio",
    alternativeNames: ["Wyrm das Trevas", "Senhor da Noite"],
    race: "Dracônico",
    species: "Reptiliano",
    basicDescription:
      "Criatura ancestral de escamas negras que domina as artes da magia sombria.",
    appearanceDescription:
      "Um dragão de tamanho colossal com escamas que parecem absorver a luz ao redor.",
    behaviors:
      "Extremamente territorialista e orgulhoso. Prefere atacar de surpresa.",
    habit: "noturno",
    habitat: ["Montanhas Sombrias", "Cavernas Profundas"],
    threatLevel: { name: "apocalíptico", color: "red" },
    image:
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
    humanComparison: "impossível de ganhar",
    weaknesses: ["Luz solar direta", "Magia de luz pura"],
    preys: ["Elfos Sombrios", "Orcs das Montanhas"],
    predators: [],
    mythologies: [],
    inspirations: "Baseado em Smaug de Tolkien",
  },
  {
    id: "2",
    name: "Lobo das Névoas",
    alternativeNames: ["Lobo Fantasma"],
    race: "Lupino",
    species: "Mamífero",
    basicDescription:
      "Predador fantasmagórico que se materializa através da névoa matinal.",
    appearanceDescription: "Lobo de pelagem branca e translúcida.",
    behaviors: "Caça em matilhas durante o crepúsculo.",
    habit: "crepuscular",
    habitat: ["Florestas Nebulosas", "Vales"],
    threatLevel: { name: "médio", color: "yellow" },
    image:
      "https://images.unsplash.com/photo-1553830591-fddf9c6aab9e?w=400&h=300&fit=crop",
    humanComparison: "mais forte",
    weaknesses: ["Fogo", "Luz intensa"],
    preys: ["Coelhos", "Veados"],
    predators: [],
    mythologies: [],
    inspirations: "Lobos místicos das florestas nórdicas",
  },
  {
    id: "3",
    name: "Pixie Luminoso",
    alternativeNames: ["Fada da Luz"],
    race: "Feérico",
    species: "Espírito",
    basicDescription:
      "Pequena criatura mágica que emite luz própria e possui natureza brincalhona.",
    appearanceDescription: "Criatura pequena e alada que brilha intensamente.",
    behaviors: "Travessa e brincalhona, gosta de pregar peças.",
    habit: "diurno",
    habitat: ["Clareiras", "Jardins Mágicos"],
    threatLevel: { name: "inexistente", color: "green" },
    image:
      "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop",
    humanComparison: "impotente",
    weaknesses: ["Ferro frio"],
    preys: [],
    predators: ["Corujas", "Serpentes"],
    mythologies: [],
    inspirations: "Fadas celtas e mitologia irlandesa",
  },
  {
    id: "4",
    name: "Basilisco Venenoso",
    alternativeNames: ["Rei das Serpentes"],
    race: "Serpentino",
    species: "Reptiliano",
    basicDescription:
      "Serpente gigante cujo olhar pode petrificar e cujo veneno é letal.",
    appearanceDescription: "Serpente de escamas verdes e olhos hipnóticos.",
    behaviors: "Solitário e agressivo, defende seu território ferozmente.",
    habit: "subterrâneo",
    habitat: ["Catacumbas", "Ruínas Antigas"],
    threatLevel: { name: "mortal", color: "orange" },
    image:
      "https://images.unsplash.com/photo-1516301617588-4c7a8b6c4a6e?w=400&h=300&fit=crop",
    humanComparison: "impossível de ganhar",
    weaknesses: ["Canto do galo", "Espelhos"],
    preys: ["Ratos gigantes", "Aventureiros"],
    predators: [],
    mythologies: [],
    inspirations: "Basilisco da mitologia grega e Harry Potter",
  },
];

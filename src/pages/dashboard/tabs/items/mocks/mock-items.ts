import { Item, mockRarities, mockStatuses } from "@/mocks/local/item-data";

export const MOCK_ITEMS: Item[] = [
  {
    id: "1",
    name: "Excalibur",
    image: "/placeholder.svg",
    alternativeNames: ["A Espada do Rei", "Caliburn"],
    basicDescription: "Lendária espada do Rei Arthur",
    appearanceDescription:
      "Uma espada de lâmina prateada com punho dourado ornamentado",
    category: "Arma",
    rarity: mockRarities[3],
    status: mockStatuses[1],
    origin: "Forjada por Merlim nas forjas celestiais",
    weaknesses: "Só pode ser empunhada por alguém puro de coração",
    powers: "Corta qualquer material, emite luz divina",
    mythology: [],
    inspirations: "Lenda Arturiana, mitologia celta",
  },
  {
    id: "2",
    name: "Poção de Cura Menor",
    image: "/placeholder.svg",
    alternativeNames: ["Elixir Básico"],
    basicDescription: "Poção que restaura ferimentos leves",
    appearanceDescription: "Líquido vermelho em frasco de vidro pequeno",
    category: "Consumível",
    rarity: mockRarities[0],
    status: mockStatuses[1],
    origin: "Alquimistas da Torre de Marfim",
    weaknesses: "Efeito limitado, não funciona em ferimentos mágicos",
    powers: "Regeneração acelerada de tecidos",
    mythology: [],
    inspirations: "RPGs clássicos, alquimia medieval",
  },
];

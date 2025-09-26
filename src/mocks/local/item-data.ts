export interface Rarity {
  id: string;
  name: string;
  color: string;
  icon: string;
}

export interface ItemStatus {
  id: string;
  name: string;
  icon: string;
}

export interface MythologyEntry {
  id: string;
  people: string;
  version: string;
}

export interface Item {
  id: string;
  name: string;
  image: string;
  alternativeNames: string[];
  basicDescription: string;
  appearanceDescription: string;
  category: string;
  rarity: Rarity;
  status: ItemStatus;
  origin: string;
  weaknesses: string;
  powers: string;
  mythology: MythologyEntry[];
  inspirations: string;
}

export const mockRarities: Rarity[] = [
  { id: "1", name: "Comum", color: "#6B7280", icon: "⚪" },
  { id: "2", name: "Incomum", color: "#10B981", icon: "🟢" },
  { id: "3", name: "Raro", color: "#3B82F6", icon: "🔵" },
  { id: "4", name: "Lendário", color: "#F59E0B", icon: "🟡" },
];

export const mockStatuses: ItemStatus[] = [
  { id: "1", name: "Destruído", icon: "💥" },
  { id: "2", name: "Completa", icon: "✨" },
  { id: "3", name: "Incompleta", icon: "🪓" },
  { id: "4", name: "Selada", icon: "🔒" },
  { id: "5", name: "Enfraquecida", icon: "⚡" },
];

export const mockItems: Record<string, Item> = {
  "1": {
    id: "1",
    name: "Excalibur",
    image: "/placeholder.svg",
    alternativeNames: ["A Espada do Rei", "Caliburn"],
    basicDescription: "Lendária espada do Rei Arthur",
    appearanceDescription:
      "Uma espada de lâmina prateada com punho dourado ornamentado, envolta em runas místicas que brilham quando empunhada por alguém digno.",
    category: "Arma",
    rarity: mockRarities[3],
    status: mockStatuses[1],
    origin: "Forjada por Merlim nas forjas celestiais usando metal estelar",
    weaknesses:
      "Só pode ser empunhada por alguém puro de coração. Perde seus poderes se usada para fins malévolos.",
    powers:
      "Corta qualquer material conhecido, emite luz divina que repele criaturas das trevas, concede proteção contra magia negra.",
    mythology: [
      {
        id: "1",
        people: "Bretões",
        version: "A espada sagrada dada pelos deuses ao rei escolhido",
      },
      {
        id: "2",
        people: "Saxões",
        version: "Uma arma demoníaca que corrompe quem a empunha",
      },
    ],
    inspirations:
      "Lenda Arturiana, mitologia celta, espadas lendárias japonesas",
  },
};

export const categories = [
  "Arma",
  "Armadura",
  "Consumível",
  "Recurso",
  "Artefato",
  "Relíquia",
  "Outro",
];

// Mock linked notes - could potentially be moved to global mocks if shared
export const mockLinkedNotes = [
  {
    id: "note-1",
    name: "Lendas sobre Excalibur",
    content:
      "Compilação das diferentes versões da lenda de Excalibur encontradas em diversos textos antigos...",
    createdAt: new Date("2024-01-12"),
    updatedAt: new Date("2024-01-18"),
    linkCreatedAt: new Date("2024-01-14"),
  },
];

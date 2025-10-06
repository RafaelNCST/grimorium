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

export interface ThreatLevel {
  name: string;
  color: string;
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
  threatLevel: ThreatLevel;
  image: string;
  humanComparison: string;
  weaknesses: string[];
  preys: string[];
  predators: string[];
  mythologies: string[];
  inspirations: string;
}

export const mockBeast: Beast = {
  id: "",
  name: "",
  alternativeNames: [],
  race: "",
  species: "",
  basicDescription: "",
  appearanceDescription: "",
  behaviors: "",
  habit: "diurno",
  habitat: [],
  threatLevel: { name: "baixo", color: "green" },
  image: "",
  humanComparison: "igual",
  weaknesses: [],
  preys: [],
  predators: [],
  mythologies: [],
  inspirations: "",
};

export const habits = ["diurno", "noturno", "crepuscular", "variável"];
export const humanComparisons = [
  "mais fraco",
  "igual",
  "mais forte",
  "impossível de ganhar",
];
export const threatLevels = [
  { name: "baixo", color: "green" },
  { name: "médio", color: "yellow" },
  { name: "alto", color: "orange" },
  { name: "apocalíptico", color: "red" },
];

export interface LinkedNote {
  id: string;
  title: string;
  type: string;
  date: string;
}

export const mockLinkedNotes: LinkedNote[] = [];

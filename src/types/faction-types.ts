export type FactionType =
  | "Militar"
  | "Comercial"
  | "Mágica"
  | "Religiosa"
  | "Culto"
  | "Governamental"
  | "Outros";

export type FactionAlignment = "Bem" | "Neutro" | "Caótico";

export type FactionInfluence =
  | "Inexistente"
  | "Baixa"
  | "Média"
  | "Alta"
  | "Dominante";

export interface IFactionTitle {
  id: string;
  name: string;
  description: string;
  level: number;
}

export interface IFactionMember {
  characterId: string;
  characterName: string;
  titleId: string;
  joinDate: string;
}

export interface IFaction {
  id: string;
  name: string;
  photo?: string;
  alignment: FactionAlignment;
  description: string;
  type: FactionType;
  influence: FactionInfluence;
  leaders: string[];
  objectives: string[];
  members: IFactionMember[];
  titles: IFactionTitle[];
  dominatedLocations: string[];
  dominatedContinents: string[];
  dominatedWorlds: string[];
  baseLocation?: string;
  world?: string;
  continent?: string;
}

export interface ILocation {
  id: string;
  name: string;
  type: string;
}

export interface IWorld {
  id: string;
  name: string;
  type: string;
}

export interface IContinent {
  id: string;
  name: string;
  type: string;
}

export interface ICharacter {
  id: string;
  name: string;
}

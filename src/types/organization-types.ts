export type OrganizationType =
  | "Militar"
  | "Comercial"
  | "Mágica"
  | "Religiosa"
  | "Culto"
  | "Governamental"
  | "Outros";

export type OrganizationAlignment = "Bem" | "Neutro" | "Caótico";

export type OrganizationInfluence =
  | "Inexistente"
  | "Baixa"
  | "Média"
  | "Alta"
  | "Dominante";

export interface IOrganizationTitle {
  id: string;
  name: string;
  description: string;
  level: number;
}

export interface IOrganizationMember {
  characterId: string;
  characterName: string;
  titleId: string;
  joinDate: string;
}

export interface IOrganization {
  id: string;
  name: string;
  photo?: string;
  alignment: OrganizationAlignment;
  description: string;
  type: OrganizationType;
  influence: OrganizationInfluence;
  leaders: string[];
  objectives: string[];
  members: IOrganizationMember[];
  titles: IOrganizationTitle[];
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

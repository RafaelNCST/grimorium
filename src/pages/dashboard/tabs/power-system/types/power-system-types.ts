export type ElementType = "section-card" | "details-card" | "visual-card" | "text-box";
export type ConnectionType = "arrow" | "line";

export interface IPowerElement {
  id: string;
  type: ElementType;
  x: number;
  y: number;
  width: number;
  height: number;
  title?: string;
  content?: string;
  imageUrl?: string;
  color: string;
  textColor: string;
  canOpenSubmap: boolean;
  showHover: boolean;
  compressed?: boolean;
  submapId?: string;
}

export interface IConnection {
  id: string;
  type: ConnectionType;
  fromId: string;
  toId: string;
  text?: string;
  color: string;
}

export interface IPowerMap {
  id: string;
  name: string;
  elements: IPowerElement[];
  connections: IConnection[];
  parentMapId?: string;
}

export interface ITemplate {
  id: string;
  name: string;
  map: Omit<IPowerMap, "id" | "name">;
}

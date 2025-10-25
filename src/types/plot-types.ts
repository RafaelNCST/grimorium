export type PlotArcSize = "mini" | "pequeno" | "médio" | "grande";

export type PlotArcStatus = "planejamento" | "atual" | "finalizado";

export interface IPlotEvent {
  id: string;
  name: string;
  description: string;
  completed: boolean;
  order: number;
}

export interface IPlotArc {
  id: string;
  name: string;
  size: PlotArcSize;
  focus: string;
  description: string;
  events: IPlotEvent[];
  progress: number;
  status: PlotArcStatus;
  order: number;
  importantCharacters: string[];
  importantFactions: string[];
  importantItems: string[];
  arcMessage?: string;
  worldImpact?: string;
}

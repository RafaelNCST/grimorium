export type PlotArcSize = "pequeno" | "médio" | "grande";

export type PlotArcStatus = "planejamento" | "andamento" | "finalizado";

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
}

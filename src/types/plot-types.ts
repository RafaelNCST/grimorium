export type PlotArcSize = "mini" | "small" | "medium" | "large";

export type PlotArcStatus = "planning" | "current" | "finished";

export interface IPlotEvent {
  id: string;
  name: string;
  description: string;
  completed: boolean;
  order: number;
}

export interface IPlotArcUIState {
  advancedSectionOpen?: boolean;
  eventChainSectionOpen?: boolean;
  sectionVisibility?: Record<string, boolean>; // Empty for now, for future use
  extraSectionsOpenState?: Record<string, boolean>;
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
  importantRegions: string[];
  arcMessage?: string;
  worldImpact?: string;
  fieldVisibility?: Record<string, boolean>; // DEPRECATED - to be removed

  // UI State (for persisting UI preferences)
  uiState?: IPlotArcUIState;
}

export interface IPlotArcFormData {
  name: string;
  description: string;
  status: string;
  size: string;
  focus: string;
  events: IPlotEvent[];
  importantCharacters?: string[];
  importantFactions?: string[];
  importantItems?: string[];
  importantRegions?: string[];
  arcMessage?: string;
  worldImpact?: string;
}

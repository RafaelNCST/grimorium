import { create } from "zustand";

interface TabConfig {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  visible: boolean;
  isDefault?: boolean;
}

interface PlotEvent {
  id: string;
  name: string;
  description: string;
  completed: boolean;
  order: number;
}

interface PlotArc {
  id: string;
  name: string;
  size: "pequeno" | "médio" | "grande";
  focus: string;
  description: string;
  events: PlotEvent[];
  progress: number;
  isCurrentArc: boolean;
}

interface DashboardState {
  activeTab: string;
  isEditingHeader: boolean;
  isHeaderHidden: boolean;
  isCustomizing: boolean;
  tabs: TabConfig[];
  arcs: PlotArc[];
  setActiveTab: (tab: string) => void;
  setIsEditingHeader: (editing: boolean) => void;
  setIsHeaderHidden: (hidden: boolean) => void;
  setIsCustomizing: (customizing: boolean) => void;
  updateTabs: (tabs: TabConfig[]) => void;
  toggleTabVisibility: (tabId: string) => void;
  updateArcs: (arcs: PlotArc[]) => void;
  getCurrentArc: () => PlotArc | undefined;
}

const initialArcs: PlotArc[] = [
  {
    id: "1",
    name: "A Ascensão do Herói",
    size: "grande",
    focus: "Desenvolvimento do protagonista",
    description:
      "O jovem pastor descobre seus poderes e aprende a controlá-los enquanto enfrenta os primeiros desafios.",
    progress: 65,
    isCurrentArc: true,
    events: [
      {
        id: "1",
        name: "Descoberta dos poderes",
        description: "O protagonista manifesta sua magia pela primeira vez",
        completed: true,
        order: 1,
      },
      {
        id: "2",
        name: "Encontro com o mentor",
        description: "Conhece o sábio que o guiará",
        completed: true,
        order: 2,
      },
      {
        id: "3",
        name: "Primeiro desafio",
        description: "Enfrenta seu primeiro inimigo real",
        completed: false,
        order: 3,
      },
    ],
  },
];

export const useDashboardStore = create<DashboardState>((set, get) => ({
  activeTab: "overview",
  isEditingHeader: false,
  isHeaderHidden: false,
  isCustomizing: false,
  tabs: [],
  arcs: initialArcs,
  setActiveTab: (tab) => set({ activeTab: tab }),
  setIsEditingHeader: (editing) => set({ isEditingHeader: editing }),
  setIsHeaderHidden: (hidden) => set({ isHeaderHidden: hidden }),
  setIsCustomizing: (customizing) => set({ isCustomizing: customizing }),
  updateTabs: (tabs) => set({ tabs }),
  toggleTabVisibility: (tabId) =>
    set((state) => ({
      tabs: state.tabs.map((tab) =>
        tab.id === tabId ? { ...tab, visible: !tab.visible } : tab
      ),
    })),
  updateArcs: (arcs) => set({ arcs }),
  getCurrentArc: () => {
    const { arcs } = get();
    return arcs.find((arc) => arc.isCurrentArc) || arcs[0];
  },
}));

import { useState } from "react";

import { useNavigate } from "@tanstack/react-router";

import { PlotView } from "./view";
import { useLanguageStore } from "@/stores/language-store";

interface IPlotArc {
  id: string;
  name: string;
  size: "pequeno" | "médio" | "grande";
  focus: string;
  description: string;
  events: IPlotEvent[];
  progress: number;
  status: "planejamento" | "andamento" | "finalizado";
  order: number;
}

interface IPlotEvent {
  id: string;
  name: string;
  description: string;
  completed: boolean;
  order: number;
}

// Mock data
const mockArcs: IPlotArc[] = [
  {
    id: "1",
    name: "A Ascensão do Herói",
    size: "grande",
    focus: "Desenvolvimento do protagonista",
    description:
      "O jovem pastor descobre seus poderes e aprende a controlá-los enquanto enfrenta os primeiros desafios.",
    progress: 65,
    status: "andamento",
    order: 1,
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
      {
        id: "4",
        name: "Revelação sobre o passado",
        description: "Descobre a verdade sobre sua origem",
        completed: false,
        order: 4,
      },
    ],
  },
  {
    id: "2",
    name: "A Guerra das Sombras",
    size: "grande",
    focus: "Conflito principal",
    description:
      "O protagonista lidera uma guerra contra as forças das trevas que ameaçam consumir o reino.",
    progress: 0,
    status: "planejamento",
    order: 2,
    events: [
      {
        id: "5",
        name: "Chamado à guerra",
        description: "O reino pede ajuda ao protagonista",
        completed: false,
        order: 1,
      },
      {
        id: "6",
        name: "Formação da aliança",
        description: "Reúne heróis para a batalha final",
        completed: false,
        order: 2,
      },
    ],
  },
  {
    id: "3",
    name: "O Preço da Vitória",
    size: "médio",
    focus: "Resolução e consequências",
    description:
      "As consequências da guerra e o estabelecimento de uma nova ordem.",
    progress: 100,
    status: "finalizado",
    order: 0,
    events: [],
  },
];

export function PlotTab() {
  const { t } = useLanguageStore();
  const navigate = useNavigate();
  const [arcs, setArcs] = useState<IPlotArc[]>(mockArcs);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("todos");

  // Status priority for sorting: andamento > planejamento > finalizado
  const getStatusPriority = (status: string) => {
    switch (status) {
      case "andamento":
        return 1;
      case "planejamento":
        return 2;
      case "finalizado":
        return 3;
      default:
        return 4;
    }
  };

  const getSizeColor = (size: string) => {
    switch (size) {
      case "pequeno":
        return "bg-blue-500/20 text-blue-400 border-blue-400/30";
      case "médio":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-400/30";
      case "grande":
        return "bg-red-500/20 text-red-400 border-red-400/30";
      default:
        return "bg-muted";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "finalizado":
        return "bg-green-500/20 text-green-400 border-green-400/30";
      case "andamento":
        return "bg-blue-500/20 text-blue-400 border-blue-400/30";
      case "planejamento":
        return "bg-orange-500/20 text-orange-400 border-orange-400/30";
      default:
        return "bg-muted";
    }
  };

  const createArc = (arcData: Omit<IPlotArc, "id" | "events" | "progress">) => {
    const newArc: IPlotArc = {
      ...arcData,
      id: Date.now().toString(),
      events: [],
      progress: 0,
    };

    setArcs((prev) => {
      // Adjust orders of existing arcs if needed
      const updatedArcs = prev.map((arc) => {
        if (arc.order >= newArc.order) {
          return { ...arc, order: arc.order + 1 };
        }
        return arc;
      });

      return [...updatedArcs, newArc].sort((a, b) => a.order - b.order);
    });
  };

  const moveArc = (arcId: string, direction: "up" | "down") => {
    setArcs((prev) => {
      const sortedArcs = [...prev].sort((a, b) => a.order - b.order);
      const arcIndex = sortedArcs.findIndex((arc) => arc.id === arcId);

      if (arcIndex === -1) return prev;

      const targetIndex = direction === "up" ? arcIndex - 1 : arcIndex + 1;

      if (targetIndex < 0 || targetIndex >= sortedArcs.length) return prev;

      // Swap orders
      const currentArc = sortedArcs[arcIndex];
      const targetArc = sortedArcs[targetIndex];

      return prev.map((arc) => {
        if (arc.id === currentArc.id) {
          return { ...arc, order: targetArc.order };
        }
        if (arc.id === targetArc.id) {
          return { ...arc, order: currentArc.order };
        }
        return arc;
      });
    });
  };

  // Sort arcs by status priority first, then by order
  const filteredAndSortedArcs = arcs
    .filter((arc) => statusFilter === "todos" || arc.status === statusFilter)
    .sort((a, b) => {
      // First sort by status priority
      const statusPriorityA = getStatusPriority(a.status);
      const statusPriorityB = getStatusPriority(b.status);

      if (statusPriorityA !== statusPriorityB) {
        return statusPriorityA - statusPriorityB;
      }

      // If same status, sort by order
      return a.order - b.order;
    });

  const getVisibleEvents = (events: IPlotEvent[]) => {
    const sortedEvents = events.sort((a, b) => a.order - b.order);
    const currentIndex = sortedEvents.findIndex((e) => !e.completed);

    if (currentIndex === -1) {
      // All completed, show last 3
      return sortedEvents.slice(-3);
    }

    // Show current + next 2
    return sortedEvents.slice(currentIndex, currentIndex + 3);
  };

  const handlePlotTimelineClick = () => {
    navigate({ to: "/plot-timeline" });
  };

  const handleArcClick = (arcId: string) => {
    navigate({ to: "/plot-arc/$id", params: { id: arcId } });
  };

  return (
    <PlotView
      arcs={arcs}
      showCreateModal={showCreateModal}
      statusFilter={statusFilter}
      filteredAndSortedArcs={filteredAndSortedArcs}
      getSizeColor={getSizeColor}
      getStatusColor={getStatusColor}
      getVisibleEvents={getVisibleEvents}
      onSetShowCreateModal={setShowCreateModal}
      onSetStatusFilter={setStatusFilter}
      onCreateArc={createArc}
      onMoveArc={moveArc}
      onPlotTimelineClick={handlePlotTimelineClick}
      onArcClick={handleArcClick}
    />
  );
}
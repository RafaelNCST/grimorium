import { useState, useCallback, useMemo, useEffect } from "react";

import { useNavigate, useParams } from "@tanstack/react-router";

import { getPlotArcsByBookId, reorderPlotArcs } from "@/lib/db/plot.service";
import type { IPlotArc } from "@/types/plot-types";

import { getSizeColor } from "../utils/get-size-color";
import { getStatusColor } from "../utils/get-status-color";

import { PlotTimelineView } from "./view";

export function PlotTimeline() {
  const { dashboardId } = useParams({
    from: "/dashboard/$dashboardId/tabs/plot/plot-timeline",
  });
  const navigate = useNavigate();
  const [arcs, setArcs] = useState<IPlotArc[]>([]);

  // Load arcs from database
  useEffect(() => {
    let mounted = true;

    const loadArcs = async () => {
      try {
        const loadedArcs = await getPlotArcsByBookId(dashboardId!);

        if (mounted) {
          setArcs(loadedArcs);
        }
        /* TEMPORARY: Mock arcs for testing - removed
        const mockArcs: IPlotArc[] = [
          {
            id: "mock-1",
            name: "A Jornada do Herói",
            description: "O protagonista embarca em uma jornada épica para descobrir suas verdadeiras origens e enfrentar seu destino.",
            status: "finalizado",
            size: "grande",
            focus: "Desenvolvimento do protagonista e descoberta de suas origens",
            progress: 100,
            order: 1,
            events: [],
            bookId: dashboardId!,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: "mock-2",
            name: "A Ascensão do Império",
            description: "O império das sombras começa sua expansão através dos reinos, conquistando território após território.",
            status: "finalizado",
            size: "médio",
            focus: "Expansão territorial e consolidação do poder imperial",
            progress: 100,
            order: 2,
            events: [],
            bookId: dashboardId!,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: "mock-3",
            name: "O Despertar da Magia",
            description: "Antigos poderes mágicos começam a ressurgir no mundo, trazendo esperança e perigo em igual medida.",
            status: "atual",
            size: "grande",
            focus: "Retorno da magia ao mundo e suas consequências",
            progress: 65,
            order: 3,
            events: [],
            bookId: dashboardId!,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: "mock-4",
            name: "A Aliança Improvável",
            description: "Antigos inimigos devem se unir para enfrentar uma ameaça maior que qualquer reino individual.",
            status: "planejamento",
            size: "pequeno",
            focus: "Formação de alianças estratégicas",
            progress: 0,
            order: 4,
            events: [],
            bookId: dashboardId!,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: "mock-5",
            name: "Segredos Ancestrais",
            description: "Manuscritos perdidos revelam verdades ocultas sobre a criação do mundo e o destino de seus habitantes.",
            status: "planejamento",
            size: "mini",
            focus: "Descoberta de conhecimentos perdidos",
            progress: 0,
            order: 5,
            events: [],
            bookId: dashboardId!,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: "mock-6",
            name: "A Guerra dos Dragões",
            description: "Dragões ancestrais despertam de seu sono milenar, disputando domínio sobre os céus e a terra.",
            status: "planejamento",
            size: "grande",
            focus: "Conflito entre dragões e impacto nos reinos mortais",
            progress: 0,
            order: 6,
            events: [],
            bookId: dashboardId!,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: "mock-7",
            name: "O Retorno do Rei",
            description: "O legítimo herdeiro ao trono retorna de seu exílio para reclamar seu direito de nascença.",
            status: "planejamento",
            size: "médio",
            focus: "Reconquista do trono e restauração da monarquia",
            progress: 0,
            order: 7,
            events: [],
            bookId: dashboardId!,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: "mock-8",
            name: "O Crepúsculo dos Deuses",
            description: "As divindades começam a perder seu poder enquanto uma nova era de mortalidade se aproxima.",
            status: "planejamento",
            size: "grande",
            focus: "Declínio do poder divino e ascensão da humanidade",
            progress: 0,
            order: 8,
            events: [],
            bookId: dashboardId!,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: "mock-9",
            name: "A Traição Inesperada",
            description: "Um aliado de confiança revela ser um traidor, mudando completamente o curso da guerra.",
            status: "planejamento",
            size: "pequeno",
            focus: "Consequências da traição e reformulação de estratégias",
            progress: 0,
            order: 9,
            events: [],
            bookId: dashboardId!,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: "mock-10",
            name: "O Confronto Final",
            description: "Todas as forças convergem para a batalha decisiva que determinará o destino de todos os reinos.",
            status: "planejamento",
            size: "grande",
            focus: "Batalha final e resolução de todos os conflitos principais",
            progress: 0,
            order: 10,
            events: [],
            bookId: dashboardId!,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ];
        */
      } catch (error) {
        console.error("Failed to load plot arcs:", error);
      }
    };

    if (dashboardId) {
      loadArcs();
    }

    return () => {
      mounted = false;
    };
  }, [dashboardId]);

  const sortedArcs = useMemo(
    () => [...arcs].sort((a, b) => a.order - b.order),
    [arcs]
  );

  const handleBack = useCallback(() => {
    navigate({
      to: "/dashboard/$dashboardId",
      params: { dashboardId: dashboardId! },
    });
  }, [navigate, dashboardId]);

  const handleArcClick = useCallback(
    (arcId: string) => {
      navigate({
        to: "/dashboard/$dashboardId/tabs/plot/$plotId",
        params: { dashboardId: dashboardId!, plotId: arcId },
      });
    },
    [navigate, dashboardId]
  );

  const handleReorderArcs = useCallback(async (reorderedArcs: IPlotArc[]) => {
    const updatedArcs = reorderedArcs.map((arc, index) => ({
      ...arc,
      order: index + 1,
    }));

    try {
      await reorderPlotArcs(
        updatedArcs.map((arc) => ({ id: arc.id, order: arc.order }))
      );
      setArcs(updatedArcs);
    } catch (error) {
      console.error("Failed to reorder plot arcs:", error);
    }
  }, []);

  return (
    <PlotTimelineView
      sortedArcs={sortedArcs}
      onBack={handleBack}
      onArcClick={handleArcClick}
      onReorderArcs={handleReorderArcs}
      getSizeColor={getSizeColor}
      getStatusColor={getStatusColor}
    />
  );
}

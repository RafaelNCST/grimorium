import type { IPlotArc } from "@/types/plot-types";

export const MOCK_PLOT_ARCS: IPlotArc[] = [
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
    events: [
      {
        id: "7",
        name: "Reconstrução do reino",
        description: "Início da reconstrução",
        completed: true,
        order: 1,
      },
      {
        id: "8",
        name: "Nova liderança",
        description: "Estabelecimento de nova ordem",
        completed: true,
        order: 2,
      },
    ],
  },
];

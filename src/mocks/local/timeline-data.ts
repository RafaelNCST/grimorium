export interface ITimelineEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  character: string;
  eventType:
    | "creation"
    | "ownership"
    | "lost"
    | "found"
    | "destroyed"
    | "modified"
    | "other";
}

export const mockTimelineEvents: ITimelineEvent[] = [
  {
    id: "1",
    title: "Forjado por Merlim",
    description:
      "A espada foi forjada nas forjas celestiais usando metal de origem estelar, imbuída com magias ancestrais.",
    date: "Era dos Deuses",
    location: "Forjas Celestiais",
    character: "Merlim, o Mago",
    eventType: "creation",
  },
  {
    id: "2",
    title: "Entregue ao Rei Arthur",
    description:
      "Merlim entrega Excalibur ao jovem Arthur após ele provar ser o rei legítimo retirando a espada da pedra.",
    date: "Primeiro Ano do Reino de Camelot",
    location: "Camelot",
    character: "Rei Arthur",
    eventType: "ownership",
  },
  {
    id: "3",
    title: "Batalha contra Mordred",
    description:
      "Durante a batalha final contra Mordred, Excalibur foi danificada mas não quebrada. Suas runas perderam parte do brilho.",
    date: "Último Ano do Reino de Camelot",
    location: "Campo de Batalha de Camlann",
    character: "Rei Arthur",
    eventType: "modified",
  },
  {
    id: "4",
    title: "Devolvida ao Lago",
    description:
      "Antes de morrer, Arthur ordena que Sir Bedivere devolva Excalibur à Senhora do Lago.",
    date: "Fim do Reino de Camelot",
    location: "Lago Sagrado",
    character: "Sir Bedivere",
    eventType: "lost",
  },
];

export const eventTypeIcons = {
  creation: "⚒️",
  ownership: "👑",
  lost: "🌊",
  found: "🔍",
  destroyed: "💥",
  modified: "🔧",
  other: "📜",
};

export const eventTypeNames = {
  creation: "Criação",
  ownership: "Mudança de Posse",
  lost: "Perdido",
  found: "Encontrado",
  destroyed: "Destruído",
  modified: "Modificado",
  other: "Outro",
};

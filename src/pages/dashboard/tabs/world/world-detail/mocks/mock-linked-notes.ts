import { ILinkedNote } from "../types/world-detail-types";

export const MOCK_LINKED_NOTES: ILinkedNote[] = [
  {
    id: "note-1",
    name: "História Antiga de Aethermoor",
    content:
      "Detalhes sobre a fundação do mundo e os eventos que moldaram sua história ao longo dos milênios...",
    createdAt: new Date("2024-01-05"),
    updatedAt: new Date("2024-01-10"),
    linkCreatedAt: new Date("2024-01-07"),
  },
  {
    id: "note-2",
    name: "Geografia e Clima",
    content:
      "Análise detalhada dos biomas, sistemas climáticos e características geográficas do mundo...",
    createdAt: new Date("2024-01-08"),
    updatedAt: new Date("2024-01-12"),
    linkCreatedAt: new Date("2024-01-09"),
  },
];

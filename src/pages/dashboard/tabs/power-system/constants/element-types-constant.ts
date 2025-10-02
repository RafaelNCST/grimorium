import { ElementType } from "../types/power-system-types";

interface IElementTypeInfo {
  type: ElementType;
  name: string;
  description: string;
}

export const ELEMENT_TYPES_CONSTANT: IElementTypeInfo[] = [
  {
    type: "section-card",
    name: "Card de Seção",
    description: "Para seções principais do sistema",
  },
  {
    type: "details-card",
    name: "Card de Detalhes",
    description: "Cria submapas navegáveis",
  },
  {
    type: "visual-card",
    name: "Card Visual",
    description: "Focado em representações visuais",
  },
  {
    type: "text-box",
    name: "Caixa de Texto",
    description: "Anotações e descrições livres",
  },
];

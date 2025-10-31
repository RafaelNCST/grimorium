import { ShapeType } from "../types/power-system-types";

export interface IShapeInfo {
  type: ShapeType;
  label: string;
  icon: string;
}

export const SHAPES_CONSTANT: IShapeInfo[] = [
  {
    type: "circle",
    label: "shape_circle",
    icon: "●",
  },
  {
    type: "square",
    label: "shape_square",
    icon: "■",
  },
  {
    type: "rounded-square",
    label: "shape_rounded_square",
    icon: "▢",
  },
  {
    type: "triangle",
    label: "shape_triangle",
    icon: "▲",
  },
  {
    type: "diamond",
    label: "shape_diamond",
    icon: "◆",
  },
] as const;

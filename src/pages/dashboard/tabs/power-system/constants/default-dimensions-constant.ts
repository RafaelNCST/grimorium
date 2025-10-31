import { ElementType } from "../types/power-system-types";

export const DEFAULT_ELEMENT_DIMENSIONS: Record<
  ElementType,
  { width: number; height: number }
> = {
  "paragraph-block": { width: 800, height: 200 },
  "section-block": { width: 800, height: 240 },
  "image-block": { width: 800, height: 400 },
  "visual-section": { width: 150, height: 150 },
  text: { width: 16, height: 24 },
} as const;

export const GRID_CONFIG = {
  size: 20, // pixels
  color: "hsl(var(--border))",
  opacity: 0.2,
} as const;

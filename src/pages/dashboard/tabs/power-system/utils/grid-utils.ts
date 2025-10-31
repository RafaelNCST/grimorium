import { GRID_CONFIG } from "../constants/default-dimensions-constant";

/**
 * Snaps a coordinate to the nearest grid point
 */
export function snapToGrid(
  value: number,
  gridSize: number = GRID_CONFIG.size
): number {
  return Math.round(value / gridSize) * gridSize;
}

/**
 * Snaps a position object to the grid
 */
export function snapPositionToGrid(
  position: { x: number; y: number },
  gridEnabled: boolean,
  gridSize: number = GRID_CONFIG.size
): { x: number; y: number } {
  if (!gridEnabled) {
    return position;
  }

  return {
    x: snapToGrid(position.x, gridSize),
    y: snapToGrid(position.y, gridSize),
  };
}

/**
 * Calculates the grid-snapped position for a dragged element
 */
export function calculateGridSnappedPosition(
  currentX: number,
  currentY: number,
  deltaX: number,
  deltaY: number,
  gridEnabled: boolean,
  gridSize: number = GRID_CONFIG.size
): { x: number; y: number } {
  const newX = currentX + deltaX;
  const newY = currentY + deltaY;

  return snapPositionToGrid({ x: newX, y: newY }, gridEnabled, gridSize);
}

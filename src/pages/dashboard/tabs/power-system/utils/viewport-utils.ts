export interface Viewport {
  x: number;
  y: number;
  width: number;
  height: number;
  zoom: number;
}

/**
 * Checks if an element is visible in the current viewport
 * @param element - Element with position and dimensions
 * @param viewport - Current viewport state
 * @returns true if element is visible (or near visible area)
 */
export function isElementInViewport(
  element: { x: number; y: number; width: number; height: number },
  viewport: Viewport
): boolean {
  // Add buffer to render elements slightly outside viewport
  // This prevents pop-in when panning/zooming
  const buffer = 200;

  // Calculate viewport bounds in canvas space
  const viewLeft = -viewport.x / viewport.zoom - buffer;
  const viewTop = -viewport.y / viewport.zoom - buffer;
  const viewRight = viewLeft + viewport.width / viewport.zoom + buffer * 2;
  const viewBottom = viewTop + viewport.height / viewport.zoom + buffer * 2;

  // Calculate element bounds
  const elementRight = element.x + element.width;
  const elementBottom = element.y + element.height;

  // Check if element intersects with viewport
  return !(
    element.x > viewRight ||
    elementRight < viewLeft ||
    element.y > viewBottom ||
    elementBottom < viewTop
  );
}

/**
 * Checks if a connection should be rendered based on its connected elements
 * @param connection - Connection object
 * @param elements - All elements in the map
 * @param viewport - Current viewport state
 * @returns true if connection should be rendered
 */
export function isConnectionInViewport(
  connection: {
    fromElementId: string;
    toElementId?: string;
    toX?: number;
    toY?: number;
  },
  elements: Array<{ id: string; x: number; y: number; width: number; height: number }>,
  viewport: Viewport
): boolean {
  // Find source element
  const fromElement = elements.find((el) => el.id === connection.fromElementId);
  if (!fromElement) return false;

  // If source element is not in viewport, don't render connection
  if (!isElementInViewport(fromElement, viewport)) {
    return false;
  }

  // For connections to specific elements, check if target is in viewport
  if (connection.toElementId) {
    const toElement = elements.find((el) => el.id === connection.toElementId);
    if (!toElement) return false;

    // Render if either source or target is in viewport
    return isElementInViewport(fromElement, viewport) || isElementInViewport(toElement, viewport);
  }

  // For arrow connections to coordinates, check if endpoint is in viewport
  if (connection.toX !== undefined && connection.toY !== undefined) {
    const buffer = 200;
    const viewLeft = -viewport.x / viewport.zoom - buffer;
    const viewTop = -viewport.y / viewport.zoom - buffer;
    const viewRight = viewLeft + viewport.width / viewport.zoom + buffer * 2;
    const viewBottom = viewTop + viewport.height / viewport.zoom + buffer * 2;

    return (
      connection.toX >= viewLeft &&
      connection.toX <= viewRight &&
      connection.toY >= viewTop &&
      connection.toY <= viewBottom
    );
  }

  // Fallback: render the connection
  return true;
}

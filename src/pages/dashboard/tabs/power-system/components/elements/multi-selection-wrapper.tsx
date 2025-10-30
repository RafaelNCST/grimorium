interface PropsMultiSelectionWrapper {
  elements: Array<{
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
  }>;
  isVisible: boolean;
  dragPositions?: Record<string, { x: number; y: number }>;
}

/**
 * MultiSelectionWrapper - Wrapper para múltipla seleção
 * Envolve todos os elementos selecionados com um único wrapper grande
 * Linha fina roxa que delimita a área de múltipla seleção
 */
export function MultiSelectionWrapper({
  elements,
  isVisible,
  dragPositions,
}: PropsMultiSelectionWrapper) {
  if (!isVisible || elements.length === 0) return null;

  // Calculate bounding box for all selected elements, using dragPositions if available
  const minX = Math.min(...elements.map((el) => {
    const pos = dragPositions?.[el.id];
    return pos ? pos.x : el.x;
  }));
  const minY = Math.min(...elements.map((el) => {
    const pos = dragPositions?.[el.id];
    return pos ? pos.y : el.y;
  }));
  const maxX = Math.max(...elements.map((el) => {
    const pos = dragPositions?.[el.id];
    return (pos ? pos.x : el.x) + el.width;
  }));
  const maxY = Math.max(...elements.map((el) => {
    const pos = dragPositions?.[el.id];
    return (pos ? pos.y : el.y) + el.height;
  }));

  const x = minX;
  const y = minY;
  const width = maxX - minX;
  const height = maxY - minY;

  // Add padding around the selection box
  const padding = 8;

  return (
    <div
      className="absolute pointer-events-none"
      style={{
        left: `${x - padding}px`,
        top: `${y - padding}px`,
        width: `${width + padding * 2}px`,
        height: `${height + padding * 2}px`,
        zIndex: 98, // Below single selection wrapper
        // Performance optimizations
        willChange: 'left, top, width, height',
        transform: 'translateZ(0)',
        backfaceVisibility: 'hidden',
      }}
    >
      {/* Dashed outline wrapper for multi-selection */}
      <div
        className="absolute inset-0"
        style={{
          border: '2px dashed hsl(var(--primary))',
          borderRadius: '0.5rem',
          // Subtle background to show selection area
          backgroundColor: 'hsla(var(--primary), 0.05)',
        }}
      />
    </div>
  );
}

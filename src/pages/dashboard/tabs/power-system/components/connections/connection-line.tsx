import { IConnection, IPowerElement } from "../../types/power-system-types";

interface PropsConnectionLine {
  connection: IConnection;
  elements: IPowerElement[];
  isSelected: boolean;
  onClick: () => void;
  onArrowHandleMouseDown?: (e: React.MouseEvent) => void;
  onMidpointHandleMouseDown?: (e: React.MouseEvent) => void;
  tempPositions?: { x1: number; y1: number; x2: number; y2: number };
}

export function ConnectionLine({
  connection,
  elements,
  isSelected,
  onClick,
  onArrowHandleMouseDown,
  onMidpointHandleMouseDown,
  tempPositions,
}: PropsConnectionLine) {
  const fromElement = elements.find((el) => el.id === connection.fromElementId);

  if (!fromElement) return null;

  // Use tempPositions if available (during drag/resize), otherwise calculate normally
  let startX: number;
  let startY: number;
  let endX: number;
  let endY: number;

  if (tempPositions) {
    // Use temporary positions during drag/resize
    startX = tempPositions.x1;
    startY = tempPositions.y1;
    endX = tempPositions.x2;
    endY = tempPositions.y2;
  } else {
    // Calculate normal positions
    startX = fromElement.x + fromElement.width / 2;
    startY = fromElement.y + fromElement.height / 2;

    if (
      connection.type === "arrow" &&
      connection.toX !== undefined &&
      connection.toY !== undefined
    ) {
      // Arrow: free-form endpoint
      endX = connection.toX;
      endY = connection.toY;
    } else if (connection.type === "line" && connection.toElementId) {
      // Line: connected to another element
      const toElement = elements.find((el) => el.id === connection.toElementId);
      if (!toElement) return null;
      endX = toElement.x + toElement.width / 2;
      endY = toElement.y + toElement.height / 2;
    } else {
      return null;
    }
  }

  // Calculate midpoint position (use connection.midpoint if exists, otherwise geometric center)
  const hasMidpoint = connection.midpoint && connection.midpoint.x !== undefined && connection.midpoint.y !== undefined;
  const midX = hasMidpoint ? connection.midpoint!.x : (startX + endX) / 2;
  const midY = hasMidpoint ? connection.midpoint!.y : (startY + endY) / 2;

  // Calculate angle for arrow head (use last segment if midpoint exists)
  const angle = hasMidpoint
    ? Math.atan2(endY - midY, endX - midX)
    : Math.atan2(endY - startY, endX - startX);

  const arrowLength = 12;
  const arrowAngle = Math.PI / 6;

  // Arrow head points
  const arrowPoint1X = endX - arrowLength * Math.cos(angle - arrowAngle);
  const arrowPoint1Y = endY - arrowLength * Math.sin(angle - arrowAngle);
  const arrowPoint2X = endX - arrowLength * Math.cos(angle + arrowAngle);
  const arrowPoint2Y = endY - arrowLength * Math.sin(angle + arrowAngle);

  // Shorten line to stop before arrow (so line doesn't pass through arrow)
  const lineOffset = 10; // Distance to pull back the line
  const lineEndX = endX - lineOffset * Math.cos(angle);
  const lineEndY = endY - lineOffset * Math.sin(angle);

  // Calculate label position (always at geometric midpoint)
  const labelX = (startX + endX) / 2;
  const labelY = (startY + endY) / 2;

  return (
    <g onClick={onClick} className="cursor-pointer">
      {/* Main line - render 2 segments if midpoint exists */}
      {hasMidpoint ? (
        <>
          {/* Segment 1: start to midpoint */}
          <line
            x1={startX}
            y1={startY}
            x2={midX}
            y2={midY}
            stroke={connection.color}
            strokeWidth={connection.strokeWidth}
            strokeLinecap="round"
            className={`transition-all ${isSelected ? "stroke-primary" : ""}`}
          />
          {/* Segment 2: midpoint to end */}
          <line
            x1={midX}
            y1={midY}
            x2={lineEndX}
            y2={lineEndY}
            stroke={connection.color}
            strokeWidth={connection.strokeWidth}
            strokeLinecap="round"
            className={`transition-all ${isSelected ? "stroke-primary" : ""}`}
          />
        </>
      ) : (
        /* Single straight line when no midpoint */
        <line
          x1={startX}
          y1={startY}
          x2={lineEndX}
          y2={lineEndY}
          stroke={connection.color}
          strokeWidth={connection.strokeWidth}
          strokeLinecap="round"
          className={`transition-all ${isSelected ? "stroke-primary" : ""}`}
        />
      )}

      {/* Arrow head (for both types) */}
      <polygon
        points={`${endX},${endY} ${arrowPoint1X},${arrowPoint1Y} ${arrowPoint2X},${arrowPoint2Y}`}
        fill={connection.color}
        className={isSelected ? "fill-primary" : ""}
      />

      {/* Selection indicator */}
      {isSelected && (
        <>
          {hasMidpoint ? (
            <>
              {/* Segment 1 selection */}
              <line
                x1={startX}
                y1={startY}
                x2={midX}
                y2={midY}
                stroke="hsl(var(--primary))"
                strokeWidth={connection.strokeWidth + 6}
                strokeLinecap="round"
                opacity={0.3}
                pointerEvents="none"
              />
              {/* Segment 2 selection */}
              <line
                x1={midX}
                y1={midY}
                x2={lineEndX}
                y2={lineEndY}
                stroke="hsl(var(--primary))"
                strokeWidth={connection.strokeWidth + 6}
                strokeLinecap="round"
                opacity={0.3}
                pointerEvents="none"
              />
            </>
          ) : (
            <line
              x1={startX}
              y1={startY}
              x2={lineEndX}
              y2={lineEndY}
              stroke="hsl(var(--primary))"
              strokeWidth={connection.strokeWidth + 6}
              strokeLinecap="round"
              opacity={0.3}
              pointerEvents="none"
            />
          )}
        </>
      )}

      {/* Label */}
      {connection.label && (
        <g>
          <rect
            x={labelX - 30}
            y={labelY - 10}
            width={60}
            height={20}
            fill="hsl(var(--background))"
            stroke={connection.color}
            strokeWidth={1}
            rx={4}
          />
          <text
            x={labelX}
            y={labelY + 5}
            textAnchor="middle"
            fontSize={12}
            fill="hsl(var(--foreground))"
          >
            {connection.label}
          </text>
        </g>
      )}

      {/* Interactive hit area (wider than visible line) */}
      {hasMidpoint ? (
        <>
          {/* Segment 1 hit area */}
          <line
            x1={startX}
            y1={startY}
            x2={midX}
            y2={midY}
            stroke="transparent"
            strokeWidth={Math.max(connection.strokeWidth + 10, 20)}
            strokeLinecap="round"
            className="hover:stroke-primary/20"
          />
          {/* Segment 2 hit area */}
          <line
            x1={midX}
            y1={midY}
            x2={lineEndX}
            y2={lineEndY}
            stroke="transparent"
            strokeWidth={Math.max(connection.strokeWidth + 10, 20)}
            strokeLinecap="round"
            className="hover:stroke-primary/20"
          />
        </>
      ) : (
        <line
          x1={startX}
          y1={startY}
          x2={lineEndX}
          y2={lineEndY}
          stroke="transparent"
          strokeWidth={Math.max(connection.strokeWidth + 10, 20)}
          strokeLinecap="round"
          className="hover:stroke-primary/20"
        />
      )}

      {/* Draggable handle for midpoint (for both arrow and line when selected) */}
      {isSelected && onMidpointHandleMouseDown && (
        <g>
          {/* Invisible larger circle for better click area */}
          <circle
            cx={midX}
            cy={midY}
            r={12}
            fill="transparent"
            className="cursor-move"
            onMouseDown={(e) => {
              e.stopPropagation();
              onMidpointHandleMouseDown(e);
            }}
          />
          {/* Visible smaller circle for visual feedback */}
          <circle
            cx={midX}
            cy={midY}
            r={5}
            fill="hsl(var(--primary))"
            stroke="hsl(var(--background))"
            strokeWidth={2}
            className="cursor-move pointer-events-none"
          />
        </g>
      )}

      {/* Draggable handle for arrow head (only for arrows when selected) */}
      {connection.type === "arrow" && isSelected && onArrowHandleMouseDown && (
        <g>
          {/* Invisible larger circle for better click area */}
          <circle
            cx={endX}
            cy={endY}
            r={12}
            fill="transparent"
            className="cursor-move"
            onMouseDown={(e) => {
              e.stopPropagation();
              onArrowHandleMouseDown(e);
            }}
          />
          {/* Visible smaller circle for visual feedback */}
          <circle
            cx={endX}
            cy={endY}
            r={5}
            fill="hsl(var(--primary))"
            stroke="hsl(var(--background))"
            strokeWidth={2}
            className="cursor-move pointer-events-none"
          />
        </g>
      )}
    </g>
  );
}

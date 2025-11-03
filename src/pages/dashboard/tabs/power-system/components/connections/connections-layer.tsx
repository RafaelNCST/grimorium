import { memo } from "react";

import { IConnection, IPowerElement } from "../../types/power-system-types";

import { ConnectionLine } from "./connection-line";

interface PropsConnectionsLayer {
  connections: IConnection[];
  elements: IPowerElement[];
  selectedConnectionId: string | null;
  onConnectionClick: (connectionId: string) => void;
  onArrowHandleDragStart: (connectionId: string, e: React.MouseEvent) => void;
  onMidpointHandleDragStart: (connectionId: string, e: React.MouseEvent) => void;
  connectionDraft?: {
    fromElementId: string;
    currentX: number;
    currentY: number;
  } | null;
  tempConnectionPositions?: Record<
    string,
    { x1: number; y1: number; x2: number; y2: number }
  >;
}

export const ConnectionsLayer = memo(
  ({
    connections,
    elements,
    selectedConnectionId,
    onConnectionClick,
    onArrowHandleDragStart,
    onMidpointHandleDragStart,
    connectionDraft,
    tempConnectionPositions,
  }: PropsConnectionsLayer) => {
    if (connections.length === 0 && !connectionDraft) return null;

    // Find from element for draft connection
    const draftFromElement = connectionDraft
      ? elements.find((el) => el.id === connectionDraft.fromElementId)
      : null;

    return (
      <svg
        className="absolute inset-0 pointer-events-none"
        style={{
          width: "100%",
          height: "100%",
          overflow: "visible",
        }}
      >
        <g className="pointer-events-auto">
          {connections.map((connection) => (
            <ConnectionLine
              key={connection.id}
              connection={connection}
              elements={elements}
              isSelected={selectedConnectionId === connection.id}
              onClick={() => onConnectionClick(connection.id)}
              onArrowHandleMouseDown={(e) =>
                onArrowHandleDragStart(connection.id, e)
              }
              onMidpointHandleMouseDown={(e) =>
                onMidpointHandleDragStart(connection.id, e)
              }
              tempPositions={tempConnectionPositions?.[connection.id]}
            />
          ))}

          {/* Draft connection line during creation */}
          {connectionDraft && draftFromElement && (
            <g className="pointer-events-none">
              <line
                x1={draftFromElement.x + draftFromElement.width / 2}
                y1={draftFromElement.y + draftFromElement.height / 2}
                x2={connectionDraft.currentX}
                y2={connectionDraft.currentY}
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                strokeDasharray="5,5"
                strokeLinecap="round"
                opacity={0.7}
              />
              {/* Circle at the starting point */}
              <circle
                cx={draftFromElement.x + draftFromElement.width / 2}
                cy={draftFromElement.y + draftFromElement.height / 2}
                r={4}
                fill="hsl(var(--primary))"
                opacity={0.7}
              />
              {/* Circle at the cursor */}
              <circle
                cx={connectionDraft.currentX}
                cy={connectionDraft.currentY}
                r={4}
                fill="hsl(var(--primary))"
                opacity={0.7}
              />
            </g>
          )}
        </g>
      </svg>
    );
  }
);

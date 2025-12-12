import { MapPin } from "lucide-react";

import { cn } from "@/lib/utils";

import { IRegion } from "../../types/region-types";

interface MapMarkerProps {
  region: IRegion;
  x: number;
  y: number;
  color?: string;
  showLabel?: boolean;
  isSelected?: boolean;
  isDraggable?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  onDragStart?: (e: React.DragEvent) => void;
  onDragEnd?: (e: React.DragEvent) => void;
  onMouseDown?: (e: React.MouseEvent) => void;
  markerScale?: number; // Custom marker scale from database
  zoomScale?: number; // Current zoom scale of the canvas
  style?: React.CSSProperties;
  onResize?: (newScale: number) => void;
}

export function MapMarker({
  region,
  x,
  y,
  color = "#8b5cf6",
  showLabel = true,
  isSelected = false,
  isDraggable: _isDraggable = false,
  onClick,
  onDragStart: _onDragStart,
  onDragEnd: _onDragEnd,
  onMouseDown,
  markerScale = 1,
  zoomScale = 1,
  style,
  onResize,
}: MapMarkerProps) {
  // Base marker size
  const baseMarkerSize = 32;
  const basePinSize = 20;
  const baseFontSize = 12;

  // Apply both custom scale and inverse zoom scale to maintain consistent visual size
  const markerSize = (baseMarkerSize * markerScale) / zoomScale;
  const pinSize = (basePinSize * markerScale) / zoomScale;
  const fontSize = (baseFontSize * markerScale) / zoomScale;

  // Calculate label dimensions for wrapper sizing
  const labelPaddingX = 8 / zoomScale; // px-2 = 8px horizontal padding
  const labelPaddingY = 4 / zoomScale; // py-1 = 4px vertical padding
  const labelSpacing = showLabel ? 4 / zoomScale : 0; // mt-1 equivalent
  const borderWidth = 1 / zoomScale; // border width
  const borderRadius = 6 / zoomScale; // rounded-md equivalent

  // Estimate label width based on text length and font size
  // Average character width - using 0.6 for balanced fit
  const estimatedLabelWidth = showLabel
    ? region.name.length * fontSize * 0.6 + labelPaddingX * 2 + borderWidth * 2
    : 0;

  const labelHeight = showLabel
    ? fontSize + labelPaddingY * 2 + borderWidth * 2 + 2 / zoomScale // font size + padding + borders + extra space
    : 0;

  // Selection wrapper size (includes marker and label if shown)
  // Adaptive padding: increase when element is small (high zoom out)
  const isSmall = markerSize < 20; // Element is small when zoomed out
  const basePaddingX = isSmall ? 6 : 2;
  const basePaddingTop = isSmall ? 8 : 4;
  const basePaddingBottom = isSmall ? 12 : 8;

  const wrapperPaddingX = basePaddingX / zoomScale; // Horizontal padding
  const wrapperPaddingTop = basePaddingTop / zoomScale; // Top padding
  const wrapperPaddingBottom = basePaddingBottom / zoomScale; // Bottom padding

  const wrapperWidth =
    Math.max(markerSize, estimatedLabelWidth) + wrapperPaddingX * 2;
  const wrapperHeight =
    markerSize + labelSpacing + labelHeight + wrapperPaddingTop + wrapperPaddingBottom;

  // Handle size for resize corners
  const handleSize = 8 / zoomScale;

  // Wrapper positioning to center it
  const wrapperLeft = -(wrapperWidth / 2) + markerSize / 2;

  return (
    <div
      data-marker="true"
      className={cn("absolute transition-none", isSelected && "z-50")}
      style={{
        left: `${x}px`,
        top: `${y}px`,
        transform: `translate(-50%, -100%)`,
        width: `${markerSize}px`,
        height: `${markerSize}px`,
        ...style,
      }}
      onClick={(e) => onClick?.(e)}
      onMouseDown={onMouseDown}
      draggable={false}
    >
      {/* Expanded clickable area when selected - invisible but captures events */}
      {isSelected && (
        <div
          className="absolute pointer-events-auto"
          style={{
            left: `${wrapperLeft}px`,
            top: `${-wrapperPaddingTop}px`,
            width: `${wrapperWidth}px`,
            height: `${wrapperHeight}px`,
          }}
        />
      )}

      {/* Selection wrapper - shown when selected */}
      {isSelected && (
        <div
          className="absolute border-2 border-white pointer-events-none"
          style={{
            left: `${wrapperLeft}px`,
            top: `${-wrapperPaddingTop}px`,
            width: `${wrapperWidth}px`,
            height: `${wrapperHeight}px`,
          }}
        />
      )}

      <div className="relative">
        <div
          className="rounded-full flex items-center justify-center shadow-lg transition-colors"
          style={{
            width: `${markerSize}px`,
            height: `${markerSize}px`,
            backgroundColor: color,
          }}
        >
          <MapPin
            className={cn(color === "#ffffff" ? "text-black" : "text-white")}
            style={{
              width: `${pinSize}px`,
              height: `${pinSize}px`,
            }}
          />
        </div>

        {/* Region name label */}
        {showLabel && (
          <div
            className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap bg-background/95 backdrop-blur-sm shadow-lg pointer-events-none"
            style={{
              fontSize: `${fontSize}px`,
              marginTop: `${labelSpacing}px`,
              paddingLeft: `${labelPaddingX}px`,
              paddingRight: `${labelPaddingX}px`,
              paddingTop: `${labelPaddingY}px`,
              paddingBottom: `${labelPaddingY}px`,
              borderWidth: `${borderWidth}px`,
              borderRadius: `${borderRadius}px`,
              borderColor: "hsl(var(--border))",
            }}
          >
            <span className="font-medium">{region.name}</span>
          </div>
        )}
      </div>

      {/* Resize handles - only shown when selected */}
      {isSelected && onResize && (
        <>
          {/* Top-left handle */}
          <div
            className="absolute bg-blue-500 border border-white cursor-nwse-resize"
            style={{
              left: `${wrapperLeft - handleSize / 2}px`,
              top: `${-wrapperPaddingTop - handleSize / 2}px`,
              width: `${handleSize}px`,
              height: `${handleSize}px`,
            }}
            data-handle="nw"
          />

          {/* Top-right handle */}
          <div
            className="absolute bg-blue-500 border border-white cursor-nesw-resize"
            style={{
              left: `${wrapperLeft + wrapperWidth - handleSize / 2}px`,
              top: `${-wrapperPaddingTop - handleSize / 2}px`,
              width: `${handleSize}px`,
              height: `${handleSize}px`,
            }}
            data-handle="ne"
          />

          {/* Bottom-left handle */}
          <div
            className="absolute bg-blue-500 border border-white cursor-nesw-resize"
            style={{
              left: `${wrapperLeft - handleSize / 2}px`,
              top: `${-wrapperPaddingTop + wrapperHeight - handleSize / 2}px`,
              width: `${handleSize}px`,
              height: `${handleSize}px`,
            }}
            data-handle="sw"
          />

          {/* Bottom-right handle */}
          <div
            className="absolute bg-blue-500 border border-white cursor-nwse-resize"
            style={{
              left: `${wrapperLeft + wrapperWidth - handleSize / 2}px`,
              top: `${-wrapperPaddingTop + wrapperHeight - handleSize / 2}px`,
              width: `${handleSize}px`,
              height: `${handleSize}px`,
            }}
            data-handle="se"
          />
        </>
      )}
    </div>
  );
}

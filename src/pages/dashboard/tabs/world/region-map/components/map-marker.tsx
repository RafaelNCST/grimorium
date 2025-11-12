import { MapPin } from "lucide-react";
import { IRegion } from "../../types/region-types";
import { cn } from "@/lib/utils";

interface MapMarkerProps {
  region: IRegion;
  x: number;
  y: number;
  color?: string;
  showLabel?: boolean;
  isSelected?: boolean;
  isDraggable?: boolean;
  onClick?: () => void;
  onDragStart?: (e: React.DragEvent) => void;
  onDragEnd?: (e: React.DragEvent) => void;
  onMouseDown?: (e: React.MouseEvent) => void;
  scale?: number;
  style?: React.CSSProperties;
}

export function MapMarker({
  region,
  x,
  y,
  color = '#8b5cf6',
  showLabel = true,
  isSelected = false,
  isDraggable = false,
  onClick,
  onDragStart,
  onDragEnd,
  onMouseDown,
  scale = 1,
  style,
}: MapMarkerProps) {
  const markerSize = 32 / scale; // Adjust size based on zoom
  const pinSize = 20 / scale;

  return (
    <div
      data-marker="true"
      className={cn(
        "absolute transition-transform hover:scale-110",
        isSelected && "z-50"
      )}
      style={{
        left: `${x}px`,
        top: `${y}px`,
        transform: `translate(-50%, -100%)`,
        width: `${markerSize}px`,
        height: `${markerSize}px`,
        ...style,
      }}
      onClick={onClick}
      onMouseDown={onMouseDown}
      draggable={false}
    >
      <div className="relative">
        <div
          className={cn(
            "rounded-full flex items-center justify-center shadow-lg transition-all",
            isSelected && "shadow-[0_0_30px_rgba(255,255,255,1),0_0_15px_rgba(255,255,255,0.8)]"
          )}
          style={{
            width: `${markerSize}px`,
            height: `${markerSize}px`,
            backgroundColor: color,
          }}
        >
          <MapPin
            className={cn(
              color === '#ffffff' ? "text-black" : "text-white"
            )}
            style={{
              width: `${pinSize}px`,
              height: `${pinSize}px`,
            }}
          />
        </div>

        {/* Region name label */}
        {showLabel && (
          <div
            className="absolute left-1/2 -translate-x-1/2 mt-1 whitespace-nowrap bg-background/95 backdrop-blur-sm border rounded-md px-2 py-1 shadow-lg pointer-events-none"
            style={{
              fontSize: `${12 / scale}px`,
            }}
          >
            <span className="text-xs font-medium">{region.name}</span>
          </div>
        )}
      </div>
    </div>
  );
}

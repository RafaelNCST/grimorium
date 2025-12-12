import { useState } from "react";

import { X, Trash2, Palette, Check, ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { IRegionMapMarker } from "@/lib/db/region-maps.service";
import { cn } from "@/lib/utils";

interface MultipleMarkersPanelProps {
  count: number;
  markers: IRegionMapMarker[];
  onClose: () => void;
  onRemoveMarkers: () => void;
  onColorChange: (color: string) => void;
  onLabelToggle: (showLabel: boolean) => void;
}

const MARKER_COLORS = [
  { name: "Roxo", value: "#8b5cf6" },
  { name: "Azul", value: "#3b82f6" },
  { name: "Verde", value: "#10b981" },
  { name: "Vermelho", value: "#ef4444" },
  { name: "Amarelo", value: "#f59e0b" },
  { name: "Rosa", value: "#ec4899" },
  { name: "Laranja", value: "#f97316" },
  { name: "Ciano", value: "#06b6d4" },
  { name: "Índigo", value: "#6366f1" },
  { name: "Lima", value: "#84cc16" },
  { name: "Branco", value: "#ffffff" },
  { name: "Preto", value: "#000000" },
];

export function MultipleMarkersPanel({
  count,
  markers,
  onClose,
  onRemoveMarkers,
  onColorChange,
  onLabelToggle,
}: MultipleMarkersPanelProps) {
  const { t } = useTranslation("world");
  const [showColorPicker, setShowColorPicker] = useState(false);

  // Calculate if majority of markers have showLabel enabled
  const labelsVisible = markers.filter((m) => m.showLabel).length > markers.length / 2;

  return (
    <div className="bg-background border rounded-lg shadow-lg w-80 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b flex items-center justify-between gap-4 flex-shrink-0">
        <h3 className="font-semibold text-sm">
          {count} {count === 1 ? "marcador selecionado" : "marcadores selecionados"}
        </h3>
        <Button
          variant="ghost-destructive"
          size="icon"
          className="h-8 w-8 shrink-0"
          onClick={onClose}
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Color Selector */}
        <div>
          <button
            onClick={() => setShowColorPicker(!showColorPicker)}
            className="flex items-center justify-between w-full p-2 rounded-lg hover:bg-muted transition-colors"
          >
            <div className="flex items-center gap-2">
              <Palette className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <p className="text-sm font-semibold text-purple-600 dark:text-purple-400">
                {t("region_map.marker_color")}
              </p>
            </div>
            <ChevronDown
              className={cn(
                "w-4 h-4 text-muted-foreground transition-transform",
                showColorPicker && "rotate-180"
              )}
            />
          </button>

          {showColorPicker && (
            <TooltipProvider delayDuration={300}>
              <div className="grid grid-cols-6 gap-2 mt-2">
                {MARKER_COLORS.map((color) => (
                  <Tooltip key={color.value}>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => {
                          onColorChange(color.value);
                          setShowColorPicker(false);
                        }}
                        className="w-full aspect-square rounded-lg border transition-all hover:opacity-60 flex items-center justify-center border-border"
                        style={{ backgroundColor: color.value }}
                      >
                        <Check
                          className="w-5 h-5 text-purple-600 dark:text-purple-400 drop-shadow-lg opacity-0 hover:opacity-100"
                          strokeWidth={3}
                        />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{color.name}</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>
            </TooltipProvider>
          )}
        </div>

        {/* Label Toggle */}
        <div>
          <button
            onClick={() => onLabelToggle(!labelsVisible)}
            className="flex items-center justify-between w-full p-2 rounded-lg hover:bg-muted transition-colors"
          >
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-purple-600 dark:text-purple-400">
                {t("region_map.show_label")}
              </span>
            </div>
            <div
              className={cn(
                "w-10 h-6 rounded-full transition-colors relative",
                labelsVisible ? "bg-purple-600" : "bg-muted-foreground/20"
              )}
            >
              <div
                className={cn(
                  "absolute top-1 w-4 h-4 bg-white rounded-full transition-transform",
                  labelsVisible ? "translate-x-5" : "translate-x-1"
                )}
              />
            </div>
          </button>
        </div>

        {/* Remove Button */}
        <Button
          variant="ghost-destructive"
          onClick={onRemoveMarkers}
          className="w-full"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Remover do mapa
        </Button>
      </div>
    </div>
  );
}

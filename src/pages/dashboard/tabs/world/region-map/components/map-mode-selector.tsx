import { Hand, Edit3 } from "lucide-react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export type MapMode = "view" | "edit";

interface MapModeSelectorProps {
  mode: MapMode;
  onModeChange: (mode: MapMode) => void;
}

export function MapModeSelector({ mode, onModeChange }: MapModeSelectorProps) {
  return (
    <TooltipProvider delayDuration={300}>
      <div className="bg-background border rounded-lg p-1 shadow-lg flex gap-1 w-full">
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() => onModeChange("view")}
              className={cn(
                "flex-1 py-3 rounded-md transition-colors flex items-center justify-center",
                mode === "view"
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted text-muted-foreground"
              )}
            >
              <Hand className="w-5 h-5" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>Modo Visualização</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() => onModeChange("edit")}
              className={cn(
                "flex-1 py-3 rounded-md transition-colors flex items-center justify-center",
                mode === "edit"
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted text-muted-foreground"
              )}
            >
              <Edit3 className="w-5 h-5" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>Modo Edição</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}

import {
  MousePointer2,
  Hand,
  RectangleHorizontal,
  SquareStack,
  Image,
  Circle,
  Square,
  Diamond,
  Type,
  ArrowUpRight,
  Minus,
  Grid3x3,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { ToolType } from "../types/power-system-types";

interface PropsToolbar {
  activeTool: ToolType;
  gridEnabled: boolean;
  onToolChange: (tool: ToolType) => void;
  onToggleGrid: () => void;
}

export function Toolbar({
  activeTool,
  gridEnabled,
  onToolChange,
  onToggleGrid,
}: PropsToolbar) {
  const { t } = useTranslation("power-system");

  const tools = [
    {
      type: "select" as ToolType,
      icon: MousePointer2,
      tooltip: "toolbar_tooltips.select",
      shortcut: "V",
    },
    {
      type: "hand" as ToolType,
      icon: Hand,
      tooltip: "toolbar_tooltips.hand",
      shortcut: "H",
    },
  ];

  const elementTools = [
    {
      type: "paragraph-block" as ToolType,
      icon: RectangleHorizontal,
      tooltip: "toolbar_tooltips.paragraph_block",
      shortcut: "B",
    },
    {
      type: "section-block" as ToolType,
      icon: SquareStack,
      tooltip: "toolbar_tooltips.section_block",
      shortcut: "D",
    },
    {
      type: "image-block" as ToolType,
      icon: Image,
      tooltip: "toolbar_tooltips.image_block",
      shortcut: "I",
    },
    {
      type: "circle" as ToolType,
      icon: Circle,
      tooltip: "toolbar_tooltips.circle",
      shortcut: "C",
    },
    {
      type: "square" as ToolType,
      icon: Square,
      tooltip: "toolbar_tooltips.square",
      shortcut: "S",
    },
    {
      type: "diamond" as ToolType,
      icon: Diamond,
      tooltip: "toolbar_tooltips.diamond",
      shortcut: "L",
    },
    {
      type: "text" as ToolType,
      icon: Type,
      tooltip: "toolbar_tooltips.text",
      shortcut: "T",
    },
  ];

  const connectionTools = [
    {
      type: "arrow" as ToolType,
      icon: ArrowUpRight,
      tooltip: "toolbar_tooltips.arrow",
      shortcut: "A",
    },
    {
      type: "line" as ToolType,
      icon: Minus,
      tooltip: "toolbar_tooltips.line",
      shortcut: "R",
    },
  ];

  const renderToolButton = (tool: {
    type: ToolType;
    icon: React.ElementType;
    tooltip: string;
    shortcut?: string;
  }) => {
    const Icon = tool.icon;
    const isActive = activeTool === tool.type;

    return (
      <Tooltip key={tool.type}>
        <TooltipTrigger asChild>
          <Button
            variant={isActive ? "default" : "ghost"}
            size="icon"
            className={`w-full ${isActive ? "bg-primary text-primary-foreground hover:bg-primary hover:shadow-glow hover:translate-y-0" : "hover:bg-accent"}`}
            onClick={() => onToolChange(tool.type)}
          >
            <Icon className="w-5 h-5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right">
          <div className="flex flex-col gap-1">
            <p className="text-sm font-medium">{t(tool.tooltip)}</p>
            {tool.shortcut && (
              <p className="text-xs text-muted-foreground">
                Atalho: {tool.shortcut}
              </p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    );
  };

  return (
    <div className="w-16 bg-background border-r flex flex-col items-center py-4 gap-2">
      {/* Select and Hand Tools */}
      <div className="flex flex-col gap-2 w-full px-2">
        {tools.map(renderToolButton)}
      </div>

      <Separator className="my-2" />

      {/* Element Creation Tools */}
      <div className="flex flex-col gap-2 w-full px-2">
        {elementTools.map(renderToolButton)}
      </div>

      <Separator className="my-2" />

      {/* Connection Tools */}
      <div className="flex flex-col gap-2 w-full px-2">
        {connectionTools.map(renderToolButton)}
      </div>

      <Separator className="my-2" />

      {/* Settings Tools */}
      <div className="flex flex-col gap-2 w-full px-2">
        {/* Grid Toggle */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={gridEnabled ? "default" : "ghost"}
              size="icon"
              className={`w-full ${gridEnabled ? "bg-primary text-primary-foreground hover:bg-primary hover:shadow-glow hover:translate-y-0" : "hover:bg-accent"}`}
              onClick={onToggleGrid}
            >
              <Grid3x3 className="w-5 h-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium">
                {t(
                  gridEnabled
                    ? "toolbar_tooltips.grid_on"
                    : "toolbar_tooltips.grid_off"
                )}
              </p>
              <p className="text-xs text-muted-foreground">Atalho: G</p>
            </div>
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}

import {
  MousePointer2,
  Hand,
  RectangleHorizontal,
  SquareStack,
  Image,
  FileText,
  AlertCircle,
  Circle,
  Square,
  Diamond,
  Type,
  ArrowUpRight,
  Minus,
} from "lucide-react";
import { useState } from "react";
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
  onToolChange: (tool: ToolType) => void;
}

export function Toolbar({
  activeTool,
  onToolChange,
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
      type: "advanced-block" as ToolType,
      icon: FileText,
      tooltip: "toolbar_tooltips.advanced_block",
      shortcut: "F",
    },
    {
      type: "informative-block" as ToolType,
      icon: AlertCircle,
      tooltip: "toolbar_tooltips.informative_block",
      shortcut: "O",
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

  const ToolButton = ({ tool }: { tool: {
    type: ToolType;
    icon: React.ElementType;
    tooltip: string;
    shortcut?: string;
  } }) => {
    const Icon = tool.icon;
    const isActive = activeTool === tool.type;
    const [open, setOpen] = useState(false);

    return (
      <Tooltip open={open} onOpenChange={setOpen}>
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
        <TooltipContent
          side="right"
          align="start"
          alignOffset={32}
          sideOffset={5}
          className="animate-none"
          onPointerEnter={() => setOpen(false)}
        >
          <div className="flex flex-col gap-1">
            <p className="text-sm font-medium">{t(tool.tooltip)}</p>
            {tool.shortcut && (
              <p className="text-xs text-muted-foreground">
                {t("toolbar_tooltips.shortcut")}: {tool.shortcut}
              </p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    );
  };

  return (
    <div className="w-36 bg-background border-r flex flex-col items-center py-4 gap-3">
      {/* Select and Hand Tools */}
      <div className="grid grid-cols-2 gap-2 w-full px-3">
        {tools.map((tool) => <ToolButton key={tool.type} tool={tool} />)}
      </div>

      <Separator className="my-2" />

      {/* Element Creation Tools */}
      <div className="grid grid-cols-2 gap-2 w-full px-3">
        {elementTools.map((tool) => <ToolButton key={tool.type} tool={tool} />)}
      </div>

      <Separator className="my-2" />

      {/* Connection Tools */}
      <div className="grid grid-cols-2 gap-2 w-full px-3">
        {connectionTools.map((tool) => <ToolButton key={tool.type} tool={tool} />)}
      </div>
    </div>
  );
}

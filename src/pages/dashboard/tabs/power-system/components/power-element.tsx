import { ChevronRight, Image } from "lucide-react";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

import { IPowerElement } from "../types/power-system-types";

interface PropsPowerElement {
  element: IPowerElement;
  viewOffset: { x: number; y: number };
  isSelected: boolean;
  isEditMode: boolean;
  onClick: () => void;
}

export function PowerElement({
  element,
  viewOffset,
  isSelected,
  isEditMode,
  onClick,
}: PropsPowerElement) {
  const baseStyle = {
    left: element.x + viewOffset.x,
    top: element.y + viewOffset.y,
    width: element.width,
    height: element.height,
    backgroundColor: element.color,
  };

  const baseClasses = `absolute cursor-${isEditMode ? "move" : "pointer"} transition-all rounded-lg shadow-sm ${isSelected ? "ring-2 ring-primary shadow-lg" : ""}`;

  if (element.type === "section-card") {
    return (
      <div
        key={element.id}
        className={baseClasses}
        style={baseStyle}
        onClick={onClick}
      >
        <div className="p-4 h-full flex flex-col">
          <h3
            className="font-semibold text-sm mb-2"
            style={{ color: element.textColor }}
          >
            {element.title}
          </h3>
          {element.compressed ? (
            <HoverCard>
              <HoverCardTrigger>
                <p
                  className="text-xs line-clamp-3 flex-1"
                  style={{ color: `${element.textColor}80` }}
                >
                  {element.content}
                </p>
              </HoverCardTrigger>
              {element.showHover && (
                <HoverCardContent className="w-80">
                  <p className="text-sm">{element.content}</p>
                </HoverCardContent>
              )}
            </HoverCard>
          ) : (
            <p
              className="text-xs flex-1"
              style={{ color: `${element.textColor}80` }}
            >
              {element.content}
            </p>
          )}
        </div>
      </div>
    );
  }

  if (element.type === "details-card") {
    return (
      <div
        key={element.id}
        className={baseClasses}
        style={baseStyle}
        onClick={onClick}
      >
        <div className="p-4 h-full flex flex-col">
          <div className="flex items-center gap-2 mb-2">
            {element.imageUrl && (
              <img
                src={element.imageUrl}
                alt={element.title}
                className="w-6 h-6 rounded object-cover"
              />
            )}
            <h3
              className="font-semibold text-sm"
              style={{ color: element.textColor }}
            >
              {element.title}
            </h3>
            <ChevronRight
              className="w-3 h-3 ml-auto"
              style={{ color: `${element.textColor}60` }}
            />
          </div>
          <p
            className="text-xs flex-1"
            style={{ color: `${element.textColor}80` }}
          >
            {element.content}
          </p>
        </div>
      </div>
    );
  }

  if (element.type === "visual-card") {
    return (
      <div
        key={element.id}
        className={`${baseClasses} overflow-hidden`}
        style={baseStyle}
        onClick={onClick}
      >
        <HoverCard>
          <HoverCardTrigger asChild>
            <div className="w-full h-full">
              {element.imageUrl ? (
                <img
                  src={element.imageUrl}
                  alt={element.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center">
                  <Image
                    className="w-8 h-8 mb-2"
                    style={{ color: `${element.textColor}60` }}
                  />
                  <p
                    className="text-xs text-center px-2"
                    style={{ color: element.textColor }}
                  >
                    {element.title}
                  </p>
                </div>
              )}
              {element.canOpenSubmap && (
                <div className="absolute top-2 right-2">
                  <ChevronRight
                    className="w-3 h-3"
                    style={{ color: `${element.textColor}80` }}
                  />
                </div>
              )}
            </div>
          </HoverCardTrigger>
          {element.showHover && (
            <HoverCardContent>
              <div>
                <h4 className="font-semibold">{element.title}</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  {element.content}
                </p>
              </div>
            </HoverCardContent>
          )}
        </HoverCard>
      </div>
    );
  }

  if (element.type === "text-box") {
    return (
      <div
        key={element.id}
        className={`${baseClasses} p-3`}
        style={baseStyle}
        onClick={onClick}
      >
        <p className="text-sm" style={{ color: element.textColor }}>
          {element.content}
        </p>
      </div>
    );
  }

  return null;
}

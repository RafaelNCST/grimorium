import { memo } from "react";

import { IPowerElement } from "../../types/power-system-types";

import { ImageBlock } from "./image-block";
import { ParagraphBlock } from "./paragraph-block";
import { SectionBlock } from "./section-block";
import { TextElement } from "./text-element";
import { VisualSectionElement } from "./visual-section-element";

interface PropsPowerElement {
  element: IPowerElement;
  isSelected: boolean;
  isEditMode: boolean;
  gridEnabled: boolean;
  gridSize: number;
  zoom: number;
  onUpdate: (updates: Partial<IPowerElement>) => void;
  onPositionChange: (x: number, y: number) => void;
  onDragMove?: (x: number, y: number) => void;
  onDragEnd?: () => void;
  onResizeMove?: (
    width: number,
    height: number,
    mode?: "diagonal" | "horizontal" | "vertical"
  ) => void;
  onResizeEnd?: () => void;
  onClick: (e?: React.MouseEvent) => void;
  onNavigate?: () => void;
  onFirstInput?: () => void;
  isMultiSelected?: boolean;
  tempSize?: { width: number; height: number; scale?: number };
  isHandMode?: boolean;
}

export const PowerElement = memo(
  ({
    element,
    isSelected,
    isEditMode,
    gridEnabled,
    gridSize,
    zoom,
    onUpdate,
    onPositionChange,
    onDragMove,
    onDragEnd,
    onResizeMove,
    onResizeEnd,
    onClick,
    onNavigate,
    onFirstInput,
    isMultiSelected = false,
    tempSize,
    isHandMode = false,
  }: PropsPowerElement) => {
    // Common props for all element types
    const commonProps = {
      element,
      isSelected,
      isEditMode,
      gridEnabled,
      gridSize,
      zoom,
      onUpdate,
      onPositionChange,
      onDragMove,
      onDragEnd,
      onResizeMove,
      onResizeEnd,
      onClick,
      isMultiSelected,
      tempSize,
      isHandMode,
    };

    switch (element.type) {
      case "paragraph-block":
        return (
          <ParagraphBlock
            {...commonProps}
            onSizeChange={(width, height) => onUpdate({ width, height })}
            onNavigate={onNavigate}
          />
        );

      case "section-block":
        return (
          <SectionBlock
            {...commonProps}
            onSizeChange={(width, height) => onUpdate({ width, height })}
            onNavigate={onNavigate}
          />
        );

      case "image-block":
        return (
          <ImageBlock
            {...commonProps}
            onSizeChange={(width, height) => onUpdate({ width, height })}
            onNavigate={onNavigate}
          />
        );

      case "visual-section":
        return (
          <VisualSectionElement {...commonProps} onNavigate={onNavigate} />
        );

      case "text":
        return (
          <TextElement
            {...commonProps}
            onSizeChange={(width, height) => onUpdate({ width, height })}
            onFirstInput={onFirstInput}
          />
        );

      default:
        return null;
    }
  }
);

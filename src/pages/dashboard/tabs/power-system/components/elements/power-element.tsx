import { memo } from 'react';

import { IPowerElement } from '../../types/power-system-types';
import { BasicSectionElement } from './basic-section-element';
import { DetailedSectionElement } from './detailed-section-element';
import { TextElement } from './text-element';
import { VisualSectionElement } from './visual-section-element';

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
  onResizeMove?: (width: number, height: number, mode?: 'diagonal' | 'horizontal' | 'vertical') => void;
  onResizeEnd?: () => void;
  onClick: (e?: React.MouseEvent) => void;
  onNavigate?: () => void;
  onFirstInput?: () => void;
  isMultiSelected?: boolean;
  tempSize?: { width: number; height: number; scale?: number };
}

export const PowerElement = memo(function PowerElement({
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
}: PropsPowerElement) {
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
  };

  switch (element.type) {
    case 'basic-section':
      return (
        <BasicSectionElement
          {...commonProps}
          onSizeChange={(width, height) => onUpdate({ width, height })}
          onNavigate={onNavigate}
          tempSize={tempSize}
        />
      );

    case 'detailed-section':
      return (
        <DetailedSectionElement
          {...commonProps}
          onSizeChange={(width, height) => onUpdate({ width, height })}
          onNavigate={onNavigate}
          tempSize={tempSize}
        />
      );

    case 'visual-section':
      return (
        <VisualSectionElement
          {...commonProps}
          onNavigate={onNavigate}
        />
      );

    case 'text':
      return (
        <TextElement
          {...commonProps}
          onSizeChange={(width, height) => onUpdate({ width, height })}
          onFirstInput={onFirstInput}
          tempSize={tempSize}
        />
      );

    default:
      return null;
  }
});

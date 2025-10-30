import { useTranslation } from 'react-i18next';

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';

import { IVisualSection, ShapeType } from '../../types/power-system-types';
import { DraggableElementWrapper } from './draggable-element-wrapper';

interface PropsVisualSectionElement {
  element: IVisualSection;
  isSelected: boolean;
  isEditMode: boolean;
  gridEnabled: boolean;
  gridSize: number;
  zoom: number;
  onUpdate: (updates: Partial<IVisualSection>) => void;
  onPositionChange: (x: number, y: number) => void;
  onDragMove?: (x: number, y: number) => void;
  onDragEnd?: () => void;
  onResizeMove?: (width: number, height: number, mode?: 'diagonal' | 'horizontal' | 'vertical') => void;
  onResizeEnd?: () => void;
  onClick: (e?: React.MouseEvent) => void;
  onNavigate?: () => void;
  isMultiSelected?: boolean;
}

export function VisualSectionElement({
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
  isMultiSelected = false,
}: PropsVisualSectionElement) {
  const { t } = useTranslation('power-system');

  const handleDoubleClick = () => {
    if (element.canNavigate && onNavigate && !isEditMode) {
      onNavigate();
    }
  };

  const handleSizeChange = (width: number, height: number) => {
    // The DraggableElementWrapper already ensures width === height for visual sections
    // Just pass through the values
    onUpdate({ width, height });
  };

  const renderShape = () => {
    const backgroundColor = element.imageUrl ? 'transparent' : element.backgroundColor || '#6366f1';
    const needsBorder = !element.imageUrl && backgroundColor === '#ffffff';

    const baseStyle = {
      backgroundColor,
      backgroundImage: element.imageUrl ? `url(${element.imageUrl})` : undefined,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      border: needsBorder ? '2px solid #e5e7eb' : undefined,
    };

    // Triangle shape needs special handling
    if (element.shape === 'triangle') {
      return (
        <div className="relative w-full h-full">
          <div
            className="absolute inset-0 shadow-lg"
            style={{
              ...baseStyle,
              clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
            }}
          />
        </div>
      );
    }

    // Diamond shape needs special handling - rotated square with rounded corners
    if (element.shape === 'diamond') {
      return (
        <div className="relative w-full h-full flex items-center justify-center">
          <div
            className="shadow-lg"
            style={{
              ...baseStyle,
              width: '70.71%', // sqrt(2)/2 to fit rotated square in container
              height: '70.71%',
              borderRadius: '10%', // Rounded corners
              transform: 'rotate(45deg)', // Rotate to create diamond shape
            }}
          />
        </div>
      );
    }

    // All other shapes use the same structure
    return (
      <div
        className="w-full h-full shadow-lg"
        style={baseStyle}
      />
    );
  };

  const getWrapperClassName = () => {
    const baseClasses = 'overflow-hidden';
    switch (element.shape) {
      case 'circle':
        return `${baseClasses} rounded-full`;
      case 'rounded-square':
        return `${baseClasses} rounded-2xl`;
      case 'square':
      case 'triangle':
      default:
        return baseClasses;
    }
  };

  const wrapperClassName = getWrapperClassName();

  const handleHoverCardMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleHoverCardMouseMove = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const content = element.showHoverCard && !isEditMode ? (
    <HoverCard openDelay={500} closeDelay={100}>
      <HoverCardTrigger className="w-full h-full block cursor-grab" style={{ pointerEvents: 'auto' }}>
        {renderShape()}
      </HoverCardTrigger>
      <HoverCardContent
        className="w-80 select-text cursor-auto"
        side="top"
        sideOffset={15}
        onMouseDown={handleHoverCardMouseDown}
        onMouseMove={handleHoverCardMouseMove}
      >
        <div className="space-y-3">
          <h4 className="text-lg font-semibold">
            {element.hoverTitle || t('elements.visual_section.default_hover_title')}
          </h4>
          <p className="text-sm text-muted-foreground">
            {element.hoverSubtitle || t('elements.visual_section.default_hover_subtitle')}
          </p>
          <p className="text-xs">
            {element.hoverDescription || t('elements.visual_section.default_hover_description')}
          </p>
        </div>
      </HoverCardContent>
    </HoverCard>
  ) : (
    <div className={`w-full h-full ${!isEditMode ? 'cursor-grab' : ''}`}>{renderShape()}</div>
  );

  return (
    <DraggableElementWrapper
      id={element.id}
      x={element.x}
      y={element.y}
      width={element.width}
      height={element.height}
      isSelected={isSelected}
      isEditMode={isEditMode}
      onPositionChange={onPositionChange}
      onSizeChange={handleSizeChange}
      onDragMove={onDragMove}
      onDragEnd={onDragEnd}
      onResizeMove={onResizeMove}
      onResizeEnd={onResizeEnd}
      onClick={onClick}
      onDoubleClick={handleDoubleClick}
      className={wrapperClassName}
      gridEnabled={gridEnabled}
      gridSize={gridSize}
      elementType="visual-section"
      shape={element.shape}
      zoom={zoom}
      minWidth={60}
      maxWidth={500}
      minHeight={60}
      maxHeight={500}
      disableDrag={isMultiSelected}
      disableResize={isMultiSelected}
    >
      {content}

      {/* Navigation Indicator */}
      {element.canNavigate && element.submapId && !isEditMode && (
        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs opacity-70 whitespace-nowrap bg-background px-2 py-1 rounded shadow">
          ↓ Clique duplo
        </div>
      )}
    </DraggableElementWrapper>
  );
}

import { useState, useRef, useEffect } from 'react';

import { useTranslation } from 'react-i18next';

import { IBasicSection } from '../../types/power-system-types';
import { DraggableElementWrapper } from './draggable-element-wrapper';

// Limites de fonte em px
const MIN_FONT_SIZE = 8;
const MAX_FONT_SIZE = 64;

// Tamanhos de fonte base (quando fontScale = 1.0)
const BASE_TITLE_FONT_SIZE = 18;
const BASE_DESCRIPTION_FONT_SIZE = 14;

// Função para medir dimensões do card (similar a measureTextDimensions)
function measureCardDimensions(
  title: string,
  description: string,
  titleFontSize: number,
  descriptionFontSize: number,
  maxWidth?: number,
  t?: any
): { width: number; height: number } {
  const temp = document.createElement('div');
  temp.style.position = 'absolute';
  temp.style.visibility = 'hidden';
  temp.style.padding = '16px'; // p-4
  temp.style.display = 'flex';
  temp.style.flexDirection = 'column';
  temp.style.gap = '8px'; // gap-2
  temp.style.boxSizing = 'border-box';

  // Se TEM maxWidth (modo redimensionado), define width fixa
  if (maxWidth) {
    temp.style.width = `${maxWidth}px`;
  }

  // Title
  const tempTitle = document.createElement('div');
  tempTitle.style.fontWeight = '600';
  tempTitle.style.fontSize = `${titleFontSize}px`;
  tempTitle.style.lineHeight = '1.5';
  tempTitle.style.padding = '0 2px'; // px-0.5
  tempTitle.style.boxSizing = 'border-box';

  if (maxWidth) {
    // COM maxWidth: quebra linha
    tempTitle.style.whiteSpace = 'pre-wrap';
    tempTitle.style.wordWrap = 'break-word';
    tempTitle.style.overflowWrap = 'break-word';
  } else {
    // SEM maxWidth: sem quebra
    tempTitle.style.whiteSpace = 'nowrap';
  }

  tempTitle.textContent = title || (t ? t('elements.basic_section.title_placeholder') : 'Título');
  temp.appendChild(tempTitle);

  // Description
  const tempDesc = document.createElement('div');
  tempDesc.style.fontSize = `${descriptionFontSize}px`;
  tempDesc.style.lineHeight = '1.625';
  tempDesc.style.padding = '8px'; // px-2 py-1
  tempDesc.style.boxSizing = 'border-box';

  if (maxWidth) {
    // COM maxWidth: quebra linha
    tempDesc.style.whiteSpace = 'pre-wrap';
    tempDesc.style.wordWrap = 'break-word';
    tempDesc.style.overflowWrap = 'break-word';
  } else {
    // SEM maxWidth: sem quebra
    tempDesc.style.whiteSpace = 'nowrap';
  }

  tempDesc.textContent = description || (t ? t('elements.basic_section.description_placeholder') : 'Descrição');
  temp.appendChild(tempDesc);

  document.body.appendChild(temp);
  const measuredWidth = temp.offsetWidth;
  const measuredHeight = temp.offsetHeight;
  document.body.removeChild(temp);

  return { width: measuredWidth, height: measuredHeight };
}

interface PropsBasicSectionElement {
  element: IBasicSection;
  isSelected: boolean;
  isEditMode: boolean;
  gridEnabled: boolean;
  gridSize: number;
  onUpdate: (updates: Partial<IBasicSection>) => void;
  onPositionChange: (x: number, y: number) => void;
  onSizeChange: (width: number, height: number) => void;
  onDragMove?: (x: number, y: number) => void;
  onDragEnd?: () => void;
  onResizeMove?: (width: number, height: number, mode?: 'diagonal' | 'horizontal' | 'vertical', scale?: number) => void;
  onResizeEnd?: (mode?: 'diagonal' | 'horizontal' | 'vertical') => void;
  onClick: (e?: React.MouseEvent) => void;
  onNavigate?: () => void;
  zoom?: number;
  isMultiSelected?: boolean;
  tempSize?: { width: number; height: number; scale?: number };
}

export function BasicSectionElement({
  element,
  isSelected,
  isEditMode,
  gridEnabled,
  gridSize,
  onUpdate,
  onPositionChange,
  onSizeChange,
  onDragMove,
  onDragEnd,
  onResizeMove,
  onResizeEnd,
  onClick,
  onNavigate,
  zoom = 1,
  isMultiSelected = false,
  tempSize,
}: PropsBasicSectionElement) {
  const { t } = useTranslation('power-system');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [title, setTitle] = useState(element.title);
  const [description, setDescription] = useState(element.description);
  const titleRef = useRef<HTMLTextAreaElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const isResizingRef = useRef(false);

  // Get current font scale (default to 1.0)
  const fontScale = element.fontScale ?? 1.0;

  // Calculate font sizes
  const titleFontSize = BASE_TITLE_FONT_SIZE * fontScale;
  const descriptionFontSize = BASE_DESCRIPTION_FONT_SIZE * fontScale;

  // Calculate display font size during resize (similar ao texto)
  const displayTitleFontSize = tempSize?.scale
    ? Math.max(MIN_FONT_SIZE, Math.min(MAX_FONT_SIZE, titleFontSize * tempSize.scale))
    : titleFontSize;

  const displayDescriptionFontSize = tempSize?.scale
    ? Math.max(MIN_FONT_SIZE, Math.min(MAX_FONT_SIZE, descriptionFontSize * tempSize.scale))
    : descriptionFontSize;

  // LOG TEMPORÁRIO
  if (tempSize?.scale) {
    console.log('[PREVIEW] BasicSection', element.id, {
      fontScale: element.fontScale,
      'tempSize.scale': tempSize.scale,
      titleFontSize,
      displayTitleFontSize,
      'tempSize.width': tempSize.width,
      'tempSize.height': tempSize.height
    });
  }

  // Calculate display dimensions
  const displayWidth = tempSize?.width ?? element.width;
  const displayHeight = tempSize?.height ?? element.height;

  // Sync local state
  useEffect(() => {
    setTitle(element.title);
    setDescription(element.description);
  }, [element.title, element.description]);

  // Auto-resize textarea when entering edit mode
  useEffect(() => {
    if (isEditingTitle && titleRef.current) {
      autoResizeTextarea(titleRef.current);
    }
  }, [isEditingTitle]);

  useEffect(() => {
    if (isEditingDescription && descriptionRef.current) {
      autoResizeTextarea(descriptionRef.current);
    }
  }, [isEditingDescription]);

  // Auto-resize textarea height
  const autoResizeTextarea = (textarea: HTMLTextAreaElement) => {
    // Reset height para calcular scrollHeight correto
    textarea.style.height = 'auto';
    // Define altura baseada no conteúdo
    textarea.style.height = textarea.scrollHeight + 'px';
  };

  // Handle content change (similar ao handleContentChange do texto)
  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);

    // COMPORTAMENTO VIRGEM: Width infinita, sem quebra
    if (!element.wasManuallyResized) {
      const dimensions = measureCardDimensions(
        newTitle,
        description,
        titleFontSize,
        descriptionFontSize,
        undefined, // SEM maxWidth
        t
      );

      const newWidth = Math.max(element.width, dimensions.width);
      const newHeight = Math.max(element.height, dimensions.height);

      if (newWidth !== element.width || newHeight !== element.height) {
        onUpdate({
          title: newTitle,
          width: newWidth,
          height: newHeight
        });
      } else {
        onUpdate({ title: newTitle });
      }
    } else {
      // COMPORTAMENTO REDIMENSIONADO: Width fixa, quebra linha, aumenta height
      const dimensions = measureCardDimensions(
        newTitle,
        description,
        titleFontSize,
        descriptionFontSize,
        element.width, // maxWidth = width atual
        t
      );

      if (dimensions.height !== element.height) {
        onUpdate({
          title: newTitle,
          height: dimensions.height
        });
      } else {
        onUpdate({ title: newTitle });
      }
    }
  };

  const handleDescriptionChange = (newDescription: string) => {
    setDescription(newDescription);

    // COMPORTAMENTO VIRGEM: Width infinita, sem quebra
    if (!element.wasManuallyResized) {
      const dimensions = measureCardDimensions(
        title,
        newDescription,
        titleFontSize,
        descriptionFontSize,
        undefined, // SEM maxWidth
        t
      );

      const newWidth = Math.max(element.width, dimensions.width);
      const newHeight = Math.max(element.height, dimensions.height);

      if (newWidth !== element.width || newHeight !== element.height) {
        onUpdate({
          description: newDescription,
          width: newWidth,
          height: newHeight
        });
      } else {
        onUpdate({ description: newDescription });
      }
    } else {
      // COMPORTAMENTO REDIMENSIONADO: Width fixa, quebra linha, aumenta height
      const dimensions = measureCardDimensions(
        title,
        newDescription,
        titleFontSize,
        descriptionFontSize,
        element.width, // maxWidth = width atual
        t
      );

      if (dimensions.height !== element.height) {
        onUpdate({
          description: newDescription,
          height: dimensions.height
        });
      } else {
        onUpdate({ description: newDescription });
      }
    }
  };

  const handleTitleSave = () => {
    onUpdate({ title });
    setIsEditingTitle(false);
  };

  const handleDescriptionSave = () => {
    onUpdate({ description });
    setIsEditingDescription(false);
  };

  const handleDoubleClick = () => {
    if (element.canNavigate && onNavigate && !isEditMode) {
      onNavigate();
    }
  };

  const handleInputDoubleClick = (type: 'title' | 'description') => {
    if (!isEditMode) return;
    if (type === 'title') {
      setIsEditingTitle(true);
    } else {
      setIsEditingDescription(true);
    }
  };

  // Handle resize (similar ao handleHorizontalResize do texto)
  const handleResize = (newWidth: number, newHeight: number, mode?: 'diagonal' | 'horizontal' | 'vertical') => {
    isResizingRef.current = true;

    // Marca como manualmente redimensionado
    if (!element.wasManuallyResized) {
      onUpdate({ wasManuallyResized: true });
    }

    if (mode === 'diagonal' || mode === 'vertical') {
      // REDIMENSIONAMENTO DIAGONAL/VERTICAL: Usa EXATAMENTE o que foi mostrado no preview
      // SEM RECALCULAR - apenas aplica os valores finais do tempSize
      if (tempSize?.scale) {
        // Aplica a escala do preview ao fontScale atual
        const newFontScale = fontScale * tempSize.scale;

        const clampedFontScale = Math.max(
          MIN_FONT_SIZE / BASE_TITLE_FONT_SIZE,
          Math.min(MAX_FONT_SIZE / BASE_TITLE_FONT_SIZE, newFontScale)
        );

        // LOG TEMPORÁRIO
        console.log('[RESIZE END] BasicSection', element.id, {
          'element.fontScale': fontScale,
          'tempSize.scale': tempSize.scale,
          newFontScale,
          clampedFontScale,
          'BASE_TITLE_FONT_SIZE': BASE_TITLE_FONT_SIZE,
          'newTitleSize': BASE_TITLE_FONT_SIZE * clampedFontScale,
          'displayTitleFontSize (preview)': displayTitleFontSize,
          'tempSize.width': tempSize.width,
          'tempSize.height': tempSize.height
        });

        // USA EXATAMENTE width/height do tempSize (sem recalcular!)
        onUpdate({
          width: tempSize.width,
          height: tempSize.height,
          fontScale: clampedFontScale,
          wasManuallyResized: true
        });
      } else {
        // Fallback: se não tem tempSize, calcula manualmente
        const scale = mode === 'diagonal'
          ? (newWidth / element.width)
          : (newHeight / element.height);

        const newFontScale = fontScale * scale;

        const clampedFontScale = Math.max(
          MIN_FONT_SIZE / BASE_TITLE_FONT_SIZE,
          Math.min(MAX_FONT_SIZE / BASE_TITLE_FONT_SIZE, newFontScale)
        );

        const newTitleSize = BASE_TITLE_FONT_SIZE * clampedFontScale;
        const newDescSize = BASE_DESCRIPTION_FONT_SIZE * clampedFontScale;

        // Para vertical: calcular width baseado na escala também
        // Para diagonal: usar newWidth diretamente
        const targetWidth = mode === 'vertical'
          ? element.width * scale  // Escala proporcional
          : newWidth;              // Tamanho arrastado

        const dimensions = measureCardDimensions(
          title,
          description,
          newTitleSize,
          newDescSize,
          targetWidth,
          t
        );

        onUpdate({
          width: dimensions.width,
          height: dimensions.height,
          fontScale: clampedFontScale,
          wasManuallyResized: true
        });
      }
    } else {
      // REDIMENSIONAMENTO HORIZONTAL: Width muda, texto quebra, height ajusta
      const dimensions = measureCardDimensions(
        title,
        description,
        titleFontSize,
        descriptionFontSize,
        newWidth, // maxWidth
        t
      );

      onUpdate({
        width: dimensions.width,
        height: dimensions.height,
        wasManuallyResized: true
      });
    }

    setTimeout(() => {
      isResizingRef.current = false;
    }, 100);
  };

  // Handle resize move (feedback em tempo real - similar ao texto)
  const handleResizeMove = (newWidth: number, newHeight: number, mode?: 'diagonal' | 'horizontal' | 'vertical') => {
    // Marca como alterado no primeiro resize move
    if (!element.wasManuallyResized && !isResizingRef.current) {
      isResizingRef.current = true;
      onUpdate({ wasManuallyResized: true });
    }

    if (mode === 'diagonal' || mode === 'vertical') {
      // Calcula novo fontSize baseado na escala
      const scale = mode === 'diagonal'
        ? (newWidth / element.width)
        : (newHeight / element.height);

      const newFontScale = fontScale * scale;
      const newTitleFontSize = BASE_TITLE_FONT_SIZE * newFontScale;

      // Check limites
      if (newTitleFontSize < MIN_FONT_SIZE || newTitleFontSize > MAX_FONT_SIZE) {
        return;
      }

      const newTitleSize = BASE_TITLE_FONT_SIZE * newFontScale;
      const newDescSize = BASE_DESCRIPTION_FONT_SIZE * newFontScale;

      // Para vertical: calcular width baseado na escala também
      // Para diagonal: usar newWidth diretamente
      const targetWidth = mode === 'vertical'
        ? element.width * scale  // Escala proporcional
        : newWidth;              // Tamanho arrastado

      const dimensions = measureCardDimensions(
        title,
        description,
        newTitleSize,
        newDescSize,
        targetWidth,
        t
      );

      // LOG TEMPORÁRIO
      console.log('[RESIZE MOVE] BasicSection', element.id, {
        scale,
        fontScale,
        newFontScale,
        newTitleSize,
        'dimensions.width': dimensions.width,
        'dimensions.height': dimensions.height,
        newWidth,
        newHeight
      });

      // Passa o scale para o pai criar tempSize com a escala correta
      onResizeMove?.(dimensions.width, dimensions.height, mode, scale);
    } else {
      // Horizontal: calcula height com wrapping
      // IMPORTANTE: Passar maxWidth para forçar wrapping durante resize
      const dimensions = measureCardDimensions(
        title,
        description,
        titleFontSize,
        descriptionFontSize,
        newWidth, // Sempre passa maxWidth no horizontal resize
        t
      );

      onResizeMove?.(dimensions.width, dimensions.height, mode);
    }
  };

  // Handle resize end (similar ao texto)
  const handleResizeEnd = (mode?: 'diagonal' | 'horizontal' | 'vertical') => {
    if (tempSize) {
      handleResize(tempSize.width, tempSize.height, mode);
    }
    onResizeEnd?.(mode);
  };

  // Calcular largura mínima (4 letras W)
  const calculateMinWidth = (): number => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) return 100;

    context.font = `600 ${displayTitleFontSize}px Inter, system-ui, sans-serif`;
    const fourWs = context.measureText('WWWW').width;

    return Math.max(100, Math.ceil(fourWs) + 32 + 4);
  };

  const sizeLimits = {
    minWidth: calculateMinWidth(),
    maxWidth: Infinity,
    minHeight: 80,
    maxHeight: Infinity
  };

  return (
    <DraggableElementWrapper
      id={element.id}
      x={element.x}
      y={element.y}
      width={displayWidth}
      height={displayHeight}
      isSelected={isSelected}
      isEditMode={isEditMode}
      isEditing={isEditingTitle || isEditingDescription}
      onPositionChange={onPositionChange}
      onSizeChange={onSizeChange}
      onDragMove={onDragMove}
      onDragEnd={onDragEnd}
      onResizeMove={handleResizeMove}
      onResizeEnd={handleResizeEnd}
      onClick={onClick}
      onDoubleClick={handleDoubleClick}
      minWidth={sizeLimits.minWidth}
      maxWidth={sizeLimits.maxWidth}
      minHeight={sizeLimits.minHeight}
      maxHeight={sizeLimits.maxHeight}
      gridEnabled={gridEnabled}
      gridSize={gridSize}
      elementType="basic-section"
      zoom={zoom}
      disableDrag={isMultiSelected}
      disableResize={isMultiSelected}
    >
      <div
        className="rounded-lg shadow-lg p-4 flex flex-col gap-2"
        style={{
          backgroundColor: element.backgroundColor,
          color: element.textColor,
          width: `${displayWidth}px`,
          height: `${displayHeight}px`,
          boxSizing: 'border-box',
        }}
      >
        {/* Title */}
        {isEditingTitle && isEditMode ? (
          <textarea
            ref={titleRef}
            value={title}
            onChange={(e) => {
              handleTitleChange(e.target.value);
              if (titleRef.current) autoResizeTextarea(titleRef.current);
            }}
            onBlur={handleTitleSave}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                setTitle(element.title);
                setIsEditingTitle(false);
              }
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleTitleSave();
              }
            }}
            className="bg-transparent border-b border-current font-semibold focus:outline-none resize-none overflow-hidden px-0.5"
            style={{
              width: element.wasManuallyResized ? `${displayWidth - 32 - 4}px` : '100%',
              wordWrap: element.wasManuallyResized ? 'break-word' : 'normal',
              overflowWrap: element.wasManuallyResized ? 'break-word' : 'normal',
              whiteSpace: element.wasManuallyResized ? 'pre-wrap' : 'nowrap',
              fontSize: `${displayTitleFontSize}px`,
              lineHeight: '1.5',
              boxSizing: 'border-box',
            }}
            placeholder={t('elements.basic_section.title_placeholder')}
            onClick={(e) => e.stopPropagation()}
            rows={1}
            maxLength={200}
            autoFocus
          />
        ) : (
          <h3
            className={`font-semibold px-0.5 ${
              !element.title ? 'opacity-40' : ''
            } ${!isEditMode ? 'cursor-grab' : 'cursor-default'}`}
            style={{
              wordWrap: element.wasManuallyResized ? 'break-word' : 'normal',
              overflowWrap: element.wasManuallyResized ? 'break-word' : 'normal',
              whiteSpace: element.wasManuallyResized ? 'pre-wrap' : 'nowrap',
              fontSize: `${displayTitleFontSize}px`,
              lineHeight: '1.5',
              boxSizing: 'border-box',
              userSelect: 'none',
            }}
            onDoubleClick={(e) => {
              e.stopPropagation();
              handleInputDoubleClick('title');
            }}
          >
            {element.title || t('elements.basic_section.title_placeholder')}
          </h3>
        )}

        {/* Description */}
        {isEditingDescription && isEditMode ? (
          <textarea
            ref={descriptionRef}
            value={description}
            onChange={(e) => {
              handleDescriptionChange(e.target.value);
              if (descriptionRef.current) autoResizeTextarea(descriptionRef.current);
            }}
            onBlur={handleDescriptionSave}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                setDescription(element.description);
                setIsEditingDescription(false);
              }
            }}
            className="bg-transparent border border-current rounded leading-relaxed focus:outline-none resize-none overflow-hidden px-2 py-1"
            style={{
              width: element.wasManuallyResized ? `${displayWidth - 32 - 4}px` : '100%',
              boxSizing: 'border-box',
              wordWrap: element.wasManuallyResized ? 'break-word' : 'normal',
              overflowWrap: element.wasManuallyResized ? 'break-word' : 'normal',
              whiteSpace: element.wasManuallyResized ? 'pre-wrap' : 'nowrap',
              fontSize: `${displayDescriptionFontSize}px`,
              lineHeight: '1.625',
            }}
            placeholder={t('elements.basic_section.description_placeholder')}
            onClick={(e) => e.stopPropagation()}
            rows={1}
            autoFocus
          />
        ) : (
          <p
            className={`leading-relaxed px-2 py-1 ${
              !element.description ? 'opacity-40' : ''
            } ${!isEditMode ? 'cursor-grab' : 'cursor-default'}`}
            style={{
              wordWrap: element.wasManuallyResized ? 'break-word' : 'normal',
              overflowWrap: element.wasManuallyResized ? 'break-word' : 'normal',
              whiteSpace: element.wasManuallyResized ? 'pre-wrap' : 'nowrap',
              fontSize: `${displayDescriptionFontSize}px`,
              lineHeight: '1.625',
              boxSizing: 'border-box',
              userSelect: 'none',
            }}
            onDoubleClick={(e) => {
              e.stopPropagation();
              handleInputDoubleClick('description');
            }}
          >
            {element.description || t('elements.basic_section.description_placeholder')}
          </p>
        )}

        {/* Navigation Indicator */}
        {element.canNavigate && element.submapId && (
          <div className="text-xs opacity-70 text-center">
            {!isEditMode && '↓ Clique duplo para navegar'}
          </div>
        )}
      </div>
    </DraggableElementWrapper>
  );
}

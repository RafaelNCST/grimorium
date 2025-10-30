import { useState, useRef, useEffect } from 'react';

import { useTranslation } from 'react-i18next';

import { ITextElement } from '../../types/power-system-types';
import { DraggableElementWrapper } from './draggable-element-wrapper';

// Simplified helper function to measure text dimensions
function measureTextDimensions(
  text: string,
  fontSize: number,
  fontWeight: string,
  maxWidth?: number
): { width: number; height: number } {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  if (!context) return { width: 50, height: 24 };

  context.font = `${fontWeight} ${fontSize}px Inter, system-ui, sans-serif`;

  const lineHeight = fontSize * 1.5;
  const horizontalPadding = 8;
  const verticalPadding = 8;

  // Se texto vazio, retorna tamanho mínimo (apenas cursor)
  if (!text || text.trim().length === 0) {
    return {
      width: 16,
      height: Math.max(Math.ceil(lineHeight) + verticalPadding, 24)
    };
  }

  const lines = text.split('\n');

  // Se NÃO tem maxWidth (modo virgem), calcula width natural SEM quebra
  if (!maxWidth) {
    let maxLineWidth = 0;
    lines.forEach(line => {
      if (line.length === 0) {
        maxLineWidth = Math.max(maxLineWidth, fontSize);
      } else {
        const metrics = context.measureText(line);
        maxLineWidth = Math.max(maxLineWidth, metrics.width);
      }
    });

    return {
      width: Math.max(Math.ceil(maxLineWidth) + horizontalPadding, 16),
      height: Math.max(Math.ceil(lines.length * lineHeight) + verticalPadding, 24)
    };
  }

  // Se TEM maxWidth (modo redimensionado), calcula COM quebra de linha
  const contentWidth = Math.max(maxWidth - horizontalPadding, 8);
  let totalLines = 0;

  lines.forEach(line => {
    if (line.length === 0) {
      totalLines += 1;
    } else {
      const words = line.split(' ');
      let currentLine = '';
      let lineCount = 0;

      words.forEach((word) => {
        // Check if the word itself is too long to fit
        const wordWidth = context.measureText(word).width;

        if (wordWidth > contentWidth) {
          // Word is too long, need to break it
          if (currentLine) {
            lineCount++;
            currentLine = '';
          }

          // Break word character by character
          let remainingWord = word;
          while (remainingWord.length > 0) {
            let chunk = '';
            for (let i = 0; i < remainingWord.length; i++) {
              const testChunk = chunk + remainingWord[i];
              const testWidth = context.measureText(testChunk).width;

              if (testWidth > contentWidth && chunk.length > 0) {
                break;
              }
              chunk = testChunk;
            }

            if (chunk.length === 0) {
              chunk = remainingWord[0]; // At least take one character
            }

            lineCount++;
            remainingWord = remainingWord.substring(chunk.length);
          }
        } else {
          // Normal word, try to fit in current line
          const testLine = currentLine + (currentLine ? ' ' : '') + word;
          const metrics = context.measureText(testLine);

          if (metrics.width > contentWidth && currentLine) {
            lineCount++;
            currentLine = word;
          } else {
            currentLine = testLine;
          }
        }
      });

      if (currentLine) lineCount++;
      totalLines += Math.max(lineCount, 1);
    }
  });

  const calculatedHeight = Math.max(Math.ceil(totalLines * lineHeight) + verticalPadding, 24);

  return {
    width: maxWidth,
    height: calculatedHeight
  };
}

interface PropsTextElement {
  element: ITextElement;
  isSelected: boolean;
  isEditMode: boolean;
  gridEnabled: boolean;
  gridSize: number;
  zoom: number;
  onUpdate: (updates: Partial<ITextElement>) => void;
  onPositionChange: (x: number, y: number) => void;
  onSizeChange: (width: number, height: number) => void;
  onDragMove?: (x: number, y: number) => void;
  onDragEnd?: () => void;
  onResizeMove?: (width: number, height: number, mode?: 'diagonal' | 'horizontal' | 'vertical') => void;
  onResizeEnd?: (mode?: 'diagonal' | 'horizontal' | 'vertical') => void;
  onClick: (e?: React.MouseEvent) => void;
  isMultiSelected?: boolean;
  tempSize?: { width: number; height: number; scale?: number };
  onFirstInput?: () => void;
}

export function TextElement({
  element,
  isSelected,
  isEditMode,
  gridEnabled,
  gridSize,
  zoom,
  onUpdate,
  onPositionChange,
  onSizeChange,
  onDragMove,
  onDragEnd,
  onResizeMove,
  onResizeEnd,
  onClick,
  isMultiSelected = false,
  tempSize,
  onFirstInput,
}: PropsTextElement) {
  const { t } = useTranslation('power-system');
  const [isEditing, setIsEditing] = useState(element.content === '');
  const [content, setContent] = useState(element.content);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isResizingRef = useRef(false);

  // Calculate display font size during resize
  const displayFontSize = tempSize?.scale
    ? Math.max(8, Math.min(64, Math.round(element.fontSize * tempSize.scale)))
    : element.fontSize;

  // Calculate display dimensions
  const displayWidth = tempSize?.width ?? element.width;
  const displayHeight = tempSize?.height ?? element.height;

  // Auto-focus when created empty
  useEffect(() => {
    if (isEditing && textareaRef.current) {
      setTimeout(() => {
        if (textareaRef.current && isEditing) {
          textareaRef.current.focus();
        }
      }, 0);
    }
  }, [isEditing]);

  // Handle content change
  const handleContentChange = (newContent: string) => {
    setContent(newContent);

    // First input callback
    if (element.content === '' && newContent.length === 1 && onFirstInput) {
      onFirstInput();
    }

    // Se vazio, não atualiza dimensões
    if (newContent.trim().length === 0) {
      onUpdate({ content: newContent });
      return;
    }

    // COMPORTAMENTO VIRGEM: Width infinita, sem quebra
    if (!element.wasManuallyResized) {
      const dimensions = measureTextDimensions(
        newContent,
        element.fontSize,
        element.fontWeight === 'bold' ? 'bold' : 'normal'
        // SEM maxWidth
      );

      const newWidth = Math.max(element.width, dimensions.width);
      const newHeight = Math.max(element.height, dimensions.height);

      if (newWidth !== element.width || newHeight !== element.height) {
        onUpdate({
          content: newContent,
          width: newWidth,
          height: newHeight
        });
        onSizeChange(newWidth, newHeight);
      } else {
        onUpdate({ content: newContent });
      }
    } else {
      // COMPORTAMENTO REDIMENSIONADO: Width fixa, quebra linha, aumenta height
      const dimensions = measureTextDimensions(
        newContent,
        element.fontSize,
        element.fontWeight === 'bold' ? 'bold' : 'normal',
        element.width // maxWidth = width atual
      );

      if (dimensions.height !== element.height) {
        onUpdate({
          content: newContent,
          height: dimensions.height
        });
        onSizeChange(element.width, dimensions.height);
      } else {
        onUpdate({ content: newContent });
      }
    }
  };

  // Handle horizontal resize
  const handleHorizontalResize = (newWidth: number, newHeight: number, mode?: 'diagonal' | 'horizontal' | 'vertical') => {
    isResizingRef.current = true;

    // Marca como manualmente redimensionado
    if (!element.wasManuallyResized) {
      onUpdate({ wasManuallyResized: true });
    }

    if (element.content && element.content.trim().length > 0) {
      if (mode === 'diagonal' || mode === 'vertical') {
        // REDIMENSIONAMENTO DIAGONAL/VERTICAL: Aumenta fontSize proporcionalmente
        const scale = mode === 'diagonal'
          ? (newWidth / element.width)
          : (newHeight / element.height);
        const newFontSize = Math.max(8, Math.min(64, Math.round(element.fontSize * scale)));

        // Calcula novo width escalado (mantém proporção)
        const scaledWidth = element.width * scale;

        // Calcula dimensões com novo fontSize e width escalada (mantém quebra de linhas)
        const dimensions = measureTextDimensions(
          element.content,
          newFontSize,
          element.fontWeight === 'bold' ? 'bold' : 'normal',
          scaledWidth // Passa maxWidth escalada para manter quebras de linha
        );

        onUpdate({
          width: dimensions.width,
          height: dimensions.height,
          fontSize: newFontSize,
          wasManuallyResized: true
        });
        onSizeChange(dimensions.width, dimensions.height);
      } else {
        // REDIMENSIONAMENTO HORIZONTAL: Width muda, texto quebra, height ajusta
        const dimensions = measureTextDimensions(
          element.content,
          element.fontSize,
          element.fontWeight === 'bold' ? 'bold' : 'normal',
          newWidth // maxWidth
        );

        onUpdate({
          width: dimensions.width,
          height: dimensions.height,
          wasManuallyResized: true
        });
        onSizeChange(dimensions.width, dimensions.height);
      }
    } else {
      // Sem conteúdo, usa tamanho mínimo
      onUpdate({ wasManuallyResized: true });
      onSizeChange(Math.max(newWidth, 16), Math.max(newHeight, 24));
    }

    setTimeout(() => {
      isResizingRef.current = false;
    }, 100);
  };

  // Handle resize move (feedback em tempo real)
  const handleResizeMove = (newWidth: number, newHeight: number, mode?: 'diagonal' | 'horizontal' | 'vertical') => {
    if (element.content && element.content.trim().length > 0) {
      if (mode === 'diagonal' || mode === 'vertical') {
        // Calcula novo fontSize
        const scale = mode === 'diagonal'
          ? (newWidth / element.width)
          : (newHeight / element.height);
        const newFontSize = Math.max(8, Math.min(64, Math.round(element.fontSize * scale)));

        // Calcula novo width escalado (mantém proporção e quebra de linhas)
        const scaledWidth = element.width * scale;

        // Calcula dimensões COM novo fontSize e width escalada
        const dimensions = measureTextDimensions(
          element.content,
          newFontSize,
          element.fontWeight === 'bold' ? 'bold' : 'normal',
          scaledWidth // Passa maxWidth escalada para manter quebras de linha
        );

        onResizeMove?.(dimensions.width, dimensions.height, mode);
      } else {
        // Horizontal: calcula height com wrapping
        const dimensions = measureTextDimensions(
          element.content,
          element.fontSize,
          element.fontWeight === 'bold' ? 'bold' : 'normal',
          newWidth
        );

        onResizeMove?.(dimensions.width, dimensions.height, mode);
      }
    } else {
      onResizeMove?.(Math.max(newWidth, 16), Math.max(newHeight, 24), mode);
    }
  };

  // Handle size change from wrapper
  const handleSizeChange = (newWidth: number, newHeight: number) => {
    // Ignorado, será tratado em handleResizeEnd
  };

  // Handle resize end
  const handleResizeEnd = (mode?: 'diagonal' | 'horizontal' | 'vertical') => {
    if (tempSize) {
      handleHorizontalResize(tempSize.width, tempSize.height, mode);
    }
    onResizeEnd?.(mode);
  };

  // Handle blur (deselect)
  const handleBlur = (e: React.FocusEvent) => {
    // Se vazio, marca para exclusão
    if (content.trim().length === 0 && element.content === '') {
      onUpdate({ content: '__DELETE__' });
    } else if (content.trim().length > 0) {
      // Salva conteúdo
      const dimensions = measureTextDimensions(
        content,
        element.fontSize,
        element.fontWeight === 'bold' ? 'bold' : 'normal',
        element.wasManuallyResized ? element.width : undefined
      );

      onUpdate({
        content,
        width: dimensions.width,
        height: dimensions.height
      });
      onSizeChange(dimensions.width, dimensions.height);
      setIsEditing(false);
    }
  };

  // Handle double click
  const handleDoubleClick = () => {
    if (!element.canNavigate && isEditMode) {
      setIsEditing(true);
    }
  };

  // Calcular largura mínima baseada na letra mais larga do conteúdo
  const calculateMinWidth = (): number => {
    if (!element.content || element.content.length === 0) return 16;

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) return 16;

    const fontWeight = element.fontWeight === 'bold' ? 'bold' : 'normal';
    context.font = `${fontWeight} ${displayFontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;

    // Encontrar a letra/caractere mais largo
    let maxCharWidth = 0;
    for (let i = 0; i < element.content.length; i++) {
      const char = element.content[i];
      if (char !== '\n' && char !== ' ') {
        const charWidth = context.measureText(char).width;
        maxCharWidth = Math.max(maxCharWidth, charWidth);
      }
    }

    // Adicionar padding para o container (2px de cada lado = 4px total)
    return Math.max(16, Math.ceil(maxCharWidth) + 8);
  };

  // Size limits - mínimos dinâmicos baseados no conteúdo, sem máximos fixos
  // Os limites de fontSize (8-64px) são tratados em handleElementResizeMove
  const sizeLimits = {
    minWidth: calculateMinWidth(),
    maxWidth: Infinity,
    minHeight: 24,
    maxHeight: Infinity
  };

  // Check if empty and editing (para mostrar apenas cursor)
  const isEmptyAndEditing = content === '' && isEditing && isEditMode;

  return (
    <DraggableElementWrapper
      id={element.id}
      x={element.x}
      y={element.y}
      width={displayWidth}
      height={displayHeight}
      isSelected={isSelected}
      isEditMode={isEditMode}
      isEditing={isEditing}
      onPositionChange={onPositionChange}
      onSizeChange={handleSizeChange}
      onDragMove={onDragMove}
      onDragEnd={onDragEnd}
      onResizeMove={handleResizeMove}
      onResizeEnd={handleResizeEnd}
      onClick={onClick}
      onDoubleClick={handleDoubleClick}
      gridEnabled={gridEnabled}
      gridSize={gridSize}
      elementType="text"
      zoom={zoom}
      minWidth={sizeLimits.minWidth}
      maxWidth={sizeLimits.maxWidth}
      minHeight={sizeLimits.minHeight}
      maxHeight={sizeLimits.maxHeight}
      disableVerticalResize={false}
      disableDrag={isMultiSelected}
      disableResize={isMultiSelected}
    >
      <div
        className="h-full w-full"
        style={{
          padding: '2px',
          color: element.textColor,
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: element.textAlign === 'center' ? 'center' : element.textAlign === 'right' ? 'flex-end' : 'flex-start',
          boxSizing: 'border-box',
        }}
      >
        {isEditing && isEditMode ? (
          <div className="relative w-full h-full">
            {/* Blinking cursor - apenas quando vazio */}
            {isEmptyAndEditing && (
              <div
                className="absolute"
                style={{
                  left: '0px',
                  top: '0px',
                  width: '2px',
                  height: `${element.fontSize}px`,
                  backgroundColor: element.textColor,
                  animation: 'blink 1.06s steps(2, start) infinite',
                  zIndex: 1,
                  pointerEvents: 'none',
                }}
              />
            )}

            {/* Textarea */}
            <textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => handleContentChange(e.target.value)}
              onBlur={handleBlur}
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  if (element.content === '' && content.trim().length === 0) {
                    // Novo elemento, sem conteúdo - deletar
                    onUpdate({ content: '__DELETE__' });
                  } else {
                    setContent(element.content);
                    setIsEditing(false);
                  }
                }
              }}
              spellCheck={false}
              className="bg-transparent focus:outline-none resize-none border-none"
              style={{
                fontSize: `${displayFontSize}px`,
                fontWeight: element.fontWeight === 'bold' ? 'bold' : 'normal',
                textDecoration: element.fontWeight === 'underline' ? 'underline' : 'none',
                textAlign: 'left',
                color: element.textColor,
                caretColor: element.textColor,
                wordWrap: element.wasManuallyResized ? 'break-word' : 'normal',
                overflowWrap: element.wasManuallyResized ? 'break-word' : 'normal',
                whiteSpace: element.wasManuallyResized ? 'pre-wrap' : 'nowrap',
                width: element.wasManuallyResized ? `${displayWidth - 8}px` : `${Math.max(displayWidth - 8, 200)}px`,
                height: element.wasManuallyResized ? `${displayHeight - 8}px` : `${Math.max(displayHeight - 8, 24)}px`,
                overflow: 'hidden',
                willChange: 'contents',
                transform: 'translate3d(0, 0, 0)',
              }}
              onClick={(e) => e.stopPropagation()}
            />

            {/* CSS for blinking animation */}
            <style>{`
              @keyframes blink {
                0%, 100% { opacity: 1; }
                50% { opacity: 0; }
              }
            `}</style>
          </div>
        ) : (
          <div
            className={`${isEditMode ? '' : 'cursor-grab select-none'}`}
            style={{
              fontSize: `${displayFontSize}px`,
              fontWeight: element.fontWeight === 'bold' ? 'bold' : 'normal',
              textDecoration: element.fontWeight === 'underline' ? 'underline' : 'none',
              textAlign: element.textAlign,
              whiteSpace: 'pre-wrap',
              wordWrap: 'break-word',
              overflowWrap: 'break-word',
              wordBreak: 'break-word',
              userSelect: 'none',
              WebkitUserSelect: 'none',
              MozUserSelect: 'none',
              msUserSelect: 'none',
              width: '100%',
              maxWidth: `${displayWidth - 8}px`,
            }}
          >
            {element.content || t('elements.text.default_content')}
          </div>
        )}
      </div>
    </DraggableElementWrapper>
  );
}

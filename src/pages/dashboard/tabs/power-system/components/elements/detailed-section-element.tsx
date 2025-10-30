import { useState, useEffect, useRef } from 'react';

import { useTranslation } from 'react-i18next';
import { ImageIcon } from 'lucide-react';

import { IDetailedSection } from '../../types/power-system-types';
import { DraggableElementWrapper } from './draggable-element-wrapper';

interface PropsDetailedSectionElement {
  element: IDetailedSection;
  isSelected: boolean;
  isEditMode: boolean;
  gridEnabled: boolean;
  gridSize: number;
  onUpdate: (updates: Partial<IDetailedSection>) => void;
  onPositionChange: (x: number, y: number) => void;
  onDragMove?: (x: number, y: number) => void;
  onDragEnd?: () => void;
  onResizeMove?: (width: number, height: number, mode?: 'diagonal' | 'horizontal' | 'vertical') => void;
  onResizeEnd?: () => void;
  onClick: (e?: React.MouseEvent) => void;
  onNavigate?: () => void;
  zoom?: number;
  isMultiSelected?: boolean;
  tempSize?: { width: number; height: number; scale?: number };
}

// Limites de fonte em px
const MIN_FONT_SIZE = 8;
const MAX_FONT_SIZE = 64;

// Tamanhos de fonte base (quando fontScale = 1.0)
const BASE_IMAGE_SIZE = 64; // w-16 h-16
const BASE_TITLE_FONT_SIZE = 16; // text-base
const BASE_SUBTITLE_FONT_SIZE = 14; // text-sm
const BASE_DESCRIPTION_FONT_SIZE = 12; // text-xs

export function DetailedSectionElement({
  element,
  isSelected,
  isEditMode,
  gridEnabled,
  gridSize,
  onUpdate,
  onPositionChange,
  onDragMove,
  onDragEnd,
  onResizeMove,
  onResizeEnd,
  onClick,
  onNavigate,
  zoom = 1,
  isMultiSelected = false,
  tempSize,
}: PropsDetailedSectionElement) {
  const { t } = useTranslation('power-system');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingSubtitle, setIsEditingSubtitle] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [title, setTitle] = useState(element.title);
  const [subtitle, setSubtitle] = useState(element.subtitle);
  const [description, setDescription] = useState(element.description);
  const contentRef = useRef<HTMLDivElement>(null);

  // Get current font scale (default to 1.0)
  const fontScale = element.fontScale ?? 1.0;

  // Calculate sizes
  const imageSize = BASE_IMAGE_SIZE * fontScale;
  const titleFontSize = BASE_TITLE_FONT_SIZE * fontScale;
  const subtitleFontSize = BASE_SUBTITLE_FONT_SIZE * fontScale;
  const descriptionFontSize = BASE_DESCRIPTION_FONT_SIZE * fontScale;

  // Check if scale is at limits
  const isAtMinScale = titleFontSize <= MIN_FONT_SIZE;
  const isAtMaxScale = titleFontSize >= MAX_FONT_SIZE;

  const calculateInitialWidth = () => {
    // Create a temporary element to measure content width without wrapping
    const temp = document.createElement('div');
    temp.style.position = 'absolute';
    temp.style.visibility = 'hidden';
    temp.style.whiteSpace = 'nowrap';
    temp.style.padding = '16px'; // p-4

    // Measure image (64px + center container)
    const imageWidth = imageSize;

    // Measure title (use placeholder if empty)
    const tempTitle = document.createElement('div');
    tempTitle.style.fontWeight = '600'; // font-semibold
    tempTitle.style.fontSize = `${titleFontSize}px`;
    tempTitle.textContent = element.title || t('elements.detailed_section.title_placeholder');
    temp.appendChild(tempTitle);

    // Measure subtitle (use placeholder if empty)
    const tempSubtitle = document.createElement('div');
    tempSubtitle.style.fontSize = `${subtitleFontSize}px`;
    tempSubtitle.textContent = element.subtitle || t('elements.detailed_section.subtitle_placeholder');
    temp.appendChild(tempSubtitle);

    // Measure description (use placeholder if empty)
    const tempDesc = document.createElement('div');
    tempDesc.style.fontSize = `${descriptionFontSize}px`;
    tempDesc.textContent = element.description || t('elements.detailed_section.description_placeholder');
    temp.appendChild(tempDesc);

    document.body.appendChild(temp);
    const textWidth = Math.ceil(temp.offsetWidth);
    document.body.removeChild(temp);

    const width = Math.max(imageWidth + 32, textWidth) + 32; // Add padding margin
    return Math.min(width, 800); // Cap at 800px
  };

  const calculateMinWidth = () => {
    // Minimum width: 1 letter per line (using 'W' as reference for widest letter)
    const temp = document.createElement('span');
    temp.style.position = 'absolute';
    temp.style.visibility = 'hidden';
    temp.style.fontWeight = '600';
    temp.style.fontSize = `${titleFontSize}px`;
    temp.textContent = 'W'; // 1 W

    document.body.appendChild(temp);
    const minWidth = Math.ceil(temp.offsetWidth) + 32 + 16; // Add padding + small margin
    document.body.removeChild(temp);

    // Also consider image size
    const minImageWidth = imageSize + 32;

    return Math.max(minWidth, minImageWidth, 100); // Minimum of 100px
  };

  const autoResizeTextarea = (textarea: HTMLTextAreaElement) => {
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';

    // If card was manually resized, update height after textarea resize
    if (element.wasManuallyResized) {
      setTimeout(() => {
        if (contentRef.current) {
          const newHeight = contentRef.current.scrollHeight;
          if (Math.abs(newHeight - element.height) > 2) {
            onUpdate({ height: newHeight });
          }
        }
      }, 0);
    }
  };

  // Auto-grow width when typing if not manually resized
  useEffect(() => {
    if (!element.wasManuallyResized && contentRef.current) {
      const newWidth = calculateInitialWidth();
      if (Math.abs(newWidth - element.width) > 5) {
        onUpdate({ width: newWidth });
      }
    }
  }, [title, subtitle, description]);

  // Update height when content changes and was manually resized
  useEffect(() => {
    if (element.wasManuallyResized && contentRef.current) {
      const newHeight = contentRef.current.scrollHeight;
      if (Math.abs(newHeight - element.height) > 2) {
        onUpdate({ height: newHeight });
      }
    }
  }, [title, subtitle, description, element.width]);

  const handleTitleSave = () => {
    if (element.wasManuallyResized && contentRef.current) {
      const newHeight = contentRef.current.scrollHeight;
      onUpdate({ title, height: newHeight });
    } else {
      onUpdate({ title });
    }
    setIsEditingTitle(false);
  };

  const handleSubtitleSave = () => {
    if (element.wasManuallyResized && contentRef.current) {
      const newHeight = contentRef.current.scrollHeight;
      onUpdate({ subtitle, height: newHeight });
    } else {
      onUpdate({ subtitle });
    }
    setIsEditingSubtitle(false);
  };

  const handleDescriptionSave = () => {
    if (element.wasManuallyResized && contentRef.current) {
      const newHeight = contentRef.current.scrollHeight;
      onUpdate({ description, height: newHeight });
    } else {
      onUpdate({ description });
    }
    setIsEditingDescription(false);
  };

  const handleDoubleClick = () => {
    if (element.canNavigate && onNavigate && !isEditMode) {
      onNavigate();
    }
  };

  // Handle input double-click to enable editing
  const handleInputDoubleClick = (type: 'title' | 'subtitle' | 'description') => {
    if (!isEditMode) return;
    if (type === 'title') {
      setIsEditingTitle(true);
    } else if (type === 'subtitle') {
      setIsEditingSubtitle(true);
    } else {
      setIsEditingDescription(true);
    }
  };

  const handleSizeChange = (width: number, height: number) => {
    onUpdate({
      width,
      height,
      wasManuallyResized: true // Mark as manually resized
    });
  };

  // Handle real-time resize
  const handleResizeMove = (newWidth: number, newHeight: number, mode?: 'diagonal' | 'horizontal' | 'vertical') => {
    if (mode === 'diagonal' || mode === 'vertical') {
      // Calculate scale based on width change
      const scale = newWidth / element.width;
      const newFontScale = fontScale * scale;

      // Calculate actual font sizes
      const newTitleFontSize = BASE_TITLE_FONT_SIZE * newFontScale;

      // Check font limits
      if (newTitleFontSize < MIN_FONT_SIZE || newTitleFontSize > MAX_FONT_SIZE) {
        // Don't allow resize beyond font limits
        return;
      }

      // Call parent's onResizeMove with scale
      onResizeMove?.(newWidth, newHeight, mode);
    } else {
      // Horizontal resize - check minimum width
      const minWidth = calculateMinWidth();
      const finalWidth = Math.max(newWidth, minWidth);

      onResizeMove?.(finalWidth, newHeight, mode);
    }
  };

  const handleResizeEnd = (mode?: 'diagonal' | 'horizontal' | 'vertical') => {
    if (mode === 'diagonal' || mode === 'vertical') {
      // Calculate and save new font scale
      if (tempSize?.scale) {
        const newFontScale = fontScale * tempSize.scale;

        // Clamp to font size limits
        const clampedFontScale = Math.max(
          MIN_FONT_SIZE / BASE_TITLE_FONT_SIZE,
          Math.min(MAX_FONT_SIZE / BASE_TITLE_FONT_SIZE, newFontScale)
        );

        setTimeout(() => {
          if (contentRef.current) {
            const contentHeight = contentRef.current.scrollHeight;
            onUpdate({
              height: contentHeight,
              fontScale: clampedFontScale,
              wasManuallyResized: true
            });
          }
        }, 0);
      }
    } else {
      // Horizontal resize - adjust height to fit content
      setTimeout(() => {
        if (contentRef.current) {
          const contentHeight = contentRef.current.scrollHeight;
          onUpdate({
            height: contentHeight,
            wasManuallyResized: true
          });
        }
      }, 0);
    }

    onResizeEnd?.();
  };

  // Calculate display sizes (during resize or normal)
  const displayWidth = tempSize?.width ?? element.width;
  const displayHeight = tempSize?.height ?? element.height;
  const displayScale = tempSize?.scale ?? 1;

  // Apply scale during resize
  const displayImageSize = imageSize * displayScale;
  const displayTitleFontSize = titleFontSize * displayScale;
  const displaySubtitleFontSize = subtitleFontSize * displayScale;
  const displayDescriptionFontSize = descriptionFontSize * displayScale;

  // Calculate max width/height for resize limits
  const minWidth = calculateMinWidth();
  const maxWidth = isAtMaxScale ? element.width : 2000; // If at max scale, don't allow growing
  const minHeight = 80;
  const maxHeight = isAtMaxScale ? element.height : 2000;

  return (
    <DraggableElementWrapper
      id={element.id}
      x={element.x}
      y={element.y}
      width={displayWidth}
      height={displayHeight}
      isSelected={isSelected}
      isEditMode={isEditMode}
      isEditing={isEditingTitle || isEditingSubtitle || isEditingDescription}
      onPositionChange={onPositionChange}
      onSizeChange={handleSizeChange}
      onDragMove={onDragMove}
      onDragEnd={onDragEnd}
      onResizeMove={handleResizeMove}
      onResizeEnd={handleResizeEnd}
      onClick={onClick}
      onDoubleClick={handleDoubleClick}
      minWidth={minWidth}
      maxWidth={maxWidth}
      minHeight={minHeight}
      maxHeight={maxHeight}
      gridEnabled={gridEnabled}
      gridSize={gridSize}
      elementType="detailed-section"
      zoom={zoom}
      disableDrag={isMultiSelected}
      disableResize={isMultiSelected}
    >
      <div
        ref={contentRef}
        className="rounded-lg shadow-lg p-4 flex flex-col gap-2 min-h-full"
        style={{
          backgroundColor: element.backgroundColor,
          color: element.textColor,
        }}
      >
        {/* Image - Always visible with placeholder */}
        <div className="flex justify-center">
          {element.imageUrl ? (
            <img
              src={element.imageUrl}
              alt={element.title}
              className="rounded-full object-cover"
              style={{
                width: `${displayImageSize}px`,
                height: `${displayImageSize}px`
              }}
            />
          ) : (
            <div
              className="rounded-full border-2 border-dashed border-current opacity-30 flex items-center justify-center"
              style={{
                width: `${displayImageSize}px`,
                height: `${displayImageSize}px`
              }}
            >
              <ImageIcon style={{ width: `${displayImageSize * 0.375}px`, height: `${displayImageSize * 0.375}px` }} />
            </div>
          )}
        </div>

        {/* Title */}
        {isEditingTitle && isEditMode ? (
          <textarea
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              autoResizeTextarea(e.target as HTMLTextAreaElement);
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
            className="w-full bg-transparent border-b border-current font-semibold text-center focus:outline-none resize-none overflow-hidden px-0.5"
            style={{
              wordWrap: element.wasManuallyResized ? 'break-word' : 'normal',
              overflowWrap: element.wasManuallyResized ? 'break-word' : 'normal',
              whiteSpace: element.wasManuallyResized ? 'pre-wrap' : 'nowrap',
              fontSize: `${displayTitleFontSize}px`
            }}
            placeholder={t('elements.detailed_section.title_placeholder')}
            onClick={(e) => e.stopPropagation()}
            rows={1}
            maxLength={200}
            autoFocus
          />
        ) : (
          <h3
            className={`font-semibold text-center whitespace-pre-wrap px-0.5 ${
              !element.title ? 'opacity-40' : ''
            } ${!isEditMode ? 'cursor-grab' : 'cursor-text'}`}
            style={{
              wordWrap: 'break-word',
              overflowWrap: 'break-word',
              wordBreak: 'break-word',
              fontSize: `${displayTitleFontSize}px`,
              lineHeight: '1.5'
            }}
            onDoubleClick={(e) => {
              e.stopPropagation();
              handleInputDoubleClick('title');
            }}
          >
            {element.title || t('elements.detailed_section.title_placeholder')}
          </h3>
        )}

        {/* Subtitle */}
        {isEditingSubtitle && isEditMode ? (
          <textarea
            value={subtitle}
            onChange={(e) => {
              setSubtitle(e.target.value);
              autoResizeTextarea(e.target as HTMLTextAreaElement);
            }}
            onBlur={handleSubtitleSave}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                setSubtitle(element.subtitle);
                setIsEditingSubtitle(false);
              }
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubtitleSave();
              }
            }}
            className="w-full bg-transparent border-b border-current text-center opacity-80 focus:outline-none resize-none overflow-hidden px-0.5"
            style={{
              wordWrap: element.wasManuallyResized ? 'break-word' : 'normal',
              overflowWrap: element.wasManuallyResized ? 'break-word' : 'normal',
              whiteSpace: element.wasManuallyResized ? 'pre-wrap' : 'nowrap',
              fontSize: `${displaySubtitleFontSize}px`
            }}
            placeholder={t('elements.detailed_section.subtitle_placeholder')}
            onClick={(e) => e.stopPropagation()}
            rows={1}
            maxLength={200}
            autoFocus
          />
        ) : (
          <p
            className={`text-center whitespace-pre-wrap px-0.5 ${
              !element.subtitle ? 'opacity-40' : 'opacity-80'
            } ${!isEditMode ? 'cursor-grab' : 'cursor-text'}`}
            style={{
              wordWrap: 'break-word',
              overflowWrap: 'break-word',
              wordBreak: 'break-word',
              fontSize: `${displaySubtitleFontSize}px`,
              lineHeight: '1.5'
            }}
            onDoubleClick={(e) => {
              e.stopPropagation();
              handleInputDoubleClick('subtitle');
            }}
          >
            {element.subtitle || t('elements.detailed_section.subtitle_placeholder')}
          </p>
        )}

        {/* Description */}
        {isEditingDescription && isEditMode ? (
          <textarea
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              autoResizeTextarea(e.target as HTMLTextAreaElement);
            }}
            onBlur={handleDescriptionSave}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                setDescription(element.description);
                setIsEditingDescription(false);
              }
            }}
            className="w-full bg-transparent border border-current rounded leading-relaxed focus:outline-none resize-none overflow-hidden px-2 py-1"
            style={{
              boxSizing: 'border-box',
              wordWrap: element.wasManuallyResized ? 'break-word' : 'normal',
              overflowWrap: element.wasManuallyResized ? 'break-word' : 'normal',
              whiteSpace: element.wasManuallyResized ? 'pre-wrap' : 'nowrap',
              fontSize: `${displayDescriptionFontSize}px`
            }}
            placeholder={t('elements.detailed_section.description_placeholder')}
            onClick={(e) => e.stopPropagation()}
            rows={1}
            autoFocus
          />
        ) : (
          <p
            className={`leading-relaxed whitespace-pre-wrap px-2 py-1 ${
              !element.description ? 'opacity-40' : ''
            } ${!isEditMode ? 'cursor-grab' : 'cursor-text'}`}
            style={{
              wordWrap: 'break-word',
              overflowWrap: 'break-word',
              wordBreak: 'break-word',
              fontSize: `${displayDescriptionFontSize}px`,
              lineHeight: '1.625'
            }}
            onDoubleClick={(e) => {
              e.stopPropagation();
              handleInputDoubleClick('description');
            }}
          >
            {element.description || t('elements.detailed_section.description_placeholder')}
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

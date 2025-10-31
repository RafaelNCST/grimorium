import { useState, useRef, useEffect } from "react";

import { useTranslation } from "react-i18next";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { ISectionBlock } from "../../types/power-system-types";

import { DraggableElementWrapper } from "./draggable-element-wrapper";

interface PropsSectionBlock {
  element: ISectionBlock;
  isSelected: boolean;
  isEditMode: boolean;
  gridEnabled: boolean;
  gridSize: number;
  onUpdate: (updates: Partial<ISectionBlock>) => void;
  onPositionChange: (x: number, y: number) => void;
  onSizeChange: (width: number, height: number) => void;
  onDragMove?: (x: number, y: number) => void;
  onDragEnd?: () => void;
  onResizeMove?: (width: number, height: number, mode?: "horizontal") => void;
  onResizeEnd?: (mode?: "horizontal") => void;
  onClick: (e?: React.MouseEvent) => void;
  onNavigate?: () => void;
  zoom?: number;
  isMultiSelected?: boolean;
  tempSize?: { width: number; height: number };
  isHandMode?: boolean; // Modo de interação (tecla 'h')
}

// Limite máximo de caracteres no título
const MAX_TITLE_CHARS = 200;

// Função para calcular altura de 1 linha baseada no fontSize
const calculateSingleLineHeight = (fontSize: number) => {
  const lineHeight = 1.2; // Mesmo lineHeight do CSS
  const padding = 16; // 8px top + 8px bottom (p-2)
  return Math.ceil(fontSize * lineHeight) + padding;
};

export function SectionBlock({
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
  isHandMode = false,
}: PropsSectionBlock) {
  const { t } = useTranslation("power-system");

  // Estados essenciais
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingContent, setIsEditingContent] = useState(false);
  const [title, setTitle] = useState(element.title);
  const [content, setContent] = useState(element.content);

  // Refs
  const titleRef = useRef<HTMLTextAreaElement>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);

  // Constantes dinâmicas baseadas no fontSize
  const PADDING = 16;
  const GAP = 8;
  const LINE_HEIGHT = 1.2;
  const TITLE_HEIGHT = calculateSingleLineHeight(element.titleFontSize); // Sempre 1 linha
  const MIN_BLOCK_HEIGHT = 240; // Altura mínima aumentada de 200 para 240

  // Display dimensions
  const displayWidth = tempSize?.width ?? element.width;

  // Sync local state
  useEffect(() => {
    setTitle(element.title);
    setContent(element.content);
  }, [element.title, element.content]);

  // Cálculos de altura - Título sempre 1 linha
  const totalBlockHeight = MIN_BLOCK_HEIGHT;
  const paragraphHeight = totalBlockHeight - TITLE_HEIGHT - PADDING - GAP;

  // Auto-focus quando entrar em edição
  useEffect(() => {
    if (isEditingTitle && titleRef.current) {
      titleRef.current.focus();
    }
  }, [isEditingTitle]);

  useEffect(() => {
    if (isEditingContent && contentRef.current) {
      contentRef.current.focus();
    }
  }, [isEditingContent]);

  // Handlers
  const handleTitleChange = (newTitle: string) => {
    // Limitar a 200 caracteres
    const limitedTitle = newTitle.slice(0, MAX_TITLE_CHARS);
    setTitle(limitedTitle);
    onUpdate({ title: limitedTitle });
  };

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    onUpdate({ content: newContent });
  };

  const handleTitleBlur = () => {
    onUpdate({ title });
    setIsEditingTitle(false);
  };

  const handleContentBlur = () => {
    onUpdate({ content });
    setIsEditingContent(false);
  };

  const handleDoubleClick = () => {
    if (element.canNavigate && onNavigate && !isEditMode) {
      onNavigate();
    }
  };

  const handleTitleDoubleClick = (e: React.MouseEvent) => {
    if (isEditMode) {
      e.stopPropagation();
      setIsEditingTitle(true);
    }
  };

  const handleContentDoubleClick = (e: React.MouseEvent) => {
    if (isEditMode) {
      e.stopPropagation();
      setIsEditingContent(true);
    }
  };

  const handleResizeMove = (
    newWidth: number,
    newHeight: number,
    mode?: "horizontal"
  ) => {
    onResizeMove?.(newWidth, newHeight, mode);
  };

  const handleResizeEnd = (mode?: "horizontal") => {
    if (tempSize) {
      onSizeChange(tempSize.width, tempSize.height);
    }
    onResizeEnd?.(mode);
  };

  return (
    <DraggableElementWrapper
      id={element.id}
      x={element.x}
      y={element.y}
      width={displayWidth}
      height={totalBlockHeight}
      isSelected={isSelected}
      isEditMode={isEditMode}
      isEditing={isEditingTitle || isEditingContent}
      onPositionChange={onPositionChange}
      onSizeChange={onSizeChange}
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
      minWidth={800}
      maxWidth={800}
      minHeight={200}
      maxHeight={1000}
      disableVerticalResize={true}
      disableDrag={isMultiSelected}
      disableResize={true}
      isBlockElement={true}
    >
      <div
        className="w-full rounded-[2px]"
        style={{
          backgroundColor: element.backgroundColor,
          color: element.textColor,
          padding: "16px",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          height: `${totalBlockHeight}px`,
        }}
      >
        {/* Title Area - Sempre 1 linha */}
        {isEditingTitle && isEditMode ? (
          <textarea
            ref={titleRef}
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            onBlur={handleTitleBlur}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                setTitle(element.title);
                setIsEditingTitle(false);
              }
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleTitleBlur();
              }
            }}
            id={`title-${element.id}`}
            maxLength={MAX_TITLE_CHARS}
            spellCheck={false}
            className="font-mono bg-transparent border rounded font-semibold focus:outline-none resize-none w-full scrollbar-hide"
            style={{
              fontSize: `${element.titleFontSize}px`,
              lineHeight: "1.2",
              textAlign: element.titleAlign,
              color: element.textColor,
              borderColor: element.showTitleBorder !== false ? (element.borderColor || "#4A5568") : "transparent",
              padding: "8px",
              overflow: "hidden",
              overflowX: "auto",
              height: `${TITLE_HEIGHT}px`,
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
              cursor: "text",
              scrollbarWidth: "none" as const,
              msOverflowStyle: "none" as const,
            }}
            placeholder={t("elements.section_block.title_placeholder")}
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <Tooltip open={isHandMode ? undefined : false}>
            <TooltipTrigger asChild>
              <div
                id={`title-${element.id}`}
                className={`font-mono w-full font-semibold rounded border ${!element.title ? "opacity-40" : ""}`}
                style={{
                  fontSize: `${element.titleFontSize}px`,
                  lineHeight: "1.2",
                  textAlign: element.titleAlign,
                  borderColor: element.showTitleBorder !== false ? (element.borderColor || "#4A5568") : "transparent",
                  padding: "8px",
                  overflow: "hidden",
                  height: `${TITLE_HEIGHT}px`,
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                  userSelect: "none",
                }}
                onDoubleClick={handleTitleDoubleClick}
              >
                {element.title || t("elements.section_block.title_placeholder")}
              </div>
            </TooltipTrigger>
            {element.title && element.title.length > 0 && (
              <TooltipContent
                side="top"
                sideOffset={8}
                avoidCollisions={true}
                collisionPadding={16}
                className="pointer-events-auto z-50"
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
                onMouseUp={(e) => e.stopPropagation()}
                onMouseMove={(e) => e.stopPropagation()}
              >
                <p className="text-sm font-medium max-w-md break-words select-text">
                  {element.title}
                </p>
              </TooltipContent>
            )}
          </Tooltip>
        )}

        {/* Content Area - Altura FIXA com scroll (igual ParagraphBlock) */}
        {isEditingContent && isEditMode ? (
          <textarea
            ref={contentRef}
            value={content}
            onChange={(e) => handleContentChange(e.target.value)}
            onBlur={handleContentBlur}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                setContent(element.content);
                setIsEditingContent(false);
              }
            }}
            id={`content-${element.id}`}
            spellCheck={false}
            className="font-mono bg-transparent border rounded focus:outline-none resize-none w-full [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-200/30 [&::-webkit-scrollbar-thumb]:bg-gray-500/60 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-gray-600/70"
            style={{
              fontSize: `${element.contentFontSize}px`,
              lineHeight: "1.5",
              textAlign: element.contentAlign,
              color: element.textColor,
              borderColor: element.showContentBorder !== false ? (element.borderColor || "#4A5568") : "transparent",
              padding: "8px",
              overflow: "auto",
              overflowY: "auto",
              height: `${paragraphHeight}px`,
              scrollbarWidth: "thin",
              scrollbarColor: "rgba(107, 114, 128, 0.6) rgba(229, 231, 235, 0.3)",
            }}
            placeholder={t("elements.section_block.content_placeholder")}
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <div
            id={`content-${element.id}`}
            className={`font-mono w-full rounded border ${!element.content ? "opacity-40" : ""} [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-200/30 [&::-webkit-scrollbar-thumb]:bg-gray-500/60 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-gray-600/70`}
            style={{
              fontSize: `${element.contentFontSize}px`,
              lineHeight: "1.5",
              textAlign: element.contentAlign,
              borderColor: element.showContentBorder !== false ? (element.borderColor || "#4A5568") : "transparent",
              padding: "8px",
              overflow: "auto",
              overflowY: "auto",
              height: `${paragraphHeight}px`,
              whiteSpace: "pre-wrap",
              wordWrap: "break-word",
              userSelect: "none",
              scrollbarWidth: "thin",
              scrollbarColor: "rgba(107, 114, 128, 0.6) rgba(229, 231, 235, 0.3)",
            }}
            onDoubleClick={handleContentDoubleClick}
          >
            {element.content || t("elements.section_block.content_placeholder")}
          </div>
        )}

        {/* Navigation Indicator */}
        {element.canNavigate && element.submapId && !isEditMode && (
          <div className="text-xs opacity-70 text-center">
            Clique duplo para navegar
          </div>
        )}
      </div>
    </DraggableElementWrapper>
  );
}

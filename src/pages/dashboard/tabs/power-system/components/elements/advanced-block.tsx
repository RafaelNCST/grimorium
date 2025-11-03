import { useState, useRef, useEffect } from "react";

import { ImageIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { IAdvancedBlock } from "../../types/power-system-types";

import { DraggableElementWrapper } from "./draggable-element-wrapper";

interface PropsAdvancedBlock {
  element: IAdvancedBlock;
  isSelected: boolean;
  isEditMode: boolean;
  gridEnabled: boolean;
  gridSize: number;
  onUpdate: (updates: Partial<IAdvancedBlock>) => void;
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
  isHandMode?: boolean;
  hasCreationToolActive?: boolean;
}

// Constantes
const BLOCK_WIDTH = 400;
const BLOCK_HEIGHT = 350;
const IMAGE_SIZE = 80;
const TITLE_FONT_SIZE = 16;
const PARAGRAPH_FONT_SIZE = 12;
const BLOCK_PADDING = 16;
const GAP = 12;

// Função para calcular altura de 1 linha baseada no fontSize
const calculateSingleLineHeight = (fontSize: number) => {
  const lineHeight = 1.2;
  const padding = 16; // 8px top + 8px bottom
  return Math.ceil(fontSize * lineHeight) + padding;
};

export function AdvancedBlock({
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
  hasCreationToolActive = false,
}: PropsAdvancedBlock) {
  const { t } = useTranslation("power-system");

  // Estados de edição
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingParagraph, setIsEditingParagraph] = useState(false);
  const [title, setTitle] = useState(element.title);
  const [paragraph, setParagraph] = useState(element.paragraph);

  // Refs
  const titleRef = useRef<HTMLTextAreaElement>(null);
  const paragraphRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Display dimensions
  const displayWidth = BLOCK_WIDTH;
  const displayHeight = BLOCK_HEIGHT;

  // Calcular altura do título (sempre 1 linha)
  const titleHeight = calculateSingleLineHeight(
    element.titleFontSize || TITLE_FONT_SIZE
  );

  // Calcular altura do parágrafo (restante da altura)
  const paragraphHeight =
    BLOCK_HEIGHT - BLOCK_PADDING * 2 - IMAGE_SIZE - titleHeight - GAP * 2;

  // Sync local state
  useEffect(() => {
    setTitle(element.title);
    setParagraph(element.paragraph);
  }, [element.title, element.paragraph]);

  // Auto-focus quando entrar em edição
  useEffect(() => {
    if (isEditingTitle && titleRef.current) {
      titleRef.current.focus();
    }
  }, [isEditingTitle]);

  useEffect(() => {
    if (isEditingParagraph && paragraphRef.current) {
      paragraphRef.current.focus();
    }
  }, [isEditingParagraph]);

  // Handlers
  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    onUpdate({ title: newTitle });
  };

  const handleParagraphChange = (newParagraph: string) => {
    setParagraph(newParagraph);
    onUpdate({ paragraph: newParagraph });
  };

  const handleTitleBlur = () => {
    onUpdate({ title });
    setIsEditingTitle(false);
  };

  const handleParagraphBlur = () => {
    onUpdate({ paragraph });
    setIsEditingParagraph(false);
  };

  const handleTitleDoubleClick = (e: React.MouseEvent) => {
    if (isEditMode) {
      e.stopPropagation();
      setIsEditingTitle(true);
    }
  };

  const handleParagraphDoubleClick = (e: React.MouseEvent) => {
    if (isEditMode) {
      e.stopPropagation();
      setIsEditingParagraph(true);
    }
  };

  const handleDoubleClick = () => {
    if (element.canNavigate && onNavigate && !isEditMode) {
      onNavigate();
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        onUpdate({ imageUrl: event.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isEditMode && isSelected) {
      fileInputRef.current?.click();
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

  // Obter estilos da imagem com base na forma
  const getImageStyles = (): React.CSSProperties => {
    const baseStyles: React.CSSProperties = {
      width: `${IMAGE_SIZE}px`,
      height: `${IMAGE_SIZE}px`,
      objectFit: "cover",
      userSelect: "none",
      border:
        element.showImageBorder !== false && element.borderColor
          ? `2px solid ${element.borderColor}`
          : "2px solid transparent",
    };

    switch (element.imageShape) {
      case "circle":
        return {
          ...baseStyles,
          borderRadius: "50%",
        };
      case "rounded-square":
        return {
          ...baseStyles,
          borderRadius: "8px",
        };
      case "diamond":
        return {
          ...baseStyles,
          borderRadius: "4px",
          transform: "rotate(45deg)",
        };
      default:
        return baseStyles;
    }
  };

  // Obter estilos do container da imagem (para compensar a rotação do losango)
  const getImageContainerStyles = (): React.CSSProperties => {
    const baseStyles: React.CSSProperties = {
      width: `${IMAGE_SIZE}px`,
      height: `${IMAGE_SIZE}px`,
      flexShrink: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
    };

    if (element.imageShape === "diamond") {
      return {
        ...baseStyles,
        width: `${IMAGE_SIZE}px`,
        height: `${IMAGE_SIZE}px`,
      };
    }

    return baseStyles;
  };

  // Obter justifyContent baseado na posição da imagem
  const getImageJustifyContent = () => {
    switch (element.imagePosition) {
      case "start":
        return "flex-start";
      case "end":
        return "flex-end";
      case "center":
      default:
        return "center";
    }
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
      isEditing={isEditingTitle || isEditingParagraph}
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
      minWidth={400}
      maxWidth={400}
      minHeight={350}
      maxHeight={350}
      disableVerticalResize
      disableDrag={isMultiSelected}
      disableResize
      isBlockElement
      hasCreationToolActive={hasCreationToolActive}
    >
      <div
        id={`element-${element.id}`}
        className="h-full w-full"
        style={{
          backgroundColor: element.backgroundColor,
          padding: `${BLOCK_PADDING}px`,
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          gap: `${GAP}px`,
          border: "1px solid rgba(0, 0, 0, 0.2)",
        }}
      >
        {/* Image Area */}
        <div
          className="w-full flex"
          style={{
            justifyContent: getImageJustifyContent(),
          }}
        >
          <div
            style={getImageContainerStyles()}
            onDoubleClick={handleImageDoubleClick}
            className={`cursor-pointer ${!element.imageUrl ? "opacity-40" : ""}`}
          >
            {element.imageUrl ? (
              <img
                src={element.imageUrl}
                alt={element.title || "Info image"}
                style={getImageStyles()}
                draggable={false}
                onMouseDown={(e) => e.preventDefault()}
              />
            ) : (
              <div
                className="flex items-center justify-center"
                style={{
                  ...getImageStyles(),
                  backgroundColor: "rgba(0, 0, 0, 0.05)",
                }}
              >
                <ImageIcon
                  className="w-8 h-8"
                  style={{
                    color: element.textColor,
                    transform:
                      element.imageShape === "diamond"
                        ? "rotate(-45deg)"
                        : "none",
                  }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Title Area - Sempre 1 linha com tooltip */}
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
            spellCheck={false}
            className="font-mono bg-transparent border rounded font-semibold focus:outline-none resize-none w-full scrollbar-hide"
            style={{
              fontSize: `${element.titleFontSize || TITLE_FONT_SIZE}px`,
              lineHeight: "1.2",
              textAlign: element.titleAlign,
              color: element.textColor,
              borderColor: element.borderColor || "#4A5568",
              padding: "8px",
              overflow: "hidden",
              overflowX: "auto",
              height: `${titleHeight}px`,
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
                className={`font-mono w-full font-semibold rounded border ${!element.title ? "opacity-40" : ""}`}
                style={{
                  fontSize: `${element.titleFontSize || TITLE_FONT_SIZE}px`,
                  lineHeight: "1.2",
                  textAlign: element.titleAlign,
                  borderColor: element.borderColor || "#4A5568",
                  padding: "8px",
                  overflow: "hidden",
                  height: `${titleHeight}px`,
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                  userSelect: "none",
                  color: element.textColor,
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
                avoidCollisions
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

        {/* Paragraph Area - Scroll vertical */}
        {isEditingParagraph && isEditMode ? (
          <textarea
            ref={paragraphRef}
            value={paragraph}
            onChange={(e) => handleParagraphChange(e.target.value)}
            onBlur={handleParagraphBlur}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                setParagraph(element.paragraph);
                setIsEditingParagraph(false);
              }
            }}
            spellCheck={false}
            className="font-mono bg-transparent border rounded focus:outline-none resize-none w-full [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-200/30 [&::-webkit-scrollbar-thumb]:bg-gray-500/60 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-gray-600/70"
            style={{
              fontSize: `${element.paragraphFontSize || PARAGRAPH_FONT_SIZE}px`,
              lineHeight: "1.5",
              textAlign: element.paragraphAlign,
              color: element.textColor,
              borderColor: element.borderColor || "#4A5568",
              padding: "8px",
              overflow: "auto",
              overflowY: "auto",
              height: `${paragraphHeight}px`,
              scrollbarWidth: "thin",
              scrollbarColor:
                "rgba(107, 114, 128, 0.6) rgba(229, 231, 235, 0.3)",
            }}
            placeholder={
              t("elements.paragraph_block.content_placeholder") ||
              "Texto do parágrafo..."
            }
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <div
            className={`font-mono w-full rounded border ${!element.paragraph ? "opacity-40" : ""} [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-200/30 [&::-webkit-scrollbar-thumb]:bg-gray-500/60 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-gray-600/70`}
            style={{
              fontSize: `${element.paragraphFontSize || PARAGRAPH_FONT_SIZE}px`,
              lineHeight: "1.5",
              textAlign: element.paragraphAlign,
              borderColor: element.borderColor || "#4A5568",
              padding: "8px",
              overflow: "auto",
              overflowY: "auto",
              height: `${paragraphHeight}px`,
              whiteSpace: "pre-wrap",
              wordWrap: "break-word",
              userSelect: "none",
              color: element.textColor,
              scrollbarWidth: "thin",
              scrollbarColor:
                "rgba(107, 114, 128, 0.6) rgba(229, 231, 235, 0.3)",
            }}
            onDoubleClick={handleParagraphDoubleClick}
          >
            {element.paragraph ||
              t("elements.paragraph_block.content_placeholder") ||
              "Texto do parágrafo..."}
          </div>
        )}

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageSelect}
        />

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

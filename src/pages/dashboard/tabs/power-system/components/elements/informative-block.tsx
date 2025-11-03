import { useState, useRef, useEffect } from "react";

import {
  Info,
  AlertTriangle,
  Check,
  Star,
  Lightbulb,
  Bookmark,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import { IInformativeBlock } from "../../types/power-system-types";

import { DraggableElementWrapper } from "./draggable-element-wrapper";

interface PropsInformativeBlock {
  element: IInformativeBlock;
  isSelected: boolean;
  isEditMode: boolean;
  gridEnabled: boolean;
  gridSize: number;
  onUpdate: (updates: Partial<IInformativeBlock>) => void;
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
  hasCreationToolActive?: boolean;
}

// Constantes
const BLOCK_WIDTH = 800;
const MIN_HEIGHT = 50; // Altura mínima (~1 linha com padding)
const ICON_SIZE = 20;
const HORIZONTAL_PADDING = 16;
const VERTICAL_PADDING = 12;
const ICON_GAP = 12; // Espaço entre ícone e texto

export function InformativeBlock({
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
  hasCreationToolActive = false,
}: PropsInformativeBlock) {
  const { t } = useTranslation("power-system");
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(element.content);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);

  // Calcular altura dinâmica baseada no conteúdo
  const calculateHeight = () => {
    if (measureRef.current) {
      const textWidth = BLOCK_WIDTH - HORIZONTAL_PADDING * 2 - ICON_SIZE - ICON_GAP;
      measureRef.current.style.width = `${textWidth}px`;
      const scrollHeight = measureRef.current.scrollHeight;
      return Math.max(MIN_HEIGHT, scrollHeight + VERTICAL_PADDING * 2);
    }
    return MIN_HEIGHT;
  };

  const displayHeight = calculateHeight();

  // Sync local state
  useEffect(() => {
    setContent(element.content);
  }, [element.content]);

  // Auto-focus when editing
  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isEditing]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [content, isEditing]);

  // Handle content change
  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    onUpdate({ content: newContent });
  };

  // Handle blur (save)
  const handleBlur = () => {
    onUpdate({ content });
    setIsEditing(false);
  };

  // Handle double click to edit
  const handleDoubleClick = () => {
    if (isEditMode && !element.canNavigate) {
      setIsEditing(true);
    } else if (element.canNavigate && onNavigate && !isEditMode) {
      onNavigate();
    }
  };

  // Get icon component based on element.icon
  const getIconComponent = () => {
    const iconProps = {
      size: ICON_SIZE,
      style: { color: element.iconColor, flexShrink: 0 },
    };

    switch (element.icon) {
      case "info":
        return <Info {...iconProps} />;
      case "warning":
        return <AlertTriangle {...iconProps} />;
      case "check":
        return <Check {...iconProps} />;
      case "star":
        return <Star {...iconProps} />;
      case "lightbulb":
        return <Lightbulb {...iconProps} />;
      case "bookmark":
        return <Bookmark {...iconProps} />;
      default:
        return <Info {...iconProps} />;
    }
  };

  return (
    <DraggableElementWrapper
      id={element.id}
      x={element.x}
      y={element.y}
      width={BLOCK_WIDTH}
      height={displayHeight}
      isSelected={isSelected}
      isEditMode={isEditMode}
      isEditing={isEditing}
      onPositionChange={onPositionChange}
      onSizeChange={onSizeChange}
      onDragMove={onDragMove}
      onDragEnd={onDragEnd}
      onResizeMove={onResizeMove}
      onResizeEnd={onResizeEnd}
      onClick={onClick}
      onDoubleClick={handleDoubleClick}
      gridEnabled={gridEnabled}
      gridSize={gridSize}
      elementType="text"
      zoom={zoom}
      minWidth={BLOCK_WIDTH}
      maxWidth={BLOCK_WIDTH}
      minHeight={MIN_HEIGHT}
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
          padding: `${VERTICAL_PADDING}px ${HORIZONTAL_PADDING}px`,
          boxSizing: "border-box",
          display: "flex",
          alignItems: "flex-start",
          gap: `${ICON_GAP}px`,
          border: "1px solid rgba(0, 0, 0, 0.2)",
        }}
      >
        {/* Icon */}
        <div style={{ marginTop: "2px" }}>{getIconComponent()}</div>

        {/* Content Area */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Hidden measure div for height calculation */}
          <div
            ref={measureRef}
            style={{
              position: "absolute",
              visibility: "hidden",
              whiteSpace: "pre-wrap",
              wordWrap: "break-word",
              fontSize: "16px",
              lineHeight: "1.5",
              fontFamily: "monospace",
            }}
          >
            {content || " "}
          </div>

          {isEditing && isEditMode ? (
            <textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => handleContentChange(e.target.value)}
              onBlur={handleBlur}
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  setContent(element.content);
                  setIsEditing(false);
                }
              }}
              spellCheck={false}
              className="font-mono bg-transparent focus:outline-none resize-none w-full"
              style={{
                fontSize: "16px",
                lineHeight: "1.5",
                textAlign: "left",
                color: element.textColor,
                border: "none",
                padding: 0,
                overflow: "hidden",
              }}
              placeholder={t("elements.informative_block.content_placeholder")}
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <div
              className={`font-mono w-full ${!element.content ? "opacity-40" : ""}`}
              style={{
                fontSize: "16px",
                lineHeight: "1.5",
                textAlign: "left",
                color: element.textColor,
                whiteSpace: "pre-wrap",
                wordWrap: "break-word",
                userSelect: "none",
              }}
              onDoubleClick={(e) => {
                e.stopPropagation();
                if (isEditMode) setIsEditing(true);
              }}
            >
              {element.content ||
                t("elements.informative_block.content_placeholder")}
            </div>
          )}
        </div>
      </div>

      {/* Navigation Indicator */}
      {element.canNavigate && element.submapId && !isEditMode && (
        <div
          className="text-xs opacity-70 text-center"
          style={{ marginTop: "4px" }}
        >
          Clique duplo para navegar
        </div>
      )}
    </DraggableElementWrapper>
  );
}

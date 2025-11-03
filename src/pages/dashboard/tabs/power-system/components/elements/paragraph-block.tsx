import { useState, useRef, useEffect } from "react";

import { useTranslation } from "react-i18next";

import { IParagraphBlock } from "../../types/power-system-types";

import { DraggableElementWrapper } from "./draggable-element-wrapper";

interface PropsParagraphBlock {
  element: IParagraphBlock;
  isSelected: boolean;
  isEditMode: boolean;
  gridEnabled: boolean;
  gridSize: number;
  onUpdate: (updates: Partial<IParagraphBlock>) => void;
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

export function ParagraphBlock({
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
}: PropsParagraphBlock) {
  const { t } = useTranslation("power-system");
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(element.content);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Display dimensions (use tempSize during resize for real-time feedback)
  const displayWidth = tempSize?.width ?? element.width;
  const FIXED_HEIGHT = 240; // Altura fixa igual ao SectionBlock

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

  // Handle horizontal resize
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
      height={FIXED_HEIGHT}
      isSelected={isSelected}
      isEditMode={isEditMode}
      isEditing={isEditing}
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
      minHeight={240}
      maxHeight={240}
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
          color: element.textColor,
          padding: "16px",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          border: "1px solid rgba(0, 0, 0, 0.2)",
        }}
      >
        {/* Content Area */}
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
            className="font-mono bg-transparent border rounded focus:outline-none resize-none w-full flex-1 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-200/30 [&::-webkit-scrollbar-thumb]:bg-gray-500/60 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-gray-600/70"
            style={{
              fontSize: `${element.fontSize}px`,
              lineHeight: "1.5",
              textAlign: element.textAlign,
              color: element.textColor,
              borderColor:
                element.showContentBorder !== false
                  ? element.borderColor || "#4A5568"
                  : "transparent",
              padding: "8px",
              overflow: "auto",
              overflowY: "auto",
              scrollbarWidth: "thin",
              scrollbarColor:
                "rgba(107, 114, 128, 0.6) rgba(229, 231, 235, 0.3)",
            }}
            placeholder={t("elements.paragraph_block.content_placeholder")}
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <div
            className={`font-mono w-full flex-1 rounded border ${!element.content ? "opacity-40" : ""} [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-200/30 [&::-webkit-scrollbar-thumb]:bg-gray-500/60 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-gray-600/70`}
            style={{
              fontSize: `${element.fontSize}px`,
              lineHeight: "1.5",
              textAlign: element.textAlign,
              borderColor:
                element.showContentBorder !== false
                  ? element.borderColor || "#4A5568"
                  : "transparent",
              padding: "8px",
              overflow: "auto",
              overflowY: "auto",
              whiteSpace: "pre-wrap",
              wordWrap: "break-word",
              userSelect: "none",
              scrollbarWidth: "thin",
              scrollbarColor:
                "rgba(107, 114, 128, 0.6) rgba(229, 231, 235, 0.3)",
            }}
            onDoubleClick={(e) => {
              e.stopPropagation();
              if (isEditMode) setIsEditing(true);
            }}
          >
            {element.content ||
              t("elements.paragraph_block.content_placeholder")}
          </div>
        )}

        {/* Navigation Indicator */}
        {element.canNavigate && element.submapId && !isEditMode && (
          <div className="text-xs opacity-70 text-center mt-2">
            Clique duplo para navegar
          </div>
        )}
      </div>
    </DraggableElementWrapper>
  );
}

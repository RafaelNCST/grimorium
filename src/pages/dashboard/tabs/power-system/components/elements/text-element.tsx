import { useState, useRef, useEffect } from "react";

import { useTranslation } from "react-i18next";

import { ITextElement } from "../../types/power-system-types";

import { DraggableElementWrapper } from "./draggable-element-wrapper";

// Clean helper function to measure text dimensions
function measureTextDimensions(
  text: string,
  fontSize: number,
  fontWeight: string,
  maxWidth?: number
): { width: number; height: number } {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  if (!context) return { width: 50, height: 24 };

  context.font = `${fontWeight} ${fontSize}px Inter, system-ui, sans-serif`;

  const lineHeight = fontSize * 1.5;
  const horizontalPadding = 8;
  const verticalPadding = 8;

  // Empty text - return minimum size (just cursor space)
  if (!text || text.trim().length === 0) {
    return {
      width: 16,
      height: Math.max(Math.ceil(lineHeight) + verticalPadding, 24),
    };
  }

  const lines = text.split("\n");

  // No maxWidth - calculate natural width WITHOUT wrapping
  if (!maxWidth) {
    let maxLineWidth = 0;
    lines.forEach((line) => {
      if (line.length === 0) {
        maxLineWidth = Math.max(maxLineWidth, fontSize);
      } else {
        const metrics = context.measureText(line);
        maxLineWidth = Math.max(maxLineWidth, metrics.width);
      }
    });

    return {
      width: Math.max(Math.ceil(maxLineWidth) + horizontalPadding, 16),
      height: Math.max(
        Math.ceil(lines.length * lineHeight) + verticalPadding,
        24
      ),
    };
  }

  // With maxWidth - calculate WITH line wrapping
  const contentWidth = Math.max(maxWidth - horizontalPadding, 8);
  let totalLines = 0;

  lines.forEach((line) => {
    if (line.length === 0) {
      totalLines += 1;
    } else {
      const words = line.split(" ");
      let currentLine = "";
      let lineCount = 0;

      words.forEach((word) => {
        const wordWidth = context.measureText(word).width;

        if (wordWidth > contentWidth) {
          // Word is too long, break it character by character
          if (currentLine) {
            lineCount++;
            currentLine = "";
          }

          let remainingWord = word;
          while (remainingWord.length > 0) {
            let chunk = "";
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
          const testLine = currentLine + (currentLine ? " " : "") + word;
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

  const calculatedHeight = Math.max(
    Math.ceil(totalLines * lineHeight) + verticalPadding,
    24
  );

  return {
    width: maxWidth,
    height: calculatedHeight,
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
  onResizeMove?: (width: number, height: number, mode?: "horizontal") => void;
  onResizeEnd?: (mode?: "horizontal") => void;
  onClick: (e?: React.MouseEvent) => void;
  isMultiSelected?: boolean;
  tempSize?: { width: number; height: number };
  onFirstInput?: () => void;
  hasCreationToolActive?: boolean;
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
  hasCreationToolActive = false,
}: PropsTextElement) {
  const { t } = useTranslation("power-system");
  const [isEditing, setIsEditing] = useState(element.content === "");
  const [content, setContent] = useState(element.content);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Display dimensions (use tempSize during resize for real-time feedback)
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

  // Get font weight string for measurement
  const getFontWeight = () =>
    element.fontWeight === "bold" ? "bold" : "normal";

  // Handle content change
  const handleContentChange = (newContent: string) => {
    setContent(newContent);

    // First input callback
    if (element.content === "" && newContent.length === 1 && onFirstInput) {
      onFirstInput();
    }

    // Empty content - don't update dimensions
    if (newContent.trim().length === 0) {
      onUpdate({ content: newContent });
      return;
    }

    // Calculate new dimensions based on manual resize state
    const dimensions = measureTextDimensions(
      newContent,
      element.fontSize,
      getFontWeight(),
      element.wasManuallyResized ? element.width : undefined
    );

    // Update dimensions only if they changed
    if (
      dimensions.width !== element.width ||
      dimensions.height !== element.height
    ) {
      onUpdate({
        content: newContent,
        width: dimensions.width,
        height: dimensions.height,
      });
      onSizeChange(dimensions.width, dimensions.height);
    } else {
      onUpdate({ content: newContent });
    }
  };

  // Handle horizontal resize (width changes, height recalculates)
  const handleHorizontalResize = (newWidth: number) => {
    if (!element.content || element.content.trim().length === 0) {
      onUpdate({
        width: Math.max(newWidth, 16),
        wasManuallyResized: true,
      });
      onSizeChange(Math.max(newWidth, 16), element.height);
      return;
    }

    const dimensions = measureTextDimensions(
      element.content,
      element.fontSize,
      getFontWeight(),
      newWidth
    );

    onUpdate({
      width: dimensions.width,
      height: dimensions.height,
      wasManuallyResized: true,
    });
    onSizeChange(dimensions.width, dimensions.height);
  };

  // Handle resize move (real-time feedback during resize)
  const handleResizeMove = (
    newWidth: number,
    newHeight: number,
    mode?: "horizontal"
  ) => {
    if (!element.content || element.content.trim().length === 0) {
      onResizeMove?.(Math.max(newWidth, 16), Math.max(newHeight, 24), mode);
      return;
    }

    // Only horizontal resize: width changes, height recalculates
    // Clamp width between min and max
    const widthLimits = calculateWidthLimits();
    const clampedWidth = Math.max(
      widthLimits.minWidth,
      Math.min(widthLimits.maxWidth, newWidth)
    );

    const dimensions = measureTextDimensions(
      element.content,
      element.fontSize,
      getFontWeight(),
      clampedWidth
    );

    onResizeMove?.(dimensions.width, dimensions.height, mode);
  };

  // Handle resize end
  const handleResizeEnd = (mode?: "horizontal") => {
    if (tempSize) {
      handleHorizontalResize(tempSize.width);
    }
    onResizeEnd?.(mode);
  };

  // Handle blur (deselect)
  const handleBlur = () => {
    // Empty content - mark for deletion
    if (content.trim().length === 0 && element.content === "") {
      onUpdate({ content: "__DELETE__" });
    } else if (content.trim().length > 0) {
      // Save content
      const dimensions = measureTextDimensions(
        content,
        element.fontSize,
        getFontWeight(),
        element.wasManuallyResized ? element.width : undefined
      );

      onUpdate({
        content,
        width: dimensions.width,
        height: dimensions.height,
      });
      onSizeChange(dimensions.width, dimensions.height);
      setIsEditing(false);
    }
  };

  // Handle double click to edit
  const handleDoubleClick = () => {
    if (!element.canNavigate && isEditMode) {
      setIsEditing(true);
    }
  };

  // Calculate minimum and maximum width based on content
  const calculateWidthLimits = (): { minWidth: number; maxWidth: number } => {
    if (!element.content || element.content.length === 0) {
      return { minWidth: 16, maxWidth: 200 };
    }

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    if (!context) return { minWidth: 16, maxWidth: 200 };

    context.font = `${getFontWeight()} ${element.fontSize}px Inter, system-ui, sans-serif`;

    // Calculate minimum width: widest single character
    let maxCharWidth = 0;
    for (let i = 0; i < element.content.length; i++) {
      const char = element.content[i];
      if (char !== "\n" && char !== " ") {
        const charWidth = context.measureText(char).width;
        maxCharWidth = Math.max(maxCharWidth, charWidth);
      }
    }
    const minWidth = Math.max(16, Math.ceil(maxCharWidth) + 8);

    // Calculate maximum width: natural width without wrapping
    const naturalDimensions = measureTextDimensions(
      element.content,
      element.fontSize,
      getFontWeight()
      // No maxWidth parameter = natural width calculation
    );
    const maxWidth = naturalDimensions.width;

    return { minWidth, maxWidth };
  };

  // Size limits
  const widthLimits = calculateWidthLimits();
  const sizeLimits = {
    minWidth: widthLimits.minWidth,
    maxWidth: widthLimits.maxWidth,
    minHeight: Math.max(element.fontSize * 1.5 + 8, 24),
    maxHeight: Infinity,
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
      minWidth={sizeLimits.minWidth}
      maxWidth={sizeLimits.maxWidth}
      minHeight={sizeLimits.minHeight}
      maxHeight={sizeLimits.maxHeight}
      disableVerticalResize
      disableDrag={isMultiSelected}
      disableResize={isMultiSelected}
      hasCreationToolActive={hasCreationToolActive}
    >
      <div
        className="h-full w-full"
        style={{
          padding: "4px",
          color: element.textColor,
          display: "flex",
          alignItems: element.textAlign === "center" ? "center" : "flex-start",
          justifyContent:
            element.textAlign === "center"
              ? "center"
              : element.textAlign === "right"
                ? "flex-end"
                : "flex-start",
          boxSizing: "border-box",
        }}
      >
        {isEditing && isEditMode ? (
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => handleContentChange(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                if (element.content === "" && content.trim().length === 0) {
                  onUpdate({ content: "__DELETE__" });
                } else {
                  setContent(element.content);
                  setIsEditing(false);
                }
              }
            }}
            spellCheck={false}
            className="bg-transparent focus:outline-none resize-none border-none w-full h-full"
            style={{
              fontSize: `${element.fontSize}px`,
              fontWeight: element.fontWeight === "bold" ? "bold" : "normal",
              textDecoration:
                element.fontWeight === "underline" ? "underline" : "none",
              textAlign: element.textAlign,
              color: element.textColor,
              caretColor: element.textColor,
              wordWrap: "break-word",
              overflowWrap: "break-word",
              whiteSpace: "pre-wrap",
              overflow: "hidden",
            }}
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <div
            className={`w-full h-full ${isEditMode ? "" : "cursor-grab select-none"}`}
            style={{
              fontSize: `${element.fontSize}px`,
              fontWeight: element.fontWeight === "bold" ? "bold" : "normal",
              textDecoration:
                element.fontWeight === "underline" ? "underline" : "none",
              textAlign: element.textAlign,
              whiteSpace: "pre-wrap",
              wordWrap: "break-word",
              overflowWrap: "break-word",
              overflow: "hidden",
              userSelect: "none",
            }}
          >
            {element.content || t("elements.text.default_content")}
          </div>
        )}
      </div>
    </DraggableElementWrapper>
  );
}

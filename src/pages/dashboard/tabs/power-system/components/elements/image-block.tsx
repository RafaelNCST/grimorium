import { useState, useRef, useEffect } from "react";

import { ImageIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

import { IImageBlock } from "../../types/power-system-types";

import { DraggableElementWrapper } from "./draggable-element-wrapper";

interface PropsImageBlock {
  element: IImageBlock;
  isSelected: boolean;
  isEditMode: boolean;
  gridEnabled: boolean;
  gridSize: number;
  onUpdate: (updates: Partial<IImageBlock>) => void;
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
}

export function ImageBlock({
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
}: PropsImageBlock) {
  const { t } = useTranslation("power-system");
  const [isEditingCaption, setIsEditingCaption] = useState(false);
  const [caption, setCaption] = useState(element.caption);
  const [isCropMode, setIsCropMode] = useState(false);
  const [isDraggingImage, setIsDraggingImage] = useState(false);
  const [dragStartPos, setDragStartPos] = useState<{ x: number; y: number } | null>(null);
  const [tileImageSize, setTileImageSize] = useState<{ width: number; height: number } | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  // Constants for simplified height calculation
  const LINE_HEIGHT = 1.2;
  const FONT_SIZE = element.captionFontSize;
  const PADDING = 8;
  const MAX_HEIGHT = 95; // Fixed height limit in pixels
  const BLOCK_PADDING = 16;
  const GAP = 12;
  const DEFAULT_IMAGE_AREA_HEIGHT = 300; // Default if not specified

  // Use custom image area height or default
  const imageAreaHeight = element.imageAreaHeight ?? DEFAULT_IMAGE_AREA_HEIGHT;

  // Caption always reserves MAX_HEIGHT space
  const captionHeight = MAX_HEIGHT;

  // Calculate total block height based on image area height
  const totalBlockHeight = BLOCK_PADDING * 2 + imageAreaHeight + GAP + captionHeight;

  // Display dimensions (use tempSize during resize for real-time feedback)
  const displayWidth = tempSize?.width ?? element.width;
  const displayHeight = totalBlockHeight;

  // Sync local state
  useEffect(() => {
    setCaption(element.caption);
  }, [element.caption]);

  // Auto-focus when editing caption
  useEffect(() => {
    if (isEditingCaption && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isEditingCaption]);

  // Activate crop mode when imageMode is set to "crop"
  useEffect(() => {
    if (element.imageMode === "crop" && isSelected) {
      setIsCropMode(true);
    } else {
      setIsCropMode(false);
    }
  }, [element.imageMode, isSelected]);

  // Calculate tile image size in fit mode
  useEffect(() => {
    if (element.imageMode === "tile" && element.imageUrl && imageContainerRef.current) {
      const img = new Image();
      img.onload = () => {
        const containerWidth = imageContainerRef.current?.clientWidth || imageAreaHeight;
        const containerHeight = imageContainerRef.current?.clientHeight || imageAreaHeight;

        const imageRatio = img.naturalWidth / img.naturalHeight;
        const containerRatio = containerWidth / containerHeight;

        let width, height;
        if (imageRatio > containerRatio) {
          // Image is wider than container
          width = containerWidth;
          height = containerWidth / imageRatio;
        } else {
          // Image is taller than container
          height = containerHeight;
          width = containerHeight * imageRatio;
        }

        setTileImageSize({ width, height });
      };
      img.src = element.imageUrl;
    } else {
      setTileImageSize(null);
    }
  }, [element.imageMode, element.imageUrl, imageAreaHeight]);

  // Handle image dragging in crop mode
  useEffect(() => {
    if (!isDraggingImage || !dragStartPos) return;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - dragStartPos.x;
      const deltaY = e.clientY - dragStartPos.y;

      onUpdate({
        imageOffsetX: (element.imageOffsetX || 0) + deltaX / zoom,
        imageOffsetY: (element.imageOffsetY || 0) + deltaY / zoom,
      });

      setDragStartPos({ x: e.clientX, y: e.clientY });
    };

    const handleMouseUp = () => {
      setIsDraggingImage(false);
      setDragStartPos(null);
      // Exit crop mode when mouse is released
      setIsCropMode(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDraggingImage, dragStartPos, element.imageOffsetX, element.imageOffsetY, zoom, onUpdate]);

  // Handle caption change
  const handleCaptionChange = (newCaption: string) => {
    setCaption(newCaption);
  };

  // Handle blur (save caption)
  const handleBlur = () => {
    onUpdate({ caption });
    setIsEditingCaption(false);
  };

  // Handle double click to edit caption
  const handleCaptionDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isEditMode) {
      setIsEditingCaption(true);
    }
  };

  // Handle image upload
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

  // Handle double click on image area
  const handleImageDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (element.canNavigate && onNavigate && !isEditMode) {
      onNavigate();
    }
  };

  // Handle navigation double click
  const handleDoubleClick = () => {
    if (element.canNavigate && onNavigate && !isEditMode) {
      onNavigate();
    }
  };

  // Handle image mouse down for crop mode
  const handleImageMouseDown = (e: React.MouseEvent) => {
    if (isCropMode && element.imageUrl) {
      e.stopPropagation();
      setIsDraggingImage(true);
      setDragStartPos({ x: e.clientX, y: e.clientY });
    }
  };

  // Get image styles based on mode
  const getImageStyles = (): React.CSSProperties => {
    const mode = element.imageMode || "fill";
    const baseStyles: React.CSSProperties = {
      userSelect: "none",
      display: "block",
    };

    switch (mode) {
      case "fill":
        return {
          ...baseStyles,
          position: "absolute",
          top: "50%",
          left: "50%",
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: isCropMode
            ? `translate(calc(-50% + ${element.imageOffsetX || 0}px), calc(-50% + ${element.imageOffsetY || 0}px))`
            : "translate(-50%, -50%)",
        };

      case "fit":
        return {
          ...baseStyles,
          position: "absolute",
          top: "50%",
          left: "50%",
          maxWidth: "100%",
          maxHeight: "100%",
          objectFit: "contain",
          transform: "translate(-50%, -50%)",
        };

      case "tile":
        return {
          ...baseStyles,
          width: "auto",
          height: "auto",
          maxWidth: "none",
          maxHeight: "none",
        };

      case "crop":
        return {
          ...baseStyles,
          position: "absolute",
          top: "50%",
          left: "50%",
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `translate(calc(-50% + ${element.imageOffsetX || 0}px), calc(-50% + ${element.imageOffsetY || 0}px))`,
          cursor: isCropMode ? "move" : "default",
        };

      default:
        return baseStyles;
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
      height={displayHeight}
      isSelected={isSelected}
      isEditMode={isEditMode}
      isEditing={isEditingCaption}
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
      disableVerticalResize={true}
      disableDrag={isMultiSelected}
      disableResize={true}
      isBlockElement={true}
    >
      <div
        id={`element-${element.id}`}
        className="h-full w-full rounded-[2px] flex flex-col"
        style={{
          backgroundColor: element.backgroundColor,
          padding: "16px",
          boxSizing: "border-box",
        }}
      >
        {/* Image Area */}
        <div
          ref={imageContainerRef}
          className="flex-1 rounded border mb-3 overflow-hidden relative"
          style={{
            borderColor: element.borderColor || "#4A5568",
          }}
          onDoubleClick={handleImageDoubleClick}
        >
          {element.imageUrl && element.imageMode === "tile" && tileImageSize ? (
            <div
              style={{
                width: "100%",
                height: "100%",
                backgroundImage: `url(${element.imageUrl})`,
                backgroundRepeat: "repeat",
                backgroundSize: `${tileImageSize.width}px ${tileImageSize.height}px`,
                backgroundPosition: "center top",
              }}
            />
          ) : element.imageUrl && element.imageMode !== "tile" ? (
            <img
              src={element.imageUrl}
              alt={element.caption || "Image"}
              style={getImageStyles()}
              onMouseDown={handleImageMouseDown}
              draggable={false}
            />
          ) : !element.imageUrl ? (
            <div
              className="w-full h-full flex items-center justify-center"
              style={{
                backgroundColor: "rgba(0, 0, 0, 0.05)",
              }}
            >
              <ImageIcon className="w-20 h-20 opacity-30" style={{ color: element.textColor }} />
            </div>
          ) : null}

          {/* Crop mode indicator */}
          {isCropMode && element.imageUrl && (
            <div
              className="absolute inset-0 border-2 border-blue-500 pointer-events-none"
              style={{
                boxShadow: "inset 0 0 0 2000px rgba(59, 130, 246, 0.1)",
              }}
            >
              <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                Arraste para enquadrar
              </div>
            </div>
          )}
        </div>

        {/* Caption Input */}
        {isEditingCaption && isEditMode ? (
          <textarea
            ref={textareaRef}
            value={caption}
            onChange={(e) => handleCaptionChange(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                setCaption(element.caption);
                setIsEditingCaption(false);
              }
            }}
            spellCheck={false}
            className="font-mono bg-transparent border rounded focus:outline-none resize-none w-full [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-200/30 [&::-webkit-scrollbar-thumb]:bg-gray-500/60 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-gray-600/70"
            style={{
              fontSize: `${element.captionFontSize}px`,
              lineHeight: `${LINE_HEIGHT}`,
              textAlign: element.captionAlign,
              color: element.textColor,
              borderColor:
                element.showCaptionBorder !== false
                  ? element.borderColor || "#4A5568"
                  : "transparent",
              padding: `${PADDING}px`,
              height: `${MAX_HEIGHT}px`,
              maxHeight: `${MAX_HEIGHT}px`,
              overflowY: 'auto',
              whiteSpace: 'pre-wrap',
              wordWrap: 'break-word',
              scrollbarWidth: "thin",
              scrollbarColor:
                "rgba(107, 114, 128, 0.6) rgba(229, 231, 235, 0.3)",
            }}
            placeholder={t("elements.image_block.caption_placeholder")}
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <div
            className={`font-mono w-full rounded border [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-200/30 [&::-webkit-scrollbar-thumb]:bg-gray-500/60 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-gray-600/70 ${!element.caption ? "opacity-40" : ""}`}
            style={{
              fontSize: `${element.captionFontSize}px`,
              lineHeight: `${LINE_HEIGHT}`,
              textAlign: element.captionAlign,
              borderColor:
                element.showCaptionBorder !== false
                  ? element.borderColor || "#4A5568"
                  : "transparent",
              padding: `${PADDING}px`,
              height: `${MAX_HEIGHT}px`,
              maxHeight: `${MAX_HEIGHT}px`,
              overflowY: 'auto',
              whiteSpace: "pre-wrap",
              wordWrap: "break-word",
              userSelect: "none",
              color: element.textColor,
              scrollbarWidth: "thin",
              scrollbarColor:
                "rgba(107, 114, 128, 0.6) rgba(229, 231, 235, 0.3)",
            }}
            onDoubleClick={handleCaptionDoubleClick}
          >
            {element.caption || t("elements.image_block.caption_placeholder")}
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
          <div className="text-xs opacity-70 text-center mt-2">
            Clique duplo para navegar
          </div>
        )}
      </div>
    </DraggableElementWrapper>
  );
}

import { useState, useRef, useEffect } from "react";

import { ImageIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

import { IImageBlock } from "../../types/power-system-types";
import { ImageFrameModal } from "../image-frame-modal";

import { DraggableElementWrapper } from "./draggable-element-wrapper";

import type { Area, Point } from "react-easy-crop";

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
  hasCreationToolActive?: boolean;
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
  hasCreationToolActive = false,
}: PropsImageBlock) {
  const { t } = useTranslation("power-system");
  const [isEditingCaption, setIsEditingCaption] = useState(false);
  const [caption, setCaption] = useState(element.caption);
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const [tileImageSize, setTileImageSize] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const [nativeImageSize, setNativeImageSize] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  // Constants for simplified height calculation
  const LINE_HEIGHT = 1.2;
  const PADDING = 8;
  const CAPTION_HEIGHT = 60; // Fixed height for caption
  const BLOCK_PADDING = 16;
  const GAP = 12;
  const DEFAULT_IMAGE_AREA_HEIGHT = 300; // Default if not specified

  // Use custom image area height or default
  const imageAreaHeight = element.imageAreaHeight ?? DEFAULT_IMAGE_AREA_HEIGHT;

  // Caption always reserves CAPTION_HEIGHT space
  const captionHeight = CAPTION_HEIGHT;

  // Calculate total block height based on image area height
  const totalBlockHeight =
    BLOCK_PADDING * 2 + imageAreaHeight + GAP + captionHeight;

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

  // Load native image size
  useEffect(() => {
    if (element.imageUrl) {
      const img = new Image();
      img.onload = () => {
        setNativeImageSize({
          width: img.naturalWidth,
          height: img.naturalHeight,
        });
      };
      img.src = element.imageUrl;
    } else {
      setNativeImageSize(null);
    }
  }, [element.imageUrl]);

  // Calculate tile image size in tile mode
  useEffect(() => {
    if (
      element.imageMode === "tile" &&
      element.imageUrl &&
      imageContainerRef.current
    ) {
      const img = new Image();
      img.onload = () => {
        const containerWidth =
          imageContainerRef.current?.clientWidth || imageAreaHeight;
        const containerHeight =
          imageContainerRef.current?.clientHeight || imageAreaHeight;

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
    } else if (
      isEditMode &&
      isSelected &&
      element.imageMode === "crop" &&
      element.imageUrl
    ) {
      setIsCropModalOpen(true);
    }
  };

  // Handle navigation double click
  const handleDoubleClick = () => {
    if (element.canNavigate && onNavigate && !isEditMode) {
      onNavigate();
    }
  };

  // Handle crop apply
  const handleCropApply = (crop: Point, zoom: number, croppedArea: Area) => {
    onUpdate({
      cropX: crop.x,
      cropY: crop.y,
      cropZoom: zoom,
      croppedArea: {
        x: croppedArea.x,
        y: croppedArea.y,
        width: croppedArea.width,
        height: croppedArea.height,
      },
    });
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
          transform: "translate(-50%, -50%)",
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
        // Use react-easy-crop data to display the cropped image
        if (!element.croppedArea || !nativeImageSize) {
          return {
            ...baseStyles,
            position: "absolute",
            top: "50%",
            left: "50%",
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: "translate(-50%, -50%)",
          };
        }

        const BORDER_WIDTH = 1;
        const containerWidth =
          displayWidth - BLOCK_PADDING * 2 - BORDER_WIDTH * 2;
        const containerHeight = imageAreaHeight - BORDER_WIDTH * 2;

        const { x, y, width, height } = element.croppedArea;

        // Calculate scale factors
        const scaleX = containerWidth / width;
        const scaleY = containerHeight / height;
        const scale = Math.max(scaleX, scaleY); // Use max to cover the container

        // Calculate new dimensions
        const scaledWidth = nativeImageSize.width * scale;
        const scaledHeight = nativeImageSize.height * scale;

        // Calculate offset to position the cropped area
        const offsetX = -x * scale;
        const offsetY = -y * scale;

        return {
          ...baseStyles,
          position: "absolute",
          top: 0,
          left: 0,
          width: `${scaledWidth}px`,
          height: `${scaledHeight}px`,
          transform: `translate(${offsetX}px, ${offsetY}px)`,
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

  // Calculate container dimensions for crop modal
  const BORDER_WIDTH = 1;
  const cropContainerWidth =
    displayWidth - BLOCK_PADDING * 2 - BORDER_WIDTH * 2;
  const cropContainerHeight = imageAreaHeight - BORDER_WIDTH * 2;

  return (
    <>
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
        disableVerticalResize
        disableDrag={isMultiSelected}
        disableResize
        isBlockElement
        hasCreationToolActive={hasCreationToolActive}
      >
        <div
          id={`element-${element.id}`}
          className="h-full w-full flex flex-col"
          style={{
            backgroundColor: element.backgroundColor,
            padding: "16px",
            boxSizing: "border-box",
            border: "1px solid rgba(0, 0, 0, 0.2)",
          }}
        >
          {/* Image Area */}
          <div
            ref={imageContainerRef}
            className={`flex-1 rounded mb-3 overflow-hidden relative select-none border-[1px] font-mono ${!element.caption ? "opacity-40" : ""}`}
            style={{
              borderColor:
                element.showImageBorder !== false
                  ? element.borderColor || "hsl(var(--border))"
                  : "transparent",
              WebkitUserSelect: "none",
              MozUserSelect: "none",
              msUserSelect: "none",
              userSelect: "none",
            }}
            onDoubleClick={handleImageDoubleClick}
            onMouseDown={(e) => {
              // Prevent text selection on container
              if (e.target === e.currentTarget) {
                e.preventDefault();
              }
            }}
          >
            {element.imageUrl &&
            element.imageMode === "tile" &&
            tileImageSize ? (
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
                style={{
                  ...getImageStyles(),
                  userSelect: "none",
                  WebkitUserSelect: "none",
                  MozUserSelect: "none",
                  msUserSelect: "none",
                  WebkitTouchCallout: "none",
                }}
                draggable={false}
                onMouseDown={(e) => e.preventDefault()}
              />
            ) : !element.imageUrl ? (
              <div
                className="w-full h-full flex items-center justify-center"
                style={{
                  backgroundColor: "rgba(0, 0, 0, 0.05)",
                }}
              >
                <ImageIcon
                  className="w-20 h-20 opacity-30"
                  style={{ color: element.textColor }}
                />
              </div>
            ) : null}
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
              className="font-mono bg-transparent border-[1px] rounded focus:outline-none resize-none w-full [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-200/30 [&::-webkit-scrollbar-thumb]:bg-gray-500/60 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-gray-600/70"
              style={{
                fontSize: `${element.captionFontSize}px`,
                lineHeight: `${LINE_HEIGHT}`,
                textAlign: element.captionAlign,
                color: element.textColor,
                borderColor: element.borderColor || "hsl(var(--border))",
                padding: `${PADDING}px`,
                height: "60px",
                maxHeight: "60px",
                overflowY: "auto",
                whiteSpace: "pre-wrap",
                wordWrap: "break-word",
                scrollbarWidth: "thin",
                scrollbarColor:
                  "rgba(107, 114, 128, 0.6) rgba(229, 231, 235, 0.3)",
              }}
              placeholder={t("elements.image_block.caption_placeholder")}
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <div
              className={`font-mono bg-transparent w-full rounded border-[1px] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-200/30 [&::-webkit-scrollbar-thumb]:bg-gray-500/60 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-gray-600/70 ${!element.caption ? "opacity-40" : ""}`}
              style={{
                fontSize: `${element.captionFontSize}px`,
                lineHeight: `${LINE_HEIGHT}`,
                textAlign: element.captionAlign,
                borderColor: element.borderColor || "hsl(var(--border))",
                padding: `${PADDING}px`,
                height: "60px",
                maxHeight: "60px",
                overflowY: "auto",
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

      {/* Crop Modal */}
      {element.imageUrl && (
        <ImageFrameModal
          open={isCropModalOpen}
          onOpenChange={setIsCropModalOpen}
          imageUrl={element.imageUrl}
          currentCrop={
            element.cropX !== undefined && element.cropY !== undefined
              ? { x: element.cropX, y: element.cropY }
              : undefined
          }
          currentZoom={element.cropZoom}
          containerWidth={cropContainerWidth}
          containerHeight={cropContainerHeight}
          onApply={handleCropApply}
        />
      )}
    </>
  );
}

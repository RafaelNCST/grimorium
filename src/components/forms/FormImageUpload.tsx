import { useState, useRef } from "react";

import { ImagePlus, Upload, LucideIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

import { GalleryPickerModal } from "@/components/modals/gallery-picker-modal";
import { ImageSourceDialog } from "@/components/modals/image-source-dialog";
import { Label } from "@/components/ui/label";

type ImageShape = "square" | "rounded" | "circle";
type ImageFit = "fill" | "cover" | "contain";
type SourceMode = "computer" | "both";

interface FormImageUploadProps {
  /**
   * Current image value (base64 or URL)
   */
  value?: string;
  /**
   * Callback when image changes
   */
  onChange: (value: string) => void;
  /**
   * Label for the field
   */
  label: string;
  /**
   * Optional subtitle/helper text
   */
  helperText?: string;
  /**
   * Whether the field is required
   */
  required?: boolean;
  /**
   * Height of the upload area (default: h-[28rem])
   */
  height?: string;
  /**
   * Width of the upload area (default: w-full)
   */
  width?: string;
  /**
   * Shape of the image container
   * - square: Bordas retas (default)
   * - rounded: Bordas arredondadas (rounded-lg)
   * - circle: Circular (rounded-full, requer width/height iguais)
   */
  shape?: ImageShape;
  /**
   * How the image should fit in the container
   * - fill: Preenche todo o espaço (pode distorcer)
   * - cover: Cobre todo o espaço (pode cortar)
   * - contain: Mantém proporção (pode ter espaços vazios)
   */
  imageFit?: ImageFit;
  /**
   * Icon component to show in placeholder (default: ImagePlus)
   */
  placeholderIcon?: LucideIcon;
  /**
   * Text to show in placeholder (optional - default: no text, only icon)
   */
  placeholderText?: string;
  /**
   * Size of placeholder text (default: text-sm)
   */
  placeholderTextSize?: string;
  /**
   * Accepted file types
   */
  accept?: string;
  /**
   * Optional error message
   */
  error?: string;
  /**
   * Custom ID for the input
   */
  id?: string;
  /**
   * Show label (default: true)
   */
  showLabel?: boolean;
  /**
   * Custom className for label
   */
  labelClassName?: string;
  /**
   * Compact mode - hides label, reduces padding
   */
  compact?: boolean;
  /**
   * Source mode:
   * - 'computer': Upload do computador apenas (default)
   * - 'both': Permite escolher entre computador ou galeria
   */
  sourceMode?: SourceMode;
  /**
   * bookId necessário quando sourceMode='both' para filtrar galeria
   */
  bookId?: string;
}

/**
 * FormImageUpload - Reusable image upload component
 *
 * Provides image upload with preview, remove functionality, and customizable shapes.
 *
 * @example Basic usage
 * ```tsx
 * <FormImageUpload
 *   value={imageSrc}
 *   onChange={(value) => form.setValue("image", value)}
 *   label="Imagem da Região"
 *   helperText="Recomendado: 1200x448px"
 *   height="h-[28rem]"
 * />
 * ```
 *
 * @example Circular avatar
 * ```tsx
 * <FormImageUpload
 *   value={avatar}
 *   onChange={setAvatar}
 *   label="Avatar do Personagem"
 *   shape="circle"
 *   height="h-40"
 *   width="w-40"
 *   imageFit="cover"
 *   placeholderIcon={User}
 * />
 * ```
 *
 * @example Custom placeholder
 * ```tsx
 * <FormImageUpload
 *   value={factionImage}
 *   onChange={setFactionImage}
 *   label="Emblema da Facção"
 *   shape="rounded"
 *   height="h-64"
 *   width="w-64"
 *   placeholderIcon={Shield}
 *   placeholderText="Adicionar emblema"
 * />
 * ```
 */
export function FormImageUpload({
  value,
  onChange,
  label,
  helperText,
  required = false,
  height = "h-[28rem]",
  width = "w-full",
  shape = "rounded",
  imageFit = "fill",
  placeholderIcon: PlaceholderIcon = ImagePlus,
  placeholderText,
  placeholderTextSize = "text-sm",
  accept = "image/png,image/jpeg,image/jpg,image/webp,image/gif",
  error,
  id = "image-upload",
  showLabel = true,
  labelClassName = "text-primary",
  compact = false,
  sourceMode = "computer",
  bookId = "",
}: FormImageUploadProps) {
  const { t } = useTranslation("common");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | undefined>(value);
  const [isHovered, setIsHovered] = useState(false);
  const [isSourceDialogOpen, setIsSourceDialogOpen] = useState(false);
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreview(result);
        onChange(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setPreview(undefined);
    onChange("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleGallerySelect = (imageDataUrl: string) => {
    setPreview(imageDataUrl);
    onChange(imageDataUrl);
  };

  const handleUploadAreaClick = () => {
    if (sourceMode === "both") {
      // Show source selection dialog
      setIsSourceDialogOpen(true);
    } else {
      // Direct to computer upload
      fileInputRef.current?.click();
    }
  };

  const handleSelectComputer = () => {
    fileInputRef.current?.click();
  };

  const handleSelectGallery = () => {
    setIsGalleryModalOpen(true);
  };

  // Shape classes
  const shapeClasses = {
    square: "",
    rounded: "rounded-lg",
    circle: "rounded-full",
  };

  // Image fit classes
  const fitClasses = {
    fill: "object-fill",
    cover: "object-cover",
    contain: "object-contain",
  };

  const shapeClass = shapeClasses[shape];
  const fitClass = fitClasses[imageFit];

  return (
    <div className={compact ? "" : "space-y-2"}>
      {showLabel && !compact && (
        <Label className={labelClassName}>
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
          {helperText && (
            <span className="text-xs text-muted-foreground ml-2">
              ({helperText})
            </span>
          )}
        </Label>
      )}

      <div className={compact ? "" : "space-y-3"}>
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleImageSelect}
          className="hidden"
          id={id}
        />

        {preview ? (
          <div
            className="cursor-pointer block"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={handleUploadAreaClick}
          >
            <div
              className={`relative ${width} ${height} ${shapeClass} overflow-hidden border group`}
            >
              <img
                src={preview}
                alt="Preview"
                className={`w-full h-full ${fitClass} transition-all duration-300 group-hover:brightness-50`}
              />

              {/* Hover overlay with upload icon */}
              <div
                className={`absolute inset-0 z-10 flex items-center justify-center transition-opacity duration-300 ${
                  isHovered ? "opacity-100" : "opacity-0"
                }`}
              >
                <Upload className="h-12 w-12 text-white" />
              </div>
            </div>
          </div>
        ) : (
          <div
            className="cursor-pointer block"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={handleUploadAreaClick}
          >
            <div
              className={`relative ${width} ${height} border-dashed border-2 transition-colors ${shapeClass} flex flex-col items-center justify-center gap-2 bg-purple-950/40 overflow-hidden ${
                isHovered ? "border-primary" : "border-muted-foreground/25"
              }`}
            >
              <PlaceholderIcon className="h-12 w-12 text-muted-foreground/60" />
              {placeholderText && !compact && (
                <span
                  className={`${placeholderTextSize} text-muted-foreground`}
                >
                  {placeholderText}
                </span>
              )}

              {/* Hover overlay */}
              <div
                className={`absolute inset-0 z-10 bg-black/60 flex items-center justify-center transition-opacity duration-300 ${shapeClass} p-2 ${
                  isHovered ? "opacity-100" : "opacity-0"
                }`}
              >
                <span className="text-white text-sm font-semibold text-center">
                  {t("form_image.add_image")}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {/* Source Selection Dialog */}
      {sourceMode === "both" && (
        <ImageSourceDialog
          open={isSourceDialogOpen}
          onOpenChange={setIsSourceDialogOpen}
          onSelectComputer={handleSelectComputer}
          onSelectGallery={handleSelectGallery}
        />
      )}

      {/* Gallery Picker Modal */}
      {sourceMode === "both" && (
        <GalleryPickerModal
          open={isGalleryModalOpen}
          onOpenChange={setIsGalleryModalOpen}
          bookId={bookId || undefined}
          onSelect={handleGallerySelect}
        />
      )}
    </div>
  );
}

import { useState, useRef } from "react";

import { ImagePlus, X, LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

type ImageShape = "square" | "rounded" | "circle";
type ImageFit = "fill" | "cover" | "contain";

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
}: FormImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | undefined>(value);

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
            className={`relative ${width} ${height} ${shapeClass} overflow-hidden border`}
          >
            <img
              src={preview}
              alt="Preview"
              className={`w-full h-full ${fitClass}`}
            />
            <Button
              type="button"
              variant="ghost-destructive"
              size="icon"
              className="absolute top-2 right-2"
              onClick={handleRemoveImage}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <label htmlFor={id} className="cursor-pointer block">
            <div
              className={`${width} ${height} border-dashed border-2 border-muted-foreground/25 hover:border-muted-foreground/50 transition-colors ${shapeClass} flex flex-col items-center justify-center gap-2 bg-purple-950/40`}
            >
              <PlaceholderIcon className="h-12 w-12 text-muted-foreground/60" />
              {placeholderText && !compact && (
                <span
                  className={`${placeholderTextSize} text-muted-foreground`}
                >
                  {placeholderText}
                </span>
              )}
            </div>
          </label>
        )}
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}

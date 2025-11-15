import { useState, useRef } from "react";
import { ImagePlus, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

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
}

/**
 * FormImageUpload - Reusable image upload component
 *
 * Provides image upload with preview, remove functionality, and drag-drop area.
 *
 * @example
 * ```tsx
 * <FormImageUpload
 *   value={imageSrc}
 *   onChange={(value) => form.setValue("image", value)}
 *   label="Image"
 *   helperText="Recommended: 1200x448px"
 *   height="h-[28rem]"
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
  accept = "image/png,image/jpeg,image/jpg,image/webp,image/gif",
  error,
  id = "image-upload",
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

  return (
    <div className="space-y-2">
      <Label className="text-primary">
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
        {helperText && (
          <span className="text-xs text-muted-foreground ml-2">
            ({helperText})
          </span>
        )}
      </Label>

      <div className="space-y-3">
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleImageSelect}
          className="hidden"
          id={id}
        />

        {preview ? (
          <div className={`relative w-full ${height} rounded-lg overflow-hidden border`}>
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-fill"
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2"
              onClick={handleRemoveImage}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <label htmlFor={id} className="cursor-pointer block">
            <div className={`w-full ${height} border-dashed border-2 border-muted-foreground/25 hover:border-muted-foreground/50 transition-colors rounded-lg flex flex-col items-center justify-center gap-2`}>
              <ImagePlus className="h-8 w-8 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Click to upload image
              </span>
            </div>
          </label>
        )}
      </div>

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  );
}

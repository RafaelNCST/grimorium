import * as React from "react";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export interface FormTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  containerClassName?: string;
  showOptionalLabel?: boolean;
  showCharCount?: boolean;
  maxLength?: number;
  labelClassName?: string;
}

/**
 * FormTextarea - Generic textarea component with label and error handling
 *
 * @example
 * ```tsx
 * <FormTextarea
 *   label="Descrição"
 *   name="description"
 *   placeholder="Digite a descrição..."
 *   rows={4}
 *   maxLength={500}
 *   showCharCount
 *   error={errors.description?.message}
 * />
 * ```
 */
export const FormTextarea = React.forwardRef<
  HTMLTextAreaElement,
  FormTextareaProps
>(
  (
    {
      label,
      error,
      helperText,
      containerClassName,
      className,
      required,
      showOptionalLabel = true,
      showCharCount = false,
      maxLength,
      labelClassName,
      id,
      name,
      value,
      ...props
    },
    ref
  ) => {
    const inputId = id || name;
    const hasError = Boolean(error);
    const charCount =
      showCharCount && typeof value === "string" ? value.length : 0;

    return (
      <div className={cn("space-y-2", containerClassName)}>
        {label && (
          <div className="flex items-center justify-between">
            <Label
              htmlFor={inputId}
              className={cn("flex items-center gap-1", labelClassName)}
            >
              {label}
              {required && <span className="text-destructive">*</span>}
              {!required && showOptionalLabel && (
                <span className="text-xs text-muted-foreground">
                  (opcional)
                </span>
              )}
            </Label>
            {showCharCount && maxLength && (
              <span className="text-xs text-muted-foreground">
                {charCount}/{maxLength}
              </span>
            )}
          </div>
        )}
        <Textarea
          id={inputId}
          name={name}
          ref={ref}
          value={value}
          maxLength={maxLength}
          aria-invalid={hasError}
          className={cn(hasError && "border-destructive", className)}
          required={required}
          {...props}
        />
        {hasError && (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        )}
        {!hasError && helperText && (
          <p className="text-sm text-muted-foreground">{helperText}</p>
        )}
      </div>
    );
  }
);

FormTextarea.displayName = "FormTextarea";

import * as React from "react";
import { AlertCircle } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export interface FormInputProps extends React.ComponentProps<"input"> {
  label?: string;
  error?: string;
  helperText?: string;
  containerClassName?: string;
  showOptionalLabel?: boolean;
  labelClassName?: string;
  showCharCount?: boolean;
}

/**
 * FormInput - Generic input component with label and error handling
 *
 * @example
 * ```tsx
 * <FormInput
 *   label="Nome da Região"
 *   name="name"
 *   placeholder="Digite o nome..."
 *   required
 *   error={errors.name?.message}
 * />
 * ```
 */
export const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  (
    {
      label,
      error,
      helperText,
      containerClassName,
      className,
      required,
      showOptionalLabel = true,
      labelClassName,
      id,
      name,
      showCharCount = false,
      maxLength,
      value,
      ...props
    },
    ref
  ) => {
    const inputId = id || name;
    const hasError = Boolean(error);
    const currentLength = String(value || "").length;

    return (
      <div className={cn("space-y-2", containerClassName)}>
        {label && (
          <Label
            htmlFor={inputId}
            className={cn("flex items-center gap-1", labelClassName)}
          >
            {label}
            {required && <span className="text-destructive">*</span>}
            {!required && showOptionalLabel && (
              <span className="text-xs text-muted-foreground">(opcional)</span>
            )}
          </Label>
        )}
        <Input
          id={inputId}
          name={name}
          ref={ref}
          aria-invalid={hasError}
          className={cn(hasError && "border-destructive", className)}
          required={required}
          maxLength={maxLength}
          value={value}
          {...props}
        />
        {hasError && (
          <p className="text-sm text-destructive flex items-center gap-1" role="alert">
            <AlertCircle className="h-4 w-4" />
            {error}
          </p>
        )}
        {!hasError && helperText && (
          <p className="text-sm text-muted-foreground">{helperText}</p>
        )}
        {showCharCount && maxLength && !hasError && (
          <div className="flex justify-end">
            <p className="text-xs text-muted-foreground">
              {currentLength}/{maxLength}
            </p>
          </div>
        )}
      </div>
    );
  }
);

FormInput.displayName = "FormInput";

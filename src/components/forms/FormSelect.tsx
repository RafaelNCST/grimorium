import * as React from "react";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface FormSelectProps {
  label?: string;
  name?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  error?: string;
  helperText?: string;
  containerClassName?: string;
  required?: boolean;
  disabled?: boolean;
  showOptionalLabel?: boolean;
}

/**
 * FormSelect - Generic select component with label and error handling
 *
 * @example
 * ```tsx
 * <FormSelect
 *   label="Escala da Região"
 *   name="scale"
 *   value={scale}
 *   onValueChange={setScale}
 *   options={[
 *     { value: 'local', label: 'Local' },
 *     { value: 'regional', label: 'Regional' },
 *     { value: 'continental', label: 'Continental' },
 *   ]}
 *   placeholder="Selecione a escala"
 *   required
 * />
 * ```
 */
export const FormSelect = React.forwardRef<HTMLButtonElement, FormSelectProps>(
  (
    {
      label,
      name,
      value,
      onValueChange,
      options,
      placeholder = "Selecione...",
      error,
      helperText,
      containerClassName,
      required,
      disabled,
      showOptionalLabel = true,
    },
    ref
  ) => {
    const hasError = Boolean(error);

    return (
      <div className={cn("space-y-2", containerClassName)}>
        {label && (
          <Label htmlFor={name} className="flex items-center gap-1">
            {label}
            {required && <span className="text-destructive">*</span>}
            {!required && showOptionalLabel && (
              <span className="text-xs text-muted-foreground">(opcional)</span>
            )}
          </Label>
        )}
        <Select
          value={value}
          onValueChange={onValueChange}
          disabled={disabled}
          name={name}
        >
          <SelectTrigger
            ref={ref}
            className={cn(hasError && "border-destructive")}
            aria-invalid={hasError}
          >
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {options.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  disabled={option.disabled}
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
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

FormSelect.displayName = "FormSelect";

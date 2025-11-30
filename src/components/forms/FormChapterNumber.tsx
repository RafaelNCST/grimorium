import * as React from "react";

import { Minus, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export interface FormChapterNumberProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  suggestedNumber?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  labelClassName?: string;
  containerClassName?: string;
}

/**
 * FormChapterNumber - Custom chapter numbering component
 *
 * Allows integers (1, 2, 3) and decimals (1.5, 2.1, 3.75)
 * Shows suggested next chapter number
 * Includes increment/decrement buttons for quick adjustments
 */
export const FormChapterNumber = React.forwardRef<
  HTMLInputElement,
  FormChapterNumberProps
>(
  (
    {
      label,
      value,
      onChange,
      suggestedNumber,
      error,
      helperText,
      required,
      labelClassName,
      containerClassName,
    },
    ref
  ) => {
    const hasError = Boolean(error);

    const handleIncrement = () => {
      const current = parseFloat(value) || 0;
      onChange(String(Math.floor(current) + 1));
    };

    const handleDecrement = () => {
      const current = parseFloat(value) || 0;
      const newValue = Math.max(1, Math.floor(current) - 1);
      onChange(String(newValue));
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;

      // Allow empty, numbers, and single decimal point
      if (inputValue === "" || /^\d*\.?\d*$/.test(inputValue)) {
        onChange(inputValue);
      }
    };

    const handleUseSuggested = () => {
      if (suggestedNumber) {
        onChange(suggestedNumber);
      }
    };

    return (
      <div className={cn("space-y-2", containerClassName)}>
        {label && (
          <div className="flex items-center justify-between">
            <Label className={cn("flex items-center gap-1", labelClassName)}>
              {label}
              {required && <span className="text-destructive">*</span>}
            </Label>
            {suggestedNumber && value !== suggestedNumber && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleUseSuggested}
                className="h-6 text-xs text-muted-foreground hover:text-primary"
              >
                Usar sugerido: {suggestedNumber}
              </Button>
            )}
          </div>
        )}

        <div className="flex items-center gap-2">
          {/* Decrement Button */}
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={handleDecrement}
            disabled={parseFloat(value) <= 1}
            className="h-10 w-10 shrink-0"
          >
            <Minus className="h-4 w-4" />
          </Button>

          {/* Number Input */}
          <div className="relative flex-1">
            <Input
              ref={ref}
              type="text"
              value={value}
              onChange={handleInputChange}
              placeholder="1"
              className={cn(
                "text-center text-lg font-semibold",
                hasError && "border-destructive"
              )}
              aria-invalid={hasError}
            />

            {/* Suggested Badge */}
            {suggestedNumber && value === suggestedNumber && (
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-primary/10 border border-primary/30 rounded-full">
                <span className="text-[10px] font-medium text-primary">
                  Sugerido
                </span>
              </div>
            )}
          </div>

          {/* Increment Button */}
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={handleIncrement}
            className="h-10 w-10 shrink-0"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* Helper Text / Error */}
        {hasError && (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        )}
        {!hasError && helperText && (
          <p className="text-sm text-muted-foreground">{helperText}</p>
        )}

        {/* Examples */}
        {!hasError && !helperText && (
          <p className="text-xs text-muted-foreground text-center">
            Exemplos: 1, 2, 3.5, 4.1
          </p>
        )}
      </div>
    );
  }
);

FormChapterNumber.displayName = "FormChapterNumber";

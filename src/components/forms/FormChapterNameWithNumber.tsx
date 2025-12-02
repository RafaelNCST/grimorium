import * as React from "react";

import { ChevronDown, ChevronUp } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export interface FormChapterNameWithNumberProps {
  numberLabel?: string;
  nameLabel?: string;
  chapterNumber: string;
  chapterName: string;
  onChapterNumberChange: (value: string) => void;
  onChapterNameChange: (value: string) => void;
  error?: string;
  required?: boolean;
  labelClassName?: string;
  containerClassName?: string;
  maxLength?: number;
  namePlaceholder?: string;
  showCharCount?: boolean;
}

/**
 * FormChapterNameWithNumber - Combined chapter number and name input
 *
 * Layout: [Counter] - [Name of Chapter]
 * Counter is small and focused on integers and decimal increments (0.1, 0.2, etc.)
 */
export const FormChapterNameWithNumber = React.forwardRef<
  HTMLInputElement,
  FormChapterNameWithNumberProps
>(
  (
    {
      numberLabel,
      nameLabel,
      chapterNumber,
      chapterName,
      onChapterNumberChange,
      onChapterNameChange,
      error,
      required,
      labelClassName,
      containerClassName,
      maxLength = 200,
      namePlaceholder = "Nome do Capítulo",
      showCharCount = true,
    },
    ref
  ) => {
    const hasError = Boolean(error);

    // Increment by 1
    const handleIncrement = () => {
      const current = parseFloat(chapterNumber) || 0;
      onChapterNumberChange(String(Math.floor(current) + 1));
    };

    // Decrement by 1
    const handleDecrement = () => {
      const current = parseFloat(chapterNumber) || 0;
      const newValue = Math.max(1, Math.floor(current) - 1);
      onChapterNumberChange(String(newValue));
    };

    const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;
      // Allow empty, numbers, and single decimal point
      if (inputValue === "" || /^\d*\.?\d*$/.test(inputValue)) {
        onChapterNumberChange(inputValue);
      }
    };

    const currentLength = chapterName.length;

    return (
      <TooltipProvider delayDuration={300}>
        <div className={cn("space-y-2", containerClassName)}>
          <div className="flex items-start gap-3 px-0.5">
            {/* Counter Section */}
            <div className="flex flex-col gap-2 shrink-0">
              {numberLabel && (
                <Label className={cn("flex items-center gap-1", labelClassName)}>
                  {numberLabel}
                  {required && <span className="text-destructive">*</span>}
                </Label>
              )}
              <div className="flex items-center gap-1">
                {/* Number Display */}
                <Input
                  type="text"
                  value={chapterNumber}
                  onChange={handleNumberChange}
                  className={cn(
                    "w-16 h-10 text-center font-mono font-semibold text-sm",
                    hasError && "border-destructive"
                  )}
                  placeholder="1"
                />

                {/* Increment/Decrement Controls */}
                <div className="flex flex-col gap-0.5">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleIncrement}
                        className="h-4 w-5 p-0 hover:bg-white/5 dark:hover:bg-white/10 transition-colors duration-200"
                      >
                        <ChevronUp className="h-3 w-3 text-muted-foreground" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Incrementar</p>
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleDecrement}
                        className="h-4 w-5 p-0 hover:bg-white/5 dark:hover:bg-white/10 transition-colors duration-200"
                        disabled={parseFloat(chapterNumber) <= 1}
                      >
                        <ChevronDown className="h-3 w-3 text-muted-foreground" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Decrementar</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
            </div>

          {/* Name Input */}
          <div className="flex-1 flex flex-col gap-2">
            {nameLabel && (
              <Label className={cn("flex items-center gap-1", labelClassName)}>
                {nameLabel}
                {required && <span className="text-destructive">*</span>}
              </Label>
            )}
            <Input
              ref={ref}
              type="text"
              value={chapterName}
              onChange={(e) => onChapterNameChange(e.target.value)}
              placeholder={namePlaceholder}
              maxLength={maxLength}
              className={cn("h-10", hasError && "border-destructive")}
            />
          </div>
        </div>

        {/* Character count */}
        {maxLength && showCharCount && (
          <div className="flex justify-end">
            <p className="text-xs text-muted-foreground">
              {currentLength}/{maxLength}
            </p>
          </div>
        )}

        {/* Error message */}
        {hasError && (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        )}
        </div>
      </TooltipProvider>
    );
  }
);

FormChapterNameWithNumber.displayName = "FormChapterNameWithNumber";

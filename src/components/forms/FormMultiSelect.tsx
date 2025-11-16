import * as React from "react";

import { Check, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export interface MultiSelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface FormMultiSelectProps {
  label?: string;
  name?: string;
  value?: string[];
  onChange?: (value: string[]) => void;
  options: MultiSelectOption[];
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  error?: string;
  helperText?: string;
  containerClassName?: string;
  required?: boolean;
  disabled?: boolean;
  showOptionalLabel?: boolean;
  maxItems?: number;
}

/**
 * FormMultiSelect - Multi-select component with badges
 *
 * @example
 * ```tsx
 * <FormMultiSelect
 *   label="Tags"
 *   name="tags"
 *   value={tags}
 *   onChange={setTags}
 *   options={tagOptions}
 *   placeholder="Selecione as tags"
 *   searchPlaceholder="Buscar tags..."
 * />
 * ```
 */
export const FormMultiSelect = React.forwardRef<
  HTMLButtonElement,
  FormMultiSelectProps
>(
  (
    {
      label,
      name,
      value = [],
      onChange,
      options,
      placeholder = "Selecione itens...",
      searchPlaceholder = "Buscar...",
      emptyText = "Nenhum item encontrado",
      error,
      helperText,
      containerClassName,
      required,
      disabled,
      showOptionalLabel = true,
      maxItems,
    },
    ref
  ) => {
    const [open, setOpen] = React.useState(false);
    const hasError = Boolean(error);
    const selectedCount = value.length;
    const hasReachedMax = maxItems !== undefined && selectedCount >= maxItems;

    const handleSelect = (optionValue: string) => {
      if (!onChange) return;

      const newValue = value.includes(optionValue)
        ? value.filter((v) => v !== optionValue)
        : hasReachedMax
          ? value
          : [...value, optionValue];

      onChange(newValue);
    };

    const handleRemove = (optionValue: string) => {
      if (!onChange) return;
      onChange(value.filter((v) => v !== optionValue));
    };

    const selectedOptions = options.filter((opt) => value.includes(opt.value));

    return (
      <div className={cn("space-y-2", containerClassName)}>
        {label && (
          <Label htmlFor={name} className="flex items-center gap-1">
            {label}
            {required && <span className="text-destructive">*</span>}
            {!required && showOptionalLabel && (
              <span className="text-xs text-muted-foreground">(opcional)</span>
            )}
            {maxItems && (
              <span className="text-xs text-muted-foreground">
                ({selectedCount}/{maxItems})
              </span>
            )}
          </Label>
        )}

        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              ref={ref}
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className={cn(
                "w-full justify-between",
                hasError && "border-destructive",
                !selectedCount && "text-muted-foreground"
              )}
              disabled={disabled}
            >
              {selectedCount > 0
                ? `${selectedCount} ${selectedCount === 1 ? "item selecionado" : "itens selecionados"}`
                : placeholder}
              <Check className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0" align="start">
            <Command>
              <CommandInput placeholder={searchPlaceholder} />
              <CommandList>
                <CommandEmpty>{emptyText}</CommandEmpty>
                <CommandGroup>
                  {options.map((option) => {
                    const isSelected = value.includes(option.value);
                    const isDisabled =
                      option.disabled || (hasReachedMax && !isSelected);

                    return (
                      <CommandItem
                        key={option.value}
                        value={option.value}
                        onSelect={() => handleSelect(option.value)}
                        disabled={isDisabled}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            isSelected ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {option.label}
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        {selectedCount > 0 && (
          <div className="flex flex-wrap gap-2">
            {selectedOptions.map((option) => (
              <Badge
                key={option.value}
                variant="secondary"
                className="gap-1 pr-1"
              >
                {option.label}
                {!disabled && (
                  <button
                    type="button"
                    className="ml-1 rounded-sm hover:bg-muted"
                    onClick={() => handleRemove(option.value)}
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </Badge>
            ))}
          </div>
        )}

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

FormMultiSelect.displayName = "FormMultiSelect";

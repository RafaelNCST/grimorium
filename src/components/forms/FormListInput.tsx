import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface FormListInputProps {
  /**
   * Current list of values
   */
  value: string[];
  /**
   * Callback when list changes
   */
  onChange: (value: string[]) => void;
  /**
   * Label for the field
   */
  label: string;
  /**
   * Placeholder for the input
   */
  placeholder?: string;
  /**
   * Text for the add button
   */
  addButtonText?: string;
  /**
   * Whether the field is required
   */
  required?: boolean;
  /**
   * Maximum length for each item
   */
  maxLength?: number;
  /**
   * Optional error message
   */
  error?: string;
  /**
   * Custom className for label
   */
  labelClassName?: string;
}

/**
 * FormListInput - Reusable list input component
 *
 * Allows adding and removing string items to/from a list.
 *
 * @example
 * ```tsx
 * <FormListInput
 *   value={anomalies}
 *   onChange={setAnomalies}
 *   label="Region Anomalies"
 *   placeholder="Rivers that flow upward..."
 *   addButtonText="Add Anomaly"
 *   maxLength={200}
 * />
 * ```
 */
export function FormListInput({
  value,
  onChange,
  label,
  placeholder = "Enter text...",
  addButtonText = "Add Item",
  required = false,
  maxLength,
  error,
  labelClassName = "text-sm font-medium text-primary",
}: FormListInputProps) {
  const [inputValue, setInputValue] = useState("");

  const handleAdd = () => {
    if (inputValue.trim()) {
      onChange([...value, inputValue.trim()]);
      setInputValue("");
    }
  };

  const handleRemove = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <div className="space-y-3">
      <Label className={labelClassName}>
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>

      {/* Input + Add Button */}
      <div className="flex gap-2">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          maxLength={maxLength}
        />
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={handleAdd}
          disabled={!inputValue.trim()}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* List of items */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map((item, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="pr-1 py-1.5 text-sm"
            >
              <span className="mr-2">{item}</span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0 hover:bg-destructive/20"
                onClick={() => handleRemove(index)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
        </div>
      )}

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  );
}

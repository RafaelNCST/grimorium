import { useState } from "react";

import { Plus, X } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface PropsTagsInput {
  tags: string[];
  onChange: (tags: string[]) => void;
  label: string;
  placeholder: string;
  maxLength?: number;
}

export function TagsInput({
  tags,
  onChange,
  label,
  placeholder,
  maxLength = 50,
}: PropsTagsInput) {
  const { t } = useTranslation("create-race");
  const [inputValue, setInputValue] = useState("");

  const handleAddTag = () => {
    const trimmedValue = inputValue.trim();
    if (
      trimmedValue &&
      trimmedValue.length <= maxLength &&
      !tags.includes(trimmedValue)
    ) {
      onChange([...tags, trimmedValue]);
      setInputValue("");
    }
  };

  const handleRemoveTag = (indexToRemove: number) => {
    onChange(tags.filter((_, index) => index !== indexToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium">{label}</label>

      <div className="flex gap-2">
        <div className="flex-1">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            maxLength={maxLength}
          />
          {inputValue && (
            <div className="flex justify-end text-xs text-muted-foreground mt-1">
              <span>
                {inputValue.length}/{maxLength}
              </span>
            </div>
          )}
        </div>
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={handleAddTag}
          disabled={!inputValue.trim() || inputValue.length > maxLength}
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <Badge
              key={`${tag}-${index}`}
              variant="secondary"
              className="flex items-center gap-1 px-3 py-1"
            >
              <span>{tag}</span>
              <button
                type="button"
                onClick={() => handleRemoveTag(index)}
                className="ml-1 hover:text-destructive transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}

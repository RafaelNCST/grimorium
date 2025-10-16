import { useState } from "react";

import { Plus, X } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface PropsAlternativeNamesInput {
  names: string[];
  onChange: (names: string[]) => void;
}

export function AlternativeNamesInput({
  names,
  onChange,
}: PropsAlternativeNamesInput) {
  const { t } = useTranslation("create-item");
  const [inputValue, setInputValue] = useState("");

  const handleAddName = () => {
    const trimmedValue = inputValue.trim();
    if (
      trimmedValue &&
      trimmedValue.length <= 100 &&
      !names.includes(trimmedValue)
    ) {
      onChange([...names, trimmedValue]);
      setInputValue("");
    }
  };

  const handleRemoveName = (indexToRemove: number) => {
    onChange(names.filter((_, index) => index !== indexToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddName();
    }
  };

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium">
        {t("modal.alternative_names")}
      </label>

      <div className="flex gap-2">
        <div className="flex-1">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={t("modal.alternative_names_placeholder")}
            maxLength={100}
          />
          {inputValue && (
            <div className="flex justify-end text-xs text-muted-foreground mt-1">
              <span>{inputValue.length}/100</span>
            </div>
          )}
        </div>
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={handleAddName}
          disabled={!inputValue.trim() || inputValue.length > 100}
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      {names.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {names.map((name) => (
            <Badge
              key={name}
              variant="secondary"
              className="flex items-center gap-1 px-3 py-1"
            >
              <span>{name}</span>
              <button
                type="button"
                onClick={() => handleRemoveName(names.indexOf(name))}
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

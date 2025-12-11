import { useState } from "react";

import { Plus, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PropsTextListInput {
  label: string;
  placeholder: string;
  value: string[];
  onChange: (value: string[]) => void;
  maxLength?: number;
}

export function TextListInput({
  label,
  placeholder,
  value,
  onChange,
  maxLength = 200,
}: PropsTextListInput) {
  const [currentInput, setCurrentInput] = useState("");

  const handleAdd = () => {
    const trimmed = currentInput.trim();
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed]);
      setCurrentInput("");
    }
  };

  const handleRemove = (item: string) => {
    onChange(value.filter((v) => v !== item));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">{label}</Label>
      <div className="flex gap-2">
        <Input
          placeholder={placeholder}
          value={currentInput}
          onChange={(e) => setCurrentInput(e.target.value)}
          onKeyPress={handleKeyPress}
          maxLength={maxLength}
        />
        <Button
          type="button"
          variant="outline"
          onClick={handleAdd}
          className="shrink-0"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {value.map((item, index) => (
            <Badge
              key={`${item}-${index}`}
              variant="secondary"
              className="cursor-pointer hover:bg-secondary/80 gap-1"
              onClick={() => handleRemove(item)}
            >
              {item}
              <X className="w-3 h-3" />
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}

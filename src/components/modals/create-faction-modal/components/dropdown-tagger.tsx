import { X } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PropsDropdownTagger {
  label: string;
  placeholder: string;
  value: string[];
  onChange: (value: string[]) => void;
  options: Array<{ id: string; name: string }>;
  emptyMessage: string;
}

export function DropdownTagger({
  label,
  placeholder,
  value,
  onChange,
  options,
  emptyMessage,
}: PropsDropdownTagger) {
  const handleAdd = (selectedId: string) => {
    if (selectedId && !value.includes(selectedId)) {
      onChange([...value, selectedId]);
    }
  };

  const handleRemove = (id: string) => {
    onChange(value.filter((v) => v !== id));
  };

  const getName = (id: string) => {
    return options.find((opt) => opt.id === id)?.name || id;
  };

  const availableOptions = options.filter((opt) => !value.includes(opt.id));

  if (options.length === 0) {
    return (
      <div className="space-y-2">
        <Label className="text-sm font-medium">{label}</Label>
        <Alert className="bg-muted/50">
          <AlertDescription className="text-xs">{emptyMessage}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">{label}</Label>
      <Select value="" onValueChange={handleAdd}>
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent side="bottom">
          {availableOptions.map((option) => (
            <SelectItem key={option.id} value={option.id}>
              {option.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {value.map((id) => (
            <Badge
              key={id}
              variant="secondary"
              className="cursor-pointer hover:bg-secondary/80 gap-1"
              onClick={() => handleRemove(id)}
            >
              {getName(id)}
              <X className="w-3 h-3" />
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}

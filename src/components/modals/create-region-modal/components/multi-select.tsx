import { useState } from "react";
import { X, Search } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface MultiSelectOption {
  id: string;
  name: string;
  image?: string;
}

interface MultiSelectProps {
  label: string;
  placeholder: string;
  emptyText: string;
  noSelectionText: string;
  searchPlaceholder: string;
  options: MultiSelectOption[];
  value: string[];
  onChange: (value: string[]) => void;
  disabled?: boolean;
}

export function MultiSelect({
  label,
  placeholder,
  emptyText,
  noSelectionText,
  searchPlaceholder,
  options,
  value,
  onChange,
  disabled = false,
}: MultiSelectProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const selectedOptions = options.filter((opt) => value.includes(opt.id));
  const availableOptions = options.filter((opt) => !value.includes(opt.id));

  // Filter available options by search query
  const filteredOptions = availableOptions.filter((opt) =>
    opt.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAdd = (optionId: string) => {
    if (!value.includes(optionId)) {
      onChange([...value, optionId]);
      setSearchQuery(""); // Clear search after selection
    }
  };

  const handleRemove = (optionId: string) => {
    onChange(value.filter((id) => id !== optionId));
  };

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  return (
    <div className="space-y-3">
      {/* Header with label and counter */}
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">{label}</Label>
        {selectedOptions.length > 0 && (
          <span className="text-xs text-muted-foreground">
            {selectedOptions.length} selecionado{selectedOptions.length !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      {/* No options available */}
      {options.length === 0 ? (
        <div className="text-center py-6 text-muted-foreground border border-dashed border-border rounded-lg bg-muted/20">
          <p className="text-sm">{emptyText}</p>
        </div>
      ) : (
        <>
          {/* Dropdown selector */}
          {availableOptions.length > 0 && (
            <Select onValueChange={handleAdd} disabled={disabled}>
              <SelectTrigger>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
              <SelectContent>
                {/* Search input inside dropdown */}
                <div className="px-2 pb-2 pt-1 border-b sticky top-0 bg-popover z-10">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    <Input
                      placeholder={searchPlaceholder}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 h-9"
                      onClick={(e) => e.stopPropagation()}
                      onKeyDown={(e) => e.stopPropagation()}
                    />
                  </div>
                </div>

                {/* Options list */}
                <div className="max-h-[300px] overflow-y-auto">
                  {filteredOptions.length === 0 ? (
                    <div className="py-6 text-center text-sm text-muted-foreground">
                      Nenhum resultado encontrado
                    </div>
                  ) : (
                    filteredOptions.map((option) => (
                      <SelectItem
                        key={option.id}
                        value={option.id}
                        className="py-3 cursor-pointer focus:!bg-primary/10 focus:!text-foreground hover:!bg-primary/10"
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="w-8 h-8 rounded-md">
                            <AvatarImage src={option.image} alt={option.name} />
                            <AvatarFallback className="text-xs rounded-md !text-foreground">
                              {getInitials(option.name)}
                            </AvatarFallback>
                          </Avatar>
                          <span>{option.name}</span>
                        </div>
                      </SelectItem>
                    ))
                  )}
                </div>
              </SelectContent>
            </Select>
          )}

          {/* Selected items display */}
          {selectedOptions.length > 0 && (
            <div className="max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
              <div className="flex flex-wrap gap-3">
                {selectedOptions.map((option) => (
                  <div
                    key={option.id}
                    className="relative group flex items-center gap-2 p-2 pr-3 rounded-lg border border-border bg-card hover:bg-muted/50 transition-colors"
                  >
                    <Avatar className="w-10 h-10 rounded-md">
                      <AvatarImage src={option.image} alt={option.name} />
                      <AvatarFallback className="text-xs rounded-md">
                        {getInitials(option.name)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">{option.name}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 ml-1"
                      onClick={() => handleRemove(option.id)}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty state when no selection */}
          {selectedOptions.length === 0 && options.length > 0 && (
            <div className="text-center py-6 text-muted-foreground border border-dashed border-border rounded-lg">
              <p className="text-sm">{noSelectionText}</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

import { useState } from "react";
import { Plus, Trash2, X } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  type IPowerBlock,
  type DropdownContent,
} from "../../types/power-system-types";
import { cn } from "@/lib/utils";

interface DropdownBlockProps {
  block: IPowerBlock;
  isEditMode: boolean;
  isReadOnlyView?: boolean;
  onUpdate: (content: DropdownContent) => void;
  onDelete: () => void;
}

export function DropdownBlock({
  block,
  isEditMode,
  isReadOnlyView = false,
  onUpdate,
  onDelete,
}: DropdownBlockProps) {
  const { t } = useTranslation("power-system");
  const content = block.content as DropdownContent;
  const [newOption, setNewOption] = useState("");

  const handleAddOption = () => {
    if (newOption.trim() && !content.options.includes(newOption.trim())) {
      onUpdate({
        ...content,
        options: [...content.options, newOption.trim()],
      });
      setNewOption("");
    }
  };

  const handleDeleteOption = (option: string) => {
    const updatedOptions = content.options.filter((o) => o !== option);
    onUpdate({
      ...content,
      options: updatedOptions,
      selectedValue:
        content.selectedValue === option ? undefined : content.selectedValue,
    });
  };

  if (isEditMode) {
    return (
      <div className="space-y-3 p-4 rounded-lg border bg-card">
        <div className="flex items-center justify-between gap-2 mb-2">
          <Button
            data-no-drag="true"
            variant="ghost"
            size="icon"
            onClick={onDelete}
            className="text-destructive hover:bg-red-500/20 hover:text-red-600 ml-auto cursor-pointer"
          >
            <Trash2 className="w-5 h-5" />
          </Button>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Input
              data-no-drag="true"
              placeholder={t("blocks.dropdown.option_placeholder")}
              value={newOption}
              onChange={(e) => setNewOption(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddOption();
                }
              }}
              className="flex-1"
            />
            <Button data-no-drag="true" onClick={handleAddOption} size="sm" variant="outline" className="cursor-pointer">
              <Plus className="h-4 w-4 mr-1" />
              {t("blocks.dropdown.add_option_button")}
            </Button>
          </div>

          {content.options.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {content.options.map((option) => (
                <div
                  key={option}
                  className="flex items-center gap-1 px-2 py-1 rounded-md bg-muted text-sm"
                >
                  <span>{option}</span>
                  <button
                    data-no-drag="true"
                    onClick={() => handleDeleteOption(option)}
                    className="hover:text-red-600 transition-colors cursor-pointer"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {content.options.length > 0 && (
          <Select
            value={content.selectedValue || ""}
            onValueChange={(value) =>
              onUpdate({ ...content, selectedValue: value })
            }
          >
            <SelectTrigger data-no-drag="true">
              <SelectValue
                placeholder={t("blocks.dropdown.select_placeholder")}
              />
            </SelectTrigger>
            <SelectContent>
              {content.options.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>
    );
  }

  return content.options.length > 0 ? (
    <Select
      value={content.selectedValue || ""}
      onValueChange={(value) =>
        onUpdate({ ...content, selectedValue: value })
      }
      disabled={isReadOnlyView}
    >
      <SelectTrigger
        data-no-drag="true"
        className={cn("w-full", isReadOnlyView && "!cursor-default")}
      >
        <SelectValue
          placeholder={t("blocks.dropdown.select_placeholder")}
        />
      </SelectTrigger>
      <SelectContent>
        {content.options.map((option) => (
          <SelectItem key={option} value={option}>
            {option}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  ) : null;
}

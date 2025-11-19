import { useState, useEffect } from "react";

import { Edit2 } from "lucide-react";
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

import { ITEM_CATEGORIES_CONSTANT } from "../constants/item-categories";

interface PropsCategorySelector {
  value: string;
  customCategory: string;
  onChange: (value: string) => void;
  onCustomCategoryChange: (value: string) => void;
  error?: string;
}

export function CategorySelector({
  value,
  customCategory,
  onChange,
  onCustomCategoryChange,
  error,
}: PropsCategorySelector) {
  const { t } = useTranslation("create-item");
  const [isCustomMode, setIsCustomMode] = useState(false);

  // Check if we should be in custom mode based on the value
  useEffect(() => {
    if (value === "other") {
      setIsCustomMode(true);
    } else {
      setIsCustomMode(false);
    }
  }, [value]);

  const handleBackToDropdown = () => {
    setIsCustomMode(false);
    onChange("");
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-primary">
        {t("modal.category")} <span className="text-destructive ml-1">*</span>
      </label>

      {!isCustomMode ? (
        <Select
          value={value}
          onValueChange={(val) => {
            onChange(val);
            if (val === "other") {
              setIsCustomMode(true);
            }
          }}
        >
          <SelectTrigger className={error ? "border-destructive" : ""}>
            <SelectValue placeholder={t("modal.category_placeholder")} />
          </SelectTrigger>
          <SelectContent side="bottom">
            {ITEM_CATEGORIES_CONSTANT.map((category) => {
              const Icon = category.icon;
              return (
                <SelectItem key={category.value} value={category.value}>
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4" />
                    <span>{t(category.translationKey)}</span>
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      ) : (
        <div className="flex gap-2">
          <Input
            value={customCategory}
            onChange={(e) => onCustomCategoryChange(e.target.value)}
            placeholder={t("modal.custom_category_placeholder")}
            maxLength={50}
            className={error ? "border-destructive" : ""}
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={handleBackToDropdown}
            title={t("modal.back_to_categories")}
          >
            <Edit2 className="w-4 h-4" />
          </Button>
        </div>
      )}

      {isCustomMode && customCategory && (
        <div className="flex justify-end text-xs text-muted-foreground">
          <span>{customCategory.length}/50</span>
        </div>
      )}

      {error && <p className="text-sm text-destructive">{t(error)}</p>}
    </div>
  );
}

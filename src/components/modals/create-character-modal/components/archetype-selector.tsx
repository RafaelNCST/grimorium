import { useState } from "react";

import { ChevronDown, ChevronUp } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { CHARACTER_ARCHETYPES_CONSTANT } from "../constants/character-archetypes";

interface PropsArchetypeSelector {
  value: string;
  onChange: (value: string) => void;
}

export function ArchetypeSelector({ value, onChange }: PropsArchetypeSelector) {
  const { t } = useTranslation("create-character");
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">
          {t("modal.character_archetype")}
        </label>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs"
        >
          {isExpanded ? (
            <>
              <ChevronUp className="w-4 h-4 mr-1" />
              {t("modal.hide_archetypes")}
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4 mr-1" />
              {t("modal.show_archetypes")}
            </>
          )}
        </Button>
      </div>

      {isExpanded && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {CHARACTER_ARCHETYPES_CONSTANT.map((archetype) => {
            const Icon = archetype.icon;
            const isSelected = value === archetype.value;
            return (
              <button
                key={archetype.value}
                type="button"
                onClick={() => onChange(isSelected ? "" : archetype.value)}
                className={`flex flex-col items-center justify-center gap-2 p-3 rounded-lg border-2 transition-all h-32 ${
                  isSelected
                    ? "border-primary bg-primary/10 shadow-md"
                    : "border-muted hover:border-muted-foreground/50 hover:bg-muted/50"
                }`}
              >
                <Icon
                  className={`w-6 h-6 ${isSelected ? "text-primary" : "text-muted-foreground"}`}
                />
                <span
                  className={`text-xs font-medium text-center ${isSelected ? "text-primary" : "text-muted-foreground"}`}
                >
                  {t(archetype.translationKey)}
                </span>
                <p className="text-xs text-muted-foreground text-center line-clamp-2">
                  {t(archetype.descriptionKey)}
                </p>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

import { useState, type ReactNode } from "react";

import { ChevronDown, ChevronUp } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface PropsAdvancedSection {
  children: ReactNode;
}

export function AdvancedSection({ children }: PropsAdvancedSection) {
  const { t } = useTranslation("create-character");
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="space-y-4">
      <CollapsibleTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="w-full flex items-center justify-between"
        >
          <span className="font-semibold">{t("modal.advanced_items")}</span>
          {isOpen ? (
            <ChevronUp className="w-4 h-4 ml-2" />
          ) : (
            <ChevronDown className="w-4 h-4 ml-2" />
          )}
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-6">{children}</CollapsibleContent>
    </Collapsible>
  );
}

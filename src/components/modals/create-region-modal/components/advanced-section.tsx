import { useState, type ReactNode } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AdvancedSectionProps {
  children: ReactNode;
}

export function AdvancedSection({ children }: AdvancedSectionProps) {
  const { t } = useTranslation("world");
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card className="card-magical">
        <CardHeader>
          <CollapsibleTrigger asChild>
            <button className="flex items-center justify-between w-full cursor-pointer hover:opacity-80 transition-opacity">
              <CardTitle>
                {t("create_region.advanced_items")}
              </CardTitle>
              {isOpen ? (
                <ChevronDown className="w-5 h-5 text-muted-foreground" />
              ) : (
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              )}
            </button>
          </CollapsibleTrigger>
        </CardHeader>
        <CollapsibleContent>
          <CardContent className="space-y-6">
            {children}
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}

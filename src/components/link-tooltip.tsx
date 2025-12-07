import { User, MapPin, Sword, Building, Zap } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Badge } from "@/components/ui/badge";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

interface PropsLinkTooltip {
  children: React.ReactNode;
  entityType: string;
  entityId: string;
  text: string;
}

const entityIcons = {
  character: User,
  location: MapPin,
  item: Sword,
  organization: Building,
  beast: Zap,
};

const entityColors = {
  character: "bg-blue-500",
  location: "bg-green-500",
  item: "bg-purple-500",
  organization: "bg-orange-500",
  beast: "bg-red-500",
};

export function LinkTooltip({
  children,
  entityType,
  entityId,
  text,
}: PropsLinkTooltip) {
  const { t } = useTranslation("tooltips");
  const Icon = entityIcons[entityType as keyof typeof entityIcons] || User;
  const colorClass =
    entityColors[entityType as keyof typeof entityColors] || "bg-gray-500";

  return (
    <HoverCard openDelay={300} closeDelay={100}>
      <HoverCardTrigger asChild>{children}</HoverCardTrigger>
      <HoverCardContent className="w-80" side="top">
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-lg ${colorClass} text-white`}>
            <Icon className="w-4 h-4" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-semibold text-sm">{entityId}</h4>
              <Badge variant="secondary" className="text-xs capitalize">
                {entityType}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              {t("navigation.linked_text", { text })}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              {t("navigation.click_to_navigate", { entityType })}
            </p>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}

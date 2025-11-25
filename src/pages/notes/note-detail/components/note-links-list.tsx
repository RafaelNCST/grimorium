import { memo } from "react";

import {
  Users,
  Globe,
  Building2,
  Dna,
  Package,
  X,
  Link as LinkIcon,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { EntityType, INoteLink } from "@/types/note-types";

import { EntityLinkSelector } from "../../components/entity-link-selector";

interface NoteLinksListProps {
  links: INoteLink[];
  onLinksChange: (links: INoteLink[]) => void;
}

const ENTITY_TYPE_CONFIG: Record<
  EntityType,
  { icon: typeof Users; label: string; color: string }
> = {
  character: {
    icon: Users,
    label: "note-detail:links.entity_types.character",
    color: "text-blue-500 bg-blue-500/10 border-blue-500/30",
  },
  region: {
    icon: Globe,
    label: "note-detail:links.entity_types.region",
    color: "text-green-500 bg-green-500/10 border-green-500/30",
  },
  faction: {
    icon: Building2,
    label: "note-detail:links.entity_types.faction",
    color: "text-purple-500 bg-purple-500/10 border-purple-500/30",
  },
  race: {
    icon: Dna,
    label: "note-detail:links.entity_types.race",
    color: "text-orange-500 bg-orange-500/10 border-orange-500/30",
  },
  item: {
    icon: Package,
    label: "note-detail:links.entity_types.item",
    color: "text-yellow-500 bg-yellow-500/10 border-yellow-500/30",
  },
};

function NoteLinksListComponent({ links, onLinksChange }: NoteLinksListProps) {
  const { t } = useTranslation("note-detail");

  const handleRemoveLink = (linkId: string) => {
    onLinksChange(links.filter((l) => l.id !== linkId));
  };

  return (
    <div className="space-y-4">
      {/* Current links */}
      {links.length > 0 ? (
        <div className="space-y-2">
          {links.map((link) => {
            const config = ENTITY_TYPE_CONFIG[link.entityType];
            const Icon = config.icon;

            return (
              <div
                key={link.id}
                className="flex items-center justify-between p-3 rounded-lg border bg-muted/30"
              >
                <div className="flex items-center gap-3">
                  <div className={cn("p-2 rounded-md", config.color)}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium">
                      {link.entityName || link.entityId}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {t(config.label)}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveLink(link.id)}
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <LinkIcon className="h-10 w-10 text-muted-foreground mb-3" />
          <p className="font-medium">{t("links.no_links")}</p>
          <p className="text-sm text-muted-foreground">
            {t("links.no_links_description")}
          </p>
        </div>
      )}

      {/* Add new links */}
      <div className="pt-4 border-t">
        <p className="text-sm font-medium mb-2">{t("links.add")}</p>
        <EntityLinkSelector
          selectedLinks={links}
          onLinksChange={onLinksChange}
        />
      </div>
    </div>
  );
}

export const NoteLinksList = memo(NoteLinksListComponent);

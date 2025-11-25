import { memo, useMemo } from "react";

import { formatDistanceToNow } from "date-fns";
import { ptBR, enUS } from "date-fns/locale";
import { FileText } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { EntityType, INote } from "@/types/note-types";

interface NoteListItemProps {
  note: INote;
  isDeletionMode: boolean;
  isSelected: boolean;
  showLinkedEntities: boolean;
  onClick: () => void;
}

const ENTITY_TYPE_COLORS: Record<EntityType, string> = {
  character: "bg-blue-500/10 text-blue-500 border-blue-500/30",
  region: "bg-green-500/10 text-green-500 border-green-500/30",
  faction: "bg-purple-500/10 text-purple-500 border-purple-500/30",
  race: "bg-orange-500/10 text-orange-500 border-orange-500/30",
  item: "bg-yellow-500/10 text-yellow-500 border-yellow-500/30",
};

const MAX_VISIBLE_ENTITIES = 3;

function NoteListItemComponent({
  note,
  isDeletionMode,
  isSelected,
  showLinkedEntities,
  onClick,
}: NoteListItemProps) {
  const { t, i18n } = useTranslation("notes");

  const locale = i18n.language === "pt" ? ptBR : enUS;

  const formattedDate = useMemo(
    () =>
      formatDistanceToNow(new Date(note.updatedAt), {
        addSuffix: true,
        locale,
      }),
    [note.updatedAt, locale]
  );

  // Group links by entity type for display
  const linkedEntitiesDisplay = useMemo(() => {
    if (!showLinkedEntities || note.links.length === 0) return null;

    const visibleLinks = note.links.slice(0, MAX_VISIBLE_ENTITIES);
    const remainingCount = note.links.length - MAX_VISIBLE_ENTITIES;

    return { visibleLinks, remainingCount };
  }, [note.links, showLinkedEntities]);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      className={cn(
        "flex items-center gap-4 px-4 py-3 rounded-lg border cursor-pointer transition-colors duration-200",
        "hover:bg-white/5 dark:hover:bg-white/10 focus:outline-none",
        isSelected && "bg-primary/10 border-primary"
      )}
    >
      {/* Icon or Checkbox */}
      <div className="shrink-0">
        {isDeletionMode ? (
          <Checkbox
            checked={isSelected}
            className="h-5 w-5 pointer-events-none"
          />
        ) : (
          <FileText className="h-5 w-5 text-muted-foreground" />
        )}
      </div>

      {/* Name */}
      <div className="flex-1 min-w-0">
        <span className="font-medium truncate block">{note.name}</span>
      </div>

      {/* Linked entities (only shown when filtering by entity type) */}
      {linkedEntitiesDisplay && (
        <div className="flex items-center gap-1 shrink-0">
          {linkedEntitiesDisplay.visibleLinks.map((link) => (
            <Badge
              key={link.id}
              variant="outline"
              className={cn("text-xs", ENTITY_TYPE_COLORS[link.entityType])}
            >
              {link.entityName || link.entityType}
            </Badge>
          ))}
          {linkedEntitiesDisplay.remainingCount > 0 && (
            <Badge variant="outline" className="text-xs">
              {t("list.more_entities", {
                count: linkedEntitiesDisplay.remainingCount,
              })}
            </Badge>
          )}
        </div>
      )}

      {/* Last edited */}
      <div className="text-sm text-muted-foreground shrink-0 min-w-[140px] text-right">
        {formattedDate}
      </div>
    </div>
  );
}

export const NoteListItem = memo(NoteListItemComponent);

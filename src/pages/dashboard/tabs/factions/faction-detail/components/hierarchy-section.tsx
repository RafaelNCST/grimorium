import {
  Settings,
  UserPlus,
  Edit2,
  Trash2,
  Users as UsersIcon,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { InfoAlert } from "@/components/ui/info-alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { type IHierarchyTitle } from "@/types/faction-types";

interface HierarchySectionProps {
  hierarchy: IHierarchyTitle[];
  availableCharacters: Array<{ id: string; name: string; image?: string }>;
  isEditing: boolean;
  onHierarchyChange: (hierarchy: IHierarchyTitle[]) => void;
  onOpenAddMemberModal: (
    editingMember: { titleId: string; characterId: string } | null
  ) => void;
  onOpenManageTitlesModal: () => void;
}

// 12 cores predefinidas para títulos (tons suaves com opacidade)
// eslint-disable-next-line react-refresh/only-export-components
export const HIERARCHY_TITLE_COLORS = [
  {
    value: "slate",
    bg: "bg-slate-500/20",
    text: "text-slate-700 dark:text-slate-300",
    pickerBg: "bg-slate-500",
  },
  {
    value: "red",
    bg: "bg-red-500/20",
    text: "text-red-700 dark:text-red-300",
    pickerBg: "bg-red-500",
  },
  {
    value: "orange",
    bg: "bg-orange-500/20",
    text: "text-orange-700 dark:text-orange-300",
    pickerBg: "bg-orange-500",
  },
  {
    value: "amber",
    bg: "bg-amber-500/20",
    text: "text-amber-700 dark:text-amber-300",
    pickerBg: "bg-amber-500",
  },
  {
    value: "yellow",
    bg: "bg-yellow-500/20",
    text: "text-yellow-700 dark:text-yellow-300",
    pickerBg: "bg-yellow-500",
  },
  {
    value: "lime",
    bg: "bg-lime-500/20",
    text: "text-lime-700 dark:text-lime-300",
    pickerBg: "bg-lime-500",
  },
  {
    value: "green",
    bg: "bg-green-500/20",
    text: "text-green-700 dark:text-green-300",
    pickerBg: "bg-green-500",
  },
  {
    value: "cyan",
    bg: "bg-cyan-500/20",
    text: "text-cyan-700 dark:text-cyan-300",
    pickerBg: "bg-cyan-500",
  },
  {
    value: "blue",
    bg: "bg-blue-500/20",
    text: "text-blue-700 dark:text-blue-300",
    pickerBg: "bg-blue-500",
  },
  {
    value: "violet",
    bg: "bg-violet-500/20",
    text: "text-violet-700 dark:text-violet-300",
    pickerBg: "bg-violet-500",
  },
  {
    value: "purple",
    bg: "bg-purple-500/20",
    text: "text-purple-700 dark:text-purple-300",
    pickerBg: "bg-purple-500",
  },
  {
    value: "pink",
    bg: "bg-pink-500/20",
    text: "text-pink-700 dark:text-pink-300",
    pickerBg: "bg-pink-500",
  },
];

// eslint-disable-next-line react-refresh/only-export-components
export function getColorClasses(colorValue: string | undefined) {
  const color = HIERARCHY_TITLE_COLORS.find((c) => c.value === colorValue);
  return color || HIERARCHY_TITLE_COLORS[0];
}

export function HierarchySection({
  hierarchy = [],
  availableCharacters,
  isEditing,
  onHierarchyChange,
  onOpenAddMemberModal,
  onOpenManageTitlesModal,
}: HierarchySectionProps) {
  const { t } = useTranslation("faction-detail");

  // Ordenar membros: primeiro por ordem do título (menor = mais importante), depois agrupa por título
  const getSortedMembers = () => {
    const members: Array<{
      characterId: string;
      character: { id: string; name: string; image?: string };
      title: IHierarchyTitle;
    }> = [];

    // Ordenar títulos por ordem (menor primeiro), membros ficam por último
    const sortedTitles = [...hierarchy].sort((a, b) => {
      if (a.isMembersTitle) return 1;
      if (b.isMembersTitle) return -1;
      return (a.order || 0) - (b.order || 0);
    });

    sortedTitles.forEach((title) => {
      title.characterIds.forEach((charId) => {
        const character = availableCharacters.find((c) => c.id === charId);
        if (character) {
          members.push({ characterId: charId, character, title });
        }
      });
    });

    return members;
  };

  const handleRemoveMember = (titleId: string, characterId: string) => {
    const updated = hierarchy.map((title) => {
      if (title.id === titleId) {
        return {
          ...title,
          characterIds: title.characterIds.filter((id) => id !== characterId),
        };
      }
      return title;
    });
    onHierarchyChange(updated);
  };

  const handleEditMember = (titleId: string, characterId: string) => {
    onOpenAddMemberModal({ titleId, characterId });
  };

  const sortedMembers = getSortedMembers();
  const hasNoCharacters = availableCharacters.length === 0;
  const hasNoTitles = hierarchy.filter((t) => !t.isMembersTitle).length === 0;

  // Se não houver personagens, mostrar aviso
  if (hasNoCharacters) {
    return (
      <InfoAlert>
        <p className="font-semibold">{t("hierarchy.no_characters")}</p>
        <p className="text-sm mt-1">{t("hierarchy.no_characters_message")}</p>
      </InfoAlert>
    );
  }

  return (
    <div className="space-y-4">
      {/* Botões de ação - só aparecem no modo edição */}
      {isEditing && (
        <div className="flex gap-2">
          <Button
            variant="magical"
            size="sm"
            className="flex-1"
            onClick={() => onOpenAddMemberModal(null)}
            disabled={hasNoTitles}
          >
            <UserPlus className="w-4 h-4 mr-2" />
            {t("hierarchy.add_member")}
          </Button>
          <Button
            variant="secondary"
            size="sm"
            className="flex-1"
            onClick={onOpenManageTitlesModal}
          >
            <Settings className="w-4 h-4 mr-2" />
            {t("hierarchy.manage_titles")}
          </Button>
        </div>
      )}

      {/* Aviso se não houver títulos */}
      {hasNoTitles && isEditing && (
        <InfoAlert>{t("hierarchy.no_titles_hint")}</InfoAlert>
      )}

      {/* Lista de membros */}
      {sortedMembers.length === 0 ? (
        !isEditing && (
          <div className="text-center py-8 text-muted-foreground">
            <UsersIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">{t("hierarchy.empty_state.description")}</p>
          </div>
        )
      ) : (
        <ScrollArea
          className={sortedMembers.length > 6 ? "max-h-[420px] pr-3" : ""}
        >
          <div className="space-y-2">
            {sortedMembers.map(({ characterId, character, title }) => {
              const colorClasses = getColorClasses(title.color);

              return (
                <div
                  key={`${title.id}-${characterId}`}
                  className={`flex items-center gap-3 p-3 rounded-lg ${colorClasses.bg} transition-all`}
                >
                  <Avatar className="w-10 h-10 border-2 border-border">
                    <AvatarImage
                      src={character.image}
                      className="object-cover"
                    />
                    <AvatarFallback className="text-sm bg-muted text-muted-foreground">
                      {character.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate text-foreground">
                      {character.name}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {title.name}
                      {!title.isMembersTitle && title.order !== undefined && (
                        <span className="ml-1">#{title.order}</span>
                      )}
                    </p>
                  </div>

                  {isEditing && (
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleEditMember(title.id, characterId)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost-destructive"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() =>
                          handleRemoveMember(title.id, characterId)
                        }
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}

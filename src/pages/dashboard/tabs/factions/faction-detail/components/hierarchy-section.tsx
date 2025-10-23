import React, { useState } from "react";

import { Plus, Edit2, Trash2, Users as UsersIcon, Info } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type IHierarchyTitle } from "@/types/faction-types";

import { HierarchyMembersModal } from "./hierarchy-members-modal";
import { HierarchyTitleModal } from "./hierarchy-title-modal";

interface HierarchySectionProps {
  hierarchy: IHierarchyTitle[];
  availableCharacters: Array<{ id: string; name: string; image?: string }>;
  isEditing: boolean;
  onHierarchyChange: (hierarchy: IHierarchyTitle[]) => void;
}

export function HierarchySection({
  hierarchy = [],
  availableCharacters,
  isEditing,
  onHierarchyChange,
}: HierarchySectionProps) {
  const { t } = useTranslation("faction-detail");
  const [showTitleModal, setShowTitleModal] = useState(false);
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [editingTitle, setEditingTitle] = useState<IHierarchyTitle | null>(
    null
  );
  const [editingTitleId, setEditingTitleId] = useState<string | null>(null);

  // Ensure "Members" title exists
  React.useEffect(() => {
    if (hierarchy.length === 0 || !hierarchy.find((t) => t.isMembersTitle)) {
      const membersTitle: IHierarchyTitle = {
        id: "members",
        name: t("hierarchy.members_default_name"),
        isMembersTitle: true,
        characterIds: [],
      };
      onHierarchyChange([...hierarchy, membersTitle]);
    }
  }, []);

  // Sort titles: custom titles by order, then Members last
  const sortedHierarchy = [...hierarchy].sort((a, b) => {
    if (a.isMembersTitle) return 1;
    if (b.isMembersTitle) return -1;
    return (a.order || 0) - (b.order || 0);
  });

  const handleAddTitle = () => {
    setEditingTitle(null);
    setShowTitleModal(true);
  };

  const handleEditTitle = (title: IHierarchyTitle) => {
    setEditingTitle(title);
    setShowTitleModal(true);
  };

  const handleDeleteTitle = (titleId: string) => {
    const title = hierarchy.find((t) => t.id === titleId);
    if (title?.isMembersTitle) {
      // eslint-disable-next-line no-alert
      alert(t("hierarchy.cannot_delete_members"));
      return;
    }

    // eslint-disable-next-line no-alert
    if (confirm(t("hierarchy.delete_confirm"))) {
      const updated = hierarchy.filter((t) => t.id !== titleId);
      onHierarchyChange(updated);
    }
  };

  const handleSaveTitle = (title: IHierarchyTitle) => {
    if (editingTitle) {
      // Update existing title
      const updated = hierarchy.map((t) =>
        t.id === editingTitle.id ? title : t
      );
      onHierarchyChange(updated);
    } else {
      // Add new title
      onHierarchyChange([...hierarchy, title]);
    }
    setShowTitleModal(false);
    setEditingTitle(null);
  };

  const handleManageCharacters = (titleId: string) => {
    setEditingTitleId(titleId);
    setShowMembersModal(true);
  };

  const handleSaveCharacters = (titleId: string, characterIds: string[]) => {
    const updated = hierarchy.map((t) =>
      t.id === titleId ? { ...t, characterIds } : t
    );
    onHierarchyChange(updated);
    setShowMembersModal(false);
    setEditingTitleId(null);
  };

  const getCharacterById = (characterId: string) =>
    availableCharacters.find((c) => c.id === characterId);

  if (availableCharacters.length === 0) {
    return (
      <Card className="card-magical">
        <CardHeader>
          <CardTitle>{t("sections.hierarchy")}</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <p className="font-semibold">{t("hierarchy.no_characters")}</p>
              <p className="text-sm mt-1">
                {t("hierarchy.no_characters_message")}
              </p>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="card-magical">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{t("sections.hierarchy")}</CardTitle>
            {isEditing && (
              <Button
                variant="magical"
                size="lg"
                className="animate-glow"
                onClick={handleAddTitle}
              >
                <Plus className="w-4 h-4 mr-2" />
                {t("hierarchy.add_title")}
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {sortedHierarchy.length === 0 ? (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                {t("hierarchy.empty_state.description")}
              </AlertDescription>
            </Alert>
          ) : (
            sortedHierarchy.map((title) => {
              const characters = title.characterIds
                .map(getCharacterById)
                .filter(Boolean) as Array<{
                id: string;
                name: string;
                image?: string;
              }>;

              return (
                <Card key={title.id} className="border-2">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-lg">{title.name}</CardTitle>
                        {title.isMembersTitle && (
                          <Badge variant="secondary" className="ml-2">
                            {t("hierarchy.members_title")}
                          </Badge>
                        )}
                        {!title.isMembersTitle && title.order !== undefined && (
                          <Badge variant="outline" className="ml-2">
                            #{title.order}
                          </Badge>
                        )}
                      </div>
                      {isEditing && (
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleManageCharacters(title.id)}
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditTitle(title)}
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          {!title.isMembersTitle && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteTitle(title.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    {characters.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <UsersIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">
                          {t("hierarchy.no_characters_in_title")}
                        </p>
                      </div>
                    ) : (
                      <div className="max-h-[264px] overflow-y-auto space-y-1">
                        {characters.map((character) => (
                          <div
                            key={character.id}
                            className="flex items-center gap-3 p-2 rounded-md hover:bg-accent/50 transition-colors"
                          >
                            <Avatar className="w-8 h-8">
                              <AvatarImage
                                src={character.image}
                                className="object-cover"
                              />
                              <AvatarFallback className="text-xs">
                                {character.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <p className="text-sm font-medium">
                              {character.name}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })
          )}
        </CardContent>
      </Card>

      {showTitleModal && (
        <HierarchyTitleModal
          isOpen={showTitleModal}
          onClose={() => {
            setShowTitleModal(false);
            setEditingTitle(null);
          }}
          editingTitle={editingTitle}
          existingTitles={hierarchy}
          onSave={handleSaveTitle}
        />
      )}

      {showMembersModal && editingTitleId && (
        <HierarchyMembersModal
          isOpen={showMembersModal}
          onClose={() => {
            setShowMembersModal(false);
            setEditingTitleId(null);
          }}
          titleId={editingTitleId}
          titleName={hierarchy.find((t) => t.id === editingTitleId)?.name || ""}
          selectedCharacterIds={
            hierarchy.find((t) => t.id === editingTitleId)?.characterIds || []
          }
          availableCharacters={availableCharacters}
          onSave={handleSaveCharacters}
        />
      )}
    </>
  );
}

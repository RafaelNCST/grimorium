import React, { useState, useEffect } from "react";

import { ChevronLeft, User, UserPlus, X } from "lucide-react";
import { useTranslation } from "react-i18next";

import { FormImageDisplay } from "@/components/forms/FormImageDisplay";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { InfoAlert } from "@/components/ui/info-alert";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { type IHierarchyTitle } from "@/types/faction-types";

import { getColorClasses } from "./hierarchy-section";

interface AddMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  titles: IHierarchyTitle[];
  availableCharacters: Array<{ id: string; name: string; image?: string }>;
  existingMemberIds: string[];
  editingMember: { titleId: string; characterId: string } | null;
  onSave: (characterId: string, titleId: string) => void;
}

export function AddMemberModal({
  isOpen,
  onClose,
  titles,
  availableCharacters,
  existingMemberIds,
  editingMember,
  onSave,
}: AddMemberModalProps) {
  const { t } = useTranslation("faction-detail");
  const [modalStep, setModalStep] = useState<1 | 2>(1);
  const [selectedCharacterId, setSelectedCharacterId] = useState<string | null>(
    null
  );
  const [selectedTitleId, setSelectedTitleId] = useState<string | null>(null);
  const [hasScroll, setHasScroll] = useState(false);
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      if (editingMember) {
        // Modo edição: pular para step 2 com o personagem já selecionado
        setSelectedCharacterId(editingMember.characterId);
        setSelectedTitleId(editingMember.titleId);
        setModalStep(2);
      } else {
        // Modo adicionar: começar do step 1
        setSelectedCharacterId(null);
        setSelectedTitleId(null);
        setModalStep(1);
      }
    }
  }, [isOpen, editingMember]);

  const handleClose = () => {
    setSelectedCharacterId(null);
    setSelectedTitleId(null);
    setModalStep(1);
    onClose();
  };

  const handleCharacterSelect = (characterId: string) => {
    setSelectedCharacterId(characterId);
    setModalStep(2);
  };

  const handleBackToStep1 = () => {
    setSelectedTitleId(null);
    setModalStep(1);
  };

  const handleSave = () => {
    if (selectedCharacterId && selectedTitleId) {
      onSave(selectedCharacterId, selectedTitleId);
      handleClose();
    }
  };

  // Filtrar personagens disponíveis (que ainda não são membros, exceto se estiver editando)
  const filteredCharacters = availableCharacters.filter((char) => {
    const isAvailable = editingMember
      ? char.id === editingMember.characterId ||
        !existingMemberIds.includes(char.id)
      : !existingMemberIds.includes(char.id);
    return isAvailable;
  });

  // Ordenar títulos por ordem
  const sortedTitles = [...titles].sort(
    (a, b) => (a.order || 0) - (b.order || 0)
  );

  const getCharacterById = (id: string) =>
    availableCharacters.find((c) => c.id === id);

  const isEditMode = !!editingMember;

  // Detectar se há scroll
  useEffect(() => {
    const checkScroll = () => {
      if (scrollContainerRef.current) {
        const { scrollHeight, clientHeight } = scrollContainerRef.current;
        setHasScroll(scrollHeight > clientHeight);
      }
    };

    // Dar um pequeno delay para garantir que o conteúdo foi renderizado
    const timeoutId = setTimeout(checkScroll, 0);

    // Observar mudanças no tamanho do conteúdo
    const observer = new ResizeObserver(checkScroll);
    if (scrollContainerRef.current) {
      observer.observe(scrollContainerRef.current);
    }

    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, [filteredCharacters, sortedTitles, modalStep, isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>
            {modalStep === 1
              ? t("hierarchy.add_member")
              : isEditMode
                ? t("hierarchy.edit_member")
                : t("hierarchy.select_title")}
          </DialogTitle>
          <DialogDescription>
            {modalStep === 1
              ? t("hierarchy.select_character_description")
              : t("hierarchy.select_title_description")}
          </DialogDescription>
        </DialogHeader>

        <div
          ref={scrollContainerRef}
          className={cn(
            "max-h-[60vh] overflow-y-auto custom-scrollbar",
            hasScroll && "pr-1.5"
          )}
        >
          <div className="space-y-6 pr-2 pl-2">
            {/* STEP 1: Seleção do Personagem */}
            {modalStep === 1 && (
              <div className="space-y-3">
                <Label className="text-sm font-semibold text-purple-400">
                  {t("hierarchy.available_characters")}
                </Label>
                <div className="grid grid-cols-1 gap-3 p-1">
                  {filteredCharacters.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <p className="text-sm">
                        {t("hierarchy.no_available_characters")}
                      </p>
                    </div>
                  ) : (
                    filteredCharacters.map((character) => (
                      <Card
                        key={character.id}
                        className="p-4 cursor-pointer transition-all border-muted hover:bg-muted/50"
                        onClick={() => handleCharacterSelect(character.id)}
                      >
                        <div className="flex items-center gap-4">
                          {character.image ? (
                            <Avatar className="w-12 h-12">
                              <AvatarImage
                                src={character.image}
                                className="object-cover"
                              />
                            </Avatar>
                          ) : (
                            <FormImageDisplay
                              icon={User}
                              height="h-12"
                              width="w-12"
                              shape="circle"
                              iconSize="w-6 h-6"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-base truncate">
                              {character.name}
                            </p>
                          </div>
                        </div>
                      </Card>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* STEP 2: Seleção do Título */}
            {modalStep === 2 && selectedCharacterId && (
              <div className="space-y-6">
                {/* Card do Personagem Selecionado (Read-only) */}
                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-purple-400">
                    {t("hierarchy.selected_character")}
                  </Label>
                  <Card className="p-4 bg-primary/5 border-primary/20">
                    <div className="flex items-center gap-4">
                      {getCharacterById(selectedCharacterId)?.image ? (
                        <Avatar className="w-12 h-12">
                          <AvatarImage
                            src={getCharacterById(selectedCharacterId)?.image}
                            className="object-cover"
                          />
                        </Avatar>
                      ) : (
                        <FormImageDisplay
                          icon={User}
                          height="h-12"
                          width="w-12"
                          shape="circle"
                          iconSize="w-6 h-6"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-base truncate">
                          {getCharacterById(selectedCharacterId)?.name}
                        </p>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Seleção de Título */}
                <div className="space-y-3 pb-4">
                  <Label className="text-sm font-semibold text-purple-400">
                    {t("hierarchy.select_title")}
                  </Label>
                  {sortedTitles.length === 0 ? (
                    <InfoAlert>{t("hierarchy.no_titles_available")}</InfoAlert>
                  ) : (
                    <div className="grid grid-cols-2 gap-3">
                      {sortedTitles.map((title) => {
                        const colorClasses = getColorClasses(title.color);
                        const isSelected = selectedTitleId === title.id;

                        return (
                          <Card
                            key={title.id}
                            className={`p-4 cursor-pointer transition-all ${colorClasses.bg} ${
                              isSelected
                                ? "ring-2 ring-primary"
                                : "hover:opacity-80"
                            }`}
                            onClick={() => setSelectedTitleId(title.id)}
                          >
                            <div className="text-center">
                              <p className="font-semibold truncate text-foreground">
                                {title.name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {t("hierarchy.order")}: #{title.order}
                              </p>
                            </div>
                          </Card>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          {modalStep === 1 ? (
            <Button variant="secondary" onClick={handleClose}>
              <X className="w-4 h-4 mr-2" />
              {t("hierarchy.cancel")}
            </Button>
          ) : (
            <>
              {!isEditMode && (
                <Button variant="secondary" onClick={handleBackToStep1}>
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  {t("hierarchy.back")}
                </Button>
              )}
              {isEditMode && (
                <Button variant="secondary" onClick={handleClose}>
                  <X className="w-4 h-4 mr-2" />
                  {t("hierarchy.cancel")}
                </Button>
              )}
              <Button
                variant="magical"
                onClick={handleSave}
                disabled={!selectedTitleId}
                className="animate-glow"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                {isEditMode
                  ? t("hierarchy.save_member")
                  : t("hierarchy.add_member_btn")}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

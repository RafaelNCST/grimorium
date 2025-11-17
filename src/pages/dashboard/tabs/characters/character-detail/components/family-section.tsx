import React, { useState, useMemo, useCallback } from "react";

import { convertFileSrc } from "@tauri-apps/api/core";
import { ChevronDown, ChevronRight, Heart, TreePine } from "lucide-react";
import { useTranslation } from "react-i18next";

import { EmptyFieldState } from "@/components/detail-page/empty-field-state";
import { FieldWithVisibilityToggle } from "@/components/detail-page/FieldWithVisibilityToggle";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { type ICharacterFamily, type IFieldVisibility } from "@/types/character-types";

import { FamilyFieldOptimized } from "./family-field-optimized";
import { FamilyTreeDialog } from "./family-tree-dialog";

interface ICharacter {
  id: string;
  name: string;
  image?: string;
  role?: string;
}

interface FamilySectionProps {
  family: ICharacterFamily;
  allCharacters: ICharacter[];
  currentCharacterId: string;
  bookId: string;
  isEditMode: boolean;
  fieldVisibility: IFieldVisibility;
  onFamilyChange: (family: ICharacterFamily) => void;
  onFieldVisibilityToggle: (fieldName: string) => void;
}

export const FamilySection = React.memo(function FamilySection({
  family,
  allCharacters,
  currentCharacterId,
  bookId,
  isEditMode,
  fieldVisibility,
  onFamilyChange,
  onFieldVisibilityToggle,
}: FamilySectionProps) {
  const { t } = useTranslation("character-detail");
  const [isTreeDialogOpen, setIsTreeDialogOpen] = useState(false);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  const toggleSection = useCallback((sectionName: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [sectionName]: !prev[sectionName],
    }));
  }, []);

  // Check if family has any members
  const hasFamilyMembers = useMemo(() => {
    if (!family) return false;
    return (
      (family.grandparents && family.grandparents.length > 0) ||
      (family.parents && family.parents.length > 0) ||
      (family.spouses && family.spouses.length > 0) ||
      (family.unclesAunts && family.unclesAunts.length > 0) ||
      (family.cousins && family.cousins.length > 0) ||
      (family.children && family.children.length > 0) ||
      (family.siblings && family.siblings.length > 0) ||
      (family.halfSiblings && family.halfSiblings.length > 0)
    );
  }, [family]);

  // Render function for family fields - NOT a hook, just a regular function
  const renderFamilyField = (
    fieldName: keyof ICharacterFamily,
    labelKey: string,
    placeholderKey: string,
    noSelectionKey: string
  ) => {
    const value = family[fieldName] || [];

    return (
      <FieldWithVisibilityToggle
        key={fieldName}
        fieldName={fieldName}
        label={isEditMode ? t(labelKey) : ""}
        isOptional
        fieldVisibility={fieldVisibility}
        isEditing={isEditMode}
        onFieldVisibilityToggle={onFieldVisibilityToggle}
      >
        {isEditMode ? (
          <FamilyFieldOptimized
            label=""
            placeholder={t(placeholderKey)}
            emptyText={t("character-detail:family.no_characters")}
            noSelectionText={t(noSelectionKey)}
            searchPlaceholder={t("character-detail:family.search_characters")}
            value={value as string[]}
            onChange={(newValue) =>
              onFamilyChange({ ...family, [fieldName]: newValue })
            }
            allCharacters={allCharacters}
            currentCharacterId={currentCharacterId}
          />
        ) : (
          <Collapsible
            open={openSections[fieldName]}
            onOpenChange={() => toggleSection(fieldName)}
          >
            <CollapsibleTrigger className="flex items-center justify-between w-full p-2 rounded-lg hover:bg-muted transition-colors">
              <p className="text-sm font-semibold text-primary">
                {t(labelKey)}
                {value.length > 0 && (
                  <span className="ml-1 text-purple-600/60 dark:text-purple-400/60">
                    ({value.length})
                  </span>
                )}
              </p>
              {openSections[fieldName] ? (
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              ) : (
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              )}
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2">
              {value.length > 0 ? (
                <div className="flex flex-col gap-2">
                  {(value as string[]).map((characterId) => {
                    const character = allCharacters.find(
                      (c) => c.id === characterId
                    );
                    return character ? (
                      <div
                        key={characterId}
                        className="flex items-center gap-2 p-2 bg-muted rounded-lg"
                      >
                        {character.image ? (
                          <img
                            src={convertFileSrc(character.image)}
                            alt={character.name}
                            className="w-8 h-8 rounded object-cover flex-shrink-0"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded bg-muted-foreground/20 flex items-center justify-center flex-shrink-0">
                            <span className="text-xs text-muted-foreground font-semibold">
                              {character.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                        <span className="text-sm font-medium">
                          {character.name}
                        </span>
                      </div>
                    ) : null;
                  })}
                </div>
              ) : (
                <EmptyFieldState t={t} />
              )}
            </CollapsibleContent>
          </Collapsible>
        )}
      </FieldWithVisibilityToggle>
    );
  };

  // Empty state when no characters available
  if (allCharacters.length <= 1 && isEditMode) {
    return (
      <div className="text-center text-muted-foreground text-sm py-8">
        <TreePine className="w-12 h-12 mx-auto mb-3 opacity-50" />
        <p className="font-medium">
          {t("character-detail:empty_states.need_more_characters_family")}
        </p>
        <p className="text-xs mt-1">
          {t("character-detail:empty_states.need_more_characters_family_hint")}
        </p>
      </div>
    );
  }

  // Empty state in view mode
  if (!hasFamilyMembers && !isEditMode) {
    return (
      <div className="text-center text-muted-foreground text-sm py-8">
        <Heart className="w-12 h-12 mx-auto mb-3 opacity-50" />
        <p className="font-medium">
          {t("character-detail:empty_states.no_family")}
        </p>
        <p className="text-xs mt-1">
          {t("character-detail:empty_states.no_family_hint")}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* View Tree Button - Only in View Mode and with family members */}
      {!isEditMode && hasFamilyMembers && (
        <Button
          onClick={() => setIsTreeDialogOpen(true)}
          className="w-full"
          variant="outline"
        >
          <TreePine className="w-4 h-4 mr-2" />
          {t("character-detail:family.view_tree")}
        </Button>
      )}

      {/* Family Fields - All in vertical sequence, no groupings */}
      <div className="space-y-4">
        {/* 1. Avós (Grandparents) */}
        {renderFamilyField(
          "grandparents",
          "character-detail:family.grandparents",
          "character-detail:family.select_grandparents",
          "character-detail:family.no_grandparents_selected"
        )}

        {/* 2. Pais (Parents) */}
        {renderFamilyField(
          "parents",
          "character-detail:family.parents",
          "character-detail:family.select_parents",
          "character-detail:family.no_parents_selected"
        )}

        {/* 3. Cônjuges (Spouses) */}
        {renderFamilyField(
          "spouses",
          "character-detail:family.spouses",
          "character-detail:family.select_spouses",
          "character-detail:family.no_spouses_selected"
        )}

        {/* 4. Tios (Uncles/Aunts) */}
        {renderFamilyField(
          "unclesAunts",
          "character-detail:family.uncles_aunts",
          "character-detail:family.select_uncles_aunts",
          "character-detail:family.no_uncles_aunts_selected"
        )}

        {/* 5. Primos (Cousins) */}
        {renderFamilyField(
          "cousins",
          "character-detail:family.cousins",
          "character-detail:family.select_cousins",
          "character-detail:family.no_cousins_selected"
        )}

        {/* 6. Filhos (Children) */}
        {renderFamilyField(
          "children",
          "character-detail:family.children",
          "character-detail:family.select_children",
          "character-detail:family.no_children_selected"
        )}

        {/* 7. Irmãos (Siblings) */}
        {renderFamilyField(
          "siblings",
          "character-detail:family.siblings",
          "character-detail:family.select_siblings",
          "character-detail:family.no_siblings_selected"
        )}

        {/* 8. Meio-irmãos (Half Siblings) */}
        {renderFamilyField(
          "halfSiblings",
          "character-detail:family.half_siblings",
          "character-detail:family.select_half_siblings",
          "character-detail:family.no_half_siblings_selected"
        )}
      </div>

      {/* Family Tree Dialog */}
      <FamilyTreeDialog
        isOpen={isTreeDialogOpen}
        onClose={() => setIsTreeDialogOpen(false)}
        family={family}
        allCharacters={allCharacters}
        currentCharacterId={currentCharacterId}
      />
    </div>
  );
});

import React, { useState, useMemo, useCallback } from "react";

import { convertFileSrc } from "@tauri-apps/api/core";
import { Heart, TreePine } from "lucide-react";
import { useTranslation } from "react-i18next";

import { FieldWithVisibilityToggle } from "@/components/detail-page/FieldWithVisibilityToggle";
import { FormEntityMultiSelectAuto } from "@/components/forms/FormEntityMultiSelectAuto";
import { Button } from "@/components/ui/button";
import { type ICharacterFamily, type IFieldVisibility } from "@/types/character-types";

import { FamilyTreeDialog } from "./family-tree-dialog";

interface ICharacter {
  id: string;
  name: string;
  image?: string;
  role?: string;
}

// Optimized wrapper component for family fields
interface FamilyFieldOptimizedProps {
  fieldName: keyof ICharacterFamily;
  value: string[];
  family: ICharacterFamily;
  currentCharacterId: string;
  bookId: string;
  label: string;
  placeholder: string;
  noSelectionText: string;
  onChange: (newValue: string[]) => void;
  maxSelections?: number;
}

const FamilyFieldOptimized = React.memo(
  function FamilyFieldOptimized({
    fieldName,
    value,
    family,
    currentCharacterId,
    bookId,
    label,
    placeholder,
    noSelectionText,
    onChange,
    maxSelections,
  }: FamilyFieldOptimizedProps) {
    const { t } = useTranslation("character-detail");

    // Granular memoization: only recalculate when OTHER fields' IDs change
    const filterFn = useMemo(() => {
      // Collect IDs from all OTHER fields
      const otherFieldsIds = new Set<string>();
      const allFields: Array<keyof ICharacterFamily> = [
        "grandparents",
        "parents",
        "spouses",
        "unclesAunts",
        "cousins",
        "children",
        "siblings",
        "halfSiblings",
      ];

      for (const otherField of allFields) {
        if (otherField !== fieldName) {
          const fieldValue = family[otherField];
          if (Array.isArray(fieldValue)) {
            fieldValue.forEach((id) => otherFieldsIds.add(id));
          }
        }
      }

      return (char: { id: string; name: string; image?: string }) => {
        // Exclude current character
        if (char.id === currentCharacterId) return false;
        // Exclude characters used in other fields
        if (otherFieldsIds.has(char.id)) return false;
        return true;
      };
    }, [
      // Only depend on OTHER fields, not the current field
      fieldName,
      family.grandparents,
      family.parents,
      family.spouses,
      family.unclesAunts,
      family.cousins,
      family.children,
      family.siblings,
      family.halfSiblings,
      currentCharacterId,
    ]);

    return (
      <FormEntityMultiSelectAuto
        entityType="character"
        bookId={bookId}
        label=""
        placeholder={placeholder}
        emptyText={t("character-detail:family.no_characters")}
        noSelectionText={noSelectionText}
        searchPlaceholder={t("character-detail:family.search_characters")}
        value={value}
        onChange={onChange}
        filter={filterFn}
        maxSelections={maxSelections}
      />
    );
  },
  // Custom comparison function
  (prevProps, nextProps) => {
    // Re-render only if these specific props change
    if (prevProps.fieldName !== nextProps.fieldName) return false;
    if (prevProps.bookId !== nextProps.bookId) return false;
    if (prevProps.currentCharacterId !== nextProps.currentCharacterId) return false;
    if (prevProps.maxSelections !== nextProps.maxSelections) return false;
    if (prevProps.label !== nextProps.label) return false;
    if (prevProps.placeholder !== nextProps.placeholder) return false;
    if (prevProps.noSelectionText !== nextProps.noSelectionText) return false;

    // Check if the VALUE of current field changed (array comparison)
    const prevValue = prevProps.value;
    const nextValue = nextProps.value;
    if (prevValue.length !== nextValue.length) return false;
    if (!prevValue.every((id, idx) => id === nextValue[idx])) return false;

    // Check if OTHER fields changed (this determines if filter needs update)
    const allFields: Array<keyof ICharacterFamily> = [
      "grandparents",
      "parents",
      "spouses",
      "unclesAunts",
      "cousins",
      "children",
      "siblings",
      "halfSiblings",
    ];

    for (const field of allFields) {
      if (field !== prevProps.fieldName) {
        const prevFieldValue = prevProps.family[field] || [];
        const nextFieldValue = nextProps.family[field] || [];

        if (prevFieldValue.length !== nextFieldValue.length) return false;
        if (!prevFieldValue.every((id, idx) => id === nextFieldValue[idx])) return false;
      }
    }

    // If we got here, props are equal - skip re-render
    return true;
  }
);

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

  // Create stable onChange handlers using useMemo to cache them per field
  const fieldChangeHandlers = useMemo(() => {
    const handlers: Record<string, (newValue: string[]) => void> = {};
    const allFields: Array<keyof ICharacterFamily> = [
      "grandparents",
      "parents",
      "spouses",
      "unclesAunts",
      "cousins",
      "children",
      "siblings",
      "halfSiblings",
    ];

    for (const fieldName of allFields) {
      handlers[fieldName] = (newValue: string[]) => {
        onFamilyChange({ ...family, [fieldName]: newValue });
      };
    }

    return handlers;
  }, [family, onFamilyChange]);

  // Render function for family fields - NOT a hook, just a regular function
  const renderFamilyField = (
    fieldName: keyof ICharacterFamily,
    labelKey: string,
    placeholderKey: string,
    noSelectionKey: string,
    maxSelections?: number
  ) => {
    const value = family[fieldName] || [];
    const handleChange = fieldChangeHandlers[fieldName];

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
            fieldName={fieldName}
            value={value as string[]}
            family={family}
            currentCharacterId={currentCharacterId}
            bookId={bookId}
            label=""
            placeholder={t(placeholderKey)}
            noSelectionText={t(noSelectionKey)}
            onChange={handleChange}
            maxSelections={maxSelections}
          />
        ) : (
          <div className="space-y-3">
            {/* Header with label and counter - matching FormEntityMultiSelectAuto pattern */}
            <div className="flex items-center justify-between min-h-[20px]">
              <p className="text-sm font-semibold text-primary">
                {t(labelKey)}
              </p>
              {value.length > 0 && (
                <span className="text-xs text-muted-foreground">
                  {value.length}
                  {maxSelections !== undefined && ` / ${maxSelections}`}
                </span>
              )}
            </div>

            {/* Selected items display - matching FormEntityMultiSelectAuto pattern */}
            {value.length > 0 ? (
              <div className="flex flex-wrap gap-3">
                {(value as string[]).map((characterId) => {
                  const character = allCharacters.find(
                    (c) => c.id === characterId
                  );
                  return character ? (
                    <div
                      key={characterId}
                      className="flex items-center gap-2 p-2 pr-3 rounded-lg border border-border bg-card"
                    >
                      {character.image ? (
                        <img
                          src={convertFileSrc(character.image)}
                          alt={character.name}
                          className="w-10 h-10 rounded-md object-cover flex-shrink-0"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-md bg-muted-foreground/20 flex items-center justify-center flex-shrink-0">
                          <span className="text-xs text-muted-foreground font-semibold">
                            {character.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()
                              .slice(0, 2)}
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
              <div className="text-center py-6 text-muted-foreground border border-dashed border-border rounded-lg">
                <p className="text-sm">{t(noSelectionKey)}</p>
              </div>
            )}
          </div>
        )}
      </FieldWithVisibilityToggle>
    );
  };


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
        {/* 1. Avós (Grandparents) - Max 4 (2 paternal + 2 maternal) */}
        {renderFamilyField(
          "grandparents",
          "character-detail:family.grandparents",
          "character-detail:family.select_grandparents",
          "character-detail:family.no_grandparents_selected",
          4
        )}

        {/* 2. Pais (Parents) - Max 2 */}
        {renderFamilyField(
          "parents",
          "character-detail:family.parents",
          "character-detail:family.select_parents",
          "character-detail:family.no_parents_selected",
          2
        )}

        {/* 3. Cônjuges (Spouses) - No limit */}
        {renderFamilyField(
          "spouses",
          "character-detail:family.spouses",
          "character-detail:family.select_spouses",
          "character-detail:family.no_spouses_selected"
        )}

        {/* 4. Tios (Uncles/Aunts) - No limit */}
        {renderFamilyField(
          "unclesAunts",
          "character-detail:family.uncles_aunts",
          "character-detail:family.select_uncles_aunts",
          "character-detail:family.no_uncles_aunts_selected"
        )}

        {/* 5. Primos (Cousins) - No limit */}
        {renderFamilyField(
          "cousins",
          "character-detail:family.cousins",
          "character-detail:family.select_cousins",
          "character-detail:family.no_cousins_selected"
        )}

        {/* 6. Filhos (Children) - No limit */}
        {renderFamilyField(
          "children",
          "character-detail:family.children",
          "character-detail:family.select_children",
          "character-detail:family.no_children_selected"
        )}

        {/* 7. Irmãos (Siblings) - No limit */}
        {renderFamilyField(
          "siblings",
          "character-detail:family.siblings",
          "character-detail:family.select_siblings",
          "character-detail:family.no_siblings_selected"
        )}

        {/* 8. Meio-irmãos (Half Siblings) - No limit */}
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

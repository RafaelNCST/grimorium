import React, { useState } from "react";

import { Heart, Users, X, TreePine } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { type ICharacterFamily } from "@/types/character-types";

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
  isEditMode: boolean;
  onFamilyChange: (family: ICharacterFamily) => void;
}

interface FamilyMemberCardProps {
  character: ICharacter;
  relation: string;
  onRemove?: () => void;
  isEditMode: boolean;
}

function FamilyMemberCard({
  character,
  relation,
  onRemove,
  isEditMode,
}: FamilyMemberCardProps) {
  const { t } = useTranslation("character-detail");

  return (
    <div className="flex items-center gap-2 p-2 rounded-lg border bg-card hover:bg-muted/50 transition-colors">
      <Avatar className="w-8 h-8">
        <AvatarImage src={character.image} className="object-cover" />
        <AvatarFallback className="text-xs">
          {character.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .slice(0, 2)}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{character.name}</p>
        <p className="text-xs text-muted-foreground">
          {t(`character-detail:family.${relation}`)}
        </p>
      </div>
      {isEditMode && onRemove && (
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 text-muted-foreground hover:text-destructive"
          onClick={onRemove}
        >
          <X className="w-3 h-3" />
        </Button>
      )}
    </div>
  );
}

export function FamilySection({
  family,
  allCharacters,
  currentCharacterId,
  isEditMode,
  onFamilyChange,
}: FamilySectionProps) {
  const { t } = useTranslation("character-detail");
  const [isTreeDialogOpen, setIsTreeDialogOpen] = useState(false);

  // Filter available characters (exclude self and already selected)
  const getAvailableCharacters = (excludeIds: string[] = []) =>
    allCharacters.filter(
      (char) => char.id !== currentCharacterId && !excludeIds.includes(char.id)
    );

  const getCharacterById = (id: string): ICharacter | undefined =>
    allCharacters.find((char) => char.id === id);

  // Handle single-value family relations (father, mother, spouse)
  const handleSingleRelationChange = (
    relationType: "father" | "mother" | "spouse",
    value: string
  ) => {
    onFamilyChange({
      ...family,
      [relationType]: value === "none" ? null : value,
    });
  };

  // Handle multi-value family relations
  const handleMultiRelationAdd = (
    relationType: keyof ICharacterFamily,
    characterId: string
  ) => {
    if (characterId === "none") return;

    const currentRelations = family[relationType];
    if (
      Array.isArray(currentRelations) &&
      !currentRelations.includes(characterId)
    ) {
      onFamilyChange({
        ...family,
        [relationType]: [...currentRelations, characterId],
      });
    }
  };

  const handleMultiRelationRemove = (
    relationType: keyof ICharacterFamily,
    characterId: string
  ) => {
    const currentRelations = family[relationType];
    if (Array.isArray(currentRelations)) {
      onFamilyChange({
        ...family,
        [relationType]: currentRelations.filter((id) => id !== characterId),
      });
    }
  };

  // Check if family has any members
  const hasFamilyMembers = () => {
    if (!family) return false;
    return (
      family.father ||
      family.mother ||
      family.spouse ||
      (family.children && family.children.length > 0) ||
      (family.siblings && family.siblings.length > 0) ||
      (family.halfSiblings && family.halfSiblings.length > 0) ||
      (family.grandparents && family.grandparents.length > 0) ||
      (family.unclesAunts && family.unclesAunts.length > 0) ||
      (family.cousins && family.cousins.length > 0)
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
  if (!hasFamilyMembers() && !isEditMode) {
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
    <div className="space-y-6">
      {/* View Tree Button - Only in View Mode and with family members */}
      {!isEditMode && hasFamilyMembers() && (
        <Button
          onClick={() => setIsTreeDialogOpen(true)}
          className="w-full"
          variant="outline"
        >
          <TreePine className="w-4 h-4 mr-2" />
          {t("character-detail:family.view_tree")}
        </Button>
      )}

      {/* Edit Mode */}
      {isEditMode && (
        <div className="space-y-6">
          {/* Single Relations */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-primary uppercase tracking-wide">
              {t("character-detail:family.direct_family")}
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Father */}
              <div className="space-y-2">
                <Label className="text-sm">
                  {t("character-detail:family.father")}
                </Label>
                <Select
                  value={family.father || "none"}
                  onValueChange={(value) =>
                    handleSingleRelationChange("father", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={t("character-detail:family.select_father")}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">
                      {t("character-detail:family.none")}
                    </SelectItem>
                    {getAvailableCharacters([
                      family.mother || "",
                      family.spouse || "",
                    ]).map((char) => (
                      <SelectItem key={char.id} value={char.id}>
                        {char.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Mother */}
              <div className="space-y-2">
                <Label className="text-sm">
                  {t("character-detail:family.mother")}
                </Label>
                <Select
                  value={family.mother || "none"}
                  onValueChange={(value) =>
                    handleSingleRelationChange("mother", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={t("character-detail:family.select_mother")}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">
                      {t("character-detail:family.none")}
                    </SelectItem>
                    {getAvailableCharacters([
                      family.father || "",
                      family.spouse || "",
                    ]).map((char) => (
                      <SelectItem key={char.id} value={char.id}>
                        {char.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Spouse */}
              <div className="space-y-2">
                <Label className="text-sm">
                  {t("character-detail:family.spouse")}
                </Label>
                <Select
                  value={family.spouse || "none"}
                  onValueChange={(value) =>
                    handleSingleRelationChange("spouse", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={t("character-detail:family.select_spouse")}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">
                      {t("character-detail:family.none")}
                    </SelectItem>
                    {getAvailableCharacters([
                      family.father || "",
                      family.mother || "",
                    ]).map((char) => (
                      <SelectItem key={char.id} value={char.id}>
                        {char.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Separator />

          {/* Multi-value Relations - Children */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold">
              {t("character-detail:family.children")}
            </Label>
            <Select
              value="none"
              onValueChange={(value) =>
                handleMultiRelationAdd("children", value)
              }
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={t("character-detail:family.add_child")}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">
                  {t("character-detail:family.select")}
                </SelectItem>
                {getAvailableCharacters([
                  ...family.children,
                  family.father || "",
                  family.mother || "",
                  family.spouse || "",
                ]).map((char) => (
                  <SelectItem key={char.id} value={char.id}>
                    {char.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {family.children.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {family.children.map((childId) => {
                  const character = getCharacterById(childId);
                  return character ? (
                    <FamilyMemberCard
                      key={childId}
                      character={character}
                      relation="child"
                      isEditMode={isEditMode}
                      onRemove={() =>
                        handleMultiRelationRemove("children", childId)
                      }
                    />
                  ) : null;
                })}
              </div>
            )}
          </div>

          {/* Siblings */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold">
              {t("character-detail:family.siblings")}
            </Label>
            <Select
              value="none"
              onValueChange={(value) =>
                handleMultiRelationAdd("siblings", value)
              }
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={t("character-detail:family.add_sibling")}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">
                  {t("character-detail:family.select")}
                </SelectItem>
                {getAvailableCharacters([
                  ...family.siblings,
                  ...family.halfSiblings,
                  ...family.children,
                  family.father || "",
                  family.mother || "",
                  family.spouse || "",
                ]).map((char) => (
                  <SelectItem key={char.id} value={char.id}>
                    {char.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {family.siblings.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {family.siblings.map((siblingId) => {
                  const character = getCharacterById(siblingId);
                  return character ? (
                    <FamilyMemberCard
                      key={siblingId}
                      character={character}
                      relation="sibling"
                      isEditMode={isEditMode}
                      onRemove={() =>
                        handleMultiRelationRemove("siblings", siblingId)
                      }
                    />
                  ) : null;
                })}
              </div>
            )}
          </div>

          {/* Half Siblings */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold">
              {t("character-detail:family.half_siblings")}
            </Label>
            <Select
              value="none"
              onValueChange={(value) =>
                handleMultiRelationAdd("halfSiblings", value)
              }
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={t("character-detail:family.add_half_sibling")}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">
                  {t("character-detail:family.select")}
                </SelectItem>
                {getAvailableCharacters([
                  ...family.siblings,
                  ...family.halfSiblings,
                  ...family.children,
                  family.father || "",
                  family.mother || "",
                  family.spouse || "",
                ]).map((char) => (
                  <SelectItem key={char.id} value={char.id}>
                    {char.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {family.halfSiblings.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {family.halfSiblings.map((halfSiblingId) => {
                  const character = getCharacterById(halfSiblingId);
                  return character ? (
                    <FamilyMemberCard
                      key={halfSiblingId}
                      character={character}
                      relation="half_sibling"
                      isEditMode={isEditMode}
                      onRemove={() =>
                        handleMultiRelationRemove("halfSiblings", halfSiblingId)
                      }
                    />
                  ) : null;
                })}
              </div>
            )}
          </div>

          <Separator />

          {/* Extended Family */}
          <h4 className="text-sm font-semibold text-primary uppercase tracking-wide">
            {t("character-detail:family.extended_family")}
          </h4>

          {/* Grandparents */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold">
              {t("character-detail:family.grandparents")}
            </Label>
            <Select
              value="none"
              onValueChange={(value) =>
                handleMultiRelationAdd("grandparents", value)
              }
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={t("character-detail:family.add_grandparent")}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">
                  {t("character-detail:family.select")}
                </SelectItem>
                {getAvailableCharacters([
                  ...family.grandparents,
                  ...family.children,
                  family.father || "",
                  family.mother || "",
                  family.spouse || "",
                ]).map((char) => (
                  <SelectItem key={char.id} value={char.id}>
                    {char.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {family.grandparents.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {family.grandparents.map((grandparentId) => {
                  const character = getCharacterById(grandparentId);
                  return character ? (
                    <FamilyMemberCard
                      key={grandparentId}
                      character={character}
                      relation="grandparent"
                      isEditMode={isEditMode}
                      onRemove={() =>
                        handleMultiRelationRemove("grandparents", grandparentId)
                      }
                    />
                  ) : null;
                })}
              </div>
            )}
          </div>

          {/* Uncles/Aunts */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold">
              {t("character-detail:family.uncles_aunts")}
            </Label>
            <Select
              value="none"
              onValueChange={(value) =>
                handleMultiRelationAdd("unclesAunts", value)
              }
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={t("character-detail:family.add_uncle_aunt")}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">
                  {t("character-detail:family.select")}
                </SelectItem>
                {getAvailableCharacters([
                  ...family.unclesAunts,
                  ...family.children,
                  family.father || "",
                  family.mother || "",
                  family.spouse || "",
                ]).map((char) => (
                  <SelectItem key={char.id} value={char.id}>
                    {char.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {family.unclesAunts.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {family.unclesAunts.map((uncleAuntId) => {
                  const character = getCharacterById(uncleAuntId);
                  return character ? (
                    <FamilyMemberCard
                      key={uncleAuntId}
                      character={character}
                      relation="uncle_aunt"
                      isEditMode={isEditMode}
                      onRemove={() =>
                        handleMultiRelationRemove("unclesAunts", uncleAuntId)
                      }
                    />
                  ) : null;
                })}
              </div>
            )}
          </div>

          {/* Cousins */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold">
              {t("character-detail:family.cousins")}
            </Label>
            <Select
              value="none"
              onValueChange={(value) =>
                handleMultiRelationAdd("cousins", value)
              }
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={t("character-detail:family.add_cousin")}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">
                  {t("character-detail:family.select")}
                </SelectItem>
                {getAvailableCharacters([
                  ...family.cousins,
                  ...family.siblings,
                  ...family.halfSiblings,
                  ...family.children,
                  family.father || "",
                  family.mother || "",
                  family.spouse || "",
                ]).map((char) => (
                  <SelectItem key={char.id} value={char.id}>
                    {char.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {family.cousins.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {family.cousins.map((cousinId) => {
                  const character = getCharacterById(cousinId);
                  return character ? (
                    <FamilyMemberCard
                      key={cousinId}
                      character={character}
                      relation="cousin"
                      isEditMode={isEditMode}
                      onRemove={() =>
                        handleMultiRelationRemove("cousins", cousinId)
                      }
                    />
                  ) : null;
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* View Mode */}
      {!isEditMode && hasFamilyMembers() && (
        <div className="space-y-6">
          {/* Direct Family */}
          {(family.father || family.mother || family.spouse) && (
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-primary uppercase tracking-wide">
                {t("character-detail:family.direct_family")}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {family.father && getCharacterById(family.father) && (
                  <FamilyMemberCard
                    character={getCharacterById(family.father)!}
                    relation="father"
                    isEditMode={false}
                  />
                )}
                {family.mother && getCharacterById(family.mother) && (
                  <FamilyMemberCard
                    character={getCharacterById(family.mother)!}
                    relation="mother"
                    isEditMode={false}
                  />
                )}
                {family.spouse && getCharacterById(family.spouse) && (
                  <FamilyMemberCard
                    character={getCharacterById(family.spouse)!}
                    relation="spouse"
                    isEditMode={false}
                  />
                )}
              </div>
            </div>
          )}

          {/* Children */}
          {family.children.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-semibold">
                {t("character-detail:family.children")}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {family.children.map((childId) => {
                  const character = getCharacterById(childId);
                  return character ? (
                    <FamilyMemberCard
                      key={childId}
                      character={character}
                      relation="child"
                      isEditMode={false}
                    />
                  ) : null;
                })}
              </div>
            </div>
          )}

          {/* Siblings */}
          {(family.siblings.length > 0 || family.halfSiblings.length > 0) && (
            <div className="space-y-3">
              <h4 className="text-sm font-semibold">
                {t("character-detail:family.siblings")}
              </h4>
              <div className="space-y-4">
                {family.siblings.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground">
                      {t("character-detail:family.full_siblings")}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {family.siblings.map((siblingId) => {
                        const character = getCharacterById(siblingId);
                        return character ? (
                          <FamilyMemberCard
                            key={siblingId}
                            character={character}
                            relation="sibling"
                            isEditMode={false}
                          />
                        ) : null;
                      })}
                    </div>
                  </div>
                )}
                {family.halfSiblings.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground">
                      {t("character-detail:family.half_siblings")}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {family.halfSiblings.map((halfSiblingId) => {
                        const character = getCharacterById(halfSiblingId);
                        return character ? (
                          <FamilyMemberCard
                            key={halfSiblingId}
                            character={character}
                            relation="half_sibling"
                            isEditMode={false}
                          />
                        ) : null;
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Extended Family */}
          {(family.grandparents.length > 0 ||
            family.unclesAunts.length > 0 ||
            family.cousins.length > 0) && (
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-primary uppercase tracking-wide">
                {t("character-detail:family.extended_family")}
              </h4>

              {family.grandparents.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">
                    {t("character-detail:family.grandparents")}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {family.grandparents.map((grandparentId) => {
                      const character = getCharacterById(grandparentId);
                      return character ? (
                        <FamilyMemberCard
                          key={grandparentId}
                          character={character}
                          relation="grandparent"
                          isEditMode={false}
                        />
                      ) : null;
                    })}
                  </div>
                </div>
              )}

              {family.unclesAunts.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">
                    {t("character-detail:family.uncles_aunts")}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {family.unclesAunts.map((uncleAuntId) => {
                      const character = getCharacterById(uncleAuntId);
                      return character ? (
                        <FamilyMemberCard
                          key={uncleAuntId}
                          character={character}
                          relation="uncle_aunt"
                          isEditMode={false}
                        />
                      ) : null;
                    })}
                  </div>
                </div>
              )}

              {family.cousins.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">
                    {t("character-detail:family.cousins")}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {family.cousins.map((cousinId) => {
                      const character = getCharacterById(cousinId);
                      return character ? (
                        <FamilyMemberCard
                          key={cousinId}
                          character={character}
                          relation="cousin"
                          isEditMode={false}
                        />
                      ) : null;
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

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
}

import React from "react";
import { X } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { type ICharacterFamily } from "@/types/character-types";

interface ICharacter {
  id: string;
  name: string;
  image?: string;
  role?: string;
}

interface FamilyTreeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  family: ICharacterFamily;
  allCharacters: ICharacter[];
  currentCharacterId: string;
}

interface TreeNodeProps {
  character: ICharacter;
  relation: string;
  isCurrentCharacter?: boolean;
}

function TreeNode({ character, relation, isCurrentCharacter }: TreeNodeProps) {
  const { t } = useTranslation("character-detail");

  return (
    <div className="flex flex-col items-center gap-2 min-w-[120px]">
      <div
        className={`relative p-1 rounded-full ${
          isCurrentCharacter
            ? "ring-2 ring-primary bg-primary/10"
            : "ring-1 ring-border"
        }`}
      >
        <Avatar className="w-16 h-16">
          <AvatarImage src={character.image} className="object-cover" />
          <AvatarFallback className="text-sm font-semibold">
            {character.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2)}
          </AvatarFallback>
        </Avatar>
      </div>
      <div className="text-center">
        <p className="font-semibold text-sm leading-tight">{character.name}</p>
        <p className="text-xs text-muted-foreground">
          {t(`character-detail:family.${relation}`)}
        </p>
      </div>
    </div>
  );
}

function ConnectionLine({ direction = "vertical" }: { direction?: "vertical" | "horizontal" }) {
  if (direction === "horizontal") {
    return <div className="w-8 h-0.5 bg-border" />;
  }
  return <div className="w-0.5 h-8 bg-border" />;
}

function TreeLevel({
  characters,
  relation,
  currentCharacterId,
}: {
  characters: ICharacter[];
  relation: string;
  currentCharacterId: string;
}) {
  if (characters.length === 0) return null;

  return (
    <div className="flex items-center justify-center gap-6 flex-wrap">
      {characters.map((char) => (
        <TreeNode
          key={char.id}
          character={char}
          relation={relation}
          isCurrentCharacter={char.id === currentCharacterId}
        />
      ))}
    </div>
  );
}

export function FamilyTreeDialog({
  isOpen,
  onClose,
  family,
  allCharacters,
  currentCharacterId,
}: FamilyTreeDialogProps) {
  const { t } = useTranslation("character-detail");

  const getCharacterById = (id: string): ICharacter | undefined => {
    return allCharacters.find((char) => char.id === id);
  };

  const getCurrentCharacter = (): ICharacter | undefined => {
    return getCharacterById(currentCharacterId);
  };

  // Organize family members by generation
  const grandparents = family.grandparents
    .map((id) => getCharacterById(id))
    .filter((c): c is ICharacter => c !== undefined);

  const parents: ICharacter[] = [];
  if (family.father) {
    const father = getCharacterById(family.father);
    if (father) parents.push(father);
  }
  if (family.mother) {
    const mother = getCharacterById(family.mother);
    if (mother) parents.push(mother);
  }

  const unclesAunts = family.unclesAunts
    .map((id) => getCharacterById(id))
    .filter((c): c is ICharacter => c !== undefined);

  const currentGeneration: ICharacter[] = [];
  const currentChar = getCurrentCharacter();
  if (currentChar) currentGeneration.push(currentChar);

  // Add siblings
  const siblings = family.siblings
    .map((id) => getCharacterById(id))
    .filter((c): c is ICharacter => c !== undefined);
  currentGeneration.push(...siblings);

  const halfSiblings = family.halfSiblings
    .map((id) => getCharacterById(id))
    .filter((c): c is ICharacter => c !== undefined);

  const cousins = family.cousins
    .map((id) => getCharacterById(id))
    .filter((c): c is ICharacter => c !== undefined);

  const spouse = family.spouse ? getCharacterById(family.spouse) : null;

  const children = family.children
    .map((id) => getCharacterById(id))
    .filter((c): c is ICharacter => c !== undefined);

  // Check if tree has any members besides current character
  const hasAnyFamily =
    grandparents.length > 0 ||
    parents.length > 0 ||
    unclesAunts.length > 0 ||
    siblings.length > 0 ||
    halfSiblings.length > 0 ||
    cousins.length > 0 ||
    spouse ||
    children.length > 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            {t("character-detail:family.family_tree")}
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </DialogTitle>
          <DialogDescription>
            {t("character-detail:family.family_tree_description")}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-full max-h-[70vh] pr-4">
          {!hasAnyFamily ? (
            <div className="flex items-center justify-center py-16">
              <div className="text-center text-muted-foreground">
                <p className="font-medium">
                  {t("character-detail:empty_states.no_family")}
                </p>
                <p className="text-xs mt-1">
                  {t("character-detail:empty_states.no_family_hint")}
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-8 py-8">
              {/* Grandparents Level */}
              {grandparents.length > 0 && (
                <div className="space-y-4">
                  <TreeLevel
                    characters={grandparents}
                    relation="grandparent"
                    currentCharacterId={currentCharacterId}
                  />
                  <div className="flex justify-center">
                    <ConnectionLine />
                  </div>
                </div>
              )}

              {/* Parents and Uncles/Aunts Level */}
              {(parents.length > 0 || unclesAunts.length > 0) && (
                <div className="space-y-4">
                  <div className="flex items-start justify-center gap-12">
                    {parents.length > 0 && (
                      <div className="space-y-4">
                        <TreeLevel
                          characters={parents}
                          relation={parents.length > 1 ? "parents" : parents[0].id === family.father ? "father" : "mother"}
                          currentCharacterId={currentCharacterId}
                        />
                      </div>
                    )}
                    {unclesAunts.length > 0 && (
                      <div className="space-y-4">
                        <TreeLevel
                          characters={unclesAunts}
                          relation="uncle_aunt"
                          currentCharacterId={currentCharacterId}
                        />
                      </div>
                    )}
                  </div>
                  <div className="flex justify-center">
                    <ConnectionLine />
                  </div>
                </div>
              )}

              {/* Current Generation - Character, Siblings, Cousins */}
              <div className="space-y-4">
                <div className="flex items-start justify-center gap-12">
                  {/* Siblings and Current Character */}
                  {currentGeneration.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-center gap-6 flex-wrap">
                        {currentGeneration.map((char) => (
                          <TreeNode
                            key={char.id}
                            character={char}
                            relation={
                              char.id === currentCharacterId
                                ? "current"
                                : "sibling"
                            }
                            isCurrentCharacter={char.id === currentCharacterId}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Half Siblings */}
                  {halfSiblings.length > 0 && (
                    <div className="space-y-2">
                      <TreeLevel
                        characters={halfSiblings}
                        relation="half_sibling"
                        currentCharacterId={currentCharacterId}
                      />
                    </div>
                  )}

                  {/* Cousins */}
                  {cousins.length > 0 && (
                    <div className="space-y-2">
                      <TreeLevel
                        characters={cousins}
                        relation="cousin"
                        currentCharacterId={currentCharacterId}
                      />
                    </div>
                  )}
                </div>

                {/* Connection to spouse and children */}
                {(spouse || children.length > 0) && (
                  <div className="flex justify-center">
                    <ConnectionLine />
                  </div>
                )}
              </div>

              {/* Spouse */}
              {spouse && (
                <div className="space-y-4">
                  <div className="flex justify-center">
                    <TreeNode
                      character={spouse}
                      relation="spouse"
                      isCurrentCharacter={false}
                    />
                  </div>
                  {children.length > 0 && (
                    <div className="flex justify-center">
                      <ConnectionLine />
                    </div>
                  )}
                </div>
              )}

              {/* Children Level */}
              {children.length > 0 && (
                <div className="space-y-4">
                  <TreeLevel
                    characters={children}
                    relation="child"
                    currentCharacterId={currentCharacterId}
                  />
                </div>
              )}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

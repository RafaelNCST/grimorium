import React, { useState } from "react";

import {
  Heart,
  Swords,
  GraduationCap,
  BookOpen,
  Skull,
  Sparkles,
  Shield,
  Users,
  Crown,
  UserPlus,
  Edit2,
  Trash2,
  X,
  type LucideIcon,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";

interface ICharacterRelationship {
  id: string;
  characterId: string;
  type: string;
  intensity: number;
}

interface ICharacter {
  id: string;
  name: string;
  image?: string;
  role?: string;
}

interface RelationshipsSectionProps {
  relationships: ICharacterRelationship[];
  allCharacters: ICharacter[];
  currentCharacterId: string;
  isEditMode: boolean;
  onRelationshipsChange: (relationships: ICharacterRelationship[]) => void;
}

interface RelationshipTypeConfig {
  value: string;
  translationKey: string;
  icon: LucideIcon;
  color: string;
}

const RELATIONSHIP_TYPES: RelationshipTypeConfig[] = [
  {
    value: "friend",
    translationKey: "friend",
    icon: Users,
    color: "bg-green-500/10 text-green-600 border-green-500/20",
  },
  {
    value: "rival",
    translationKey: "rival",
    icon: Swords,
    color: "bg-orange-500/10 text-orange-600 border-orange-500/20",
  },
  {
    value: "mentor",
    translationKey: "mentor",
    icon: GraduationCap,
    color: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  },
  {
    value: "student",
    translationKey: "student",
    icon: BookOpen,
    color: "bg-cyan-500/10 text-cyan-600 border-cyan-500/20",
  },
  {
    value: "enemy",
    translationKey: "enemy",
    icon: Skull,
    color: "bg-red-500/10 text-red-600 border-red-500/20",
  },
  {
    value: "love_interest",
    translationKey: "love_interest",
    icon: Heart,
    color: "bg-pink-500/10 text-pink-600 border-pink-500/20",
  },
  {
    value: "ally",
    translationKey: "ally",
    icon: Shield,
    color: "bg-indigo-500/10 text-indigo-600 border-indigo-500/20",
  },
  {
    value: "acquaintance",
    translationKey: "acquaintance",
    icon: Sparkles,
    color: "bg-gray-500/10 text-gray-600 border-gray-500/20",
  },
  {
    value: "leader",
    translationKey: "leader",
    icon: Crown,
    color: "bg-purple-500/10 text-purple-600 border-purple-500/20",
  },
];

export function RelationshipsSection({
  relationships,
  allCharacters,
  currentCharacterId,
  isEditMode,
  onRelationshipsChange,
}: RelationshipsSectionProps) {
  const { t } = useTranslation("character-detail");

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingRelationship, setEditingRelationship] =
    useState<ICharacterRelationship | null>(null);

  const [selectedCharacterId, setSelectedCharacterId] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("");
  const [intensity, setIntensity] = useState<number[]>([5]);

  // Filter out current character and already related characters
  const availableCharacters = allCharacters.filter(
    (char) =>
      char.id !== currentCharacterId &&
      !relationships.some((rel) => rel.characterId === char.id)
  );

  const getRelationshipTypeConfig = (
    type: string
  ): RelationshipTypeConfig | undefined =>
    RELATIONSHIP_TYPES.find((t) => t.value === type);

  const getCharacterById = (characterId: string): ICharacter | undefined =>
    allCharacters.find((char) => char.id === characterId);

  const handleAddRelationship = () => {
    if (!selectedCharacterId || !selectedType) return;

    const newRelationship: ICharacterRelationship = {
      id: Date.now().toString(),
      characterId: selectedCharacterId,
      type: selectedType,
      intensity: intensity[0],
    };

    onRelationshipsChange([...relationships, newRelationship]);

    // Reset form
    setSelectedCharacterId("");
    setSelectedType("");
    setIntensity([5]);
    setIsAddDialogOpen(false);
  };

  const handleEditRelationship = () => {
    if (!editingRelationship) return;

    const updatedRelationships = relationships.map((rel) =>
      rel.id === editingRelationship.id
        ? { ...rel, type: selectedType, intensity: intensity[0] }
        : rel
    );

    onRelationshipsChange(updatedRelationships);
    setIsEditDialogOpen(false);
    setEditingRelationship(null);
    setSelectedType("");
    setIntensity([5]);
  };

  const handleDeleteRelationship = (relationshipId: string) => {
    const updatedRelationships = relationships.filter(
      (rel) => rel.id !== relationshipId
    );
    onRelationshipsChange(updatedRelationships);
  };

  const openEditDialog = (relationship: ICharacterRelationship) => {
    setEditingRelationship(relationship);
    setSelectedType(relationship.type);
    setIntensity([relationship.intensity]);
    setIsEditDialogOpen(true);
  };

  const closeAddDialog = () => {
    setIsAddDialogOpen(false);
    setSelectedCharacterId("");
    setSelectedType("");
    setIntensity([5]);
  };

  const closeEditDialog = () => {
    setIsEditDialogOpen(false);
    setEditingRelationship(null);
    setSelectedType("");
    setIntensity([5]);
  };

  // Empty state when no characters available
  if (allCharacters.length <= 1 && isEditMode) {
    return (
      <div className="text-center text-muted-foreground text-sm py-8">
        <Heart className="w-12 h-12 mx-auto mb-3 opacity-50" />
        <p className="font-medium">
          {t(
            "character-detail:empty_states.need_more_characters_relationships"
          )}
        </p>
        <p className="text-xs mt-1">
          {t(
            "character-detail:empty_states.need_more_characters_relationships_hint"
          )}
        </p>
      </div>
    );
  }

  // Empty state when no relationships in view mode
  if (relationships.length === 0 && !isEditMode) {
    return (
      <div className="text-center text-muted-foreground text-sm py-8">
        <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
        <p className="font-medium">
          {t("character-detail:empty_states.no_relationships")}
        </p>
        <p className="text-xs mt-1">
          {t("character-detail:empty_states.no_relationships_hint")}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Add Relationship Button - Only in Edit Mode */}
      {isEditMode && availableCharacters.length > 0 && (
        <Button
          onClick={() => setIsAddDialogOpen(true)}
          className="w-full"
          variant="outline"
        >
          <UserPlus className="w-4 h-4 mr-2" />
          {t("character-detail:relationships.add_relationship")}
        </Button>
      )}

      {/* Empty state in edit mode when no characters available */}
      {isEditMode &&
        availableCharacters.length === 0 &&
        relationships.length === 0 && (
          <div className="text-center text-muted-foreground text-sm py-8">
            <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="font-medium">
              {t("character-detail:empty_states.no_characters_to_add")}
            </p>
            <p className="text-xs mt-1">
              {t("character-detail:empty_states.create_more_hint")}
            </p>
          </div>
        )}

      {/* Relationships List */}
      {relationships.length > 0 && (
        <div className="space-y-3">
          {relationships.map((relationship) => {
            const character = getCharacterById(relationship.characterId);
            const typeConfig = getRelationshipTypeConfig(relationship.type);

            if (!character || !typeConfig) return null;

            const TypeIcon = typeConfig.icon;

            return (
              <Card
                key={relationship.id}
                className="p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-4">
                  {/* Character Avatar */}
                  <Avatar className="w-12 h-12">
                    <AvatarImage
                      src={character.image}
                      className="object-cover"
                    />
                    <AvatarFallback>
                      {character.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>

                  {/* Character Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-sm truncate">
                        {character.name}
                      </h4>
                      <Badge
                        variant="outline"
                        className={`${typeConfig.color} flex items-center gap-1`}
                      >
                        <TypeIcon className="w-3 h-3" />
                        <span className="text-xs">
                          {t(
                            `character-detail:relationship_types.${typeConfig.translationKey}`
                          )}
                        </span>
                      </Badge>
                    </div>

                    {/* Intensity Bar */}
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary transition-all duration-300"
                          style={{ width: `${relationship.intensity * 10}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground font-medium min-w-[2rem]">
                        {relationship.intensity}/10
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons - Only in Edit Mode */}
                  {isEditMode && (
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => openEditDialog(relationship)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() =>
                          handleDeleteRelationship(relationship.id)
                        }
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Add Relationship Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>
              {t("character-detail:relationships.add_relationship")}
            </DialogTitle>
            <DialogDescription>
              {t("character-detail:relationships.select_character")}
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="max-h-[60vh] pr-4">
            <div className="space-y-6">
              {/* Character Selection Grid */}
              <div className="space-y-3">
                <Label className="text-sm font-semibold">
                  {t("character-detail:relationships.select_character")}
                </Label>
                <div className="grid grid-cols-2 gap-3">
                  {availableCharacters.map((character) => (
                    <Card
                      key={character.id}
                      className={`p-3 cursor-pointer transition-all hover:shadow-md ${
                        selectedCharacterId === character.id
                          ? "ring-2 ring-primary bg-primary/5"
                          : "hover:bg-muted/30"
                      }`}
                      onClick={() => setSelectedCharacterId(character.id)}
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage
                            src={character.image}
                            className="object-cover"
                          />
                          <AvatarFallback>
                            {character.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">
                            {character.name}
                          </p>
                          {character.role && (
                            <p className="text-xs text-muted-foreground truncate">
                              {character.role}
                            </p>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Relationship Type Selection */}
              {selectedCharacterId && (
                <div className="space-y-3">
                  <Label className="text-sm font-semibold">
                    {t("character-detail:relationships.relationship_type")}
                  </Label>
                  <div className="grid grid-cols-3 gap-2">
                    {RELATIONSHIP_TYPES.map((type) => {
                      const Icon = type.icon;
                      return (
                        <Card
                          key={type.value}
                          className={`p-3 cursor-pointer transition-all hover:shadow-md ${
                            selectedType === type.value
                              ? `ring-2 ring-primary ${type.color}`
                              : "hover:bg-muted/30"
                          }`}
                          onClick={() => setSelectedType(type.value)}
                        >
                          <div className="flex flex-col items-center gap-2 text-center">
                            <Icon className="w-6 h-6" />
                            <span className="text-xs font-medium">
                              {t(
                                `character-detail:relationship_types.${type.translationKey}`
                              )}
                            </span>
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Intensity Slider */}
              {selectedCharacterId && selectedType && (
                <div className="space-y-3">
                  <Label className="text-sm font-semibold">
                    {t("character-detail:relationships.intensity")}:{" "}
                    {intensity[0]}/10
                  </Label>
                  <Slider
                    value={intensity}
                    onValueChange={setIntensity}
                    max={10}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>
                      {t(
                        "character-detail:relationships.intensity_labels.weak"
                      )}
                    </span>
                    <span>
                      {t(
                        "character-detail:relationships.intensity_labels.moderate"
                      )}
                    </span>
                    <span>
                      {t(
                        "character-detail:relationships.intensity_labels.strong"
                      )}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <DialogFooter>
            <Button variant="outline" onClick={closeAddDialog}>
              <X className="w-4 h-4 mr-2" />
              {t("character-detail:relationships.cancel")}
            </Button>
            <Button
              onClick={handleAddRelationship}
              disabled={!selectedCharacterId || !selectedType}
            >
              <UserPlus className="w-4 h-4 mr-2" />
              {t("character-detail:relationships.add")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Relationship Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>
              {t("character-detail:relationships.edit_title")}
            </DialogTitle>
            <DialogDescription>
              {editingRelationship &&
                `${t("character-detail:relationships.editing_with")} ${
                  getCharacterById(editingRelationship.characterId)?.name
                }`}
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="max-h-[60vh] pr-4">
            <div className="space-y-6">
              {/* Relationship Type Selection */}
              <div className="space-y-3">
                <Label className="text-sm font-semibold">
                  {t("character-detail:relationships.relationship_type")}
                </Label>
                <div className="grid grid-cols-3 gap-2">
                  {RELATIONSHIP_TYPES.map((type) => {
                    const Icon = type.icon;
                    return (
                      <Card
                        key={type.value}
                        className={`p-3 cursor-pointer transition-all hover:shadow-md ${
                          selectedType === type.value
                            ? `ring-2 ring-primary ${type.color}`
                            : "hover:bg-muted/30"
                        }`}
                        onClick={() => setSelectedType(type.value)}
                      >
                        <div className="flex flex-col items-center gap-2 text-center">
                          <Icon className="w-6 h-6" />
                          <span className="text-xs font-medium">
                            {t(
                              `character-detail:relationship_types.${type.translationKey}`
                            )}
                          </span>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </div>

              {/* Intensity Slider */}
              <div className="space-y-3">
                <Label className="text-sm font-semibold">
                  {t("character-detail:relationships.intensity")}:{" "}
                  {intensity[0]}
                  /10
                </Label>
                <Slider
                  value={intensity}
                  onValueChange={setIntensity}
                  max={10}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>
                    {t("character-detail:relationships.intensity_labels.weak")}
                  </span>
                  <span>
                    {t(
                      "character-detail:relationships.intensity_labels.moderate"
                    )}
                  </span>
                  <span>
                    {t(
                      "character-detail:relationships.intensity_labels.strong"
                    )}
                  </span>
                </div>
              </div>
            </div>
          </ScrollArea>

          <DialogFooter>
            <Button variant="outline" onClick={closeEditDialog}>
              <X className="w-4 h-4 mr-2" />
              {t("character-detail:relationships.cancel")}
            </Button>
            <Button onClick={handleEditRelationship} disabled={!selectedType}>
              <Edit2 className="w-4 h-4 mr-2" />
              {t("character-detail:relationships.save")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

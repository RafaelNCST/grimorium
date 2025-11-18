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
  ChevronLeft,
  UserMinus,
  Home,
  HeartHandshake,
  UserCheck,
  Flame,
  Minus,
  Sparkle,
  type LucideIcon,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EntityTagBadge } from "@/components/ui/entity-tag-badge";
import { FormSimpleGrid } from "@/components/forms/FormSimpleGrid";
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
import { Textarea } from "@/components/ui/textarea";
import { RELATIONSHIP_TYPES_BADGE_CONSTANT } from "../constants/relationship-types-badge-constant";

interface ICharacterRelationship {
  id: string;
  characterId: string;
  type: string;
  intensity: number;
  description?: string;
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
  hoverColor: string;
}

const RELATIONSHIP_TYPES: RelationshipTypeConfig[] = [
  {
    value: "friend",
    translationKey: "friend",
    icon: Users,
    color: "bg-green-500/20 border-green-500/30 ring-4 ring-green-500/50 text-green-600",
    hoverColor: "hover:bg-green-500/10 hover:text-green-600 hover:border-green-500/20",
  },
  {
    value: "rival",
    translationKey: "rival",
    icon: Swords,
    color: "bg-orange-500/20 border-orange-500/30 ring-4 ring-orange-500/50 text-orange-600",
    hoverColor: "hover:bg-orange-500/10 hover:text-orange-600 hover:border-orange-500/20",
  },
  {
    value: "mentor",
    translationKey: "mentor",
    icon: GraduationCap,
    color: "bg-blue-500/20 border-blue-500/30 ring-4 ring-blue-500/50 text-blue-600",
    hoverColor: "hover:bg-blue-500/10 hover:text-blue-600 hover:border-blue-500/20",
  },
  {
    value: "apprentice",
    translationKey: "apprentice",
    icon: BookOpen,
    color: "bg-cyan-500/20 border-cyan-500/30 ring-4 ring-cyan-500/50 text-cyan-600",
    hoverColor: "hover:bg-cyan-500/10 hover:text-cyan-600 hover:border-cyan-500/20",
  },
  {
    value: "enemy",
    translationKey: "enemy",
    icon: Skull,
    color: "bg-red-500/20 border-red-500/30 ring-4 ring-red-500/50 text-red-600",
    hoverColor: "hover:bg-red-500/10 hover:text-red-600 hover:border-red-500/20",
  },
  {
    value: "love_interest",
    translationKey: "love_interest",
    icon: Heart,
    color: "bg-pink-500/20 border-pink-500/30 ring-4 ring-pink-500/50 text-pink-600",
    hoverColor: "hover:bg-pink-500/10 hover:text-pink-600 hover:border-pink-500/20",
  },
  {
    value: "ally",
    translationKey: "ally",
    icon: Shield,
    color: "bg-indigo-500/20 border-indigo-500/30 ring-4 ring-indigo-500/50 text-indigo-600",
    hoverColor: "hover:bg-indigo-500/10 hover:text-indigo-600 hover:border-indigo-500/20",
  },
  {
    value: "acquaintance",
    translationKey: "acquaintance",
    icon: Sparkles,
    color: "bg-gray-500/20 border-gray-500/30 ring-4 ring-gray-500/50 text-gray-600",
    hoverColor: "hover:bg-gray-500/10 hover:text-gray-600 hover:border-gray-500/20",
  },
  {
    value: "leader",
    translationKey: "leader",
    icon: Crown,
    color: "bg-purple-500/20 border-purple-500/30 ring-4 ring-purple-500/50 text-purple-600",
    hoverColor: "hover:bg-purple-500/10 hover:text-purple-600 hover:border-purple-500/20",
  },
  {
    value: "subordinate",
    translationKey: "subordinate",
    icon: UserMinus,
    color: "bg-slate-500/20 border-slate-500/30 ring-4 ring-slate-500/50 text-slate-600",
    hoverColor: "hover:bg-slate-500/10 hover:text-slate-600 hover:border-slate-500/20",
  },
  {
    value: "family_love",
    translationKey: "family_love",
    icon: Home,
    color: "bg-pink-400/20 border-pink-400/30 ring-4 ring-pink-400/50 text-pink-500",
    hoverColor: "hover:bg-pink-400/10 hover:text-pink-500 hover:border-pink-400/20",
  },
  {
    value: "romantic_relationship",
    translationKey: "romantic_relationship",
    icon: HeartHandshake,
    color: "bg-fuchsia-500/20 border-fuchsia-500/30 ring-4 ring-fuchsia-500/50 text-fuchsia-600",
    hoverColor: "hover:bg-fuchsia-500/10 hover:text-fuchsia-600 hover:border-fuchsia-500/20",
  },
  {
    value: "best_friend",
    translationKey: "best_friend",
    icon: UserCheck,
    color: "bg-teal-500/20 border-teal-500/30 ring-4 ring-teal-500/50 text-teal-600",
    hoverColor: "hover:bg-teal-500/10 hover:text-teal-600 hover:border-teal-500/20",
  },
  {
    value: "hatred",
    translationKey: "hatred",
    icon: Flame,
    color: "bg-red-700/20 border-red-700/30 ring-4 ring-red-700/50 text-red-700",
    hoverColor: "hover:bg-red-700/10 hover:text-red-700 hover:border-red-700/20",
  },
  {
    value: "neutral",
    translationKey: "neutral",
    icon: Minus,
    color: "bg-gray-400/20 border-gray-400/30 ring-4 ring-gray-400/50 text-gray-500",
    hoverColor: "hover:bg-gray-400/10 hover:text-gray-500 hover:border-gray-400/20",
  },
  {
    value: "devotion",
    translationKey: "devotion",
    icon: Sparkle,
    color: "bg-violet-500/20 border-violet-500/30 ring-4 ring-violet-500/50 text-violet-600",
    hoverColor: "hover:bg-violet-500/10 hover:text-violet-600 hover:border-violet-500/20",
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
  const [description, setDescription] = useState<string>("");
  const [modalStep, setModalStep] = useState<1 | 2>(1);

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
      description: description.trim() || undefined,
    };

    onRelationshipsChange([...relationships, newRelationship]);

    // Reset form and close dialog
    closeAddDialog();
  };

  const handleEditRelationship = () => {
    if (!editingRelationship || !selectedType) return;

    const updatedRelationships = relationships.map((rel) =>
      rel.id === editingRelationship.id
        ? { ...rel, type: selectedType, intensity: intensity[0], description: description.trim() || undefined }
        : rel
    );

    onRelationshipsChange(updatedRelationships);

    // Reset and close dialog
    closeEditDialog();
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
    setDescription(relationship.description || "");
    setIsEditDialogOpen(true);
  };

  const closeAddDialog = () => {
    setIsAddDialogOpen(false);
    setSelectedCharacterId("");
    setSelectedType("");
    setIntensity([5]);
    setDescription("");
    setModalStep(1);
  };

  const handleOpenAddDialog = () => {
    if (availableCharacters.length === 0) {
      return;
    }
    setIsAddDialogOpen(true);
  };

  const handleCharacterSelect = (characterId: string) => {
    setSelectedCharacterId(characterId);
    setModalStep(2);
  };

  const handleBackToStep1 = () => {
    setSelectedType("");
    setIntensity([5]);
    setDescription("");
    setModalStep(1);
  };

  const closeEditDialog = () => {
    setIsEditDialogOpen(false);
    setEditingRelationship(null);
    setSelectedType("");
    setIntensity([5]);
    setDescription("");
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
      {/* Add Relationship Button - Always visible in Edit Mode */}
      {isEditMode && (
        <Button
          onClick={handleOpenAddDialog}
          className="w-full"
          variant="secondary"
        >
          <UserPlus className="w-4 h-4 mr-2" />
          {t("character-detail:relationships.add_relationship")}
        </Button>
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
                      {(() => {
                        const badgeConfig = RELATIONSHIP_TYPES_BADGE_CONSTANT.find(
                          (r) => r.value === relationship.type
                        );
                        return badgeConfig ? (
                          <EntityTagBadge
                            config={badgeConfig}
                            label={t(
                              `character-detail:relationship_types.${badgeConfig.translationKey}`
                            )}
                          />
                        ) : null;
                      })()}
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

                    {/* Description */}
                    {relationship.description && (
                      <p className="text-xs text-muted-foreground mt-2">
                        {relationship.description}
                      </p>
                    )}
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
                        variant="ghost-destructive"
                        size="icon"
                        className="h-8 w-8"
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
              {modalStep === 1
                ? t("character-detail:relationships.add_relationship")
                : t("character-detail:relationships.select_relationship_type")}
            </DialogTitle>
            <DialogDescription>
              {modalStep === 1
                ? t("character-detail:relationships.select_character")
                : t("character-detail:relationships.configure_relationship")}
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="max-h-[60vh] pr-4">
            <div className="space-y-6 pr-2 pl-2">
              {/* STEP 1: Character Selection */}
              {modalStep === 1 && (
                <div className="space-y-3">
                  <Label className="text-sm font-semibold">
                    {t("character-detail:relationships.available_characters")}
                  </Label>
                  <div className="grid grid-cols-1 gap-3 p-1">
                    {availableCharacters.map((character) => (
                      <Card
                        key={character.id}
                        className="p-4 cursor-pointer transition-all border-muted hover:bg-muted/50"
                        onClick={() => handleCharacterSelect(character.id)}
                      >
                        <div className="flex items-center gap-4">
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
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-base truncate">
                              {character.name}
                            </p>
                            {character.role && (
                              <p className="text-sm text-muted-foreground truncate">
                                {character.role}
                              </p>
                            )}
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 2: Relationship Type & Intensity */}
              {modalStep === 2 && selectedCharacterId && (
                <div className="space-y-6">
                  {/* Selected Character Card (Read-only) */}
                  <div className="space-y-3">
                    <Label className="text-sm font-semibold">
                      {t("character-detail:relationships.selected_character")}
                    </Label>
                    <Card className="p-4 bg-primary/5 border-primary/20">
                      <div className="flex items-center gap-4">
                        <Avatar className="w-12 h-12">
                          <AvatarImage
                            src={getCharacterById(selectedCharacterId)?.image}
                            className="object-cover"
                          />
                          <AvatarFallback>
                            {getCharacterById(selectedCharacterId)
                              ?.name.split(" ")
                              .map((n) => n[0])
                              .join("")
                              .slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-base truncate">
                            {getCharacterById(selectedCharacterId)?.name}
                          </p>
                          {getCharacterById(selectedCharacterId)?.role && (
                            <p className="text-sm text-muted-foreground truncate">
                              {getCharacterById(selectedCharacterId)?.role}
                            </p>
                          )}
                        </div>
                      </div>
                    </Card>
                  </div>

                  {/* Relationship Type Selection */}
                  <FormSimpleGrid
                    value={selectedType}
                    onChange={setSelectedType}
                    label={t("character-detail:relationships.relationship_type")}
                    columns={4}
                    options={RELATIONSHIP_TYPES.map((type) => ({
                      value: type.value,
                      label: t(
                        `character-detail:relationship_types.${type.translationKey}`
                      ),
                      icon: type.icon,
                      baseColorClass: "border-muted",
                      hoverColorClass: type.hoverColor,
                      activeColorClass: type.color,
                    }))}
                  />

                  {/* Intensity Slider */}
                  {selectedType && (
                    <>
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

                      {/* Description Field */}
                      <div className="space-y-3">
                        <Label className="text-sm font-semibold">
                          {t(
                            "character-detail:relationships.description_label"
                          )}
                        </Label>
                        <Textarea
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          placeholder={t(
                            "character-detail:relationships.description_placeholder"
                          )}
                          rows={3}
                          maxLength={200}
                          className="resize-none w-full"
                        />
                        <div className="flex justify-end text-xs text-muted-foreground">
                          <span>{description.length}/200</span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </ScrollArea>

          <DialogFooter>
            {modalStep === 1 ? (
              <Button variant="secondary" onClick={closeAddDialog}>
                <X className="w-4 h-4 mr-2" />
                {t("character-detail:relationships.cancel")}
              </Button>
            ) : (
              <>
                <Button variant="secondary" onClick={handleBackToStep1}>
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  {t("character-detail:relationships.back")}
                </Button>
                <Button
                  variant="magical"
                  onClick={handleAddRelationship}
                  disabled={!selectedType}
                  className="animate-glow"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  {t("character-detail:relationships.add")}
                </Button>
              </>
            )}
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
            <div className="space-y-6 pr-2">
              {/* Relationship Type Selection */}
              <FormSimpleGrid
                value={selectedType}
                onChange={setSelectedType}
                label={t("character-detail:relationships.relationship_type")}
                columns={4}
                options={RELATIONSHIP_TYPES.map((type) => ({
                  value: type.value,
                  label: t(
                    `character-detail:relationship_types.${type.translationKey}`
                  ),
                  icon: type.icon,
                  baseColorClass: "border-muted",
                  hoverColorClass: type.hoverColor,
                  activeColorClass: type.color,
                }))}
              />

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

              {/* Description Field */}
              <div className="space-y-3">
                <Label className="text-sm font-semibold">
                  {t("character-detail:relationships.description_label")}
                </Label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={t(
                    "character-detail:relationships.description_placeholder"
                  )}
                  rows={3}
                  maxLength={200}
                  className="resize-none w-full"
                />
                <div className="flex justify-end text-xs text-muted-foreground">
                  <span>{description.length}/200</span>
                </div>
              </div>
            </div>
          </ScrollArea>

          <DialogFooter>
            <Button variant="secondary" onClick={closeEditDialog}>
              <X className="w-4 h-4 mr-2" />
              {t("character-detail:relationships.cancel")}
            </Button>
            <Button
              variant="default"
              onClick={handleEditRelationship}
              disabled={!selectedType}
            >
              <Edit2 className="w-4 h-4 mr-2" />
              {t("character-detail:relationships.save")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

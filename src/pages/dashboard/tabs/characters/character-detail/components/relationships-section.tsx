import React, { useState, useEffect } from "react";

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
  Plus,
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
  User,
  Save,
  type LucideIcon,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import { FormImageDisplay } from "@/components/forms/FormImageDisplay";
import { FormSimpleGrid } from "@/components/forms/FormSimpleGrid";
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
import { EntityTagBadge } from "@/components/ui/entity-tag-badge";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

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
  /** Controlled state for add dialog - when true, opens the add relationship dialog */
  isAddDialogOpen?: boolean;
  /** Callback when the add dialog open state changes */
  onAddDialogOpenChange?: (open: boolean) => void;
}

interface RelationshipTypeConfig {
  value: string;
  translationKey: string;
  icon: LucideIcon;
}

const RELATIONSHIP_COLOR_MAP: Record<string, { bg: string; border: string }> = {
  friend: { bg: "green-500/10", border: "green-500/20" },
  rival: { bg: "orange-500/10", border: "orange-500/20" },
  mentor: { bg: "blue-500/10", border: "blue-500/20" },
  apprentice: { bg: "cyan-500/10", border: "cyan-500/20" },
  enemy: { bg: "red-500/10", border: "red-500/20" },
  love_interest: { bg: "pink-500/10", border: "pink-500/20" },
  ally: { bg: "indigo-500/10", border: "indigo-500/20" },
  acquaintance: { bg: "gray-500/10", border: "gray-500/20" },
  leader: { bg: "purple-500/10", border: "purple-500/20" },
  subordinate: { bg: "slate-500/10", border: "slate-500/20" },
  family_love: { bg: "pink-400/10", border: "pink-400/20" },
  romantic_relationship: { bg: "fuchsia-500/10", border: "fuchsia-500/20" },
  best_friend: { bg: "teal-500/10", border: "teal-500/20" },
  hatred: { bg: "red-700/10", border: "red-700/20" },
  neutral: { bg: "gray-400/10", border: "gray-400/20" },
  devotion: { bg: "violet-500/10", border: "violet-500/20" },
};

const RELATIONSHIP_TYPES: RelationshipTypeConfig[] = [
  { value: "friend", translationKey: "friend", icon: Users },
  { value: "rival", translationKey: "rival", icon: Swords },
  { value: "mentor", translationKey: "mentor", icon: GraduationCap },
  { value: "apprentice", translationKey: "apprentice", icon: BookOpen },
  { value: "enemy", translationKey: "enemy", icon: Skull },
  { value: "love_interest", translationKey: "love_interest", icon: Heart },
  { value: "ally", translationKey: "ally", icon: Shield },
  { value: "acquaintance", translationKey: "acquaintance", icon: Sparkles },
  { value: "leader", translationKey: "leader", icon: Crown },
  { value: "subordinate", translationKey: "subordinate", icon: UserMinus },
  { value: "family_love", translationKey: "family_love", icon: Home },
  {
    value: "romantic_relationship",
    translationKey: "romantic_relationship",
    icon: HeartHandshake,
  },
  { value: "best_friend", translationKey: "best_friend", icon: UserCheck },
  { value: "hatred", translationKey: "hatred", icon: Flame },
  { value: "neutral", translationKey: "neutral", icon: Minus },
  { value: "devotion", translationKey: "devotion", icon: Sparkle },
];

export function RelationshipsSection({
  relationships,
  allCharacters,
  currentCharacterId,
  isEditMode,
  onRelationshipsChange,
  isAddDialogOpen: controlledIsAddDialogOpen,
  onAddDialogOpenChange,
}: RelationshipsSectionProps) {
  const { t } = useTranslation("character-detail");

  // Support both controlled and uncontrolled modes for the add dialog
  const [internalIsAddDialogOpen, setInternalIsAddDialogOpen] = useState(false);

  // Use controlled state if provided, otherwise use internal state
  const isAddDialogOpen = controlledIsAddDialogOpen ?? internalIsAddDialogOpen;
  const setIsAddDialogOpen = (open: boolean) => {
    if (onAddDialogOpenChange) {
      onAddDialogOpenChange(open);
    } else {
      setInternalIsAddDialogOpen(open);
    }
  };
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingRelationship, setEditingRelationship] =
    useState<ICharacterRelationship | null>(null);

  const [selectedCharacterId, setSelectedCharacterId] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("");
  const [intensity, setIntensity] = useState<number[]>([5]);
  const [description, setDescription] = useState<string>("");
  const [modalStep, setModalStep] = useState<1 | 2>(1);
  const [hasScroll, setHasScroll] = useState(false);
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  // Reset form when dialog opens (especially important when controlled externally)
  useEffect(() => {
    if (isAddDialogOpen) {
      setSelectedCharacterId("");
      setSelectedType("");
      setIntensity([5]);
      setDescription("");
      setModalStep(1);
    }
  }, [isAddDialogOpen]);

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
        ? {
            ...rel,
            type: selectedType,
            intensity: intensity[0],
            description: description.trim() || undefined,
          }
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
  }, [availableCharacters, modalStep, isAddDialogOpen]);

  return (
    <div className="space-y-4">
      {/* Add Relationship Button - Only visible when there are available characters */}
      {isEditMode && availableCharacters.length > 0 && (
        <Button
          onClick={handleOpenAddDialog}
          className="w-full"
          variant="magical"
        >
          <Plus className="w-4 h-4 mr-2" />
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

            const _TypeIcon = typeConfig.icon;

            return (
              <Card
                key={relationship.id}
                className="p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-4">
                  {/* Character Avatar */}
                  {character.image ? (
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={character.image} className="object-cover" />
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

                  {/* Character Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-sm truncate">
                        {character.name}
                      </h4>
                      {(() => {
                        const badgeConfig =
                          RELATIONSHIP_TYPES_BADGE_CONSTANT.find(
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
        <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col gap-0">
          <DialogHeader className="flex-shrink-0">
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

          {/* STEP 1: Character Selection */}
          {modalStep === 1 && (
            <>
              <div className="flex-shrink-0 pb-2">
                <Label className="text-sm font-semibold text-primary">
                  {t("character-detail:relationships.available_characters")}
                </Label>
              </div>
              <div
                ref={scrollContainerRef}
                className={cn(
                  "flex-1 overflow-y-auto custom-scrollbar pb-3 px-[2px]",
                  hasScroll && "pr-2"
                )}
              >
                <div className="space-y-6">
                  <div className="grid grid-cols-1 gap-3">
                    {availableCharacters.map((character) => (
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
              </div>
            </>
          )}

          {/* STEP 2: Relationship Type & Intensity */}
          {modalStep === 2 && selectedCharacterId && (
            <div
              ref={scrollContainerRef}
              className={cn(
                "flex-1 overflow-y-auto custom-scrollbar pb-3 px-[2px]",
                hasScroll && "pr-2"
              )}
            >
              <div className="space-y-6">
                <div className="space-y-6">
                  {/* Selected Character Card (Read-only) */}
                  <div className="space-y-3">
                    <Label className="text-sm font-semibold text-primary">
                      {t("character-detail:relationships.selected_character")}
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
                    label={t(
                      "character-detail:relationships.relationship_type"
                    )}
                    columns={4}
                    required
                    className="px-1"
                    options={RELATIONSHIP_TYPES.map((type) => ({
                      value: type.value,
                      label: t(
                        `character-detail:relationship_types.${type.translationKey}`
                      ),
                      icon: type.icon,
                      backgroundColor: RELATIONSHIP_COLOR_MAP[type.value].bg,
                      borderColor: RELATIONSHIP_COLOR_MAP[type.value].border,
                    }))}
                  />

                  {/* Intensity Slider */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-primary">
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
                    <Label className="text-sm font-medium text-primary">
                      {t("character-detail:relationships.description_label")}
                      <span className="text-muted-foreground font-normal ml-1">
                        ({t("character-detail:relationships.optional")})
                      </span>
                    </Label>
                    <div className="px-1">
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
                    </div>
                    <div className="flex justify-end text-xs text-muted-foreground">
                      <span>{description.length}/200</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="flex-shrink-0 pt-4 border-t">
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
                  <Plus className="w-4 h-4 mr-2" />
                  {t("character-detail:relationships.add")}
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Relationship Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col gap-0">
          <DialogHeader className="flex-shrink-0">
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

          <div className="flex-1 overflow-y-auto custom-scrollbar pb-3 px-[2px] pr-2">
            <div className="space-y-6">
              {editingRelationship && (
                <>
                  {/* Selected Character Card (Read-only) */}
                  <div className="space-y-3">
                    <Label className="text-sm font-semibold text-primary">
                      {t("character-detail:relationships.selected_character")}
                    </Label>
                    <Card className="p-4 bg-primary/5 border-primary/20">
                      <div className="flex items-center gap-4">
                        {getCharacterById(editingRelationship.characterId)?.image ? (
                          <Avatar className="w-12 h-12">
                            <AvatarImage
                              src={getCharacterById(editingRelationship.characterId)?.image}
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
                            {getCharacterById(editingRelationship.characterId)?.name}
                          </p>
                          {getCharacterById(editingRelationship.characterId)?.role && (
                            <p className="text-sm text-muted-foreground truncate">
                              {getCharacterById(editingRelationship.characterId)?.role}
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
                    required
                    className="px-1"
                    options={RELATIONSHIP_TYPES.map((type) => ({
                      value: type.value,
                      label: t(
                        `character-detail:relationship_types.${type.translationKey}`
                      ),
                      icon: type.icon,
                      backgroundColor: RELATIONSHIP_COLOR_MAP[type.value].bg,
                      borderColor: RELATIONSHIP_COLOR_MAP[type.value].border,
                    }))}
                  />

              {/* Intensity Slider */}
              <div className="space-y-3">
                <Label className="text-sm font-medium text-primary">
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
                    <Label className="text-sm font-medium text-primary">
                      {t("character-detail:relationships.description_label")}
                      <span className="text-muted-foreground font-normal ml-1">
                        ({t("character-detail:relationships.optional")})
                      </span>
                    </Label>
                    <div className="px-1">
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
                    </div>
                    <div className="flex justify-end text-xs text-muted-foreground">
                      <span>{description.length}/200</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          <DialogFooter className="flex-shrink-0 pt-4 border-t">
            <Button variant="secondary" onClick={closeEditDialog}>
              <X className="w-4 h-4 mr-2" />
              {t("character-detail:relationships.cancel")}
            </Button>
            <Button
              variant="magical"
              className="animate-glow"
              onClick={handleEditRelationship}
              disabled={!selectedType}
            >
              <Save className="w-4 h-4 mr-2" />
              {t("character-detail:relationships.save")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

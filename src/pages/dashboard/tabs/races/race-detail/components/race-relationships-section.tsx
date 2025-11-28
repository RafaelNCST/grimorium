import React, { useState } from "react";

import {
  Edit2,
  Trash2,
  X,
  ChevronLeft,
  UserPlus,
  Skull,
  Fish,
  Sparkles,
  Shield,
  Handshake,
  Swords,
  Equal,
  Heart,
  type LucideIcon,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import { FormSelectGrid } from "@/components/forms/FormSelectGrid";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";

import { RACE_RELATIONSHIP_TYPES_BADGE_CONSTANT } from "../constants/race-relationship-types-badge-constant";
import { type IRaceRelationship } from "../types/race-detail-types";

interface IRace {
  id: string;
  name: string;
  image?: string;
  domain?: string;
}

interface RaceRelationshipsSectionProps {
  relationships: IRaceRelationship[];
  allRaces: IRace[];
  currentRaceId: string;
  isEditMode: boolean;
  onRelationshipsChange: (relationships: IRaceRelationship[]) => void;
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

const RACE_RELATIONSHIP_COLOR_MAP: Record<
  string,
  { bg: string; border: string }
> = {
  predation: { bg: "red-500/10", border: "red-500/20" },
  prey: { bg: "orange-500/10", border: "orange-500/20" },
  parasitism: { bg: "purple-500/10", border: "purple-500/20" },
  commensalism: { bg: "blue-500/10", border: "blue-500/20" },
  mutualism: { bg: "green-500/10", border: "green-500/20" },
  competition: { bg: "yellow-500/10", border: "yellow-500/20" },
  neutralism: { bg: "gray-500/10", border: "gray-500/20" },
  adoration: { bg: "pink-500/10", border: "pink-500/20" },
};

const RACE_RELATIONSHIP_TYPES: RelationshipTypeConfig[] = [
  { value: "predation", translationKey: "predation", icon: Skull },
  { value: "prey", translationKey: "prey", icon: Fish },
  { value: "parasitism", translationKey: "parasitism", icon: Sparkles },
  { value: "commensalism", translationKey: "commensalism", icon: Shield },
  { value: "mutualism", translationKey: "mutualism", icon: Handshake },
  { value: "competition", translationKey: "competition", icon: Swords },
  { value: "neutralism", translationKey: "neutralism", icon: Equal },
  { value: "adoration", translationKey: "adoration", icon: Heart },
];

export function RaceRelationshipsSection({
  relationships,
  allRaces,
  currentRaceId,
  isEditMode,
  onRelationshipsChange,
  isAddDialogOpen: controlledIsAddDialogOpen,
  onAddDialogOpenChange,
}: RaceRelationshipsSectionProps) {
  const { t } = useTranslation("race-detail");

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
    useState<IRaceRelationship | null>(null);

  const [selectedRaceId, setSelectedRaceId] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [modalStep, setModalStep] = useState<1 | 2>(1);

  // Get current race
  const currentRace = allRaces.find((race) => race.id === currentRaceId);
  const currentRaceName = currentRace?.name || "";

  // Filter out current race and already related races
  const availableRaces = allRaces.filter(
    (race) =>
      race.id !== currentRaceId &&
      !relationships.some((rel) => rel.raceId === race.id)
  );

  const getRelationshipTypeConfig = (
    type: string
  ): RelationshipTypeConfig | undefined =>
    RACE_RELATIONSHIP_TYPES.find((t) => t.value === type);

  const getRaceById = (raceId: string): IRace | undefined =>
    allRaces.find((race) => race.id === raceId);

  const handleAddRelationship = () => {
    if (!selectedRaceId || !selectedType) return;

    const newRelationship: IRaceRelationship = {
      id: Date.now().toString(),
      raceId: selectedRaceId,
      type: selectedType as IRaceRelationship["type"],
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
            type: selectedType as IRaceRelationship["type"],
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

  const openEditDialog = (relationship: IRaceRelationship) => {
    setEditingRelationship(relationship);
    setSelectedType(relationship.type);
    setDescription(relationship.description || "");
    setIsEditDialogOpen(true);
  };

  const closeAddDialog = () => {
    setIsAddDialogOpen(false);
    setSelectedRaceId("");
    setSelectedType("");
    setDescription("");
    setModalStep(1);
  };

  const handleOpenAddDialog = () => {
    if (availableRaces.length === 0) {
      return;
    }
    setIsAddDialogOpen(true);
  };

  const handleRaceSelect = (raceId: string) => {
    setSelectedRaceId(raceId);
    setModalStep(2);
  };

  const handleBackToStep1 = () => {
    setSelectedType("");
    setDescription("");
    setModalStep(1);
  };

  const closeEditDialog = () => {
    setIsEditDialogOpen(false);
    setEditingRelationship(null);
    setSelectedType("");
    setDescription("");
  };

  return (
    <div className="space-y-4">
      {/* Relationships List */}
      {relationships.length > 0 ? (
        <div className="space-y-3">
          {relationships.map((relationship) => {
            const race = getRaceById(relationship.raceId);
            const typeConfig = getRelationshipTypeConfig(relationship.type);

            if (!race || !typeConfig) return null;

            const TypeIcon = typeConfig.icon;

            return (
              <Card
                key={relationship.id}
                className="p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-4">
                  {/* Race Avatar */}
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={race.image} className="object-cover" />
                    <AvatarFallback>
                      {race.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>

                  {/* Race Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-sm truncate">
                        {race.name}
                      </h4>
                      {(() => {
                        const badgeConfig =
                          RACE_RELATIONSHIP_TYPES_BADGE_CONSTANT.find(
                            (r) => r.value === relationship.type
                          );
                        return badgeConfig ? (
                          <EntityTagBadge
                            config={badgeConfig}
                            label={t(
                              `race-detail:relationship_types.${badgeConfig.translationKey}`
                            )}
                          />
                        ) : null;
                      })()}
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
      ) : null}

      {/* Add Relationship Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>
              {modalStep === 1
                ? t("race-detail:relationships.add_relationship")
                : t("race-detail:relationships.select_relationship_type")}
            </DialogTitle>
            <DialogDescription>
              {modalStep === 1
                ? t("race-detail:relationships.select_race")
                : t("race-detail:relationships.configure_relationship_step2")}
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="max-h-[60vh] pr-4">
            <div className="space-y-6 pr-2 pl-2">
              {/* STEP 1: Race Selection */}
              {modalStep === 1 && (
                <div className="space-y-3">
                  <Label className="text-sm font-semibold">
                    {t("race-detail:relationships.available_races")}
                  </Label>
                  <div className="grid grid-cols-1 gap-3 p-1">
                    {availableRaces.map((race) => (
                      <Card
                        key={race.id}
                        className="p-4 cursor-pointer transition-all border-muted hover:bg-muted/50"
                        onClick={() => handleRaceSelect(race.id)}
                      >
                        <div className="flex items-center gap-4">
                          <Avatar className="w-12 h-12">
                            <AvatarImage
                              src={race.image}
                              className="object-cover"
                            />
                            <AvatarFallback>
                              {race.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-base truncate">
                              {race.name}
                            </p>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 2: Relationship Type & Intensity */}
              {modalStep === 2 && selectedRaceId && (
                <div className="space-y-6">
                  {/* Selected Race Card (Read-only) */}
                  <div className="space-y-3">
                    <Label className="text-sm font-semibold">
                      {t("race-detail:relationships.selected_race")}
                    </Label>
                    <Card className="p-4 bg-primary/5 border-primary/20">
                      <div className="flex items-center gap-4">
                        <Avatar className="w-12 h-12">
                          <AvatarImage
                            src={getRaceById(selectedRaceId)?.image}
                            className="object-cover"
                          />
                          <AvatarFallback>
                            {getRaceById(selectedRaceId)
                              ?.name.split(" ")
                              .map((n) => n[0])
                              .join("")
                              .slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-base truncate">
                            {getRaceById(selectedRaceId)?.name}
                          </p>
                        </div>
                      </div>
                    </Card>
                    <p className="text-sm text-muted-foreground text-center pt-1">
                      {t("race-detail:relationships.is_to_the")}{" "}
                      <span className="font-semibold text-primary">
                        {currentRaceName}
                      </span>
                      :
                    </p>
                  </div>

                  {/* Relationship Type Selection */}
                  <div className="pb-2">
                    <FormSelectGrid
                      value={selectedType}
                      onChange={setSelectedType}
                      label={t("race-detail:relationships.relationship_type")}
                      columns={2}
                      required
                      options={RACE_RELATIONSHIP_TYPES.map((type) => ({
                        value: type.value,
                        label: t(
                          `race-detail:relationship_types.${type.translationKey}`
                        ),
                        description: t(
                          `race-detail:relationship_types.${type.translationKey}_desc`
                        ),
                        icon: type.icon,
                        backgroundColor:
                          RACE_RELATIONSHIP_COLOR_MAP[type.value].bg,
                        borderColor:
                          RACE_RELATIONSHIP_COLOR_MAP[type.value].border,
                      }))}
                    />
                  </div>

                  {/* Description Field */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-primary">
                      {t("race-detail:relationships.description_label")}
                      <span className="text-muted-foreground font-normal ml-1">
                        ({t("race-detail:relationships.optional")})
                      </span>
                    </Label>
                    <Textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder={t(
                        "race-detail:relationships.description_placeholder"
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
              )}
            </div>
          </ScrollArea>

          <DialogFooter>
            {modalStep === 1 ? (
              <Button variant="secondary" onClick={closeAddDialog}>
                <X className="w-4 h-4 mr-2" />
                {t("race-detail:relationships.cancel")}
              </Button>
            ) : (
              <>
                <Button variant="secondary" onClick={handleBackToStep1}>
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  {t("race-detail:relationships.back")}
                </Button>
                <Button
                  variant="magical"
                  onClick={handleAddRelationship}
                  disabled={!selectedType}
                  className="animate-glow"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  {t("race-detail:relationships.add")}
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
              {t("race-detail:relationships.edit_title")}
            </DialogTitle>
            <DialogDescription>
              {editingRelationship &&
                `${t("race-detail:relationships.editing_with")} ${
                  getRaceById(editingRelationship.raceId)?.name
                }`}
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="max-h-[60vh] pr-4">
            <div className="space-y-6 pr-2">
              {/* Relationship Type Selection */}
              <div className="pb-2">
                <FormSelectGrid
                  value={selectedType}
                  onChange={setSelectedType}
                  label={t("race-detail:relationships.relationship_type")}
                  columns={2}
                  required
                  options={RACE_RELATIONSHIP_TYPES.map((type) => ({
                    value: type.value,
                    label: t(
                      `race-detail:relationship_types.${type.translationKey}`
                    ),
                    description: t(
                      `race-detail:relationship_types.${type.translationKey}_desc`
                    ),
                    icon: type.icon,
                    backgroundColor: RACE_RELATIONSHIP_COLOR_MAP[type.value].bg,
                    borderColor: RACE_RELATIONSHIP_COLOR_MAP[type.value].border,
                  }))}
                />
              </div>

              {/* Description Field */}
              <div className="space-y-3">
                <Label className="text-sm font-medium text-primary">
                  {t("race-detail:relationships.description_label")}
                  <span className="text-muted-foreground font-normal ml-1">
                    ({t("race-detail:relationships.optional")})
                  </span>
                </Label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={t(
                    "race-detail:relationships.description_placeholder"
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
              {t("race-detail:relationships.cancel")}
            </Button>
            <Button
              variant="default"
              onClick={handleEditRelationship}
              disabled={!selectedType}
            >
              <Edit2 className="w-4 h-4 mr-2" />
              {t("race-detail:relationships.save")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

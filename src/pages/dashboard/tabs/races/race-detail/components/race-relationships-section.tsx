import React, { useState } from "react";

import { Edit2, Trash2, X, ChevronLeft, UserPlus } from "lucide-react";
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
import { toast } from "@/hooks/use-toast";

import { RACE_RELATIONSHIP_TYPES } from "../constants/race-relationship-types";
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
  currentRaceName?: string;
  isEditMode: boolean;
  onRelationshipsChange: (relationships: IRaceRelationship[]) => void;
}

export function RaceRelationshipsSection({
  relationships,
  allRaces,
  currentRaceId,
  currentRaceName,
  isEditMode,
  onRelationshipsChange,
}: RaceRelationshipsSectionProps) {
  const { t } = useTranslation("race-detail");

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingRelationship, setEditingRelationship] =
    useState<IRaceRelationship | null>(null);

  const [selectedRaceId, setSelectedRaceId] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("");
  const [modalStep, setModalStep] = useState<1 | 2>(1);
  const [hoveredType, setHoveredType] = useState<string | null>(null);

  // Filter out current race and already related races
  const availableRaces = allRaces.filter(
    (race) =>
      race.id !== currentRaceId &&
      !relationships.some((rel) => rel.raceId === race.id)
  );

  const getRelationshipTypeConfig = (type: string) =>
    RACE_RELATIONSHIP_TYPES.find((t) => t.value === type);

  const getRaceById = (raceId: string): IRace | undefined =>
    allRaces.find((race) => race.id === raceId);

  const handleAddRelationship = () => {
    if (!selectedRaceId || !selectedType) return;

    const newRelationship: IRaceRelationship = {
      id: Date.now().toString(),
      raceId: selectedRaceId,
      type: selectedType,
    };

    onRelationshipsChange([...relationships, newRelationship]);

    // Reset form and close dialog
    closeAddDialog();
  };

  const handleEditRelationship = () => {
    if (!editingRelationship || !selectedType) return;

    const updatedRelationships = relationships.map((rel) =>
      rel.id === editingRelationship.id ? { ...rel, type: selectedType } : rel
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
    setIsEditDialogOpen(true);
  };

  const closeAddDialog = () => {
    setIsAddDialogOpen(false);
    setSelectedRaceId("");
    setSelectedType("");
    setModalStep(1);
  };

  const handleOpenAddDialog = () => {
    if (availableRaces.length === 0) {
      toast({
        title: t("race-detail:empty_states.no_races_available"),
        description: t("race-detail:empty_states.no_races_available_hint"),
      });
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
    setModalStep(1);
  };

  const closeEditDialog = () => {
    setIsEditDialogOpen(false);
    setEditingRelationship(null);
    setSelectedType("");
  };

  // Empty state when no races available
  if (allRaces.length <= 1 && isEditMode) {
    return (
      <div className="text-center text-muted-foreground text-sm py-8">
        <UserPlus className="w-12 h-12 mx-auto mb-3 opacity-50" />
        <p className="font-medium">
          {t("race-detail:empty_states.need_more_races_relationships")}
        </p>
        <p className="text-xs mt-1">
          {t("race-detail:empty_states.need_more_races_relationships_hint")}
        </p>
      </div>
    );
  }

  // Empty state when no relationships in view mode
  if (relationships.length === 0 && !isEditMode) {
    return (
      <div className="text-center text-muted-foreground text-sm py-8">
        <UserPlus className="w-12 h-12 mx-auto mb-3 opacity-50" />
        <p className="font-medium">
          {t("race-detail:empty_states.no_relationships")}
        </p>
        <p className="text-xs mt-1">
          {t("race-detail:empty_states.no_relationships_hint")}
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
          variant="outline"
        >
          <UserPlus className="w-4 h-4 mr-2" />
          {t("race-detail:relationships.add_relationship")}
        </Button>
      )}

      {/* Relationships List */}
      {relationships.length > 0 && (
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
                    {race?.image && (
                      <AvatarImage src={race.image} className="object-cover" />
                    )}
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
                      <Badge
                        variant="outline"
                        className={`${typeConfig.color} flex items-center gap-1`}
                      >
                        <TypeIcon className="w-3 h-3" />
                        <span className="text-xs">
                          {t(
                            `race-detail:relationship_types.${typeConfig.translationKey}`
                          )}
                        </span>
                      </Badge>
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
              {modalStep === 1
                ? t("race-detail:relationships.add_relationship")
                : t("race-detail:relationships.select_relationship_type")}
            </DialogTitle>
            <DialogDescription>
              {modalStep === 1
                ? t("race-detail:relationships.select_race")
                : t("race-detail:relationships.configure_relationship")}
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="max-h-[60vh] pr-4">
            <div className="space-y-6">
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
                        className="p-4 cursor-pointer transition-all hover:shadow-md hover:bg-muted/30 hover:border-primary/50"
                        onClick={() => handleRaceSelect(race.id)}
                      >
                        <div className="flex items-center gap-4">
                          <Avatar className="w-12 h-12">
                            {race?.image && (
                              <AvatarImage
                                src={race.image}
                                className="object-cover"
                              />
                            )}
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

              {/* STEP 2: Relationship Type */}
              {modalStep === 2 && selectedRaceId && (
                <div className="space-y-6">
                  {/* Introductory Text */}
                  <div className="h-[72px] transition-all duration-200 ease-in-out">
                    {currentRaceName && selectedType && (
                      <div className="h-full p-4 bg-muted/30 border border-muted rounded-md flex items-center justify-center">
                        <p className="text-sm text-foreground text-center line-clamp-2">
                          A raça atual{" "}
                          <span className="font-semibold text-primary">
                            {currentRaceName}
                          </span>{" "}
                          tem um relacionamento com a raça{" "}
                          <span className="font-semibold text-primary">
                            {getRaceById(selectedRaceId)?.name}
                          </span>{" "}
                          de tipo:{" "}
                          <span className="font-semibold text-primary">
                            {t(
                              `race-detail:relationship_types.${RACE_RELATIONSHIP_TYPES.find((rt) => rt.value === selectedType)?.translationKey}`
                            )}
                          </span>
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Selected Race Card (Read-only) */}
                  <div className="space-y-3">
                    <Label className="text-sm font-semibold">
                      {t("race-detail:relationships.selected_race")}
                    </Label>
                    <Card className="p-4 bg-primary/5 border-primary/20">
                      <div className="flex items-center gap-4">
                        <Avatar className="w-12 h-12">
                          {getRaceById(selectedRaceId)?.image && (
                            <AvatarImage
                              src={getRaceById(selectedRaceId)!.image!}
                              className="object-cover"
                            />
                          )}
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
                  </div>

                  {/* Relationship Type Selection */}
                  <div className="space-y-3">
                    <Label className="text-sm font-semibold">
                      {t("race-detail:relationships.relationship_type")}
                    </Label>

                    <div className="grid grid-cols-3 gap-2 p-1">
                      {RACE_RELATIONSHIP_TYPES.map((type) => {
                        const Icon = type.icon;
                        const isSelected = selectedType === type.value;
                        const isHovered = hoveredType === type.value;

                        return (
                          <button
                            key={type.value}
                            type="button"
                            onClick={() => setSelectedType(type.value)}
                            onMouseEnter={() => setHoveredType(type.value)}
                            onMouseLeave={() => setHoveredType(null)}
                            className={`p-3 rounded-lg border-2 transition-all text-left ${
                              isSelected || isHovered
                                ? type.color
                                : "border-muted bg-muted/30"
                            }`}
                          >
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <Icon className="w-4 h-4" />
                                <span className="text-sm font-medium">
                                  {t(
                                    `race-detail:relationship_types.${type.translationKey}`
                                  )}
                                </span>
                              </div>
                              <p className="text-xs text-muted-foreground italic line-clamp-2">
                                {t(
                                  `race-detail:relationship_types.${type.translationKey}_desc`
                                )}
                              </p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <DialogFooter>
            {modalStep === 1 ? (
              <Button variant="outline" onClick={closeAddDialog}>
                <X className="w-4 h-4 mr-2" />
                {t("race-detail:relationships.cancel")}
              </Button>
            ) : (
              <>
                <Button variant="outline" onClick={handleBackToStep1}>
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  {t("race-detail:relationships.back")}
                </Button>
                <Button
                  variant="magical"
                  onClick={handleAddRelationship}
                  disabled={!selectedType}
                  className="animate-glow"
                  size="lg"
                >
                  <UserPlus className="w-5 h-5 mr-2" />
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
            <div className="space-y-6">
              {/* Introductory Text for Edit */}
              <div className="h-[72px] transition-all duration-200 ease-in-out">
                {currentRaceName && editingRelationship && selectedType && (
                  <div className="h-full p-4 bg-muted/30 border border-muted rounded-md flex items-center justify-center">
                    <p className="text-sm text-foreground text-center line-clamp-2">
                      A raça atual{" "}
                      <span className="font-semibold text-primary">
                        {currentRaceName}
                      </span>{" "}
                      tem um relacionamento com a raça{" "}
                      <span className="font-semibold text-primary">
                        {getRaceById(editingRelationship.raceId)?.name}
                      </span>{" "}
                      de tipo:{" "}
                      <span className="font-semibold text-primary">
                        {t(
                          `race-detail:relationship_types.${RACE_RELATIONSHIP_TYPES.find((rt) => rt.value === selectedType)?.translationKey}`
                        )}
                      </span>
                    </p>
                  </div>
                )}
              </div>

              {/* Relationship Type Selection */}
              <div className="space-y-3">
                <Label className="text-sm font-semibold">
                  {t("race-detail:relationships.relationship_type")}
                </Label>

                <div className="grid grid-cols-3 gap-2 p-1">
                  {RACE_RELATIONSHIP_TYPES.map((type) => {
                    const Icon = type.icon;
                    const isSelected = selectedType === type.value;
                    const isHovered = hoveredType === type.value;

                    return (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => setSelectedType(type.value)}
                        onMouseEnter={() => setHoveredType(type.value)}
                        onMouseLeave={() => setHoveredType(null)}
                        className={`p-3 rounded-lg border-2 transition-all text-left ${
                          isSelected || isHovered
                            ? type.color
                            : "border-muted bg-muted/30"
                        }`}
                      >
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Icon className="w-4 h-4" />
                            <span className="text-sm font-medium">
                              {t(
                                `race-detail:relationship_types.${type.translationKey}`
                              )}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground italic line-clamp-2">
                            {t(
                              `race-detail:relationship_types.${type.translationKey}_desc`
                            )}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </ScrollArea>

          <DialogFooter>
            <Button variant="outline" onClick={closeEditDialog}>
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

import React, { useState } from "react";

import { Plus, Info } from "lucide-react";
import { useTranslation } from "react-i18next";

import { DIPLOMATIC_STATUS_CONSTANT } from "@/components/modals/create-faction-modal/constants/diplomatic-status";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  type IDiplomaticRelation,
  type DiplomaticStatus,
} from "@/types/faction-types";

import { DiplomacyEditModal } from "./diplomacy-edit-modal";

interface DiplomacySectionProps {
  currentFactionId: string;
  diplomaticRelations: IDiplomaticRelation[];
  availableFactions: Array<{ id: string; name: string; image?: string }>;
  isEditing: boolean;
  onRelationsChange: (relations: IDiplomaticRelation[]) => void;
}

export function DiplomacySection({
  currentFactionId,
  diplomaticRelations = [],
  availableFactions,
  isEditing,
  onRelationsChange,
}: DiplomacySectionProps) {
  const { t } = useTranslation("faction-detail");
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingRelation, setEditingRelation] =
    useState<IDiplomaticRelation | null>(null);

  // Filter out current faction from available factions
  const otherFactions = availableFactions.filter(
    (f) => f.id !== currentFactionId
  );

  // Group factions by diplomatic status
  const getFactionsWithStatus = (status: DiplomaticStatus) => {
    if (status === "neutral") {
      // Neutral includes factions without explicit relationship
      const relatedFactionIds = diplomaticRelations.map(
        (r) => r.targetFactionId
      );
      return otherFactions.filter((f) => !relatedFactionIds.includes(f.id));
    }

    const relationIds = diplomaticRelations
      .filter((r) => r.status === status)
      .map((r) => r.targetFactionId);

    return otherFactions.filter((f) => relationIds.includes(f.id));
  };

  const handleAddRelation = () => {
    setEditingRelation(null);
    setShowEditModal(true);
  };

  const handleEditRelation = (relation: IDiplomaticRelation) => {
    setEditingRelation(relation);
    setShowEditModal(true);
  };

  const handleSaveRelation = (relation: IDiplomaticRelation) => {
    if (editingRelation) {
      // Update existing relation
      const updated = diplomaticRelations.map((r) =>
        r.id === editingRelation.id ? relation : r
      );
      onRelationsChange(updated);
    } else {
      // Add new relation
      onRelationsChange([...diplomaticRelations, relation]);
    }
    setShowEditModal(false);
    setEditingRelation(null);
  };

  const handleDeleteRelation = (relationId: string) =>
    onRelationsChange(diplomaticRelations.filter((r) => r.id !== relationId));

  // Get relation for a faction
  const getRelationForFaction = (factionId: string) => {
    return diplomaticRelations.find((r) => r.targetFactionId === factionId);
  };

  // Render faction card
  const renderFactionCard = (
    faction: { id: string; name: string; image?: string },
    status: DiplomaticStatus
  ) => {
    const relation = getRelationForFaction(faction.id);
    const statusConfig = DIPLOMATIC_STATUS_CONSTANT.find(
      (s) => s.value === status
    );
    const StatusIcon = statusConfig?.icon;

    return (
      <Card
        key={faction.id}
        className="hover:border-primary/50 transition-colors"
      >
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Avatar className="w-12 h-12 rounded-lg">
              <AvatarImage src={faction.image} className="object-cover" />
              <AvatarFallback className="text-sm rounded-lg">
                {faction.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold truncate">{faction.name}</h4>
              {statusConfig && StatusIcon && (
                <Badge
                  className={`mt-2 flex items-center gap-1.5 w-fit ${statusConfig.bgColorClass} ${statusConfig.colorClass} border px-2 py-0.5`}
                >
                  <StatusIcon className="w-3 h-3" />
                  <span className="text-xs">
                    {t(`diplomatic_status.${status}`)}
                  </span>
                </Badge>
              )}
            </div>
            {isEditing && relation && status !== "neutral" && (
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEditRelation(relation)}
                >
                  {t("diplomacy.edit_relation")}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteRelation(relation.id)}
                  className="text-destructive hover:text-destructive"
                >
                  {t("diplomacy.delete")}
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  if (otherFactions.length === 0) {
    return (
      <Card className="card-magical">
        <CardHeader>
          <CardTitle>{t("sections.diplomacy")}</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <p className="font-semibold">{t("diplomacy.no_factions")}</p>
              <p className="text-sm mt-1">
                {t("diplomacy.no_factions_message")}
              </p>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="card-magical">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{t("sections.diplomacy")}</CardTitle>
            {isEditing && (
              <Button
                variant="magical"
                size="lg"
                className="animate-glow"
                onClick={handleAddRelation}
              >
                <Plus className="w-4 h-4 mr-2" />
                {t("diplomacy.add_relation")}
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="neutral" className="w-full">
            <TabsList className="grid w-full grid-cols-6">
              {DIPLOMATIC_STATUS_CONSTANT.map((status) => {
                const Icon = status.icon;
                const count = getFactionsWithStatus(
                  status.value as DiplomaticStatus
                ).length;
                return (
                  <TabsTrigger
                    key={status.value}
                    value={status.value}
                    className="flex items-center gap-1 sm:gap-2"
                  >
                    <Icon className={`w-4 h-4 flex-shrink-0 ${status.colorClass}`} />
                    <span className="hidden md:inline truncate">
                      {t(`diplomatic_status.${status.value}`)}
                    </span>
                    <Badge variant="secondary" className="ml-auto">
                      {count}
                    </Badge>
                  </TabsTrigger>
                );
              })}
            </TabsList>

            {DIPLOMATIC_STATUS_CONSTANT.map((status) => {
              const factions = getFactionsWithStatus(
                status.value as DiplomaticStatus
              );
              return (
                <TabsContent
                  key={status.value}
                  value={status.value}
                  className="mt-4"
                >
                  {factions.length === 0 ? (
                    <Alert>
                      <Info className="h-4 w-4" />
                      <AlertDescription>
                        {t("diplomacy.empty_state.description")}
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {factions.map((faction) =>
                        renderFactionCard(
                          faction,
                          status.value as DiplomaticStatus
                        )
                      )}
                    </div>
                  )}
                </TabsContent>
              );
            })}
          </Tabs>
        </CardContent>
      </Card>

      {showEditModal && (
        <DiplomacyEditModal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setEditingRelation(null);
          }}
          currentFactionId={currentFactionId}
          availableFactions={otherFactions}
          existingRelations={diplomaticRelations}
          editingRelation={editingRelation}
          onSave={handleSaveRelation}
          onDelete={editingRelation ? handleDeleteRelation : undefined}
        />
      )}
    </>
  );
}

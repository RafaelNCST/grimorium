import React, { useState } from "react";

import { Plus, Shield, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";

import { DIPLOMATIC_STATUS_CONSTANT } from "@/components/modals/create-faction-modal/constants/diplomatic-status";
import { FormImageDisplay } from "@/components/forms/FormImageDisplay";
import { Button } from "@/components/ui/button";
import { InfoAlert } from "@/components/ui/info-alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  type IDiplomaticRelation,
  type DiplomaticStatus,
} from "@/types/faction-types";

import { DiplomacyAddModal } from "./diplomacy-add-modal";

interface DiplomacySectionProps {
  currentFactionId: string;
  diplomaticRelations: IDiplomaticRelation[];
  availableFactions: Array<{ id: string; name: string; image?: string }>;
  isEditing: boolean;
  onRelationsChange: (relations: IDiplomaticRelation[]) => void;
  activeTab: DiplomaticStatus;
  onActiveTabChange: (tab: DiplomaticStatus) => void;
  /** Controlled state for add dialog - when true, opens the add diplomacy dialog */
  isAddDialogOpen?: boolean;
  /** Callback when the add dialog open state changes */
  onAddDialogOpenChange?: (open: boolean) => void;
}

export function DiplomacySection({
  currentFactionId,
  diplomaticRelations = [],
  availableFactions,
  isEditing,
  onRelationsChange,
  activeTab,
  onActiveTabChange,
  isAddDialogOpen: controlledIsAddDialogOpen,
  onAddDialogOpenChange,
}: DiplomacySectionProps) {
  const { t } = useTranslation("faction-detail");

  // Support both controlled and uncontrolled modes for the add dialog
  const [internalShowAddModal, setInternalShowAddModal] = useState(false);

  // Use controlled state if provided, otherwise use internal state
  const showAddModal = controlledIsAddDialogOpen ?? internalShowAddModal;
  const setShowAddModal = (open: boolean) => {
    if (onAddDialogOpenChange) {
      onAddDialogOpenChange(open);
    } else {
      setInternalShowAddModal(open);
    }
  };

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
    setShowAddModal(true);
  };

  const handleSaveRelation = (relation: IDiplomaticRelation) => {
    onRelationsChange([...diplomaticRelations, relation]);
    setShowAddModal(false);
  };

  const handleDeleteRelation = (relationId: string) =>
    onRelationsChange(diplomaticRelations.filter((r) => r.id !== relationId));

  // Get relation for a faction
  const getRelationForFaction = (factionId: string) =>
    diplomaticRelations.find((r) => r.targetFactionId === factionId);

  // Render faction item with updated styling
  const renderFactionItem = (
    faction: { id: string; name: string; image?: string },
    status: DiplomaticStatus
  ) => {
    const relation = getRelationForFaction(faction.id);

    return (
      <div
        key={faction.id}
        className="flex items-center gap-3 p-3 border rounded-lg group"
      >
        {faction.image ? (
          <img
            src={faction.image}
            alt={faction.name}
            className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
          />
        ) : (
          <div className="rounded-lg overflow-hidden flex-shrink-0">
            <FormImageDisplay
              icon={Shield}
              height="h-10"
              width="w-10"
              shape="square"
              iconSize="w-5 h-5"
            />
          </div>
        )}
        <span className="text-sm font-medium flex-1 truncate">
          {faction.name}
        </span>
        {isEditing && relation && status !== "neutral" && (
          <Button
            variant="ghost-destructive"
            size="icon"
            className="h-7 w-7"
            onClick={() => handleDeleteRelation(relation.id)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        )}
      </div>
    );
  };

  return (
    <>
      <div className="space-y-4">
        {/* Add Relation Button - Only in Edit Mode and when there are available factions */}
        {isEditing &&
          otherFactions.length > 0 &&
          diplomaticRelations.length < otherFactions.length && (
            <Button
              variant="magical"
              size="lg"
              className="w-full animate-glow"
              onClick={handleAddRelation}
            >
              <Plus className="w-4 h-4 mr-2" />
              {t("diplomacy.add_relation")}
            </Button>
          )}

        {/* Tabs Container */}
        <Tabs value={activeTab} onValueChange={(value) => onActiveTabChange(value as DiplomaticStatus)}>
          <TabsList className="w-full grid grid-cols-6 h-auto p-0 bg-muted rounded-md">
            {DIPLOMATIC_STATUS_CONSTANT.map((status) => {
              const count = getFactionsWithStatus(
                status.value as DiplomaticStatus
              ).length;
              const StatusIcon = status.icon;

              return (
                <TabsTrigger
                  key={status.value}
                  value={status.value}
                  className="flex items-center justify-center gap-2 py-3 bg-muted flex-1 rounded-none first:rounded-l-md last:rounded-r-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow"
                >
                  <StatusIcon className="w-4 h-4 shrink-0" />
                  <span className="text-xs font-medium truncate">
                    {t(`diplomatic_status.${status.value}`)}
                  </span>
                  <span className="text-xs font-semibold">
                    {count}
                  </span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {/* Tab Content */}
          <div className="mt-4 border rounded-lg">
            <ScrollArea className="h-[280px]">
              <div className="p-3">
                {(() => {
                  const factions = getFactionsWithStatus(activeTab);
                  return factions.length === 0 ? (
                    <InfoAlert>
                      {t("diplomacy.empty_state.description")}
                    </InfoAlert>
                  ) : (
                    <div className="flex flex-col gap-2">
                      {factions.map((faction) =>
                        renderFactionItem(faction, activeTab)
                      )}
                    </div>
                  );
                })()}
              </div>
            </ScrollArea>
          </div>
        </Tabs>
      </div>

      {showAddModal && (
        <DiplomacyAddModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          currentFactionId={currentFactionId}
          availableFactions={otherFactions}
          existingRelations={diplomaticRelations}
          onSave={handleSaveRelation}
        />
      )}
    </>
  );
}

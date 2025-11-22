import React, { useState } from "react";

import { Shield, X } from "lucide-react";
import { useTranslation } from "react-i18next";

import { DIPLOMATIC_STATUS_CONSTANT } from "@/components/modals/create-faction-modal/constants/diplomatic-status";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
import {
  type IDiplomaticRelation,
  type DiplomaticStatus,
} from "@/types/faction-types";

interface DiplomacyAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentFactionId: string;
  availableFactions: Array<{ id: string; name: string; image?: string }>;
  existingRelations: IDiplomaticRelation[];
  defaultStatus: DiplomaticStatus;
  onSave: (relation: IDiplomaticRelation) => void;
}

export function DiplomacyAddModal({
  isOpen,
  onClose,
  currentFactionId,
  availableFactions,
  existingRelations,
  defaultStatus,
  onSave,
}: DiplomacyAddModalProps) {
  const { t } = useTranslation("faction-detail");
  const [error, setError] = useState<string>("");

  // Can only add if not in neutral tab
  const canAdd = defaultStatus !== "neutral";

  const handleFactionSelect = (factionId: string) => {
    // Check for self-relation
    if (factionId === currentFactionId) {
      setError(t("diplomacy.cannot_self_relate"));
      return;
    }

    // Check for duplicate
    const duplicate = existingRelations.find(
      (r) => r.targetFactionId === factionId
    );
    if (duplicate) {
      setError(t("diplomacy.duplicate_relation"));
      return;
    }

    // Save directly with the default status
    if (canAdd) {
      const relation: IDiplomaticRelation = {
        id: `relation-${Date.now()}`,
        targetFactionId: factionId,
        status: defaultStatus,
      };
      onSave(relation);
      handleCloseModal();
    }
  };

  const handleCloseModal = () => {
    setError("");
    onClose();
  };

  // Get status label for the dialog description
  const statusConfig = DIPLOMATIC_STATUS_CONSTANT.find(
    (s) => s.value === defaultStatus
  );

  // Filter available factions (exclude those already with a relationship)
  const factionsToShow = availableFactions.filter(
    (f) => !existingRelations.some((r) => r.targetFactionId === f.id)
  );

  return (
    <Dialog open={isOpen} onOpenChange={handleCloseModal}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>{t("diplomacy.add_relation")}</DialogTitle>
          <DialogDescription>
            {canAdd && statusConfig
              ? `${t("diplomacy.select_faction")} - ${t(`diplomatic_status.${statusConfig.value}`)}`
              : t("diplomacy.select_faction")}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-3 pr-2 pl-2">
            <Label className="text-sm font-semibold">
              {t("diplomacy.target_faction")}
            </Label>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-1 gap-3 p-1">
              {factionsToShow.length === 0 ? (
                <Alert>
                  <AlertDescription>
                    {t("diplomacy.no_factions_message")}
                  </AlertDescription>
                </Alert>
              ) : (
                factionsToShow.map((faction) => (
                  <Card
                    key={faction.id}
                    className="p-4 cursor-pointer transition-all border-muted hover:bg-muted/50"
                    onClick={() => handleFactionSelect(faction.id)}
                  >
                    <div className="flex items-center gap-4">
                      {faction.image ? (
                        <img
                          src={faction.image}
                          alt={faction.name}
                          className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-muted-foreground/20 flex items-center justify-center flex-shrink-0">
                          <Shield className="w-6 h-6 text-muted-foreground" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-base truncate">
                          {faction.name}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </div>
        </ScrollArea>

        <DialogFooter>
          <Button variant="secondary" onClick={handleCloseModal}>
            <X className="w-4 h-4 mr-2" />
            {t("diplomacy.cancel")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

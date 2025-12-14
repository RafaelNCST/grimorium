import React, { useState, useEffect } from "react";

import { ChevronLeft, Shield, X, Plus } from "lucide-react";
import { useTranslation } from "react-i18next";

import { DIPLOMATIC_STATUS_CONSTANT } from "@/components/modals/create-faction-modal/constants/diplomatic-status";
import { FormImageDisplay } from "@/components/forms/FormImageDisplay";
import { FormSimpleGrid } from "@/components/forms/FormSimpleGrid";
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
import { cn } from "@/lib/utils";
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
  onSave: (relation: IDiplomaticRelation) => void;
}

export function DiplomacyAddModal({
  isOpen,
  onClose,
  currentFactionId,
  availableFactions,
  existingRelations,
  onSave,
}: DiplomacyAddModalProps) {
  const { t } = useTranslation("faction-detail");
  const [modalStep, setModalStep] = useState<1 | 2>(1);
  const [selectedFactionId, setSelectedFactionId] = useState<string | null>(
    null
  );
  const [selectedStatus, setSelectedStatus] = useState<DiplomaticStatus | null>(
    null
  );
  const [error, setError] = useState<string>("");
  const [hasScroll, setHasScroll] = useState(false);
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      // Reset on open
      setSelectedFactionId(null);
      setSelectedStatus(null);
      setModalStep(1);
      setError("");
    }
  }, [isOpen]);

  const handleClose = () => {
    setSelectedFactionId(null);
    setSelectedStatus(null);
    setModalStep(1);
    setError("");
    onClose();
  };

  const handleFactionSelect = (factionId: string) => {
    setError("");

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

    setSelectedFactionId(factionId);
    setModalStep(2);
  };

  const handleBackToStep1 = () => {
    setSelectedStatus(null);
    setModalStep(1);
  };

  const handleSave = () => {
    if (selectedFactionId && selectedStatus) {
      const relation: IDiplomaticRelation = {
        id: `relation-${Date.now()}`,
        targetFactionId: selectedFactionId,
        status: selectedStatus,
      };
      onSave(relation);
      handleClose();
    }
  };

  // Filter available factions (exclude those already with a relationship)
  const factionsToShow = availableFactions.filter(
    (f) => !existingRelations.some((r) => r.targetFactionId === f.id)
  );

  const getFactionById = (id: string) =>
    availableFactions.find((f) => f.id === id);

  // Diplomatic status options (exclude neutral)
  const statusOptions = DIPLOMATIC_STATUS_CONSTANT.filter(
    (s) => s.value !== "neutral"
  );

  // Detectar se há scroll
  useEffect(() => {
    const checkScroll = () => {
      if (scrollContainerRef.current) {
        const { scrollHeight, clientHeight } = scrollContainerRef.current;
        setHasScroll(scrollHeight > clientHeight);
      }
    };

    const timeoutId = setTimeout(checkScroll, 0);
    const observer = new ResizeObserver(checkScroll);
    if (scrollContainerRef.current) {
      observer.observe(scrollContainerRef.current);
    }

    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, [factionsToShow, statusOptions, modalStep, isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col gap-0">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>
            {modalStep === 1
              ? t("diplomacy.add_relation")
              : t("diplomacy.select_diplomatic_status")}
          </DialogTitle>
          <DialogDescription>
            {modalStep === 1
              ? t("diplomacy.select_faction")
              : t("diplomacy.select_status_description")}
          </DialogDescription>
        </DialogHeader>

        {/* STEP 1: Faction Selection */}
        {modalStep === 1 && (
          <>
            <div className="flex-shrink-0 pb-2 space-y-3">
              <Label className="text-sm font-semibold text-primary">
                {t("diplomacy.available_factions")}
              </Label>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
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
                            <div className="rounded-lg overflow-hidden flex-shrink-0">
                              <FormImageDisplay
                                icon={Shield}
                                height="h-12"
                                width="w-12"
                                shape="square"
                                iconSize="w-6 h-6"
                              />
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
            </div>
          </>
        )}

        {/* STEP 2: Status Selection and Description */}
        {modalStep === 2 && selectedFactionId && (
          <div
            ref={scrollContainerRef}
            className={cn(
              "flex-1 overflow-y-auto custom-scrollbar pb-3 px-[2px]",
              hasScroll && "pr-2"
            )}
          >
            <div className="space-y-6">
              <div className="space-y-6">
                {/* Selected Faction Card (Read-only) */}
                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-primary">
                    {t("diplomacy.selected_faction")}
                  </Label>
                  <Card className="p-4 bg-primary/5 border-primary/20">
                    <div className="flex items-center gap-4">
                      {getFactionById(selectedFactionId)?.image ? (
                        <img
                          src={getFactionById(selectedFactionId)?.image}
                          alt={getFactionById(selectedFactionId)?.name}
                          className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                        />
                      ) : (
                        <div className="rounded-lg overflow-hidden flex-shrink-0">
                          <FormImageDisplay
                            icon={Shield}
                            height="h-12"
                            width="w-12"
                            shape="square"
                            iconSize="w-6 h-6"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-base truncate">
                          {getFactionById(selectedFactionId)?.name}
                        </p>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Status Selection */}
                <div className="space-y-3 pb-4">
                  <FormSimpleGrid
                    label={t("diplomacy.diplomatic_status")}
                    required
                    options={statusOptions.map((status) => ({
                      value: status.value,
                      label: t(`diplomatic_status.${status.value}`),
                      icon: status.icon,
                      backgroundColor: status.bgColorClass.replace("bg-", ""),
                      borderColor: status.borderColorClass.replace("border-", ""),
                    }))}
                    value={selectedStatus || ""}
                    onChange={(value) =>
                      setSelectedStatus(value as DiplomaticStatus)
                    }
                    columns={3}
                    className="px-1"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        <DialogFooter className="flex-shrink-0 pt-4 border-t">
          {modalStep === 1 ? (
            <Button variant="secondary" onClick={handleClose}>
              <X className="w-4 h-4 mr-2" />
              {t("diplomacy.cancel")}
            </Button>
          ) : (
            <>
              <Button variant="secondary" onClick={handleBackToStep1}>
                <ChevronLeft className="w-4 h-4 mr-2" />
                {t("diplomacy.back")}
              </Button>
              <Button
                variant="magical"
                onClick={handleSave}
                disabled={!selectedStatus}
                className="animate-glow"
              >
                <Plus className="w-4 h-4 mr-2" />
                {t("diplomacy.save")}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

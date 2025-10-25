import React, { useState, useEffect } from "react";

import { Shield, ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";

import { DIPLOMATIC_STATUS_CONSTANT } from "@/components/modals/create-faction-modal/constants/diplomatic-status";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  type IDiplomaticRelation,
  type DiplomaticStatus,
} from "@/types/faction-types";

interface DiplomacyEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentFactionId: string;
  availableFactions: Array<{ id: string; name: string; image?: string }>;
  existingRelations: IDiplomaticRelation[];
  editingRelation: IDiplomaticRelation | null;
  onSave: (relation: IDiplomaticRelation) => void;
  onDelete?: (relationId: string) => void;
}

export function DiplomacyEditModal({
  isOpen,
  onClose,
  currentFactionId,
  availableFactions,
  existingRelations,
  editingRelation,
  onSave,
  onDelete,
}: DiplomacyEditModalProps) {
  const { t } = useTranslation("faction-detail");
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedFactionId, setSelectedFactionId] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<DiplomaticStatus | "">(
    ""
  );
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (editingRelation) {
      setSelectedFactionId(editingRelation.targetFactionId);
      setSelectedStatus(editingRelation.status);
      setStep(2); // Se está editando, pula direto para o step 2
    } else {
      setSelectedFactionId("");
      setSelectedStatus("");
      setStep(1);
    }
    setError("");
  }, [editingRelation, isOpen]);

  const handleSave = () => {
    // Validation
    if (!selectedFactionId) {
      setError(t("diplomacy.select_faction"));
      return;
    }

    if (!selectedStatus) {
      setError(t("diplomacy.select_status"));
      return;
    }

    // Check for self-relation
    if (selectedFactionId === currentFactionId) {
      setError(t("diplomacy.cannot_self_relate"));
      return;
    }

    // Check for duplicate (only if not editing)
    if (!editingRelation) {
      const duplicate = existingRelations.find(
        (r) => r.targetFactionId === selectedFactionId
      );
      if (duplicate) {
        setError(t("diplomacy.duplicate_relation"));
        return;
      }
    }

    const relation: IDiplomaticRelation = {
      id: editingRelation?.id || `relation-${Date.now()}`,
      targetFactionId: selectedFactionId,
      status: selectedStatus,
    };

    onSave(relation);
    onClose();
  };

  const handleDelete = () => {
    if (editingRelation && onDelete) {
      onDelete(editingRelation.id);
      onClose();
    }
  };

  const handleFactionSelect = (factionId: string) => {
    setSelectedFactionId(factionId);
    setStep(2);
  };

  const handleBack = () => {
    setStep(1);
    setSelectedStatus("");
    setError("");
  };

  const handleCloseModal = () => {
    setStep(1);
    setSelectedFactionId("");
    setSelectedStatus("");
    setError("");
    onClose();
  };

  const selectedFaction = availableFactions.find(
    (f) => f.id === selectedFactionId
  );

  const selectedStatusData = DIPLOMATIC_STATUS_CONSTANT.find(
    (s) => s.value === selectedStatus
  );

  // Helper to get card classes for diplomatic status
  const getStatusCardClasses = (
    statusValue: string,
    isSelected: boolean
  ): string => {
    const baseClasses = "cursor-pointer transition-all duration-200 border-2";

    // Map each status to its specific active classes
    const statusActiveClassMap: Record<string, string> = {
      alliance: "border-green-500/30 bg-green-500/10",
      subordinate: "border-blue-500/30 bg-blue-500/10",
      war: "border-red-500/30 bg-red-500/10",
      peace: "border-cyan-500/30 bg-cyan-500/10",
      hatred: "border-orange-500/30 bg-orange-500/10",
    };

    const statusHoverClassMap: Record<string, string> = {
      alliance: "hover:border-green-500/30 hover:bg-green-500/10",
      subordinate: "hover:border-blue-500/30 hover:bg-blue-500/10",
      war: "hover:border-red-500/30 hover:bg-red-500/10",
      peace: "hover:border-cyan-500/30 hover:bg-cyan-500/10",
      hatred: "hover:border-orange-500/30 hover:bg-orange-500/10",
    };

    if (isSelected) {
      // When selected: show active state permanently
      return `${baseClasses} ${statusActiveClassMap[statusValue] || ""}`;
    }

    // When not selected: muted border + hover preview
    return `${baseClasses} border-muted ${statusHoverClassMap[statusValue] || ""}`;
  };

  return (
    <>
      {/* Step 1: Escolher Facção */}
      <Dialog open={isOpen && step === 1} onOpenChange={handleCloseModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              {t("diplomacy.add_relation")} - Passo 1
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <Label className="text-sm font-semibold">
              {t("diplomacy.target_faction")}
            </Label>

            <ScrollArea className="h-[400px] rounded-md border">
              <div className="p-2 pr-3 space-y-2">
                {availableFactions.length === 0 ? (
                  <Alert>
                    <AlertDescription>
                      {t("diplomacy.no_factions_message")}
                    </AlertDescription>
                  </Alert>
                ) : (
                  availableFactions.map((faction) => (
                    <Card
                      key={faction.id}
                      className="cursor-pointer transition-all duration-200 border hover:border-primary hover:bg-primary/10"
                      onClick={() => handleFactionSelect(faction.id)}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-12 h-12 rounded-lg">
                            <AvatarImage
                              src={faction.image}
                              className="object-cover"
                            />
                            <AvatarFallback className="rounded-lg">
                              <Shield className="w-6 h-6" />
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <p className="font-semibold text-base">
                              {faction.name}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </ScrollArea>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCloseModal}>
              {t("diplomacy.cancel")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Step 2: Escolher Status Diplomático */}
      <Dialog open={isOpen && step === 2} onOpenChange={handleCloseModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              {editingRelation
                ? t("diplomacy.edit_relation")
                : `${t("diplomacy.add_relation")} - Passo 2`}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Facção Selecionada */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold">
                Facção Selecionada
              </Label>
              <Card className="border-2 border-primary/20 bg-primary/5">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12 rounded-lg border-2 border-primary/30">
                      <AvatarImage
                        src={selectedFaction?.image}
                        className="object-cover"
                      />
                      <AvatarFallback className="rounded-lg bg-primary/10">
                        <Shield className="w-6 h-6 text-primary" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-base">
                        {selectedFaction?.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Clique em "Voltar" para escolher outra facção
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Separator />

            {/* Status Diplomático */}
            <div className="space-y-3">
              <Label className="text-sm font-semibold">
                {t("diplomacy.diplomatic_status")}
              </Label>
              <ScrollArea className="h-[350px] rounded-md border">
                <div className="p-2 pr-3 space-y-2">
                  {DIPLOMATIC_STATUS_CONSTANT.filter(
                    (s) => s.value !== "neutral"
                  ).map((status) => {
                    const Icon = status.icon;
                    const isSelected = selectedStatus === status.value;
                    return (
                      <Card
                        key={status.value}
                        className={getStatusCardClasses(
                          status.value,
                          isSelected
                        )}
                        onClick={() =>
                          setSelectedStatus(status.value as DiplomaticStatus)
                        }
                      >
                        <CardContent className="p-3">
                          <div className="flex items-start gap-3">
                            <div
                              className={`p-2 rounded-lg ${status.bgColorClass} ${status.borderColorClass} border`}
                            >
                              <Icon
                                className={`w-5 h-5 ${status.colorClass}`}
                              />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <p className="font-semibold">
                                  {t(`diplomatic_status.${status.value}`)}
                                </p>
                                {isSelected && (
                                  <Badge
                                    className={`${status.bgColorClass} ${status.colorClass} border ${status.borderColorClass}`}
                                  >
                                    Selecionado
                                  </Badge>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">
                                {t(`diplomatic_status.${status.value}_desc`)}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </ScrollArea>
            </div>

            {/* Error message */}
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </div>

          <DialogFooter className="flex-row justify-between sm:justify-between">
            <div className="flex gap-2">
              {!editingRelation && (
                <Button variant="outline" onClick={handleBack}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar
                </Button>
              )}
              {editingRelation && onDelete && (
                <Button
                  variant="destructive"
                  size="lg"
                  className="animate-glow-red"
                  onClick={handleDelete}
                >
                  {t("diplomacy.delete")}
                </Button>
              )}
            </div>
            <div className="flex gap-2 ml-auto">
              <Button variant="outline" onClick={handleCloseModal}>
                {t("diplomacy.cancel")}
              </Button>
              <Button
                variant="magical"
                size="lg"
                className="animate-glow"
                onClick={handleSave}
                disabled={!selectedFactionId || !selectedStatus}
              >
                {t("diplomacy.save")}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

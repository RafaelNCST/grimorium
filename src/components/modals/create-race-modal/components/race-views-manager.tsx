import { useState } from "react";

import { Edit, Plus, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";

import { FormEntityMultiSelectAuto } from "@/components/forms/FormEntityMultiSelectAuto";
import { FormTextarea } from "@/components/forms/FormTextarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { InfoAlert } from "@/components/ui/info-alert";

export interface RaceView {
  id: string;
  raceId: string;
  raceName: string;
  raceImage?: string;
  description: string;
}

interface PropsRaceViewsManager {
  views: RaceView[];
  onChange: (views: RaceView[]) => void;
  availableRaces: Array<{ id: string; name: string; image?: string }>;
  hideLabel?: boolean;
  bookId: string;
  currentRaceId?: string;
}

export function RaceViewsManager({
  views,
  onChange,
  availableRaces,
  hideLabel = false,
  bookId,
  currentRaceId,
}: PropsRaceViewsManager) {
  const { t } = useTranslation("create-race");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingView, setEditingView] = useState<RaceView | null>(null);
  const [selectedRaceIds, setSelectedRaceIds] = useState<string[]>([]);
  const [description, setDescription] = useState("");
  const [descriptionError, setDescriptionError] = useState("");

  const handleOpenModal = (view?: RaceView) => {
    if (view) {
      setEditingView(view);
      setSelectedRaceIds([view.raceId]);
      setDescription(view.description);
    } else {
      setEditingView(null);
      setSelectedRaceIds([]);
      setDescription("");
    }
    setDescriptionError("");
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingView(null);
    setSelectedRaceIds([]);
    setDescription("");
    setDescriptionError("");
  };

  const handleSave = () => {
    // Validação
    if (selectedRaceIds.length === 0) {
      return;
    }

    if (!description.trim()) {
      setDescriptionError("validation.view_description_required");
      return;
    }

    if (description.length > 500) {
      setDescriptionError("validation.view_description_max_length");
      return;
    }

    const selectedRace = availableRaces.find((r) => r.id === selectedRaceIds[0]);
    if (!selectedRace) return;

    const newView: RaceView = {
      id: editingView?.id || `view-${Date.now()}`,
      raceId: selectedRaceIds[0],
      raceName: selectedRace.name,
      raceImage: selectedRace.image,
      description: description.trim(),
    };

    if (editingView) {
      onChange(views.map((v) => (v.id === editingView.id ? newView : v)));
    } else {
      onChange([...views, newView]);
    }

    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    onChange(views.filter((v) => v.id !== id));
  };

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  const canSave =
    selectedRaceIds.length > 0 &&
    description.trim() &&
    description.length <= 500;

  return (
    <div className="space-y-3">
      {!hideLabel && (
        <label className="text-sm font-medium text-primary">
          {t("modal.race_views")}
        </label>
      )}

      <InfoAlert>{t("modal.race_views_description")}</InfoAlert>

      {views.length > 0 && (
        <div className="space-y-2">
          {views.map((view) => (
            <div
              key={view.id}
              className="p-4 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 flex items-start gap-3">
                  <Avatar className="w-10 h-10 rounded-md flex-shrink-0">
                    <AvatarImage src={view.raceImage} alt={view.raceName} />
                    <AvatarFallback className="text-xs rounded-md">
                      {getInitials(view.raceName)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1 min-w-0">
                    <span className="text-sm font-medium block">{view.raceName}</span>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {view.description}
                    </p>
                  </div>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleOpenModal(view)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost-destructive"
                    size="icon"
                    onClick={() => handleDelete(view.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {availableRaces.length === 0 && (
        <InfoAlert>{t("modal.no_races_for_views")}</InfoAlert>
      )}

      <Button
        type="button"
        variant="secondary"
        size="sm"
        onClick={() => handleOpenModal()}
        disabled={availableRaces.length === 0}
        className="w-full"
      >
        <Plus className="w-4 h-4 mr-2" />
        {t("modal.add_view")}
      </Button>

      <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingView ? t("modal.edit_view") : t("modal.add_view")}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <FormEntityMultiSelectAuto
              entityType="race"
              bookId={bookId}
              label={t("modal.select_race")}
              placeholder={t("modal.select_race_placeholder")}
              emptyText={t("modal.no_races_for_views")}
              noSelectionText={t("modal.no_race_selected")}
              searchPlaceholder={t("modal.select_race_placeholder")}
              value={selectedRaceIds}
              onChange={setSelectedRaceIds}
              required
              maxSelections={1}
              filter={(race) => race.id !== currentRaceId}
            />

            <FormTextarea
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                setDescriptionError("");
              }}
              label={t("modal.view_description")}
              placeholder={t("modal.view_description_placeholder")}
              maxLength={500}
              rows={6}
              required
              showCharCount
              error={descriptionError ? t(descriptionError) : undefined}
              labelClassName="text-sm font-medium text-primary"
              className="resize-none"
            />

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="secondary"
                onClick={handleCloseModal}
              >
                {t("button.cancel")}
              </Button>
              <Button
                type="button"
                variant="magical"
                className="animate-glow"
                onClick={handleSave}
                disabled={!canSave}
              >
                {t("button.save")}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

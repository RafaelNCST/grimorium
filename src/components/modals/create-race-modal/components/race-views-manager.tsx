import { useState } from "react";

import { Edit, Eye, Info, Plus, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export interface RaceView {
  id: string;
  raceId: string;
  raceName: string;
  description: string;
}

interface PropsRaceViewsManager {
  views: RaceView[];
  onChange: (views: RaceView[]) => void;
  availableRaces: Array<{ id: string; name: string }>;
}

export function RaceViewsManager({
  views,
  onChange,
  availableRaces,
}: PropsRaceViewsManager) {
  const { t } = useTranslation("create-race");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingView, setEditingView] = useState<RaceView | null>(null);
  const [selectedRaceId, setSelectedRaceId] = useState("");
  const [description, setDescription] = useState("");

  const handleOpenModal = (view?: RaceView) => {
    if (view) {
      setEditingView(view);
      setSelectedRaceId(view.raceId);
      setDescription(view.description);
    } else {
      setEditingView(null);
      setSelectedRaceId("");
      setDescription("");
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingView(null);
    setSelectedRaceId("");
    setDescription("");
  };

  const handleSave = () => {
    const selectedRace = availableRaces.find((r) => r.id === selectedRaceId);
    if (!selectedRace || !description.trim()) return;

    const newView: RaceView = {
      id: editingView?.id || `view-${Date.now()}`,
      raceId: selectedRaceId,
      raceName: selectedRace.name,
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

  const canSave = selectedRaceId && description.trim() && description.length <= 500;

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium">{t("modal.race_views")}</label>

      <Alert className="bg-muted/30 border-muted">
        <Info className="h-4 w-4 text-muted-foreground" />
        <AlertDescription className="text-xs text-muted-foreground">
          {t("modal.race_views_description")}
        </AlertDescription>
      </Alert>

      {views.length > 0 && (
        <div className="space-y-2">
          {views.map((view) => (
            <div
              key={view.id}
              className="p-4 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{view.raceName}</span>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {view.description}
                  </p>
                </div>
                <div className="flex gap-1">
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
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(view.id)}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {availableRaces.length === 0 && (
        <Alert className="bg-amber-500/10 border-amber-500/20">
          <Info className="h-4 w-4 text-amber-500" />
          <AlertDescription className="text-xs text-amber-600 dark:text-amber-400">
            {t("modal.no_races_for_views")}
          </AlertDescription>
        </Alert>
      )}

      <Button
        type="button"
        variant="outline"
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
            <div className="space-y-2">
              <Label>{t("modal.select_race")} *</Label>
              <Select value={selectedRaceId} onValueChange={setSelectedRaceId}>
                <SelectTrigger>
                  <SelectValue placeholder={t("modal.select_race_placeholder")} />
                </SelectTrigger>
                <SelectContent>
                  {availableRaces.map((race) => (
                    <SelectItem key={race.id} value={race.id}>
                      {race.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>{t("modal.view_description")} *</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={t("modal.view_description_placeholder")}
                maxLength={500}
                rows={6}
              />
              <div className="flex justify-end text-xs text-muted-foreground">
                <span>{description.length}/500</span>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={handleCloseModal}>
                {t("button.cancel")}
              </Button>
              <Button type="button" onClick={handleSave} disabled={!canSave}>
                {t("button.save")}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

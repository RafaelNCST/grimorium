import { Info, Sparkles } from "lucide-react";
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
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import type {
  IPlotEvent,
  PlotArcSize,
  PlotArcStatus,
} from "@/types/plot-types";

import { AdvancedSection } from "./components/advanced-section";
import { CharacterSelector } from "./components/character-selector";
import { EventChainEditor } from "./components/event-chain-editor";
import { FactionSelector } from "./components/faction-selector";
import { ItemSelector } from "./components/item-selector";
import { SizeSelector } from "./components/size-selector";
import { StatusSelector } from "./components/status-selector";

interface Character {
  id: string;
  name: string;
  image?: string;
}

interface Faction {
  id: string;
  name: string;
  emblem?: string;
}

interface Item {
  id: string;
  name: string;
  image?: string;
}

interface FormData {
  name: string;
  description: string;
  status: PlotArcStatus | "";
  size: PlotArcSize | "";
  focus: string;
  events: IPlotEvent[];
  importantCharacters: string[];
  importantFactions: string[];
  importantItems: string[];
  arcMessage: string;
  worldImpact: string;
}

interface PropsCreatePlotArcModalView {
  open: boolean;
  formData: FormData;
  isValid: boolean;
  hasCurrentArc: boolean;
  characters: Character[];
  factions: Faction[];
  items: Item[];
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onFieldChange: <K extends keyof FormData>(
    field: K,
    value: FormData[K]
  ) => void;
}

export function CreatePlotArcModalView({
  open,
  formData,
  isValid,
  hasCurrentArc,
  characters,
  factions,
  items,
  onClose,
  onSubmit,
  onFieldChange,
}: PropsCreatePlotArcModalView) {
  const { t } = useTranslation("create-plot-arc");

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            {t("modal.create_arc")}
          </DialogTitle>
        </DialogHeader>

        <Alert className="bg-primary/5 border-primary/20">
          <Info className="h-4 w-4 text-primary" />
          <AlertDescription className="text-sm">
            {t("modal.info_message")}
          </AlertDescription>
        </Alert>

        <form onSubmit={onSubmit} className="space-y-6">
          {/* Basic Fields Section */}
          <div className="space-y-6">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              {t("modal.basic_fields")}
            </h3>

            {/* Arc Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                {t("modal.arc_name")} *
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => onFieldChange("name", e.target.value)}
                placeholder={t("modal.arc_name_placeholder")}
                maxLength={200}
              />
              <div className="flex justify-end text-xs text-muted-foreground">
                <span>{formData.name.length}/200</span>
              </div>
            </div>

            {/* Arc Summary */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium">
                {t("modal.arc_summary")} *
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => onFieldChange("description", e.target.value)}
                placeholder={t("modal.arc_summary_placeholder")}
                rows={4}
                maxLength={1000}
                className="resize-none"
              />
              <div className="flex justify-end text-xs text-muted-foreground">
                <span>{formData.description.length}/1000</span>
              </div>
            </div>

            {/* Status Selector */}
            <StatusSelector
              value={formData.status}
              onChange={(value) => onFieldChange("status", value)}
              hasCurrentArc={hasCurrentArc}
            />

            {/* Size Selector */}
            <SizeSelector
              value={formData.size}
              onChange={(value) => onFieldChange("size", value)}
            />

            {/* Arc Focus */}
            <div className="space-y-2">
              <Label htmlFor="focus" className="text-sm font-medium">
                {t("modal.arc_focus")} *
              </Label>
              <Textarea
                id="focus"
                value={formData.focus}
                onChange={(e) => onFieldChange("focus", e.target.value)}
                placeholder={t("modal.arc_focus_placeholder")}
                rows={3}
                maxLength={500}
                className="resize-none"
              />
              <div className="flex justify-end text-xs text-muted-foreground">
                <span>{formData.focus.length}/500</span>
              </div>
            </div>

            {/* Event Chain */}
            <EventChainEditor
              events={formData.events}
              onChange={(events) => onFieldChange("events", events)}
            />
          </div>

          <Separator />

          {/* Advanced Section */}
          <AdvancedSection>
            {/* Important Characters */}
            <CharacterSelector
              characters={characters}
              selectedIds={formData.importantCharacters}
              onChange={(ids) => onFieldChange("importantCharacters", ids)}
            />

            {/* Important Factions */}
            <FactionSelector
              factions={factions}
              selectedIds={formData.importantFactions}
              onChange={(ids) => onFieldChange("importantFactions", ids)}
            />

            {/* Important Items */}
            <ItemSelector
              items={items}
              selectedIds={formData.importantItems}
              onChange={(ids) => onFieldChange("importantItems", ids)}
            />

            {/* Arc Message */}
            <div className="space-y-2">
              <Label htmlFor="arcMessage" className="text-sm font-medium">
                {t("modal.arc_message")}
              </Label>
              <Textarea
                id="arcMessage"
                value={formData.arcMessage}
                onChange={(e) => onFieldChange("arcMessage", e.target.value)}
                placeholder={t("modal.arc_message_placeholder")}
                rows={3}
                maxLength={500}
                className="resize-none"
              />
              <div className="flex justify-end text-xs text-muted-foreground">
                <span>{formData.arcMessage.length}/500</span>
              </div>
            </div>

            {/* World Impact */}
            <div className="space-y-2">
              <Label htmlFor="worldImpact" className="text-sm font-medium">
                {t("modal.world_impact")}
              </Label>
              <Textarea
                id="worldImpact"
                value={formData.worldImpact}
                onChange={(e) => onFieldChange("worldImpact", e.target.value)}
                placeholder={t("modal.world_impact_placeholder")}
                rows={3}
                maxLength={500}
                className="resize-none"
              />
              <div className="flex justify-end text-xs text-muted-foreground">
                <span>{formData.worldImpact.length}/500</span>
              </div>
            </div>
          </AdvancedSection>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              {t("button.cancel")}
            </Button>
            <Button
              type="submit"
              disabled={!isValid}
              variant="magical"
              size="lg"
              className="flex-1 animate-glow"
            >
              {t("button.create")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

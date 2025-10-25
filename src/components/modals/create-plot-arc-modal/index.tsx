import { useCallback, useMemo, useState } from "react";

import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import type { IPlotArc, IPlotEvent } from "@/types/plot-types";

import { CreatePlotArcModalView } from "./view";

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

interface PropsCreatePlotArcModal {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateArc: (arcData: Omit<IPlotArc, "id" | "progress" | "order">) => void;
  existingArcs: IPlotArc[];
  characters?: Character[];
  factions?: Faction[];
  items?: Item[];
}

export function CreatePlotArcModal({
  open,
  onOpenChange,
  onCreateArc,
  existingArcs,
  characters = [],
  factions = [],
  items = [],
}: PropsCreatePlotArcModal) {
  const { t } = useTranslation("create-plot-arc");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "" as "" | "planejamento" | "atual" | "finalizado",
    size: "" as "" | "mini" | "pequeno" | "médio" | "grande",
    focus: "",
    events: [] as IPlotEvent[],
    importantCharacters: [] as string[],
    importantFactions: [] as string[],
    importantItems: [] as string[],
    arcMessage: "",
    worldImpact: "",
  });

  const hasCurrentArc = useMemo(
    () => existingArcs.some((arc) => arc.status === "atual"),
    [existingArcs]
  );

  const isValid = useMemo(
    () =>
      Boolean(
        formData.name.trim() &&
          formData.description.trim() &&
          formData.status &&
          formData.size &&
          formData.focus.trim() &&
          formData.events.length > 0
      ),
    [formData]
  );

  const handleClose = useCallback(() => {
    setFormData({
      name: "",
      description: "",
      status: "",
      size: "",
      focus: "",
      events: [],
      importantCharacters: [],
      importantFactions: [],
      importantItems: [],
      arcMessage: "",
      worldImpact: "",
    });
    onOpenChange(false);
  }, [onOpenChange]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!isValid) {
        toast.error(t("toast.fill_required_fields"));
        return;
      }

      // Check if trying to create another "atual" arc when one already exists
      if (formData.status === "atual" && hasCurrentArc) {
        toast.error(t("toast.only_one_current_arc"));
        return;
      }

      const arcData: Omit<IPlotArc, "id" | "progress" | "order"> = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        status: formData.status,
        size: formData.size,
        focus: formData.focus.trim(),
        events: formData.events,
        importantCharacters: formData.importantCharacters,
        importantFactions: formData.importantFactions,
        importantItems: formData.importantItems,
        arcMessage: formData.arcMessage.trim() || undefined,
        worldImpact: formData.worldImpact.trim() || undefined,
      };

      try {
        await onCreateArc(arcData);
        handleClose();
        toast.success(t("toast.arc_created"));
      } catch (error) {
        console.error("Failed to create arc:", error);
        toast.error(t("toast.create_failed"));
      }
    },
    [formData, isValid, hasCurrentArc, onCreateArc, handleClose, t]
  );

  const handleFieldChange = useCallback(
    <K extends keyof typeof formData>(
      field: K,
      value: (typeof formData)[K]
    ) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  return (
    <CreatePlotArcModalView
      open={open}
      formData={formData}
      isValid={isValid}
      hasCurrentArc={hasCurrentArc}
      characters={characters}
      factions={factions}
      items={items}
      onClose={handleClose}
      onSubmit={handleSubmit}
      onFieldChange={handleFieldChange}
    />
  );
}

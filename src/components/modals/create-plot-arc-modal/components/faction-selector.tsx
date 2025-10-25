import { X } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Faction {
  id: string;
  name: string;
  emblem?: string;
}

interface PropsFactionSelector {
  factions: Faction[];
  selectedIds: string[];
  onChange: (selectedIds: string[]) => void;
}

export function FactionSelector({
  factions,
  selectedIds,
  onChange,
}: PropsFactionSelector) {
  const { t } = useTranslation("create-plot-arc");

  const selectedFactions = factions.filter((f) => selectedIds.includes(f.id));
  const availableFactions = factions.filter((f) => !selectedIds.includes(f.id));

  const handleAdd = (factionId: string) => {
    if (!selectedIds.includes(factionId)) {
      onChange([...selectedIds, factionId]);
    }
  };

  const handleRemove = (factionId: string) => {
    onChange(selectedIds.filter((id) => id !== factionId));
  };

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">
          {t("modal.important_factions")}
        </Label>
        {selectedFactions.length > 0 && (
          <span className="text-xs text-muted-foreground">
            {selectedFactions.length} {selectedFactions.length === 1 ? t("modal.selected_singular") : t("modal.selected_plural")}
          </span>
        )}
      </div>

      {factions.length === 0 ? (
        <div className="text-center py-6 text-muted-foreground border border-dashed border-border rounded-lg bg-muted/20">
          <p className="text-sm">{t("modal.no_factions_available")}</p>
        </div>
      ) : (
        <>
          {availableFactions.length > 0 && (
            <Select onValueChange={handleAdd}>
              <SelectTrigger>
                <SelectValue placeholder={t("modal.select_faction")} />
              </SelectTrigger>
              <SelectContent>
                {availableFactions.map((faction) => (
                  <SelectItem
                    key={faction.id}
                    value={faction.id}
                    className="py-3 cursor-pointer focus:!bg-primary/10 focus:!text-foreground hover:!bg-primary/10"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="w-8 h-8 rounded-md">
                        <AvatarImage src={faction.emblem} alt={faction.name} />
                        <AvatarFallback className="text-xs rounded-md !text-foreground">
                          {getInitials(faction.name)}
                        </AvatarFallback>
                      </Avatar>
                      <span>{faction.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {selectedFactions.length > 0 && (
            <div className="max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
              <div className="flex flex-wrap gap-3">
                {selectedFactions.map((faction) => (
                  <div
                    key={faction.id}
                    className="relative group flex items-center gap-2 p-2 pr-3 rounded-lg border border-border bg-card hover:bg-muted/50 transition-colors"
                  >
                    <Avatar className="w-10 h-10 rounded-md">
                      <AvatarImage src={faction.emblem} alt={faction.name} />
                      <AvatarFallback className="text-xs rounded-md">
                        {getInitials(faction.name)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">{faction.name}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 ml-1"
                      onClick={() => handleRemove(faction.id)}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedFactions.length === 0 && factions.length > 0 && (
            <div className="text-center py-6 text-muted-foreground border border-dashed border-border rounded-lg">
              <p className="text-sm">{t("modal.no_factions_selected")}</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

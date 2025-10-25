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

interface Item {
  id: string;
  name: string;
  image?: string;
}

interface PropsItemSelector {
  items: Item[];
  selectedIds: string[];
  onChange: (selectedIds: string[]) => void;
}

export function ItemSelector({
  items,
  selectedIds,
  onChange,
}: PropsItemSelector) {
  const { t } = useTranslation("create-plot-arc");

  const selectedItems = items.filter((i) => selectedIds.includes(i.id));
  const availableItems = items.filter((i) => !selectedIds.includes(i.id));

  const handleAdd = (itemId: string) => {
    if (!selectedIds.includes(itemId)) {
      onChange([...selectedIds, itemId]);
    }
  };

  const handleRemove = (itemId: string) => {
    onChange(selectedIds.filter((id) => id !== itemId));
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
          {t("modal.important_items")}
        </Label>
        {selectedItems.length > 0 && (
          <span className="text-xs text-muted-foreground">
            {selectedItems.length} {selectedItems.length === 1 ? t("modal.selected_singular") : t("modal.selected_plural")}
          </span>
        )}
      </div>

      {items.length === 0 ? (
        <div className="text-center py-6 text-muted-foreground border border-dashed border-border rounded-lg bg-muted/20">
          <p className="text-sm">{t("modal.no_items_available")}</p>
        </div>
      ) : (
        <>
          {availableItems.length > 0 && (
            <Select onValueChange={handleAdd}>
              <SelectTrigger>
                <SelectValue placeholder={t("modal.select_item")} />
              </SelectTrigger>
              <SelectContent>
                {availableItems.map((item) => (
                  <SelectItem
                    key={item.id}
                    value={item.id}
                    className="py-3 cursor-pointer focus:!bg-primary/10 focus:!text-foreground hover:!bg-primary/10"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="w-8 h-8 rounded-md">
                        <AvatarImage src={item.image} alt={item.name} />
                        <AvatarFallback className="text-xs rounded-md !text-foreground">
                          {getInitials(item.name)}
                        </AvatarFallback>
                      </Avatar>
                      <span>{item.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {selectedItems.length > 0 && (
            <div className="max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
              <div className="flex flex-wrap gap-3">
                {selectedItems.map((item) => (
                  <div
                    key={item.id}
                    className="relative group flex items-center gap-2 p-2 pr-3 rounded-lg border border-border bg-card hover:bg-muted/50 transition-colors"
                  >
                    <Avatar className="w-10 h-10 rounded-md">
                      <AvatarImage src={item.image} alt={item.name} />
                      <AvatarFallback className="text-xs rounded-md">
                        {getInitials(item.name)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">{item.name}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 ml-1"
                      onClick={() => handleRemove(item.id)}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedItems.length === 0 && items.length > 0 && (
            <div className="text-center py-6 text-muted-foreground border border-dashed border-border rounded-lg">
              <p className="text-sm">{t("modal.no_items_selected")}</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

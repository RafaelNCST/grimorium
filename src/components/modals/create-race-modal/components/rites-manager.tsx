import { useState } from "react";

import { Edit, FileText, Plus, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export interface RiteItem {
  id: string;
  text: string;
}

interface PropsRitesManager {
  items: RiteItem[];
  onChange: (items: RiteItem[]) => void;
  label: string;
  buttonLabel: string;
  modalTitle: string;
  placeholder: string;
}

export function RitesManager({
  items,
  onChange,
  label,
  buttonLabel,
  modalTitle,
  placeholder,
}: PropsRitesManager) {
  const { t } = useTranslation("create-race");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<RiteItem | null>(null);
  const [text, setText] = useState("");

  const handleOpenModal = (item?: RiteItem) => {
    if (item) {
      setEditingItem(item);
      setText(item.text);
    } else {
      setEditingItem(null);
      setText("");
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    setText("");
  };

  const handleSave = () => {
    if (!text.trim()) return;

    const newItem: RiteItem = {
      id: editingItem?.id || `rite-${Date.now()}`,
      text: text.trim(),
    };

    if (editingItem) {
      onChange(items.map((i) => (i.id === editingItem.id ? newItem : i)));
    } else {
      onChange([...items, newItem]);
    }

    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    onChange(items.filter((i) => i.id !== id));
  };

  const canSave = text.trim() && text.length <= 500;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">{label}</label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => handleOpenModal()}
        >
          <Plus className="w-4 h-4 mr-2" />
          {buttonLabel}
        </Button>
      </div>

      {items.length > 0 && (
        <div className="space-y-2">
          {items.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 flex items-start gap-2">
                  <FileText className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {item.text}
                  </p>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleOpenModal(item)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(item.id)}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{modalTitle}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>{t("modal.text")} *</Label>
              <Textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={placeholder}
                maxLength={500}
                rows={6}
              />
              <div className="flex justify-end text-xs text-muted-foreground">
                <span>{text.length}/500</span>
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

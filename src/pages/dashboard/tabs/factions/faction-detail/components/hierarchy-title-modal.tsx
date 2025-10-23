import React, { useState, useEffect } from "react";

import { ChevronUp, ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { type IHierarchyTitle } from "@/types/faction-types";

interface HierarchyTitleModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingTitle: IHierarchyTitle | null;
  existingTitles: IHierarchyTitle[];
  onSave: (title: IHierarchyTitle) => void;
}

export function HierarchyTitleModal({
  isOpen,
  onClose,
  editingTitle,
  existingTitles,
  onSave,
}: HierarchyTitleModalProps) {
  const { t } = useTranslation("faction-detail");
  const [name, setName] = useState("");
  const [order, setOrder] = useState<number>(1);
  const [error, setError] = useState("");

  useEffect(() => {
    if (editingTitle) {
      setName(editingTitle.name);
      setOrder(editingTitle.order || 1);
    } else {
      // Calculate next order for new title
      const maxOrder = Math.max(
        0,
        ...existingTitles
          .filter((t) => !t.isMembersTitle && t.order !== undefined)
          .map((t) => t.order || 0)
      );
      setName("");
      setOrder(maxOrder + 1);
    }
    setError("");
  }, [editingTitle, isOpen, existingTitles]);

  const handleSave = () => {
    // Validation
    if (!name.trim()) {
      setError(t("hierarchy.title_name"));
      return;
    }

    if (editingTitle?.isMembersTitle) {
      // For Members title, only update name
      const updatedTitle: IHierarchyTitle = {
        ...editingTitle,
        name: name.trim(),
      };
      onSave(updatedTitle);
    } else {
      // For custom titles, include order
      const title: IHierarchyTitle = {
        id: editingTitle?.id || `title-${Date.now()}`,
        name: name.trim(),
        order,
        characterIds: editingTitle?.characterIds || [],
      };
      onSave(title);
    }

    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>
            {editingTitle
              ? t("hierarchy.edit_title")
              : t("hierarchy.add_title")}
          </DialogTitle>
          <DialogDescription>
            {editingTitle?.isMembersTitle
              ? t("hierarchy.members_title")
              : editingTitle
                ? t("hierarchy.edit_title")
                : t("hierarchy.add_title")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Title Name */}
          <div className="space-y-2">
            <Label htmlFor="title-name">{t("hierarchy.title_name")}</Label>
            <Input
              id="title-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("hierarchy.title_name")}
              maxLength={100}
            />
            <div className="flex justify-end text-xs text-muted-foreground">
              <span>{name.length}/100</span>
            </div>
          </div>

          {/* Order (only for custom titles) */}
          {!editingTitle?.isMembersTitle && (
            <div className="space-y-2">
              <Label>{t("hierarchy.title_order")}</Label>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => setOrder(Math.max(1, order - 1))}
                  disabled={order <= 1}
                >
                  <ChevronDown className="w-4 h-4" />
                </Button>
                <div className="flex-1 text-center py-2 px-4 border rounded-md bg-background">
                  <span className="text-lg font-semibold">{order}</span>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => setOrder(order + 1)}
                >
                  <ChevronUp className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Quanto menor o número, maior a importância
              </p>
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
              {error}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            {t("hierarchy.cancel")}
          </Button>
          <Button
            variant="magical"
            className="animate-glow"
            onClick={handleSave}
          >
            {t("hierarchy.save")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

import React, { useState, useEffect } from "react";

import {
  Plus,
  Edit2,
  Trash2,
  ChevronUp,
  ChevronDown,
  Check,
  Crown,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { type IHierarchyTitle } from "@/types/faction-types";

import { HIERARCHY_TITLE_COLORS, getColorClasses } from "./hierarchy-section";

interface ManageTitlesModalProps {
  isOpen: boolean;
  onClose: () => void;
  titles: IHierarchyTitle[];
  onSave: (titles: IHierarchyTitle[]) => void;
}

type ViewMode = "list" | "add" | "edit";

export function ManageTitlesModal({
  isOpen,
  onClose,
  titles,
  onSave,
}: ManageTitlesModalProps) {
  const { t } = useTranslation("faction-detail");
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [editingTitle, setEditingTitle] = useState<IHierarchyTitle | null>(
    null
  );

  // Formulário para adicionar/editar
  const [formName, setFormName] = useState("");
  const [formOrder, setFormOrder] = useState(1);
  const [formColor, setFormColor] = useState(HIERARCHY_TITLE_COLORS[0].value);

  useEffect(() => {
    if (isOpen) {
      setViewMode("list");
      resetForm();
    }
  }, [isOpen]);

  const resetForm = () => {
    setFormName("");
    setFormOrder(1);
    setFormColor(HIERARCHY_TITLE_COLORS[0].value);
    setEditingTitle(null);
  };

  const handleStartAdd = () => {
    resetForm();
    setViewMode("add");
  };

  const handleStartEdit = (title: IHierarchyTitle) => {
    setEditingTitle(title);
    setFormName(title.name);
    setFormOrder(title.order || 1);
    setFormColor(title.color || HIERARCHY_TITLE_COLORS[0].value);
    setViewMode("edit");
  };

  const handleSaveTitle = () => {
    if (!formName.trim()) return;

    let updatedTitles: IHierarchyTitle[];

    if (viewMode === "add") {
      const newTitle: IHierarchyTitle = {
        id: `title-${Date.now()}`,
        name: formName.trim(),
        order: formOrder,
        color: formColor,
        characterIds: [],
      };
      updatedTitles = [...titles, newTitle];
    } else if (viewMode === "edit" && editingTitle) {
      updatedTitles = titles.map((t) =>
        t.id === editingTitle.id
          ? { ...t, name: formName.trim(), order: formOrder, color: formColor }
          : t
      );
    } else {
      return;
    }

    onSave(updatedTitles);
    resetForm();
    setViewMode("list");
  };

  const handleDeleteTitle = (titleId: string) => {
    const updatedTitles = titles.filter((t) => t.id !== titleId);
    onSave(updatedTitles);
  };

  const handleOrderChange = (delta: number) => {
    const newOrder = formOrder + delta;
    if (newOrder >= 1 && newOrder <= 100) {
      setFormOrder(newOrder);
    }
  };

  const handleOrderInputChange = (value: string) => {
    const num = parseInt(value, 10);
    if (!isNaN(num) && num >= 1 && num <= 100) {
      setFormOrder(num);
    } else if (value === "") {
      setFormOrder(1);
    }
  };

  // Filtrar apenas títulos customizados (não "Membros")
  const customTitles = titles
    .filter((t) => !t.isMembersTitle)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  const isFormValid = formName.trim().length > 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>
            {viewMode === "list" && t("hierarchy.manage_titles")}
            {viewMode === "add" && t("hierarchy.add_title")}
            {viewMode === "edit" && t("hierarchy.edit_title")}
          </DialogTitle>
          <DialogDescription>
            {viewMode === "list" && t("hierarchy.manage_titles_description")}
            {viewMode === "add" && t("hierarchy.add_title_description")}
            {viewMode === "edit" && t("hierarchy.edit_title_description")}
          </DialogDescription>
        </DialogHeader>

        {viewMode === "list" ? (
          <div className="space-y-4 py-4">
            {/* Botão Adicionar */}
            <Button
              variant="magical"
              size="sm"
              className="w-full animate-glow"
              onClick={handleStartAdd}
            >
              <Plus className="w-4 h-4 mr-2" />
              {t("hierarchy.add_title")}
            </Button>

            {/* Lista de Títulos */}
            <ScrollArea className="h-[300px] pr-3">
              {customTitles.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full py-12 text-muted-foreground">
                  <Crown className="w-12 h-12 mb-3 opacity-50" />
                  <p className="text-sm font-medium">
                    {t("hierarchy.no_titles_yet")}
                  </p>
                  <p className="text-xs mt-1 opacity-70">
                    {t("hierarchy.no_titles_hint")}
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {customTitles.map((title) => {
                    const colorClasses = getColorClasses(title.color);
                    return (
                      <div
                        key={title.id}
                        className={`flex items-center gap-3 p-3 rounded-lg ${colorClasses.bg}`}
                      >
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate text-foreground">
                            {title.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {t("hierarchy.order")}: #{title.order}
                          </p>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleStartEdit(title)}
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost-destructive"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleDeleteTitle(title.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </ScrollArea>

            {/* Botão Fechar */}
            <Button variant="secondary" className="w-full" onClick={onClose}>
              {t("hierarchy.close")}
            </Button>
          </div>
        ) : (
          <div className="space-y-4 py-4">
            {/* Nome do Título */}
            <div className="space-y-2">
              <Label htmlFor="title-name">{t("hierarchy.title_name")}</Label>
              <Input
                id="title-name"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder={t("hierarchy.title_name_placeholder")}
                maxLength={200}
              />
              <div className="flex justify-end text-xs text-muted-foreground">
                <span>{formName.length}/200</span>
              </div>
            </div>

            {/* Ordem (Contador 1-100) */}
            <div className="space-y-2">
              <Label>{t("hierarchy.title_order")}</Label>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => handleOrderChange(-1)}
                  disabled={formOrder <= 1}
                >
                  <ChevronDown className="w-4 h-4" />
                </Button>
                <Input
                  type="number"
                  value={formOrder}
                  onChange={(e) => handleOrderInputChange(e.target.value)}
                  className="w-20 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  min={1}
                  max={100}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => handleOrderChange(1)}
                  disabled={formOrder >= 100}
                >
                  <ChevronUp className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                {t("hierarchy.order_hint")}
              </p>
            </div>

            {/* Seletor de Cor */}
            <div className="space-y-2">
              <Label>{t("hierarchy.title_color")}</Label>
              <div className="grid grid-cols-6 gap-2">
                {HIERARCHY_TITLE_COLORS.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => setFormColor(color.value)}
                    className={cn(
                      "w-10 h-10 rounded-lg border flex items-center justify-center transition-all hover:opacity-60",
                      color.pickerBg,
                      formColor === color.value
                        ? "opacity-60 border-foreground"
                        : "border-border"
                    )}
                  >
                    {formColor === color.value && (
                      <Check className="w-5 h-5 text-white" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Botões */}
            <div className="flex gap-2 pt-2">
              <Button
                variant="secondary"
                className="flex-1"
                onClick={() => {
                  resetForm();
                  setViewMode("list");
                }}
              >
                {t("hierarchy.cancel")}
              </Button>
              <Button
                variant="magical"
                className="flex-1 animate-glow"
                onClick={handleSaveTitle}
                disabled={!isFormValid}
              >
                {viewMode === "add"
                  ? t("hierarchy.create_title")
                  : t("hierarchy.save_title")}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

import { useState, useEffect } from "react";
import { Plus, Trash2, UserCircle, Upload, Edit2, X } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  type IPowerBlock,
  type IconGroupContent,
} from "../../types/power-system-types";

interface IconGroupBlockProps {
  block: IPowerBlock;
  isEditMode: boolean;
  onUpdate: (content: IconGroupContent) => void;
  onDelete: () => void;
}

interface IconCardDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    id: string;
    imageUrl?: string;
    title: string;
    description: string;
  }) => void;
  initialData?: {
    id: string;
    imageUrl?: string;
    title: string;
    description: string;
  };
}

function IconCardDialog({
  isOpen,
  onClose,
  onSave,
  initialData,
}: IconCardDialogProps) {
  const { t } = useTranslation("power-system");
  const [formData, setFormData] = useState(
    initialData || {
      id: crypto.randomUUID(),
      imageUrl: undefined,
      title: "",
      description: "",
    }
  );

  // Reset form when modal opens or initialData changes
  useEffect(() => {
    if (isOpen) {
      setFormData(
        initialData || {
          id: crypto.randomUUID(),
          imageUrl: undefined,
          title: "",
          description: "",
        }
      );
    }
  }, [isOpen, initialData]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setFormData({ ...formData, imageUrl: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (formData.title.trim() && formData.description.trim()) {
      onSave(formData);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>
            {initialData
              ? t("blocks.icon_group.edit_icon")
              : t("blocks.icon_group.add_icon")}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Ícone centralizado no topo */}
          <div className="flex justify-center">
            <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 transition-colors group">
              {formData.imageUrl ? (
                <>
                  <img
                    src={formData.imageUrl}
                    alt="Icon preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <label htmlFor="icon-group-upload" className="cursor-pointer" data-no-drag="true">
                      <Upload className="h-5 w-5 text-white" />
                    </label>
                  </div>
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-muted/50">
                  <label
                    htmlFor="icon-group-upload"
                    className="cursor-pointer"
                    data-no-drag="true"
                  >
                    <UserCircle className="w-10 h-10 text-muted-foreground" />
                  </label>
                </div>
              )}
              <input
                id="icon-group-upload"
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp,image/gif"
                onChange={handleFileChange}
                className="hidden"
                data-no-drag="true"
              />
            </div>
          </div>

          {/* Campos */}
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium mb-1.5 block">
                {t("blocks.icon_group.title_placeholder")}
              </label>
              <Input
                data-no-drag="true"
                placeholder={t("blocks.icon_group.title_placeholder")}
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium mb-1.5 block">
                {t("blocks.icon_group.description_placeholder")}
              </label>
              <Textarea
                data-no-drag="true"
                placeholder={t("blocks.icon_group.description_placeholder")}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="min-h-[9rem] max-h-[9rem] resize-none pr-2"
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button data-no-drag="true" variant="outline" onClick={onClose} className="cursor-pointer">
            {t("blocks.icon_group.cancel")}
          </Button>
          <Button
            data-no-drag="true"
            onClick={handleSave}
            disabled={!formData.title.trim() || !formData.description.trim()}
            variant="magical"
            className="cursor-pointer animate-glow"
          >
            {t("blocks.icon_group.save")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function IconGroupBlock({
  block,
  isEditMode,
  onUpdate,
  onDelete,
}: IconGroupBlockProps) {
  const { t } = useTranslation("power-system");
  const content = block.content as IconGroupContent;
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingIcon, setEditingIcon] = useState<
    | {
        id: string;
        imageUrl?: string;
        title: string;
        description: string;
      }
    | undefined
  >();

  const handleAddIcon = (data: {
    id: string;
    imageUrl?: string;
    title: string;
    description: string;
  }) => {
    onUpdate({
      ...content,
      icons: [...content.icons, data],
    });
  };

  const handleEditIcon = (data: {
    id: string;
    imageUrl?: string;
    title: string;
    description: string;
  }) => {
    onUpdate({
      ...content,
      icons: content.icons.map((icon) => (icon.id === data.id ? data : icon)),
    });
  };

  const handleDeleteIcon = (id: string) => {
    onUpdate({
      ...content,
      icons: content.icons.filter((icon) => icon.id !== id),
    });
  };

  const openAddDialog = () => {
    setEditingIcon(undefined);
    setIsDialogOpen(true);
  };

  const openEditDialog = (icon: {
    id: string;
    imageUrl?: string;
    title: string;
    description: string;
  }) => {
    setEditingIcon(icon);
    setIsDialogOpen(true);
  };

  if (!isEditMode && content.icons.length === 0) {
    return null;
  }

  if (isEditMode) {
    return (
      <div className="space-y-3 p-4 rounded-lg border bg-card">
        <div className="flex items-center justify-between gap-2 mb-2">
          <Button data-no-drag="true" onClick={openAddDialog} size="sm" variant="outline" className="cursor-pointer">
            <Plus className="h-4 w-4 mr-2" />
            {t("blocks.icon_group.add_icon_button")}
          </Button>

          <Button
            data-no-drag="true"
            variant="ghost"
            size="icon"
            onClick={onDelete}
            className="text-destructive hover:bg-red-500/20 hover:text-red-600 cursor-pointer"
          >
            <Trash2 className="w-5 h-5" />
          </Button>
        </div>

        {content.icons.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {content.icons.map((icon) => (
              <div
                key={icon.id}
                className="p-3 rounded-lg border bg-card/50 flex flex-col items-center text-center gap-3 group overflow-hidden"
              >
                <div className="relative w-16 h-16 rounded-full overflow-hidden border">
                  {icon.imageUrl ? (
                    <img
                      src={icon.imageUrl}
                      alt={icon.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-muted/50">
                      <UserCircle className="w-8 h-8 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div className="flex-1 space-y-1 w-full min-w-0">
                  <h4 className="font-semibold text-sm truncate w-full">{icon.title}</h4>
                  <p className="text-xs text-muted-foreground max-h-[6rem] overflow-y-auto break-words overflow-wrap-anywhere w-full pr-2">
                    {icon.description}
                  </p>
                </div>
                <div className="flex gap-1">
                  <Button
                    data-no-drag="true"
                    variant="ghost"
                    size="icon"
                    onClick={() => openEditDialog(icon)}
                    className="h-7 w-7 cursor-pointer"
                  >
                    <Edit2 className="h-3 w-3" />
                  </Button>
                  <Button
                    data-no-drag="true"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteIcon(icon.id)}
                    className="h-7 w-7 text-destructive hover:bg-red-500/20 hover:text-red-600 cursor-pointer"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        <IconCardDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          onSave={editingIcon ? handleEditIcon : handleAddIcon}
          initialData={editingIcon}
        />
      </div>
    );
  }

  return (
    <>
      {content.icons.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {content.icons.map((icon) => (
            <div
              key={icon.id}
              className="p-3 rounded-lg border bg-card/50 flex flex-col items-center text-center gap-3 overflow-hidden"
            >
              <div className="w-16 h-16 rounded-full overflow-hidden border">
                {icon.imageUrl ? (
                  <img
                    src={icon.imageUrl}
                    alt={icon.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-muted/50">
                    <UserCircle className="w-8 h-8 text-muted-foreground" />
                  </div>
                )}
              </div>
              <div className="flex-1 space-y-1 w-full min-w-0">
                <h4 className="font-semibold text-sm truncate w-full">{icon.title}</h4>
                <p className="text-xs text-muted-foreground max-h-[6rem] overflow-y-auto break-words overflow-wrap-anywhere w-full pr-2">
                  {icon.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : null}
      <IconCardDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={editingIcon ? handleEditIcon : handleAddIcon}
        initialData={editingIcon}
      />
    </>
  );
}

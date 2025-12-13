import { useState, useEffect } from "react";

import { Plus, Trash2, UserCircle, Edit2, X } from "lucide-react";
import { useTranslation } from "react-i18next";

import { FormImageUpload } from "@/components/forms/FormImageUpload";
import { FormInput } from "@/components/forms/FormInput";
import { FormTextarea } from "@/components/forms/FormTextarea";
import { Button } from "@/components/ui/button";
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

  const handleImageChange = (value: string) => {
    setFormData({ ...formData, imageUrl: value });
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
          <div className="flex justify-center" data-no-drag="true">
            <FormImageUpload
              value={formData.imageUrl}
              onChange={handleImageChange}
              label=""
              height="h-20"
              width="w-20"
              shape="circle"
              imageFit="cover"
              showLabel={false}
              compact
              placeholderIcon={UserCircle}
              id="icon-group-upload"
            />
          </div>

          {/* Campos */}
          <div className="space-y-3">
            <FormInput
              label={t("blocks.icon_group.title_label")}
              placeholder={t("blocks.icon_group.title_placeholder")}
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
              labelClassName="text-primary"
              showOptionalLabel={false}
              maxLength={100}
              showCharCount
              data-no-drag="true"
            />

            <FormTextarea
              label={t("blocks.icon_group.description_label")}
              placeholder={t("blocks.icon_group.description_placeholder")}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              required
              labelClassName="text-primary"
              showOptionalLabel={false}
              maxLength={500}
              showCharCount
              className="min-h-[9rem] max-h-[9rem] resize-none pr-2"
              data-no-drag="true"
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            data-no-drag="true"
            variant="secondary"
            onClick={onClose}
            className="cursor-pointer"
          >
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
          <Button
            data-no-drag="true"
            onClick={openAddDialog}
            size="sm"
            variant="secondary"
            className="cursor-pointer"
          >
            <Plus className="h-4 w-4 mr-2" />
            {t("blocks.icon_group.add_icon_button")}
          </Button>

          <Button
            data-no-drag="true"
            variant="ghost-destructive"
            size="icon"
            onClick={onDelete}
            className="cursor-pointer"
          >
            <Trash2 className="w-5 h-5" />
          </Button>
        </div>

        {content.icons.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {content.icons.map((icon) => (
              <div
                key={icon.id}
                className="relative p-3 rounded-lg border bg-card/50 flex flex-col items-center text-center gap-3 group overflow-hidden h-[15.5rem]"
              >
                {/* Botões de ação no topo */}
                <div className="absolute top-1 right-1 flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  <Button
                    data-no-drag="true"
                    variant="ghost"
                    size="icon"
                    onClick={() => openEditDialog(icon)}
                    className="h-6 w-6 cursor-pointer"
                  >
                    <Edit2 className="h-3 w-3" />
                  </Button>
                  <Button
                    data-no-drag="true"
                    variant="ghost-destructive"
                    size="icon"
                    onClick={() => handleDeleteIcon(icon.id)}
                    className="h-6 w-6 cursor-pointer"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>

                <div className="relative w-16 h-16 rounded-full overflow-hidden shrink-0">
                  {icon.imageUrl ? (
                    <img
                      src={icon.imageUrl}
                      alt={icon.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="bg-purple-950/40 flex items-center justify-center w-16 h-16 rounded-full">
                      <UserCircle className="w-8 h-8 text-purple-400" />
                    </div>
                  )}
                </div>
                <div className="flex-1 space-y-1 w-full min-w-0">
                  <h4 className="font-semibold text-sm w-full break-words max-h-[3rem] overflow-y-auto pr-1">
                    {icon.title}
                  </h4>
                  <p className="text-xs text-muted-foreground max-h-[6rem] overflow-y-auto break-words w-full pr-1">
                    {icon.description}
                  </p>
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
              className="p-3 rounded-lg border bg-card/50 flex flex-col items-center text-center gap-3 overflow-hidden h-[15.5rem]"
            >
              <div className="w-16 h-16 rounded-full overflow-hidden shrink-0">
                {icon.imageUrl ? (
                  <img
                    src={icon.imageUrl}
                    alt={icon.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="bg-purple-950/40 flex items-center justify-center w-16 h-16 rounded-full">
                    <UserCircle className="w-8 h-8 text-purple-400" />
                  </div>
                )}
              </div>
              <div className="flex-1 space-y-1 w-full min-w-0">
                <h4 className="font-semibold text-sm w-full break-words max-h-[3rem] overflow-y-auto pr-1">
                  {icon.title}
                </h4>
                <p className="text-xs text-muted-foreground max-h-[6rem] overflow-y-auto break-words w-full pr-1">
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

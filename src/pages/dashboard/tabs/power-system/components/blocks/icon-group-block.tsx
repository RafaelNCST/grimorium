import { useState, useEffect } from "react";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Plus, UserCircle, Edit2, X, Trash2 } from "lucide-react";
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

import { BlockReorderButtons } from "./shared/block-reorder-buttons";

interface IconGroupBlockProps {
  block: IPowerBlock;
  isEditMode: boolean;
  onUpdate: (content: IconGroupContent) => void;
  onDelete: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  isFirst?: boolean;
  isLast?: boolean;
}

interface SortableIconCardProps {
  icon: IconGroupContent["icons"][0];
  isEditMode: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

function SortableIconCard({
  icon,
  isEditMode,
  onEdit,
  onDelete,
}: SortableIconCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: icon.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0 : 1,
  };

  // Filter listeners to prevent dragging when clicking on interactive elements
  const filteredListeners = isEditMode
    ? Object.entries(listeners || {}).reduce(
        (acc, [key, handler]) => {
          acc[key] = (event: React.SyntheticEvent) => {
            const target = event.target as HTMLElement;
            if (target.closest('[data-no-drag="true"]')) {
              return;
            }
            if (handler) {
              handler(event);
            }
          };
          return acc;
        },
        {} as typeof listeners
      )
    : {};

  if (isEditMode) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...filteredListeners}
        className="relative px-2 py-3 rounded-lg border bg-card/50 flex flex-col items-center text-center gap-3 group overflow-hidden h-[15.5rem]"
      >
        {/* Botões de ação no topo */}
        <div
          className="absolute top-1 right-1 flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity z-10"
          data-no-drag="true"
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={onEdit}
            className="h-6 w-6 cursor-pointer"
          >
            <Edit2 className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost-destructive"
            size="icon"
            onClick={onDelete}
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
        <div className="flex-1 flex flex-col gap-1 w-full min-w-0 overflow-hidden">
          <h4 className="font-semibold text-sm w-full break-words line-clamp-2 pr-1 shrink-0">
            {icon.title}
          </h4>
          <p className="text-xs text-muted-foreground break-words w-full pr-1 flex-1 overflow-y-auto">
            {icon.description}
          </p>
        </div>
      </div>
    );
  }

  // View mode
  return (
    <div className="px-2 py-3 rounded-lg border bg-card/50 flex flex-col items-center text-center gap-3 overflow-hidden h-[15.5rem]">
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
      <div className="flex-1 flex flex-col gap-1 w-full min-w-0 overflow-hidden">
        <h4 className="font-semibold text-sm w-full break-words line-clamp-2 pr-1 shrink-0">
          {icon.title}
        </h4>
        <p className="text-xs text-muted-foreground break-words w-full pr-1 flex-1 overflow-y-auto">
          {icon.description}
        </p>
      </div>
    </div>
  );
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
      <DialogContent className="max-w-xl">
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
  onMoveUp,
  onMoveDown,
  isFirst = false,
  isLast = false,
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
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

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

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    setActiveId(null);

    if (over && active.id !== over.id) {
      const oldIndex = content.icons.findIndex((icon) => icon.id === active.id);
      const newIndex = content.icons.findIndex((icon) => icon.id === over.id);

      const reorderedIcons = arrayMove(content.icons, oldIndex, newIndex);
      onUpdate({
        ...content,
        icons: reorderedIcons,
      });
    }
  };

  const activeIcon = activeId
    ? content.icons.find((icon) => icon.id === activeId)
    : null;

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

          <BlockReorderButtons
            onMoveUp={onMoveUp}
            onMoveDown={onMoveDown}
            onDelete={onDelete}
            isFirst={isFirst}
            isLast={isLast}
          />
        </div>

        {content.icons.length > 0 && (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={content.icons.map((icon) => icon.id)}
              strategy={rectSortingStrategy}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {content.icons.map((icon) => (
                  <SortableIconCard
                    key={icon.id}
                    icon={icon}
                    isEditMode={isEditMode}
                    onEdit={() => openEditDialog(icon)}
                    onDelete={() => handleDeleteIcon(icon.id)}
                  />
                ))}
              </div>
            </SortableContext>

            <DragOverlay>
              {activeIcon ? (
                <div className="px-2 py-3 rounded-lg border bg-card/50 flex flex-col items-center text-center gap-3 overflow-hidden h-[15.5rem]">
                  <div className="w-16 h-16 rounded-full overflow-hidden shrink-0">
                    {activeIcon.imageUrl ? (
                      <img
                        src={activeIcon.imageUrl}
                        alt={activeIcon.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="bg-purple-950/40 flex items-center justify-center w-16 h-16 rounded-full">
                        <UserCircle className="w-8 h-8 text-purple-400" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 flex flex-col gap-1 w-full min-w-0 overflow-hidden">
                    <h4 className="font-semibold text-sm w-full break-words line-clamp-2 pr-1 shrink-0">
                      {activeIcon.title}
                    </h4>
                    <p className="text-xs text-muted-foreground break-words w-full pr-1 flex-1 overflow-y-auto">
                      {activeIcon.description}
                    </p>
                  </div>
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
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
            <SortableIconCard
              key={icon.id}
              icon={icon}
              isEditMode={false}
              onEdit={() => {}}
              onDelete={() => {}}
            />
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

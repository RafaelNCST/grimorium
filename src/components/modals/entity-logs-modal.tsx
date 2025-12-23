import { useState, useEffect } from "react";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Circle, Star, Zap, FileText, Pencil, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import type { IEntityLog, EntityType, ImportanceLevel } from "@/types/entity-log-types";
import {
  getEntityLogs,
  createEntityLog,
  updateEntityLog,
  deleteEntityLog,
  reorderEntityLogs,
  getNextOrderIndex,
} from "@/lib/db/entity-logs.service";
import { CreateEditLogModal } from "./create-edit-log-modal";

interface EntityLogsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entityId: string;
  entityType: EntityType;
  bookId: string;
}

// Icon and color mapping for importance levels
const IMPORTANCE_CONFIG: Record<
  ImportanceLevel,
  { icon: typeof Circle; color: string; label: string }
> = {
  minor: {
    icon: Circle,
    color: "text-gray-500",
    label: "Pequeno",
  },
  major: {
    icon: Star,
    color: "text-yellow-500",
    label: "Grande",
  },
  critical: {
    icon: Zap,
    color: "text-red-500",
    label: "Crítico",
  },
};

interface SortableLogItemProps {
  log: IEntityLog;
  onEdit: (log: IEntityLog) => void;
  onDelete: (id: string) => void;
  activeId: string | null;
}

function SortableLogItem({ log, onEdit, onDelete, activeId }: SortableLogItemProps) {
  const { t } = useTranslation("entity-logs");
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useSortable({ id: log.id });

  // Check if any drag is happening
  const isAnyDragging = activeId !== null;
  // Check if this item is being displaced by the dragged item
  const isDisplaced = isAnyDragging && !isDragging && transform;

  const style = {
    transform: CSS.Transform.toString(transform),
    // Smooth transition only for displaced items during drag
    transition: isDisplaced ? "transform 200ms ease" : undefined,
    opacity: 1,
    zIndex: isDragging ? 1000 : "auto",
  };

  const importanceConfig = IMPORTANCE_CONFIG[log.importance];
  const ImportanceIcon = importanceConfig.icon;

  // Format moment display
  const momentDisplay = log.momentType === "chapter"
    ? `${t("fields.chapter")} ${log.chapterNumber}`
    : `Pré-história: ${log.prehistoryPeriod}`;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        "flex items-start gap-3 py-3 px-2 group hover:bg-primary/10 rounded-md cursor-grab active:cursor-grabbing",
        isDragging && "opacity-50 shadow-lg scale-105"
      )}
    >
      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Header */}
        <div className="flex items-center gap-2 mb-1.5">
          <ImportanceIcon className={cn("h-4 w-4", importanceConfig.color)} />
          <span className="text-sm font-medium text-muted-foreground">
            {momentDisplay}
          </span>
        </div>

        {/* Description */}
        <p className="text-sm text-foreground break-words pl-6">{log.description}</p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            onEdit(log);
          }}
          className="h-8 w-8"
        >
          <Pencil className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost-destructive"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(log.id);
          }}
          className="h-8 w-8"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

export function EntityLogsModal({
  open,
  onOpenChange,
  entityId,
  entityType,
  bookId,
}: EntityLogsModalProps) {
  const { t } = useTranslation("entity-logs");
  const [logs, setLogs] = useState<IEntityLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreateEditModalOpen, setIsCreateEditModalOpen] = useState(false);
  const [editingLog, setEditingLog] = useState<IEntityLog | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);

  // Load logs when modal opens
  useEffect(() => {
    if (open) {
      loadLogs();
    }
  }, [open, entityId, entityType]);

  const loadLogs = async () => {
    setIsLoading(true);
    try {
      const fetchedLogs = await getEntityLogs(entityId, entityType);
      setLogs(fetchedLogs);
    } catch (error) {
      console.error("Error loading logs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    setActiveId(null);

    if (over && active.id !== over.id) {
      const oldIndex = logs.findIndex((log) => log.id === active.id);
      const newIndex = logs.findIndex((log) => log.id === over.id);

      const reorderedLogs = arrayMove(logs, oldIndex, newIndex);
      setLogs(reorderedLogs);

      // Update order in database
      try {
        await reorderEntityLogs(
          entityId,
          entityType,
          reorderedLogs.map((log) => log.id)
        );
      } catch (error) {
        console.error("Error reordering logs:", error);
        // Revert on error
        loadLogs();
      }
    }
  };

  const handleCreateNew = () => {
    setEditingLog(null);
    setIsCreateEditModalOpen(true);
  };

  const handleEdit = (log: IEntityLog) => {
    setEditingLog(log);
    setIsCreateEditModalOpen(true);
  };

  const handleSaveLog = async (logData: Partial<IEntityLog>) => {
    try {
      if (editingLog) {
        // Update existing log
        await updateEntityLog(editingLog.id, logData);
      } else {
        // Create new log
        const nextOrderIndex = await getNextOrderIndex(entityId, entityType);
        const newLog: IEntityLog = {
          id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          entityId,
          entityType,
          bookId,
          ...logData,
          orderIndex: nextOrderIndex,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        } as IEntityLog;

        await createEntityLog(newLog);
      }

      // Reload logs
      await loadLogs();
      setIsCreateEditModalOpen(false);
      setEditingLog(null);
    } catch (error) {
      console.error("Error saving log:", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteEntityLog(id);
      await loadLogs();
    } catch (error) {
      console.error("Error deleting log:", error);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="w-[95vw] sm:w-[90vw] md:w-[85vw] lg:w-[1200px] h-[85vh] max-w-none flex flex-col gap-0">
          <DialogHeader className="mb-4">
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              {t("modal.title")}
            </DialogTitle>
            <DialogDescription>
              {t("modal.description")}
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto pr-2 mb-0">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">{t("modal.loading")}</p>
              </div>
            ) : logs.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full gap-4">
                <FileText className="h-12 w-12 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground text-center">
                  {t("modal.empty_state")}
                  <br />
                  {t("modal.empty_state_description")}
                </p>
              </div>
            ) : (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={logs.map((log) => log.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-1">
                    {logs.map((log) => (
                      <SortableLogItem
                        key={log.id}
                        log={log}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        activeId={activeId}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            )}
          </div>

          {/* Footer with create button */}
          <div className="pt-4 border-t">
            <Button
              variant="magical"
              onClick={handleCreateNew}
              className="w-full"
            >
              {t("modal.create_button")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create/Edit Modal */}
      <CreateEditLogModal
        open={isCreateEditModalOpen}
        onOpenChange={setIsCreateEditModalOpen}
        onSave={handleSaveLog}
        editingLog={editingLog}
      />
    </>
  );
}

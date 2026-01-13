/**
 * Global Entity Logs Modal
 *
 * Modal para visualizar e gerenciar todos os registros globais de uma obra.
 * Similar ao EntityLogsModal mas sem filtro de entidade.
 */

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
import { Anchor, BookOpen, Eye, ScrollText, Pencil, Trash2, Link } from "lucide-react";
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
import { useGlobalEntityLogsStore } from "@/stores/global-entity-logs-store";
import type {
  IGlobalEntityLog,
  IEntityLogLink,
  ImportanceLevel,
} from "@/types/global-entity-log-types";

import { CreateEditLogModal } from "./create-edit-log-modal";
import { ManageEntityLogLinksModal } from "./manage-entity-log-links-modal";

interface GlobalEntityLogsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bookId: string;
}

// Icon and color mapping for importance levels
const IMPORTANCE_CONFIG: Record<
  ImportanceLevel,
  { icon: typeof Anchor; color: string; label: string }
> = {
  hook: {
    icon: Anchor,
    color: "text-purple-500",
    label: "Gancho",
  },
  lore: {
    icon: BookOpen,
    color: "text-blue-500",
    label: "Lore",
  },
  foreshadowing: {
    icon: Eye,
    color: "text-amber-500",
    label: "Foreshadowing",
  },
};

interface SortableLogItemProps {
  log: IGlobalEntityLog;
  onEdit: (log: IGlobalEntityLog) => void;
  onDelete: (id: string) => void;
  onManageLinks: (log: IGlobalEntityLog) => void;
  activeId: string | null;
}

function SortableLogItem({
  log,
  onEdit,
  onDelete,
  onManageLinks,
  activeId,
}: SortableLogItemProps) {
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
  const momentDisplay =
    log.momentType === "chapter"
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
          {log.links.length > 0 && (
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Link className="h-3 w-3" />
              {log.links.length}
            </span>
          )}
        </div>

        {/* Description */}
        <p className="text-sm text-foreground break-words pl-6">
          {log.description}
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            onManageLinks(log);
          }}
          className="h-8 w-8"
        >
          <Link className="h-4 w-4" />
        </Button>
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

export function GlobalEntityLogsModal({
  open,
  onOpenChange,
  bookId,
}: GlobalEntityLogsModalProps) {
  const { t } = useTranslation("global-logs");
  const {
    logs,
    isLoading,
    fetchGlobalEntityLogs,
    addGlobalEntityLog,
    updateGlobalEntityLogInCache,
    deleteGlobalEntityLogFromCache,
    reorderGlobalEntityLogsInCache,
    updateEntityLogLinksInCache,
  } = useGlobalEntityLogsStore();

  const [isCreateEditModalOpen, setIsCreateEditModalOpen] = useState(false);
  const [editingLog, setEditingLog] = useState<IGlobalEntityLog | null>(null);
  const [managingLinksLog, setManagingLinksLog] = useState<IGlobalEntityLog | null>(null);
  const [tempLinks, setTempLinks] = useState<IEntityLogLink[]>([]);
  const [createLinks, setCreateLinks] = useState<IEntityLogLink[]>([]); // Links for new log during creation
  const [tempLogId, setTempLogId] = useState<string>(""); // Temporary log ID for creation
  const [activeId, setActiveId] = useState<string | null>(null);
  const [scrollContainer, setScrollContainer] = useState<HTMLDivElement | null>(null);
  const [needsScroll, setNeedsScroll] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<ImportanceLevel[]>([
    "hook",
    "lore",
    "foreshadowing",
  ]);

  // Load logs when modal opens
  useEffect(() => {
    if (open && bookId) {
      fetchGlobalEntityLogs(false, bookId);
    }
  }, [open, bookId, fetchGlobalEntityLogs]);

  // Check if scroll is needed
  useEffect(() => {
    if (scrollContainer) {
      const checkScroll = () => {
        const hasScroll = scrollContainer.scrollHeight > scrollContainer.clientHeight;
        setNeedsScroll(hasScroll);
      };

      checkScroll();
      // Recheck after a small delay to account for rendering
      const timer = setTimeout(checkScroll, 100);
      return () => clearTimeout(timer);
    }
  }, [scrollContainer, logs]);

  // Filter logs by selected types
  const filteredLogs = logs.filter((log) =>
    selectedTypes.includes(log.importance)
  );

  // Toggle type filter
  const toggleType = (type: ImportanceLevel) => {
    setSelectedTypes((prev) => {
      if (prev.includes(type)) {
        // Don't allow deselecting all types
        if (prev.length === 1) return prev;
        return prev.filter((t) => t !== type);
      } else {
        return [...prev, type];
      }
    });
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

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    setActiveId(null);

    if (over && active.id !== over.id) {
      const oldIndex = logs.findIndex((log) => log.id === active.id);
      const newIndex = logs.findIndex((log) => log.id === over.id);

      const reorderedLogs = arrayMove(logs, oldIndex, newIndex);
      reorderGlobalEntityLogsInCache(reorderedLogs);
    }
  };

  const handleDragCancel = () => {
    setActiveId(null);
  };

  const handleCreateNew = () => {
    setEditingLog(null);
    setCreateLinks([]); // Reset links for new log
    // Generate temporary ID for new log (used for links)
    const newTempId = `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    setTempLogId(newTempId);
    setIsCreateEditModalOpen(true);
  };

  const handleEdit = (log: IGlobalEntityLog) => {
    setEditingLog(log);
    setIsCreateEditModalOpen(true);
  };

  const handleSaveLog = async (logData: Partial<IGlobalEntityLog>) => {
    try {
      if (editingLog) {
        // Update existing log (links are managed separately via the Links button)
        await updateGlobalEntityLogInCache(editingLog.id, logData);
      } else {
        // Create new log with links from creation modal (use tempLogId generated earlier)
        const newLog: IGlobalEntityLog = {
          id: tempLogId,
          bookId,
          ...logData,
          orderIndex: logs.length,
          links: createLinks,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        } as IGlobalEntityLog;

        await addGlobalEntityLog(newLog);
        setCreateLinks([]); // Reset after creating
        setTempLogId(""); // Reset temp ID
      }

      setIsCreateEditModalOpen(false);
      setEditingLog(null);
    } catch (error) {
      console.error("[GlobalEntityLogsModal] Error saving log:", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteGlobalEntityLogFromCache(id);
    } catch (error) {
      console.error("[GlobalEntityLogsModal] Error deleting log:", error);
    }
  };

  const handleManageLinks = (log: IGlobalEntityLog) => {
    setManagingLinksLog(log);
    setTempLinks(log.links);
  };

  const handleLinksChange = (links: IEntityLogLink[]) => {
    setTempLinks(links);
  };

  const handleSaveLinks = async () => {
    if (!managingLinksLog) return;

    try {
      await updateEntityLogLinksInCache(managingLinksLog.id, tempLinks);
      setManagingLinksLog(null);
      setTempLinks([]);
    } catch (error) {
      console.error("[GlobalEntityLogsModal] Error updating links:", error);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="w-[95vw] sm:w-[90vw] md:w-[85vw] lg:w-[1200px] h-[85vh] max-w-none flex flex-col gap-0">
          <DialogHeader className="mb-4">
            <DialogTitle className="flex items-center gap-2">
              <ScrollText className="h-5 w-5" />
              {t("page.title")}
            </DialogTitle>
            <DialogDescription>{t("page.description")}</DialogDescription>
          </DialogHeader>

          {/* Type Filters */}
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            {Object.entries(IMPORTANCE_CONFIG).map(([type, config]) => {
              const Icon = config.icon;
              const isSelected = selectedTypes.includes(type as ImportanceLevel);

              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => toggleType(type as ImportanceLevel)}
                  className={cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-full border-2 transition-all text-sm font-medium",
                    isSelected
                      ? `${config.color} border-current bg-current/10`
                      : "text-muted-foreground border-muted-foreground/30 hover:border-muted-foreground/50"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{config.label}</span>
                </button>
              );
            })}
          </div>

          <div
            ref={setScrollContainer}
            className={cn(
              "flex-1 min-h-0 overflow-x-hidden pr-2 mb-0",
              needsScroll ? "overflow-y-auto" : "overflow-y-hidden"
            )}
          >
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">{t("page.loading")}</p>
              </div>
            ) : filteredLogs.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full gap-4">
                <ScrollText className="h-12 w-12 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground text-center">
                  {logs.length === 0
                    ? t("page.empty_state")
                    : t("page.empty_state_filtered")}
                  <br />
                  {logs.length === 0 && t("page.empty_state_description")}
                </p>
              </div>
            ) : (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                onDragCancel={handleDragCancel}
                autoScroll={false}
              >
                <SortableContext
                  items={filteredLogs.map((log) => log.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-1 pb-4">
                    {filteredLogs.map((log) => (
                      <SortableLogItem
                        key={log.id}
                        log={log}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onManageLinks={handleManageLinks}
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
              {t("page.create_button")}
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
        showLinkManagement={!editingLog}
        links={createLinks}
        onLinksChange={setCreateLinks}
        bookId={bookId}
        logId={editingLog ? editingLog.id : tempLogId}
      />

      {/* Manage Links Modal */}
      {managingLinksLog && (
        <ManageEntityLogLinksModal
          open={!!managingLinksLog}
          onOpenChange={async (open) => {
            if (!open) {
              // Save links before closing
              await handleSaveLinks();
            }
          }}
          links={tempLinks}
          onLinksChange={handleLinksChange}
          bookId={bookId}
          logId={managingLinksLog.id}
        />
      )}
    </>
  );
}

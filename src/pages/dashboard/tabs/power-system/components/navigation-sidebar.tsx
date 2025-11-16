import React, { useState, useEffect, useRef } from "react";

import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
  DragOverEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion } from "framer-motion";
import {
  ChevronDown,
  ChevronRight,
  File,
  Folder,
  FolderPlus,
  MoreVertical,
  PanelLeftOpen,
  Plus,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { usePowerSystemUIStore } from "@/stores/power-system-ui-store";

import type { IPowerGroup, IPowerPage } from "../types/power-system-types";

interface NavigationSidebarProps {
  systemId: string;
  isOpen: boolean;
  onToggle: () => void;
  groups: IPowerGroup[];
  pages: IPowerPage[];
  currentPageId?: string;
  isEditMode: boolean;
  onPageSelect: (pageId: string) => void;
  onCreateGroup: () => void;
  onCreatePage: (groupId?: string) => void;
  onEditGroup: (groupId: string, newName: string) => void;
  onDeleteGroup: (groupId: string) => void;
  onEditPage: (pageId: string, newName: string) => void;
  onDeletePage: (pageId: string) => void;
  onDuplicatePage: (pageId: string) => void;
  // New drag & drop handlers
  onMovePage?: (pageId: string, newGroupId?: string) => void;
  onReorderPages?: (pageIds: string[], groupId?: string) => void;
  onReorderGroups?: (groupIds: string[]) => void;
  // Selection tracking for keyboard shortcuts
  onItemSelect?: (itemId: string, itemType: "page" | "group") => void;
}

// Types for drag items
type DragItemType = "page" | "group";

interface DragItem {
  id: string;
  type: DragItemType;
  groupId?: string; // For pages: current group they belong to
}

export function NavigationSidebar({
  systemId,
  isOpen,
  onToggle,
  groups,
  pages,
  currentPageId,
  isEditMode,
  onPageSelect,
  onCreateGroup,
  onCreatePage,
  onEditGroup,
  onDeleteGroup,
  onEditPage,
  onDeletePage,
  onDuplicatePage,
  onMovePage,
  onReorderPages,
  onReorderGroups,
  onItemSelect,
}: NavigationSidebarProps) {
  const { t } = useTranslation("power-system");

  // UI Store for persisting expanded groups
  const {
    getExpandedGroups,
    setExpandedGroups: saveExpandedGroups,
    toggleGroup: toggleGroupInStore,
  } = usePowerSystemUIStore();

  // Initialize expanded groups from store
  const [expandedGroups, setExpandedGroupsLocal] = useState<Set<string>>(() =>
    getExpandedGroups(systemId)
  );
  const [activeItem, setActiveItem] = useState<DragItem | null>(null);
  const [overId, setOverId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px movement required before drag starts
      },
    })
  );

  // Sync expanded groups with store when systemId changes
  useEffect(() => {
    const savedExpandedGroups = getExpandedGroups(systemId);
    setExpandedGroupsLocal(savedExpandedGroups);
  }, [systemId, getExpandedGroups]);

  const toggleGroup = (groupId: string) => {
    setExpandedGroupsLocal((prev) => {
      const next = new Set(prev);
      if (next.has(groupId)) {
        next.delete(groupId);
      } else {
        next.add(groupId);
      }
      // Save to store
      saveExpandedGroups(systemId, next);
      return next;
    });
  };

  // Separate pages by group
  const standalonePages = pages.filter((page) => !page.groupId);
  const sortedGroups = [...groups].sort((a, b) => a.orderIndex - b.orderIndex);

  const hasPagesOrGroups = pages.length > 0 || groups.length > 0;

  // Drag handlers
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const data = active.data.current as DragItem;
    setActiveItem(data);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { over } = event;
    setOverId(over?.id as string | null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveItem(null);
    setOverId(null);

    if (!over || active.id === over.id) return;

    const activeData = active.data.current as DragItem;
    const overData = over.data.current as DragItem;

    // Case 1: Dragging a page
    if (activeData.type === "page") {
      const draggedPage = pages.find((p) => p.id === active.id);
      if (!draggedPage) return;

      // Case 1.1: Dropping page on a group (move page to group)
      if (overData.type === "group") {
        const targetGroupId = over.id as string;
        if (draggedPage.groupId !== targetGroupId && onMovePage) {
          onMovePage(draggedPage.id, targetGroupId);
          // Auto-expand the group when a page is dropped into it
          setExpandedGroupsLocal((prev) => {
            const next = new Set(prev).add(targetGroupId);
            saveExpandedGroups(systemId, next);
            return next;
          });
        }
        return;
      }

      // Case 1.2: Dropping page on another page (reorder)
      if (overData.type === "page") {
        const targetPage = pages.find((p) => p.id === over.id);
        if (!targetPage) return;

        // Check if both pages are in the same context (same group or both standalone)
        const sameContext =
          draggedPage.groupId === targetPage.groupId ||
          (!draggedPage.groupId && !targetPage.groupId);

        if (sameContext && onReorderPages) {
          // Get all pages in the same context
          const contextPages = pages
            .filter((p) => p.groupId === draggedPage.groupId)
            .sort((a, b) => a.orderIndex - b.orderIndex);

          const oldIndex = contextPages.findIndex((p) => p.id === active.id);
          const newIndex = contextPages.findIndex((p) => p.id === over.id);

          if (oldIndex !== newIndex) {
            const reorderedPages = [...contextPages];
            const [movedPage] = reorderedPages.splice(oldIndex, 1);
            reorderedPages.splice(newIndex, 0, movedPage);

            onReorderPages(
              reorderedPages.map((p) => p.id),
              draggedPage.groupId
            );
          }
        } else if (!sameContext && onMovePage && onReorderPages) {
          // Different contexts: move page to target's group and reorder
          const targetGroupId = targetPage.groupId;

          // First move the page
          onMovePage(draggedPage.id, targetGroupId);

          // Then reorder within the new group
          const targetContextPages = pages
            .filter((p) => p.groupId === targetGroupId)
            .sort((a, b) => a.orderIndex - b.orderIndex);

          const newIndex = targetContextPages.findIndex(
            (p) => p.id === over.id
          );
          const updatedPages = [...targetContextPages];

          // Insert the moved page at the new position
          updatedPages.splice(newIndex, 0, draggedPage);

          onReorderPages(
            updatedPages.map((p) => p.id),
            targetGroupId
          );

          // Auto-expand the group if the page was moved into one
          if (targetGroupId) {
            setExpandedGroupsLocal((prev) => {
              const next = new Set(prev).add(targetGroupId);
              saveExpandedGroups(systemId, next);
              return next;
            });
          }
        }
        return;
      }

      // Case 1.3: Dropping page on "standalone" area (remove from group)
      if (over.id === "standalone-area" && draggedPage.groupId && onMovePage) {
        onMovePage(draggedPage.id, undefined);
        return;
      }
    }

    // Case 2: Dragging a group (reorder groups)
    if (activeData.type === "group" && overData.type === "group") {
      if (onReorderGroups) {
        const oldIndex = sortedGroups.findIndex((g) => g.id === active.id);
        const newIndex = sortedGroups.findIndex((g) => g.id === over.id);

        if (oldIndex !== newIndex) {
          const reorderedGroups = [...sortedGroups];
          const [movedGroup] = reorderedGroups.splice(oldIndex, 1);
          reorderedGroups.splice(newIndex, 0, movedGroup);

          onReorderGroups(reorderedGroups.map((g) => g.id));
        }
      }
    }
  };

  const handleDragCancel = () => {
    setActiveItem(null);
    setOverId(null);
  };

  // Create sortable IDs for context
  const groupIds = sortedGroups.map((g) => g.id);
  const standalonePageIds = standalonePages.map((p) => p.id);

  return (
    <motion.div
      className="h-full border-r bg-card flex-shrink-0 overflow-hidden"
      initial={false}
      animate={{
        width: isOpen ? 320 : 56,
      }}
      transition={{
        duration: 0.3,
        ease: "easeInOut",
      }}
    >
      {/* Header with Menu Title and Action Buttons */}
      <div className="flex h-12 items-center px-3 overflow-hidden">
        <motion.span
          animate={{
            opacity: isOpen ? 1 : 0,
          }}
          transition={{ duration: 0.2, delay: isOpen ? 0.1 : 0 }}
          className="text-sm font-medium whitespace-nowrap"
          style={{
            pointerEvents: isOpen ? "auto" : "none",
          }}
        >
          {t("navigation.menu")}
        </motion.span>

        <div className="ml-auto relative">
          <motion.div
            animate={{
              opacity: isOpen && isEditMode ? 1 : 0,
            }}
            transition={{ duration: 0.2, delay: isOpen ? 0.1 : 0 }}
            className="flex gap-1"
            style={{
              pointerEvents: isOpen && isEditMode ? "auto" : "none",
            }}
          >
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onCreateGroup}
                  className="h-6 w-6 cursor-pointer"
                >
                  <FolderPlus className="h-3.5 w-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-sm font-medium">
                  {t("navigation.create_group")}
                </p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onCreatePage()}
                  className="h-6 w-6 cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-sm font-medium">
                  {t("navigation.create_page")}
                </p>
              </TooltipContent>
            </Tooltip>
          </motion.div>

          <motion.div
            animate={{
              opacity: !isOpen ? 1 : 0,
            }}
            transition={{ duration: 0.2 }}
            className="absolute top-0 right-0"
            style={{
              pointerEvents: !isOpen ? "auto" : "none",
            }}
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggle}
              className="h-8 w-8 cursor-pointer"
            >
              <PanelLeftOpen className="h-4 w-4" />
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <motion.div
        animate={{
          opacity: isOpen ? 1 : 0,
        }}
        transition={{ duration: 0.2, delay: isOpen ? 0.1 : 0 }}
        className="flex h-[calc(100%-3rem)] flex-col"
        style={{
          pointerEvents: isOpen ? "auto" : "none",
        }}
      >
        {/* Navigation Tree */}
        <ScrollArea className="flex-1">
          <div className="p-2">
            {!hasPagesOrGroups ? (
              <div className="flex h-32 items-center justify-center">
                <p className="text-center text-sm text-muted-foreground">
                  {t("navigation.empty_pages")}
                </p>
              </div>
            ) : (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
                onDragCancel={handleDragCancel}
              >
                <div className="space-y-1">
                  {/* Standalone Pages Section */}
                  {standalonePages.length > 0 && (
                    <SortableContext
                      items={standalonePageIds}
                      strategy={verticalListSortingStrategy}
                      id="standalone-area"
                    >
                      <div
                        className={cn(
                          "space-y-1 rounded-md transition-colors",
                          overId === "standalone-area" &&
                            activeItem?.type === "page" &&
                            activeItem.groupId &&
                            "bg-primary/10 ring-2 ring-primary/20"
                        )}
                      >
                        {standalonePages.map((page) => (
                          <SortablePageItem
                            key={page.id}
                            page={page}
                            isActive={page.id === currentPageId}
                            isEditMode={isEditMode}
                            isDragging={activeItem?.id === page.id}
                            isOver={overId === page.id}
                            onSelect={(pageId) => {
                              onPageSelect(pageId);
                              onItemSelect?.(pageId, "page");
                            }}
                            onEdit={onEditPage}
                            onDelete={onDeletePage}
                            onDuplicate={onDuplicatePage}
                          />
                        ))}
                      </div>
                    </SortableContext>
                  )}

                  {/* Groups with Pages */}
                  <SortableContext
                    items={groupIds}
                    strategy={verticalListSortingStrategy}
                  >
                    {sortedGroups.map((group) => {
                      const groupPages = pages
                        .filter((page) => page.groupId === group.id)
                        .sort((a, b) => a.orderIndex - b.orderIndex);
                      const isExpanded = expandedGroups.has(group.id);

                      return (
                        <div key={group.id} className="space-y-1">
                          <SortableGroupItem
                            group={group}
                            isExpanded={isExpanded}
                            isEditMode={isEditMode}
                            isDragging={activeItem?.id === group.id}
                            isOver={overId === group.id}
                            onToggle={() => toggleGroup(group.id)}
                            onEdit={onEditGroup}
                            onDelete={onDeleteGroup}
                            onCreatePage={() => onCreatePage(group.id)}
                            onSelect={() => onItemSelect?.(group.id, "group")}
                          />
                          {isExpanded && (
                            <SortableContext
                              items={groupPages.map((p) => p.id)}
                              strategy={verticalListSortingStrategy}
                            >
                              <div className="ml-10 space-y-1">
                                {groupPages.map((page) => (
                                  <SortablePageItem
                                    key={page.id}
                                    page={page}
                                    isActive={page.id === currentPageId}
                                    isEditMode={isEditMode}
                                    isDragging={activeItem?.id === page.id}
                                    isOver={overId === page.id}
                                    onSelect={(pageId) => {
                                      onPageSelect(pageId);
                                      onItemSelect?.(pageId, "page");
                                    }}
                                    onEdit={onEditPage}
                                    onDelete={onDeletePage}
                                    onDuplicate={onDuplicatePage}
                                  />
                                ))}
                              </div>
                            </SortableContext>
                          )}
                        </div>
                      );
                    })}
                  </SortableContext>
                </div>

                {/* Drag Overlay */}
                <DragOverlay dropAnimation={null}>
                  {activeItem ? (
                    <div className="opacity-50">
                      {activeItem.type === "page" ? (
                        <PageItem
                          page={pages.find((p) => p.id === activeItem.id)!}
                          isActive={false}
                          isEditMode={false}
                          onSelect={() => {}}
                          onEdit={() => {}}
                          onDelete={() => {}}
                        />
                      ) : (
                        <GroupItem
                          group={groups.find((g) => g.id === activeItem.id)!}
                          isExpanded={false}
                          isEditMode={false}
                          onToggle={() => {}}
                          onEdit={() => {}}
                          onDelete={() => {}}
                          onCreatePage={() => {}}
                        />
                      )}
                    </div>
                  ) : null}
                </DragOverlay>
              </DndContext>
            )}
          </div>
        </ScrollArea>
      </motion.div>
    </motion.div>
  );
}

// Sortable Group Item Component
interface SortableGroupItemProps {
  group: IPowerGroup;
  isExpanded: boolean;
  isEditMode: boolean;
  isDragging: boolean;
  isOver: boolean;
  onToggle: () => void;
  onEdit: (groupId: string, newName: string) => void;
  onDelete: (groupId: string) => void;
  onCreatePage: () => void;
  onSelect?: () => void;
}

function SortableGroupItem({
  group,
  isExpanded,
  isEditMode,
  isDragging,
  isOver,
  onToggle,
  onEdit,
  onDelete,
  onCreatePage,
  onSelect,
}: SortableGroupItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({
    id: group.id,
    data: {
      type: "group",
      id: group.id,
    } as DragItem,
    disabled: !isEditMode,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "transition-opacity",
        (isDragging || isSortableDragging) && "opacity-50"
      )}
    >
      <GroupItem
        group={group}
        isExpanded={isExpanded}
        isEditMode={isEditMode}
        onToggle={onToggle}
        onEdit={onEdit}
        onDelete={onDelete}
        onCreatePage={onCreatePage}
        onSelect={onSelect}
        dragHandleProps={
          isEditMode ? { ...attributes, ...listeners } : undefined
        }
        isOver={isOver}
      />
    </div>
  );
}

// Group Item Component
interface GroupItemProps {
  group: IPowerGroup;
  isExpanded: boolean;
  isEditMode: boolean;
  onToggle: () => void;
  onEdit: (groupId: string, newName: string) => void;
  onDelete: (groupId: string) => void;
  onCreatePage: () => void;
  onSelect?: () => void;
  dragHandleProps?: any;
  isOver?: boolean;
}

function GroupItem({
  group,
  isExpanded,
  isEditMode,
  onToggle,
  onEdit,
  onDelete,
  onCreatePage,
  onSelect,
  dragHandleProps,
  isOver,
}: GroupItemProps) {
  const { t } = useTranslation("power-system");
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(group.name);
  const [isTruncated, setIsTruncated] = useState(false);
  const textRef = useRef<HTMLSpanElement>(null);

  // Listen for rename/delete events
  useEffect(() => {
    const handleRenameEvent = (e: Event) => {
      const { detail } = e as CustomEvent;
      if (detail.id === group.id && detail.type === "group") {
        setIsEditing(true);
      }
    };

    const handleDeleteEvent = (e: Event) => {
      const { detail } = e as CustomEvent;
      if (detail.id === group.id && detail.type === "group") {
        onDelete(group.id);
      }
    };

    window.addEventListener("power-system:rename-item", handleRenameEvent);
    window.addEventListener("power-system:delete-item", handleDeleteEvent);

    return () => {
      window.removeEventListener("power-system:rename-item", handleRenameEvent);
      window.removeEventListener("power-system:delete-item", handleDeleteEvent);
    };
  }, [group.id, onDelete]);

  // Check if text is truncated
  useEffect(() => {
    if (textRef.current) {
      setIsTruncated(textRef.current.scrollWidth > textRef.current.clientWidth);
    }
  }, [group.name, isEditMode]);

  const handleEditSubmit = () => {
    if (editValue.trim() && editValue !== group.name) {
      onEdit(group.id, editValue);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleEditSubmit();
    } else if (e.key === "Escape") {
      setEditValue(group.name);
      setIsEditing(false);
    }
  };

  return (
    <div
      className={cn(
        "group flex items-center gap-1 rounded-md transition-colors min-h-[32px]",
        !isEditing && "hover:bg-white/5 cursor-pointer",
        isOver && "bg-primary/10 ring-2 ring-primary/30"
      )}
      {...(dragHandleProps && !isEditing ? dragHandleProps : {})}
      onClick={
        !isEditing
          ? () => {
              onToggle();
              onSelect?.();
            }
          : undefined
      }
    >
      {isEditing ? (
        <div className="flex items-center gap-2 px-2 w-full">
          {isExpanded ? (
            <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
          ) : (
            <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
          )}
          <Folder className="h-4 w-4 text-muted-foreground shrink-0" />
          <Input
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={handleEditSubmit}
            onKeyDown={handleKeyDown}
            style={{
              maxWidth: "calc(320px - 56px)",
            }}
            className="h-7 text-sm border-0 shadow-none px-2 focus-visible:ring-0 rounded-sm hover:bg-transparent"
            autoFocus
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      ) : (
        <>
          <div className="flex items-center gap-2 px-2 flex-1 min-w-0">
            {isTruncated ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    className="flex items-center gap-2 min-w-0 flex-1"
                    style={{
                      maxWidth: isEditMode
                        ? "calc(320px - 76px)"
                        : "calc(320px - 52px)",
                    }}
                  >
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                    )}
                    <Folder className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span
                      ref={textRef}
                      className="truncate text-sm text-foreground"
                    >
                      {group.name}
                    </span>
                  </div>
                </TooltipTrigger>
                <TooltipContent
                  side="bottom"
                  align="start"
                  sideOffset={8}
                  alignOffset={80}
                >
                  <p className="text-sm">{group.name}</p>
                </TooltipContent>
              </Tooltip>
            ) : (
              <div
                className="flex items-center gap-2 min-w-0 flex-1"
                style={{
                  maxWidth: isEditMode
                    ? "calc(320px - 76px)"
                    : "calc(320px - 52px)",
                }}
              >
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                )}
                <Folder className="h-4 w-4 text-muted-foreground shrink-0" />
                <span
                  ref={textRef}
                  className="truncate text-sm text-foreground"
                >
                  {group.name}
                </span>
              </div>
            )}
          </div>

          {isEditMode && (
            <div className="flex items-center shrink-0">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => e.stopPropagation()}
                    className="h-7 w-7 cursor-pointer"
                  >
                    <MoreVertical className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onCreatePage()}>
                    {t("groups.add_page")}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setIsEditing(true)}>
                    {t("groups.edit")}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onDelete(group.id)}
                    className="text-destructive"
                  >
                    {t("groups.delete")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// Sortable Page Item Component
interface SortablePageItemProps {
  page: IPowerPage;
  isActive: boolean;
  isEditMode: boolean;
  isDragging: boolean;
  isOver: boolean;
  onSelect: (pageId: string) => void;
  onEdit: (pageId: string, newName: string) => void;
  onDelete: (pageId: string) => void;
  onDuplicate: (pageId: string) => void;
}

function SortablePageItem({
  page,
  isActive,
  isEditMode,
  isDragging,
  isOver,
  onSelect,
  onEdit,
  onDelete,
  onDuplicate,
}: SortablePageItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({
    id: page.id,
    data: {
      type: "page",
      id: page.id,
      groupId: page.groupId,
    } as DragItem,
    disabled: !isEditMode,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "transition-opacity",
        (isDragging || isSortableDragging) && "opacity-50"
      )}
    >
      <PageItem
        page={page}
        isActive={isActive}
        isEditMode={isEditMode}
        onSelect={onSelect}
        onEdit={onEdit}
        onDelete={onDelete}
        onDuplicate={onDuplicate}
        dragHandleProps={
          isEditMode ? { ...attributes, ...listeners } : undefined
        }
        isOver={isOver}
        isInGroup={!!page.groupId}
      />
    </div>
  );
}

// Page Item Component
interface PageItemProps {
  page: IPowerPage;
  isActive: boolean;
  isEditMode: boolean;
  onSelect: (pageId: string) => void;
  onEdit: (pageId: string, newName: string) => void;
  onDelete: (pageId: string) => void;
  onDuplicate: (pageId: string) => void;
  dragHandleProps?: any;
  isOver?: boolean;
  isInGroup?: boolean;
}

function PageItem({
  page,
  isActive,
  isEditMode,
  onSelect,
  onEdit,
  onDelete,
  onDuplicate,
  dragHandleProps,
  isOver,
  isInGroup = false,
}: PageItemProps) {
  const { t } = useTranslation("power-system");
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(page.name);
  const [isTruncated, setIsTruncated] = useState(false);
  const textRef = useRef<HTMLSpanElement>(null);

  // Listen for rename/delete events
  useEffect(() => {
    const handleRenameEvent = (e: Event) => {
      const { detail } = e as CustomEvent;
      if (detail.id === page.id && detail.type === "page") {
        setIsEditing(true);
      }
    };

    const handleDeleteEvent = (e: Event) => {
      const { detail } = e as CustomEvent;
      if (detail.id === page.id && detail.type === "page") {
        onDelete(page.id);
      }
    };

    window.addEventListener("power-system:rename-item", handleRenameEvent);
    window.addEventListener("power-system:delete-item", handleDeleteEvent);

    return () => {
      window.removeEventListener("power-system:rename-item", handleRenameEvent);
      window.removeEventListener("power-system:delete-item", handleDeleteEvent);
    };
  }, [page.id, onDelete]);

  // Check if text is truncated
  useEffect(() => {
    if (textRef.current) {
      setIsTruncated(textRef.current.scrollWidth > textRef.current.clientWidth);
    }
  }, [page.name, isEditMode]);

  const handleEditSubmit = () => {
    if (editValue.trim() && editValue !== page.name) {
      onEdit(page.id, editValue);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleEditSubmit();
    } else if (e.key === "Escape") {
      setEditValue(page.name);
      setIsEditing(false);
    }
  };

  // Calculate max-width based on context
  // Base: 320px (menu width)
  // Subtract: padding + icon + gaps
  // If in group: subtract 40px (ml-10)
  // Reserve space for button: 24px in edit mode (original), 0px in view mode
  const baseSubtraction = 40; // padding + icon + gaps
  const groupSubtraction = isInGroup ? 40 : 0;
  const buttonSpaceSubtraction = isEditMode ? 24 : 0; // original value in edit, no space in view
  const totalSubtraction =
    baseSubtraction + groupSubtraction + buttonSpaceSubtraction;
  const maxWidth = `calc(320px - ${totalSubtraction}px)`;

  return (
    <div
      className={cn(
        "group flex items-center gap-1 rounded-md transition-colors min-h-[32px]",
        isActive ? "bg-black/60" : !isEditing && "hover:bg-white/5",
        !isEditing && "cursor-pointer",
        isOver && "bg-primary/10 ring-2 ring-primary/30"
      )}
      {...(dragHandleProps && !isEditing ? dragHandleProps : {})}
      onClick={!isEditing ? () => onSelect(page.id) : undefined}
    >
      {isEditing ? (
        <div className="flex items-center gap-2 px-2 w-full">
          <File className="h-4 w-4 text-muted-foreground shrink-0" />
          <Input
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={handleEditSubmit}
            onKeyDown={handleKeyDown}
            style={{ maxWidth }}
            className="h-7 text-sm border-0 shadow-none px-2 focus-visible:ring-0 rounded-sm hover:bg-transparent"
            autoFocus
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      ) : (
        <>
          <div className="flex items-center gap-2 px-2 flex-1 min-w-0">
            {isTruncated ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    className={cn(
                      "flex items-center gap-2 min-w-0",
                      isActive && "font-medium"
                    )}
                    style={{ maxWidth }}
                  >
                    <File className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span
                      ref={textRef}
                      className="truncate text-sm text-foreground"
                    >
                      {page.name}
                    </span>
                  </div>
                </TooltipTrigger>
                <TooltipContent
                  side="bottom"
                  align="start"
                  sideOffset={8}
                  alignOffset={200}
                >
                  <p className="text-sm">{page.name}</p>
                </TooltipContent>
              </Tooltip>
            ) : (
              <div
                className={cn(
                  "flex items-center gap-2 min-w-0",
                  isActive && "font-medium"
                )}
                style={{ maxWidth }}
              >
                <File className="h-4 w-4 text-muted-foreground shrink-0" />
                <span
                  ref={textRef}
                  className="truncate text-sm text-foreground"
                >
                  {page.name}
                </span>
              </div>
            )}
          </div>

          {isEditMode && (
            <div className="flex items-center shrink-0">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => e.stopPropagation()}
                    className="h-7 w-7 cursor-pointer"
                  >
                    <MoreVertical className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setIsEditing(true)}>
                    {t("pages.edit")}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onDuplicate(page.id)}>
                    {t("pages.duplicate")}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onDelete(page.id)}
                    className="text-destructive"
                  >
                    {t("pages.delete")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </>
      )}
    </div>
  );
}

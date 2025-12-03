import { memo, useState, useCallback, useEffect, useMemo, useRef } from "react";

import {
  Users,
  Globe,
  Building2,
  Dna,
  Package,
  X,
  Search,
  Check,
  BookOpen,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getCharactersByBookId } from "@/lib/db/characters.service";
import { getFactionsByBookId } from "@/lib/db/factions.service";
import { getItemsByBookId } from "@/lib/db/items.service";
import { getPlotArcsByBookId } from "@/lib/db/plot.service";
import { getRacesByBookId } from "@/lib/db/races.service";
import { getRegionsByBookId } from "@/lib/db/regions.service";
import { cn } from "@/lib/utils";
import { useBookStore } from "@/stores/book-store";
import type {
  INote,
  INoteLink,
  NoteColor,
  EntityType,
} from "@/types/note-types";

import { DEFAULT_NOTE_COLOR } from "../constants";

import { NoteEditor } from "./note-editor";

import type { JSONContent } from "@tiptap/react";

interface EntityOption {
  id: string;
  name: string;
  entityType: EntityType;
  bookId: string;
  bookName: string;
}

const ENTITY_TABS: {
  type: EntityType;
  icon: typeof Users;
  labelKey: string;
  color: string;
}[] = [
  {
    type: "character",
    icon: Users,
    labelKey: "tabs.characters",
    color: "text-blue-500",
  },
  {
    type: "region",
    icon: Globe,
    labelKey: "tabs.regions",
    color: "text-green-500",
  },
  {
    type: "faction",
    icon: Building2,
    labelKey: "tabs.factions",
    color: "text-purple-500",
  },
  {
    type: "race",
    icon: Dna,
    labelKey: "tabs.races",
    color: "text-orange-500",
  },
  {
    type: "item",
    icon: Package,
    labelKey: "tabs.items",
    color: "text-yellow-500",
  },
  {
    type: "arc",
    icon: BookOpen,
    labelKey: "tabs.arcs",
    color: "text-pink-500",
  },
];

interface NoteDetailModalProps {
  note: INote | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (noteId: string, updates: Partial<INote>) => void;
  onDelete: (noteId: string) => void;
  showManageLinks?: boolean; // Default true - show manage links button
}

function NoteDetailModalComponent({
  note,
  open,
  onOpenChange,
  onUpdate,
  onDelete,
  showManageLinks = true, // Default to true for backwards compatibility
}: NoteDetailModalProps) {
  const { t } = useTranslation("notes");
  const currentBook = useBookStore((state) => state.currentBook);

  const [content, setContent] = useState<JSONContent | undefined>(
    note?.content
  );
  const [color, setColor] = useState<NoteColor>(
    note?.color || DEFAULT_NOTE_COLOR
  );
  const [links, setLinks] = useState<INoteLink[]>(note?.links || []);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showManageLinksModal, setShowManageLinksModal] = useState(false);

  // Link management states
  const [entities, setEntities] = useState<EntityOption[]>([]);
  const [isLoadingEntities, setIsLoadingEntities] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<EntityType>("character");
  const [hasScrollbar, setHasScrollbar] = useState(false);

  // Debounce timer for auto-save
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pendingContentRef = useRef<JSONContent | null>(null);
  const editorRef = useRef<any>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Sync local state when note changes
  useEffect(() => {
    if (note) {
      setContent(note.content);
      setColor(note.color || DEFAULT_NOTE_COLOR);
      setLinks(note.links || []);
      pendingContentRef.current = null;
    }
  }, [note?.id]); // Only depend on note ID to sync when note changes

  // Save pending changes before closing
  const flushPendingChanges = useCallback(async () => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = null;
    }

    if (!note) return;

    // Get the latest content from the editor if available
    let contentToSave: JSONContent | null = null;

    if (editorRef.current) {
      try {
        contentToSave = editorRef.current.getJSON();
      } catch (error) {
        console.error("Error getting content from editor:", error);
      }
    }

    // Fallback to pending content if we couldn't get it from editor
    if (!contentToSave && pendingContentRef.current) {
      contentToSave = pendingContentRef.current;
    }

    // Save if we have content
    if (contentToSave) {
      setContent(contentToSave);
      await onUpdate(note.id, { content: contentToSave });
      pendingContentRef.current = null;
    }
  }, [note, onUpdate]);

  // Handle modal close with save
  const handleClose = useCallback(async () => {
    // Flush any pending changes and wait for completion
    await flushPendingChanges();

    // Close modal after saving
    onOpenChange(false);
  }, [flushPendingChanges, onOpenChange]);

  // Reset state when modal closes
  useEffect(() => {
    if (!open) {
      // Reset all state when modal closes
      setContent(undefined);
      setColor(DEFAULT_NOTE_COLOR);
      setLinks([]);
      setShowDeleteConfirm(false);
      setShowManageLinksModal(false);
      setSearchTerm("");
      setEntities([]);
      editorRef.current = null;
    }
  }, [open]);

  // Reset search when manage links modal closes
  useEffect(() => {
    if (!showManageLinksModal) {
      setSearchTerm("");
    }
  }, [showManageLinksModal]);

  // Fetch entities when manage links modal opens
  useEffect(() => {
    if (!showManageLinksModal || !currentBook) return;

    async function fetchEntities() {
      if (!currentBook) return;

      setIsLoadingEntities(true);
      const allEntities: EntityOption[] = [];

      try {
        const characters = await getCharactersByBookId(currentBook.id);
        characters.forEach((c) => {
          allEntities.push({
            id: c.id,
            name: c.name,
            entityType: "character",
            bookId: currentBook.id,
            bookName: currentBook.title,
          });
        });

        const regions = await getRegionsByBookId(currentBook.id);
        regions.forEach((r) => {
          allEntities.push({
            id: r.id,
            name: r.name,
            entityType: "region",
            bookId: currentBook.id,
            bookName: currentBook.title,
          });
        });

        const factions = await getFactionsByBookId(currentBook.id);
        factions.forEach((f) => {
          allEntities.push({
            id: f.id,
            name: f.name,
            entityType: "faction",
            bookId: currentBook.id,
            bookName: currentBook.title,
          });
        });

        const races = await getRacesByBookId(currentBook.id);
        races.forEach((r) => {
          allEntities.push({
            id: r.id,
            name: r.name,
            entityType: "race",
            bookId: currentBook.id,
            bookName: currentBook.title,
          });
        });

        const items = await getItemsByBookId(currentBook.id);
        items.forEach((i) => {
          allEntities.push({
            id: i.id,
            name: i.name,
            entityType: "item",
            bookId: currentBook.id,
            bookName: currentBook.title,
          });
        });

        const arcs = await getPlotArcsByBookId(currentBook.id);
        arcs.forEach((a) => {
          allEntities.push({
            id: a.id,
            name: a.name,
            entityType: "arc",
            bookId: currentBook.id,
            bookName: currentBook.title,
          });
        });
      } catch (error) {
        console.error(
          `Error fetching entities for book ${currentBook.id}:`,
          error
        );
      }

      setEntities(allEntities);
      setIsLoadingEntities(false);
    }

    fetchEntities();
  }, [showManageLinksModal, currentBook]);

  // Debounced save for content
  const handleContentChange = useCallback(
    (newContent: JSONContent) => {
      if (note) {
        // Store pending content
        pendingContentRef.current = newContent;

        // Clear existing timeout
        if (saveTimeoutRef.current) {
          clearTimeout(saveTimeoutRef.current);
        }

        // Set new timeout to save after 500ms of inactivity
        saveTimeoutRef.current = setTimeout(() => {
          onUpdate(note.id, { content: newContent });
          pendingContentRef.current = null;
        }, 500);
      }
    },
    [note?.id, onUpdate]
  );

  const handleColorChange = useCallback(
    (newColor: NoteColor) => {
      if (note) {
        onUpdate(note.id, { color: newColor });
      }
    },
    [note?.id, onUpdate]
  );

  const handleLinksChange = useCallback(
    (newLinks: INoteLink[]) => {
      setLinks(newLinks);
      if (note) {
        onUpdate(note.id, { links: newLinks });
      }
    },
    [note, onUpdate]
  );

  const handleToggleLink = useCallback(
    (entity: EntityOption) => {
      const isSelected = links.some((l) => l.entityId === entity.id);

      if (isSelected) {
        handleLinksChange(links.filter((l) => l.entityId !== entity.id));
      } else {
        const newLink: INoteLink = {
          id: "",
          entityId: entity.id,
          entityType: entity.entityType,
          bookId: entity.bookId,
          entityName: entity.name,
        };
        handleLinksChange([...links, newLink]);
      }
    },
    [links, handleLinksChange]
  );

  const filteredEntities = useMemo(() => {
    let result = entities.filter((e) => e.entityType === activeTab);

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      result = result.filter((e) => e.name.toLowerCase().includes(term));
    }

    // Sort only alphabetically, don't move selected items to top
    return result.sort((a, b) => a.name.localeCompare(b.name));
  }, [entities, searchTerm, activeTab]);

  // Detect if scrollbar is present
  useEffect(() => {
    const checkScrollbar = () => {
      if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector(
          "[data-radix-scroll-area-viewport]"
        );
        if (viewport) {
          const hasScroll = viewport.scrollHeight > viewport.clientHeight;
          setHasScrollbar(hasScroll);
        }
      }
    };

    // Check on mount and when filtered entities change
    checkScrollbar();

    // Use ResizeObserver to detect changes in content size
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector(
        "[data-radix-scroll-area-viewport]"
      );
      if (viewport) {
        const resizeObserver = new ResizeObserver(checkScrollbar);
        resizeObserver.observe(viewport);
        return () => resizeObserver.disconnect();
      }
    }
  }, [filteredEntities]);

  const entityCounts = useMemo(() => {
    const counts: Record<EntityType, number> = {
      character: 0,
      region: 0,
      faction: 0,
      race: 0,
      item: 0,
      arc: 0,
    };

    entities.forEach((e) => {
      counts[e.entityType]++;
    });

    return counts;
  }, [entities]);

  const selectedCounts = useMemo(() => {
    const counts: Record<EntityType, number> = {
      character: 0,
      region: 0,
      faction: 0,
      race: 0,
      item: 0,
      arc: 0,
    };

    links.forEach((l) => {
      counts[l.entityType]++;
    });

    return counts;
  }, [links]);

  const handleDelete = useCallback(() => {
    if (note) {
      onDelete(note.id);
      setShowDeleteConfirm(false);
      onOpenChange(false);
    }
  }, [note, onDelete, onOpenChange]);

  if (!note) {
    return null;
  }

  return (
    <>
      <Dialog
        key={note.id}
        open={open}
        onOpenChange={async (isOpen) => {
          if (!isOpen) {
            await handleClose();
          } else {
            onOpenChange(isOpen);
          }
        }}
      >
        <DialogContent className="!w-[95vw] !max-w-[900px] !h-[90vh] !max-h-[900px] p-0 gap-0 flex flex-col">
          <DialogHeader className="px-6 py-4 border-b">
            <DialogTitle>{t("detail_modal.title")}</DialogTitle>
          </DialogHeader>

          <div className="flex-1 px-6 py-6 overflow-hidden">
            <NoteEditor
              key={note.id}
              content={note.content}
              onChange={handleContentChange}
              placeholder={t("detail_modal.content_placeholder")}
              onManageLinks={
                showManageLinks
                  ? () => setShowManageLinksModal(true)
                  : undefined
              }
              onDelete={() => setShowDeleteConfirm(true)}
              onEditorReady={(editor) => {
                editorRef.current = editor;
              }}
              linksCount={links.length}
            />
          </div>

          <div className="px-6 py-4 border-t flex justify-end">
            <Button variant="secondary" onClick={handleClose}>
              {t("detail_modal.close_button")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t("detail_modal.delete_confirm_title")}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t("detail_modal.delete_confirm_message")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              {t("detail_modal.delete_confirm_cancel")}
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} variant="destructive">
              {t("detail_modal.delete_confirm_action")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Manage Links Modal */}
      <Dialog
        open={showManageLinksModal}
        onOpenChange={setShowManageLinksModal}
      >
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>{t("create_modal.manage_links")}</DialogTitle>
          </DialogHeader>

          <Tabs
            value={activeTab}
            onValueChange={(v) => setActiveTab(v as EntityType)}
          >
            <TabsList className="w-full h-10 flex items-center justify-start rounded-md bg-transparent p-0">
              {ENTITY_TABS.map((tab, index) => {
                const Icon = tab.icon;
                const total = entityCounts[tab.type];
                const selected = selectedCounts[tab.type];
                const isFirst = index === 0;
                const isLast = index === ENTITY_TABS.length - 1;

                return (
                  <TabsTrigger
                    key={tab.type}
                    value={tab.type}
                    className={cn(
                      "flex items-center gap-2 py-2 px-3 bg-muted flex-1 rounded-none",
                      "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow",
                      isFirst && "rounded-l-md",
                      isLast && "rounded-r-md"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="hidden sm:inline text-xs">
                      {t(tab.labelKey)}
                    </span>
                  </TabsTrigger>
                );
              })}
            </TabsList>

            <div className="relative mt-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t("create_modal.search_entities")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>

            {ENTITY_TABS.map((tab) => (
              <TabsContent key={tab.type} value={tab.type} className="mt-4">
                <div className="border rounded-lg overflow-hidden">
                  <ScrollArea ref={scrollAreaRef} className="h-[280px]">
                    {isLoadingEntities ? (
                      <div className="p-4 text-center text-muted-foreground">
                        {t("create_modal.loading")}
                      </div>
                    ) : filteredEntities.length === 0 ? (
                      <div className="p-4 text-center text-muted-foreground">
                        {searchTerm
                          ? t("create_modal.no_results")
                          : t("create_modal.no_entities_available")}
                      </div>
                    ) : (
                      <div className={cn(hasScrollbar && "pr-2")}>
                        {filteredEntities.map((entity) => {
                          const isSelected = links.some(
                            (l) => l.entityId === entity.id
                          );

                          return (
                            <button
                              key={entity.id}
                              type="button"
                              onClick={() => handleToggleLink(entity)}
                              className={cn(
                                "w-full text-left px-3 py-2 transition-colors duration-200 flex items-center justify-between gap-2",
                                isSelected
                                  ? "bg-primary/10 hover:bg-primary/20"
                                  : "hover:bg-white/5 dark:hover:bg-white/10"
                              )}
                            >
                              <div className="flex-1 min-w-0">
                                <span
                                  className={cn(
                                    "font-medium",
                                    isSelected && "text-primary"
                                  )}
                                >
                                  {entity.name}
                                </span>
                                <span className="ml-2 text-xs text-muted-foreground">
                                  {entity.bookName}
                                </span>
                              </div>
                              <div
                                className={cn(
                                  "h-5 w-5 rounded border flex items-center justify-center shrink-0 transition-colors",
                                  isSelected
                                    ? "bg-primary border-primary text-primary-foreground"
                                    : "border-muted-foreground/30"
                                )}
                              >
                                {isSelected && <Check className="h-3 w-3" />}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </ScrollArea>
                </div>
              </TabsContent>
            ))}
          </Tabs>

          <div className="flex items-center justify-between pt-2 border-t">
            <div className="flex flex-col gap-1">
              <span className="text-sm text-muted-foreground">
                {t("create_modal.selected_count", {
                  count: links.length,
                })}
              </span>
              <span className="text-xs text-muted-foreground">
                {selectedCounts[activeTab]} {t("create_modal.of")}{" "}
                {entityCounts[activeTab]} {t("create_modal.in_tab")}
              </span>
            </div>
            <Button
              variant="secondary"
              onClick={() => setShowManageLinksModal(false)}
            >
              {t("create_modal.done")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export const NoteDetailModal = memo(NoteDetailModalComponent);

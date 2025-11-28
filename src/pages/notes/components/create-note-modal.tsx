import { useState, useCallback, useEffect, useMemo, useRef } from "react";

import type { JSONContent } from "@tiptap/react";
import { useTranslation } from "react-i18next";
import {
  Users,
  Globe,
  Building2,
  Dna,
  Package,
  Search,
  Check,
  Plus,
  BookOpen,
} from "lucide-react";

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
import { getRacesByBookId } from "@/lib/db/races.service";
import { getRegionsByBookId } from "@/lib/db/regions.service";
import { getPlotArcsByBookId } from "@/lib/db/plot.service";
import { cn } from "@/lib/utils";
import { useBookStore } from "@/stores/book-store";
import type { INoteLink, NoteColor, EntityType } from "@/types/note-types";

import { DEFAULT_NOTE_COLOR } from "../constants";

import { NoteEditor } from "./note-editor";

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

interface CreateNoteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateNote: (formData: {
    content: JSONContent;
    color: NoteColor;
    links: INoteLink[];
  }) => void;
}

export function CreateNoteModal({
  open,
  onOpenChange,
  onCreateNote,
}: CreateNoteModalProps) {
  const { t } = useTranslation("notes");
  const currentBook = useBookStore((state) => state.currentBook);

  const [content, setContent] = useState<JSONContent | undefined>(undefined);
  const [color, setColor] = useState<NoteColor>(DEFAULT_NOTE_COLOR);
  const [links, setLinks] = useState<INoteLink[]>([]);
  const [showManageLinks, setShowManageLinks] = useState(false);

  // Link management states
  const [entities, setEntities] = useState<EntityOption[]>([]);
  const [isLoadingEntities, setIsLoadingEntities] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<EntityType>("character");
  const [hasScrollbar, setHasScrollbar] = useState(false);

  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Check if content has any text
  const hasContent = content && content.content && content.content.length > 0;

  // Reset state when modal closes
  useEffect(() => {
    if (!open) {
      setContent(undefined);
      setColor(DEFAULT_NOTE_COLOR);
      setLinks([]);
      setShowManageLinks(false);
      setSearchTerm("");
      setEntities([]);
    }
  }, [open]);

  // Reset search when manage links modal closes
  useEffect(() => {
    if (!showManageLinks) {
      setSearchTerm("");
    }
  }, [showManageLinks]);

  // Fetch entities when manage links modal opens
  useEffect(() => {
    if (!showManageLinks || !currentBook) return;

    async function fetchEntities() {
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
        console.error(`Error fetching entities for book ${currentBook.id}:`, error);
      }

      setEntities(allEntities);
      setIsLoadingEntities(false);
    }

    fetchEntities();
  }, [showManageLinks, currentBook]);

  const handleContentChange = useCallback((newContent: JSONContent) => {
    setContent(newContent);
  }, []);

  const handleColorChange = useCallback((newColor: NoteColor) => {
    setColor(newColor);
  }, []);

  const handleLinksChange = useCallback((newLinks: INoteLink[]) => {
    setLinks(newLinks);
  }, []);

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

  // Detect if scrollbar is present
  useEffect(() => {
    const checkScrollbar = () => {
      if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
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
      const viewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (viewport) {
        const resizeObserver = new ResizeObserver(checkScrollbar);
        resizeObserver.observe(viewport);
        return () => resizeObserver.disconnect();
      }
    }
  }, [filteredEntities]);

  const handleCreate = useCallback(() => {
    if (!hasContent || !content) return;

    onCreateNote({
      content,
      color,
      links,
    });
  }, [content, color, links, hasContent, onCreateNote]);

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="!w-[95vw] !max-w-[900px] !h-[90vh] !max-h-[900px] p-0 gap-0 flex flex-col">
          <DialogHeader className="px-6 py-4 border-b">
            <DialogTitle>{t("create_modal.title")}</DialogTitle>
          </DialogHeader>

          <div className="flex-1 px-6 py-6 overflow-hidden">
            <NoteEditor
              content={content}
              onChange={handleContentChange}
              placeholder={t("create_modal.content_placeholder")}
              onManageLinks={() => setShowManageLinks(true)}
            />
          </div>

          <div className="px-6 py-4 border-t flex justify-end gap-2">
            <Button variant="secondary" onClick={() => onOpenChange(false)}>
              {t("create_modal.cancel")}
            </Button>
            <Button variant="magical" onClick={handleCreate} disabled={!hasContent} className="gap-2">
              <Plus className="h-4 w-4" />
              {t("create_modal.create")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Manage Links Modal */}
      <Dialog open={showManageLinks} onOpenChange={setShowManageLinks}>
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
                          const isSelected = links.some((l) => l.entityId === entity.id);

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
                {selectedCounts[activeTab]} {t("create_modal.of")} {entityCounts[activeTab]} {t("create_modal.in_tab")}
              </span>
            </div>
            <Button variant="secondary" onClick={() => setShowManageLinks(false)}>
              {t("create_modal.done")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

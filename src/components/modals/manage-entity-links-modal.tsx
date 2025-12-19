import { useState, useEffect, useMemo, useRef } from "react";

import {
  Check,
  Search,
  Users,
  Globe,
  Building2,
  Dna,
  Package,
} from "lucide-react";
import { useTranslation } from "react-i18next";

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
import { cn } from "@/lib/utils";
import { useBookStore } from "@/stores/book-store";
import type { EntityType } from "@/types/gallery-types";

interface EntityLink {
  id: string;
  entityId: string;
  entityType: EntityType;
  bookId: string;
  entityName?: string;
  createdAt?: string;
}

interface ManageEntityLinksModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  links: EntityLink[];
  onLinksChange: (links: EntityLink[]) => void;
  bookId?: string; // Optional: filter entities by book
}

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
}[] = [
  { type: "character", icon: Users, labelKey: "tabs.characters" },
  { type: "region", icon: Globe, labelKey: "tabs.regions" },
  { type: "faction", icon: Building2, labelKey: "tabs.factions" },
  { type: "race", icon: Dna, labelKey: "tabs.races" },
  { type: "item", icon: Package, labelKey: "tabs.items" },
];

export function ManageEntityLinksModal({
  open,
  onOpenChange,
  links,
  onLinksChange,
  bookId,
}: ManageEntityLinksModalProps) {
  const { t } = useTranslation("gallery");
  const { books } = useBookStore();

  const [activeTab, setActiveTab] = useState<EntityType>("character");
  const [searchTerm, setSearchTerm] = useState("");
  const [entities, setEntities] = useState<EntityOption[]>([]);
  const [isLoadingEntities, setIsLoadingEntities] = useState(false);
  const [hasScrollbar, setHasScrollbar] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Reset search when modal closes
  useEffect(() => {
    if (!open) {
      setSearchTerm("");
    }
  }, [open]);

  // Fetch entities when modal opens
  useEffect(() => {
    if (!open) return;

    const booksToFetch = bookId ? books.filter((b) => b.id === bookId) : books;

    if (booksToFetch.length === 0) return;

    async function fetchEntities() {
      setIsLoadingEntities(true);
      const allEntities: EntityOption[] = [];

      for (const book of booksToFetch) {
        try {
          // Fetch characters
          const characters = await getCharactersByBookId(book.id);
          characters.forEach((c) => {
            allEntities.push({
              id: c.id,
              name: c.name,
              entityType: "character",
              bookId: book.id,
              bookName: book.title,
            });
          });

          // Fetch regions
          const regions = await getRegionsByBookId(book.id);
          regions.forEach((r) => {
            allEntities.push({
              id: r.id,
              name: r.name,
              entityType: "region",
              bookId: book.id,
              bookName: book.title,
            });
          });

          // Fetch factions
          const factions = await getFactionsByBookId(book.id);
          factions.forEach((f) => {
            allEntities.push({
              id: f.id,
              name: f.name,
              entityType: "faction",
              bookId: book.id,
              bookName: book.title,
            });
          });

          // Fetch races
          const races = await getRacesByBookId(book.id);
          races.forEach((r) => {
            allEntities.push({
              id: r.id,
              name: r.name,
              entityType: "race",
              bookId: book.id,
              bookName: book.title,
            });
          });

          // Fetch items
          const items = await getItemsByBookId(book.id);
          items.forEach((i) => {
            allEntities.push({
              id: i.id,
              name: i.name,
              entityType: "item",
              bookId: book.id,
              bookName: book.title,
            });
          });
        } catch (error) {
          console.error(`Error fetching entities for book ${book.id}:`, error);
        }
      }

      setEntities(allEntities);
      setIsLoadingEntities(false);
    }

    fetchEntities();
  }, [open, books, bookId]);

  // Filter entities by search term and active tab
  const filteredEntities = useMemo(() => {
    let result = entities.filter((e) => e.entityType === activeTab);

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      result = result.filter((e) => e.name.toLowerCase().includes(term));
    }

    // Sort: selected first, then alphabetically
    return result.sort((a, b) => {
      const aSelected = links.some((l) => l.entityId === a.id);
      const bSelected = links.some((l) => l.entityId === b.id);

      if (aSelected && !bSelected) return -1;
      if (!aSelected && bSelected) return 1;
      return a.name.localeCompare(b.name);
    });
  }, [entities, searchTerm, activeTab, links]);

  // Count entities per tab
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

  // Count selected per tab
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

  // Check if ScrollArea has scrollbar
  useEffect(() => {
    const checkScrollbar = () => {
      if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector(
          "[data-radix-scroll-area-viewport]"
        );
        if (viewport) {
          setHasScrollbar(viewport.scrollHeight > viewport.clientHeight);
        }
      }
    };

    checkScrollbar();
    const timeoutId = setTimeout(checkScrollbar, 100);

    return () => clearTimeout(timeoutId);
  }, [filteredEntities, activeTab]);

  const handleToggleLink = (entity: EntityOption) => {
    const isSelected = links.some((l) => l.entityId === entity.id);

    if (isSelected) {
      // Remove
      onLinksChange(links.filter((l) => l.entityId !== entity.id));
    } else {
      // Add
      const newLink: EntityLink = {
        id: crypto.randomUUID(),
        entityId: entity.id,
        entityType: entity.entityType,
        bookId: entity.bookId,
        entityName: entity.name,
        createdAt: new Date().toISOString(),
      };
      onLinksChange([...links, newLink]);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
                              {!bookId && (
                                <span className="ml-2 text-xs text-muted-foreground">
                                  {entity.bookName}
                                </span>
                              )}
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
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            {t("create_modal.done")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

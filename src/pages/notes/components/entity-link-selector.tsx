import { useState, useEffect, useMemo } from "react";

import {
  Users,
  Globe,
  Building2,
  Dna,
  Package,
  X,
  Link,
  Search,
  Check,
} from "lucide-react";
import { useTranslation } from "react-i18next";

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
import { cn } from "@/lib/utils";
import { useBookStore } from "@/stores/book-store";
import { EntityType, INoteLink } from "@/types/note-types";

interface EntityLinkSelectorProps {
  selectedLinks: INoteLink[];
  onLinksChange: (links: INoteLink[]) => void;
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
];

const ENTITY_TYPE_CONFIG: Record<
  EntityType,
  { icon: typeof Users; color: string }
> = {
  character: { icon: Users, color: "text-blue-500" },
  region: { icon: Globe, color: "text-green-500" },
  faction: { icon: Building2, color: "text-purple-500" },
  race: { icon: Dna, color: "text-orange-500" },
  item: { icon: Package, color: "text-yellow-500" },
};

export function EntityLinkSelector({
  selectedLinks,
  onLinksChange,
}: EntityLinkSelectorProps) {
  const { t } = useTranslation("notes");
  const books = useBookStore((state) => state.books);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [entities, setEntities] = useState<EntityOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<EntityType>("character");

  // Fetch all entities from all books
  useEffect(() => {
    async function fetchEntities() {
      if (books.length === 0) return;

      setIsLoading(true);
      const allEntities: EntityOption[] = [];

      for (const book of books) {
        try {
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
      setIsLoading(false);
    }

    fetchEntities();
  }, [books]);

  // Filter entities by search term and active tab
  const filteredEntities = useMemo(() => {
    let result = entities.filter((e) => e.entityType === activeTab);

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      result = result.filter((e) => e.name.toLowerCase().includes(term));
    }

    // Sort: selected first, then alphabetically
    return result.sort((a, b) => {
      const aSelected = selectedLinks.some((l) => l.entityId === a.id);
      const bSelected = selectedLinks.some((l) => l.entityId === b.id);

      if (aSelected && !bSelected) return -1;
      if (!aSelected && bSelected) return 1;
      return a.name.localeCompare(b.name);
    });
  }, [entities, searchTerm, activeTab, selectedLinks]);

  // Count entities per tab
  const entityCounts = useMemo(() => {
    const counts: Record<EntityType, number> = {
      character: 0,
      region: 0,
      faction: 0,
      race: 0,
      item: 0,
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
    };

    selectedLinks.forEach((l) => {
      counts[l.entityType]++;
    });

    return counts;
  }, [selectedLinks]);

  const handleToggleLink = (entity: EntityOption) => {
    const isSelected = selectedLinks.some((l) => l.entityId === entity.id);

    if (isSelected) {
      // Remove
      onLinksChange(selectedLinks.filter((l) => l.entityId !== entity.id));
    } else {
      // Add
      const newLink: INoteLink = {
        id: "",
        entityId: entity.id,
        entityType: entity.entityType,
        bookId: entity.bookId,
        entityName: entity.name,
      };
      onLinksChange([...selectedLinks, newLink]);
    }
  };

  const handleRemoveLink = (entityId: string) => {
    onLinksChange(selectedLinks.filter((l) => l.entityId !== entityId));
  };

  const isEntitySelected = (entityId: string) =>
    selectedLinks.some((l) => l.entityId === entityId);

  const handleOpenModal = () => {
    setSearchTerm("");
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-3">
      {/* Selected Links Preview */}
      {selectedLinks.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedLinks.map((link) => {
            const config = ENTITY_TYPE_CONFIG[link.entityType];
            const Icon = config.icon;

            return (
              <Badge
                key={link.entityId}
                variant="secondary"
                className="flex items-center gap-1 pr-1"
              >
                <Icon className={cn("h-3 w-3", config.color)} />
                <span>{link.entityName || link.entityId}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveLink(link.entityId)}
                  className="ml-1 rounded-full p-0.5 hover:bg-destructive/20"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            );
          })}
        </div>
      )}

      {/* Manage Links Button */}
      <Button
        type="button"
        variant="magical"
        className="w-full justify-center gap-2"
        onClick={handleOpenModal}
      >
        <Link className="h-4 w-4" />
        {t("create_modal.manage_links")}
      </Button>

      {/* Entity Management Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>{t("create_modal.manage_links")}</DialogTitle>
          </DialogHeader>

          <Tabs
            value={activeTab}
            onValueChange={(v) => setActiveTab(v as EntityType)}
          >
            {/* Tabs - Dashboard style */}
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
                    {total > 0 && (
                      <Badge
                        variant={selected > 0 ? "default" : "secondary"}
                        className={cn(
                          "h-5 min-w-5 px-1 text-[10px]",
                          "data-[state=active]:bg-primary-foreground data-[state=active]:text-primary"
                        )}
                      >
                        {selected > 0 ? `${selected}/${total}` : total}
                      </Badge>
                    )}
                  </TabsTrigger>
                );
              })}
            </TabsList>

            {/* Search Input */}
            <div className="relative mt-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t("create_modal.search_entities")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Tab Contents */}
            {ENTITY_TABS.map((tab) => (
              <TabsContent key={tab.type} value={tab.type} className="mt-4">
                <div className="border rounded-lg overflow-hidden">
                  <ScrollArea className="h-[280px]">
                    {isLoading ? (
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
                      <div className="p-2 space-y-1">
                        {filteredEntities.map((entity) => {
                          const isSelected = isEntitySelected(entity.id);

                          return (
                            <button
                              key={entity.id}
                              type="button"
                              onClick={() => handleToggleLink(entity)}
                              className={cn(
                                "w-full text-left px-3 py-2 rounded-md transition-colors flex items-center justify-between gap-2",
                                isSelected
                                  ? "bg-primary/10 hover:bg-primary/20"
                                  : "hover:bg-accent"
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

          {/* Footer with selected count */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-sm text-muted-foreground">
              {t("create_modal.selected_count", {
                count: selectedLinks.length,
              })}
            </span>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              {t("create_modal.done")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
